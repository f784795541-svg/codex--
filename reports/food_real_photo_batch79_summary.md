# Food Real Photo Batch 79

- Date: 2026-09-01
- Scope: continue P1 Yoshinoya dish coverage
- Completed keys: `yoshinoya-270`, `yoshinoya-671`
- Skipped key: `yoshinoya-269` (available candidates did not prove 照烧牛肉饭 rather than plain beef rice)
- Coverage change: `242 -> 244` raster WebP assets; prioritized backlog `227 -> 225`

## Selected Sources

| image_key | catalog item | local candidate | semantic verification |
|---|---|---|---|
| `yoshinoya-270` | 吉野家 照烧鸡排饭 | `reports/candidate_images/p1-next5/yoshinoya-270-c1.jpeg` | Public Yoshinoya promotional image visibly labels 照烧鸡排饭 and shows glazed chicken with rice and vegetables. |
| `yoshinoya-671` | 吉野家 牛肉乌冬面 | `reports/candidate_images/p1-next5/yoshinoya-671-c1.jpg` | Dish image clearly shows sliced beef and thick udon noodles in broth; recorded as a near-product match because packaging is not visible. |

## Asset Checks

- Both assets generated as `750x750` WebP.
- `yoshinoya-270.webp`: 26,270 bytes.
- `yoshinoya-671.webp`: 78,192 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for both keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `244`; SVG fallback entries: `597`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Source ledger: `244` unique rows with no malformed rows or missing cache paths.
- Refreshed backlog: `225` rows (`P1=102`, `P2=123`).

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=244`, `failures=0`.
- Catalog and asset baselines regenerated after synchronization.

## Runtime Verification

- Docker Desktop Linux engine is unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
