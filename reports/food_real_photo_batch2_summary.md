# Food Real Photo Batch 2 Summary

## Scope

- Goal: expand real product-photo coverage beyond Starbucks.
- Batch completed: Red Bull official product can, Luckin official/public menu images, McDonalds China double cheeseburger.

## Newly Verified Real Photo Keys

- `redbull-406` -> Red Bull official can packshot
- `luckin-622` -> Luckin Coconut Latte mapped to 生椰拿铁
- `luckin-623` -> Luckin Velvet Latte used as closest official product-like image for 厚乳拿铁
- `luckin-678` -> Luckin Coconut Velvet Latte used as closest official product-like image for 椰云拿铁
- `mcd-139` -> McDonalds China double cheeseburger

## Runtime Count After Batch 2

- Real photo assets in manifest: `12`
- Local illustration fallback assets: `594`
- Total runtime image keys: `606`

## Important Regression Fix

- Fixed frontend image-priority regression in `frontend/app.js`.
- `resolveRegularFoodImagePath(food)` now honors backend `food.image_key` before old exact-name fallback rules.
- This was required because `mcd-139.webp` existed locally but the page still rendered an old hardcoded SVG mapping.

## Validation Evidence

- `scripts/sync_food_photo_assets.ps1` -> `RealPhotoAssets=12`
- `scripts/audit_food_images.py` -> `foods=744 image_keys=606 high=0`
- `reports/food_image_refinement_summary.md` -> `Image keys using local real photos: 12`
- `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q` -> `42 passed`
- `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1` -> backend/frontend/search/dashboard healthy
- `reports/visual_food_image_check.json` confirms:
  - `mcd-139` -> `/assets/foods/mcd-139.webp`
  - `luckin-622` -> `/assets/foods/luckin-622.webp`
  - `luckin-623` -> `/assets/foods/luckin-623.webp`
  - `luckin-678` -> `/assets/foods/luckin-678.webp`
  - `redbull-406` -> `/assets/foods/redbull-406.webp`

## Remaining Priority Targets

- `711-611`
- `lawson-689`
- `kfc-156`
- `pizzahut-648`

## Notes

- Red Bull official page was not stable for shell-only fetch, but the browser page exposed the official packshot URL directly.
- Luckin public menu assets were accessible through the official site CDN and are now usable as public official or official-channel-like product images.
- For Luckin:
  - `luckin-622` is exact enough to classify as official public.
  - `luckin-623` and `luckin-678` are currently the closest official product-like images from the public menu and remain documented as such.
