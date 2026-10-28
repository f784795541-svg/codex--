# Food Real Photo Batch 53

Date: 2026-09-01

## Scope

Add a publicly verified McDonald's product-family image for `麦当劳 双层麦香鸡`, preserving the existing architecture, schema, and API contracts.

## Asset decision

- Source: McDonald's China public burger menu.
- Official menu label: `麦香鸡`.
- Catalog label: `双层麦香鸡`.
- Classification: `near_product_photo`.
- The image visibly shows the McChicken product family on a clean product background; it is not claimed to prove the double-patty configuration.

## Output

- Generated `mcd-237.webp` at 750x750.
- Copied the identical WebP to frontend and miniprogram asset directories.
- Updated both manifests and the source ledger.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Source ledger: 189 unique completed image keys.
- Backlog: 280 rows, including P0 24, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.

