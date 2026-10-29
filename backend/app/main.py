from sqlalchemy import nulls_last
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import dependencies, models, schemas, services
from .database import get_db
from .food_metadata import build_aliases_text, build_food_search_text
from .error_tracking import record_api_error
from .routers import auth, food_search, friend_pk, maintenance, reports
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


@app.middleware("http")
async def record_recent_api_errors(request, call_next):
    response = await call_next(request)
    if response.status_code >= 500:
        record_api_error(request.method, request.url.path, response.status_code)
    return response


@app.on_event("startup")
def on_startup() -> None:
    init_database()


@app.get("/health")
def health_check():
    return {"status": "ok"}


app.include_router(auth.router)
app.include_router(food_search.router)
app.include_router(reports.router)
app.include_router(maintenance.router)
app.include_router(friend_pk.router)


@app.post("/user/create", response_model=schemas.UserResponse)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    user = models.User(**payload.model_dump())
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/user/info", response_model=schemas.UserResponse)
def get_user_info(
    user_id: int | None = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, user_id, current_user)
    return user


@app.post("/user/update", response_model=schemas.UserUpdateResponse)
def update_user_info(
    payload: schemas.UserUpdateRequest,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, payload.user_id, current_user)

    if payload.username and payload.username != user.username:
        normalized_username = services.normalize_username(payload.username)
        if not normalized_username or len(normalized_username) < 3:
            raise HTTPException(status_code=400, detail="用户名至少 3 位，且不能只包含空格")
        existing = db.query(models.User).filter(models.User.username == normalized_username).first()
        if existing and existing.id != user.id:
            raise HTTPException(status_code=400, detail="用户名已存在")
        user.username = normalized_username

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
                record_date=services.local_today(),
            )
        )

    db.commit()
    db.refresh(user)
    return {"message": "设置已更新", "user": user}


@app.get("/workout/options", response_model=list[schemas.WorkoutOptionResponse])
def get_workout_options():
    return get_workout_option_list()


@app.get("/workout/estimate", response_model=schemas.WorkoutEstimateResponse)
def estimate_workout(
    user_id: int | None = Query(None),
    type: str = Query(...),
    duration_min: int = Query(..., ge=1, le=600),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, user_id, current_user)

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

    food_payload = payload.model_dump()
    aliases_text = build_aliases_text(food_payload["name"], food_payload["category"])
    food = models.FoodDatabase(
        **food_payload,
        aliases_text=aliases_text,
        search_text=build_food_search_text(food_payload["name"], food_payload["category"], None, aliases_text),
        source="user_custom",
        source_updated_at=services.local_today().isoformat(),
        status="active",
        is_custom=True,
    )
    db.add(food)
    db.commit()
    db.refresh(food)
    return food


@app.post("/food/log")
def create_food_log(
    payload: schemas.FoodLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, payload.user_id, current_user)

    food = db.get(models.FoodDatabase, payload.food_id)
    if not food:
        raise HTTPException(status_code=404, detail="食物不存在")

    log = models.FoodLog(
        user_id=user.id,
        food_id=payload.food_id,
        weight_g=payload.weight_g,
        cooking_method=payload.cooking_method,
        time=payload.time,
        log_date=payload.log_date or services.local_today(),
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


@app.delete("/food/log/{log_id}")
def delete_food_log(
    log_id: int,
    user_id: int | None = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, user_id, current_user)

    log = (
        db.query(models.FoodLog)
        .filter(models.FoodLog.id == log_id, models.FoodLog.user_id == user.id)
        .first()
    )
    if not log:
        raise HTTPException(status_code=404, detail="饮食记录不存在")

    db.delete(log)
    db.commit()
    return {
        "message": "饮食记录已删除",
        "id": log_id,
        "user_id": user.id,
    }


@app.post("/workout/log")
def create_workout_log(
    payload: schemas.WorkoutLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, payload.user_id, current_user)

    if not get_workout_option(payload.type):
        raise HTTPException(status_code=404, detail="运动类型不存在")

    log = models.WorkoutLog(
        user_id=user.id,
        type=payload.type,
        duration_min=payload.duration_min,
        calories_burned=payload.calories_burned,
        workout_time=payload.workout_time,
        log_date=payload.log_date or services.local_today(),
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
def create_sleep_log(
    payload: schemas.SleepLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, payload.user_id, current_user)

    log = models.SleepLog(
        user_id=user.id,
        sleep_start=payload.sleep_start,
        sleep_end=payload.sleep_end,
        log_date=payload.log_date or services.local_today(),
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
def create_weight_log(
    payload: schemas.WeightLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, payload.user_id, current_user)

    log = models.WeightLog(
        user_id=user.id,
        weight_kg=payload.weight_kg,
        record_date=payload.record_date or services.local_today(),
        record_time=payload.record_time,
    )
    user.weight_kg = payload.weight_kg
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@app.get("/weight/history", response_model=list[schemas.WeightLogResponse])
def get_weight_history(
    user_id: int | None = Query(None),
    limit: int = Query(30, ge=1, le=180),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    user = dependencies.resolve_user(db, user_id, current_user)

    logs = (
        db.query(models.WeightLog)
        .filter(models.WeightLog.user_id == user.id)
        .order_by(models.WeightLog.record_date.desc(), nulls_last(models.WeightLog.record_time.desc()))
        .limit(limit)
        .all()
    )
    return logs
