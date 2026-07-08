# Batch 16: Lawson Oden Runtime Coverage

## Goal

Continue replacing live Lawson illustration fallbacks for runtime-visible search results that users can currently see in:

1. `罗森 关东煮`

This batch covered:

1. `lawson-619` `罗森 关东煮萝卜`
2. `lawson-421` `罗森 关东煮海带结`
3. `lawson-524` `罗森 关东煮魔芋结`
4. `lawson-525` `罗森 关东煮鱼豆腐`

## Source decisions

This batch intentionally used `near_product_photo` for all four keys.

Reason:

1. live runtime search already exposes these four Lawson oden keys to users
2. stable official Lawson public product pages for these exact oden items were not found quickly enough
3. shipping four distinct corresponding real-photo assets was better than stalling or keeping four illustration fallbacks

Per-key sources:

1. `lawson-619`
   - source tier: `near_product_photo`
   - source page: `https://japan.recipetineats.com/oden-simmered-one-pot-dish/`
   - source image: `https://japan.recipetineats.com/wp-content/uploads/2017/05/Oden_0167.png`
   - source note: cropped real oden photo focused on simmered daikon as the closest runtime-visible Lawson oden daikon match

2. `lawson-421`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/search?keyword=kelp%20knots`
   - source image: `https://img08.weeecdn.net/product/image/590/575/6412AECF40FBFCB5.png`
   - source note: packaged kelp-knot product photo used as the closest runtime-visible Lawson oden kelp-knot match

3. `lawson-524`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Rongshing-Konnyaku-Knots/39204`
   - source image: `https://img08.weeecdn.net/item/image/017/557/4845FC723937A369.png`
   - source note: packaged konnyaku-knot product photo used as the closest runtime-visible Lawson oden konjac-knot match

4. `lawson-525`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/search?keyword=fish%20tofu`
   - source image: `https://img08.weeecdn.net/product/image/499/477/236B65B525311365.png`
   - source note: packaged fish-tofu / fried fish-cake product photo used as the closest runtime-visible Lawson oden fish-tofu match

## Cached source files

Saved to:

```text
reports/candidate_images/batch16
```

Files:

1. `lawson_619_daikon_crop.jpg`
2. `lawson_421_kelp_knots.png`
3. `lawson_524_konjac_knots.png`
4. `lawson_525_fish_tofu.png`

## Normalized output

Generated:

1. `A:\body-food-images\lawson-619.webp`
2. `A:\body-food-images\lawson-421.webp`
3. `A:\body-food-images\lawson-524.webp`
4. `A:\body-food-images\lawson-525.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `lawson-619 -> lawson-619.webp`
2. `lawson-421 -> lawson-421.webp`
3. `lawson-524 -> lawson-524.webp`
4. `lawson-525 -> lawson-525.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch16`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `罗森 关东煮萝卜 -> lawson-619`
2. `罗森 关东煮海带结 -> lawson-421`
3. `罗森 关东煮魔芋结 -> lawson-524`
4. `罗森 关东煮鱼豆腐 -> lawson-525`

## Runtime verification

Confirmed live runtime search currently returns:

1. `罗森 关东煮萝卜 -> lawson-619`
2. `罗森 关东煮海带结 -> lawson-421`
3. `罗森 关东煮魔芋结 -> lawson-524`
4. `罗森 关东煮鱼豆腐 -> lawson-525`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/lawson-619.webp`
2. `/assets/foods/lawson-421.webp`
3. `/assets/foods/lawson-524.webp`
4. `/assets/foods/lawson-525.webp`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/lawson-619.webp`
2. `http://localhost:8080/assets/foods/lawson-421.webp`
3. `http://localhost:8080/assets/foods/lawson-524.webp`
4. `http://localhost:8080/assets/foods/lawson-525.webp`

with HTTP `200`.

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `66 passed, 3 warnings`

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

1. `Image keys using local real photos: 56`
2. `Image keys using local illustration fallback: 550`
3. `reports/food_real_photo_backlog.csv rows=412`

Confirmed removed from backlog:

1. `lawson-619`
2. `lawson-421`
3. `lawson-524`
4. `lawson-525`

## Remaining follow-up

Still worth continuing next:

1. `lawson-419` `罗森 火腿鸡蛋三明治`
2. `711-413` `7-11 关东煮海带结`
3. `711-414` `7-11 关东煮魔芋结`
4. `711-415` `7-11 关东煮鱼豆腐`
5. `711-586` `7-11 低糖希腊酸奶`
6. `711-224` `7-11 低糖豆浆`

## Notes

This batch intentionally chose correctness and forward movement over waiting for perfect official Lawson sources. The four runtime-visible Lawson oden results now use four distinct corresponding real-photo assets, and the downgrade to `near_product_photo` is explicitly recorded in the source ledger instead of being hidden or guessed.
