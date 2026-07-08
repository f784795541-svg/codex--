# Batch 10: McDonald's Official Product Photo Expansion

## Goal

Extend the McDonald's canonical real-photo coverage beyond Apple Pie by replacing the remaining high-visibility runtime fallback illustrations for:

1. `麦当劳 麦辣鸡翅`
2. `麦当劳 奥利奥麦旋风`
3. `麦当劳 热巧克力新地`

with official public McDonald's China product images that actually render in live search results.

## What was added

### Official public source rows

Added to `reports/food_photo_source_ledger.csv`:

1. `mcd-142` `麦当劳 麦辣鸡翅`
2. `mcd-150` `麦当劳 奥利奥麦旋风`
3. `mcd-151` `麦当劳 热巧克力新地`

All three were recorded as:

- `source_tier=official_public`
- source page: `https://www.mcdonalds.com.cn/media/product`
- cached source files under `reports/candidate_images/`

### Generated local assets

Created:

1. `A:\body-food-images\mcd-142.webp`
2. `A:\body-food-images\mcd-150.webp`
3. `A:\body-food-images\mcd-151.webp`

### Client asset manifests

After resync, both manifests now point to the real-photo files:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

Expected mappings now include:

1. `mcd-142 -> mcd-142.webp`
2. `mcd-150 -> mcd-150.webp`
3. `mcd-151 -> mcd-151.webp`

## Supporting code/test updates

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`
3. `frontend/index.html`

Changes:

1. Added exact image-key expectations for:
   - `麦当劳 麦辣鸡翅 -> mcd-142`
   - `麦当劳 奥利奥麦旋风 -> mcd-150`
   - `麦当劳 热巧克力新地 -> mcd-151`
2. Added these keywords to the desktop/mobile visual verification script.
3. Bumped the frontend food-image manifest version to:
   - `20260708-realphoto-batch10`

## Runtime verification

Confirmed live runtime search returns:

1. `麦当劳 麦辣鸡翅 -> mcd-142`
2. `麦当劳 奥利奥麦旋风 -> mcd-150`
3. `麦当劳 热巧克力新地 -> mcd-151`

Confirmed live desktop and mobile visual checks render:

1. `麦当劳 麦辣鸡翅 -> /assets/foods/mcd-142.webp`
2. `麦当劳 奥利奥麦旋风 -> /assets/foods/mcd-150.webp`
3. `麦当劳 热巧克力新地 -> /assets/foods/mcd-151.webp`

## Verification completed

### Static checks

1. `node --check frontend/app.js`
2. `node --check frontend/assets/foods/food-image-assets.js`
3. `node --check miniprogram/utils/foodImageAssets.js`
4. `node --check scripts/visual_food_image_check.cjs`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - `45 passed`

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

1. `Image keys using local real photos: 34`
2. `Image keys using local illustration fallback: 572`

From `reports/food_real_photo_backlog.csv`:

1. backlog rows reduced from `437` to `434`
2. `mcd-142`
3. `mcd-150`
4. `mcd-151`

are no longer pending in the backlog.

## Recommended next batch

Continue with one of these:

1. `mcd-152` `麦当劳 猪柳蛋麦满分` if a stable official public source can be found
2. remaining convenience-store high-frequency items in `7-11 / 罗森 / 全家`
3. remaining runtime-visible tea/coffee product tails
