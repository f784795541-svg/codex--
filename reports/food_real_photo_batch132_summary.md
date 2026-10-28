# Food Real Photo Batch 132

- image key: `burgerking-662`
- food: 汉堡王 皇堡
- source: [Public Burger King promotional image](https://qny.smzdm.com/202007/06/5f0263372a1e87263.jpg_e600.jpg)
- source cache: `reports/candidate_images/burgerking-662-v2/candidate-1`
- semantic check: the image visibly shows the Burger King logo and a double-beef-patty Whopper-style burger
- classification: `near_product_photo` (public promotional artwork with combo context; not represented as an isolated official packshot)
- normalized output: `750x750 WebP`, `56,928 bytes`
- frontend/miniprogram SHA-256 (both): `f8c40bb4624fe521795015e7ebd1cd08ddf17bbaa5a7dbfac6d549e7b48fedb1`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 56 to 55; total backlog reduced from 179 to 178

## Verification

- visual semantic spot-check: passed for the Burger King logo and double-beef-patty Whopper-style burger
- both client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- static audit, backlog rebuild, target-mode validation and asset baseline: passed
- runtime verification: pending; Docker Desktop engine is unavailable
