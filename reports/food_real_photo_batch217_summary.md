# Food Real Photo Batch 217

- scope: `subway-239` 赛百味 牛油果鸡肉三明治 6英寸
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `subway-239` 赛百味 牛油果鸡肉三明治 6英寸
  - source: Wikimedia Commons `My chicken avocado panini.jpg`
  - license: CC BY 2.0
  - semantic check: 文件标题与画面均明确展示鸡肉和牛油果三明治；作为赛百味菜品级视觉使用，不宣称为官方包装图

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=407`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=411`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 79 rows
- visual spot check: 已确认候选原图及标准化资源均与牛油果鸡肉三明治语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
