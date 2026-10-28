# Food Photo Batch 87

- Date: 2026-09-01
- Scope: P1 branded alcohol product photo completion
- No business API or system architecture changes

## Completed

| image_key | catalog item | local candidate | semantic verification |
|---|---|---|---|
| `fenjiu-335` | 汾酒 53度 | `reports/candidate_images/p1-next17/fenjiu-335-c1.jpg` | Public retail image clearly shows the 汾酒 bottle and 53%vol specification. |
| `corona-327` | 科罗娜啤酒 | `reports/candidate_images/p1-next17/corona-327-c1.png` | Public retail image clearly shows Corona Extra bottle labels and packaging. |

## Standardization

- Both assets are normalized to 750x750 WebP and are below 300KB.
- `fenjiu-335.webp`: 45,466 bytes.
- `corona-327.webp`: 122,354 bytes.
- Frontend and miniprogram copies have identical SHA-256 hashes for both keys.
- Source URL, capture date, local candidate cache, and verification notes are registered in `reports/food_photo_source_ledger.csv`.

## Verification

- Asset baseline: frontend and miniprogram manifests `853/853`; missing files `0`; oversized files `0`.
- Target mode validation: `failures=0`; ledger rows `260`; no manifest key differences.
- Semantic audit: `foods=846`, `image_keys=565`, `high=0`.
- Data priority backlog: `Missing terms=0`.
- Remaining real-photo backlog: `221` (`P1=98`, `P2=123`).
- Frontend and miniprogram manifest syntax checks passed.

## Runtime limitation

- Docker Desktop service is stopped in the current environment. PostgreSQL write/search and miniprogram runtime verification remain pending until it is available.
