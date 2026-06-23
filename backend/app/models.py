from datetime import date, datetime, time

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Integer, String, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    username: Mapped[str | None] = mapped_column(String(50), nullable=True, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(64), nullable=True)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    height_cm: Mapped[float] = mapped_column(Float, nullable=False)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    target_weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    target_sleep_hours: Mapped[float | None] = mapped_column(Float, nullable=True)
    goal: Mapped[str] = mapped_column(String(30), default="fat_loss", nullable=False)
    activity_level: Mapped[str] = mapped_column(String(30), default="medium", nullable=False)
    recommendation_mode: Mapped[str] = mapped_column(String(30), default="home", nullable=False)
    body_type: Mapped[str | None] = mapped_column(String(30), nullable=True)
    target_algorithm: Mapped[str] = mapped_column(String(30), default="classic", nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    food_logs: Mapped[list["FoodLog"]] = relationship(back_populates="user")
    workout_logs: Mapped[list["WorkoutLog"]] = relationship(back_populates="user")
    sleep_logs: Mapped[list["SleepLog"]] = relationship(back_populates="user")
    weight_logs: Mapped[list["WeightLog"]] = relationship(back_populates="user")


class FoodDatabase(Base):
    __tablename__ = "food_database"

    food_id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(50), default="other", nullable=False)
    calories_per_100g: Mapped[float] = mapped_column(Float, nullable=False)
    protein: Mapped[float] = mapped_column(Float, nullable=False)
    fat: Mapped[float] = mapped_column(Float, nullable=False)
    carbs: Mapped[float] = mapped_column(Float, nullable=False)
    brand: Mapped[str | None] = mapped_column(String(100), nullable=True)
    serving_size_g: Mapped[float | None] = mapped_column(Float, nullable=True)
    portion_hint: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cooking_options_json: Mapped[str | None] = mapped_column(String(4000), nullable=True)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    food_logs: Mapped[list["FoodLog"]] = relationship(back_populates="food")


class FoodLog(Base):
    __tablename__ = "food_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    food_id: Mapped[int] = mapped_column(ForeignKey("food_database.food_id"), nullable=False, index=True)
    weight_g: Mapped[float] = mapped_column(Float, nullable=False)
    cooking_method: Mapped[str | None] = mapped_column(String(80), nullable=True)
    time: Mapped[time] = mapped_column(Time, nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="food_logs")
    food: Mapped["FoodDatabase"] = relationship(back_populates="food_logs")


class WorkoutLog(Base):
    __tablename__ = "workout_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(50), nullable=False)
    duration_min: Mapped[int] = mapped_column(Integer, nullable=False)
    calories_burned: Mapped[float] = mapped_column(Float, nullable=False)
    workout_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="workout_logs")


class SleepLog(Base):
    __tablename__ = "sleep_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    sleep_start: Mapped[time] = mapped_column(Time, nullable=False)
    sleep_end: Mapped[time] = mapped_column(Time, nullable=False)
    log_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="sleep_logs")


class WeightLog(Base):
    __tablename__ = "weight_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    weight_kg: Mapped[float] = mapped_column(Float, nullable=False)
    record_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    record_time: Mapped[time | None] = mapped_column(Time, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    user: Mapped["User"] = relationship(back_populates="weight_logs")
