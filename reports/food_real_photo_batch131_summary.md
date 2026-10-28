# Food Real Photo Batch 131

- image key: `heytea-grape`
- food: 喜茶 多肉葡萄
- source: [Public product image](https://sowebsite.oss-cn-shanghai.aliyuncs.com/files/2020/08/640.webp-1-4.jpg)
- source cache: `reports/candidate_images/heytea-grape-v2/candidate-1`
- semantic check: the image visibly shows a HEYTEA-branded purple grape drink with grape fruit and cheese foam
- classification: `near_product_photo` (public third-party product photo; not represented as an official HEYTEA packshot)
- normalized output: `750x750 WebP`, `37,520 bytes`
- frontend/miniprogram SHA-256 (both): `34b14e46c0ec4b0c762a6e8491d520a0f3e78a474a5bd1a8242ee119466daee3`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 57 to 56; total backlog reduced from 180 to 179

## Verification

- visual semantic spot-check: passed for the HEYTEA logo, purple grape drink, grape fruit and cheese foam
- both client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- static audit, backlog rebuild, target-mode validation and asset baseline: passed
- runtime verification: pending; Docker Desktop is unavailable
