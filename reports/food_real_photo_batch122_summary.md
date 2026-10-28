# Food Real Photo Batch 122

- image key: `takeaway-274`
- food: 照烧牛肉饭
- source: [Hoka Hoka Bento Bento Special 4.jpg](https://commons.wikimedia.org/wiki/File:Hoka_Hoka_Bento_Bento_Special_4.jpg)
- license: CC BY-SA 3.0
- source cache: `reports/candidate_images/takeaway-274-teriyaki-beef.jpg`
- semantic check: the photo visibly shows teriyaki beef and white rice in a bento; it is recorded as a dish-level near-product photo, not branded takeaway packaging
- normalized output: `750x750 WebP`, `54,634 bytes`
- frontend/miniprogram SHA-256: `f7fd34f8e20a93b9e2059528b3ecd6af648522182392b494fa9e79450517a9bb`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 66 to 65; total backlog reduced from 189 to 188

## Verification

- `node scripts/validate_food_target_mode.cjs`: passed, `frontend=853`, `miniprogram=853`, `ledger=294`, `failures=0`
- `node scripts/build_food_asset_baseline.cjs`: passed, both clients have `853/853` assets, missing files `0`, oversized files `0`
- visual semantic spot-check: passed for teriyaki beef and rice
- runtime verification: pending; Docker Desktop is unavailable, so PostgreSQL seed and live `/food/search` checks remain outstanding
