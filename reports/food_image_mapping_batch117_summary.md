# Food Image Mapping Batch 117

- Date: 2026-09-01
- Scope: exact image_key split for a P1 branded dish
- No business API or system architecture changes

## Completed

- Changed `味千拉面 肥牛拉面` from the shared `ramen-bowl` key to the independent `ajisen-182` key in `backend/app/food_metadata.py`.
- Added matching `ajisen-182.svg` fallback assets to both frontend and miniprogram directories.
- Regenerated both manifests so the new key resolves identically on both clients.
- Kept the fallback image temporary; `ajisen-182` is now explicitly present in the P1 real-photo backlog for a semantic beef-ramen image.

## Verification

- Food catalog: `846` records.
- Semantic audit: `foods=846`, `image_keys=567`, `high=0`.
- Frontend and miniprogram manifests: `853/853`; missing files `0`; oversized files `0`.
- Target mode validation: `failures=0`; source ledger remains `289` unique rows.
- Backlog: `193` rows (`P1=70`, `P2=123`), including `ajisen-182`.
