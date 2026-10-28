# Food Real Photo Batch 208

- scope: `dish-578` 炒粉
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-578` 炒粉
  - source: Wikimedia Commons `Stir-fried rice noodles in Nanchang (20190619175008).jpg`
  - license: CC BY-SA 4.0
  - semantic check: 图片明确展示成品盘装炒粉/炒米粉，不是菜单或烹饪过程图；作为菜品级视觉素材使用

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=398`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=402`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 88 rows
- visual spot check: 已确认候选原图及标准化资源均与炒粉语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
