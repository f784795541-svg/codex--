# Batch 25: Lawson Iced Americano + Sugar-Free Jasmine Tea + Tea Egg Runtime Coverage

## Goal

Continue replacing runtime-visible Lawson SVG illustration fallbacks with corresponding real-photo assets in the current live search results.

This batch covered:

1. `lawson-590` `罗森 冰美式咖啡`
2. `lawson-621` `罗森 无糖茉莉花茶`
3. `lawson-234` `罗森 茶叶蛋`

## Source decisions

This batch used three `near_product_photo` sources.

Reason:

1. the exact official public Lawson convenience-store product pages for these live runtime keys were still unavailable or unstable from the current environment
2. these three sources were clearly corresponding real product photos and better than keeping the old SVG fallbacks
3. each selected source matched the runtime-visible product type closely enough to improve search realism without blocking on official-page extraction

Per-key sources:

1. `lawson-590`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/UCC-Black-Coffee-Drink--Unsweetened/62481`
   - source image: `https://img06.weeecdn.com/item/image/047/661/34C337423C04A727.jpg`
   - source note: bottled black-coffee product photo used as the closest distinct near-product real-photo match for the live runtime Lawson iced Americano key

2. `lawson-621`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Oriental-Leaf-Jasmine-tea-7/2992752`
   - source image: `https://img06.weeecdn.com/item/image/369/394/5E0F9DDB1F9065D6.png.jpeg`
   - source note: bottled jasmine-tea product photo used as the closest distinct near-product real-photo match for the live runtime Lawson sugar-free jasmine tea key

3. `lawson-234`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Tea-Eggs-Five-Spice-5-pieces/106715?trace_id=41dac22c-8101-4127-8749-af54ae4b4b55`
   - source image: `https://img06.weeecdn.com/product/image/695/223/3B75BEE512399A44.png`
   - source note: packaged tea-egg product photo used as the closest distinct near-product real-photo match for the live runtime Lawson tea egg key

## Cached source files

Saved to:

```text
reports/candidate_images/batch25
```

Files used in this batch:

1. `lawson-590_ucc_black_coffee.jpg`
2. `lawson-621_oriental_leaf_jasmine_tea.jpg`
3. `lawson-234_tea_eggs.png`

## Normalized output

Generated:

1. `A:\body-food-images\lawson-590.webp`
2. `A:\body-food-images\lawson-621.webp`
3. `A:\body-food-images\lawson-234.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `lawson-590 -> lawson-590.webp`
2. `lawson-621 -> lawson-621.webp`
3. `lawson-234 -> lawson-234.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch25`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `罗森 冰美式咖啡 -> lawson-590`
2. `罗森 无糖茉莉花茶 -> lawson-621`
3. `罗森 茶叶蛋 -> lawson-234`

Added a narrow batch-specific Playwright verifier:

1. `scripts/batch25_visual_check.cjs`

## Runtime verification

Confirmed live runtime search currently returns:

1. `罗森 冰美式咖啡 -> lawson-590`
2. `罗森 无糖茉莉花茶 -> lawson-621`
3. `罗森 茶叶蛋 -> lawson-234`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/lawson-590.webp`
2. `http://localhost:8080/assets/foods/lawson-621.webp`
3. `http://localhost:8080/assets/foods/lawson-234.webp`

with HTTP `200`.

Confirmed narrow visual batch check JSON contains desktop and mobile hits for:

1. `/assets/foods/lawson-590.webp`
2. `/assets/foods/lawson-621.webp`
3. `/assets/foods/lawson-234.webp`

Batch-specific visual artifacts:

1. `reports/batch25_visual_check.json`
2. `reports/batch25_desktop_check.png`
3. `reports/batch25_mobile_check.png`

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `node --check scripts/batch25_visual_check.cjs`
5. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `98 passed, 3 warnings`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend `/health` OK
   - frontend `/` OK
   - `/food/search` OK
   - `/dashboard/summary` OK
   - no recent `500` / `Traceback` / `ERROR`

### Visual checks

1. batch-specific Playwright check saved:
   - `reports/batch25_desktop_check.png`
   - `reports/batch25_mobile_check.png`
2. desktop and mobile final search cards both resolved to:
   - `lawson-590 -> lawson-590.webp`
   - `lawson-621 -> lawson-621.webp`
   - `lawson-234 -> lawson-234.webp`

## Audit and backlog refresh

Serially reran:

1. `python scripts/audit_food_images.py`
2. `python scripts/build_food_photo_backlog.py`

Updated counts:

1. `Image keys using local real photos: 88`
2. `Image keys using local illustration fallback: 518`
3. `reports/food_real_photo_backlog.csv rows=380`

Confirmed removed from backlog:

1. `lawson-590`
2. `lawson-621`
3. `lawson-234`

## Remaining follow-up

Still worth continuing next:

1. `711-517` `7-11 黑椒牛肉便当`
2. `711-687` `7-11 黑椒鸡扒便当`
3. `familymart-416` `全家 奥尔良鸡肉卷`
4. `familymart-229` `全家 鸡肉卷`
5. `familymart-520` `全家 黑椒牛肉便当`

## Notes

This batch moved three more runtime-visible Lawson results off SVG fallbacks in one pass. The current live search results now show distinct `.webp` assets for iced Americano, sugar-free jasmine tea, and tea egg instead of repeating local illustration-style placeholders.
