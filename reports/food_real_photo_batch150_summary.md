# Food Real Photo Batch 150

- scope: open-license dish photos from Wikimedia Commons
- result: 2 keys promoted; 4 keys deferred because the downloaded cache was incomplete

## Promoted

- `dish-580` — 蛋炒饭
  - source: Wikimedia Commons, `Fried rice in home.jpg`
  - license: CC BY-SA 4.0
  - author: Peachyeung316
  - semantic check: plate clearly shows egg fried rice
  - normalized to 750×750 WebP and synchronized to both clients

- `dish-579` — 炒饭 夜宵版
  - source: the same Wikimedia Commons open-license dish photo
  - license: CC BY-SA 4.0
  - author: Peachyeung316
  - semantic check: generic egg fried rice is appropriate for the night-snack fried-rice category
  - normalized to 750×750 WebP and synchronized to both clients

## Deferred

- `kung-pao-chicken`
- `dish-736`
- `tomato-egg-stirfry`
- `dish-739`

The cached JPEGs for these four keys were truncated by the network transfer. They remain marked `fallback_only/unverified`; no incomplete file was promoted. A complete download is required before they can leave the backlog.

## Verification

- target-mode static gate: passed (`frontend=853`, `miniprogram=853`, `ledger=324`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=567`, `high=0`)
- backlog after batch: 157 rows
- runtime verification: pending because Docker Desktop Linux engine is unavailable
