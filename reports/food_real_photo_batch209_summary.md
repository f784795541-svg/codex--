# Food Real Photo Batch 209

- scope: `intl-cafe-243` 留学生餐厅 蒜香猪排咖喱饭
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `intl-cafe-243` 留学生餐厅 蒜香猪排咖喱饭
  - source: Wikimedia Commons `Japanese Curry Pork Cutlet Rice in Hong Kong.JPG`
  - license: CC BY-SA 4.0
  - semantic check: 图片清晰展示成品咖喱饭与猪排；作为菜品级视觉使用，不宣称为留学生餐厅官方商品图。照片无法直接验证“蒜香”调味，因此在台账中已明确标注这一限制。

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=399`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=403`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 87 rows
- visual spot check: 已确认候选原图及标准化资源均与咖喱猪排饭语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
