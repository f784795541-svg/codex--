# Batch 24: FamilyMart Orleans Chicken-Cutlet Bento + Matcha Red-Bean Roll + Scallion Pork-Floss Bread Runtime Coverage

## Goal

Continue replacing runtime-visible FamilyMart SVG illustration fallbacks with corresponding real-photo assets in the current live search results.

This batch covered:

1. `familymart-694` `全家 奥尔良鸡排便当`
2. `familymart-695` `全家 抹茶红豆卷`
3. `familymart-588` `全家 香葱肉松面包`

## Source decisions

This batch used three `near_product_photo` sources.

Reason:

1. the exact official public FamilyMart convenience-store product pages for these live runtime keys were still unavailable or blocked from the current environment
2. distinct plated or packaged real photos were better than keeping the old SVG fallbacks
3. each selected source matched the runtime-visible product type closely enough to improve search realism without waiting on blocked official-page extraction

Per-key sources:

1. `familymart-694`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Chicken-Cutlet-Rice-Bowl/2935699`
   - source image: `https://img06.weeecdn.com/item/image/111/457/75051ECBE2C942BE.jpeg`
   - source note: chicken-cutlet rice-bowl plated photo used as the closest distinct near-product real-photo match for the live runtime FamilyMart Orleans chicken-cutlet bento key

2. `familymart-695`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Hema-Black-Gold-Matcha-Red-Bean-Roll-Cake-6PC/107740`
   - source image: `https://img06.weeecdn.com/product/image/739/419/3270AA284371F37A.png`
   - source note: packaged black-matcha red-bean roll product image used as the closest distinct near-product real-photo match for the live runtime FamilyMart matcha red-bean roll key

3. `familymart-588`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/CatherineBakery-Scallion-Pork-Sung-Roll-1pc/2030982`
   - source image: `https://img06.weeecdn.com/item/image/258/362/2AAF5ECDD7D5AC36.png`
   - source note: scallion pork-floss roll product photo used as the closest distinct near-product real-photo match for the live runtime FamilyMart scallion pork-floss bread key

## Cached source files

Saved to:

```text
reports/candidate_images/batch24
```

Files used in this batch:

1. `familymart-694_chicken_cutlet_rice_bowl.jpeg`
2. `familymart-695_matcha_redbean_roll.png`
3. `familymart-588_scallion_pork_floss_roll.png`

## Normalized output

Generated:

1. `A:\body-food-images\familymart-694.webp`
2. `A:\body-food-images\familymart-695.webp`
3. `A:\body-food-images\familymart-588.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `familymart-694 -> familymart-694.webp`
2. `familymart-695 -> familymart-695.webp`
3. `familymart-588 -> familymart-588.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch24`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `全家 奥尔良鸡排便当 -> familymart-694`
2. `全家 抹茶红豆卷 -> familymart-695`
3. `全家 香葱肉松面包 -> familymart-588`

## Runtime verification

Confirmed live runtime search currently returns:

1. `全家 奥尔良鸡排便当 -> familymart-694`
2. `全家 抹茶红豆卷 -> familymart-695`
3. `全家 香葱肉松面包 -> familymart-588`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/familymart-694.webp`
2. `http://localhost:8080/assets/foods/familymart-695.webp`
3. `http://localhost:8080/assets/foods/familymart-588.webp`

with HTTP `200`.

Confirmed narrow visual batch check JSON contains desktop and mobile hits for:

1. `/assets/foods/familymart-694.webp`
2. `/assets/foods/familymart-695.webp`
3. `/assets/foods/familymart-588.webp`

Batch-specific visual artifacts:

1. `reports/batch24_visual_check.json`
2. `reports/batch24_desktop_check.png`
3. `reports/batch24_mobile_check.png`

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `95 passed, 3 warnings`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend `/health` OK
   - frontend `/` OK
   - `/food/search` OK
   - `/dashboard/summary` OK
   - no recent `500` / `Traceback` / `ERROR`

### Visual checks

1. batch-specific Playwright check saved:
   - `reports/batch24_desktop_check.png`
   - `reports/batch24_mobile_check.png`
2. desktop and mobile final search cards both resolved to:
   - `familymart-694 -> familymart-694.webp`
   - `familymart-695 -> familymart-695.webp`
   - `familymart-588 -> familymart-588.webp`

## Audit and backlog refresh

Serially reran:

1. `python scripts/audit_food_images.py`
2. `python scripts/build_food_photo_backlog.py`

Updated counts:

1. `Image keys using local real photos: 85`
2. `Image keys using local illustration fallback: 521`
3. `reports/food_real_photo_backlog.csv rows=383`

Confirmed removed from backlog:

1. `familymart-694`
2. `familymart-695`
3. `familymart-588`

## Remaining follow-up

Still worth continuing next:

1. `711-517` `7-11 黑椒牛肉便当`
2. `711-687` `7-11 黑椒鸡扒便当`
3. `familymart-416` `全家 奥尔良鸡肉卷`
4. `familymart-229` `全家 鸡肉卷`
5. `familymart-520` `全家 黑椒牛肉便当`

## Notes

This batch moved three more runtime-visible FamilyMart results off SVG fallbacks in one pass. The current live search results now show distinct `.webp` assets for Orleans chicken-cutlet bento, matcha red-bean roll, and scallion pork-floss bread instead of repeating local illustration-style placeholders.
