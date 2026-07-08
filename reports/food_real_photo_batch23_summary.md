# Batch 23: FamilyMart Oden Daikon + Pork Meatballs + Fish Tofu Runtime Coverage

## Goal

Continue replacing runtime-visible FamilyMart SVG illustration fallbacks with corresponding real-photo assets in the current live search results.

This batch covered:

1. `familymart-228` `全家 关东煮萝卜`
2. `familymart-696` `全家 关东煮贡丸`
3. `familymart-521` `全家 关东煮鱼豆腐`

## Source decisions

This batch used three `near_product_photo` sources.

Reason:

1. the exact official public FamilyMart convenience-store product pages for these live runtime keys were still unavailable or blocked from the current environment
2. distinct product-style real photos were better than keeping the old SVG fallbacks
3. each selected source matched the runtime-visible oden item closely enough to improve search realism without waiting on blocked official-page extraction

Per-key sources:

1. `familymart-228`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Japanese-White-Daikon-Radish/46269`
   - source image: `https://img06.weeecdn.com/item/image/835/856/29C82D0D4097B62D.jpg`
   - source note: clean white daikon product image used as the closest distinct near-product match for the live runtime FamilyMart oden daikon key

2. `familymart-696`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Wei-Chuan-Pork-Meatballs--Frozen/76827`
   - source image: `https://img06.weeecdn.com/item/image/706/413/7E8B98EE9D50FA60.jpg`
   - source note: packaged pork meatballs product image used as the closest distinct near-product match for the live runtime FamilyMart oden pork-meatballs key

3. `familymart-521`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Choripdong-Tofu-Fish-Cake-Frozen/20795`
   - source image: `https://img06.weeecdn.com/product/image/499/477/236B65B525311365.png`
   - source note: packaged fish-tofu product image used as the closest distinct near-product match for the live runtime FamilyMart oden fish-tofu key

## Cached source files

Saved to:

```text
reports/candidate_images/batch23
```

Files used in this batch:

1. `familymart-228_japanese_white_daikon.jpeg`
2. `familymart-696_weichuan_pork_meatballs.jpeg`
3. `familymart-521_choripdong_fish_tofu.png`

## Normalized output

Generated:

1. `A:\body-food-images\familymart-228.webp`
2. `A:\body-food-images\familymart-696.webp`
3. `A:\body-food-images\familymart-521.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `familymart-228 -> familymart-228.webp`
2. `familymart-696 -> familymart-696.webp`
3. `familymart-521 -> familymart-521.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch23`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `全家 关东煮萝卜 -> familymart-228`
2. `全家 关东煮贡丸 -> familymart-696`
3. `全家 关东煮鱼豆腐 -> familymart-521`

## Runtime verification

Confirmed live runtime search currently returns:

1. `全家 关东煮萝卜 -> familymart-228`
2. `全家 关东煮贡丸 -> familymart-696`
3. `全家 关东煮鱼豆腐 -> familymart-521`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/familymart-228.webp`
2. `http://localhost:8080/assets/foods/familymart-696.webp`
3. `http://localhost:8080/assets/foods/familymart-521.webp`

with HTTP `200`.

Confirmed narrow visual batch check JSON contains desktop and mobile hits for:

1. `/assets/foods/familymart-228.webp`
2. `/assets/foods/familymart-696.webp`
3. `/assets/foods/familymart-521.webp`

Batch-specific visual artifacts:

1. `reports/batch23_visual_check.json`
2. `reports/batch23_desktop_check.png`
3. `reports/batch23_mobile_check.png`

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `92 passed, 3 warnings`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend `/health` OK
   - frontend `/` OK
   - `/food/search` OK
   - `/dashboard/summary` OK
   - no recent `500` / `Traceback` / `ERROR`

### Visual checks

1. batch-specific Playwright check saved:
   - `reports/batch23_desktop_check.png`
   - `reports/batch23_mobile_check.png`
2. desktop and mobile final search cards both resolved to:
   - `familymart-228 -> familymart-228.webp`
   - `familymart-696 -> familymart-696.webp`
   - `familymart-521 -> familymart-521.webp`

## Audit and backlog refresh

Serially reran:

1. `python scripts/audit_food_images.py`
2. `python scripts/build_food_photo_backlog.py`

Updated counts:

1. `Image keys using local real photos: 82`
2. `Image keys using local illustration fallback: 524`
3. `reports/food_real_photo_backlog.csv rows=386`

Confirmed removed from backlog:

1. `familymart-228`
2. `familymart-696`
3. `familymart-521`

## Remaining follow-up

Still worth continuing next:

1. `711-517` `7-11 黑椒牛肉便当`
2. `711-687` `7-11 黑椒鸡扒便当`
3. `familymart-694` `全家 奥尔良鸡排便当`
4. `familymart-416` `全家 奥尔良鸡肉卷`
5. `familymart-695` `全家 抹茶红豆卷`

## Notes

This batch moved three more runtime-visible FamilyMart oden results off SVG fallbacks in one pass. The current live search results now show distinct `.webp` assets for daikon, pork meatballs, and fish tofu instead of repeating local illustration-style placeholders.
