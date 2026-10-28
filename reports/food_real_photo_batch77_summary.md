# Food Real Photo Batch 77

- Date: 2026-09-01
- Scope: continue P1 beverage and Yoshinoya dish coverage
- Completed keys: `cocacola-395`, `yoshinoya-285`, `yoshinoya-286`
- Coverage change: `236 -> 239` raster WebP assets; prioritized backlog `233 -> 230`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `cocacola-395` | 零度可口可乐 | `reports/candidate_images/p1-next3/cocacola-395-c1.jpg` | JD product image clearly shows the red Coca-Cola Zero can with the visible 无糖 label. |
| `yoshinoya-285` | 吉野家 双拼牛肉饭 | `reports/candidate_images/p1-next3/yoshinoya-285-c1.jpg` | Public dish image includes 吉野家 branded tableware and shows two meat preparations with rice matching a double-topping meal. |
| `yoshinoya-286` | 吉野家 咖喱牛肉饭 | `reports/candidate_images/p1-next3/yoshinoya-286-c5.jpg` | Public dish image clearly shows curry sauce with beef chunks and rice; recorded as dish-level near-product because no 吉野家 packaging is visible. |

## Asset Checks

- All three assets generated as `750x750` WebP.
- `cocacola-395.webp`: 41,610 bytes.
- `yoshinoya-285.webp`: 24,622 bytes.
- `yoshinoya-286.webp`: 38,696 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `239`; SVG fallback entries: `602`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Target mode validation: `failures=0`.
- Source ledger: `239` unique rows with no malformed CSV rows or missing cache paths.
- Refreshed backlog: `230` rows (`P0=0`, `P1=107`, `P2=123`).

## Semantic Spot Check

- `cocacola-395` shows the red can and the 无糖 label for Coca-Cola Zero.
- `yoshinoya-285` shows Yoshinoya tableware and two distinct meat toppings over rice.
- `yoshinoya-286` shows a curry-colored sauce with beef chunks and rice, not a plain beef bowl.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=239`, `failures=0`.
- CSV ledger parse: `239` rows, `239` unique keys, `0` malformed rows.

## Runtime Verification

- Docker Desktop Linux engine remains unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
