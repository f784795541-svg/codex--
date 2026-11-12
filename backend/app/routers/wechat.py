import base64
import json
import os
import secrets
from datetime import datetime, timedelta
from urllib.parse import urlencode
from urllib.request import urlopen

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.padding import PKCS7
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from .. import dependencies, models, schemas, services
from ..database import get_db

router = APIRouter(prefix="/wechat")


class CodeRequest(BaseModel):
    code: str = Field(min_length=1, max_length=256)


class StepsRequest(CodeRequest):
    encrypted_data: str = Field(min_length=1, max_length=16384)
    iv: str = Field(min_length=1, max_length=128)
    bind: bool = False


class RegisterRequest(schemas.UserCreate):
    code: str = Field(min_length=1, max_length=256)


class DeviceLinkRequest(BaseModel):
    code: str = Field(min_length=8, max_length=8)


def current_user(user=Depends(dependencies.get_optional_current_user)):
    if user is None:
        raise HTTPException(status_code=401, detail="请先登录")
    return user


def remove_expired_device_link_codes(db: Session) -> None:
    db.query(models.DeviceLinkCode).filter(models.DeviceLinkCode.expires_at <= datetime.utcnow()).delete()


def new_device_link_code(db: Session) -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    for _ in range(10):
        code = "".join(secrets.choice(alphabet) for _ in range(8))
        if not db.query(models.DeviceLinkCode).filter_by(code=code).first():
            return code
    raise HTTPException(status_code=503, detail="连接码生成失败，请重试")


@router.post("/login", response_model=None)
def login(payload: CodeRequest, db: Session = Depends(get_db)):
    result = exchange(payload.code)
    identity = db.query(models.WechatIdentity).filter_by(openid=result["openid"]).first()
    if not identity:
        raise HTTPException(status_code=404, detail="微信尚未绑定账号")
    user = db.get(models.User, identity.user_id)
    if not user:
        raise HTTPException(status_code=401, detail="账号不可用")
    from ..schemas import UserResponse
    return {"user": UserResponse.model_validate(user), "access_token": services.create_access_token(user.id)}


@router.post("/session", response_model=None)
def open_session(payload: CodeRequest, db: Session = Depends(get_db)):
    """Open the mini-program's own data session without asking for a username or password."""
    result = exchange(payload.code)
    identity = db.query(models.WechatIdentity).filter_by(openid=result["openid"]).first()
    if identity:
        user = db.get(models.User, identity.user_id)
        if user:
            return {"user": schemas.UserResponse.model_validate(user), "access_token": services.create_access_token(user.id)}

    user = models.User(
        name="轻养用户",
        age=25,
        gender="female",
        height_cm=165,
        weight_kg=60,
        target_weight_kg=55,
        target_sleep_hours=8,
    )
    db.add(user)
    try:
        db.flush()
        user.name = f"轻养用户{user.id:04d}"
        db.add(models.WechatIdentity(user_id=user.id, openid=result["openid"]))
        db.add(models.WeightLog(user_id=user.id, weight_kg=user.weight_kg, record_date=services.local_today()))
        db.commit()
    except IntegrityError:
        db.rollback()
        identity = db.query(models.WechatIdentity).filter_by(openid=result["openid"]).first()
        user = db.get(models.User, identity.user_id) if identity else None
        if not user:
            raise HTTPException(status_code=409, detail="账户初始化失败，请重试") from None
    db.refresh(user)
    return {"user": schemas.UserResponse.model_validate(user), "access_token": services.create_access_token(user.id)}


@router.post("/device-link/code")
def create_device_link_code(db: Session = Depends(get_db), user=Depends(current_user)):
    remove_expired_device_link_codes(db)
    db.query(models.DeviceLinkCode).filter_by(user_id=user.id).delete()
    code = new_device_link_code(db)
    db.add(models.DeviceLinkCode(
        user_id=user.id,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=10),
    ))
    db.commit()
    return {"code": code, "expires_in_seconds": 600}


@router.post("/device-link/connect", response_model=None)
def connect_device(payload: DeviceLinkRequest, db: Session = Depends(get_db), user=Depends(current_user)):
    remove_expired_device_link_codes(db)
    link = db.query(models.DeviceLinkCode).filter_by(code=payload.code.strip().upper()).first()
    if not link:
        db.commit()
        raise HTTPException(status_code=400, detail="连接码无效或已过期")
    if link.user_id == user.id:
        db.delete(link)
        db.commit()
        return {"message": "当前设备已连接", "user": schemas.UserResponse.model_validate(user), "access_token": services.create_access_token(user.id)}

    identity = db.query(models.WechatIdentity).filter_by(user_id=user.id).first()
    target_user = db.get(models.User, link.user_id)
    if not identity or not target_user:
        raise HTTPException(status_code=400, detail="当前设备无法连接，请重新打开小程序后再试")

    identity.user_id = target_user.id
    db.delete(link)
    db.commit()
    db.refresh(target_user)
    return {
        "message": "已连接到另一台设备的数据账户",
        "user": schemas.UserResponse.model_validate(target_user),
        "access_token": services.create_access_token(target_user.id),
    }


@router.post("/device-link/status")
def device_link_status(payload: CodeRequest, db: Session = Depends(get_db), user=Depends(current_user)):
    result = exchange(payload.code)
    identity = db.query(models.WechatIdentity).filter_by(openid=result["openid"], user_id=user.id).first()
    identity_count = db.query(models.WechatIdentity).filter_by(user_id=user.id).count()
    return {"is_linked": bool(identity and identity_count > 1)}


