# Food Real Photo Batch 135

- image key: `dish-365`
- food: 凉拌黄瓜
- source: [Public web dish image](https://materials.cdn.bcebos.com/images/8091348/7feb72ae7c2240ff68ffe133297f234a.jpeg)
- source cache: `reports/candidate_images/dish-365-cucumber/candidate-1.jpg`
- semantic check: the image clearly shows cucumber pieces with garlic, chili and dressing in a serving plate
- classification: `near_product_photo` (dish-level public photo; not a packaged product image)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `176` to `175` total real-photo items (`P1=53`, `P2=122`)

## Verification

- visual semantic spot-check: passed for cucumber salad, garlic and chili visibility
- source classification explicitly records dish-level near-product usage
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
