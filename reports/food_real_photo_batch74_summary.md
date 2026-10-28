# Food Real Photo Batch 74

- Date: 2026-09-01
- Scope: continue P1 branded dish coverage
- Completed keys: `nanchengxiang-673`, `braised-pork`, `nanchengxiang-258`
- Coverage change: `227 -> 230` raster WebP assets; prioritized backlog `242 -> 239`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `nanchengxiang-673` | 南城香 小酥肉 | `reports/candidate_images/p1-nanchengxiang/nanchengxiang-673-c1.jpg` | Public dish image clearly shows a plate of crispy fried pork strips matching 小酥肉; recorded as dish-level near-product because no 南城香 packaging is visible. |
| `braised-pork` | 南城香 梅菜扣肉饭 | `reports/candidate_images/p1-nanchengxiang/braised-pork-c1.jpg` | Public dish image clearly shows sliced braised pork with preserved mustard greens and rice; recorded as dish-level near-product because no 南城香 packaging is visible. |
| `nanchengxiang-258` | 南城香 番茄肥牛饭 | `reports/candidate_images/p1-nanchengxiang/nanchengxiang-258-c1.jpg` | Public dish image includes tomato beef over rice and an explicit 番茄肥牛饭 label; recorded as dish-level near-product because no 南城香 packaging is visible. |

## Asset Checks

- All three assets generated as `750x750` WebP.
- `nanchengxiang-673.webp`: 57,126 bytes.
- `braised-pork.webp`: 77,700 bytes.
- `nanchengxiang-258.webp`: 61,230 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `230`; SVG fallback entries: `611`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Target mode validation: `failures=0`.
- Source ledger: `230` unique rows with no missing cache paths.
- Refreshed backlog: `239` rows (`P0=0`, `P1=116`, `P2=123`).

## Semantic Spot Check

- `nanchengxiang-673` shows crispy fried pork strips matching 小酥肉, not fried chicken.
- `braised-pork` shows sliced pork with 梅菜 and rice, not generic braised meat.
- `nanchengxiang-258` shows tomato beef over rice and the explicit 番茄肥牛饭 label, not a generic beef rice bowl.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=230`, `failures=0`.
- `node --check frontend/app.js`: passed.
- Backend Python syntax check: passed using the bundled Python runtime.
- CSV ledger parse: `230` rows, `230` unique keys, `0` missing cache paths.

## Runtime Verification

- Docker Desktop Linux engine remains unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
