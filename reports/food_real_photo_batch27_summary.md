# Batch 27: Lawson Sugar-Free Soy Milk + Snow-Skin Mooncake Runtime Coverage

## Goal

Continue replacing runtime-visible Lawson SVG illustration fallbacks with corresponding real-photo assets in the current live search results.

This batch covered:

1. `lawson-235` `罗森 无糖豆浆`
2. `lawson-620` `罗森 冰皮月亮蛋糕`

## Source decisions

This batch used two `near_product_photo` sources.

Reason:

1. the exact official public Lawson convenience-store product pages for these live runtime keys were still unavailable or unstable from the current environment
2. these two sources were clearly corresponding drink or dessert product photos and better than keeping the old SVG fallbacks
3. each selected source matched the runtime-visible product type closely enough to improve search realism without forcing a weak third item into the batch

Per-key sources:

1. `lawson-235`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/weee/82254?lang=en`
   - source image: `https://img06.weeecdn.com/product/image/126/495/689194720B04BCD3.jpeg`
   - source note: unsweetened soy-milk carton photo used as the closest distinct near-product real-photo match for the live runtime Lawson sugar-free soy-milk key

2. `lawson-620`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Red-Bean-Snow-Skin-Mooncake/2905378`
   - source image: `https://img06.weeecdn.com/item/image/007/872/4ED22428A821D5F5.jpeg`
   - source note: snow-skin mooncake product photo used as the closest distinct near-product real-photo match for the live runtime Lawson snow-skin mooncake key

## Cached source files

Saved to:

```text
reports/candidate_images/batch27
```

Files used in this batch:

1. `lawson-235_soymilk.jpeg`
2. `lawson-620_mooncake.jpeg`

## Normalized output

Generated:

1. `A:\body-food-images\lawson-235.webp`
2. `A:\body-food-images\lawson-620.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `lawson-235 -> lawson-235.webp`
2. `lawson-620 -> lawson-620.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch27`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`

Added exact coverage for:

1. `罗森 无糖豆浆 -> lawson-235`
2. `罗森 冰皮月亮蛋糕 -> lawson-620`

Added a narrow batch-specific Playwright verifier:

1. `scripts/batch27_visual_check.cjs`

## Runtime verification

Confirmed live runtime search currently returns:

1. `罗森 无糖豆浆 -> lawson-235`
2. `罗森 冰皮月亮蛋糕 -> lawson-620`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/lawson-235.webp`
2. `http://localhost:8080/assets/foods/lawson-620.webp`

with HTTP `200`.

Confirmed narrow visual batch check JSON contains desktop and mobile hits for:

1. `/assets/foods/lawson-235.webp`
2. `/assets/foods/lawson-620.webp`

Batch-specific visual artifacts:

1. `reports/batch27_visual_check.json`
2. `reports/batch27_desktop_check.png`
3. `reports/batch27_mobile_check.png`

## Verification completed

### Static checks

1. `node --check scripts/batch27_visual_check.cjs`
2. `python -m py_compile backend/tests/test_food_image_keys.py scripts/prepare_food_photo_assets.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `103 passed, 3 warnings`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend `/health` OK
   - frontend `/` OK
   - `/food/search` OK
   - `/dashboard/summary` OK
   - no recent `500` / `Traceback` / `ERROR`

### Visual checks

1. batch-specific Playwright check saved:
   - `reports/batch27_desktop_check.png`
   - `reports/batch27_mobile_check.png`
2. desktop and mobile final search cards both resolved to:
   - `lawson-235 -> lawson-235.webp`
   - `lawson-620 -> lawson-620.webp`

## Audit and backlog refresh

Serially reran:

1. `python scripts/audit_food_images.py`
2. `python scripts/build_food_photo_backlog.py`

Updated counts:

1. `Image keys using local real photos: 93`
2. `Image keys using local illustration fallback: 513`
3. `reports/food_real_photo_backlog.csv rows=375`

Confirmed removed from backlog:

1. `lawson-235`
2. `lawson-620`

## Remaining follow-up

Still worth continuing next:

1. `711-517` `7-11 黑椒牛肉便当`
2. `711-687` `7-11 黑椒鸡扒便当`
3. `familymart-416` `全家 奥尔良鸡肉卷`
4. `familymart-229` `全家 鸡肉卷`
5. `familymart-520` `全家 黑椒牛肉便当`

## Notes

This batch moved two more runtime-visible Lawson results off SVG fallbacks in one pass. The current live search results now show distinct `.webp` assets for sugar-free soy milk and snow-skin mooncake instead of local illustration-style placeholders.
