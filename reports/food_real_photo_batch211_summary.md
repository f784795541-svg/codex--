# Food Real Photo Batch 211

- scope: `micun-265` 米村拌饭 肥牛泡菜拌饭
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `micun-265` 米村拌饭 肥牛泡菜拌饭
  - source: Wikimedia Commons `Dolsot Bibimbap - Stone Bowl Bibimbap - Kimchi and Bab (543866063).jpg`
  - license: CC BY-SA 2.0
  - semantic check: 文件标题包含 Kimchi and Bibimbap，画面明确展示石锅牛肉拌饭、煎蛋和蔬菜；作为米村拌饭的菜品级视觉使用，不宣称为官方商品图

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=401`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=405`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 85 rows
- visual spot check: 已确认候选原图及标准化资源均与牛肉泡菜拌饭语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
