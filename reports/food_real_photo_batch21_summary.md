# Batch 21: 7-11 Tuna Rice Ball + Tea Egg + Chicken Salad + Teriyaki Chicken Bento Runtime Coverage

## Goal

Continue replacing runtime-visible 7-11 SVG illustration fallbacks with corresponding real-photo assets in the current live search results.

This batch covered:

1. `711-222` `7-11 金枪鱼饭团`
2. `711-223` `7-11 茶叶蛋`
3. `711-411` `7-11 照烧鸡腿便当`
4. `711-412` `7-11 鸡胸肉沙拉`

## Source decisions

This batch used four `near_product_photo` sources.

Reason:

1. the exact official public 7-11 product pages for these four live runtime keys were still blocked or unavailable from the current environment
2. distinct real packaged or plated food photos were better than keeping the old SVG fallbacks
3. each selected source matched the runtime-visible food shape closely enough to improve search realism without waiting on blocked official-page extraction

Per-key sources:

1. `711-222`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Jayone-Tuna-Mayo-Rice-Ball/101171`
   - source image: `https://img06.weeecdn.com/product/image/422/444/7052B440B6F230E1.png`
   - source note: packaged tuna-mayo rice-ball product image used as the closest distinct near-product match for the live runtime 7-11 tuna rice-ball key

2. `711-223`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Tea-Eggs-Five-Spice-5-pieces/106715?trace_id=41dac22c-8101-4127-8749-af54ae4b4b55`
   - source image: `https://img06.weeecdn.com/product/image/695/223/3B75BEE512399A44.png`
   - source note: packaged tea-egg product image used as the closest distinct near-product match for the live runtime 7-11 tea-egg key

3. `711-411`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Teriyaki-Chicken-Combo-Set-aside-Spicy-Sauce-/2958860`
   - source image: `https://img06.weeecdn.com/item/image/186/102/56855B3156B8653E.jpeg`
   - source note: teriyaki chicken combo-set meal photo used as the closest distinct near-product match for the live runtime 7-11 teriyaki chicken bento key

4. `711-412`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Chicken-Salad/2085909`
   - source image: `https://img06.weeecdn.com/item/image/863/215/326D1C01A2CEA487.jpeg`
   - source note: chicken-salad plated photo used as the closest distinct near-product match for the live runtime 7-11 chicken-salad key

## Cached source files

Saved to:

```text
reports/candidate_images/batch21
```

Files used in this batch:

1. `711-222_tuna_riceball.png`
2. `711-223_tea_eggs.png`
3. `711-411_teriyaki_chicken_bento.jpeg`
4. `711-412_chicken_salad.jpeg`

## Normalized output

Generated:

1. `A:\body-food-images\711-222.webp`
2. `A:\body-food-images\711-223.webp`
3. `A:\body-food-images\711-411.webp`
4. `A:\body-food-images\711-412.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `711-222 -> 711-222.webp`
2. `711-223 -> 711-223.webp`
3. `711-411 -> 711-411.webp`
4. `711-412 -> 711-412.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch21`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `7-11 金枪鱼饭团 -> 711-222`
2. `7-11 茶叶蛋 -> 711-223`
3. `7-11 照烧鸡腿便当 -> 711-411`
4. `7-11 鸡胸肉沙拉 -> 711-412`

## Runtime verification

Confirmed live runtime search currently returns:

1. `7-11 金枪鱼饭团 -> 711-222`
2. `7-11 茶叶蛋 -> 711-223`
3. `7-11 照烧鸡腿便当 -> 711-411`
4. `7-11 鸡胸肉沙拉 -> 711-412`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/711-222.webp`
2. `/assets/foods/711-223.webp`
3. `/assets/foods/711-411.webp`
4. `/assets/foods/711-412.webp`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/711-222.webp`
2. `http://localhost:8080/assets/foods/711-223.webp`
3. `http://localhost:8080/assets/foods/711-411.webp`
4. `http://localhost:8080/assets/foods/711-412.webp`

with HTTP `200`.

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `85 passed, 3 warnings`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend `/health` OK
   - frontend `/` OK
   - `/food/search` OK
   - `/dashboard/summary` OK
   - no recent `500` / `Traceback` / `ERROR`

### Visual checks

1. `node scripts/visual_food_image_check.cjs`
2. `reports/visual_food_image_check.json`
3. `reports/visual_desktop_food_images.png`
4. `reports/visual_mobile_food_images.png`

## Audit and backlog refresh

Serially reran:

1. `python scripts/audit_food_images.py`
2. `python scripts/build_food_photo_backlog.py`

Updated counts:

1. `Image keys using local real photos: 75`
2. `Image keys using local illustration fallback: 531`
3. `reports/food_real_photo_backlog.csv rows=393`

Confirmed removed from backlog:

1. `711-222`
2. `711-223`
3. `711-411`
4. `711-412`

## Remaining follow-up

Still worth continuing next:

1. `711-517` `7-11 黑椒牛肉便当`
2. `711-613` `7-11 黑椒牛肉意面`
3. `711-687` `7-11 黑椒鸡扒便当`
4. `familymart-587` `全家 低糖希腊酸奶`
5. `familymart-228` `全家 关东煮萝卜`

## Notes

This batch moved four more runtime-visible 7-11 convenience-store search results off SVG fallbacks in one pass. The current live search results now show distinct `.webp` assets for tuna rice ball, tea egg, teriyaki chicken bento, and chicken salad instead of repeating local illustration-style placeholders.
