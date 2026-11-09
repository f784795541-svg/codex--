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
