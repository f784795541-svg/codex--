# Food Photo Batch 110

- Date: 2026-09-01
- Scope: P1 dish-level near-product photo completion and precise image-key split
- No business API or system architecture changes

## Completed

- Split `味千拉面 辣味叉烧拉面` from the shared `ramen-bowl` key to the existing unique key `ajisen-181`.
- Replaced the `ajisen-181` fallback illustration with a verified Wikimedia Commons photo.
- The photo clearly shows red-broth ramen with noodles, a prominent pork chashu slice, and egg.
- Wikimedia metadata identifies the source as CC BY-SA 2.0; attribution is recorded in the ledger.
- Because no 味千拉面 packaging is visible, the asset is explicitly recorded as a dish-level near-product photo.
- Added the source URL, capture date, candidate cache, license note, and semantic verification to `reports/food_photo_source_ledger.csv`.
- Normalized and synchronized the asset to both frontend and miniprogram directories.

## Standardization

- Asset: `ajisen-181.webp`
- Format: WebP
- Dimensions: 750x750
- File size: 48,570 bytes (below 300KB)
- Mapping: `ajisen-181 -> ajisen-181.webp`

## Verification

- Asset baseline: frontend and miniprogram manifests `853/853`; missing files `0`; oversized files `0`.
- Target mode validation: `failures=0`; ledger rows `283`; no manifest key differences.
- Semantic audit: `foods=846`, `image_keys=566`, `high=0`.
- Food 181 audit: `image_key=ajisen-181`, `reuse_count=1`, `risk_level=ok`.
- Frontend and miniprogram asset copies have identical SHA-256.
- Remaining real-photo backlog: `199` (`P1=76`, `P2=123`).

## Runtime Limitation

- Docker Desktop service is stopped in the current environment. PostgreSQL write/search and frontend/miniprogram runtime checks remain pending until the service is available.
