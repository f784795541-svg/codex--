# Food Real Photo Batch 130

- image key: `burgerking-663`
- food: 汉堡王 天椒皇堡
- source: [Public product image](https://image.dongfangfuli.com/2022/05/23/4e26685bab989baf8ccbaa4edc7944480fa9c6e8db6e42f0362ede23fc1018319109.jpg!s498.498)
- source cache: `reports/candidate_images/burgerking-663-search-1.jpg`
- semantic check: the image is explicitly labeled 天椒皇堡 and visibly shows the Burger King burger; fries and cola are only combo context
- classification: `near_product_photo` (public product artwork; not represented as a verified official Burger King CDN asset)
- normalized output: `750x750 WebP`, `54,908 bytes`
- frontend/miniprogram SHA-256 (both): `565b7da1a255a7bbf8ab71b507fb89a20fcda49dad2ef0262c4f82a3c8553314`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 58 to 57; total backlog reduced from 181 to 180

## Verification

- visual semantic spot-check: passed for the labeled 天椒皇堡 and Burger King burger
- both client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop is unavailable
