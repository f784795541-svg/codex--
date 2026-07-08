from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

import pytest


API_BASE = os.getenv("HEALTH_API_BASE", "http://localhost:8000").rstrip("/")


def api_request(method: str, path: str, payload: dict | None = None, token: str | None = None):
    data = None
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    if payload is not None:
        data = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"{API_BASE}{path}",
        data=data,
        headers=headers,
        method=method.upper(),
    )
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            body = response.read()
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise AssertionError(f"{method} {path} failed with {exc.code}: {detail}") from exc
    if not body:
        return None
    return json.loads(body.decode("utf-8"))


def query_string(params: dict) -> str:
    return urllib.parse.urlencode(params)


@pytest.fixture(scope="session")
def registered_user():
    username = f"pytest_stability_{int(time.time() * 1000)}"
    password = "TestPass123456"
    payload = {
        "username": username,
        "password": password,
        "name": "回归测试用户",
        "age": 30,
        "gender": "male",
        "height_cm": 175,
        "weight_kg": 72,
        "target_weight_kg": 68,
        "target_sleep_hours": 8,
        "goal": "fat_loss",
        "activity_level": "medium",
        "recommendation_mode": "home",
    }
    register = api_request("POST", "/auth/register", payload)
    assert register["access_token"]
    login = api_request("POST", "/auth/login", {"username": username, "password": password})
    assert login["access_token"]
    return {
        "username": username,
        "password": password,
        "user": login["user"],
        "token": login["access_token"],
    }
