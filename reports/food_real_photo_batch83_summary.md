# Food Real Photo Batch 83

- Date: 2026-09-01
- Scope: continue P1 branded dairy coverage
- Completed key: `ambrosial-409`
- Coverage change: `248 -> 249` raster WebP assets
- Prioritized backlog: `222 -> 221` unique keys (`P1=98`, `P2=123`)

## Selected Source

| image_key | catalog item | local candidate | semantic verification |
|---|---|---|---|
| `ambrosial-409` | 安慕希 原味酸奶 | `reports/candidate_images/p1-next9-ambrosial-409.jpg` | 美的商城商品图清楚显示安慕希包装、希腊风味酸奶、原味和 205g，与目录名称匹配。 |

## Asset Checks

- Generated as `750x750` WebP.
- `ambrosial-409.webp`: below `300KB`.
- Frontend and miniprogram files have identical SHA-256 hashes.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `249`; SVG fallback entries: `592`.
- Missing assets: `0`.
- Raster assets over `300KB`: `0`.
- Source ledger: `249` unique rows with no missing cache paths.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=553`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=249`, `failures=0`.
- Food 409 reports `real_photo` and resolves to `ambrosial-409.webp` in the refinement audit.

## Runtime Verification

- Docker Desktop Linux engine is still unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
