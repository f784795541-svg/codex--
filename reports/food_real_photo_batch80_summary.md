# Food Real Photo Batch 80

- Date: 2026-09-01
- Scope: continue P1 Yoshinoya side-dish coverage
- Completed keys: `yoshinoya-672`
- Skipped key: `yoshinoya-297` (candidates did not visibly prove the cheese topping)
- Coverage change: `244 -> 245` raster WebP assets; prioritized backlog `225 -> 224`

## Selected Source

| image_key | catalog item | local candidate | semantic verification |
|---|---|---|---|
| `yoshinoya-672` | 吉野家 魔芋丝 | `reports/candidate_images/p1-next6/yoshinoya-672-c1.jpg` | Clear close-up of white konjac noodles; recorded as a near-product match because Yoshinoya packaging is not visible. |

## Asset Checks

- Asset generated as `750x750` WebP.
- `yoshinoya-672.webp`: 45,640 bytes.
- Frontend and miniprogram SHA-256: `3644F166B08FE870A0925090F3544F5375E213E8C5CC392BF7CF6485EB71D231`.
- Frontend and miniprogram manifests: `841/841`.
- Raster assets: `245`; SVG fallback entries: `596`.
- Missing assets: `0`.
- Raster assets over 300KB: `0`.
- Source ledger: `245` unique rows with no malformed rows or missing cache paths.
- Refreshed backlog: `224` rows (`P1=101`, `P2=123`).

## Static Verification

- `audit_food_images.py`: `foods=834`, `image_keys=552`, `high=0`.
- `validate_food_target_mode.cjs`: `frontend=841`, `miniprogram=841`, `ledger=245`, `failures=0`.

## Runtime Verification

- Docker Desktop Linux engine is unavailable in the current environment.
- Backend API, PostgreSQL write, in-app search, and miniprogram runtime checks remain pending until the container engine is available.
