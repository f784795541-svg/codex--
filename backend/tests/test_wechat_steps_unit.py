import base64
import json

import pytest
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app import dependencies, models, schemas, seed, services
from app.database import Base
from app.main import update_user_info
from app.routers.wechat import (
    CodeRequest,
    RegisterRequest,
    StepsRequest,
    bind,
    decode_steps,
    device_link_status,
    login,
    register,
    sync_steps,
    unbind_current_device,
)


def test_decode_steps_checks_appid(monkeypatch):
    monkeypatch.setenv("WECHAT_APP_ID", "test_appid")
    key = bytes(range(16))
    iv = bytes(range(16, 32))
    data = json.dumps({"watermark": {"appid": "test_appid"}, "stepInfoList": [{"timestamp": 1, "step": 42}]}).encode()
    padder = PKCS7(128).padder()
    padded = padder.update(data) + padder.finalize()
    encryptor = Cipher(algorithms.AES(key), modes.CBC(iv)).encryptor()
    encrypted = base64.b64encode(encryptor.update(padded) + encryptor.finalize()).decode()
    assert decode_steps(encrypted, base64.b64encode(iv).decode(), base64.b64encode(key).decode())[0]["step"] == 42
    monkeypatch.setenv("WECHAT_APP_ID", "different_appid")
    with pytest.raises(HTTPException):
        decode_steps(encrypted, base64.b64encode(iv).decode(), base64.b64encode(key).decode())


def test_wechat_registration_and_binding_conflicts(monkeypatch):
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    monkeypatch.setattr("app.routers.wechat.exchange", lambda code: {"openid": code, "session_key": "fake"})
    with Session(engine) as db:
        payload = RegisterRequest(code="one", name="Test", age=30, gender="male", height_cm=170, weight_kg=70)
        result = register(payload, db)
        user = db.get(models.User, result["user"].id)
        assert not user.has_password
        assert login(CodeRequest(code="one"), db)["user"].id == user.id
        assert db.query(models.WeightLog).filter_by(user_id=user.id).count() == 1
        with pytest.raises(HTTPException) as error:
            register(payload, db)
        assert error.value.status_code == 409
        other = models.User(name="Other", age=30, gender="male", height_cm=170, weight_kg=70)
        db.add(other)
        db.commit()
        with pytest.raises(HTTPException) as error:
            bind(CodeRequest(code="one"), db, other)
        assert error.value.status_code == 409
        assert bind(CodeRequest(code="one"), db, user)["message"] == "微信已绑定"
        with pytest.raises(HTTPException) as error:
            dependencies.resolve_user(db, user.id, None)
        assert error.value.status_code == 401
        with pytest.raises(HTTPException) as error:
            dependencies.resolve_user(db, user.id, other)
        assert error.value.status_code == 403
        monkeypatch.setattr(seed, "engine", engine)
        seed.run_schema_migrations()
        db.refresh(user)
        assert user.username is None
        assert user.password_hash is None
        updated = update_user_info(schemas.UserUpdateRequest(username="wechat_user", new_password="test-password"), db, user)
        assert updated["user"].has_password
        assert services.verify_password("test-password", user.password_hash)
        with pytest.raises(HTTPException) as error:
            update_user_info(schemas.UserUpdateRequest(new_password="new-password"), db, user)
        assert error.value.status_code == 400


def test_sync_updates_same_day_and_report_excludes_manual_walk(monkeypatch):
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    today = services.local_today()
    monkeypatch.setattr("app.routers.wechat.exchange", lambda code: {"openid": "fake-openid", "session_key": "fake"})
    monkeypatch.setattr("app.routers.wechat.decode_steps", lambda *args: [
        {"timestamp": int(__import__("datetime").datetime.now(services.APP_TIMEZONE).timestamp()), "step": 4000},
        {"timestamp": int(__import__("datetime").datetime.now(services.APP_TIMEZONE).timestamp()), "step": 5000},
    ])
    with Session(engine) as db:
        user = models.User(name="Test", age=30, gender="male", height_cm=170, weight_kg=70, goal="fat_loss", activity_level="medium", recommendation_mode="home", target_algorithm="classic")
        db.add(user)
        db.commit()
        payload = StepsRequest(code="fake", encrypted_data="fake", iv="fake", bind=True)
        assert sync_steps(payload, db, user)["synced_days"] == 1
        sync_steps(payload, db, user)
        assert db.query(models.WechatStepLog).count() == 1
        assert login(CodeRequest(code="fake"), db)["user"].id == user.id
        report = services.compute_daily_report(db, user, today)
        assert report.wechat_steps == 5000
        assert report.wechat_step_calories_kcal > 0
        assert report.wechat_steps_excluded
        assert report.total_burned_kcal == 0
        db.add(models.WorkoutLog(user_id=user.id, type="walking", duration_min=10, calories_burned=30, log_date=today))
        db.commit()
        report = services.compute_daily_report(db, user, today)
        assert report.wechat_steps_excluded
        assert report.wechat_step_calories_kcal > 0
        assert report.total_burned_kcal == 30


def test_step_sync_claims_current_account_and_unbind_keeps_account(monkeypatch):
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    monkeypatch.setattr("app.routers.wechat.exchange", lambda code: {"openid": "phone-openid", "session_key": "fake"})
    monkeypatch.setattr("app.routers.wechat.decode_steps", lambda *args: [
        {"timestamp": int(__import__("datetime").datetime.now(services.APP_TIMEZONE).timestamp()), "step": 6000},
    ])
    with Session(engine) as db:
        current_user = models.User(name="轻养用户0145", age=30, gender="male", height_cm=170, weight_kg=70)
        mistaken_user = models.User(name="自动账号", age=30, gender="male", height_cm=170, weight_kg=70)
        db.add_all([current_user, mistaken_user])
        db.commit()
        db.add(models.WechatIdentity(user_id=mistaken_user.id, openid="phone-openid"))
        db.commit()

        payload = StepsRequest(code="fake", encrypted_data="fake", iv="fake", bind=True)
        assert sync_steps(payload, db, current_user)["synced_days"] == 1
        identity = db.query(models.WechatIdentity).filter_by(openid="phone-openid").one()
        assert identity.user_id == current_user.id
        assert db.query(models.WechatStepLog).filter_by(user_id=current_user.id).count() == 1
        assert device_link_status(CodeRequest(code="fake"), db, current_user)["is_linked"]

        unbind_current_device(CodeRequest(code="fake"), db, current_user)
        assert db.get(models.User, current_user.id) is not None
        assert not db.query(models.WechatIdentity).filter_by(openid="phone-openid").first()
