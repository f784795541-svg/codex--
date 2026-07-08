# Batch 22: 7-11 Black Pepper Beef Pasta + FamilyMart Yogurt + FamilyMart Greek Yogurt + FamilyMart Iced Latte Runtime Coverage

## Goal

Continue replacing runtime-visible SVG illustration fallbacks with corresponding real-photo assets in the current live search results.

This batch covered:

1. `711-613` `7-11 黑椒牛肉意面`
2. `familymart-230` `全家 无糖酸奶`
3. `familymart-587` `全家 低糖希腊酸奶`
4. `familymart-591` `全家 冰拿铁`

## Source decisions

This batch used four `near_product_photo` sources.

Reason:

1. the exact official public convenience-store product pages for these live runtime keys were still blocked or unavailable from the current environment
2. distinct packaged/product-style photos were better than keeping the old SVG fallbacks
3. each selected source matched the runtime-visible product type closely enough to improve search realism without waiting on blocked official-page extraction

Per-key sources:

1. `711-613`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Kong-Instant-Pasta-Black-Pepper-Beef-Flavor-Pasta/3018911`
   - source image: `https://img06.weeecdn.com/item/image/874/880/31332E0105241984.jpeg`
   - source note: packaged black-pepper beef pasta product image used as the closest distinct near-product match for the live runtime 7-11 black-pepper beef pasta key

2. `familymart-230`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Beijing-Yogurt-Plain-Original-Flavor/102494`
   - source image: `https://img06.weeecdn.com/product/image/902/125/5ED7EA876339F2D5.png`
   - source note: packaged original plain yogurt multipack image used as the closest distinct near-product match for the live runtime FamilyMart unsweet yogurt key

3. `familymart-587`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Chobani-Greek-Yogurt-Non-Fat-Plain/100783`
   - source image: `https://img06.weeecdn.com/product/image/725/881/66D59D6A07935335.png`
   - source note: front-facing Greek yogurt tub image used as the closest distinct near-product match for the live runtime FamilyMart low-sugar Greek yogurt key

4. `familymart-591`
   - source tier: `near_product_photo`
   - source page: `https://www.sayweee.com/en/product/Roastery-Espresso-Latte-250ml-10-Cup/2046617`
   - source image: `https://img06.weeecdn.com/item/image/819/366/5416655DD9CCFA01.jpeg`
   - source note: ready-to-drink espresso latte cup image used as the closest distinct near-product match for the live runtime FamilyMart iced latte key

## Cached source files

Saved to:

```text
reports/candidate_images/batch22
```

Files used in this batch:

1. `711-613_kong_blackpepper_beef_pasta.jpeg`
2. `familymart-230_beijing_yogurt.png`
3. `familymart-587_chobani_greek_plain.png`
4. `familymart-591_roastery_espresso_latte.jpeg`

## Normalized output

Generated:

1. `A:\body-food-images\711-613.webp`
2. `A:\body-food-images\familymart-230.webp`
3. `A:\body-food-images\familymart-587.webp`
4. `A:\body-food-images\familymart-591.webp`

## Manifest and runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `711-613 -> 711-613.webp`
2. `familymart-230 -> familymart-230.webp`
3. `familymart-587 -> familymart-587.webp`
4. `familymart-591 -> familymart-591.webp`

Frontend cache-busting version updated to:

1. `20260708-realphoto-batch22`

## Test and visual coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `7-11 黑椒牛肉意面 -> 711-613`
2. `全家 无糖酸奶 -> familymart-230`
3. `全家 低糖希腊酸奶 -> familymart-587`
4. `全家 冰拿铁 -> familymart-591`

## Runtime verification

Confirmed live runtime search currently returns:

1. `7-11 黑椒牛肉意面 -> 711-613`
2. `全家 无糖酸奶 -> familymart-230`
3. `全家 低糖希腊酸奶 -> familymart-587`
4. `全家 冰拿铁 -> familymart-591`

Confirmed current visual check JSON contains desktop and mobile hits for:

1. `/assets/foods/711-613.webp`
2. `/assets/foods/familymart-230.webp`
3. `/assets/foods/familymart-587.webp`
4. `/assets/foods/familymart-591.webp`

Confirmed frontend runtime serves:

1. `http://localhost:8080/assets/foods/711-613.webp`
2. `http://localhost:8080/assets/foods/familymart-230.webp`
3. `http://localhost:8080/assets/foods/familymart-587.webp`
4. `http://localhost:8080/assets/foods/familymart-591.webp`

with HTTP `200`.

## Verification completed

### Static checks

1. `node --check frontend/assets/foods/food-image-assets.js`
2. `node --check miniprogram/utils/foodImageAssets.js`
3. `node --check scripts/visual_food_image_check.cjs`
4. `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - result: `89 passed, 3 warnings`

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

1. `Image keys using local real photos: 79`
2. `Image keys using local illustration fallback: 527`
3. `reports/food_real_photo_backlog.csv rows=389`

Confirmed removed from backlog:

1. `711-613`
2. `familymart-230`
3. `familymart-587`
4. `familymart-591`

## Remaining follow-up

Still worth continuing next:

1. `711-517` `7-11 黑椒牛肉便当`
2. `711-687` `7-11 黑椒鸡扒便当`
3. `familymart-228` `全家 关东煮萝卜`
4. `familymart-696` `全家 关东煮贡丸`
5. `familymart-521` `全家 关东煮鱼豆腐`

## Notes

This batch moved one more runtime-visible 7-11 pasta result and three more FamilyMart dairy/coffee results off SVG fallbacks in one pass. The current live search results now show distinct `.webp` assets for black-pepper beef pasta, unsweet yogurt, low-sugar Greek yogurt, and iced latte instead of repeating local illustration-style placeholders.
