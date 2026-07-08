from __future__ import annotations

from datetime import date

from conftest import api_request, query_string


def test_token_and_legacy_user_id_summary_are_consistent(registered_user):
    token = registered_user["token"]
    user_id = registered_user["user"]["id"]
    today = date.today().isoformat()

    token_summary = api_request("GET", f"/dashboard/summary?{query_string({'report_date': today})}", token=token)
    legacy_summary = api_request("GET", f"/dashboard/summary?{query_string({'user_id': user_id, 'report_date': today})}")

    assert token_summary["user"]["id"] == legacy_summary["user"]["id"] == user_id
    assert token_summary["targets"] == legacy_summary["targets"]
    assert token_summary["daily_report"]["user_id"] == legacy_summary["daily_report"]["user_id"] == user_id


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
