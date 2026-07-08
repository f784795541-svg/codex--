from __future__ import annotations

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from . import models, security
from .database import get_db


def get_optional_current_user(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> models.User | None:
    if not authorization:
        return None

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="登录凭证无效")

    try:
        user_id = security.decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="登录凭证无效或已过期")

    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="登录用户不存在")
    return user


def resolve_user(
    db: Session,
    requested_user_id: int | None,
    current_user: models.User | None,
) -> models.User:
    if current_user:
        if requested_user_id is not None and requested_user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="不能访问其他用户的数据")
        return current_user

    if requested_user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="请先登录")

    user = db.get(models.User, requested_user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在")
    return user


def resolve_optional_user_id(requested_user_id: int | None, current_user: models.User | None) -> int | None:
    if current_user:
        if requested_user_id is not None and requested_user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="不能访问其他用户的数据")
        return current_user.id
    return requested_user_id
