# Food Real Photo Batch 72

- Date: 2026-09-01
- Scope: continue P1 brand-product coverage
- Completed keys: `energy-drink`, `jiannanchun-336`, `wallace-667`
- Coverage change: `221 -> 224` raster WebP assets; prioritized backlog `248 -> 245`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `energy-drink` | 农夫山泉 尖叫 纤维饮料 | `reports/candidate_images/p1-energy/energy-drink-c1.jpg` | Public Suning product image clearly shows the 农夫山泉 尖叫纤维饮料 green bottle and Fibre Drink case; candidate cache is byte-identical to the source image. |
| `jiannanchun-336` | 剑南春 52度 | `reports/candidate_images/p1-jiannanchun/jiannanchun-336-c1.jpg` | Public Suning product image clearly shows the 剑南春 branded bottle and gift box with the 52-degree label; candidate cache is byte-identical to the source image. |
| `wallace-667` | 华莱士 脆皮全鸡 | `reports/candidate_images/p1-wallace/wallace-667-c1.jpg` | Public JD product image clearly shows the 华莱士 branded 脆皮全鸡 dish; candidate cache is byte-identical to the source image. |

## Asset Checks

- All three assets generated as `750x750` WebP.
- `energy-drink.webp`: 63,516 bytes.
- `jiannanchun-336.webp`: 50,404 bytes.
- `wallace-667.webp`: 28,472 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `224`; SVG fallback entries: `617`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Target mode validation: `failures=0`.
- Source ledger: `224` unique rows with no missing cache paths.
- Refreshed backlog: `245` rows (`P0=0`, `P1=122`, `P2=123`).

## Semantic Spot Check

- `energy-drink` shows the green 农夫山泉 尖叫 Fibre Drink bottle and case, not generic bottled water.
- `jiannanchun-336` shows the 剑南春 bottle and gift box with the 52-degree label, not a generic baijiu bottle.
- `wallace-667` shows a whole crispy fried chicken with the 华莱士 logo, not chicken pieces or a burger.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=224`, `failures=0`.
- `node --check frontend/app.js`: passed.
- Backend Python syntax check: passed using the bundled Python runtime.
- CSV ledger parse: `224` rows, `224` unique keys, `0` missing cache paths.

## Runtime Verification

- Docker Desktop Linux engine remains unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
