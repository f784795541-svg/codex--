# Food Real Photo Batch 5 Summary

## Scope

- Batch date: 2026-07-08
- Focus: CHAGEE high-value runtime keys
- Runtime search keywords locked first:
  - `霸王茶姬`
  - `霸王茶姬 伯牙`

## Keys completed

1. `chagee-639` `霸王茶姬 伯牙绝弦`
2. `chagee-640` `霸王茶姬 万里木兰`
3. `chagee-641` `霸王茶姬 桂馥兰香`

## Source decisions

### `chagee-639`

- `source_tier`: `official_public`
- `source_url`: `https://oss.chagee.com.sg/website2025/uploads/20240607/8cd78dd3-be24-4e53-af47-9018dd6e1d6c.png`
- Source page: `https://www.chagee.com.sg/zh-sg/product/fresh-milk-tea-series`
- Notes: official public CHAGEE product image

### `chagee-640`

- `source_tier`: `near_product_photo`
- `source_url`: `https://inews.gtimg.com/news_bt/OzAt70cPSrU1QBV7_9DelxGkwH6ROF7zk0xyzDWyoNHRYAA/641`
- Source page: `https://news.qq.com/rain/a/20240517A09QA700`
- Notes:
  - used public near-product real cup photo from launch coverage
  - no stable official public product packshot was found during this batch
  - kept as real-photo fallback instead of blocking the batch

### `chagee-641`

- `source_tier`: `official_public`
- `source_url`: `https://oss.chagee.com.sg/website2025/uploads/20240607/2bf7eaee-9620-43ac-854c-db9a06f4865a.jpg`
- Source page: `https://www.chagee.com.sg/zh-sg/product/fresh-milk-tea-series`
- Notes: official public CHAGEE product image

## Local assets generated

- `A:\body-food-images\chagee-639.webp`
- `A:\body-food-images\chagee-640.webp`
- `A:\body-food-images\chagee-641.webp`

## Runtime rollout

Commands run:

```powershell
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\prepare_food_photo_assets.py --only-key chagee-639 --only-key chagee-640 --only-key chagee-641
powershell -ExecutionPolicy Bypass -File scripts\sync_food_photo_assets.ps1
docker cp frontend/. health_frontend:/usr/share/nginx/html/
docker restart health_frontend
```

Post-sync counters:

- `ManifestAssets=680`
- `RealPhotoAssets=26`

Note:

- `RealPhotoAssets` counts all non-SVG manifest entries
- `Image keys using local real photos` in refinement summary is now `24`
- the difference is expected because manifest-level assets include non-product-level real-photo entries too

## Verification

Static checks passed:

```powershell
node --check frontend/app.js
node --check frontend/assets/foods/food-image-assets.js
node --check miniprogram/utils/foodImageAssets.js
node --check scripts/visual_food_image_check.cjs
```

Backend/runtime checks passed:

```powershell
docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q
powershell -ExecutionPolicy Bypass -File scripts\check_runtime.ps1
```

Observed results:

- `42 passed`
- backend `/health` ok
- frontend `/` ok
- `/food/search` ok
- `/dashboard/summary` ok

Visual verification passed:

- `reports/visual_food_image_check.json`
- `reports/visual_desktop_food_images.png`
- `reports/visual_mobile_food_images.png`

Confirmed runtime image mapping:

- desktop `霸王茶姬` top results:
  - `chagee-639.webp`
  - `chagee-640.webp`
  - `chagee-641.webp`
- mobile `霸王茶姬` top results:
  - `chagee-639.webp`
  - `chagee-640.webp`
  - `chagee-641.webp`
- `霸王茶姬 伯牙` remains `chagee-639.webp` on both desktop and mobile

## Additional update in this batch

- `scripts/visual_food_image_check.cjs` now includes the generic keyword `霸王茶姬`
- this keeps future visual regressions from missing `chagee-640` and `chagee-641`

## Next recommended batch

1. `familymart-693` `全家 韩式泡菜饭团`
2. `familymart-227` `全家 烤鸡胸饭团`
3. `familymart-418` `全家 溏心蛋饭团`
4. `familymart-519` `全家 金枪鱼三明治`
