# Batch 18: 7-11 Dairy and Soy + Lawson Sandwich Runtime Coverage

## Goal

Continue replacing live illustration fallbacks for runtime-visible search results that users can currently see in:

1. `7-11 低糖豆浆`
2. `7-11 低糖希腊酸奶`
3. `7-11 低脂希腊酸奶杯`
4. `罗森 火腿鸡蛋三明治`

This batch covered:

1. `711-224` `7-11 低糖豆浆`
2. `711-586` `7-11 低糖希腊酸奶`
3. `711-688` `7-11 低脂希腊酸奶杯`
4. `lawson-419` `罗森 火腿鸡蛋三明治`

## Source decisions

This batch intentionally mixed one `official_public` source with three `near_product_photo` sources.

Reason:

1. `lawson-419` had a stable official Shanghai Lawson public product page and exact cover image
2. the three 7-11 items are runtime-visible but their exact official public product pages were not quickly reachable from the current environment
3. distinct corresponding packaged soy-milk and yogurt cup photos were better than keeping the old SVG fallbacks

Per-key sources:

1. `711-224`
   - source tier: `near_product_photo`
   - source page: `https://foodisgood.com/product/silk-unsweet-organic-soymilk/?diet=corn-free`
   - source image: `https://target.scene7.com/is/image/Target/GUEST_03b16b09-561b-47fe-b85c-1ca93643f3ab?wid=1000&hei=1000&qlt=80&fmt=webp`
   - source note: packaged unsweet soy-milk carton used as the closest distinct near-product match for the live runtime 7-11 low-sugar soy-milk key

2. `711-586`
   - source tier: `near_product_photo`
   - source page: `https://foodisgood.com/product/great-value-greek-plain-nonfat-yogurt-cups-plastic-container/`
   - source image: `https://i5.walmartimages.com/seo/Great-Value-Greek-Plain-Nonfat-Yogurt-5-3-oz-Cups-Plastic-Container_9bdd02d9-352a-4eb4-9de4-402320349b9c.dc23a6a4a7e5edf90d06876f7b883103.jpeg`
   - source note: plain Greek yogurt cup used as the closest distinct near-product match for the live runtime 7-11 low-sugar Greek yogurt key

3. `711-688`
   - source tier: `near_product_photo`
   - source page: `https://foodisgood.com/product/great-value-greek-strawberry-nonfat-yogurt-cup-plastic-container/`
   - source image: `https://i5.walmartimages.com/seo/Great-Value-Greek-Strawberry-Nonfat-Yogurt-5-3-oz-Cup-Plastic-Container_964d2693-9aa4-4edb-a169-f638925809cf.46e5ad792b0fc62a000a7e4fb2649663.jpeg`
   - source note: strawberry Greek yogurt cup used as the closest distinct near-product match for the live runtime 7-11 low-fat Greek yogurt cup key

4. `lawson-419`
   - source tier: `official_public`
   - source page: `https://shanghai.chinalawson.com.cn/products/category?cid=3`
   - source image: `https://shanghai.chinalawson.com.cn/uploads/product_cover/570/cover.jpg`
   - source note: Shanghai Lawson official public sandwich cover used as the direct official match for the live runtime ham-and-egg sandwich key

## Cached source files

Saved to:

```text
reports/candidate_images/batch18
```

Files:

1. `711_224_soymilk.webp`
2. `711_586_greek_plain.jpeg`
3. `711_688_greek_strawberry.jpeg`
4. `lawson_419_official_570.jpg`

## Normalized output

Generated:

1. `A:\body-food-images\711-224.webp`
2. `A:\body-food-images\711-586.webp`
3. `A:\body-food-images\711-688.webp`
4. `A:\body-food-images\lawson-419.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `711-224 -> 711-224.webp`
2. `711-586 -> 711-586.webp`
3. `711-688 -> 711-688.webp`
4. `lawson-419 -> lawson-419.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch18`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `7-11 低糖豆浆 -> 711-224`
2. `7-11 低糖希腊酸奶 -> 711-586`
3. `7-11 低脂希腊酸奶杯 -> 711-688`
4. `罗森 火腿鸡蛋三明治 -> lawson-419`

## Runtime verification

Confirmed live runtime search currently returns:

1. `7-11 低糖豆浆 -> 711-224`
2. `7-11 低糖希腊酸奶 -> 711-586`
3. `7-11 低脂希腊酸奶杯 -> 711-688`
4. `罗森 火腿鸡蛋三明治 -> lawson-419`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/711-224.webp`
2. `/assets/foods/711-586.webp`
3. `/assets/foods/711-688.webp`
4. `/assets/foods/lawson-419.webp`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/711-224.webp`
2. `http://localhost:8080/assets/foods/711-586.webp`
3. `http://localhost:8080/assets/foods/711-688.webp`
4. `http://localhost:8080/assets/foods/lawson-419.webp`

with HTTP `200`.

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `73 passed, 3 warnings`

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

1. `Image keys using local real photos: 63`
2. `Image keys using local illustration fallback: 543`
3. `reports/food_real_photo_backlog.csv rows=405`

Confirmed removed from backlog:

1. `711-224`
2. `711-586`
3. `711-688`
4. `lawson-419`

## Remaining follow-up

Still worth continuing next:

1. `711-225` `7-11 全麦火腿蛋三明治`
2. `711-584` `7-11 全麦鸡胸三明治`
3. `711-592` `7-11 冰美式咖啡`
4. `711-221` `7-11 即食鸡胸肉`
5. `dongpeng-407` `东鹏特饮`

## Notes

This batch moved one exact Lawson sandwich and three runtime-visible 7-11 packaged dairy/soy items off SVG fallbacks in one pass. The result is not only more realistic, but also less repetitive in the exact search results users currently see.
