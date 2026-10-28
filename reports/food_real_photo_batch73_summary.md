# Food Real Photo Batch 73

- Date: 2026-09-01
- Scope: continue P1 brand-product and dish coverage
- Completed keys: `wallace-666`, `wallace-665`, `nanchengxiang-282`
- Coverage change: `224 -> 227` raster WebP assets; prioritized backlog `245 -> 242`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `wallace-666` | 华莱士 蜜汁手扒鸡 | `reports/candidate_images/p1-wallace/wallace-666-c1.jpg` | Public product review image clearly shows a glazed whole roasted chicken matching 蜜汁手扒鸡; candidate cache is byte-identical to the source image. |
| `wallace-665` | 华莱士 香辣鸡腿堡 | `reports/candidate_images/p1-wallace/wallace-665-c1.jpg` | Public product display image clearly shows a double crispy chicken burger matching the 华莱士香辣鸡腿堡 family; candidate cache is byte-identical to the source image. |
| `nanchengxiang-282` | 南城香 宫保鸡丁饭 | `reports/candidate_images/p1-nanchengxiang/nanchengxiang-282-c1.jpg` | Public dish image clearly shows kung pao chicken with rice; recorded as dish-level near-product because no 南城香 packaging is visible. |

## Asset Checks

- All three assets generated as `750x750` WebP.
- `wallace-666.webp`: 52,264 bytes.
- `wallace-665.webp`: 29,804 bytes.
- `nanchengxiang-282.webp`: 40,030 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `227`; SVG fallback entries: `614`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Target mode validation: `failures=0`.
- Source ledger: `227` unique rows with no missing cache paths.
- Refreshed backlog: `242` rows (`P0=0`, `P1=119`, `P2=123`).

## Semantic Spot Check

- `wallace-666` shows a whole glazed roast chicken matching 蜜汁手扒鸡, not fried chicken pieces.
- `wallace-665` shows a crispy chicken burger matching 香辣鸡腿堡, not a generic beef burger.
- `nanchengxiang-282` shows diced kung pao chicken served with rice, not a generic rice bowl.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=227`, `failures=0`.
- `node --check frontend/app.js`: passed.
- Backend Python syntax check: passed using the bundled Python runtime.
- CSV ledger parse: `227` rows, `227` unique keys, `0` missing cache paths.

## Runtime Verification

- Docker Desktop Linux engine remains unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
