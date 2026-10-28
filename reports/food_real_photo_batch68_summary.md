# Food Real Photo Batch 68

- Date: 2026-09-01
- Scope: close the remaining P0 food-photo backlog
- Completed keys: `pizzahut-696`, `kfc-624`, `kfc-690`, `lawson-610`, `pizzahut-697`, `iced-tea-cup`
- Source quality: mixed official public and third-party dish-level near-product photos

## Selected Sources

| image_key | catalog item | local candidate | verification |
|---|---|---|---|
| `pizzahut-696` | 必胜客 香草凤尾虾 | `reports/candidate_images/p0-pizzahut/pizzahut-696-c3.jpg` | Public image-search result is explicitly titled 必胜客香草凤尾虾 and visibly shows breaded tail-on shrimp; no Pizza Hut packaging is visible, so it is marked near-product rather than official packshot. |
| `kfc-624` | 肯德基 老北京鸡肉卷套餐玉米杯 | `reports/candidate_images/p0-kfc624/kfc-624-c15.jpg` | Public KFC meal photo visibly includes a chicken wrap, corn-on-the-cob side, Pepsi, and KFC packaging; it is marked combo near-product rather than an official isolated packshot. |
| `kfc-690` | 肯德基 香辣鸡排饭 | `reports/candidate_images/p0-kfc690/kfc-690-c5.jpg` | Public image-search result is explicitly titled 香辣鸡排饭 and visibly shows a breaded spicy chicken cutlet over rice; no KFC packaging is visible, so it is marked near-product rather than official packshot. |

## Added Source Records

| image_key | local candidate | source | classification |
|---|---|---|---|
| `lawson-610` | `reports/candidate_images/p0-lawson/lawson-610-c11.jpg` | Official Dalian Lawson product catalogue | official public product cover |
| `pizzahut-697` | `reports/candidate_images/p0-pizzahut/pizzahut-697-c1.jpg` | Public image-search result | dish-level near-product photo; no Pizza Hut packaging visible |
| `iced-tea-cup` | `reports/candidate_images/p0-mcd/iced-tea-cup-c1.jpg` | Public image-search result | McDonald's cup near-product photo; not an official menu packshot |

## Asset Checks

- Generated all six batch assets as `750x750` WebP.
- `frontend/assets/foods/pizzahut-696.webp`: 28,690 bytes.
- `frontend/assets/foods/kfc-624.webp`: 30,242 bytes.
- `frontend/assets/foods/kfc-690.webp`: 71,736 bytes.
- `frontend/assets/foods/lawson-610.webp`: 58,282 bytes.
- `frontend/assets/foods/pizzahut-697.webp`: 58,592 bytes.
- `frontend/assets/foods/iced-tea-cup.webp`: 28,662 bytes.
- Frontend and miniprogram files have identical SHA-256 hashes for all six keys.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `213`; SVG fallback entries: `628`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Target mode validation: `failures=0`.
- Source ledger: `213` unique rows, no duplicate keys or missing cache paths.
- Refreshed backlog: `256` rows (`P0=0`, `P1=133`, `P2=123`).

## Semantic Spot Check

- `pizzahut-696` shows tail-on breaded shrimp and is not mapped to the generic shrimp bowl asset.
- `kfc-624` shows the KFC-branded wrap, corn side, and drink together and is not mapped to a generic corn or sandwich asset.
- `kfc-690` shows a full chicken cutlet over rice and is not mapped to burger, fried-chicken, or generic rice-bowl artwork.
- The normalized files were checked in both client directories and are visually identical by SHA-256.

## Runtime Verification

- `node --check frontend/app.js`: passed.
- Backend Python syntax check: passed using the bundled Python runtime (resource-fork `._*` files excluded).
- `http://localhost:8000/health`: unavailable.
- `http://localhost:8080/`: unavailable.
- Docker Desktop Linux engine is unavailable, so backend API, database writes, and in-app search verification remain pending.
