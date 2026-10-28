# Food Real Photo Batch 81

- Date: 2026-09-01
- Scope: continue P1 branded beverage coverage
- Completed keys: `harbinbeer-324`, `heineken-330`
- Coverage change: `245 -> 247` raster WebP assets; prioritized backlog `224 -> 222`

## Selected Sources

| image_key | catalog item | local candidate | semantic verification |
|---|---|---|---|
| `harbinbeer-324` | 哈尔滨啤酒 冰纯 | `reports/candidate_images/p1-next7/harbinbeer-324-c3.jpg` | Retail image label clearly reads 哈尔滨啤酒 and 冰纯 ICE. |
| `heineken-330` | 喜力啤酒 | `reports/candidate_images/p1-next7/heineken-330-c2.jpg` | Retail image clearly shows the green Heineken can and red star logo. |

## Asset Checks

- Both assets generated as `750x750` WebP.
- `harbinbeer-324.webp`: 25,158 bytes.
- `heineken-330.webp`: 30,276 bytes.
- Frontend and miniprogram hashes are identical for both keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `247`; SVG fallback entries: `594`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Source ledger: `247` unique rows with no malformed rows or missing cache paths.
- Refreshed backlog: `222` rows (`P1=99`, `P2=123`).

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=247`, `failures=0`.

## Runtime Verification

- Docker Desktop Linux engine is unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
