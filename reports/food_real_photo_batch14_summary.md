# Batch 14: FamilyMart Chicken Salad Coverage and 7-11 Sandwich / Wrap Real Photo Coverage

## Goal

Continue replacing live convenience-store illustration fallbacks for runtime-visible search results that users can see immediately in:

1. `全家 鸡胸肉`
2. `711 三明治`
3. `711 鸡胸肉`

This batch covered:

1. `familymart-226` `全家 沙拉鸡胸肉`
2. `familymart-417` `全家 低糖鸡胸肉沙拉`
3. `711-612` `7-11 金枪鱼三明治`
4. `711-686` `7-11 鸡胸肉凯撒卷`

## Source decisions

### Official public

1. `familymart-226`
   - source page: `https://foodsafety.family.com.tw/Web_FFD_2022/results`
   - source image: `https://foodsafety.family.com.tw/product_img/003004.1119863.jpg`
   - source note: FamilyMart foodsafety product result for `嫩烤香料雞胸排蔬滿盒(健康志向)` used as the closest official chicken-salad style match

2. `familymart-417`
   - source page: `https://www.family.com.tw/Marketing/zh/FreshFood/Product`
   - source image: `https://www.family.com.tw/Manager/MarketingBS/Content/Pic/food_0610_06.jpg`
   - source note: FamilyMart TW fresh-food image for `莎莎烤雞麵沙拉` used as the closest official low-sugar chicken salad style match

### Near-product real photo

3. `711-612`
   - source page: `https://www.citypng.com/photo/29895/toasted-ham-cheese-sandwich-png`
   - source image: `https://www.citypng.com/public/uploads/preview/hd-top-view-classic-tuna-sandwich-cheese-cut-in-half-png-7017517109401616qjuqvbpce.png`
   - source note: Non-branded real-photo tuna sandwich cutout used because no stable official public 7-11 product source was available in the current environment

4. `711-686`
   - source page: `https://gostorenc.com/products/york-street-grilled-chicken-caesar-wrap-8-5oz`
   - source image: `https://cdn.shopify.com/s/files/1/0576/2328/1698/products/26548_Grilled_Chicken_Caesar_Wrap_PDP_2_1200x1200.png`
   - source note: Non-branded real-photo grilled chicken caesar wrap packshot used as the closest visible match for the live runtime key

## Cached source files

Saved to:

```text
reports/candidate_images/batch14
```

Files:

1. `familymart_226_official_1119863.jpg`
2. `familymart_417_official_food_0610_06.jpg`
3. `711_612_citypng_tuna_sandwich.png`
4. `711_686_gostore_caesar_wrap.png`

## Normalized output

Generated:

1. `A:\body-food-images\familymart-226.webp`
2. `A:\body-food-images\familymart-417.webp`
3. `A:\body-food-images\711-612.webp`
4. `A:\body-food-images\711-686.webp`

## Pipeline improvement

This batch exposed a real normalization problem:

1. Some official product images were small but semantically correct.
2. The previous normalization logic never upscaled small sources.
3. That made official package images appear too tiny after centering on the 1200x1200 canvas.

Adjusted:

1. `scripts/prepare_food_photo_assets.py`

Change:

1. Added controlled small-image upscaling before final canvas placement.
2. This keeps official package shots readable and visually closer to the intended product-card scale.

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `familymart-226 -> familymart-226.webp`
2. `familymart-417 -> familymart-417.webp`
3. `711-612 -> 711-612.webp`
4. `711-686 -> 711-686.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch14`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `全家 沙拉鸡胸肉 -> familymart-226`
2. `全家 低糖鸡胸肉沙拉 -> familymart-417`
3. `7-11 金枪鱼三明治 -> 711-612`
4. `7-11 鸡胸肉凯撒卷 -> 711-686`

## Runtime verification

Confirmed live runtime search currently returns:

1. `全家 沙拉鸡胸肉 -> familymart-226`
2. `全家 低糖鸡胸肉沙拉 -> familymart-417`
3. `7-11 金枪鱼三明治 -> 711-612`
4. `7-11 鸡胸肉凯撒卷 -> 711-686`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/familymart-226.webp`
2. `/assets/foods/familymart-417.webp`
3. `/assets/foods/711-612.webp`
4. `/assets/foods/711-686.webp`

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `59 passed, 3 warnings`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend `/health` OK
   - frontend `/` OK
   - `/food/search` OK
   - `/dashboard/summary` OK
   - no recent 500 / Traceback / ERROR

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

1. `Image keys using local real photos: 49`
2. `Image keys using local illustration fallback: 557`
3. `reports/food_real_photo_backlog.csv rows=419`

Confirmed removed from backlog:

1. `familymart-226`
2. `familymart-417`
3. `711-612`
4. `711-686`

## Follow-up candidates

High-value backlog items still worth continuing next:

1. `711-221` `7-11 即食鸡胸肉`
2. `711-412` `7-11 鸡胸肉沙拉`
3. `711-584` `7-11 全麦鸡胸三明治`
4. `711-585` `7-11 海苔肉松饭团`
5. `lawson-690` `罗森 双蛋火腿三明治`
6. `lawson-233` `罗森 全麦鸡蛋三明治`
7. `lawson-419` `罗森 火腿鸡蛋三明治`

