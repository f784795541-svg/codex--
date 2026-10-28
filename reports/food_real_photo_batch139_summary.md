# Food Real Photo Batch 139

- image key: `dish-364`
- food: 卤蛋
- source: [Public retail product image of 五香卤蛋](https://cbu01.alicdn.com/img/ibank/O1CN014J7nUa1pHwEMWZrzh_!!2215659115336-0-cib.310x310.jpg)
- source cache: `reports/candidate_images/dish-364-search/product-1.jpg`
- semantic check: the image clearly shows braised eggs, including a cut egg with visible yolk
- classification: `retail_public` (representative product image for the generic braised-egg category)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `172` to `171` total real-photo items (`P1=53`, `P2=118`)

## Verification

- visual semantic spot-check: passed for whole braised eggs and cut yolk visibility
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
