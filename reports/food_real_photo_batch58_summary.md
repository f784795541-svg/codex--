# Food Real Photo Batch 58

Date: 2026-09-01

## Scope

Replace the fallback image for `sandwich` (肯德基老北京鸡肉卷) without changing the database schema, API contracts, or application architecture.

## Asset decision

- Source: public retail product image.
- The image visibly shows KFC branding and the `老北京鸡肉卷` label.
- The source is a redemption-coupon composition rather than a clean single-item packshot, so it is recorded as `near_product_photo`.

## Output

- Generated `sandwich.webp` at 750x750.
- Copied the identical WebP to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 194 unique completed image keys.
- Backlog: 275 rows, including P0 19, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.
