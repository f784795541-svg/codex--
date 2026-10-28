# Food Real Photo Batch 51

Date: 2026-09-01

## Scope

Correct two brand-specific image mappings using existing, verified official McDonald's assets. No database schema, API contract, or container architecture changes were made.

## Changes

- `麦当劳 苹果派`: changed from shared `pastry-puff` to `mcd-146`.
- `麦当劳 薯条 大份`: changed from shared `fries` to `mcd-140`.

Both target assets already exist in frontend and miniprogram directories as 750x750 WebP files and have verified source-ledger rows:

- `mcd-146`: official McDonald's corporate Baked Apple Pie asset.
- `mcd-140`: official McDonald's French Fries asset.

The shared `pastry-puff` and `fries` keys remain available for unrelated generic or other-brand foods.

## Verification

- Food image audit: `foods=834`, `image_keys=552`, `high=0`.
- Frontend manifest: 841 keys, no missing files, no oversized raster assets.
- Miniprogram manifest: 841 keys, no missing files, no oversized raster assets.
- Target mode validation: `failures=[]`.
- Backlog: 282 rows, including P0 26, P1 133, P2 123.
- Docker runtime verification remains pending because the Docker Desktop Linux engine is unavailable.

