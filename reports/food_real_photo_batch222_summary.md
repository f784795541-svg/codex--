# Food Real Photo Batch 222

- scope: `mixue-652` 蜜雪冰城草莓摇摇奶昔
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `mixue-652`：宣传图中同时出现蜜雪冰城品牌、草莓配料和“草莓摇摇奶昔”明确文字；记录为 `near_product_photo`，不宣称为官方包装图。

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源与 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=413`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=417`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 73 rows（P1=11，P2=62）
- visual spot check: 已检查候选原图及标准化后的 `mixue-652.webp`
- runtime verification: pending because Docker Desktop Linux engine is unavailable
