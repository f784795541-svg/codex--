# Food Real Photo Batch 138

- image key: `dish-490`
- food: 东北大拉皮
- source: [Public web dish image](http://n.sinaimg.cn/sinakd10023/266/w640h426/20220912/8207-04d0ee7ca918ba9c131d0fb998288a29.png)
- source cache: `reports/candidate_images/dish-490-search/candidate-2.jpg`
- semantic check: the image clearly shows translucent pulled-starch noodles with cucumber and carrot garnish in a dressed serving plate
- classification: `near_product_photo` (dish-level public photo; not a packaged product image)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `173` to `172` total real-photo items (`P1=53`, `P2=119`)

## Verification

- visual semantic spot-check: passed for translucent pulled-starch noodles and typical garnish
- source classification explicitly records dish-level near-product usage
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
