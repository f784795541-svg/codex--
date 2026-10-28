# Food Real Photo Batch 75

- Date: 2026-09-01
- Scope: continue P1 branded dish and beverage coverage
- Completed keys: `nanchengxiang-296`, `nanchengxiang-283`, `gujing-339`
- Coverage change: `230 -> 233` raster WebP assets; prioritized backlog `239 -> 236`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `nanchengxiang-296` | 南城香 番茄鸡腿饭 | `reports/candidate_images/p1-next/nanchengxiang-296-c1.jpg` | Public dish image shows tomato-based chicken with rice; recorded as dish-level near-product because no 南城香 packaging is visible. |
| `nanchengxiang-283` | 南城香 黑椒鸡腿饭 | `reports/candidate_images/p1-next/nanchengxiang-283-c1.jpg` | Public dish image shows glazed chicken thigh with rice and vegetables, matching a black-pepper chicken-rice dish; recorded as dish-level near-product because no 南城香 packaging is visible. |
| `gujing-339` | 古井贡酒 50度 | `reports/candidate_images/p1-next/gujing-339-c1.jpg` | Public Suning product image clearly shows a 古井贡酒 年份原浆 bottle; the search result identifies the 50度 product and the bottle label is legible. |

## Asset Checks

- All three assets generated as `750x750` WebP.
- `nanchengxiang-296.webp`: 39,048 bytes.
- `nanchengxiang-283.webp`: 75,126 bytes.
- `gujing-339.webp`: 19,270 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `233`; SVG fallback entries: `608`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Target mode validation: `failures=0`.
- Source ledger: `233` unique rows with no malformed CSV rows or missing cache paths.
- Refreshed backlog: `236` rows (`P0=0`, `P1=113`, `P2=123`).

## Semantic Spot Check

- `nanchengxiang-296` shows tomato sauce, chicken and rice, not a generic beverage or dessert.
- `nanchengxiang-283` shows chicken thigh with rice and vegetables, consistent with black-pepper chicken rice.
- `gujing-339` shows a recognizable 古井贡酒 年份原浆 bottle, not another liquor brand.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=233`, `failures=0`.
- CSV ledger parse: `233` rows, `233` unique keys, `0` malformed rows.

## Runtime Verification

- Docker Desktop Linux engine remains unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
