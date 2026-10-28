# Food Real Photo Batch 142

- image key: `dish-360`
- food: 卤鸡腿
- source: [Public web dish image](https://img95.699pic.com/photo/50119/3769.jpg_wh860.jpg)
- source cache: `reports/candidate_images/dish-360-search/candidate-2.jpg`
- semantic check: the image clearly shows multiple glossy soy-braised chicken legs with spice garnish
- classification: `near_product_photo` (dish-level public photo; not a packaged product image)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `169` to `168` total real-photo items (`P1=53`, `P2=115`)

## Verification

- visual semantic spot-check: passed for braised chicken legs and sauce color
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
