# Food Real Photo Batch 125

- image key: `takeaway-246`
- food: 肉末茄子饭
- source: [Alibaba product image](https://img.alicdn.com/i1/2200772690841/O1CN01rjGgXu1I5DnJjA59z_!!2200772690841.jpg)
- source cache: `reports/candidate_images/takeaway-246-caiyangyang.jpg`
- semantic check: the image visibly shows rice, minced pork, and eggplant in one plated meal
- classification: `near_product_photo` (料理包商品图; not represented as a branded takeaway package)
- normalized output: `750x750 WebP`, `60,412 bytes`
- frontend/miniprogram SHA-256 (both): `e4f9e6fb5ae289f24ac36517eb841175c10a1ddf0c09acdf737ffea6fa2c5bbf`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 63 to 62; total backlog reduced from 186 to 185

## Verification

- visual semantic spot-check: passed for rice, minced pork, and eggplant
- `node scripts/validate_food_target_mode.cjs`: passed after asset replacement
- `node scripts/build_food_asset_baseline.cjs`: passed, both clients `853/853`, missing files `0`, oversized files `0`
- runtime verification: pending; Docker Desktop is unavailable
