# Food Real Photo Batch 59

Date: 2026-09-01

## Scope

Replace the fallback image for `kfc-238` (肯德基新奥尔良烤鸡腿堡) without changing the database schema, API contracts, or application architecture.

## Asset decision

- Source: public KFC menu image mirrored by 5ikfc.
- The image visibly shows the KFC logo, a red-sauce chicken burger consistent with the New Orleans product, and the KFC fries/drink packaging.
- Because the source is a combo composition without a product caption, it is recorded as `near_product_photo`.

## Output

- Generated `kfc-238.webp` at 750x750.
- Copied the identical WebP to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 195 unique completed image keys.
- Backlog: 274 rows, including P0 18, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.
