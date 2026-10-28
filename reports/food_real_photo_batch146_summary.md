# Food Real Photo Batch 146

- image key: `dish-352`
- food: 叉烧
- source: [Public retail product image of sliced char siu](https://cbu01.alicdn.com/img/ibank/O1CN01eZOo4w20XvjAcsWNi_!!2961416860-0-cib.jpg)
- source cache: `reports/candidate_images/dish-352-search/product-1.jpg`
- semantic check: the package label explicitly identifies 叉烧肉 and the image shows sliced char siu
- classification: `retail_public` (representative packaged product image for the generic category)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `165` to `164` total real-photo items (`P1=53`, `P2=111`)

## Verification

- visual semantic spot-check: passed for package label and sliced char-siu appearance
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
