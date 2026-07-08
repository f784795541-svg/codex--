# Batch 9: McDonald's Apple Pie Runtime Canonicalization

## Goal

Fix the live runtime Apple Pie mismatch and replace the visible Apple Pie fallback illustration with an official McDonald's public product image.

## Problem confirmed before this batch

The live runtime was inconsistent with the static backlog:

1. Live runtime search showed:
   - `麦当劳 苹果派 -> mcd-150`
2. Static catalog and backlog still treated:
   - `mcd-146 -> 麦当劳 苹果派`
   - `mcd-150 -> 麦当劳 奥利奥麦旋风`

That meant directly attaching an Apple Pie photo to `mcd-150` would have broken future rebuilt databases where `mcd-150` is still Oreo McFlurry.

## Fix applied

### 1. Added canonical product-image key compatibility for the shifted McDonald's runtime range

Updated:

- `backend/app/food_metadata.py`

The backend now returns canonical image keys for the known shifted McDonald's names, including:

1. `麦当劳 麦辣鸡翅 -> mcd-142`
2. `麦当劳 麦乐鸡块 4块 -> mcd-143`
3. `麦当劳 麦乐鸡块 10块 -> mcd-144`
4. `麦当劳 麦香鸡 -> mcd-145`
5. `麦当劳 苹果派 -> mcd-146`
6. `麦当劳 双层深海鳕鱼堡 -> mcd-147`
7. `麦当劳 板烧鸡腿堡 -> mcd-148`
8. `麦当劳 脆薯饼 -> mcd-149`
9. `麦当劳 奥利奥麦旋风 -> mcd-150`
10. `麦当劳 热巧克力新地 -> mcd-151`
11. `麦当劳 猪柳蛋麦满分 -> mcd-152`

This keeps the client-side asset key stable by product name even when the runtime database still carries an older id segment.

### 2. Added an official Apple Pie source for the canonical key

Updated ledger entry:

- `mcd-146`

Source tier:

- `official_public`

Official source page:

- `https://corporate.mcdonalds.com/corpmcd/our-stories/media-assets-library/media-article/baked_apple_pie.html`

Official source image:

- `https://www.mcdonalds.com/content/dam/sites/corp/nfl/newsroom/menu-items-2023/NR_202004_0706_BakedApplePie_Broken_2000x2000.png`

Cached source file:

- `reports/candidate_images/mcd_146_official.png`

Generated local asset:

- `A:\body-food-images\mcd-146.webp`

## Files changed in this batch

1. `backend/app/food_metadata.py`
2. `backend/tests/test_food_image_keys.py`
3. `reports/food_photo_source_ledger.csv`
4. `frontend/index.html`
5. `frontend/assets/foods/food-image-assets.js`
6. `miniprogram/utils/foodImageAssets.js`
7. `reports/food_real_photo_backlog.csv`
8. `reports/food_image_refinement_summary.md`
9. `reports/visual_food_image_check.json`

## Runtime result after the fix

Confirmed live runtime search now returns:

1. `麦当劳 苹果派 -> mcd-146`
2. `麦当劳 麦辣鸡翅 -> mcd-142`
3. `麦当劳 奥利奥麦旋风 -> mcd-150`

That means the Apple Pie image is now attached to the canonical Apple Pie key instead of the shifted runtime key.

## Verification completed

### Python/backend

1. Backend files compiled successfully for the actual app modules:
   - `database.py`
   - `dependencies.py`
   - `error_tracking.py`
   - `food_metadata.py`
   - `main.py`
   - `models.py`
   - `schemas.py`
   - `security.py`
   - `seed.py`
   - `services.py`
   - `workout_metadata.py`
2. Note:
   - The folder also contains pre-existing `._*.py` metadata files with null bytes.
   - Those are not runtime modules and were not introduced by this batch.

### Static checks

1. `node --check frontend/app.js`
2. `node --check frontend/assets/foods/food-image-assets.js`
3. `node --check miniprogram/utils/foodImageAssets.js`
4. `node --check scripts/visual_food_image_check.cjs`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - `42 passed`

### Runtime checks

1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend/frontend/search/dashboard all healthy

### Visual verification

Confirmed from `reports/visual_food_image_check.json`:

1. Desktop:
   - `麦当劳 苹果派 -> mcd-146.webp`
2. Mobile:
   - `麦当劳 苹果派 -> mcd-146.webp`

## Audit/backlog status after this batch

1. `Image keys using local real photos: 31`
2. `Image keys using local illustration fallback: 575`
3. Backlog rows:
   - from `438` to `437`

Current McDonald's backlog still includes:

1. `mcd-150` `麦当劳 奥利奥麦旋风`

Apple Pie is no longer pending in the backlog because it now uses the canonical real-photo key `mcd-146`.
