# Batch 28 Real Photo Summary

## Scope
Close the previously half-finished batch 28 runtime rollout for these two image keys:

1. `familymart-416` `全家 奥尔良鸡肉卷`
2. `lawson-420` `罗森 日式照烧鸡腿便当`

## Source decision
Both items continue to use `near_product_photo` because stable official public product packshots were still not available from a reachable source with acceptable quality.

1. `familymart-416`
   - local asset: `A:\body-food-images\familymart-416.webp`
   - source cache: `reports/candidate_images/batch28/familymart-416_tandoori_chicken_wrap.jpg`
   - rationale: packaged chicken wrap photo is the closest distinct real-photo match for the live FamilyMart Orleans chicken wrap key.
2. `lawson-420`
   - local asset: `A:\body-food-images\lawson-420.webp`
   - source cache: `reports/candidate_images/batch28/lawson-420_teriyaki_chicken_rice_bowl.jpg`
   - rationale: packaged teriyaki chicken rice-bowl photo is the closest distinct real-photo match for the live Lawson teriyaki chicken bento key.

## Files already aligned in repo
1. `reports/food_photo_source_ledger.csv`
2. `frontend/assets/foods/food-image-assets.js`
3. `miniprogram/utils/foodImageAssets.js`
4. `backend/tests/test_food_image_keys.py`
5. `frontend/index.html`
6. `scripts/batch28_visual_check.cjs`

## Runtime fix performed
The local repo mapping was already correct, but the running `health_frontend` container still served stale manifest values:

- `familymart-416 -> familymart-416.svg`
- `lawson-420 -> lawson-420.svg`

This batch was closed by re-copying these exact runtime files into the frontend container and restarting it:

1. `frontend/index.html`
2. `frontend/assets/foods/food-image-assets.js`
3. `frontend/assets/foods/familymart-416.webp`
4. `frontend/assets/foods/lawson-420.webp`

After restart, the live frontend manifest served:

- `familymart-416 -> familymart-416.webp`
- `lawson-420 -> lawson-420.webp`

## Verification
### Direct asset checks
1. `http://localhost:8080/assets/foods/familymart-416.webp` -> `200`
2. `http://localhost:8080/assets/foods/lawson-420.webp` -> `200`

### Desktop live-page verification
Saved artifacts:

1. `reports/batch28_desktop_check.png`
2. `reports/batch28_visual_check.json`

Verified live results:

1. `全家 奥尔良鸡肉卷 -> /assets/foods/familymart-416.webp`
2. `罗森 日式照烧鸡腿便当 -> /assets/foods/lawson-420.webp`

### Mobile live-page verification
Saved artifacts:

1. `reports/batch28_mobile_check.png`
2. `reports/batch28_visual_check.json`

Verified live results:

1. `全家 奥尔良鸡肉卷 -> /assets/foods/familymart-416.webp`
2. `罗森 日式照烧鸡腿便当 -> /assets/foods/lawson-420.webp`

### Backend image-key test
1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
2. Result before backlog refresh: `105 passed, 3 warnings`

## Next required step
Run these serially after closing the runtime verification:

1. `python scripts/audit_food_images.py`
2. `python scripts/build_food_photo_backlog.py`

Do not run the audit/build refresh in parallel with photo prepare/sync work.
