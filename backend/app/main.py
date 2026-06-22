from datetime import date

from sqlalchemy import or_
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, services
from .database import get_db
from .food_metadata import food_matches_query
from .seed import init_database
from .workout_metadata import get_workout_option, get_workout_option_list


app = FastAPI(
    title="Health Manager",
    description="基于数据库、固定公式和规则引擎的轻量级健康管理系统",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_database()


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/auth/register", response_model=schemas.AuthResponse)
def register_user(payload: schemas.AuthRegister, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == payload.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="用户名已存在")

    user = models.User(
        username=payload.username,
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
        record_date=date.today(),
    )
    db.add(weight_log)
    db.commit()

    return {"message": "注册成功", "user": user}


@app.post("/auth/login", response_model=schemas.AuthResponse)
def login_user(payload: schemas.AuthLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == payload.username).first()
    if not user or not services.verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="用户名或密码错误")
    return {"message": "登录成功", "user": user}


@app.post("/user/create", response_model=schemas.UserResponse)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    user = models.User(**payload.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/user/info", response_model=schemas.UserResponse)
def get_user_info(user_id: int = Query(...), db: Session = Depends(get_db)):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user


@app.post("/user/update", response_model=schemas.UserUpdateResponse)
def update_user_info(payload: schemas.UserUpdateRequest, db: Session = Depends(get_db)):
    user = db.get(models.User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    if payload.username and payload.username != user.username:
        existing = db.query(models.User).filter(models.User.username == payload.username).first()
        if existing and existing.id != user.id:
            raise HTTPException(status_code=400, detail="用户名已存在")
        user.username = payload.username

    if payload.new_password:
        if not payload.current_password or not services.verify_password(payload.current_password, user.password_hash):
            raise HTTPException(status_code=400, detail="当前密码不正确")
        user.password_hash = services.hash_password(payload.new_password)

    weight_changed = payload.weight_kg is not None and payload.weight_kg != user.weight_kg

    for field in ["name", "age", "gender", "height_cm", "weight_kg", "target_weight_kg", "target_sleep_hours", "goal", "activity_level", "recommendation_mode", "body_type", "target_algorithm"]:
        value = getattr(payload, field)
        if value is not None:
            setattr(user, field, value)

    if weight_changed:
        db.add(
            models.WeightLog(
                user_id=user.id,
                weight_kg=user.weight_kg,
                record_date=date.today(),
            )
        )

    db.commit()
    db.refresh(user)
    return {"message": "设置已更新", "user": user}


@app.get("/food/database", response_model=list[schemas.FoodResponse])
def get_food_database(
    limit: int = Query(200, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    foods = db.query(models.FoodDatabase).order_by(models.FoodDatabase.food_id).offset(offset).limit(limit).all()
    return [services.serialize_food(food) for food in foods]


@app.get("/food/search", response_model=list[schemas.FoodResponse])
def search_food(q: str = Query(..., min_length=1), limit: int = Query(20, ge=1, le=50), db: Session = Depends(get_db)):
    foods = db.query(models.FoodDatabase).all()
    matched: list[tuple[int, models.FoodDatabase]] = []
    for food in foods:
        is_match, score = food_matches_query(food.name, food.category, q)
        if is_match:
            matched.append((score, food))

    matched.sort(key=lambda item: (-item[0], item[1].food_id))
    return [services.serialize_food(food) for _, food in matched[:limit]]


@app.get("/workout/options", response_model=list[schemas.WorkoutOptionResponse])
def get_workout_options():
    return get_workout_option_list()


@app.get("/workout/estimate", response_model=schemas.WorkoutEstimateResponse)
def estimate_workout(
    user_id: int = Query(...),
    type: str = Query(...),
    duration_min: int = Query(..., ge=1, le=600),
    db: Session = Depends(get_db),
):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    option = get_workout_option(type)
    if not option:
        raise HTTPException(status_code=404, detail="运动类型不存在")

    met, estimated_calories = services.estimate_workout_calories(user.weight_kg, type, duration_min)
    return {
        "type": type,
        "label": option["label"],
        "met": met,
        "estimated_calories": estimated_calories,
    }


@app.post("/food/create", response_model=schemas.FoodResponse)
def create_food(payload: schemas.FoodCreate, db: Session = Depends(get_db)):
    existing = db.query(models.FoodDatabase).filter(models.FoodDatabase.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="食物已存在")

    food = models.FoodDatabase(**payload.model_dump(), is_custom=True)
    db.add(food)
    db.commit()
    db.refresh(food)
    return food


@app.post("/food/log")
def create_food_log(payload: schemas.FoodLogCreate, db: Session = Depends(get_db)):
    user = db.get(models.User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    food = db.get(models.FoodDatabase, payload.food_id)
    if not food:
        raise HTTPException(status_code=404, detail="食物不存在")

    log = models.FoodLog(
        user_id=payload.user_id,
        food_id=payload.food_id,
        weight_g=payload.weight_g,
        cooking_method=payload.cooking_method,
        time=payload.time,
        log_date=payload.log_date or date.today(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)

    nutrition_profile = services.resolve_food_nutrition(food, payload.cooking_method)
    factor = payload.weight_g / 100
    return {
        "id": log.id,
        "user_id": log.user_id,
        "food_id": log.food_id,
        "weight_g": log.weight_g,
        "cooking_method": log.cooking_method,
        "time": log.time.strftime("%H:%M"),
        "log_date": log.log_date.isoformat(),
        "nutrition": {
            "calories": round(float(nutrition_profile["calories_per_100g"]) * factor, 2),
            "protein": round(float(nutrition_profile["protein"]) * factor, 2),
            "fat": round(float(nutrition_profile["fat"]) * factor, 2),
            "carbs": round(float(nutrition_profile["carbs"]) * factor, 2),
        },
    }


@app.post("/workout/log")
def create_workout_log(payload: schemas.WorkoutLogCreate, db: Session = Depends(get_db)):
    user = db.get(models.User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    if not get_workout_option(payload.type):
        raise HTTPException(status_code=404, detail="运动类型不存在")

    log = models.WorkoutLog(
        user_id=payload.user_id,
        type=payload.type,
        duration_min=payload.duration_min,
        calories_burned=payload.calories_burned,
        workout_time=payload.workout_time,
        log_date=payload.log_date or date.today(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {
        "id": log.id,
        "type": log.type,
        "duration_min": log.duration_min,
        "calories_burned": log.calories_burned,
        "workout_time": log.workout_time.strftime("%H:%M") if log.workout_time else None,
        "log_date": log.log_date.isoformat(),
    }


@app.post("/sleep/log")
def create_sleep_log(payload: schemas.SleepLogCreate, db: Session = Depends(get_db)):
    user = db.get(models.User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    log = models.SleepLog(
        user_id=payload.user_id,
        sleep_start=payload.sleep_start,
        sleep_end=payload.sleep_end,
        log_date=payload.log_date or date.today(),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return {
        "id": log.id,
        "sleep_start": log.sleep_start.strftime("%H:%M"),
        "sleep_end": log.sleep_end.strftime("%H:%M"),
        "duration_hours": services.sleep_duration_hours(log.sleep_start, log.sleep_end),
        "log_date": log.log_date.isoformat(),
    }


@app.post("/weight/log", response_model=schemas.WeightLogResponse)
def create_weight_log(payload: schemas.WeightLogCreate, db: Session = Depends(get_db)):
    user = db.get(models.User, payload.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    log = models.WeightLog(
        user_id=payload.user_id,
        weight_kg=payload.weight_kg,
        record_date=payload.record_date or date.today(),
        record_time=payload.record_time,
    )
    user.weight_kg = payload.weight_kg
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@app.get("/weight/history", response_model=list[schemas.WeightLogResponse])
def get_weight_history(
    user_id: int = Query(...),
    limit: int = Query(30, ge=1, le=180),
    db: Session = Depends(get_db),
):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    logs = (
        db.query(models.WeightLog)
        .filter(models.WeightLog.user_id == user_id)
        .order_by(models.WeightLog.record_date.desc(), models.WeightLog.record_time.desc())
        .limit(limit)
        .all()
    )
    logs.reverse()
    return logs


@app.get("/dashboard/summary", response_model=schemas.DashboardSummaryResponse)
def get_dashboard_summary(
    user_id: int = Query(...),
    report_date: date | None = Query(None),
    db: Session = Depends(get_db),
):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return services.build_dashboard_summary(db, user, report_date or date.today())


@app.get("/report/daily", response_model=schemas.DailyReportResponse)
def get_daily_report(
    user_id: int = Query(...),
    report_date: date | None = Query(None),
    db: Session = Depends(get_db),
):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return services.compute_daily_report(db, user, report_date or date.today())


@app.get("/report/weekly", response_model=schemas.WeeklyReportResponse)
def get_weekly_report(
    user_id: int = Query(...),
    start_date: date | None = Query(None),
    db: Session = Depends(get_db),
):
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return services.compute_weekly_report(db, user, start_date or date.today())
