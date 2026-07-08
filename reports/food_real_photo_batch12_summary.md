# Batch 12: McDonald's Official Media Product Coverage Expansion

## Goal

Continue replacing McDonald's live fallback illustrations with official public product images for runtime-visible high-frequency items that map cleanly from the McDonald's China media product page.

This batch covered:

1. `mcd-138` `麦当劳 巨无霸`
2. `mcd-140` `麦当劳 中薯条`
3. `mcd-141` `麦当劳 麦辣鸡腿堡`

## Official sources added

Added ledger rows in `reports/food_photo_source_ledger.csv` for:

1. `mcd-138`
2. `mcd-140`
3. `mcd-141`

All three use:

- `source_tier=official_public`
- source page: `https://www.mcdonalds.com.cn/media/product`

Direct source images:

1. `mcd-138`
   - `https://azofficialwebsitestorage.blob.core.chinacloudapi.cn/public/upload/photo_db/2017/01/11/201701111552327010/201701111552327010_640_640.jpg?&rand=0827`
2. `mcd-140`
   - `https://azofficialwebsitestorage.blob.core.chinacloudapi.cn/public/upload/photo_db/2017/01/11/201701111600118272/201701111600118272_640_640.jpg?&rand=0827`
3. `mcd-141`
   - `https://azofficialwebsitestorage.blob.core.chinacloudapi.cn/public/upload/photo_db/2017/01/11/201701111552101137/201701111552101137_640_640.jpg?&rand=0827`

Cached source files:

1. `reports/candidate_images/mcd_138_official.jpg`
2. `reports/candidate_images/mcd_140_official.jpg`
3. `reports/candidate_images/mcd_141_official.jpg`

## Local assets generated

Created:

1. `A:\body-food-images\mcd-138.webp`
2. `A:\body-food-images\mcd-140.webp`
3. `A:\body-food-images\mcd-141.webp`

## Manifest/runtime updates

After sync:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`

now map:

1. `mcd-138 -> mcd-138.webp`
2. `mcd-140 -> mcd-140.webp`
3. `mcd-141 -> mcd-141.webp`

Frontend cache-busting version updated to:

- `20260708-realphoto-batch12`

## Verification coverage added

Updated:

1. `backend/tests/test_food_image_keys.py`
2. `scripts/visual_food_image_check.cjs`

Added exact coverage for:

1. `麦当劳 巨无霸 -> mcd-138`
2. `麦当劳 中薯条 -> mcd-140`
3. `麦当劳 麦辣鸡腿堡 -> mcd-141`

## Runtime verification

Confirmed live runtime search returns:

1. `麦当劳 巨无霸 -> mcd-138`
2. `麦当劳 中薯条 -> mcd-140`
3. `麦当劳 麦辣鸡腿堡 -> mcd-141`

Confirmed desktop and mobile visual checks render:

1. `/assets/foods/mcd-138.webp`
2. `/assets/foods/mcd-140.webp`
3. `/assets/foods/mcd-141.webp`

## Verification completed

### Static checks

1. `node --check frontend/app.js`
2. `node --check frontend/assets/foods/food-image-assets.js`
3. `node --check miniprogram/utils/foodImageAssets.js`
4. `node --check scripts/visual_food_image_check.cjs`

### Tests

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - `52 passed`

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

1. `Image keys using local real photos: 42`
2. `Image keys using local illustration fallback: 564`

From `reports/food_real_photo_backlog.csv`:

1. backlog rows reduced from `429` to `426`
2. `mcd-138`
3. `mcd-140`
4. `mcd-141`

are no longer pending.

## Implementation note

Direct whole-folder `docker cp frontend/. ...` hit a Windows-side file lock during this batch, so the runtime sync was completed using targeted file copies for:

1. `frontend/index.html`
2. `frontend/assets/foods/food-image-assets.js`
3. `frontend/assets/foods/mcd-138.webp`
4. `frontend/assets/foods/mcd-140.webp`
5. `frontend/assets/foods/mcd-141.webp`

That kept the runtime state correct without widening the change.

## Recommended next batch

Continue with one of these:

1. remaining high-value McDonald's items still on svg such as `mcd-147` or `mcd-148` if a clean official source is found
2. 7-11 / 罗森 / 全家 top backlog items still using svg
3. other high-priority official-public brand entries near the top of `food_real_photo_backlog.csv`
