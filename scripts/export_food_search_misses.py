from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

from app.database import SessionLocal  # noqa: E402
from app.models import FoodSearchLog  # noqa: E402


def export_misses(limit: int) -> list[dict]:
    db = SessionLocal()
    try:
        rows = (
            db.query(
                FoodSearchLog.normalized_query,
                FoodSearchLog.query,
                FoodSearchLog.platform,
            )
            .filter(FoodSearchLog.hit_count == 0)
            .order_by(FoodSearchLog.created_at.desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "normalized_query": row.normalized_query,
                "query": row.query,
                "platform": row.platform,
            }
            for row in rows
        ]
    finally:
        db.close()


def export_top_misses(limit: int) -> list[dict]:
    db = SessionLocal()
    try:
        rows = (
            db.query(FoodSearchLog.normalized_query)
            .filter(FoodSearchLog.hit_count == 0)
            .all()
        )
    finally:
        db.close()

    counts: dict[str, int] = {}
    for row in rows:
        counts[row.normalized_query] = counts.get(row.normalized_query, 0) + 1
    return [
        {"normalized_query": query, "count": count}
        for query, count in sorted(counts.items(), key=lambda item: (-item[1], item[0]))[:limit]
    ]


def main() -> int:
    parser = argparse.ArgumentParser(description="Export recent or high-frequency missed food searches.")
    parser.add_argument("--limit", type=int, default=50)
    parser.add_argument("--top", action="store_true", help="Group by normalized query and sort by frequency.")
    args = parser.parse_args()

    result = export_top_misses(args.limit) if args.top else export_misses(args.limit)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
