from datetime import datetime, timedelta
import secrets

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import or_
from sqlalchemy.orm import Session

from .. import dependencies, models, services
from ..database import get_db


router = APIRouter(prefix="/friend-pk")


def authenticated(user=Depends(dependencies.get_optional_current_user)):
    if not user:
        raise HTTPException(status_code=401, detail="请先登录")
    return user


class InviteRequest(BaseModel):
    code: str = Field(min_length=6, max_length=16)


def open_challenge(db, user_id):
    challenge = db.query(models.FriendChallenge).filter(
        or_(models.FriendChallenge.sender_id == user_id, models.FriendChallenge.recipient_id == user_id),
        models.FriendChallenge.status.in_(["pending", "active"]),
    ).order_by(models.FriendChallenge.id.desc()).first()
    if challenge and challenge.status == "active" and services.local_today() > challenge.start_date + timedelta(days=6):
        challenge.status = "completed"
        challenge.ended_at = datetime.utcnow()
        db.commit()
        return None
    return challenge


def stats(db, user_id, start, end):
    logs = db.query(models.WorkoutLog).filter(
        models.WorkoutLog.user_id == user_id,
        models.WorkoutLog.log_date >= start,
        models.WorkoutLog.log_date <= end,
    ).all()
    days = {}
    for log in logs:
        key = log.log_date.isoformat()
        days[key] = days.get(key, 0) + log.duration_min
    return days


@router.get("/state")
def get_state(db: Session = Depends(get_db), user=Depends(authenticated)):
    today = services.local_today()
    challenge = open_challenge(db, user.id)
    code = db.query(models.FriendInviteCode).filter(
        models.FriendInviteCode.user_id == user.id,
        models.FriendInviteCode.expires_at > datetime.utcnow(),
    ).order_by(models.FriendInviteCode.id.desc()).first()
    result = {"code": code.code if code else None, "code_expires_at": code.expires_at.isoformat() + "Z" if code else None,
              "today": today.isoformat(), "calendar": stats(db, user.id, today - timedelta(days=29), today), "challenge": None}
    if challenge:
        peer_id = challenge.recipient_id if challenge.sender_id == user.id else challenge.sender_id
        peer = db.get(models.User, peer_id)
        entry = {"id": challenge.id, "status": challenge.status, "incoming": challenge.recipient_id == user.id,
                 "peer_name": peer.name, "start_date": challenge.start_date.isoformat() if challenge.start_date else None}
        if challenge.status == "active":
            end = min(today, challenge.start_date + timedelta(days=6))
            own = stats(db, user.id, challenge.start_date, end)
            other = stats(db, peer_id, challenge.start_date, end)
            entry.update({"own_days": len(own), "peer_days": len(other), "own_minutes": sum(own.values()),
                          "peer_minutes": sum(other.values()), "end_date": (challenge.start_date + timedelta(days=6)).isoformat()})
            weights = db.query(models.WeightLog).filter(models.WeightLog.user_id == user.id,
                models.WeightLog.record_date >= challenge.start_date, models.WeightLog.record_date <= end).order_by(
                    models.WeightLog.record_date, models.WeightLog.record_time, models.WeightLog.id).all()
            entry["weight_change"] = round(weights[-1].weight_kg - weights[0].weight_kg, 1) if len(weights) >= 2 else None
        result["challenge"] = entry
    return result


@router.post("/code")
def create_code(db: Session = Depends(get_db), user=Depends(authenticated)):
    existing = db.query(models.FriendInviteCode).filter(models.FriendInviteCode.user_id == user.id,
        models.FriendInviteCode.expires_at > datetime.utcnow()).first()
    if existing:
        return {"code": existing.code, "expires_at": existing.expires_at.isoformat() + "Z"}
    db.query(models.FriendInviteCode).filter(models.FriendInviteCode.user_id == user.id).delete()
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    while True:
        code = "".join(secrets.choice(alphabet) for _ in range(8))
        if not db.query(models.FriendInviteCode).filter_by(code=code).first():
            break
    entry = models.FriendInviteCode(user_id=user.id, code=code, expires_at=datetime.utcnow() + timedelta(hours=24))
    db.add(entry)
    db.commit()
    return {"code": code, "expires_at": entry.expires_at.isoformat() + "Z"}


@router.post("/invite")
def invite(payload: InviteRequest, db: Session = Depends(get_db), user=Depends(authenticated)):
    code = db.query(models.FriendInviteCode).filter(models.FriendInviteCode.code == payload.code.strip().upper(),
        models.FriendInviteCode.expires_at > datetime.utcnow()).first()
    if not code or code.user_id == user.id:
        raise HTTPException(status_code=400, detail="匹配码无效、已过期或属于自己")
    if open_challenge(db, user.id) or open_challenge(db, code.user_id):
        raise HTTPException(status_code=409, detail="一方已有待处理或进行中的挑战")
    challenge = models.FriendChallenge(sender_id=user.id, recipient_id=code.user_id, status="pending")
    db.add(challenge)
    db.delete(code)
    db.commit()
    return {"message": "邀战已发送，等待对方确认"}


@router.post("/challenge/{challenge_id}/{action}")
def change_challenge(challenge_id: int, action: str, db: Session = Depends(get_db), user=Depends(authenticated)):
    challenge = db.get(models.FriendChallenge, challenge_id)
    if not challenge or user.id not in (challenge.sender_id, challenge.recipient_id):
        raise HTTPException(status_code=404, detail="挑战不存在")
    if action == "accept" and challenge.status == "pending" and challenge.recipient_id == user.id:
        challenge.status = "active"
        challenge.start_date = services.local_today()
    elif action == "decline" and challenge.status == "pending" and challenge.recipient_id == user.id:
        challenge.status = "declined"
        challenge.ended_at = datetime.utcnow()
    elif action == "leave" and challenge.status in ("pending", "active"):
        challenge.status = "ended"
        challenge.ended_at = datetime.utcnow()
    else:
        raise HTTPException(status_code=400, detail="当前状态不能执行此操作")
    db.commit()
    return {"status": challenge.status}
