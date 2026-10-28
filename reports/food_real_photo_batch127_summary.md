# Food Real Photo Batch 127

- image key: `takeaway-261`
- food: 青椒牛肉饭
- source: [Xiachufang-hosted public dish image](https://i2.chuimg.com/400cbdb2453c4f3485f6c8c3f90edb87_1920w_2560h.jpg?imageView2/2/w/660/interlace/1/q/75)
- source cache: `reports/candidate_images/takeaway-261-search-4.jpg`
- semantic check: the image visibly shows sliced beef, green peppers, and rice in one plated dish
- classification: `near_product_photo` (dish-level image; no takeaway brand packaging is visible)
- normalized output: `750x750 WebP`, `39,990 bytes`
- frontend/miniprogram SHA-256 (both): `89b4b481df7b019c9354f17ea30e6a3a5de16edb3d56b1819228ed945ebd9fc9`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 61 to 60; total backlog reduced from 184 to 183

## Verification

- visual semantic spot-check: passed for beef, green peppers, and rice
- both client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop is unavailable
