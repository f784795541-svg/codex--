# Food Real Photo Batch 202

- scope: `dish-349` 麻辣香锅、`dish-498` 龙井虾仁
- result: 2 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-349` 麻辣香锅
  - source: Wikimedia Commons `Malaxiangguo in China.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示麻辣香锅的多种配料、辣椒和红油；作为菜品级视觉
- `dish-498` 龙井虾仁
  - source: Wikimedia Commons `Longjing prawns in Hangzhou Restaurant 2015-07.JPG`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示龙井虾仁及茶叶点缀；作为菜品级视觉

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=392`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=396`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 94 rows (P1=26, P2=68)
- visual spot check: 两张候选原图均已确认语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
