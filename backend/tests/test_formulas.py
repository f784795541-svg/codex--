from __future__ import annotations

from datetime import time
from types import SimpleNamespace

from app import services


def make_user(**overrides):
    data = {
        "age": 30,
        "gender": "male",
        "height_cm": 175,
        "weight_kg": 72,
        "target_weight_kg": 68,
        "target_sleep_hours": 8,
        "goal": "fat_loss",
        "activity_level": "medium",
        "recommendation_mode": "home",
        "body_type": "balanced",
        "target_algorithm": "classic",
    }
    data.update(overrides)
    return SimpleNamespace(**data)


def test_bmr_tdee_and_macro_targets_are_stable():
    targets = services.compute_targets(make_user())

    assert targets["bmr"] == 1668.75
    assert targets["tdee"] == 2586.56
    assert targets["calorie_target"] == 2054.56
    assert targets["protein_target"] == 115.2
    assert targets["fat_target"] == 59.35
    assert targets["carb_target"] == 264.89
    assert targets["protein_per_kg"] == 1.6


def test_goal_modes_have_real_calorie_differences():
    fat_loss = services.compute_targets(make_user(goal="fat_loss", target_weight_kg=68))
    maintain = services.compute_targets(make_user(goal="maintain", target_weight_kg=72))
    muscle_gain = services.compute_targets(make_user(goal="muscle_gain", target_weight_kg=76))

    assert fat_loss["calorie_target"] < maintain["calorie_target"] < muscle_gain["calorie_target"]
    assert fat_loss["calorie_target"] == 2054.56
    assert maintain["calorie_target"] == 2586.56
    assert muscle_gain["calorie_target"] == 2854.56


def test_sleep_duration_handles_cross_day_sleep():
    assert services.sleep_duration_hours(time(23, 30), time(7, 10)) == 7.67


def test_workout_estimate_uses_fixed_met_formula():
    met, calories = services.estimate_workout_calories(72, "walking", 30)
    assert met == 2.8
    assert calories == 105.84
