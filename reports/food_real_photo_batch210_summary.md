# Food Real Photo Batch 210

- scope: `intl-cafe-256` 留学生餐厅 黑椒牛肉饭
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `intl-cafe-256` 留学生餐厅 黑椒牛肉饭
  - source: Wikimedia Commons `黑椒牛肉饭 Black Pepper Beef on rice - Hongyun Chinese Restaurant AUD8.50 (3450250738).jpg`
  - license: CC BY-SA 2.0
  - semantic check: 文件标题与画面均明确展示黑椒牛肉配米饭；作为菜品级视觉使用，不宣称为留学生餐厅官方商品图

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=400`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=404`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 86 rows
- visual spot check: 已确认候选原图及标准化资源均与黑椒牛肉饭语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
