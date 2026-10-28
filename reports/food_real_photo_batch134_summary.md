# Food Real Photo Batch 134

- image key: `tea-drink-generic`
- food: 常见茶饮料（含糖）
- source: [Public retail image of 统一冰红茶](http://image.suning.cn/uimg/b2c/newcatentries/0000000000-000000000104204995_2.jpg_800w_800h_4e)
- source cache: `reports/candidate_images/tea-drink-generic-search/candidate-1.jpg`
- semantic check: the image clearly shows a bottled sweetened tea product with readable 统一冰红茶 labeling
- classification: `near_product_photo` (representative product image for the generic sweetened bottled-tea category; not an official image for every brand)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `177` to `176` total real-photo items (`P1=53`, `P2=123`)

## Verification

- visual semantic spot-check: passed for bottled sweet tea and readable product label
- source classification explicitly records representative near-product usage
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
