# Food Real Photo Batch 128

- image key: `ajisen-182`
- food: 味千拉面 肥牛拉面
- source: [Ajisen-hosted public image](https://www.ajisen.net:444/images/111.jpg)
- source cache: `reports/candidate_images/ajisen-182-search-4.jpg`
- semantic check: the image visibly shows a 味千拉面 bowl, ramen noodles, and sliced beef
- classification: `near_product_photo` (the image carries a third-party watermark and is not treated as an official packshot)
- normalized output: `750x750 WebP`, `35,976 bytes`
- frontend/miniprogram SHA-256 (both): `3572753319a3de03ab8ba3f769d1745233f0be5611e63b136338fc41a70a3964`
- source ledger: `reports/food_photo_source_ledger.csv`
- backlog: P1 real-photo backlog reduced from 60 to 59; total backlog reduced from 183 to 182

## Verification

- visual semantic spot-check: passed for 味千拉面 bowl, ramen noodles, and sliced beef
- both client files are byte-identical and remain within the `750x750 WebP` / `300KB` target
- runtime verification: pending; Docker Desktop is unavailable
