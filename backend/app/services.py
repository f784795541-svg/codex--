from __future__ import annotations

import hashlib
import json
from datetime import date, datetime, time, timedelta

from sqlalchemy.orm import Session, joinedload

from . import models, schemas
from .food_metadata import get_food_aliases, get_food_image_key
from .workout_metadata import get_workout_option


ACTIVITY_FACTORS = {
    "sedentary": 1.2,
    "light": 1.375,
    "medium": 1.55,
    "high": 1.725,
}

ACTIVITY_LABELS = {
    "sedentary": "久坐",
    "light": "轻度",
    "medium": "中等",
    "high": "高强度",
}

SLEEP_STATUS_MAP = {
    "very_short": "睡眠明显不足",
    "short": "睡眠略少",
    "balanced": "睡眠较稳定",
    "long": "睡眠偏长",
}

FIXED_COOKING_CATEGORIES = {"饮品", "零食", "补剂", "油脂", "调味", "连锁餐厅", "乳制品"}
MIN_CALORIE_FLOOR_BY_GENDER = {
    "male": 1500.0,
    "female": 1200.0,
}
RECOMMENDATION_MODE_PROFILES = {
    "home": {
        "fat_loss_deficit_scale": 1.0,
        "muscle_gain_surplus_scale": 1.0,
        "maintain_shift": 0.0,
        "protein_shift": 0.0,
        "fat_ratio_shift": 0.0,
        "carb_ratio_shift": 0.0,
        "calorie_buffer": 0.0,
    },
    "fitness": {
        "fat_loss_deficit_scale": 1.08,
        "muscle_gain_surplus_scale": 1.12,
        "maintain_shift": 70.0,
        "protein_shift": 0.2,
        "fat_ratio_shift": -0.01,
        "carb_ratio_shift": 0.03,
        "calorie_buffer": 0.0,
    },
    "eat_out": {
        "fat_loss_deficit_scale": 0.92,
        "muscle_gain_surplus_scale": 0.88,
        "maintain_shift": -60.0,
        "protein_shift": 0.08,
        "fat_ratio_shift": 0.02,
        "carb_ratio_shift": -0.02,
        "calorie_buffer": -80.0,
    },
}


def clamp_macro(value: float) -> float:
    return round(max(value, 0.0), 2)


def build_adjusted_option(
    method: str,
    note: str,
    base_calories: float,
    base_protein: float,
    base_fat: float,
    base_carbs: float,
    *,
    calorie_delta: float = 0.0,
    protein_delta: float = 0.0,
    fat_delta: float = 0.0,
    carb_delta: float = 0.0,
    calorie_multiplier: float = 1.0,
    protein_multiplier: float = 1.0,
    fat_multiplier: float = 1.0,
    carb_multiplier: float = 1.0,
) -> dict[str, float | str]:
    return {
        "method": method,
        "calories_per_100g": clamp_macro(base_calories * calorie_multiplier + calorie_delta),
        "protein": clamp_macro(base_protein * protein_multiplier + protein_delta),
        "fat": clamp_macro(base_fat * fat_multiplier + fat_delta),
        "carbs": clamp_macro(base_carbs * carb_multiplier + carb_delta),
        "note": note,
    }


