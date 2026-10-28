# Food Real Photo Batch 200

- scope: `dish-368` 梅菜扣肉、`dish-371` 糖醋排骨
- result: 2 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-368` 梅菜扣肉
  - source: Wikimedia Commons `11月17日 梅菜扣肉.jpg`
  - license: CC BY 2.0
  - semantic check: 文件说明与画面均明确展示梅菜扣肉；作为菜品级视觉
- `dish-371` 糖醋排骨
  - source: Wikimedia Commons `糖醋排骨.JPG`
  - license: CC BY-SA 3.0
  - semantic check: 文件标题与画面均明确展示糖醋排骨及酸甜酱汁；作为菜品级视觉

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=389`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=393`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 97 rows (P1=26, P2=71)
- visual spot check: 两张候选原图均已确认语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
