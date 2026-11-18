from __future__ import annotations

from datetime import timedelta
from uuid import uuid4

from app import models, services
from app.database import SessionLocal
from conftest import api_request, query_string


def test_record_flow_writes_all_core_logs(registered_user):
    token = registered_user["token"]
    user_id = registered_user["user"]["id"]
    today = services.local_today().isoformat()

    foods = api_request("GET", f"/food/search?{query_string({'q': '米饭', 'limit': 1})}", token=token)
    assert foods

    food_log = api_request(
        "POST",
        "/food/log",
        {
            "user_id": user_id,
            "food_id": foods[0]["food_id"],
            "weight_g": 120,
            "time": "12:20",
            "log_date": today,
        },
        token=token,
    )
    workout_log = api_request(
        "POST",
        "/workout/log",
        {
            "user_id": user_id,
            "type": "walking",
            "duration_min": 20,
            "calories_burned": 80.5,
            "workout_time": "18:30",
            "log_date": today,
        },
        token=token,
    )
    sleep_log = api_request(
        "POST",
        "/sleep/log",
        {
            "user_id": user_id,
            "sleep_start": "23:30",
            "sleep_end": "07:10",
            "log_date": today,
        },
        token=token,
    )
    weight_log = api_request(
        "POST",
        "/weight/log",
        {
            "user_id": user_id,
            "weight_kg": 71.8,
            "record_date": today,
            "record_time": "08:10",
        },
        token=token,
    )

    assert food_log["id"] > 0
    assert workout_log["id"] > 0
    assert sleep_log["id"] > 0
    assert weight_log["id"] > 0
    assert food_log["user_id"] == user_id
    assert weight_log["user_id"] == user_id

    with SessionLocal() as db:
        assert db.get(models.FoodLog, food_log["id"]).user_id == user_id
        assert db.get(models.WorkoutLog, workout_log["id"]).calories_burned == 80.5
        assert db.get(models.SleepLog, sleep_log["id"]).user_id == user_id
        assert db.get(models.WeightLog, weight_log["id"]).weight_kg == 71.8
        assert db.get(models.User, user_id).weight_kg == 71.8

    daily = api_request("GET", f"/report/daily?{query_string({'report_date': today})}", token=token)
    summary = api_request("GET", f"/dashboard/summary?{query_string({'report_date': today})}", token=token)
    assert any(item["id"] == food_log["id"] for item in daily["food_items"])
    assert daily["total_burned_kcal"] >= 80.5
    assert daily["sleep_hours"] >= 7.67
    assert summary["user"]["weight_kg"] == 71.8


def test_backdated_weight_does_not_replace_current_weight():
    auth = api_request("POST", "/auth/register", {
        "username": f"pytest_weight_{uuid4().hex[:16]}",
        "password": "TEST_PASSWORD_ONLY",
        "name": "Weight Regression",
        "age": 30,
        "gender": "male",
        "height_cm": 175,
        "weight_kg": 72,
    })
    token = auth["access_token"]
    today = services.local_today()
    latest = api_request("POST", "/weight/log", {
        "weight_kg": 71.5, "record_date": today.isoformat(), "record_time": "20:00",
    }, token)

    for record_date, record_time in [
        (today - timedelta(days=1), "21:00"),
        (today, "08:00"),
        (today, None),
    ]:
        older = api_request("POST", "/weight/log", {
            "weight_kg": 75,
            "record_date": record_date.isoformat(),
            "record_time": record_time,
        }, token)
        summary = api_request("GET", "/dashboard/summary", token=token)
        assert summary["user"]["weight_kg"] == 71.5
        assert summary["recent_weights"][0]["id"] == latest["id"]
        with SessionLocal() as db:
            assert db.get(models.WeightLog, older["id"]).weight_kg == 75
            assert db.get(models.User, auth["user"]["id"]).weight_kg == 71.5

    replacement = api_request("POST", "/weight/log", {
        "weight_kg": 71.2, "record_date": today.isoformat(), "record_time": "20:00",
    }, token)
    summary = api_request("GET", "/dashboard/summary", token=token)
    history = api_request("GET", "/weight/history", token=token)
    assert summary["user"]["weight_kg"] == 71.2
    assert summary["recent_weights"][0]["id"] == replacement["id"]
    assert history[0]["id"] == replacement["id"]
