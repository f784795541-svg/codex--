# Food Real Photo Batch 189

- scope: 蜜雪冰城珍珠奶茶（`mixue-651`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `mixue-651` 蜜雪冰城 珍珠奶茶
  - source: Wikimedia Commons `Mixue Ice Cream & Tea Pearl Milk Tea.png`
  - source tier: third_party_public
  - license: CC BY 4.0（需署名）
  - semantic check: 文件说明明确为蜜雪冰城出品的珍珠奶茶，图片清晰展示蜜雪冰城杯身、奶茶和底部珍珠，满足产品级识别；不延伸声称糖度、冰量或规格
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=361`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=365`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 125 rows（P1=29、P2=96）
- visual spot check: production WebP clearly shows a Mixue pearl milk tea cup
- runtime verification: pending because Docker Desktop Linux engine is unavailable
