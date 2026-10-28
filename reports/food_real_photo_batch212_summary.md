# Food Real Photo Batch 212

- scope: `micun-281` 米村拌饭 辣白菜五花肉拌饭
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `micun-281` 米村拌饭 辣白菜五花肉拌饭
  - source: Wikimedia Commons `Kimchi Pork Rice, Kimchi, and Seaweed.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示辣白菜风味米饭、五花肉和海苔；作为米村拌饭的菜品级视觉使用，不宣称为官方商品图

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=402`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=406`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 84 rows
- visual spot check: 已确认候选原图及标准化资源均与辣白菜五花肉拌饭语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