def generate_default_cooking_options(food: models.FoodDatabase) -> list[dict[str, float | str]]:
    if food.brand or food.category in FIXED_COOKING_CATEGORIES:
        return []

    base_calories = float(food.calories_per_100g)
    base_protein = float(food.protein)
    base_fat = float(food.fat)
    base_carbs = float(food.carbs)
    food_name = food.name
    category = food.category

    if category == "主食":
        options = [
            build_adjusted_option("原味熟制", "按当前数据库里的基础值估算，更适合普通蒸、煮、焖的做法。", base_calories, base_protein, base_fat, base_carbs),
            build_adjusted_option("清炒", "会带入一些烹调用油，热量会比原味熟制更高。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=48, fat_delta=4.5, carb_delta=1.2),
            build_adjusted_option("油煎", "煎制主食通常会额外吸收油脂，适合作为偏高热量估算。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=72, fat_delta=6.2, carb_delta=1.5),
        ]
        if any(keyword in food_name for keyword in ["粥", "小米", "燕麦"]):
            options.insert(
                1,
                build_adjusted_option(
                    "煮粥",
                    "加水后每 100g 的能量密度会明显下降，更适合记录实际成品重量。",
                    base_calories,
                    base_protein,
                    base_fat,
                    base_carbs,
                    calorie_multiplier=0.42,
                    protein_multiplier=0.42,
                    fat_multiplier=0.42,
                    carb_multiplier=0.42,
                ),
            )
        return options

    if category in {"肉类", "海鲜"}:
        steamed_label = "清蒸" if category == "海鲜" else "水煮"
        return [
            build_adjusted_option(steamed_label, "作为更清淡的估算方式，适合少油少酱的记录。", base_calories, base_protein, base_fat, base_carbs),
            build_adjusted_option("香煎", "会带入锅中用油，热量通常比水煮或清蒸更高。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=58, protein_delta=0.6, fat_delta=5.2, carb_delta=0.8),
            build_adjusted_option("烧烤", "烤制会带来一些酱料与失水，适合作为稍高热量估算。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=34, protein_delta=1.0, fat_delta=2.1, carb_delta=1.3),
            build_adjusted_option("红烧", "带酱汁和油脂时，热量会更高一些。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=74, fat_delta=5.4, carb_delta=4.8),
            build_adjusted_option("油炸", "油炸通常会显著提高脂肪和总热量，适合作为偏高估算。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=138, fat_delta=11.8, carb_delta=5.6),
            build_adjusted_option("炖煮", "如果汤汁不多，通常接近基础值；有调味时会略高一些。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=22, fat_delta=1.6, carb_delta=2.1),
        ]

    if category == "蛋类":
        return [
            build_adjusted_option("水煮", "更适合把蛋类作为相对稳定的基础估算。", base_calories, base_protein, base_fat, base_carbs),
            build_adjusted_option("蒸蛋", "整体口感更嫩，单位重量的能量密度通常会略低。", base_calories, base_protein, base_fat, base_carbs, calorie_multiplier=0.92, protein_multiplier=0.94, fat_multiplier=0.94, carb_multiplier=0.95),
            build_adjusted_option("炒蛋", "炒制会带入额外用油，热量和脂肪会上升。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=42, fat_delta=4.2, carb_delta=0.5),
            build_adjusted_option("煎蛋", "煎制通常比水煮更香，但也会稍微提高总热量。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=34, fat_delta=3.3, carb_delta=0.3),
        ]

    if category in {"蔬菜", "家常炒菜", "豆制品", "轻食"}:
        options = [
            build_adjusted_option("清水煮", "整体更清淡，适合把蔬菜本身热量看得更清楚。", base_calories, base_protein, base_fat, base_carbs),
            build_adjusted_option("清炒", "会带入一部分油脂，热量通常会温和上升。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=46, fat_delta=4.4, carb_delta=1.0),
            build_adjusted_option("蒜蓉炒", "和清炒接近，但调味会再多一点。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=56, fat_delta=4.8, carb_delta=1.8),
            build_adjusted_option("红烧", "酱汁、糖和油通常更多，适合按偏高热量估算。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=68, fat_delta=5.2, carb_delta=5.4),
        ]
        if category == "轻食":
            options.insert(
                0,
                build_adjusted_option("冷拌", "更适合沙拉、轻食和凉拌类记录。", base_calories, base_protein, base_fat, base_carbs, calorie_delta=14, fat_delta=0.8, carb_delta=0.6),
            )
        return options

    return []


def get_cooking_options(food: models.FoodDatabase) -> list[dict[str, float | str]]:
    explicit_options = parse_cooking_options(food)
    if explicit_options:
        return explicit_options
    return generate_default_cooking_options(food)


def compute_bmr(user: models.User) -> float:
    gender_adjustment = 5 if user.gender.lower() == "male" else -161
    return 10 * user.weight_kg + 6.25 * user.height_cm - 5 * user.age + gender_adjustment


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    return hash_password(password) == password_hash


def serialize_food(food: models.FoodDatabase) -> dict:
    return {
        "food_id": food.food_id,
        "name": food.name,
        "category": food.category,
        "calories_per_100g": food.calories_per_100g,
        "protein": food.protein,
        "fat": food.fat,
        "carbs": food.carbs,
        "is_custom": food.is_custom,
        "aliases": get_food_aliases(food.name, food.category),
        "image_key": get_food_image_key(food.name, food.category),
        "brand": food.brand,
        "serving_size_g": food.serving_size_g,
        "portion_hint": food.portion_hint,
        "cooking_options": get_cooking_options(food),
    }


def parse_cooking_options(food: models.FoodDatabase) -> list[dict]:
    if not food.cooking_options_json:
        return []
    try:
        options = json.loads(food.cooking_options_json)
    except json.JSONDecodeError:
        return []
    return options if isinstance(options, list) else []


def resolve_food_nutrition(food: models.FoodDatabase, cooking_method: str | None = None) -> dict[str, float | str | None]:
    base = {
        "calories_per_100g": food.calories_per_100g,
        "protein": food.protein,
        "fat": food.fat,
        "carbs": food.carbs,
        "cooking_method": None,
        "cooking_note": None,
    }
    if not cooking_method:
        return base

    for option in get_cooking_options(food):
        if option.get("method") != cooking_method:
            continue
        return {
            "calories_per_100g": float(option.get("calories_per_100g", food.calories_per_100g)),
            "protein": float(option.get("protein", food.protein)),
            "fat": float(option.get("fat", food.fat)),
            "carbs": float(option.get("carbs", food.carbs)),
            "cooking_method": option.get("method"),
            "cooking_note": option.get("note"),
        }
    return base


def estimate_workout_calories(weight_kg: float, workout_type: str, duration_min: int) -> tuple[float, float]:
    option = get_workout_option(workout_type)
    met = option["met"] if option else 4.0
    calories = met * 3.5 * weight_kg / 200 * duration_min
    return round(met, 2), round(calories, 2)


def recommended_sleep_hours(age: int) -> float:
    if age <= 17:
        return 8.5
    if age >= 65:
        return 7.5
    return 8.0


def normalized_gender(user: models.User) -> str:
    return "male" if user.gender.lower() == "male" else "female"


def age_macro_adjustments(age: int) -> dict[str, float]:
    if age < 18:
        return {
            "protein_per_kg": 1.35,
            "fat_ratio": 0.28,
            "carb_ratio": 0.52,
            "deficit_factor": 0.72,
            "surplus_factor": 0.88,
        }
    if age <= 39:
        return {
            "protein_per_kg": 1.45,
            "fat_ratio": 0.27,
            "carb_ratio": 0.48,
            "deficit_factor": 1.0,
            "surplus_factor": 1.0,
        }
    if age <= 59:
        return {
            "protein_per_kg": 1.5,
            "fat_ratio": 0.28,
            "carb_ratio": 0.46,
            "deficit_factor": 0.92,
            "surplus_factor": 0.94,
        }
    return {
        "protein_per_kg": 1.2,
        "fat_ratio": 0.3,
        "carb_ratio": 0.44,
        "deficit_factor": 0.82,
        "surplus_factor": 0.86,
    }


def gender_energy_settings(gender: str) -> dict[str, float]:
    if gender == "male":
        return {
            "fat_loss_base_deficit": 460.0,
            "fat_loss_max_deficit": 720.0,
            "muscle_gain_base_surplus": 220.0,
            "muscle_gain_max_surplus": 360.0,
        }
    return {
        "fat_loss_base_deficit": 340.0,
        "fat_loss_max_deficit": 560.0,
        "muscle_gain_base_surplus": 160.0,
        "muscle_gain_max_surplus": 280.0,
    }


def body_type_adjustments(body_type: str | None) -> dict[str, float]:
    mapping = {
        "slim": {
            "calorie_shift": 40.0,
            "protein_shift": 0.05,
            "fat_ratio_shift": -0.01,
            "carb_ratio_shift": 0.02,
        },
        "balanced": {
            "calorie_shift": 0.0,
            "protein_shift": 0.0,
            "fat_ratio_shift": 0.0,
            "carb_ratio_shift": 0.0,
        },
        "broad": {
            "calorie_shift": -40.0,
            "protein_shift": 0.08,
            "fat_ratio_shift": 0.01,
            "carb_ratio_shift": -0.02,
        },
    }
    return mapping.get(body_type or "balanced", mapping["balanced"])


def normalized_recommendation_mode(value: str | None) -> str:
    return value if value in RECOMMENDATION_MODE_PROFILES else "home"


def recommendation_mode_adjustments(mode: str) -> dict[str, float]:
    return RECOMMENDATION_MODE_PROFILES.get(mode, RECOMMENDATION_MODE_PROFILES["home"])


def protein_floor_for_profile(age: int, mode: str, goal: str) -> float:
    if age >= 65:
        floor_map = {
            "home": {"maintain": 1.2, "fat_loss": 1.25, "muscle_gain": 1.3},
            "fitness": {"maintain": 1.35, "fat_loss": 1.45, "muscle_gain": 1.5},
            "eat_out": {"maintain": 1.2, "fat_loss": 1.3, "muscle_gain": 1.35},
        }
        return floor_map.get(mode, floor_map["home"]).get(goal, 1.2)

    floor_map = {
        "home": {"maintain": 1.45, "fat_loss": 1.6, "muscle_gain": 1.65},
        "fitness": {"maintain": 1.6, "fat_loss": 1.8, "muscle_gain": 1.7},
        "eat_out": {"maintain": 1.5, "fat_loss": 1.65, "muscle_gain": 1.7},
    }
    return floor_map.get(mode, floor_map["home"]).get(goal, 1.45)


def compute_targets(user: models.User) -> dict[str, float]:
    bmr = compute_bmr(user)
    activity_factor = ACTIVITY_FACTORS.get(user.activity_level, 1.55)
    tdee = bmr * activity_factor
    gender = normalized_gender(user)
    age_profile = age_macro_adjustments(user.age)
    gender_profile = gender_energy_settings(gender)
    body_type_profile = body_type_adjustments(user.body_type)
    recommendation_mode = normalized_recommendation_mode(getattr(user, "recommendation_mode", "home"))
    recommendation_profile = recommendation_mode_adjustments(recommendation_mode)
    target_weight = user.target_weight_kg if user.target_weight_kg and user.target_weight_kg > 0 else user.weight_kg
    weight_gap = user.weight_kg - target_weight
    absolute_gap = abs(weight_gap)
    algorithm = user.target_algorithm or "classic"
    body_adjustment_enabled = algorithm == "body_type_adjusted"
    calorie_shift = body_type_profile["calorie_shift"] if body_adjustment_enabled else 0.0

    if user.goal == "fat_loss":
        deficit = gender_profile["fat_loss_base_deficit"] + absolute_gap * 18
        deficit *= age_profile["deficit_factor"]
        deficit *= recommendation_profile["fat_loss_deficit_scale"]
        deficit = min(deficit, gender_profile["fat_loss_max_deficit"])
        calorie_target = tdee - deficit + calorie_shift + recommendation_profile["calorie_buffer"]
    elif user.goal == "muscle_gain":
        surplus_gap = max(target_weight - user.weight_kg, 0)
        surplus = gender_profile["muscle_gain_base_surplus"] + surplus_gap * 12
        surplus *= age_profile["surplus_factor"]
        surplus *= recommendation_profile["muscle_gain_surplus_scale"]
        surplus = min(surplus, gender_profile["muscle_gain_max_surplus"])
        calorie_target = tdee + surplus + calorie_shift + max(recommendation_profile["calorie_buffer"], -20.0)
    else:
        maintain_shift = recommendation_profile["maintain_shift"]
        if body_adjustment_enabled:
            maintain_shift += calorie_shift * 0.35
        calorie_target = tdee + maintain_shift

    calorie_floor = MIN_CALORIE_FLOOR_BY_GENDER[gender]
    calorie_target = max(calorie_target, calorie_floor)

    reference_weight = max(user.weight_kg, target_weight) if user.goal != "maintain" else user.weight_kg
    protein_per_kg = age_profile["protein_per_kg"]
    if user.goal == "fat_loss":
        protein_per_kg += 0.15
    elif user.goal == "muscle_gain":
        protein_per_kg += 0.2
    protein_per_kg += recommendation_profile["protein_shift"]
    if body_adjustment_enabled:
        protein_per_kg += body_type_profile["protein_shift"]
    protein_per_kg = max(protein_per_kg, protein_floor_for_profile(user.age, recommendation_mode, user.goal))

    fat_ratio = age_profile["fat_ratio"]
    carb_ratio = age_profile["carb_ratio"]
    if user.goal == "fat_loss":
        fat_ratio -= 0.01
        carb_ratio -= 0.02
    elif user.goal == "muscle_gain":
        fat_ratio -= 0.01
        carb_ratio += 0.03
    else:
        carb_ratio -= 0.01

    fat_ratio += recommendation_profile["fat_ratio_shift"]
    carb_ratio += recommendation_profile["carb_ratio_shift"]
    if body_adjustment_enabled:
        fat_ratio += body_type_profile["fat_ratio_shift"]
        carb_ratio += body_type_profile["carb_ratio_shift"]

    fat_ratio = min(max(fat_ratio, 0.2), 0.35)
    carb_ratio = min(max(carb_ratio, 0.35), 0.6)

    protein_target = reference_weight * protein_per_kg
    protein_calories = protein_target * 4
    fat_target = (calorie_target * fat_ratio) / 9
    carb_calories = calorie_target - protein_calories - fat_target * 9

    if carb_calories < calorie_target * 0.25:
        minimum_carb_calories = calorie_target * 0.25
        reduction_needed = minimum_carb_calories - carb_calories
        fat_target = max((fat_target * 9 - reduction_needed) / 9, user.weight_kg * 0.55)
        carb_calories = calorie_target - protein_calories - fat_target * 9

    carb_target = max(carb_calories / 4, 0)

    return {
        "bmr": round(bmr, 2),
        "tdee": round(tdee, 2),
        "target_weight_kg": round(target_weight, 2),
        "calorie_target": round(calorie_target, 2),
        "protein_target": round(protein_target, 2),
        "fat_target": round(fat_target, 2),
        "carb_target": round(carb_target, 2),
        "goal_gap_kg": round(weight_gap, 2),
        "goal_total_calories": round(max(absolute_gap, 0) * 7700, 2),
        "gender_deficit_baseline": round(gender_profile["fat_loss_base_deficit"], 2),
        "calorie_floor": round(calorie_floor, 2),
        "protein_per_kg": round(protein_per_kg, 2),
        "fat_ratio": round(fat_ratio, 3),
        "carb_ratio": round(max(carb_target * 4 / calorie_target, 0) if calorie_target else 0, 3),
        "age_adjustment_factor": round(age_profile["deficit_factor"] if user.goal == "fat_loss" else age_profile["surplus_factor"], 2),
        "body_type_adjustment": round(calorie_shift if body_adjustment_enabled else 0, 2),
        "mode_adjustment": round(recommendation_profile["calorie_buffer"] if user.goal != "maintain" else recommendation_profile["maintain_shift"], 2),
    }


def sleep_guidance(hours: float, sleep_start: time | None = None, sleep_end: time | None = None) -> tuple[str, list[str]]:
    notes: list[str] = []
    if hours < 6:
        status = SLEEP_STATUS_MAP["very_short"]
        notes.append("睡眠时间偏短时，第二天更容易感觉疲劳、注意力下降。")
        notes.append("如果近期连续偏少，可以尝试把入睡时间逐步提前 15-30 分钟。")
    elif hours < 7:
        status = SLEEP_STATUS_MAP["short"]
        notes.append("睡眠略少时，恢复感可能会稍弱一些。")
        notes.append("保持更稳定的作息，通常比偶尔补觉更容易坚持。")
    elif hours <= 9:
        status = SLEEP_STATUS_MAP["balanced"]
        notes.append("当前睡眠时长整体处于较稳妥的区间。")
        notes.append("继续保持相对固定的入睡和起床节奏，会更有利于恢复。")
    else:
        status = SLEEP_STATUS_MAP["long"]
        notes.append("睡眠时间偏长时，也可以顺便留意最近的疲劳感和作息规律。")
        notes.append("如果只是偶尔补眠，通常不必太担心，先观察整体节奏即可。")

    if sleep_start:
        if sleep_start >= time(1, 0):
            notes.append("入睡时间比较晚时，第二天主观精神状态有时会受到一些影响。")
        elif sleep_start <= time(22, 0):
            notes.append("较早入睡通常更利于形成稳定的睡眠节律。")
    if sleep_end and sleep_start and sleep_end <= sleep_start:
        notes.append("这次记录属于跨夜睡眠，系统已按跨日时段计算。")

    return status, notes


def macro_status(actual: float, target: float, tolerance: float = 0.1) -> str:
    if target <= 0:
        return "normal"
    if actual < target * (1 - tolerance):
        return "不足"
    if actual > target * (1 + tolerance):
        return "偏高"
    return "正常"


def sleep_duration_hours(start: time, end: time) -> float:
    today = datetime.combine(date.today(), start)
    end_dt = datetime.combine(date.today(), end)
    if end_dt <= today:
        end_dt += timedelta(days=1)
    return round((end_dt - today).total_seconds() / 3600, 2)


def build_conclusion(goal: str, net_balance: float) -> str:
    if goal == "fat_loss":
        if -500 <= net_balance <= -200:
            return "轻微热量缺口，适合减脂"
        if net_balance < -500:
            return "热量缺口偏大，需关注恢复与饥饿感"
        if net_balance > 200:
            return "热量偏高，减脂进度可能受影响"
        return "热量接近目标，可继续保持"
    if goal == "muscle_gain":
        if 150 <= net_balance <= 400:
            return "热量盈余适中，有利于增肌"
        if net_balance < 0:
            return "热量不足，增肌支持不够"
        return "热量偏高，注意控制脂肪增长"
    if abs(net_balance) <= 150:
        return "热量总体平衡，适合维持体重"
    if net_balance > 150:
        return "热量略高，体重可能上升"
    return "热量略低，体重可能下降"


def build_rule_output(
    goal: str,
    intake_kcal: float,
    calorie_target: float,
    protein: float,
    protein_target: float,
    fat: float,
    fat_target: float,
    carbs: float,
    carb_target: float,
    sleep_hours: float,
    burned_kcal: float,
) -> tuple[list[str], list[str]]:
    warnings: list[str] = []
    suggestions: list[str] = []

    if protein < protein_target:
        warnings.append("蛋白质不足")
        suggestions.append("可以适度增加蛋白质来源，例如鸡胸肉、鸡蛋、牛奶或豆制品。")

    if intake_kcal > calorie_target + 500:
        warnings.append("热量超标")
        suggestions.append("如果想把热量拉回目标附近，可先从油炸食品、甜点和含糖饮料开始减少。")
    elif intake_kcal < calorie_target - 500:
        warnings.append("热量偏低")
        suggestions.append("如果近期经常偏低，可以适度补充主食和优质蛋白，避免摄入过低。")

    if fat > fat_target * 1.2:
        warnings.append("脂肪摄入偏高")
        suggestions.append("可以优先选择更清淡的烹饪方式，并稍微减少高油零食。")

    if carb_target > 0 and carbs > carb_target * 1.2:
        warnings.append("碳水摄入偏高")
        suggestions.append("可适当调整精制主食比例，搭配更多蔬菜和粗粮会更稳一些。")

    if sleep_hours < 6:
        warnings.append("睡眠不足")
        suggestions.append("如果可以，尽量把睡眠逐步往 7 小时以上调整，不必一次改很多。")

    if goal == "fat_loss" and burned_kcal < 200:
        suggestions.append("如果当天活动量不高，可考虑补一段 20-30 分钟的轻中度有氧。")

    if goal == "muscle_gain" and protein >= protein_target and intake_kcal < calorie_target:
        suggestions.append("训练后适度补充碳水和蛋白，通常更有助于恢复。")

    if not suggestions:
        suggestions.append("当前饮食、运动和作息较稳定，继续保持")

    return warnings, suggestions


def compute_daily_report(
    db: Session,
    user: models.User,
    report_date: date,
    targets: dict[str, float] | None = None,
) -> schemas.DailyReportResponse:
    targets = targets or compute_targets(user)

    food_logs = (
        db.query(models.FoodLog)
        .options(joinedload(models.FoodLog.food))
        .filter(models.FoodLog.user_id == user.id, models.FoodLog.log_date == report_date)
        .order_by(models.FoodLog.time.asc())
        .all()
    )
    workout_logs = (
        db.query(models.WorkoutLog)
        .filter(models.WorkoutLog.user_id == user.id, models.WorkoutLog.log_date == report_date)
        .all()
    )
    sleep_logs = (
        db.query(models.SleepLog)
        .filter(models.SleepLog.user_id == user.id, models.SleepLog.log_date == report_date)
        .all()
    )

    total_intake = 0.0
    total_protein = 0.0
    total_fat = 0.0
    total_carbs = 0.0
    food_items: list[schemas.FoodItemReport] = []

    for log in food_logs:
        factor = log.weight_g / 100
        nutrition = resolve_food_nutrition(log.food, log.cooking_method)
        calories = round(float(nutrition["calories_per_100g"]) * factor, 2)
        protein = round(float(nutrition["protein"]) * factor, 2)
        fat = round(float(nutrition["fat"]) * factor, 2)
        carbs = round(float(nutrition["carbs"]) * factor, 2)

        total_intake += calories
        total_protein += protein
        total_fat += fat
        total_carbs += carbs

        food_items.append(
            schemas.FoodItemReport(
                food_name=log.food.name,
                weight_g=round(log.weight_g, 2),
                cooking_method=log.cooking_method,
                calories=calories,
                protein=protein,
                fat=fat,
                carbs=carbs,
                time=log.time.strftime("%H:%M"),
            )
        )

    total_burned = round(sum(item.calories_burned for item in workout_logs), 2)
    total_sleep = round(sum(sleep_duration_hours(item.sleep_start, item.sleep_end) for item in sleep_logs), 2)
    total_expenditure = round(targets["tdee"] + total_burned, 2)
    net_balance = round(total_intake - total_expenditure, 2)
    sleep_status, sleep_notes = sleep_guidance(
        total_sleep,
        sleep_logs[-1].sleep_start if sleep_logs else None,
        sleep_logs[-1].sleep_end if sleep_logs else None,
    )

    warnings, suggestions = build_rule_output(
        goal=user.goal,
        intake_kcal=round(total_intake, 2),
        calorie_target=targets["calorie_target"],
        protein=round(total_protein, 2),
        protein_target=targets["protein_target"],
        fat=round(total_fat, 2),
        fat_target=targets["fat_target"],
        carbs=round(total_carbs, 2),
        carb_target=targets["carb_target"],
        sleep_hours=total_sleep,
        burned_kcal=total_burned,
    )
    suggestions.extend(note for note in sleep_notes if note not in suggestions)

    return schemas.DailyReportResponse(
        user_id=user.id,
        date=report_date,
        goal=user.goal,
        total_intake_kcal=round(total_intake, 2),
        total_burned_kcal=total_burned,
        total_expenditure_kcal=total_expenditure,
        net_calorie_balance=net_balance,
        calorie_target_kcal=targets["calorie_target"],
        protein=schemas.MacroStatus(
            actual=round(total_protein, 2),
            target=targets["protein_target"],
            status=macro_status(total_protein, targets["protein_target"]),
        ),
        fat=schemas.MacroStatus(
            actual=round(total_fat, 2),
            target=targets["fat_target"],
            status=macro_status(total_fat, targets["fat_target"]),
        ),
        carbs=schemas.MacroStatus(
            actual=round(total_carbs, 2),
            target=targets["carb_target"],
            status=macro_status(total_carbs, targets["carb_target"]),
        ),
        sleep_hours=total_sleep,
        sleep_status=sleep_status,
        conclusion=build_conclusion(user.goal, net_balance),
        warnings=warnings,
        suggestions=suggestions,
        food_items=food_items,
    )


def compute_weekly_report(
    db: Session,
    user: models.User,
    start_date: date,
) -> schemas.WeeklyReportResponse:
    reports: list[schemas.DailyReportResponse] = []
    shared_targets = compute_targets(user)
    for offset in range(7):
        current_date = start_date + timedelta(days=offset)
        reports.append(compute_daily_report(db, user, current_date, shared_targets))

    count = len(reports) or 1
    average_intake = round(sum(item.total_intake_kcal for item in reports) / count, 2)
    average_burned = round(sum(item.total_burned_kcal for item in reports) / count, 2)
    average_sleep = round(sum(item.sleep_hours for item in reports) / count, 2)
    average_net_balance = round(sum(item.net_calorie_balance for item in reports) / count, 2)

    return schemas.WeeklyReportResponse(
        user_id=user.id,
        start_date=start_date,
        end_date=start_date + timedelta(days=6),
        average_intake_kcal=average_intake,
        average_burned_kcal=average_burned,
        average_sleep_hours=average_sleep,
        average_net_balance=average_net_balance,
        daily_reports=reports,
    )


def build_dashboard_summary(
    db: Session,
    user: models.User,
    target_date: date,
    weight_limit: int = 14,
) -> schemas.DashboardSummaryResponse:
    targets = compute_targets(user)
    recent_weights = (
        db.query(models.WeightLog)
        .filter(models.WeightLog.user_id == user.id)
        .order_by(models.WeightLog.record_date.desc(), models.WeightLog.record_time.desc())
        .limit(max(weight_limit, 1))
        .all()
    )
    recent_weights.reverse()

    return schemas.DashboardSummaryResponse(
        user=schemas.UserResponse.model_validate(user),
        targets=targets,
        daily_report=compute_daily_report(db, user, target_date, targets),
        recent_weights=[schemas.WeightLogResponse.model_validate(item) for item in recent_weights],
    )
