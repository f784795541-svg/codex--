# Food Real Photo Batch 78

- Date: 2026-09-01
- Scope: continue P1 Yoshinoya dish coverage
- Completed keys: `yoshinoya-259`, `yoshinoya-287`, `yoshinoya-298`
- Coverage change: `239 -> 242` raster WebP assets; prioritized backlog `230 -> 227`

## Selected Sources

| image_key | catalog item | local candidate | semantic verification |
|---|---|---|---|
| `yoshinoya-259` | 吉野家 招牌牛肉饭 | `reports/candidate_images/p1-next4/yoshinoya-259-c1.jpg` | Yoshinoya branded bowl with standard beef topping over rice. |
| `yoshinoya-287` | 吉野家 泡菜牛肉饭 | `reports/candidate_images/p1-next4/yoshinoya-287-c3.png` | Yoshinoya branded bowl plus a clearly visible kimchi side dish. |
| `yoshinoya-298` | 吉野家 温泉蛋牛肉饭 | `reports/candidate_images/p1-next4/yoshinoya-298-c1.jpg` | Yoshinoya-style beef bowl with a whole soft onsen egg on top. |

Candidates that were not selected were rejected where the dish distinction was unclear, such as the plain beef bowl candidate for the kimchi item.

## Asset Checks

- All three assets generated as `750x750` WebP.
- `yoshinoya-259.webp`: 49,604 bytes.
- `yoshinoya-287.webp`: 63,392 bytes.
- `yoshinoya-298.webp`: 36,820 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `242`; SVG fallback entries: `599`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Source ledger: `242` unique rows with no malformed rows or missing cache paths.
- Refreshed backlog: `227` rows (`P1=104`, `P2=123`).

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=242`, `failures=0`.
- Catalog and asset baseline regenerated after synchronization.

## Runtime Verification

- Docker Desktop Linux engine is unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
