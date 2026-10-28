# Food Real Photo Batch 196

- scope: 烤茄子（`dish-570`）
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-570` 烤茄子
  - source: Wikimedia Commons `Grilled eggplant appetizer.jpg`
  - license: CC BY 2.0
  - semantic check: 文件标题与画面均明确展示烤制茄子切片；作为菜品级视觉，不宣称特定餐厅或配方

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 双端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=374`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=378`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 112 rows（P1=28、P2=84）
- visual spot check: production WebP 清晰展示烤茄子
- runtime verification: pending because Docker Desktop Linux engine is unavailable
