# Food Real Photo Batch 71

- Date: 2026-09-01
- Scope: continue P1 brand-product coverage
- Completed keys: `bright-514`, `yakult-516`, `water-bottle`
- Coverage change: `218 -> 221` raster WebP assets; prioritized backlog `251 -> 248`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `bright-514` | 光明 莫斯利安原味酸奶 | `reports/candidate_images/p1-bright/bright-514-c1.jpg` | Public Suning product image clearly shows the 光明莫斯利安原味酸奶 case and individual cartons; the candidate cache is byte-identical to the source image. |
| `yakult-516` | 养乐多 活菌型乳酸菌饮品 | `reports/candidate_images/p1-yakult/yakult-516-c1.jpg` | Public JD product image clearly shows the Yakult 活菌型乳酸菌饮品 bottle; the candidate cache is byte-identical to the source image. |
| `water-bottle` | 农夫山泉 | `reports/candidate_images/p1-water/water-bottle-c1.jpg` | Public Suning product image clearly shows the 农夫山泉 550ml red-cap bottle; the candidate cache is a single-bottle crop from the same product image. |

## Asset Checks

- All three assets generated as `750x750` WebP.
- `bright-514.webp`: 65,582 bytes.
- `yakult-516.webp`: 15,500 bytes.
- `water-bottle.webp`: 10,686 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `221`; SVG fallback entries: `620`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Target mode validation: `failures=0`.
- Source ledger: `221` unique rows, no duplicate keys or missing cache paths.
- Refreshed backlog: `248` rows (`P0=0`, `P1=125`, `P2=123`).

## Semantic Spot Check

- `bright-514` shows the 莫斯利安 branded original-flavor yogurt case, not a generic yogurt cup.
- `yakult-516` shows the Yakult branded 活菌型乳酸菌饮品 bottle, not a generic yogurt or milk bottle.
- `water-bottle` shows the red-cap 农夫山泉 550ml bottle, not the green-cap purified-water variant or a generic water image.

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=221`, `failures=0`.
- `node --check frontend/app.js`: passed.
- Backend Python syntax check: passed using the bundled Python runtime.

## Runtime Verification

- Docker Desktop Linux engine remains unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
