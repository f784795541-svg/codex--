# Food Real Photo Batch 206

- scope: `dish-566` 牛肉串
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-566` 牛肉串
  - source: Wikimedia Commons `Grilled Kefta Skewers.jpg`
  - license: CC BY 4.0
  - semantic check: 文件说明与画面均明确展示已烤熟的牛肉串；作为菜品级视觉，不宣称特定地域或品牌配方

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=396`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=400`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 90 rows (P1=26, P2=64)
- visual spot check: 候选原图已确认牛肉串语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
