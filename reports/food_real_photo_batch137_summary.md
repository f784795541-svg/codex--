# Food Real Photo Batch 137

- image key: `dish-382`
- food: 剁椒鱼头
- source: [Public web dish image](https://i2.chuimg.com/8f8ecea63a1a4ea4b315139c14701cca_1080w_1080h.jpg?imageView2/2/w/660/interlace/1/q/90)
- source cache: `reports/candidate_images/dish-382-search/candidate-2.jpg`
- semantic check: the image clearly shows a fish head covered with chopped red chili and served on a plate
- classification: `near_product_photo` (dish-level public photo; not a packaged product image)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `174` to `173` total real-photo items (`P1=53`, `P2=120`)

## Verification

- visual semantic spot-check: passed for fish head and chopped chili visibility
- source classification explicitly records dish-level near-product usage
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
