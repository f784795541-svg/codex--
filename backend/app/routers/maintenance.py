from __future__ import annotations

import os
from collections import Counter
from pathlib import Path

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, services
from ..database import get_db
from ..error_tracking import recent_api_errors


router = APIRouter(prefix="/maintenance")


def require_maintenance_token(x_maintenance_token: str | None = Header(default=None)) -> None:
    expected = os.getenv("MAINTENANCE_TOKEN", "").strip()
    if not expected:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="维护接口未启用")
    if not x_maintenance_token or x_maintenance_token != expected:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="维护权限不足")


def top_misses(rows: list[models.FoodSearchLog], limit: int = 20) -> list[dict[str, int | str]]:
    counter = Counter(row.normalized_query for row in rows if row.hit_count == 0)
    return [
        {"normalized_query": query, "count": count}
        for query, count in counter.most_common(limit)
    ]


def catalog_quality(db: Session) -> dict:
    foods = db.query(models.FoodDatabase).order_by(models.FoodDatabase.food_id).all()
    missing_images: list[dict[str, int | str]] = []
    abnormal_foods: list[dict[str, int | str | float]] = []
    for food in foods:
        serialized = services.serialize_food(food)
        if serialized["image_key"] == "meal":
            missing_images.append({"food_id": food.food_id, "name": food.name})
        if food.calories_per_100g < 0 or food.calories_per_100g > 1000:
            abnormal_foods.append({"food_id": food.food_id, "name": food.name, "field": "calories_per_100g", "value": food.calories_per_100g})
        for field in ["protein", "fat", "carbs"]:
            value = getattr(food, field)
            if value < 0 or value > 100:
                abnormal_foods.append({"food_id": food.food_id, "name": food.name, "field": field, "value": value})
    return {
        "missing_image_mapping_count": len(missing_images),
        "missing_image_mapping_examples": missing_images[:50],
        "abnormal_foods": abnormal_foods[:50],
    }


def backup_status() -> dict:
    backup_dir = Path(os.getenv("BACKUP_DIR", "/app/backups/db"))
    if not backup_dir.exists():
        return {"available": False, "path": str(backup_dir), "latest": None, "count": 0}
    files = sorted(backup_dir.glob("*.dump"), key=lambda item: item.stat().st_mtime, reverse=True)
    latest = files[0] if files else None
    return {
        "available": True,
        "path": str(backup_dir),
        "latest": latest.name if latest else None,
        "count": len(files),
    }


@router.get("/summary", dependencies=[Depends(require_maintenance_token)])
def maintenance_summary(db: Session = Depends(get_db)):
    recent_logs = db.query(models.FoodSearchLog).order_by(models.FoodSearchLog.created_at.desc()).limit(100).all()
    recent_misses = [row for row in recent_logs if row.hit_count == 0]
    recent_searches = [
        {
            "query": row.query,
            "normalized_query": row.normalized_query,
            "platform": row.platform,
            "hit_count": row.hit_count,
            "chosen_food_id": row.chosen_food_id,
        }
        for row in recent_logs[:20]
    ]
    quality = catalog_quality(db)
    return {
        "user_count": db.query(func.count(models.User.id)).scalar(),
        "food_count": db.query(func.count(models.FoodDatabase.food_id)).scalar(),
        "recent_search_terms": recent_searches,
        "recent_missed_terms": [
            {"query": row.query, "normalized_query": row.normalized_query, "platform": row.platform}
            for row in recent_misses[:20]
        ],
        "top_missed_terms": top_misses(recent_logs),
        "missing_image_mapping_count": quality["missing_image_mapping_count"],
        "missing_image_mapping_examples": quality["missing_image_mapping_examples"],
        "abnormal_foods": quality["abnormal_foods"],
        "recent_api_errors": recent_api_errors(),
        "backup_status": backup_status(),
    }
