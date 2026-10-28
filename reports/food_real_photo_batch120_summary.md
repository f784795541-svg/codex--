# Food Photo Batch 120

- Date: 2026-09-02
- Scope: P1 branded restaurant near-product photo completion
- No business API or system architecture changes

## Completed

- Replaced the fallback asset for `burgerking-692` (`汉堡王 双层芝士皇堡`) with a public Burger King promotional image.
- The image clearly shows the Burger King logo and a burger with two beef patties. The accompanying drink and chicken side are documented, and the cheese layer is not claimed as visually verified.
- Added source URL, search referer, capture date, local cache path, and semantic qualification to the source ledger.
- Normalized and synchronized the asset to the frontend and miniprogram directories.

## Standardization

- Asset: `burgerking-692.webp`
- Format: WebP
- Dimensions: 750x750
- File size: 57,010 bytes
- Frontend and miniprogram SHA-256 values match.
- Mapping: `burgerking-692 -> burgerking-692.webp`

## Verification

- Food catalog: 846 records.
- Semantic audit: `foods=846`, `image_keys=567`, `high=0`.
- Frontend and miniprogram manifests: `853/853`; missing files `0`; oversized files `0`.
- Target mode validation: `failures=0`; source ledger has 291 unique rows.
- Remaining real-photo backlog: 191 rows (`P1=68`, `P2=123`).

## Runtime Limitation

- Docker Desktop remains unavailable. PostgreSQL seed/search and frontend/miniprogram runtime checks remain pending.
