from datetime import datetime

from conftest import api_request


def test_invitation_and_workout_calendar(registered_user):
    stamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
    other = api_request("POST", "/auth/register", {
        "username": f"pk_test_{stamp}", "password": "TEST_PASSWORD_ONLY", "name": "对手",
        "age": 30, "gender": "male", "height_cm": 175, "weight_kg": 75,
        "goal": "fat_loss", "activity_level": "medium",
    })
    own_token = registered_user["token"]
    other_token = other["access_token"]
    code = api_request("POST", "/friend-pk/code", token=other_token)["code"]
    api_request("POST", "/friend-pk/invite", {"code": code}, own_token)
    incoming = api_request("GET", "/friend-pk/state", token=other_token)
    assert incoming["challenge"]["incoming"] is True
    challenge_id = incoming["challenge"]["id"]
    api_request("POST", f"/friend-pk/challenge/{challenge_id}/accept", token=other_token)
    state = api_request("GET", "/friend-pk/state", token=own_token)
    today = state["today"]
    api_request("POST", "/workout/log", {"type": "walking", "duration_min": 17,
        "calories_burned": 40, "log_date": today}, own_token)
    state = api_request("GET", "/friend-pk/state", token=own_token)
    assert state["calendar"][today] >= 17
    assert state["challenge"]["own_days"] >= 1
    habit = api_request("POST", "/friend-pk/habits", {"name": "早睡"}, own_token)
    api_request("POST", f"/friend-pk/habits/{habit['id']}/toggle", token=own_token)
    state = api_request("GET", f"/friend-pk/state?month={today[:7]}", token=own_token)
    assert state["habits"][0]["today_checked"]
    assert today in state["habits"][0]["dates"]
    assert api_request("GET", "/friend-pk/state", token=other_token)["habits"] == []
    peer_habit = api_request("POST", "/friend-pk/habits", {"name": "散步"}, other_token)
    api_request("POST", f"/friend-pk/habits/{peer_habit['id']}/toggle", token=other_token)
    state = api_request("GET", f"/friend-pk/state?month={today[:7]}", token=own_token)
    assert state["peer_habit"]["name"] == "散步"
    assert today in state["peer_habit"]["dates"]
    assert state["habits"][0]["streak"] == 1
    api_request("POST", f"/friend-pk/habits/{habit['id']}/toggle", token=own_token)
    assert not api_request("GET", "/friend-pk/state", token=own_token)["habits"][0]["today_checked"]
    api_request("POST", f"/friend-pk/challenge/{challenge_id}/leave", token=own_token)
    assert api_request("GET", "/friend-pk/state", token=other_token)["challenge"] is None
