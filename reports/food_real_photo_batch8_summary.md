# Batch 8: KFC Wings and Egg Tart Runtime Upgrade

## Goal

Replace the current runtime-visible KFC fallback illustrations for:

1. `KFC 鸡翅`
2. `肯德基 蛋挞`

with local real-photo assets that are actually used by the running search results.

## Runtime keys locked before editing

Confirmed from live `/food/search` before this batch:

1. `KFC 鸡翅`
   - `kfc-156` `肯德基 新奥尔良烤翅 2块`
   - `kfc-157` `肯德基 香辣鸡翅 2块`
2. `肯德基 蛋挞`
   - `kfc-154` `肯德基 葡式蛋挞`

## Completed in this batch

### 1. `kfc-156`

- Food name: `肯德基 新奥尔良烤翅 2块`
- Source tier: `near_product_photo`
- Source page:
  - `http://www.5ikfc.com/kfc/NewOrleansRoastedWing/`
- Source image:
  - `http://img.5ikfc.com/kfc/2009/12/neworleansroastwings.jpg`
- Local cached prep file:
  - `reports/candidate_images/kfc_batch8/kfc_156_prepped.png`
- Result asset:
  - `A:\body-food-images\kfc-156.webp`

### 2. `kfc-157`

- Food name: `肯德基 香辣鸡翅 2块`
- Source tier: `near_product_photo`
- Source page:
  - `http://www.5ikfc.com/kfc/NewOrleansRoastedWing/`
- Source image:
  - `http://img.5ikfc.com/kfc/2009/12/hotwings.jpg`
- Local cached prep file:
  - `reports/candidate_images/kfc_batch8/kfc_157_prepped.png`
- Result asset:
  - `A:\body-food-images\kfc-157.webp`

### 3. `kfc-154`

- Food name: `肯德基 葡式蛋挞`
- Source tier: `near_product_photo`
- Source page:
  - `http://www.5ikfc.com/kfc/coupon20103316`
- Source image:
  - `http://data.5ikfc.com/coupons/kfc/2010/0901_13.jpg`
- Local cached prep file:
  - `reports/candidate_images/kfc_batch8/kfc_154_prepped_clean.png`
- Result asset:
  - `A:\body-food-images\kfc-154.webp`

## Processing notes

1. The public source images were not used raw.
2. Wings sources were cropped to remove page text and most of the solid green promo background.
3. The egg tart source had no stable clean official packshot in current public pages, so a tightly cropped near-product tart image was prepared from the public coupon asset and normalized into the local pipeline.
4. The prepared cache files were then passed through the existing:
   - `scripts/prepare_food_photo_assets.py`
   - `scripts/sync_food_photo_assets.ps1`

## Sync results

After sync:

1. `ManifestAssets=681`
2. `RealPhotoAssets=33`

The manifests now map:

1. `kfc-154 -> kfc-154.webp`
2. `kfc-156 -> kfc-156.webp`
3. `kfc-157 -> kfc-157.webp`

Affected runtime files:

1. `frontend/assets/foods/food-image-assets.js`
2. `miniprogram/utils/foodImageAssets.js`
3. `frontend/index.html`

## Verification completed

### Static checks

1. `node --check frontend/app.js`
2. `node --check frontend/assets/foods/food-image-assets.js`
3. `node --check miniprogram/utils/foodImageAssets.js`
4. `node --check scripts/visual_food_image_check.cjs`

### Backend/runtime checks

1. `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
   - `42 passed`
2. `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
   - backend/frontend/search/dashboard all healthy

### Visual verification

The runtime visual check now confirms:

1. Desktop
   - `KFC 鸡翅` -> `kfc-156.webp`, `kfc-157.webp`
   - `肯德基 蛋挞` -> `kfc-154.webp`
2. Mobile
   - `KFC 鸡翅` -> `kfc-156.webp`, `kfc-157.webp`
   - `肯德基 蛋挞` -> `kfc-154.webp`

Generated evidence:

1. `reports/visual_food_image_check.json`
2. `reports/visual_desktop_food_images.png`
3. `reports/visual_mobile_food_images.png`

## Important follow-up discovered in this batch

The live runtime still shows:

- `麦当劳 苹果派` -> `mcd-150`

but the regenerated backlog still lists:

- `mcd-150` as `麦当劳 奥利奥麦旋风`
- `mcd-146` as `麦当劳 苹果派`

That means the current runtime database and the static backlog source are not aligned for this McDonald's item. Future Apple Pie real-photo work must follow the live runtime key first, not the current backlog label.
