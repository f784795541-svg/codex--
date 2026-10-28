# Food Real Photo Batch 145

- image key: `dish-214`
- food: 地三鲜
- source: [Public web dish image](https://www.shuomingshu.cn/wp-content/uploads/images/2023/04/26/1531191382296270e9eb5a3_gmjg1ticha3.png)
- source cache: `reports/candidate_images/dish-214-search/candidate-1.jpg`
- semantic check: the image clearly shows eggplant, potato and green pepper, the defining ingredients of 地三鲜
- classification: `near_product_photo` (dish-level public photo; not a packaged product image)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `166` to `165` total real-photo items (`P1=53`, `P2=112`)

## Verification

- visual semantic spot-check: passed for eggplant, potato and green pepper visibility
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
