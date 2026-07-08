from __future__ import annotations

import csv
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
AUDIT_PATH = ROOT / "reports" / "food_image_refinement_audit.csv"
BACKLOG_PATH = ROOT / "reports" / "food_real_photo_backlog.csv"

P0_BRANDS = {
    "星巴克",
    "瑞幸",
    "红牛",
    "东鹏",
    "霸王茶姬",
    "麦当劳",
    "肯德基",
    "必胜客",
    "7-11",
    "罗森",
    "全家",
}

P1_BRANDS = {
    "米村拌饭",
    "南城香",
    "吉野家",
    "味千拉面",
    "茶百道",
    "古茗",
    "沪上阿姨",
    "喜茶",
}


def choose_priority(brand: str, tier: str) -> str:
    if brand in P0_BRANDS:
        return "P0"
    if brand in P1_BRANDS:
        return "P1"
    if tier == "A":
        return "P1"
    return "P2"


def choose_source_type(brand: str, tier: str) -> str:
    if brand in P0_BRANDS:
        return "official_public"
    if tier == "A":
        return "near_product_photo"
    return "local_illustration_or_near_photo"


def main() -> int:
    if not AUDIT_PATH.exists():
        raise FileNotFoundError(f"Missing audit file: {AUDIT_PATH}")

    seen: set[str] = set()
    rows: list[dict[str, str]] = []

    with AUDIT_PATH.open("r", encoding="utf-8-sig", newline="") as handle:
        for row in csv.DictReader(handle):
            image_key = row["image_key"]
            if not image_key or image_key in seen:
                continue
            seen.add(image_key)
            tier = row["refinement_tier"]
            brand = row["brand"]
            photo_status = row["photo_status"]
            if tier not in {"A", "B"}:
                continue
            if photo_status == "real_photo":
                continue
            rows.append(
                {
                    "image_key": image_key,
                    "name": row["name"],
                    "brand": brand,
                    "priority": choose_priority(brand, tier),
                    "refinement_tier": tier,
                    "photo_status": photo_status,
                    "suggested_source_type": choose_source_type(brand, tier),
                    "current_asset": row["frontend_asset_file"],
                    "notes": row["product_level_problem"] or row["problem"] or "",
                }
            )

    priority_order = {"P0": 0, "P1": 1, "P2": 2}
    rows.sort(key=lambda item: (priority_order[item["priority"]], item["brand"], item["name"]))
    BACKLOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with BACKLOG_PATH.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "image_key",
                "name",
                "brand",
                "priority",
                "refinement_tier",
                "photo_status",
                "suggested_source_type",
                "current_asset",
                "notes",
            ],
        )
        writer.writeheader()
        writer.writerows(rows)

    print(f"Wrote {BACKLOG_PATH} rows={len(rows)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
