# Food Real Photo Batch 61

Date: 2026-09-01

## Scope

Replace fallback images for `kfc-688` and `kfc-627` without changing the database schema, API contracts, or application architecture.

## Asset decisions

- `kfc-688`: public image visibly shows KFC branding, chicken nuggets, and the 黄金鸡块 label; the multi-piece promotion context is documented.
- `kfc-627`: public image explicitly labels 藤椒肯大大鸡排 and shows the breaded chicken cutlet; coupon/promotion layout is documented.
- Both are recorded as public/near-product assets with their source differences retained in the ledger.

## Output

- Generated `kfc-688.webp` and `kfc-627.webp` at 750x750.
- Copied identical WebP files to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 200 unique completed image keys.
- Backlog: 269 rows, including P0 13, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.
