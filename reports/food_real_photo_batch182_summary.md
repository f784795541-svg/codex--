# Food Real Photo Batch 182

- scope: 汉堡王经典皇堡（`burgerking-691`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `burgerking-691` 汉堡王 经典皇堡
  - source: Wikimedia Commons `Whopper.jpg`
  - source tier: third_party_public
  - license: CC0（无需署名）
  - semantic check: 图片清晰展示芝麻面包、牛肉饼、生菜、番茄和洋葱，满足经典皇堡的直观识别；记录为菜品级视觉图，不宣称当前中国大陆宣传包装或官方菜单素材
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=354`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=358`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 132 rows（P1=36、P2=96）
- visual spot check: production WebP clearly shows a Whopper-style burger
- runtime verification: pending because Docker Desktop Linux engine is unavailable
