# Food Real Photo Batch 136

- image key: `lunch-meat`
- food: 午餐肉
- source: [Public retail product image of 中粮梅林午餐肉](https://doc-fd.zol-img.com.cn/t_s2000x2000/g8/M00/04/08/ChMkLWkT5JGIebfeAAFcVzzHO1AAAGSvwP4JIUAAVxv219.jpg)
- source cache: `reports/candidate_images/lunch-meat-search/candidate-2.jpg`
- semantic check: the image clearly shows luncheon-meat cans and sliced luncheon meat
- classification: `retail_public` (representative retail product image for the generic category; not an official image for every brand)
- normalized output: `750x750 WebP`
- frontend/miniprogram and `A:\body-food-images` synchronized from the same normalized output
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: reduced from `175` to `174` total real-photo items (`P1=53`, `P2=121`)

## Verification

- visual semantic spot-check: passed for luncheon-meat cans and slices
- representative-category qualification is recorded in the ledger
- all client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop Linux engine is unavailable
