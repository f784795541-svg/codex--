# Food Real Photo Batch 82

- Date: 2026-09-01
- Scope: continue P1 Ajisen product-level image coverage
- Completed key: `ajisen-180`
- Skipped key: `ajisen-185` (候选图均为猪排拉面、猪排配菜或普通猪排饭，未能证明是味千拉面咖喱猪排饭)
- Coverage change: `247 -> 248` raster WebP assets
- Prioritized backlog: `222` unique keys remain; the new `ajisen-180` key replaces the shared `ramen-bowl` mapping for food 180 while `ramen-bowl` remains required by other foods.

## Selected Source

| image_key | catalog item | local candidate | semantic verification |
|---|---|---|---|
| `ajisen-180` | 味千拉面 招牌豚骨拉面 | `reports/candidate_images/p1-next8/ajisen-ramen-c1.jpg` | Retail image clearly shows 味千拉面 packaging, 大骨浓汤拉面 labeling, and the finished ramen bowl; accepted as a near-product match. |

## Asset Checks

- Generated as `750x750` WebP.
- `ajisen-180.webp`: 55,850 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `248`; SVG fallback entries: `593`.
- Missing assets: `0`.
- Raster assets over `300KB`: `0`.
- Source ledger: `248` unique rows with no missing cache paths.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=553`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=248`, `failures=0`.
- Food 180 now resolves to `ajisen-180.webp` and reports `real_photo` in the refinement audit.

## Runtime Verification

- Docker Desktop Linux engine is still unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
