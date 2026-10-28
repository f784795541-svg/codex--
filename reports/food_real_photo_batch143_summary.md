# Food Real Photo Batch 143

- image key: `dish-393`
- food: 卤鸭掌
- source: [Public retail product image of 酱卤鸭掌](https://cbu01.alicdn.com/img/ibank/O1CN01PJP8jm1H2Btl6VP8w_!!3504680699-0-cib.310x310.jpg)
- source cache: `reports/candidate_images/dish-393-search/product-1.jpg`
- semantic check: the package label explicitly identifies 酱卤鸭掌 and the image shows the duck feet
- classification: `retail_public` (representative packaged product image for the generic category)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `168` to `167` total real-photo items (`P1=53`, `P2=114`)

## Verification

- visual semantic spot-check: passed for package label and duck-foot shape
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