@router.post("/device-link/unbind")
def unbind_current_device(payload: CodeRequest, db: Session = Depends(get_db), user=Depends(current_user)):
    result = exchange(payload.code)
    identity = db.query(models.WechatIdentity).filter_by(openid=result["openid"], user_id=user.id).first()
    identity_count = db.query(models.WechatIdentity).filter_by(user_id=user.id).count()
    if not identity or identity_count < 2:
        raise HTTPException(status_code=400, detail="当前设备没有可解除的连接")
    db.delete(identity)
    db.commit()
    return {"message": "当前设备已解除连接"}


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    result = exchange(payload.code)
    if db.query(models.WechatIdentity).filter_by(openid=result["openid"]).first():
        raise HTTPException(status_code=409, detail="该微信已绑定账号，请直接登录")
    values = payload.model_dump(exclude={"code", "username"})
    values["name"] = values["name"].strip()
    if not values["name"]:
        raise HTTPException(status_code=400, detail="请输入昵称")
    user = models.User(**values)
    db.add(user)
    try:
        db.flush()
        db.add(models.WechatIdentity(user_id=user.id, openid=result["openid"]))
        db.add(models.WeightLog(user_id=user.id, weight_kg=user.weight_kg, record_date=services.local_today()))
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="该微信已绑定账号，请直接登录") from None
    db.refresh(user)
    return {"user": schemas.UserResponse.model_validate(user), "access_token": services.create_access_token(user.id)}


@router.post("/bind")
def bind(payload: CodeRequest, db: Session = Depends(get_db), user=Depends(current_user)):
    result = exchange(payload.code)
    by_openid = db.query(models.WechatIdentity).filter_by(openid=result["openid"]).first()
    if by_openid and by_openid.user_id == user.id:
        return {"message": "微信已绑定"}
    if by_openid:
        raise HTTPException(status_code=409, detail="微信或当前账号已绑定其他账号")
    db.add(models.WechatIdentity(user_id=user.id, openid=result["openid"]))
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="微信或当前账号已绑定其他账号") from None
    return {"message": "微信绑定成功"}


def exchange(code):
    appid = os.getenv("WECHAT_APP_ID", "")
    secret = os.getenv("WECHAT_APP_SECRET", "")
    if not appid or not secret:
        raise HTTPException(status_code=503, detail="微信服务尚未配置")
    signing_secret = os.getenv("APP_SECRET_KEY", "")
    if not signing_secret or signing_secret == "CHANGE_ME_DEV_ONLY_HEALTH_MANAGER_SECRET":
        raise HTTPException(status_code=503, detail="账号安全配置尚未完成")
    query = urlencode({"appid": appid, "secret": secret, "js_code": code, "grant_type": "authorization_code"})
    try:
        with urlopen("https://api.weixin.qq.com/sns/jscode2session?" + query, timeout=8) as response:
            result = json.load(response)
        if not result.get("openid") or not result.get("session_key"):
            raise ValueError("invalid response")
        return result
    except Exception:
        raise HTTPException(status_code=502, detail="微信登录暂时不可用，请重试") from None


def decode_steps(encrypted, iv, session_key):
    try:
        decryptor = Cipher(algorithms.AES(base64.b64decode(session_key, validate=True)),
                           modes.CBC(base64.b64decode(iv, validate=True))).decryptor()
        padded = decryptor.update(base64.b64decode(encrypted, validate=True)) + decryptor.finalize()
        unpadder = PKCS7(128).unpadder()
        result = json.loads(unpadder.update(padded) + unpadder.finalize())
        if result["watermark"]["appid"] != os.environ["WECHAT_APP_ID"]:
            raise ValueError("invalid watermark")
        return result["stepInfoList"]
    except Exception:
        raise HTTPException(status_code=400, detail="微信运动数据无效，请重新同步") from None


@router.post("/steps")
def sync_steps(payload: StepsRequest, db: Session = Depends(get_db), user=Depends(current_user)):
    result = exchange(payload.code)
    identity = db.query(models.WechatIdentity).filter_by(user_id=user.id, openid=result["openid"]).first()
    entries = decode_steps(payload.encrypted_data, payload.iv, result["session_key"])
    if not identity:
        if not payload.bind:
            raise HTTPException(status_code=403, detail="请先绑定当前微信账号")
        if db.query(models.WechatIdentity).filter_by(openid=result["openid"]).first():
            raise HTTPException(status_code=409, detail="微信或当前账号已绑定其他账号")
        db.add(models.WechatIdentity(user_id=user.id, openid=result["openid"]))
    today = services.local_today()
    daily_steps = {}
    for item in entries:
        try:
            day = datetime.fromtimestamp(int(item["timestamp"]), services.APP_TIMEZONE).date()
            steps = int(item["step"])
        except (KeyError, ValueError, TypeError, OverflowError, OSError):
            continue
        if not today - timedelta(days=30) <= day <= today or not 0 <= steps <= 100000:
            continue
        daily_steps[day] = steps
    for day, steps in daily_steps.items():
        distance_km = steps * user.height_cm * 0.00415 / 1000
        calories = round(distance_km * user.weight_kg * 0.5, 2)
        row = db.query(models.WechatStepLog).filter_by(user_id=user.id, log_date=day).first()
        if not row:
            row = models.WechatStepLog(user_id=user.id, log_date=day, steps=steps, calories=calories)
            db.add(row)
        else:
            row.steps, row.calories = steps, calories
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="同步正在进行，请稍后重试") from None
    return {"synced_days": len(daily_steps)}
