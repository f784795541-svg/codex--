# Food Real Photo Batch 84

- Date: 2026-09-01
- Scope: continue P1 branded beverage coverage
- Completed key: `asahi-331`
- Coverage change: `249 -> 250` raster WebP assets
- Prioritized backlog: `221 -> 220` unique keys (`P1=97`, `P2=123`)

## Selected Source

| image_key | catalog item | local candidate | semantic verification |
|---|---|---|---|
| `asahi-331` | 朝日啤酒 | `reports/candidate_images/p1-next10-asahi-331.jpg` | 阿里巴巴公开商品图清楚显示 Asahi Super Dry 罐装啤酒及啤酒杯，与目录品牌和品类匹配。 |

## Asset Checks

- Generated as `750x750` WebP.
- `asahi-331.webp`: below `300KB`.
- Frontend and miniprogram files have identical SHA-256 hashes.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `250`; SVG fallback entries: `591`.
- Missing assets: `0`.
- Raster assets over `300KB`: `0`.
- Source ledger: `250` unique rows with no missing cache paths.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=553`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=250`, `failures=0`.
- Food 331 reports `real_photo` and resolves to `asahi-331.webp` in the refinement audit.

## Runtime Verification

- Docker Desktop Linux engine is still unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
