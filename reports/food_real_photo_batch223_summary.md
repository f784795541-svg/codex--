# Food Real Photo Batch 223

- scope: `intl-cafe-299` 留学生餐厅黑椒鸡排饭
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `intl-cafe-299`：采用 Wikimedia Commons CC0 菜品照片，画面明确为黑椒调味鸡排配米饭和蔬菜。
- 该图片仅作为菜品级视觉参考，不宣称为“留学生餐厅”官方商品图；未使用其他餐厅品牌图片冒充。

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源与 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=414`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=418`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 72 rows（P1=10，P2=62）
- visual spot check: 已检查 CC0 原图及标准化后的 `intl-cafe-299.webp`
- runtime verification: pending because Docker Desktop Linux engine is unavailable
