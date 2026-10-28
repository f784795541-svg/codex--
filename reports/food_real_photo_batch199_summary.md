# Food Real Photo Batch 199

- scope: `dish-356` 烧鸭饭
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-356` 烧鸭饭
  - source: Wikimedia Commons `Roast-Duck-Crispy-Pork-Rice-2009.jpg`
  - license: CC BY-SA 3.0
  - semantic check: 文件标题和画面均明确展示烧鸭配米饭；画面同时含脆皮烧肉，已在台账中标注为近似菜品视觉，不宣称纯烧鸭单拼

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=387`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=391`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 99 rows (P1=26, P2=73)
- visual spot check: 候选原图已确认烧鸭饭语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
