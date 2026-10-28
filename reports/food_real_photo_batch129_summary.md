# Food Real Photo Batch 129

- image key: `takeaway-260`
- food: 番茄牛腩饭
- source: [Sina-hosted public dish image](https://n.sinaimg.cn/sinakd10123/214/w2048h1366/20220526/3771-30098ac1da2fe137154789115dc2f2af.jpg)
- source cache: `reports/candidate_images/takeaway-260-search-3.jpg`
- semantic check: the image visibly shows tomato sauce, beef chunks, and rice in one plated meal
- classification: `near_product_photo` (dish-level image; no takeaway brand packaging is visible)
- normalized output: `750x750 WebP`, `60,696 bytes`
- frontend/miniprogram SHA-256 (both): `e65b88342c1ebe640c34031ba730088a32b690b92faddfb7d2f67174b0e03b39`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 59 to 58; total backlog reduced from 182 to 181

## Verification

- visual semantic spot-check: passed for tomato sauce, beef chunks, and rice
- both client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop is unavailable
