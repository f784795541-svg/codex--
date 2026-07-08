from __future__ import annotations

from datetime import date

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
    assert weekly["daily_reports"]
