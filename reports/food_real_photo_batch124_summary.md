# Food Real Photo Batch 124

- image key: `sams-614`
- food: 山姆 烤鸡
- source: [Sina media product photo](https://zhongces3.sina.com.cn/product/20230115/a6a61e95aa6c2ed95ca9b67629112fb3.jpeg)
- source cache: `reports/candidate_images/p1-next15/sams-614-sina-source.jpeg`
- semantic check: the image clearly shows multiple whole roast chickens in retail trays and visible `烤鸡 / CHICKEN` signage
- classification: `near_product_photo` (store display photo; not represented as an official packshot)
- normalized output: `750x750 WebP`, `83,310 bytes`
- frontend/miniprogram: same normalized image bytes
- SHA-256 (both clients): `60e4c5b613f826f3af41125b1f26209480d9ac195c27d8b9b9809af093f12ad8`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 64 to 63; total backlog reduced from 187 to 186

## Verification

- visual semantic spot-check: passed for roast chicken and product signage
- `node scripts/validate_food_target_mode.cjs`: passed after asset replacement
- `node scripts/build_food_asset_baseline.cjs`: passed, both clients `853/853`, missing files `0`, oversized files `0`
- runtime verification: pending; Docker Desktop is unavailable
