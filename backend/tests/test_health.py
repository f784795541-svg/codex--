from __future__ import annotations

from conftest import api_request, query_string


def test_backend_health_and_basic_service_endpoints(registered_user):
    token = registered_user["token"]

    health = api_request("GET", "/health")
    search = api_request("GET", f"/food/search?{query_string({'q': '米饭', 'limit': 1})}", token=token)
    summary = api_request("GET", "/dashboard/summary", token=token)

    assert health["status"] == "ok"
    assert search
    assert summary["user"]["id"] == registered_user["user"]["id"]
