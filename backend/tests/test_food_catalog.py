from __future__ import annotations

from app.database import SessionLocal
from app.models import FoodDatabase


def test_food_catalog_has_no_duplicate_names_and_required_fields():
    db = SessionLocal()
    try:
        foods = db.query(FoodDatabase).all()
    finally:
        db.close()

    assert foods
    names = [food.name for food in foods]
    assert len(names) == len(set(names))
    for food in foods:
        assert food.name
        assert food.category
        assert food.calories_per_100g is not None
        assert food.protein is not None
        assert food.fat is not None
        assert food.carbs is not None
        assert food.aliases_text is not None
        assert food.search_text is not None
