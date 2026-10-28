# Food Real Photo Batch 195

- scope: 烤鸡皮（`dish-568`）、烤鱿鱼（`dish-576`）
- result: 2 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-568` 烤鸡皮
  - source: Wikimedia Commons `Grilled chicken skin.jpg`
  - license: CC BY 2.0
  - semantic check: 文件标题与画面均明确展示烤鸡皮串
- `dish-576` 烤鱿鱼
  - source: Wikimedia Commons `DFC 4127 Skewered grilled squid perfectly charred and ready from a bustling street food stall.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示烤鱿鱼串

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 双端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=373`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=377`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 113 rows（P1=28、P2=85）
- visual spot check: production WebP 清晰展示烤鸡皮和烤鱿鱼
- runtime verification: pending because Docker Desktop Linux engine is unavailable
