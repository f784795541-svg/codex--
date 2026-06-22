from __future__ import annotations

from typing import Any


WORKOUTS: list[dict[str, Any]] = [
    {"type": "running_easy", "label": "慢跑", "met": 7.0, "category": "有氧"},
    {"type": "running", "label": "跑步", "met": 9.8, "category": "有氧"},
    {"type": "walking", "label": "散步", "met": 2.8, "category": "日常活动"},
    {"type": "brisk_walking", "label": "快走", "met": 4.3, "category": "有氧"},
    {"type": "hiking", "label": "徒步", "met": 6.0, "category": "户外"},
    {"type": "cycling_leisure", "label": "骑行（休闲）", "met": 6.8, "category": "有氧"},
    {"type": "cycling_vigorous", "label": "骑行（高强度）", "met": 10.0, "category": "有氧"},
    {"type": "elliptical", "label": "椭圆机", "met": 5.0, "category": "器械"},
    {"type": "rowing_machine", "label": "划船机", "met": 7.0, "category": "器械"},
    {"type": "stair_climber", "label": "爬楼机", "met": 8.8, "category": "器械"},
    {"type": "strength_training_light", "label": "力量训练（轻）", "met": 3.5, "category": "力量"},
    {"type": "strength_training", "label": "力量训练", "met": 6.0, "category": "力量"},
    {"type": "crossfit", "label": "功能训练", "met": 8.0, "category": "力量"},
    {"type": "hiit", "label": "HIIT", "met": 8.5, "category": "高强度"},
    {"type": "jump_rope", "label": "跳绳", "met": 12.3, "category": "高强度"},
    {"type": "boxing", "label": "拳击训练", "met": 7.8, "category": "运动项目"},
    {"type": "martial_arts", "label": "武术 / 搏击", "met": 10.3, "category": "运动项目"},
    {"type": "basketball", "label": "篮球", "met": 6.5, "category": "球类"},
    {"type": "football", "label": "足球", "met": 7.0, "category": "球类"},
    {"type": "badminton", "label": "羽毛球", "met": 5.5, "category": "球类"},
    {"type": "table_tennis", "label": "乒乓球", "met": 4.0, "category": "球类"},
    {"type": "tennis", "label": "网球", "met": 7.3, "category": "球类"},
    {"type": "swimming_easy", "label": "游泳（轻松）", "met": 6.0, "category": "水上"},
    {"type": "swimming", "label": "游泳", "met": 8.0, "category": "水上"},
    {"type": "dance", "label": "跳舞", "met": 5.0, "category": "有氧"},
    {"type": "aerobics", "label": "健身操", "met": 6.5, "category": "有氧"},
    {"type": "pilates", "label": "普拉提", "met": 3.0, "category": "恢复"},
    {"type": "yoga", "label": "瑜伽", "met": 2.8, "category": "恢复"},
]

WORKOUT_MAP = {item["type"]: item for item in WORKOUTS}


def get_workout_option_list() -> list[dict[str, Any]]:
    return WORKOUTS


def get_workout_option(workout_type: str) -> dict[str, Any] | None:
    return WORKOUT_MAP.get(workout_type)

