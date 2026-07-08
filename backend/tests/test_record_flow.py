from __future__ import annotations

from datetime import date

from conftest import api_request, query_string


def test_record_flow_writes_all_core_logs(registered_user):
    token = registered_user["token"]
    user_id = registered_user["user"]["id"]
    today = date.today().isoformat()

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
