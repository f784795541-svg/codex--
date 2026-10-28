# Food Real Photo Batch 186

- scope: 茶百道杨枝甘露（`chabaidao-654`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `chabaidao-654` 茶百道 杨枝甘露
  - source: Wikimedia Commons `Mango Pomelo Sago by Lei Garden.jpg`
  - source tier: third_party_public
  - license: CC BY 2.0（需署名）
  - semantic check: 文件标题明确为 Mango Pomelo Sago，图片清晰展示芒果色甜品、西米和果肉；作为菜品级视觉图接入，不宣称茶百道官方产品、包装或具体配方
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=358`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=362`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 128 rows（P1=32、P2=96）
- visual spot check: production WebP clearly shows mango pomelo sago dessert
- runtime verification: pending because Docker Desktop Linux engine is unavailable
