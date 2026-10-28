# Food Real Photo Batch 69

- Date: 2026-09-01
- Scope: first P1 brand-product batch after P0 completion
- Completed keys: `kronenbourg-328`, `tea-bottle`, `wusu-326`
- Coverage change: `213 -> 216` raster WebP assets; prioritized backlog `256 -> 253`

## Selected Sources

| image_key | catalog item | local candidate | source and verification |
|---|---|---|---|
| `kronenbourg-328` | 1664白啤 | `reports/candidate_images/p1-1664/kronenbourg-328-c1.jpg` | Marketplace product image clearly shows the Kronenbourg 1664 Blanc bottle and case; recorded as near-product, not an official brand-hosted asset. |
| `tea-bottle` | 东方树叶 青柑普洱 | `reports/candidate_images/p1-tea/tea-bottle-c1.jpg` | Retail product image clearly shows the 东方树叶 青柑普洱 500ml bottle and label; recorded as near-product. |
| `wusu-326` | 乌苏啤酒 | `reports/candidate_images/p1-wusu/wusu-326-c1.jpg` | Retail product image clearly shows a red WUSU beer can; promotional text remains in the composition, so it is recorded as near-product. |

## Asset Checks

- All three assets generated as `750x750` WebP.
- `kronenbourg-328.webp`: 28,794 bytes.
- `tea-bottle.webp`: 36,484 bytes.
- `wusu-326.webp`: 72,142 bytes.
- Frontend and miniprogram hashes match for all three keys.
- Frontend and miniprogram manifests: `841/841`.
- Target mode validation: `failures=0`.
- Source ledger: `216` unique rows.
- Refreshed backlog: `253` rows (`P0=0`, `P1=130`, `P2=123`).

## Semantic Spot Check

- `kronenbourg-328` is a 1664 Blanc beer product image, not a generic beer bottle.
- `tea-bottle` is the 东方树叶 青柑普洱 bottle, not a generic iced-tea or soda image.
- `wusu-326` is a red WUSU beer can, not a generic alcohol or soda image.

## Runtime Verification

- `node --check frontend/app.js`: passed.
- Backend Python syntax check: passed using the bundled Python runtime with resource-fork files excluded.
- Docker Desktop Linux engine remains unavailable; API, database write, and in-app search verification remain pending.
