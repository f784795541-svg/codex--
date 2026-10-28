# Food Real Photo Batch 204

- scope: `dish-573` 烤玉米
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-573` 烤玉米
  - source: Wikimedia Commons `Grilled Corn (Unsplash).jpg`
  - license: CC0
  - semantic check: 文件标题与画面均明确展示带炭烤痕迹的玉米棒；作为独立菜品级视觉，避免误命中普通玉米图片

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=394`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=398`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 92 rows (P1=26, P2=66)
- visual spot check: 候选原图已确认烤玉米语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
