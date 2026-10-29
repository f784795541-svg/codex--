from datetime import date, datetime, timedelta
import calendar
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


class HabitRequest(BaseModel):
    name: str = Field(min_length=1, max_length=40)


STAGES = [("7 天", 0), ("1 个月", 1), ("3 个月", 3), ("半年", 6), ("1 年", 12)]


def challenge_end(start, stage):
    months = STAGES[stage][1]
    if not months:
        return start + timedelta(days=6)
    month_index = start.year * 12 + start.month - 1 + months
    year, month = divmod(month_index, 12)
    month += 1
    return date(year, month, min(start.day, calendar.monthrange(year, month)[1])) - timedelta(days=1)


def open_challenge(db, user_id):
    challenge = db.query(models.FriendChallenge).filter(
        or_(models.FriendChallenge.sender_id == user_id, models.FriendChallenge.recipient_id == user_id),
        models.FriendChallenge.status.in_(["pending", "active"]),
    ).order_by(models.FriendChallenge.id.desc()).first()
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
def get_state(month: str | None = None, db: Session = Depends(get_db), user=Depends(authenticated)):
    today = services.local_today()
    try:
        month_start = date.fromisoformat(f"{month}-01") if month else today.replace(day=1)
    except ValueError:
        raise HTTPException(status_code=400, detail="月份格式应为 YYYY-MM")
    month_end = month_start.replace(day=calendar.monthrange(month_start.year, month_start.month)[1])
    challenge = open_challenge(db, user.id)
    code = db.query(models.FriendInviteCode).filter(
        models.FriendInviteCode.user_id == user.id,
        models.FriendInviteCode.expires_at > datetime.utcnow(),
    ).order_by(models.FriendInviteCode.id.desc()).first()
    result = {"code": code.code if code else None, "code_expires_at": code.expires_at.isoformat() + "Z" if code else None,
              "today": today.isoformat(), "calendar": stats(db, user.id, today - timedelta(days=29), today), "challenge": None}
    habits = db.query(models.FriendHabit).filter_by(user_id=user.id).order_by(models.FriendHabit.id).all()
    result["habit_month"] = month_start.strftime("%Y-%m")
    result["habits"] = []
    for habit in habits:
        checkins = db.query(models.FriendHabitCheckin).filter(models.FriendHabitCheckin.habit_id == habit.id,
            models.FriendHabitCheckin.checkin_date >= month_start, models.FriendHabitCheckin.checkin_date <= month_end).all()
        dates = [item.checkin_date.isoformat() for item in checkins]
        today_checked = db.query(models.FriendHabitCheckin).filter_by(habit_id=habit.id, checkin_date=today).first() is not None
        result["habits"].append({"id": habit.id, "name": habit.name, "dates": dates, "today_checked": today_checked})
    if challenge:
        peer_id = challenge.recipient_id if challenge.sender_id == user.id else challenge.sender_id
        peer = db.get(models.User, peer_id)
        entry = {"id": challenge.id, "status": challenge.status, "incoming": challenge.recipient_id == user.id,
                 "peer_name": peer.name, "start_date": challenge.start_date.isoformat() if challenge.start_date else None}
        if challenge.status == "active":
            stage = challenge.stage
            deadline = challenge_end(challenge.start_date, stage)
            end = min(today, deadline)
            own = stats(db, user.id, challenge.start_date, end)
            other = stats(db, peer_id, challenge.start_date, end)
            entry.update({"own_days": len(own), "peer_days": len(other), "own_minutes": sum(own.values()),
                          "peer_minutes": sum(other.values()), "end_date": deadline.isoformat(),
                          "stage_label": STAGES[stage][0], "next_stage_label": STAGES[stage + 1][0] if stage < 4 else None,
                          "renewal_due": stage < 4 and today >= deadline - timedelta(days=2),
                          "renewal_pending": bool(challenge.renewal_requested_by),
                          "renewal_incoming": bool(challenge.renewal_requested_by and challenge.renewal_requested_by != user.id),
                          "expired": today > deadline})
            weights = db.query(models.WeightLog).filter(models.WeightLog.user_id == user.id,
                models.WeightLog.record_date >= challenge.start_date, models.WeightLog.record_date <= end).order_by(
                    models.WeightLog.record_date, models.WeightLog.record_time, models.WeightLog.id).all()
            entry["weight_change"] = round(weights[-1].weight_kg - weights[0].weight_kg, 1) if len(weights) >= 2 else None
        result["challenge"] = entry
    return result


@router.post("/habits")
def create_habit(payload: HabitRequest, db: Session = Depends(get_db), user=Depends(authenticated)):
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="请输入习惯名称")
    if db.query(models.FriendHabit).filter_by(user_id=user.id, name=name).first():
        raise HTTPException(status_code=409, detail="这个习惯已经存在")
    habit = models.FriendHabit(user_id=user.id, name=name)
    db.add(habit)
    db.commit()
    return {"id": habit.id}


@router.post("/habits/{habit_id}/toggle")
def toggle_habit(habit_id: int, db: Session = Depends(get_db), user=Depends(authenticated)):
    habit = db.query(models.FriendHabit).filter_by(id=habit_id, user_id=user.id).first()
    if not habit:
        raise HTTPException(status_code=404, detail="习惯不存在")
    today = services.local_today()
    checkin = db.query(models.FriendHabitCheckin).filter_by(habit_id=habit.id, checkin_date=today).first()
    if checkin:
        db.delete(checkin)
    else:
        db.add(models.FriendHabitCheckin(habit_id=habit.id, checkin_date=today))
    db.commit()
    return {"checked": checkin is None}


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
    elif action == "renew" and challenge.status == "active" and challenge.stage < 4 and not challenge.renewal_requested_by and services.local_today() >= challenge_end(challenge.start_date, challenge.stage) - timedelta(days=2):
        challenge.renewal_requested_by = user.id
    elif action == "renew-accept" and challenge.status == "active" and challenge.renewal_requested_by and challenge.renewal_requested_by != user.id and challenge.stage < 4:
        challenge.stage += 1
        challenge.renewal_requested_by = None
    elif action == "renew-decline" and challenge.status == "active" and challenge.renewal_requested_by and challenge.renewal_requested_by != user.id:
        challenge.renewal_requested_by = None
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
