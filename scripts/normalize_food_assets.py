"""Normalize existing raster food assets into one small WebP per image key.

This script does not touch SVG fallbacks. It chooses the largest available raster
source for each key, writes a 750x750 WebP to both clients, and optionally removes
legacy raster extensions after the new file has been written.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import subprocess
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
CLIENT_DIRS = [ROOT / "frontend" / "assets" / "foods", ROOT / "miniprogram" / "assets" / "foods"]
REPORT_PATH = ROOT / "reports" / "food_asset_normalization_report.json"
FRONTEND_MANIFEST = ROOT / "frontend" / "assets" / "foods" / "food-image-assets.js"
MINIPROGRAM_MANIFEST = ROOT / "miniprogram" / "utils" / "foodImageAssets.js"
RASTER_EXTENSIONS = {".webp", ".jpg", ".jpeg", ".png"}
CANVAS_SIZE = 750
MAX_BYTES = 300 * 1024
BACKGROUND = (250, 250, 248)


def raster_sources() -> dict[str, list[Path]]:
    grouped: dict[str, list[Path]] = {}
    for directory in CLIENT_DIRS:
        if not directory.exists():
            continue
        for item in directory.iterdir():
            if item.is_file() and item.suffix.lower() in RASTER_EXTENSIONS:
                grouped.setdefault(item.stem, []).append(item)
    return grouped


def source_score(path: Path) -> tuple[int, int]:
    try:
        with Image.open(path) as image:
            width, height = image.size
        return width * height, path.stat().st_size
    except Exception:
        return 0, 0


def normalize(source: Path) -> Image.Image:
    with Image.open(source) as image:
        image = image.convert("RGB")
        image = ImageOps.contain(image, (610, 610), method=Image.Resampling.LANCZOS)
    canvas = Image.new("RGB", (CANVAS_SIZE, CANVAS_SIZE), BACKGROUND)
    canvas.paste(image, ((CANVAS_SIZE - image.width) // 2, (CANVAS_SIZE - image.height) // 2))
    return canvas


def save_webp(image: Image.Image, target: Path) -> int:
    temp = target.with_name(f".{target.name}.tmp.webp")
    for quality in (86, 82, 78, 74, 70, 65):
        image.save(temp, format="WEBP", quality=quality, method=6)
        if temp.stat().st_size <= MAX_BYTES:
            os.replace(temp, target)
            return quality
    if temp.exists():
        temp.unlink()
    raise ValueError(f"normalized image exceeds {MAX_BYTES} bytes: {target}")


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def write_manifests() -> None:
    source_manifest = FRONTEND_MANIFEST.read_text(encoding="utf-8") if FRONTEND_MANIFEST.exists() else ""
    source_json = source_manifest[source_manifest.find("{"):].strip().rstrip(";") if "{" in source_manifest else "{}"
    try:
        allowed_keys = set(json.loads(source_json))
    except json.JSONDecodeError:
        allowed_keys = set()
    if len(allowed_keys) > 750:
        try:
            original = subprocess.check_output(
                ["git", "show", "HEAD:frontend/assets/foods/food-image-assets.js"],
                cwd=ROOT,
                text=True,
            )
            original_json = original[original.find("{"):].strip().rstrip(";")
            allowed_keys = set(json.loads(original_json))
        except (OSError, subprocess.CalledProcessError, json.JSONDecodeError):
            pass
    assets: dict[str, str] = {}
    for item in CLIENT_DIRS[0].iterdir():
        if not item.is_file() or item.name.startswith("._"):
            continue
        if item.suffix.lower() not in RASTER_EXTENSIONS | {".svg"}:
            continue
        key = item.stem
        if allowed_keys and key not in allowed_keys:
            continue
        current = assets.get(key)
        if current is None or (item.suffix.lower() == ".webp" and not current.endswith(".webp")):
            assets[key] = item.name
    payload = "{\n" + ",\n".join(
        f'    {json.dumps(key, ensure_ascii=False)}:  {json.dumps(value, ensure_ascii=False)}'
        for key, value in sorted(assets.items())
    ) + "\n}"
    FRONTEND_MANIFEST.write_text(f"window.FOOD_IMAGE_ASSET_MAP = {payload};\n", encoding="utf-8")
    MINIPROGRAM_MANIFEST.write_text(f"module.exports = {payload};\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write normalized assets; without this flag only prints the plan")
    parser.add_argument("--prune-legacy", action="store_true", help="remove old raster extensions after writing the WebP")
    args = parser.parse_args()

    grouped = raster_sources()
    rows: list[dict[str, object]] = []
    for key, paths in sorted(grouped.items()):
        source = max(paths, key=source_score)
        row: dict[str, object] = {
            "image_key": key,
            "source": str(source.relative_to(ROOT)),
            "source_candidates": [str(path.relative_to(ROOT)) for path in paths],
            "source_bytes": source.stat().st_size,
            "target": f"{key}.webp",
            "width": CANVAS_SIZE,
            "height": CANVAS_SIZE,
            "max_bytes": MAX_BYTES,
        }
        if args.apply:
            image = normalize(source)
            targets: list[Path] = []
            for directory in CLIENT_DIRS:
                directory.mkdir(parents=True, exist_ok=True)
                target = directory / f"{key}.webp"
                save_webp(image, target)
                targets.append(target)
                if args.prune_legacy:
                    for old in paths:
                        if old.parent == directory and old.suffix.lower() != ".webp" and old.exists():
                            old.unlink()
            row["target_bytes"] = targets[0].stat().st_size
            row["sha256_frontend"] = sha256(targets[0])
            row["sha256_miniprogram"] = sha256(targets[1])
        rows.append(row)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_PATH.write_text(json.dumps({
        "canvas": f"{CANVAS_SIZE}x{CANVAS_SIZE}",
        "max_bytes": MAX_BYTES,
        "applied": args.apply,
        "pruned_legacy": args.prune_legacy,
        "raster_keys": len(rows),
        "items": rows,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Raster keys={len(rows)} apply={args.apply} prune_legacy={args.prune_legacy}")
    if args.apply:
        mismatched = [row["image_key"] for row in rows if row.get("sha256_frontend") != row.get("sha256_miniprogram")]
        oversized = [row["image_key"] for row in rows if int(row.get("target_bytes", 0)) > MAX_BYTES]
        write_manifests()
        print(f"Wrote manifests: {FRONTEND_MANIFEST.relative_to(ROOT)}, {MINIPROGRAM_MANIFEST.relative_to(ROOT)}")
        print(f"Hash mismatches={len(mismatched)} oversized={len(oversized)}")
    print(f"Wrote {REPORT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
