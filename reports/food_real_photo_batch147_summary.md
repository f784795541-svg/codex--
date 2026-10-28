# Food Real Photo Batch 147

- image key: `dish-561`
- food: 娃娃菜
- source: [Public web image of baby napa cabbage](https://p1.ssl.qhimg.com/t0119260b590284f145.jpg)
- source cache: `reports/candidate_images/dish-561-search/candidate-3.jpg`
- semantic check: the image clearly shows fresh baby napa cabbage heads on a white plate
- classification: `near_product_photo` (vegetable-level public photo; not a packaged product image)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `164` to `163` total real-photo items (`P1=53`, `P2=110`)

## Verification

- visual semantic spot-check: passed for baby napa cabbage shape and color
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
