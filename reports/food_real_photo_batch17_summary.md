# Batch 17: 7-11 Oden Runtime Coverage

## Goal

Continue replacing live 7-11 illustration fallbacks for runtime-visible search results that users can currently see in:

1. `7-11 关东煮海带结`
2. `7-11 关东煮魔芋结`
3. `7-11 关东煮鱼豆腐`

This batch covered:

1. `711-413` `7-11 关东煮海带结`
2. `711-414` `7-11 关东煮魔芋结`
3. `711-415` `7-11 关东煮鱼豆腐`

## Source decisions

This batch intentionally used `near_product_photo` for all three keys.

Reason:

1. current live runtime search already exposes these three 7-11 oden keys
2. stable official 7-11 public product pages for these exact items were not quickly reachable from the current environment
3. shipping three distinct corresponding real-photo assets was better than keeping three SVG fallbacks or stalling on blocked official pages

Per-key sources:

1. `711-413`
   - source tier: `near_product_photo`
   - source page: `https://www.helloseaweed.com/Dried-Kelp-Knots-50g-bag-pd591718838.html`
   - source image: `https://imrorwxhimmmlr5p-static.micyjz.com/cloud/lmBplKqillSRolprjpokkq/haidaijie-LOGO.jpg`
   - source note: packaged dried kelp knots image used as the closest distinct near-product match for the live runtime 7-11 oden kelp-knot key

2. `711-414`
   - source tier: `near_product_photo`
   - source page: `https://www.buyasianfood.com.au/_products/NoodlesPasta/JapaneseKoreanNoodles/FishWellBrandShiratakiKnot380G-25-5268-.aspx`
   - source image: `https://www.umall.com.au/cdn/shop/files/1_2658d757-4bfd-488b-a2e3-0fca9a95816c.jpg?v=1736928752`
   - source note: packaged shirataki knot image used as the closest distinct near-product match for the live runtime 7-11 oden konjac-knot key

3. `711-415`
   - source tier: `near_product_photo`
   - source page: `https://www.thai-food-online.co.uk/products/frozen-fish-tofu-200g-by-cheong-lee`
   - source image: `http://cdn.shopify.com/s/files/1/0076/4339/8233/products/fish_tofu_cheong_lee_1200x1200.jpg?v=1606475102`
   - source note: packaged fish tofu image used as the closest distinct near-product match for the live runtime 7-11 oden fish-tofu key

## Cached source files

Saved to:

```text
reports/candidate_images/batch17
```

Files:

1. `711_413_kelp_knots.jpg`
2. `711_414_konjac_knots.jpg`
3. `711_415_fish_tofu.jpg`

## Normalized output

Generated:

1. `A:\body-food-images\711-413.webp`
2. `A:\body-food-images\711-414.webp`
3. `A:\body-food-images\711-415.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `711-413 -> 711-413.webp`
2. `711-414 -> 711-414.webp`
3. `711-415 -> 711-415.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch17`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `7-11 关东煮海带结 -> 711-413`
2. `7-11 关东煮魔芋结 -> 711-414`
3. `7-11 关东煮鱼豆腐 -> 711-415`

## Runtime verification

Confirmed live runtime search currently returns:

1. `7-11 关东煮海带结 -> 711-413`
2. `7-11 关东煮魔芋结 -> 711-414`
3. `7-11 关东煮鱼豆腐 -> 711-415`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/711-413.webp`
2. `/assets/foods/711-414.webp`
3. `/assets/foods/711-415.webp`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/711-413.webp`
2. `http://localhost:8080/assets/foods/711-414.webp`
3. `http://localhost:8080/assets/foods/711-415.webp`

with HTTP `200`.

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `69 passed, 3 warnings`

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

1. `Image keys using local real photos: 59`
2. `Image keys using local illustration fallback: 547`
3. `reports/food_real_photo_backlog.csv rows=409`

Confirmed removed from backlog:

1. `711-413`
2. `711-414`
3. `711-415`

## Remaining follow-up

Still worth continuing next:

1. `lawson-419` `罗森 火腿鸡蛋三明治`
2. `711-586` `7-11 低糖希腊酸奶`
3. `711-224` `7-11 低糖豆浆`
4. `711-225` `7-11 全麦火腿蛋三明治`
5. `711-584` `7-11 全麦鸡胸三明治`

## Notes

This batch deliberately avoided reusing the exact Lawson oden assets. Even without stable official 7-11 pages, the release now uses three distinct corresponding real-photo assets for the three live runtime 7-11 oden keys, which moves the system closer to the requested “not a pile of repeated images” end state.
