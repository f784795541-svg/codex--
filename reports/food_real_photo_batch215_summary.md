# Food Real Photo Batch 215

- scope: `hema-617` 盒马 鸡胸肉沙拉
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `hema-617` 盒马 鸡胸肉沙拉
  - source: Wikimedia Commons `Grilled Chicken Vegetable Salad.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示烤鸡胸肉、生菜、番茄、彩椒和奶酪沙拉；作为盒马菜品级视觉使用，不宣称为官方商品图

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=405`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=409`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 81 rows
- visual spot check: 已确认候选原图及标准化资源均与鸡胸肉沙拉语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
