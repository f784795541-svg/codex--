# Batch 26: Lawson Chocolate Croissant + Matcha Cake Roll + Tiramisu Cup Runtime Coverage

## Goal

Continue replacing runtime-visible Lawson SVG illustration fallbacks with corresponding real-photo assets in the current live search results.

This batch covered:

1. `lawson-589` `罗森 巧克力可颂`
2. `lawson-593` `罗森 抹茶蛋糕卷`
3. `lawson-692` `罗森 提拉米苏杯`

## Source decisions

This batch used three `near_product_photo` sources.

Reason:

1. the exact official public Lawson convenience-store product pages for these live runtime keys were still unavailable or unstable from the current environment
2. these three sources were clearly corresponding bakery or dessert photos and better than keeping the old SVG fallbacks
3. each selected source matched the runtime-visible product type closely enough to improve search realism without blocking on official-page extraction

Per-key sources:

1. `lawson-589`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Chocolate-Croissant/96145`
   - source image: `https://img06.weeecdn.com/item/image/463/631/A7F1BFEF5084B62.jpeg`
   - source note: chocolate-croissant bakery photo used as the closest distinct near-product real-photo match for the live runtime Lawson chocolate croissant key

2. `lawson-593`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Matcha-Swiss-Cake-Roll-S-2pcs/2049644`
   - source image: `https://img06.weeecdn.com/item/image/800/972/29B9C98BBE5B57D0.jpeg`
   - source note: matcha swiss-roll dessert photo used as the closest distinct near-product real-photo match for the live runtime Lawson matcha cake-roll key

3. `lawson-692`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Bindi-Tiramisu-Cup-Cake/107337`
   - source image: `https://img06.weeecdn.com/product/image/461/726/556C29CCCB64B3CB.png`
   - source note: tiramisu-cup dessert photo used as the closest distinct near-product real-photo match for the live runtime Lawson tiramisu-cup key

## Cached source files

Saved to:

```text
reports/candidate_images/batch26
```

Files used in this batch:

1. `lawson-589_chocolate_croissant.jpeg`
2. `lawson-593_matcha_roll.jpeg`
3. `lawson-692_tiramisu_cup.png`

## Normalized output

Generated:

1. `A:\body-food-images\lawson-589.webp`
2. `A:\body-food-images\lawson-593.webp`
3. `A:\body-food-images\lawson-692.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `lawson-589 -> lawson-589.webp`
2. `lawson-593 -> lawson-593.webp`
3. `lawson-692 -> lawson-692.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch26`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`

Added exact coverage for:

1. `罗森 巧克力可颂 -> lawson-589`
2. `罗森 抹茶蛋糕卷 -> lawson-593`
3. `罗森 提拉米苏杯 -> lawson-692`

Added a narrow batch-specific Playwright verifier:

1. `scripts/batch26_visual_check.cjs`

## Runtime verification

Confirmed live runtime search currently returns:

1. `罗森 巧克力可颂 -> lawson-589`
2. `罗森 抹茶蛋糕卷 -> lawson-593`
3. `罗森 提拉米苏杯 -> lawson-692`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/lawson-589.webp`
2. `http://localhost:8080/assets/foods/lawson-593.webp`
3. `http://localhost:8080/assets/foods/lawson-692.webp`

with HTTP `200`.

Confirmed narrow visual batch check JSON contains desktop and mobile hits for:

1. `/assets/foods/lawson-589.webp`
2. `/assets/foods/lawson-593.webp`
3. `/assets/foods/lawson-692.webp`

Batch-specific visual artifacts:

1. `reports/batch26_visual_check.json`
2. `reports/batch26_desktop_check.png`
3. `reports/batch26_mobile_check.png`

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/batch26_visual_check.cjs`
4. `python -m py_compile backend/tests/test_food_image_keys.py scripts/prepare_food_photo_assets.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `101 passed, 3 warnings`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend `/health` OK
   - frontend `/` OK
   - `/food/search` OK
   - `/dashboard/summary` OK
   - no recent `500` / `Traceback` / `ERROR`

### Visual checks

1. batch-specific Playwright check saved:
   - `reports/batch26_desktop_check.png`
   - `reports/batch26_mobile_check.png`
2. desktop and mobile final search cards both resolved to:
   - `lawson-589 -> lawson-589.webp`
   - `lawson-593 -> lawson-593.webp`
   - `lawson-692 -> lawson-692.webp`

## Audit and backlog refresh

Serially reran:

1. `python scripts/audit_food_images.py`
2. `python scripts/build_food_photo_backlog.py`

Updated counts:

1. `Image keys using local real photos: 91`
2. `Image keys using local illustration fallback: 515`
3. `reports/food_real_photo_backlog.csv rows=377`

Confirmed removed from backlog:

1. `lawson-589`
2. `lawson-593`
3. `lawson-692`

## Remaining follow-up

Still worth continuing next:

1. `711-517` `7-11 黑椒牛肉便当`
2. `711-687` `7-11 黑椒鸡扒便当`
3. `familymart-416` `全家 奥尔良鸡肉卷`
4. `familymart-229` `全家 鸡肉卷`
5. `familymart-520` `全家 黑椒牛肉便当`

## Notes

This batch moved three more runtime-visible Lawson dessert or bakery results off SVG fallbacks in one pass. The current live search results now show distinct `.webp` assets for chocolate croissant, matcha cake roll, and tiramisu cup instead of repeating local illustration-style placeholders.
