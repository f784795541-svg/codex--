# Food Real Photo Batch 207

- scope: `dish-575` 生蚝
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-575` 生蚝
  - source: Wikimedia Commons `Plate of 6 oysters - La Petite Plage 2025-03-25.jpg`
  - license: CC0
  - semantic check: 文件标题与画面均明确展示带壳鲜蚝；作为菜品级视觉

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=397`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=401`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 89 rows (P1=26, P2=63)
- visual spot check: 候选原图已确认生蚝语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
