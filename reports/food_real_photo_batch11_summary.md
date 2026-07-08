# Batch 11: McDonald's Official Product Photo Coverage Expansion

## Goal

Continue replacing live McDonald's fallback illustrations with official public product photos for runtime-visible canonical keys that already had stable backend name-to-key compatibility.

This batch targeted:

1. `mcd-143` `麦当劳 麦乐鸡块 4块`
2. `mcd-144` `麦当劳 麦乐鸡块 10块`
3. `mcd-145` `麦当劳 麦香鸡`
4. `mcd-149` `麦当劳 脆薯饼`
5. `mcd-152` `麦当劳 猪柳蛋麦满分`

## Sources added

### Official public McDonald's China media/product sources

Added ledger rows in `reports/food_photo_source_ledger.csv` for:

1. `mcd-143`
2. `mcd-144`
3. `mcd-145`
4. `mcd-149`
5. `mcd-152`

Source classes:

1. `mcd-143` `official_public`
2. `mcd-144` `official_public`
3. `mcd-145` `official_public`
4. `mcd-149` `official_public`
5. `mcd-152` `official_public`

Source pages:

1. `https://www.mcdonalds.com.cn/media/product`
2. `https://www.mcdonalds.com.cn/product/Hash-Brown`
3. `https://www.mcdonalds.com.cn/product/Sausage-McMuffin-With-Egg`

Cached source files:

1. `reports/candidate_images/mcd_143_144_official.jpg`
2. `reports/candidate_images/mcd_145_official.jpg`
3. `reports/candidate_images/mcd_149_official.png`
4. `reports/candidate_images/mcd_152_official.png`

## Local assets generated

Created:

1. `A:\body-food-images\mcd-143.webp`
2. `A:\body-food-images\mcd-144.webp`
3. `A:\body-food-images\mcd-145.webp`
4. `A:\body-food-images\mcd-149.webp`
5. `A:\body-food-images\mcd-152.webp`

## Manifest/runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `mcd-143 -> mcd-143.webp`
2. `mcd-144 -> mcd-144.webp`
3. `mcd-145 -> mcd-145.webp`
4. `mcd-149 -> mcd-149.webp`
5. `mcd-152 -> mcd-152.webp`

Frontend cache-busting version updated to:

- `20260708-realphoto-batch11`

## Test and visual verification coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `麦当劳 麦乐鸡块 4块 -> mcd-143`
2. `麦当劳 麦乐鸡块 10块 -> mcd-144`
3. `麦当劳 麦香鸡 -> mcd-145`
4. `麦当劳 脆薯饼 -> mcd-149`
5. `麦当劳 猪柳蛋麦满分 -> mcd-152`

## Runtime verification

Confirmed live runtime search returns:

1. `麦当劳 麦乐鸡块 4块 -> mcd-143`
2. `麦当劳 麦乐鸡块 10块 -> mcd-144`
3. `麦当劳 麦香鸡 -> mcd-145`
4. `麦当劳 脆薯饼 -> mcd-149`
5. `麦当劳 猪柳蛋麦满分 -> mcd-152`

Confirmed desktop and mobile visual checks render:

1. `/assets/foods/mcd-143.webp`
2. `/assets/foods/mcd-144.webp`
3. `/assets/foods/mcd-145.webp`
4. `/assets/foods/mcd-149.webp`
5. `/assets/foods/mcd-152.webp`

## Verification completed

### Static checks

1. `node --check frontend/app.js`
2. `node --check frontend/assets/foods/food-image-assets.js`
3. `node --check miniprogram/utils/foodImageAssets.js`
4. `node --check scripts/visual_food_image_check.cjs`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - `49 passed`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend/frontend/search/dashboard healthy

### Visual checks

1. `scripts/visual_food_image_check.cjs`
2. `reports/visual_food_image_check.json`
3. `reports/visual_desktop_food_images.png`
4. `reports/visual_mobile_food_images.png`

## Audit/backlog status after this batch

From `reports/food_image_refinement_summary.md`:

1. `Image keys using local real photos: 39`
2. `Image keys using local illustration fallback: 567`

From `reports/food_real_photo_backlog.csv`:

1. backlog rows reduced from `434` to `429`
2. `mcd-143`
3. `mcd-144`
4. `mcd-145`
5. `mcd-149`
6. `mcd-152`

are no longer pending.

## Recommended next batch

Continue with one of these:

1. remaining McDonald's canonical runtime keys such as `mcd-148`
2. visible Lawson / 7-11 / FamilyMart convenience items still on svg
3. other official-public brand items near the top of `food_real_photo_backlog.csv`
