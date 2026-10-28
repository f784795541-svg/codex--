from __future__ import annotations

import argparse
import csv
import io
import sys
import urllib.request
from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_LEDGER = ROOT / "reports" / "food_photo_source_ledger.csv"
DEFAULT_OUTPUT_DIR = Path(r"A:\body-food-images")
CANVAS_SIZE = 750
PRODUCT_OCCUPANCY = 0.82
MIN_UPSCALED_OCCUPANCY = 0.68
BACKGROUND = (250, 250, 248)
MAX_OUTPUT_BYTES = 300 * 1024
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/126.0.0.0 Safari/537.36"
)


def read_ledger(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        raise FileNotFoundError(f"Ledger not found: {path}")
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        return list(csv.DictReader(handle))


def download_bytes(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def download_bytes_with_headers(url: str, referer: str = "") -> bytes:
    headers = {"User-Agent": USER_AGENT}
    if referer:
        headers["Referer"] = referer
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=30) as response:
        return response.read()


def pixel_distance(pixel: tuple[int, int, int, int], reference: tuple[int, int, int, int]) -> int:
    return sum(abs(int(pixel[index]) - int(reference[index])) for index in range(3))


def is_light_neutral(pixel: tuple[int, int, int, int]) -> bool:
    channels = pixel[:3]
    return max(channels) - min(channels) <= 42 and sum(channels) / 3 >= 150


def remove_neutral_background(image: Image.Image) -> Image.Image:
    width, height = image.size
    if width < 8 or height < 8:
        return image

    pixels = image.load()
    corner_samples = [
        pixels[0, 0],
        pixels[width - 1, 0],
        pixels[0, height - 1],
        pixels[width - 1, height - 1],
    ]
    neutral_corners = [sample for sample in corner_samples if is_light_neutral(sample)]
    if not neutral_corners:
        return image

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))
        pixel = pixels[x, y]
        if not is_light_neutral(pixel):
            continue
        if min(pixel_distance(pixel, sample) for sample in neutral_corners) > 80:
            continue

        pixels[x, y] = (255, 255, 255, 0)
        if x > 0:
            queue.append((x - 1, y))
        if x + 1 < width:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y + 1 < height:
            queue.append((x, y + 1))

    return image


def normalize_image(raw_bytes: bytes) -> Image.Image:
    with Image.open(io.BytesIO(raw_bytes)) as source:
        image = source.convert("RGBA")

    image = remove_neutral_background(image)
    alpha = image.getchannel("A")
    bbox = alpha.getbbox() or image.getbbox()
    if bbox:
        image = image.crop(bbox)

    max_side = int(CANVAS_SIZE * PRODUCT_OCCUPANCY)
    image = scale_image_to_canvas(image, max_side)

    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), BACKGROUND + (255,))
    offset_x = (CANVAS_SIZE - image.width) // 2
    offset_y = (CANVAS_SIZE - image.height) // 2
    canvas.alpha_composite(image, (offset_x, offset_y))
    return canvas.convert("RGB")


def normalize_image_preserve(raw_bytes: bytes) -> Image.Image:
    with Image.open(io.BytesIO(raw_bytes)) as source:
        image = source.convert("RGBA")

    max_side = int(CANVAS_SIZE * PRODUCT_OCCUPANCY)
    image = scale_image_to_canvas(image, max_side)

    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), BACKGROUND + (255,))
    offset_x = (CANVAS_SIZE - image.width) // 2
    offset_y = (CANVAS_SIZE - image.height) // 2
    canvas.alpha_composite(image, (offset_x, offset_y))
    return canvas.convert("RGB")


def scale_image_to_canvas(image: Image.Image, max_side: int) -> Image.Image:
    image.thumbnail((max_side, max_side), Image.Resampling.LANCZOS)

    current_max_side = max(image.size)
    min_target_side = int(max_side * MIN_UPSCALED_OCCUPANCY)
    if current_max_side and current_max_side < min_target_side:
        scale = min_target_side / current_max_side
        resized = (
            max(1, round(image.width * scale)),
            max(1, round(image.height * scale)),
        )
        image = image.resize(resized, Image.Resampling.LANCZOS)
    return image


def process_row(row: dict[str, str], output_dir: Path) -> tuple[str, str]:
    image_key = (row.get("image_key") or "").strip()
    source_url = (row.get("source_url") or "").strip()
    source_referer = (row.get("source_referer") or "").strip()
    source_cache_path = (row.get("source_cache_path") or "").strip()
    status = (row.get("status") or "").strip()
    source_tier = (row.get("source_tier") or "").strip()
    background_mode = (row.get("background_mode") or "preserve").strip()

    if not image_key or not source_url:
        return "skipped", f"{image_key or '<missing>'}: missing image_key or source_url"
    if status in {"blocked", "fallback_only"}:
        return "skipped", f"{image_key}: status={status}"
    if source_tier == "local_illustration":
        return "skipped", f"{image_key}: source_tier={source_tier}"

    if source_cache_path:
        cache_path = Path(source_cache_path)
        if cache_path.exists():
            raw_bytes = cache_path.read_bytes()
        else:
            return "skipped", f"{image_key}: missing source_cache_path {cache_path}"
    else:
        raw_bytes = download_bytes_with_headers(source_url, source_referer)
    image = normalize_image(raw_bytes) if background_mode == "remove_neutral" else normalize_image_preserve(raw_bytes)
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"{image_key}.webp"
    for quality in (86, 82, 78, 74, 70, 65):
        image.save(output_path, format="WEBP", quality=quality, method=6)
        if output_path.stat().st_size <= MAX_OUTPUT_BYTES:
            break
    else:
        raise ValueError(f"normalized asset exceeds {MAX_OUTPUT_BYTES} bytes")
    return "processed", f"{image_key}: wrote {output_path}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Download and normalize food photo assets from the source ledger.")
    parser.add_argument("--ledger", type=Path, default=DEFAULT_LEDGER)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--only-key", action="append", default=[])
    args = parser.parse_args()

    rows = read_ledger(args.ledger)
    only_keys = set(args.only_key)
    processed = 0
    skipped = 0
    failed = 0

    for row in rows:
        image_key = (row.get("image_key") or "").strip()
        if only_keys and image_key not in only_keys:
            continue
        try:
            result, message = process_row(row, args.output_dir)
        except Exception as exc:  # noqa: BLE001
            failed += 1
            print(f"FAILED {image_key}: {exc}", file=sys.stderr)
            continue
        if result == "processed":
            processed += 1
            print(f"OK {message}")
        else:
            skipped += 1
            print(f"SKIP {message}")

    print(f"Processed={processed} Skipped={skipped} Failed={failed}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
