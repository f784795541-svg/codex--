# Food Real Photo Batch 56

Date: 2026-09-01

## Scope

Replace the fallback image for `fried-chicken` (肯德基劲爆鸡米花) without changing the database schema, API contracts, or application architecture.

## Asset decision

- Source: public third-party product/promotional image.
- The image visibly shows KFC packaging, popcorn chicken, and the `劲爆鸡米花` label.
- Classification: `third_party_public`; the source is not presented as an official-domain asset.

## Output

- Generated `fried-chicken.webp` at 750x750.
- Copied the identical WebP to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 192 unique completed image keys.
- Backlog: 277 rows, including P0 21, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.
