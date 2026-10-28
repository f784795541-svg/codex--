# Food Real Photo Batch 190

- scope: 吉野家芝士牛肉饭（`yoshinoya-297`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `yoshinoya-297` 吉野家 芝士牛肉饭
  - source: Wikimedia Commons `Cheese beef bowl of Yoshinoya.jpg`
  - source tier: third_party_public
  - license: CC0（无需署名）
  - semantic check: 文件说明明确为吉野家芝士牛丼，图片清晰展示牛肉、米饭和芝士，满足产品级识别；不延伸声称具体地区价格或规格
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=362`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=366`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 124 rows（P1=28、P2=96）
- visual spot check: production WebP clearly shows Yoshinoya cheese beef bowl
- runtime verification: pending because Docker Desktop Linux engine is unavailable
