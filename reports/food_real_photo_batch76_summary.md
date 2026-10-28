# Food Real Photo Batch 76

- Date: 2026-09-01
- Scope: continue P1 branded beverage coverage
- Completed keys: `fruit-tea-cup`, `guming-657`, `cocacola-394`
- Coverage change: `233 -> 236` raster WebP assets; prioritized backlog `236 -> 233`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `fruit-tea-cup` | 古茗 百香双重奏 | `reports/candidate_images/p1-next2/fruit-tea-cup-c1.jpg` | Public product-style image shows a 古茗 cup with passion fruit and layered tea; recorded as near-product because no retail package is visible. |
| `guming-657` | 古茗 芝士葡萄 | `reports/candidate_images/p1-next2/guming-657-c2.png` | Public product-style image clearly shows a 古茗 branded grape drink with grape clusters; recorded as near-product because no retail package is visible. |
| `cocacola-394` | 可口可乐 | `reports/candidate_images/p1-next2/cocacola-394-c1.jpg` | Public Suning product image clearly shows the classic red Coca-Cola can and was selected as a standard retail product display image. |

## Asset Checks

- All three assets generated as `750x750` WebP.
- `fruit-tea-cup.webp`: 27,048 bytes.
- `guming-657.webp`: 21,036 bytes.
- `cocacola-394.webp`: 21,486 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `236`; SVG fallback entries: `605`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Target mode validation: `failures=0`.
- Source ledger: `236` unique rows with no malformed CSV rows or missing cache paths.
- Refreshed backlog: `233` rows (`P0=0`, `P1=110`, `P2=123`).

## Semantic Spot Check

- `fruit-tea-cup` shows the 古茗 logo, passion fruit and a layered fruit tea.
- `guming-657` shows the 古茗 logo, grape drink and grape clusters.
- `cocacola-394` shows a recognizable classic Coca-Cola red can.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=236`, `failures=0`.
- CSV ledger parse: `236` rows, `236` unique keys, `0` malformed rows.

## Runtime Verification

- Docker Desktop Linux engine remains unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
