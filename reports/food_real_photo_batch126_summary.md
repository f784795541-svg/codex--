# Food Real Photo Batch 126

- image key: `takeaway-244`
- food: 黄焖鸡米饭
- source: [JD CDN product image](https://m.360buyimg.com/mobilecms/s750x750_jfs/t1/116672/28/23639/336590/62554381E78d1a38e/50e1e64c12999306.jpg!q80.dpg)
- source cache: `reports/candidate_images/takeaway-244-jd-huangmen.jpg`
- semantic check: the image visibly shows the packaged dish, chicken pieces, sauce, vegetables, and a serving of rice
- classification: `near_product_photo` (dish-level product image; not represented as an official takeaway brand packshot)
- normalized output: `750x750 WebP`, `87,020 bytes`
- frontend/miniprogram SHA-256 (both): `6e5fff7a00351d20c7666943bdc056d78242a5382994f63028b9eab2aa0d153e`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 62 to 61; total backlog reduced from 185 to 184

## Verification

- visual semantic spot-check: passed for packaged 黄焖鸡米饭, chicken, vegetables, and rice
- both client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop is unavailable
