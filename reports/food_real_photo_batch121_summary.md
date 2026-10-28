# Food Real Photo Batch 121

- image key: `ajisen-236`
- food: 味千拉面 豚骨叉烧饭
- source: [Pork Chashu Rice Bowl (M) - Kitokito 2023-06-09.jpg](https://commons.wikimedia.org/wiki/File:Pork_Chashu_Rice_Bowl_(M)_-_Kitokito_2023-06-09.jpg)
- license: CC0
- source cache: `reports/candidate_images/ajisen-236-chashu.jpg`
- semantic check: the photo visibly shows sliced braised pork/chashu over white rice; no Ajisen packaging is claimed
- normalized output: `750x750 WebP`, `50,758 bytes`
- frontend/miniprogram SHA-256: `027928ae195a845b541d587d5efc4ad812a7b6ca0debb01b734339bd1c53c1d2`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 66 to 65; total backlog reduced from 190 to 189

## Verification

- `node scripts/validate_food_target_mode.cjs`: passed, `frontend=853`, `miniprogram=853`, `ledger=293`, `failures=0`
- `node scripts/build_food_asset_baseline.cjs`: passed, both clients have `853/853` assets, missing files `0`, oversized files `0`
- visual semantic spot-check: passed for pork chashu and rice
- runtime verification: pending; Docker Desktop is unavailable (`dockerDesktopLinuxEngine` connection failure), so PostgreSQL seed and live `/food/search` checks remain outstanding
