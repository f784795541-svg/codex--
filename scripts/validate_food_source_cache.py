"""Verify that verified source-ledger caches are readable, complete images."""
from __future__ import annotations

import csv
import sys
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "reports" / "food_photo_source_ledger.csv"


def main() -> int:
    rows = list(csv.DictReader(LEDGER.open("r", encoding="utf-8-sig", newline="")))
    checked = 0
    failures: list[str] = []
    for row in rows:
        if (row.get("status") or "").strip() != "verified":
            continue
        checked += 1
        key = (row.get("image_key") or "<missing>").strip()
        cache = Path((row.get("source_cache_path") or "").strip())
        if not cache.exists():
            failures.append(f"{key}: missing cache {cache}")
            continue
        try:
            with Image.open(cache) as image:
                image.verify()
        except Exception as exc:  # noqa: BLE001
            failures.append(f"{key}: invalid image cache ({exc})")

    print(f"verified={checked} failures={len(failures)}")
    for failure in failures:
        print(f"FAIL {failure}", file=sys.stderr)
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
