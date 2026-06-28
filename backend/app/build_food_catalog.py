from __future__ import annotations

import json
from collections.abc import Iterable
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
SOURCE_DIR = BASE_DIR / "food_catalog_sources"
OUTPUT_FILE = BASE_DIR / "foods.json"
SOURCE_FILES = [
    "core_catalog.json",
    "fruits_expanded.json",
    "alcohol_brands.json",
    "regional_dishes.json",
]


def normalize_item(item: dict, next_food_id: int) -> dict:
    normalized = {
        "food_id": int(item.get("food_id") or next_food_id),
        "name": str(item["name"]).strip(),
        "category": str(item["category"]).strip(),
        "calories_per_100g": round(float(item["calories_per_100g"]), 2),
        "protein": round(float(item["protein"]), 2),
        "fat": round(float(item["fat"]), 2),
        "carbs": round(float(item["carbs"]), 2),
    }

    for optional_key in ("brand", "portion_hint", "cooking_options_json"):
        value = item.get(optional_key)
        if value not in (None, ""):
            normalized[optional_key] = value

    serving_size_g = item.get("serving_size_g")
    if serving_size_g not in (None, ""):
        normalized["serving_size_g"] = round(float(serving_size_g), 2)

    return normalized


def load_source_items() -> list[dict]:
    items: list[dict] = []
    for file_name in SOURCE_FILES:
        source_file = SOURCE_DIR / file_name
        if not source_file.exists():
            continue
        source_items = json.loads(source_file.read_text(encoding="utf-8"))
        if not isinstance(source_items, list):
            raise ValueError(f"{source_file} must contain a JSON array")
        items.extend(source_items)
    return items


def deduplicate_items(items: Iterable[dict]) -> list[dict]:
    seen_names: dict[str, dict] = {}
    ordered: list[dict] = []
    next_food_id = 1

    for raw_item in items:
        normalized = normalize_item(raw_item, next_food_id)
        existing = seen_names.get(normalized["name"])
        if existing:
            existing.update(normalized)
            continue
        seen_names[normalized["name"]] = normalized
        ordered.append(normalized)
        next_food_id += 1

    for index, item in enumerate(ordered, start=1):
        item["food_id"] = index

    return ordered


def build_food_catalog() -> list[dict]:
    return deduplicate_items(load_source_items())


def write_food_catalog(items: list[dict]) -> None:
    OUTPUT_FILE.write_text(
        json.dumps(items, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    write_food_catalog(build_food_catalog())


if __name__ == "__main__":
    main()
