from __future__ import annotations

from datetime import date, timedelta

from conftest import api_request, query_string


def test_reports_sync_after_records(registered_user):
    token = registered_user["token"]
    user_id = registered_user["user"]["id"]
    today = date.today().isoformat()

    foods = api_request("GET", f"/food/search?{query_string({'q': '米饭', 'limit': 1})}", token=token)
    api_request(
        "POST",
        "/food/log",
        {
            "user_id": user_id,
            "food_id": foods[0]["food_id"],
            "weight_g": 100,
            "time": "12:00",
            "log_date": today,
        },
        token=token,
    )
    api_request(
        "POST",
        "/workout/log",
        {
            "user_id": user_id,
            "type": "walking",
            "duration_min": 10,
            "calories_burned": 30,
            "workout_time": "18:00",
            "log_date": today,
        },
        token=token,
    )

    summary = api_request("GET", f"/dashboard/summary?{query_string({'report_date': today})}", token=token)
    daily = api_request("GET", f"/report/daily?{query_string({'report_date': today})}", token=token)
    weekly = api_request("GET", f"/report/weekly?{query_string({'start_date': today})}", token=token)

    assert summary["user"]["id"] == user_id
    assert daily["user_id"] == user_id
    assert daily["total_intake_kcal"] > 0
    assert daily["total_burned_kcal"] >= 30
    assert daily["base_calorie_target_kcal"] == daily["calorie_target_kcal"]
    assert daily["workout_flex_calories_kcal"] == round(daily["total_burned_kcal"] * 0.4, 2)
    assert daily["recommended_calorie_target_kcal"] == round(
        daily["base_calorie_target_kcal"] + daily["workout_flex_calories_kcal"], 2
    )
    assert daily["bmr_kcal"] > 0
    assert weekly["daily_reports"]


def test_daily_report_updates_after_food_log_delete(registered_user):
    token = registered_user["token"]
    user_id = registered_user["user"]["id"]
    today = date.today().isoformat()

    foods = api_request("GET", f"/food/search?{query_string({'q': '米饭', 'limit': 1})}", token=token)
    created = api_request(
        "POST",
        "/food/log",
        {
            "user_id": user_id,
            "food_id": foods[0]["food_id"],
            "weight_g": 100,
            "time": "12:00",
            "log_date": today,
        },
        token=token,
    )

    daily_before_delete = api_request("GET", f"/report/daily?{query_string({'report_date': today})}", token=token)
    assert any(item["id"] == created["id"] for item in daily_before_delete["food_items"])

    deleted = api_request("DELETE", f"/food/log/{created['id']}?{query_string({'user_id': user_id})}", token=token)
    daily_after_delete = api_request("GET", f"/report/daily?{query_string({'report_date': today})}", token=token)

    assert deleted["id"] == created["id"]
    assert all(item["id"] != created["id"] for item in daily_after_delete["food_items"])


def test_food_history_returns_daily_macros_and_items(registered_user):
    token = registered_user["token"]
    user_id = registered_user["user"]["id"]
    today = date.today()
    foods = api_request("GET", f"/food/search?{query_string({'q': '米饭', 'limit': 1})}", token=token)

    api_request(
        "POST",
        "/food/log",
        {
            "user_id": user_id,
            "food_id": foods[0]["food_id"],
            "weight_g": 100,
            "time": "12:00",
            "log_date": (today - timedelta(days=1)).isoformat(),
        },
        token=token,
    )

    history = api_request(
        "GET",
        f"/report/food-history?{query_string({'days': 7, 'end_date': today.isoformat()})}",
        token=token,
    )

    assert len(history["daily_records"]) == 7
    yesterday = next(item for item in history["daily_records"] if item["date"] == (today - timedelta(days=1)).isoformat())
    assert yesterday["total_intake_kcal"] > 0
    assert yesterday["protein"] > 0
    assert yesterday["food_items"]
