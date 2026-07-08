from __future__ import annotations

import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from app.database import SessionLocal  # noqa: E402
from app.models import FoodDatabase  # noqa: E402
from app.services import serialize_food  # noqa: E402


def main() -> int:
    db = SessionLocal()
    try:
        foods = db.query(FoodDatabase).order_by(FoodDatabase.food_id).all()
        serialized = [serialize_food(food) for food in foods]
    finally:
        db.close()

    names: dict[str, int] = {}
    duplicates: list[str] = []
    missing_fields: list[dict] = []
    abnormal_values: list[dict] = []
    generic_images: list[dict] = []

    required_fields = ["name", "category", "calories_per_100g", "protein", "fat", "carbs", "search_text", "aliases_text"]
    for food in foods:
        names[food.name] = names.get(food.name, 0) + 1
        missing = [field for field in required_fields if getattr(food, field) in (None, "")]
        if missing:
            missing_fields.append({"food_id": food.food_id, "name": food.name, "missing": missing})
        if food.calories_per_100g < 0 or food.calories_per_100g > 1000:
            abnormal_values.append({"food_id": food.food_id, "name": food.name, "field": "calories_per_100g", "value": food.calories_per_100g})
        for field in ["protein", "fat", "carbs"]:
            value = getattr(food, field)
            if value < 0 or value > 100:
                abnormal_values.append({"food_id": food.food_id, "name": food.name, "field": field, "value": value})

    duplicates = sorted(name for name, count in names.items() if count > 1)
    for item in serialized:
        if item.get("image_key") == "meal":
            generic_images.append({"food_id": item["food_id"], "name": item["name"]})

    result = {
        "total": len(foods),
        "duplicate_names": duplicates,
        "missing_fields": missing_fields[:100],
        "abnormal_values": abnormal_values[:100],
        "generic_image_key_count": len(generic_images),
        "generic_image_key_examples": generic_images[:50],
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1 if duplicates or missing_fields or abnormal_values else 0


if __name__ == "__main__":
    raise SystemExit(main())
