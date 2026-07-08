from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas, services
from ..database import get_db


router = APIRouter()


@router.post("/auth/register", response_model=schemas.AuthResponse)
def register_user(payload: schemas.AuthRegister, db: Session = Depends(get_db)):
    username = services.normalize_username(payload.username)
    if not username or len(username) < 3:
        raise HTTPException(status_code=400, detail="用户名至少 3 位，且不能只包含空格")

    existing = db.query(models.User).filter(models.User.username == username).first()
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")

    user = models.User(
        username=username,
        password_hash=services.hash_password(payload.password),
        name=payload.name,
        age=payload.age,
        gender=payload.gender,
        height_cm=payload.height_cm,
        weight_kg=payload.weight_kg,
        target_weight_kg=payload.target_weight_kg,
        target_sleep_hours=payload.target_sleep_hours,
        goal=payload.goal,
        activity_level=payload.activity_level,
        recommendation_mode=payload.recommendation_mode,
        body_type=payload.body_type,
        target_algorithm=payload.target_algorithm,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    weight_log = models.WeightLog(
        user_id=user.id,
        weight_kg=user.weight_kg,
        record_date=services.local_today(),
    )
    db.add(weight_log)
    db.commit()

    return {
        "message": "注册成功",
        "user": user,
        "access_token": services.create_access_token(user.id),
        "expires_in": services.TOKEN_TTL_SECONDS,
    }


@router.post("/auth/login", response_model=schemas.AuthResponse)
def login_user(payload: schemas.AuthLogin, db: Session = Depends(get_db)):
    username = services.normalize_username(payload.username)
    if not username:
        raise HTTPException(status_code=401, detail="用户名或密码错误")

    user = db.query(models.User).filter(models.User.username == username).first()
    if not user or not services.verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    if services.needs_password_rehash(user.password_hash):
        user.password_hash = services.hash_password(payload.password)
        db.commit()
        db.refresh(user)
    return {
        "message": "登录成功",
        "user": user,
        "access_token": services.create_access_token(user.id),
        "expires_in": services.TOKEN_TTL_SECONDS,
    }
