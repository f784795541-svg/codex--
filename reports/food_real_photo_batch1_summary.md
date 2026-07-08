# Food Real Photo Batch 1 Summary

## Scope

- Goal: start the real product photo pipeline with official public materials first.
- Batch completed: Starbucks China official menu items.
- Local real photo library: `A:\body-food-images`

## Verified Real Photo Keys

- `starbucks-626` -> Starbucks latte
- `starbucks-627` -> Starbucks caffe americano
- `starbucks-628` -> Starbucks mocha frappuccino
- `starbucks-629` -> Starbucks blueberry muffin
- `starbucks-680` -> Starbucks vanilla latte
- `starbucks-681` -> Starbucks green tea frappuccino
- `starbucks-682` -> Starbucks cold brew

## Current Counts

- Real photo assets in manifest: `7`
- Local illustration fallback assets: `599`
- Total runtime image keys: `606`

## Validation Evidence

- `scripts/sync_food_photo_assets.ps1` -> `RealPhotoAssets=7`
- `scripts/audit_food_images.py` -> `foods=744 image_keys=606 high=0`
- `reports/food_image_refinement_summary.md` -> `Image keys using local real photos: 7`
- `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q` -> `42 passed`
- `docker exec health_backend python -m pytest /app/tests -q` -> `99 passed`
- `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1` -> backend/frontend/search/dashboard healthy
- `reports/visual_food_image_check.json` confirms:
  - `starbucks-626` -> `/assets/foods/starbucks-626.webp`
  - `starbucks-627` -> `/assets/foods/starbucks-627.webp`
  - `starbucks-628` -> `/assets/foods/starbucks-628.webp`
  - `starbucks-629` -> `/assets/foods/starbucks-629.webp`
  - `starbucks-680` -> `/assets/foods/starbucks-680.webp`
  - `starbucks-681` -> `/assets/foods/starbucks-681.webp`
  - `starbucks-682` -> `/assets/foods/starbucks-682.webp`

## Still Pending

- `redbull-406`
- `luckin-622`
- `luckin-623`
- `luckin-678`
- `711-611`
- `lawson-689`
- `mcd-139`
- `kfc-156`
- `pizzahut-648`

## Notes

- Starbucks official product pages were stable enough to download directly from public product image URLs.
- Red Bull official page was listed in the ledger but blocked direct shell fetch in the current environment.
- Luckin public menu pages were reachable, but direct product-specific image extraction was not stable enough for this batch.
- The current normalization path standardizes canvas size and output format first. More aggressive background unification should stay opt-in per ledger row to avoid damaging official images.
