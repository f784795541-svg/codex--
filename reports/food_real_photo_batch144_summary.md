# Food Real Photo Batch 144

- image key: `dish-392`
- food: 卤鸭翅
- source: [Public retail product image of 酱卤鸭翅](https://img.alicdn.com/bao/uploaded/i1/2867453155/O1CN01oZs9hr1ZB2UlslPt7_!!2867453155-0-picasso.jpg)
- source cache: `reports/candidate_images/dish-392-search/candidate-2.jpg`
- semantic check: the package label explicitly identifies 酱卤鸭翅 and the image shows duck wings
- classification: `retail_public` (representative packaged product image for the generic category)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `167` to `166` total real-photo items (`P1=53`, `P2=113`)

## Verification

- visual semantic spot-check: passed for package label and duck-wing shape
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
