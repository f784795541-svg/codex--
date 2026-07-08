# Batch 13: Lawson Runtime Onigiri and Ready-to-Eat Product Real Photo Coverage

## Goal

Continue replacing live Lawson fallback illustrations with real product photos for runtime-visible convenience-store items that still appeared as svg in high-value searches.

This batch covered:

1. `lawson-523` `罗森 海苔肉松饭团`
2. `lawson-616` `罗森 奥尔良鸡肉卷`
3. `lawson-231` `罗森 沙拉鸡胸肉`

## Sources added

Added ledger rows in `reports/food_photo_source_ledger.csv` for:

1. `lawson-523`
2. `lawson-616`
3. `lawson-231`

Source classes:

1. `lawson-523` -> `near_product_photo`
2. `lawson-616` -> `official_public`
3. `lawson-231` -> `official_public`

Source pages and direct images:

1. `lawson-523`
   - source page: `https://english.lianhwa.com.tw/lianHwaOfficialEn/brand/brand.do?id=7`
   - source image: `http://english.lianhwa.com.tw/upload/lianHwaOfficialEnAdmin/brandProduct/3812eedbc20000006ec538b57b3e9282.jpg`
2. `lawson-616`
   - source page: `https://chongqing.chinalawson.com.cn/products/category?cid=6&page=19`
   - source image: `https://chongqing.chinalawson.com.cn/uploads/product_cover/1475/cover.jpg`
3. `lawson-231`
   - source page: `https://chongqing.chinalawson.com.cn/products/category?cid=7&page=12`
   - source image: `https://chongqing.chinalawson.com.cn/uploads/product_cover/626/cover.jpg`

Cached source files:

1. `reports/candidate_images/lawson_523_lianhwa_porkfloss.jpg`
2. `reports/candidate_images/lawson_616_official_1475.jpg`
3. `reports/candidate_images/lawson_231_official_626.jpg`

## Local assets generated

Created:

1. `A:\body-food-images\lawson-523.webp`
2. `A:\body-food-images\lawson-616.webp`
3. `A:\body-food-images\lawson-231.webp`

## Manifest/runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `lawson-523 -> lawson-523.webp`
2. `lawson-616 -> lawson-616.webp`
3. `lawson-231 -> lawson-231.webp`

Frontend cache-busting version updated to:

- `20260708-realphoto-batch13`

## Test and visual verification coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `罗森 海苔肉松饭团 -> lawson-523`
2. `罗森 奥尔良鸡肉卷 -> lawson-616`
3. `罗森 沙拉鸡胸肉 -> lawson-231`

Chinese-sensitive entries were inserted with Unicode escapes in the test/visual files to avoid Windows-side encoding corruption while keeping the runtime assertions exact.

## Runtime verification

Confirmed live runtime search currently returns:

1. `罗森 海苔肉松饭团 -> lawson-523`
2. `罗森 奥尔良鸡肉卷 -> lawson-616`
3. `罗森 沙拉鸡胸肉 -> lawson-231`

Confirmed current visual check JSON contains both desktop and mobile hits for:

1. `/assets/foods/lawson-523.webp`
2. `/assets/foods/lawson-616.webp`
3. `/assets/foods/lawson-231.webp`

## Verification completed

### Static checks

1. `node --check frontend/app.js`
2. `node --check frontend/assets/foods/food-image-assets.js`
3. `node --check miniprogram/utils/foodImageAssets.js`
4. `node --check scripts/visual_food_image_check.cjs`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - `55 passed, 3 warnings`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend/frontend/search/dashboard healthy

### Visual checks

1. `scripts/visual_food_image_check.cjs`
2. `reports/visual_food_image_check.json`
3. `reports/visual_desktop_food_images.png`
4. `reports/visual_mobile_food_images.png`

### Batch maintenance

1. `scripts/audit_food_images.py`
2. `scripts/build_food_photo_backlog.py`

Both were rerun in the required serial order after this batch.

## Audit/backlog status after this batch

From `reports/food_image_refinement_summary.md`:

1. `Image keys using local real photos: 45`
2. `Image keys using local illustration fallback: 561`

From `reports/food_real_photo_backlog.csv`:

1. backlog rows reduced from `426` to `423`
2. `lawson-523`
3. `lawson-616`
4. `lawson-231`

are no longer pending.

## Implementation note

This batch kept the Windows-safe targeted runtime sync approach instead of relying on whole-folder `docker cp frontend/. ...`.

Targeted runtime copies were used for:

1. `frontend/index.html`
2. `frontend/assets/foods/food-image-assets.js`
3. `frontend/assets/foods/lawson-523.webp`
4. `frontend/assets/foods/lawson-616.webp`
5. `frontend/assets/foods/lawson-231.webp`

That kept runtime state aligned with the repo without widening the change.

## Recommended next batch

Continue with one of these:

1. 7-11 top backlog items still on svg such as `711-585`, `711-222`, `711-221`, `711-225`, `711-592`
2. FamilyMart top backlog items still on svg such as `familymart-226`, `familymart-229`, `familymart-416`, `familymart-417`, `familymart-587`
3. other P0 official-public convenience-store items near the top of `reports/food_real_photo_backlog.csv`
