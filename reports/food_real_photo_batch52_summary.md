# Food Real Photo Batch 52

Date: 2026-09-01

## Scope

Add a verified McDonald's McCafe drink image for the catalog item `麦当劳 冰拿铁 中杯`, without changing database schema, API contracts, or application architecture.

## Asset decision

- Source page: McDonald's China McCafe public menu.
- Official menu label: `冰奶铁`.
- Catalog label: `冰拿铁 中杯`.
- Classification: `near_product_photo`, not an exact-name claim.
- The image visibly shows a McCafe iced milk-coffee drink in a branded cup and contains no promotional pricing overlay.

## Output

- Generated `mcd-622.webp` at 750x750.
- Output is below the 300KB per-file limit.
- Copied the same asset to frontend and miniprogram directories.
- Regenerated both manifests and source-ledger validation data.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 188 unique completed image keys.
- Backlog: 281 rows, including P0 25, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.

