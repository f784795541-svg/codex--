# Food Real Photo Batch 63

Date: 2026-09-01

## Scope

Replace the fallback image for `kfc-626` (肯德基香辣鸡腿堡套餐土豆泥) without changing the database schema, API contracts, or application architecture.

## Asset decision

- Source: public KFC menu image mirrored by 5ikfc.
- The image visibly shows the 香辣/劲脆鸡腿堡套餐, a mashed-potato cup, and KFC branding.
- Drink and other combo elements remain in the source composition, so it is recorded as `near_product_photo`.

## Output

- Generated `kfc-626.webp` at 750x750.
- Copied the identical WebP to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 202 unique completed image keys.
- Backlog: 267 rows, including P0 11, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.
