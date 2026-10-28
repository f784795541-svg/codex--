# Food Real Photo Batch 141

- image key: `dish-391`
- food: 卤猪耳朵
- source: [Public web dish image](https://i2.chuimg.com/923625ed13994127a5a62736bdd5a75e_1080w_645h.png?imageView2/2/w/660/interlace/1/q/90)
- source cache: `reports/candidate_images/dish-391-search/candidate-2.jpg`
- semantic check: the image clearly shows sliced braised pig ear with layered cartilage texture and braising sauce
- classification: `near_product_photo` (dish-level public photo; not a packaged product image)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `170` to `169` total real-photo items (`P1=53`, `P2=116`)

## Verification

- visual semantic spot-check: passed for sliced pig ear and cartilage texture
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
