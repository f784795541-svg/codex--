from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from .. import dependencies, models, schemas, services
from ..database import get_db
from ..food_metadata import compact_search_text, food_matches_query, split_search_query_tokens


router = APIRouter()


@router.get("/food/database", response_model=list[schemas.FoodResponse])
def get_food_database(
    limit: int = Query(200, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    foods = db.query(models.FoodDatabase).order_by(models.FoodDatabase.food_id).offset(offset).limit(limit).all()
    return [services.serialize_food(food) for food in foods]


def log_food_search_miss(
    db: Session,
    query: str,
    normalized_query: str,
    platform: str | None,
    user_id: int | None,
) -> None:
    db.add(
        models.FoodSearchLog(
            query=query[:200],
            normalized_query=normalized_query[:200],
            platform=platform[:30] if platform else None,
            user_id=user_id,
            hit_count=0,
        )
    )
    db.commit()


@router.get("/food/search", response_model=list[schemas.FoodResponse])
def search_food(
    q: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=50),
    platform: str | None = Query(None, max_length=30),
    user_id: int | None = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    resolved_user_id = dependencies.resolve_optional_user_id(user_id, current_user)
    query = q.strip()
    normalized_query = compact_search_text(query)
    if not normalized_query:
        return []
    candidate_limit = max(limit * 5, 80)
    like_query = f"%{query}%"
    compact_like_query = f"%{normalized_query}%"
    query_tokens = split_search_query_tokens(query)
    candidate_filters = [
        or_(
            models.FoodDatabase.search_text.ilike(compact_like_query),
            models.FoodDatabase.aliases_text.ilike(like_query),
            models.FoodDatabase.name.ilike(like_query),
            models.FoodDatabase.brand.ilike(like_query),
            models.FoodDatabase.category.ilike(like_query),
        )
    ]
    if query_tokens:
        candidate_filters.append(
            and_(
                *[
                    or_(
                        models.FoodDatabase.search_text.ilike(f"%{token}%"),
                        models.FoodDatabase.aliases_text.ilike(f"%{token}%"),
                        models.FoodDatabase.name.ilike(f"%{token}%"),
                        models.FoodDatabase.brand.ilike(f"%{token}%"),
                        models.FoodDatabase.category.ilike(f"%{token}%"),
                    )
                    for token in query_tokens
                ]
            )
        )
    foods = (
        db.query(models.FoodDatabase)
        .filter(or_(models.FoodDatabase.status == "active", models.FoodDatabase.status.is_(None)))
        .filter(or_(*candidate_filters))
        .order_by(models.FoodDatabase.food_id)
        .limit(candidate_limit)
        .all()
    )
    matched: list[tuple[int, models.FoodDatabase]] = []
    for food in foods:
        is_match, score = food_matches_query(food.name, food.category, query, food.brand, food.aliases_text)
        if is_match:
            matched.append((score, food))

    matched.sort(key=lambda item: (-item[0], item[1].food_id))
    results = [services.serialize_food(food) for _, food in matched[:limit]]
    if not results:
        log_food_search_miss(db, query, normalized_query, platform, resolved_user_id)
    return results


@router.post("/food/search/selection")
def record_food_search_selection(
    payload: schemas.FoodSearchSelectionCreate,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(dependencies.get_optional_current_user),
):
    resolved_user_id = dependencies.resolve_optional_user_id(payload.user_id, current_user)
    food = db.get(models.FoodDatabase, payload.food_id)
    if not food:
        raise HTTPException(status_code=404, detail="食物不存在")

    query = payload.query.strip()
    normalized_query = compact_search_text(query)
    if not normalized_query:
        raise HTTPException(status_code=400, detail="搜索词不能为空")

    db.add(
        models.FoodSearchLog(
            query=query[:200],
            normalized_query=normalized_query[:200],
            platform=payload.platform[:30] if payload.platform else None,
            user_id=resolved_user_id,
            hit_count=1,
            chosen_food_id=food.food_id,
        )
    )
    db.commit()
    return {"message": "搜索选择已记录", "food_id": food.food_id}
