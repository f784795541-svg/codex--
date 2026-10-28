# Food Real Photo Batch 57

Date: 2026-09-01

## Scope

Replace the fallback image for `kfc-625` (肯德基劲脆鸡腿堡) without changing the database schema, API contracts, or application architecture.

## Asset decision

- Source: public retail product image.
- The image visibly shows KFC branding and the 劲脆鸡腿堡 label.
- The composition also includes an Orleans wing as a combo context, so it is recorded as `near_product_photo` rather than a clean single-item exact photo.

## Output

- Generated `kfc-625.webp` at 750x750.
- Copied the identical WebP to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 193 unique completed image keys.
- Backlog: 276 rows, including P0 20, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.
