# Batch 20: 7-11 Chicken Breast + Ham Sandwich + Oolong Tea + Pork-Floss Onigiri Runtime Coverage

## Goal

Continue replacing runtime-visible SVG illustration fallbacks in the current live 7-11 search results with corresponding real-photo assets.

This batch covered:

1. `711-221` `7-11 即食鸡胸肉`
2. `711-518` `7-11 厚切火腿三明治`
3. `711-585` `7-11 海苔肉松饭团`
4. `711-615` `7-11 无糖乌龙茶`

## Source decisions

This batch used four `near_product_photo` sources.

Reason:

1. the exact official public 7-11 product pages for these four live runtime keys were still blocked or unavailable from the current environment
2. distinct real packaged/product photos were better than keeping the old SVG fallbacks
3. each selected source matched the runtime-visible food shape closely enough to improve search realism without waiting on blocked official-page extraction

Per-key sources:

1. `711-221`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Juicybite-Fully-Cooked-Chicken-Breast-Ancient-Spice-Frozen-1/107220`
   - source image: `https://img06.weeecdn.com/product/image/819/374/5768227A393292AB.png!c1440x0_q81.auto`
   - source note: packaged fully cooked chicken breast product image used as the closest distinct near-product match for the live runtime 7-11 ready-to-eat chicken-breast key

2. `711-518`
   - source tier: `near_product_photo`
   - source page: `https://english.lianhwa.com.tw/lianHwaOfficialEn/brand/brand.do?id=7`
   - source image: `http://english.lianhwa.com.tw/upload/lianHwaOfficialEnAdmin/brandProduct/381e8469b600000055e779a67aa12681.jpg`
   - source note: Lian Hwa official public ham-and-egg sandwich image used as the closest distinct near-product match for the live runtime 7-11 thick-cut ham sandwich key

3. `711-585`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Salted-Egg-Yolk-and-Pork-Floss-Rice-Ball/2212860`
   - source image: `https://img06.weeecdn.com/item/image/134/702/75EACC5FE8F1710C.jpeg!c1440x0_q81.auto`
   - source note: pork-floss rice-ball product image used as the closest distinct near-product match for the live runtime 7-11 seaweed pork-floss rice-ball key

4. `711-615`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/ITO-EN-Golden-Oolong-Tea/64938`
   - source image: `https://img06.weeecdn.com/item/image/062/338/4B68C15212773A8A.png.jpeg!c1440x0_q81.auto`
   - source note: packaged unsweet golden oolong-tea bottle image used as the closest distinct near-product match for the live runtime 7-11 unsweet oolong-tea key

## Cached source files

Saved to:

```text
reports/candidate_images/batch20
```

Files used in this batch:

1. `711_221_juicybite_chicken.png`
2. `711_518_lianhwa_ham_egg.jpg`
3. `711_585_fuji_porkfloss.jpeg`
4. `711_615_itoen_oolong.png`

## Normalized output

Generated:

1. `A:\body-food-images\711-221.webp`
2. `A:\body-food-images\711-518.webp`
3. `A:\body-food-images\711-585.webp`
4. `A:\body-food-images\711-615.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `711-221 -> 711-221.webp`
2. `711-518 -> 711-518.webp`
3. `711-585 -> 711-585.webp`
4. `711-615 -> 711-615.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch20`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `7-11 即食鸡胸肉 -> 711-221`
2. `7-11 厚切火腿三明治 -> 711-518`
3. `7-11 海苔肉松饭团 -> 711-585`
4. `7-11 无糖乌龙茶 -> 711-615`

## Runtime verification

Confirmed live runtime search currently returns:

1. `7-11 即食鸡胸肉 -> 711-221`
2. `7-11 厚切火腿三明治 -> 711-518`
3. `7-11 海苔肉松饭团 -> 711-585`
4. `7-11 无糖乌龙茶 -> 711-615`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/711-221.webp`
2. `/assets/foods/711-518.webp`
3. `/assets/foods/711-585.webp`
4. `/assets/foods/711-615.webp`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/711-221.webp`
2. `http://localhost:8080/assets/foods/711-518.webp`
3. `http://localhost:8080/assets/foods/711-585.webp`
4. `http://localhost:8080/assets/foods/711-615.webp`

with HTTP `200`.

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `81 passed, 3 warnings`

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

1. `Image keys using local real photos: 71`
2. `Image keys using local illustration fallback: 535`
3. `reports/food_real_photo_backlog.csv rows=397`

Confirmed removed from backlog:

1. `711-221`
2. `711-518`
3. `711-585`
4. `711-615`

## Remaining follow-up

Still worth continuing next:

1. `711-411` `7-11 照烧鸡腿便当`
2. `711-223` `7-11 茶叶蛋`
3. `711-222` `7-11 金枪鱼饭团`
4. `711-412` `7-11 鸡胸肉沙拉`
5. `711-517` `7-11 黑椒牛肉便当`

## Notes

This batch moved four more runtime-visible 7-11 convenience-store search results off SVG fallbacks in one pass. The current live search results now show distinct packaged/product-style `.webp` assets for chicken breast, ham sandwich, pork-floss onigiri, and unsweet oolong tea instead of repeating local illustration-style placeholders.
