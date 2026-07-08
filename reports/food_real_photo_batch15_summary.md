# Batch 15: Lawson Sandwich and Chicken-Salad Runtime Coverage

## Goal

Continue replacing live Lawson illustration fallbacks for runtime-visible search results that users can currently see in:

1. `罗森 三明治`
2. `罗森 鸡胸肉`

This batch covered:

1. `lawson-690` `罗森 双蛋火腿三明治`
2. `lawson-233` `罗森 全麦鸡蛋三明治`
3. `lawson-522` `罗森 鸡胸肉沙拉`

## Source decisions

All three were added as `official_public`, but with different closeness notes:

1. `lawson-690`
   - source page: `https://chongqing.chinalawson.com.cn/products/category?cid=5&page=36`
   - source image: `https://chongqing.chinalawson.com.cn/uploads/product_cover/1792/cover.jpg`
   - source note: `缤纷多层三明治` shows ham and baked egg together, which is the closest official sandwich image found for the live runtime double-egg ham sandwich key

2. `lawson-233`
   - source page: `https://chongqing.chinalawson.com.cn/products/category?cid=5&page=35`
   - source image: `https://chongqing.chinalawson.com.cn/uploads/product_cover/1809/cover.jpg`
   - source note: `全麦蔬菜三明治` is the closest official whole-wheat sandwich image currently available for the live runtime whole-wheat egg sandwich key

3. `lawson-522`
   - source page: `https://chongqing.chinalawson.com.cn/products/category?cid=7&page=12`
   - source image: `https://chongqing.chinalawson.com.cn/uploads/product_cover/625/cover.jpg`
   - source note: `优形沙拉鸡胸肉（烧烤味）` was used as the closest official chicken-breast product image after `鸡胸肉卷心菜沙拉` on page 51 exposed a broken image link

## Cached source files

Saved to:

```text
reports/candidate_images/batch15
```

Files:

1. `lawson_690_official_1792.jpg`
2. `lawson_233_official_1809.jpg`
3. `lawson_522_official_625.jpg`

## Normalized output

Generated:

1. `A:\body-food-images\lawson-690.webp`
2. `A:\body-food-images\lawson-233.webp`
3. `A:\body-food-images\lawson-522.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `lawson-690 -> lawson-690.webp`
2. `lawson-233 -> lawson-233.webp`
3. `lawson-522 -> lawson-522.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch15`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `罗森 双蛋火腿三明治 -> lawson-690`
2. `罗森 全麦鸡蛋三明治 -> lawson-233`
3. `罗森 鸡胸肉沙拉 -> lawson-522`

## Runtime verification

Confirmed live runtime search currently returns:

1. `罗森 双蛋火腿三明治 -> lawson-690`
2. `罗森 全麦鸡蛋三明治 -> lawson-233`
3. `罗森 鸡胸肉沙拉 -> lawson-522`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/lawson-690.webp`
2. `/assets/foods/lawson-233.webp`
3. `/assets/foods/lawson-522.webp`

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `62 passed, 3 warnings`

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

1. `Image keys using local real photos: 52`
2. `Image keys using local illustration fallback: 554`
3. `reports/food_real_photo_backlog.csv rows=416`

Confirmed removed from backlog:

1. `lawson-690`
2. `lawson-233`
3. `lawson-522`

## Remaining Lawson follow-up

Still worth continuing next:

1. `lawson-419` `罗森 火腿鸡蛋三明治`
2. `lawson-619` `罗森 关东煮萝卜`
3. `lawson-421` `罗森 关东煮海带结`
4. `lawson-524` `罗森 关东煮魔芋结`
5. `lawson-525` `罗森 关东煮鱼豆腐`

## Notes

This batch intentionally did not force `lawson-419` into the release because the currently located official images were not close enough to justify another weak duplicate. It remains in backlog for the next pass rather than lowering image-to-text correctness.

