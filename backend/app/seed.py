import json
import time
from pathlib import Path

from sqlalchemy import inspect, or_, text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import Session

from .build_food_catalog import build_food_catalog, write_food_catalog
from .database import Base, engine
from .models import FoodDatabase
from .services import hash_password


SEED_FILE = Path(__file__).resolve().parent / "foods.json"


def seed_food_database(db: Session) -> None:
    foods = build_food_catalog()
    write_food_catalog(foods)
    next_food_id = (db.query(FoodDatabase.food_id).order_by(FoodDatabase.food_id.desc()).first() or [0])[0] + 1
    for item in foods:
        with db.no_autoflush:
            existing = db.query(FoodDatabase).filter(FoodDatabase.name == item["name"]).first()
        if existing:
            existing.name = item["name"]
            existing.category = item["category"]
            existing.calories_per_100g = item["calories_per_100g"]
            existing.protein = item["protein"]
            existing.fat = item["fat"]
            existing.carbs = item["carbs"]
            existing.brand = item.get("brand")
            existing.serving_size_g = item.get("serving_size_g")
            existing.portion_hint = item.get("portion_hint")
            existing.cooking_options_json = item.get("cooking_options_json")
            continue
        payload = dict(item)
        payload["food_id"] = next_food_id
        next_food_id += 1
        db.add(FoodDatabase(**payload))
    db.commit()


def run_schema_migrations() -> None:
    inspector = inspect(engine)
    with engine.begin() as connection:
        if inspector.has_table("users"):
            user_columns = {column["name"] for column in inspector.get_columns("users")}
            if "username" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN username VARCHAR(50)"))
            if "password_hash" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN password_hash VARCHAR(64)"))
            if "target_weight_kg" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN target_weight_kg FLOAT"))
            if "target_sleep_hours" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN target_sleep_hours FLOAT"))
            if "recommendation_mode" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN recommendation_mode VARCHAR(30) DEFAULT 'home'"))
            if "body_type" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN body_type VARCHAR(30)"))
            if "target_algorithm" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN target_algorithm VARCHAR(30) DEFAULT 'classic'"))
            if "created_at" not in user_columns:
                connection.execute(text("ALTER TABLE users ADD COLUMN created_at TIMESTAMP"))
                connection.execute(text("UPDATE users SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"))

            connection.execute(
                text(
                    "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique "
                    "ON users (username) WHERE username IS NOT NULL"
                )
            )

            legacy_ids = connection.execute(text("SELECT id FROM users WHERE username IS NULL")).fetchall()
            for row in legacy_ids:
                connection.execute(
                    text(
                        "UPDATE users SET username = :username, password_hash = :password_hash, target_algorithm = COALESCE(target_algorithm, 'classic') "
                        "WHERE id = :user_id"
                    ),
                    {
                        "username": f"user_{row.id}",
                        "password_hash": hash_password("123456"),
                        "user_id": row.id,
                    },
                )
            connection.execute(text("UPDATE users SET recommendation_mode = COALESCE(recommendation_mode, 'home')"))

        if inspector.has_table("workout_logs"):
            workout_columns = {column["name"] for column in inspector.get_columns("workout_logs")}
            if "workout_time" not in workout_columns:
                connection.execute(text("ALTER TABLE workout_logs ADD COLUMN workout_time TIME"))
            if "created_at" not in workout_columns:
                connection.execute(text("ALTER TABLE workout_logs ADD COLUMN created_at TIMESTAMP"))
                connection.execute(text("UPDATE workout_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"))
        if inspector.has_table("food_database"):
            food_columns = {column["name"] for column in inspector.get_columns("food_database")}
            if "brand" not in food_columns:
                connection.execute(text("ALTER TABLE food_database ADD COLUMN brand VARCHAR(100)"))
            if "serving_size_g" not in food_columns:
                connection.execute(text("ALTER TABLE food_database ADD COLUMN serving_size_g FLOAT"))
            if "portion_hint" not in food_columns:
                connection.execute(text("ALTER TABLE food_database ADD COLUMN portion_hint VARCHAR(255)"))
            if "cooking_options_json" not in food_columns:
                connection.execute(text("ALTER TABLE food_database ADD COLUMN cooking_options_json VARCHAR(4000)"))
        if inspector.has_table("food_logs"):
            food_log_columns = {column["name"] for column in inspector.get_columns("food_logs")}
            if "cooking_method" not in food_log_columns:
                connection.execute(text("ALTER TABLE food_logs ADD COLUMN cooking_method VARCHAR(80)"))
            if "created_at" not in food_log_columns:
                connection.execute(text("ALTER TABLE food_logs ADD COLUMN created_at TIMESTAMP"))
                connection.execute(text("UPDATE food_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"))
        if inspector.has_table("sleep_logs"):
            sleep_columns = {column["name"] for column in inspector.get_columns("sleep_logs")}
            if "created_at" not in sleep_columns:
                connection.execute(text("ALTER TABLE sleep_logs ADD COLUMN created_at TIMESTAMP"))
                connection.execute(text("UPDATE sleep_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"))
        if inspector.has_table("weight_logs"):
            weight_columns = {column["name"] for column in inspector.get_columns("weight_logs")}
            if "record_time" not in weight_columns:
                connection.execute(text("ALTER TABLE weight_logs ADD COLUMN record_time TIME"))
            if "created_at" not in weight_columns:
                connection.execute(text("ALTER TABLE weight_logs ADD COLUMN created_at TIMESTAMP"))
                connection.execute(text("UPDATE weight_logs SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL"))


def init_database(max_retries: int = 10, retry_delay: int = 3) -> None:
    for attempt in range(1, max_retries + 1):
        try:
            Base.metadata.create_all(bind=engine)
            run_schema_migrations()
            with Session(bind=engine) as session:
                seed_food_database(session)
            return
        except OperationalError:
            if attempt == max_retries:
                raise
            time.sleep(retry_delay)
