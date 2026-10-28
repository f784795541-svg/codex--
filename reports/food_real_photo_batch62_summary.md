# Food Real Photo Batch 62

Date: 2026-09-01

## Scope

Replace the fallback image for `burger` (肯德基香辣鸡腿堡) without changing the database schema, API contracts, or application architecture.

## Asset decision

- Source: public retail product image.
- The image visibly shows KFC branding, a spicy chicken burger, chili elements, and the `香辣鸡腿堡` label.
- Promotional copy remains in the composition, so it is recorded as `near_product_photo`.

## Output

- Generated `burger.webp` at 750x750.
- Copied the identical WebP to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 201 unique completed image keys.
- Backlog: 268 rows, including P0 12, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.
