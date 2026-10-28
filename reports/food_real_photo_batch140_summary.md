# Food Real Photo Batch 140

- image key: `dish-389`
- food: 卤海带结
- source: [Public web dish image](http://i2.chuimg.com/b9858b8902814dbc9b6f411906aa254c_2664w_2000h.jpg?imageView2/2/w/660/interlace/1/q/90)
- source cache: `reports/candidate_images/dish-389-search/candidate-1.jpg`
- semantic check: the image clearly shows folded seaweed knots with braising sauce and chili garnish
- classification: `near_product_photo` (dish-level public photo; not a packaged product image)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `171` to `170` total real-photo items (`P1=53`, `P2=117`)

## Verification

- visual semantic spot-check: passed for braised seaweed knots and sauce visibility
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
