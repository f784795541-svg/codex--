# Food Real Photo Batch 123

- image key: `takeaway-245`
- food: 黑椒牛柳饭
- source: [Black Pepper Beef on rice - Hongyun Chinese Restaurant](https://commons.wikimedia.org/wiki/File:%E9%BB%91%E6%A4%92%E7%89%9B%E8%82%89%E9%A5%AD_Black_Pepper_Beef_on_rice_-_Hongyun_Chinese_Restaurant_AUD8.50_(3450250738).jpg)
- license: CC BY-SA 2.0
- source cache: `reports/candidate_images/takeaway-245-blackpepper-beef.jpg`
- semantic check: the photo visibly shows beef, green pepper, black pepper sauce, and white rice
- normalized output: `750x750 WebP`, `37,810 bytes`
- frontend/miniprogram SHA-256: `2d61cab41b248f0ff6e8f396fd23fbe41327b6e3e36bce7da8a3c5ca8daaabfc`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 65 to 64; total backlog reduced from 188 to 187

## Verification

- `node scripts/validate_food_target_mode.cjs`: passed, `frontend=853`, `miniprogram=853`, `ledger=295`, `failures=0`
- `node scripts/build_food_asset_baseline.cjs`: passed, both clients have `853/853` assets, missing files `0`, oversized files `0`
- visual semantic spot-check: passed for black pepper beef and rice
- runtime verification: pending; Docker Desktop is unavailable, so PostgreSQL seed and live `/food/search` checks remain outstanding
