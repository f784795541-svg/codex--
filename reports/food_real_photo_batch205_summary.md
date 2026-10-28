# Food Real Photo Batch 205

- scope: `dish-572` 烤金针菇
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-572` 烤金针菇
  - source: Wikimedia Commons `Grilled enoki-dake mushrooms (5993870972).jpg`
  - license: CC BY-SA 2.0
  - semantic check: 文件标题与画面均明确展示烤制金针菇及葱花；作为独立菜品级视觉

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=395`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=399`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 91 rows (P1=26, P2=65)
- visual spot check: 候选原图已确认烤金针菇语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
