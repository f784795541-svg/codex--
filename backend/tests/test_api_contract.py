from __future__ import annotations

from datetime import date
import pytest

from conftest import api_request, query_string


def test_summary_requires_login(registered_user):
    token = registered_user["token"]
    user_id = registered_user["user"]["id"]
    today = date.today().isoformat()

    token_summary = api_request("GET", f"/dashboard/summary?{query_string({'report_date': today})}", token=token)
    assert token_summary["user"]["id"] == user_id
    with pytest.raises(AssertionError, match="failed with 401"):
        api_request("GET", f"/dashboard/summary?{query_string({'user_id': user_id, 'report_date': today})}")


def test_same_search_keyword_returns_same_core_result_for_all_clients(registered_user):
    token = registered_user["token"]
    keyword = "麦当劳 双吉"
    path = f"/food/search?{query_string({'q': keyword, 'limit': 3})}"

    web_results = api_request("GET", f"{path}&platform=web", token=token)
    mobile_results = api_request("GET", f"{path}&platform=mobile_web", token=token)
    miniprogram_results = api_request("GET", f"{path}&platform=miniprogram", token=token)

    assert web_results
    assert [item["food_id"] for item in web_results] == [item["food_id"] for item in mobile_results]
    assert [item["food_id"] for item in web_results] == [item["food_id"] for item in miniprogram_results]
    assert web_results[0]["name"] == mobile_results[0]["name"] == miniprogram_results[0]["name"]


@pytest.mark.parametrize("path", [
    "/user/info", "/dashboard/summary", "/report/daily",
    "/report/weekly", "/report/food-history", "/weight/history",
])
def test_private_reads_reject_another_user_id(registered_user, path):
    query = query_string({"user_id": registered_user["user"]["id"] + 1000000})
    with pytest.raises(AssertionError, match="failed with 403"):
        api_request("GET", f"{path}?{query}", token=registered_user["token"])


def test_invalid_token_is_rejected():
    with pytest.raises(AssertionError, match="failed with 401"):
        api_request("GET", "/user/info", token="TEST_INVALID_TOKEN")


def test_custom_food_creation_requires_login():
    existing = api_request("GET", "/food/database?limit=1")[0]
    payload = {
        "name": existing["name"], "category": "custom", "calories_per_100g": 100,
        "protein": 1, "fat": 1, "carbs": 1,
    }
    with pytest.raises(AssertionError, match="failed with 401"):
        api_request("POST", "/food/create", payload)


def test_food_delete_cannot_remove_another_users_record(registered_user):
    token = registered_user["token"]
    food = api_request("GET", f"/food/search?{query_string({'q': '米饭', 'limit': 1})}")[0]
    created = api_request("POST", "/food/log", {"food_id": food["food_id"], "weight_g": 10, "time": "12:00"}, token)
    other = api_request("POST", "/auth/register", {
        "username": f"{registered_user['username']}_other", "password": "TEST_PASSWORD_ONLY",
        "name": "Isolation Test", "age": 30, "gender": "male", "height_cm": 170, "weight_kg": 70,
    })
    with pytest.raises(AssertionError, match="failed with 404"):
        api_request("DELETE", f"/food/log/{created['id']}", token=other["access_token"])
    report = api_request("GET", "/report/daily", token=token)
    assert any(item["id"] == created["id"] for item in report["food_items"])
