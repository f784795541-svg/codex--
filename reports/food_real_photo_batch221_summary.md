# Food Real Photo Batch 221

- scope: `chabaidao-655` 茶百道超级杯水果茶；`mixue-650` 蜜雪冰城冰鲜柠檬水
- result: 2 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `chabaidao-655`：茶百道品牌杯体及杯身“超级杯水果茶”标签清晰可见。
- `mixue-650`：蜜雪冰城雪王杯、柠檬片和“冰鲜柠檬水”商品字样清晰可见。
- 两项均标记为 `near_product_photo`，来源为媒体/第三方实拍或宣传图，不宣称为官方包装图。

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源与 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=412`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=416`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 74 rows（P1=12，P2=62）
- visual spot check: 已检查两项候选原图及标准化后的前端资源
- runtime verification: pending because Docker Desktop Linux engine is unavailable
