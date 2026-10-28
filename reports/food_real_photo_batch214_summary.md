# Food Real Photo Batch 214

- scope: `hema-719` 盒马 藜麦虾仁沙拉
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `hema-719` 盒马 藜麦虾仁沙拉
  - source: Wikimedia Commons `Quinoa noir en salade, nem de crevettes en tartare, crevettes marinées yuzu, sirop wasabi (octobre 2019).jpg`
  - license: CC0
  - semantic check: 文件标题明确包含黑藜麦沙拉和虾仁，画面清晰可见虾仁及沙拉组合；作为盒马菜品级视觉使用，不宣称为官方商品图

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=404`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=408`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 82 rows
- visual spot check: 已确认候选原图及标准化资源均与藜麦虾仁沙拉语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
