# Food Real Photo Batch 60

Date: 2026-09-01

## Scope

Replace fallback images for `kfc-629`, `kfc-165`, and `fries` without changing the database schema, API contracts, or application architecture.

## Asset decisions

- `kfc-629`: public KFC image clearly shows the strawberry-sauce sundae and KFC branding; multi-flavor promotion context is recorded as `near_product_photo`.
- `kfc-165`: public KFC menu image explicitly labels 香甜粟米棒 and shows the corn side; other dessert items in the promotion are recorded as a near-product difference.
- `fries`: public KFC menu image clearly shows KFC fries and labels the medium serving as 薯条（中）; promotional copy remains, so it is recorded as `near_product_photo`.

## Output

- Generated all three assets as 750x750 WebP.
- Copied identical WebP files to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 198 unique completed image keys.
- Backlog: 271 rows, including P0 15, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.
