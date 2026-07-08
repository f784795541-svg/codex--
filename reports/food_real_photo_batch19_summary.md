# Batch 19: 7-11 Sandwich + Iced Americano + Dongpeng Runtime Coverage

## Goal

Continue replacing runtime-visible SVG illustration fallbacks in the current live search results with corresponding real-photo assets.

This batch covered:

1. `711-225` `7-11 全麦火腿蛋三明治`
2. `711-584` `7-11 全麦鸡胸三明治`
3. `711-592` `7-11 冰美式咖啡`
4. `dongpeng-407` `东鹏特饮`

## Source decisions

This batch intentionally mixed one `official_public` asset with three `near_product_photo` assets.

Reason:

1. `dongpeng-407` had a reachable official product page, but the direct product image URL was still unfriendly to simple download, so the final asset was prepared from a local screenshot crop of the official public page
2. the three 7-11 runtime-visible items still did not have stable, directly usable official public 7-11 product pages from the current environment
3. distinct corresponding sandwich and iced-americano real photos were better than keeping the old SVG fallbacks

Per-key sources:

1. `711-225`
   - source tier: `near_product_photo`
   - source page: `https://www.paris.co.kr/product/multigrain-ham-egg-sandwich/`
   - source image: `https://d2afncas1tel3t.cloudfront.net/wp-content/uploads/2025/04/%EB%B8%8C%EB%9D%BC%EC%9A%B4-%ED%96%84%EC%97%90%EA%B7%B8-%EC%83%8C%EB%93%9C%EC%9C%84%EC%B9%98-%EC%8D%B8%EB%84%AC.png`
   - source note: official Paris Baguette public whole-grain ham-and-egg sandwich image used as the closest distinct near-product match for the live runtime 7-11 key

2. `711-584`
   - source tier: `near_product_photo`
   - source page: `https://www.paris.co.kr/product/caesar-chicken-sandwich-with-multigrain-bread/`
   - source image: `https://d2afncas1tel3t.cloudfront.net/wp-content/uploads/2026/02/%EC%8B%9C%EC%A0%80%EC%B9%98%ED%82%A8%EB%A9%80%ED%8B%B0%EA%B7%B8%EB%A0%88%EC%9D%B8%EC%83%8C%EB%93%9C%EC%9C%84%EC%B9%98.png`
   - source note: official Paris Baguette public multigrain chicken sandwich image used as the closest distinct near-product match for the live runtime 7-11 key

3. `711-592`
   - source tier: `near_product_photo`
   - source page: `https://bxtra.ph/iced-americano-5`
   - source image: `https://bxtra-storage.s3.us-west-001.backblazeb2.com/prod/store/images/thumbs/001/0012445_iced-americano.png`
   - source note: public iced americano product cup image used as the closest distinct near-product match for the live runtime 7-11 iced americano key

4. `dongpeng-407`
   - source tier: `official_public`
   - source page: `https://www.szeastroc.com/product/`
   - source image: page screenshot crop cached locally as `reports/candidate_images/batch19/dongpeng_407_official_crop.png`
   - source note: official Dongpeng public product page crop used as the direct official match for the live runtime `东鹏特饮` key

## Cached source files

Saved to:

```text
reports/candidate_images/batch19
```

Files used in this batch:

1. `711_225_paris_ham_egg.png`
2. `711_584_paris_caesar_chicken.png`
3. `711_592_bxtra_americano.png`
4. `dongpeng_407_official_crop.png`

## Normalized output

Generated:

1. `A:\body-food-images\711-225.webp`
2. `A:\body-food-images\711-584.webp`
3. `A:\body-food-images\711-592.webp`
4. `A:\body-food-images\dongpeng-407.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `711-225 -> 711-225.webp`
2. `711-584 -> 711-584.webp`
3. `711-592 -> 711-592.webp`
4. `dongpeng-407 -> dongpeng-407.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch19`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `7-11 全麦火腿蛋三明治 -> 711-225`
2. `7-11 全麦鸡胸三明治 -> 711-584`
3. `7-11 冰美式咖啡 -> 711-592`
4. `东鹏特饮 -> dongpeng-407`

## Runtime verification

Confirmed live runtime search currently returns:

1. `7-11 全麦火腿蛋三明治 -> 711-225`
2. `7-11 全麦鸡胸三明治 -> 711-584`
3. `7-11 冰美式咖啡 -> 711-592`
4. `东鹏特饮 -> dongpeng-407`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/711-225.webp`
2. `/assets/foods/711-584.webp`
3. `/assets/foods/711-592.webp`
4. `/assets/foods/dongpeng-407.webp`

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `77 passed, 3 warnings`

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

1. `Image keys using local real photos: 67`
2. `Image keys using local illustration fallback: 539`
3. `reports/food_real_photo_backlog.csv rows=401`

Confirmed removed from backlog:

1. `711-225`
2. `711-584`
3. `711-592`
4. `dongpeng-407`

## Remaining follow-up

Still worth continuing next:

1. `711-221` `7-11 即食鸡胸肉`
2. `711-518` `7-11 厚切火腿三明治`
3. `711-615` `7-11 无糖乌龙茶`
4. `711-585` `7-11 海苔肉松饭团`
5. `familymart-587` `全家 低糖希腊酸奶`

## Notes

This batch moved three runtime-visible 7-11 product-search results and one Dongpeng energy-drink search result off SVG fallbacks in one pass. The biggest improvement is that the current live search results for these exact queries now render distinct `.webp` product photos instead of shared illustration-style assets.
