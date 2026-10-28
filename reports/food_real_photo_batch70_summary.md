# Food Real Photo Batch 70

- Date: 2026-09-01
- Scope: continue P1 brand-product coverage
- Completed keys: `wuliangye-334`, `sparkling-water`
- Coverage change: `216 -> 218` raster WebP assets; prioritized backlog `253 -> 251`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `wuliangye-334` | 五粮液 52度 | `reports/candidate_images/p1-wuliangye/wuliangye-334-c1.png` | Retail product image clearly shows the WULIANGYE bottle, gift box, and 52-degree label; recorded as near-product. |
| `sparkling-water` | 元气森林 白桃气泡水 | `reports/candidate_images/p1-sparkling/sparkling-water-c1.jpg` | Retail product image clearly shows the 元气森林 bottle, peach graphic, and 白桃味 label; recorded as near-product. |

## Asset Checks

- Both assets generated as `750x750` WebP.
- `wuliangye-334.webp`: 28,924 bytes.
- `sparkling-water.webp`: 10,426 bytes.
- Frontend and miniprogram hashes match for both keys.
- Frontend and miniprogram manifests: `841/841`.
- Target mode validation: `failures=0`.
- Source ledger: `218` unique rows.
- Refreshed backlog: `251` rows (`P0=0`, `P1=128`, `P2=123`).

## Semantic Spot Check

- `wuliangye-334` is a 52-degree WULIANGYE bottle and gift-box image, not a generic baijiu image.
- `sparkling-water` is the white-peach Yuanqi Forest sparkling-water bottle, not a generic soda image.

## Runtime Verification

- `node --check frontend/app.js`: passed.
- Backend Python syntax check: passed using the bundled Python runtime with resource-fork files excluded.
- Docker Desktop Linux engine remains unavailable; API, database write, and in-app search verification remain pending.
