# Batch 29 Real Photo Summary

## Scope
Add and verify the next two P0 convenience-store bento image keys:

1. `familymart-520` `全家 黑椒牛肉便当`
2. `lawson-691` `罗森 咖喱鸡排便当`

## Source decision
Both items use `near_product_photo` because stable official public convenience-store product packshots were still not available in a reusable form, but semantically accurate packaged or plated real-food product photos were available and distinct enough to avoid same-image reuse.

1. `familymart-520`
   - local asset: `A:\body-food-images\familymart-520.webp`
   - source cache: `reports/candidate_images/batch29/familymart-520_black_pepper_beef_rice_bowl.jpg`
   - source url: `https://target.scene7.com/is/image/Target/GUEST_9150ad61-b719-496c-8529-43bb379df19b`
   - rationale: packaged black-pepper beef rice-bowl photo is the closest distinct near-product real-photo match for the live runtime FamilyMart black-pepper beef bento key.
2. `lawson-691`
   - local asset: `A:\body-food-images\lawson-691.webp`
   - source cache: `reports/candidate_images/batch29/lawson-691_chicken_cutlet_rice_bowl.jpeg`
   - source url: `https://img06.weeecdn.com/item/image/111/457/75051ECBE2C942BE.jpeg`
   - rationale: plated chicken-cutlet rice-bowl photo is the closest distinct near-product real-photo match for the live runtime Lawson curry chicken-cutlet bento key.

## Files updated
1. `reports/food_photo_source_ledger.csv`
2. `frontend/assets/foods/food-image-assets.js`
3. `miniprogram/utils/foodImageAssets.js`
4. `backend/tests/test_food_image_keys.py`
5. `frontend/index.html`
6. `reports/batch29_visual_check.json`
7. `reports/batch29_desktop_check.png`
8. `reports/batch29_mobile_check.png`

## Verification
### Asset generation and sync
1. `python scripts/prepare_food_photo_assets.py --only-key familymart-520 --only-key lawson-691`
2. `powershell -ExecutionPolicy Bypass -File scripts/sync_food_photo_assets.ps1`

### Backend image-key tests
1. synced `backend/tests/test_food_image_keys.py` into `health_backend`
2. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
3. result: `107 passed, 3 warnings`

### Runtime checks
1. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1` -> healthy
2. live frontend manifest served:
   - `familymart-520 -> familymart-520.webp`
   - `lawson-691 -> lawson-691.webp`
3. direct asset checks:
   - `http://localhost:8080/assets/foods/familymart-520.webp` -> `200`
   - `http://localhost:8080/assets/foods/lawson-691.webp` -> `200`

### Desktop live-page verification
Saved artifacts:

1. `reports/batch29_desktop_check.png`
2. `reports/batch29_visual_check.json`

Verified live results:

1. `全家 黑椒牛肉便当 -> /assets/foods/familymart-520.webp`
2. `罗森 咖喱鸡排便当 -> /assets/foods/lawson-691.webp`

### Mobile live-page verification
Saved artifacts:

1. `reports/batch29_mobile_check.png`
2. `reports/batch29_visual_check.json`

Verified live results:

1. `全家 黑椒牛肉便当 -> /assets/foods/familymart-520.webp`
2. `罗森 咖喱鸡排便当 -> /assets/foods/lawson-691.webp`

## Important note
During this batch, `familymart-520.webp` briefly existed as a zero-byte local file and `lawson-691.webp` had not yet been copied into the repo asset directories, which caused the manifest to temporarily fall back to `.svg`. The fix was to copy the generated `.webp` files from `A:\body-food-images` into both repo asset directories before re-running sync and runtime verification.

## Next required step
Refresh the audit and backlog serially:

1. `python scripts/audit_food_images.py`
2. `python scripts/build_food_photo_backlog.py`
