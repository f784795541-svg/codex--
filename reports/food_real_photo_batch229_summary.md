# Food Real Photo Batch 229

- scope: `yu-xiang-pork` 鱼香肉丝
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `yu-xiang-pork` 鱼香肉丝
  - source: Wikimedia Commons `鱼香肉丝.jpg`
  - license: CC BY-SA 3.0
  - semantic check: 文件名和 Commons 分类均明确为鱼香肉丝；原图与标准化后的生产图清晰展示鱼香肉丝成品，包含肉丝、木耳、笋和青红椒等配料。
  - use note: 作为菜品级视觉，不宣称任何餐厅或品牌的官方商品图；使用时保留署名与相同方式共享义务。

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 裁切掉上方无关留白，提升主菜识别度
- 网页端和小程序端资源及 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=417`, `failures=0`)
- target-mode asset gate: passed (`frontend=861`, `miniprogram=861`, `ledger=421`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=572`, `high=0`)
- backlog after batch: 70 rows（P1=10、P2=60）
- visual spot check: 已检查 Commons 候选原图及双端标准化后的 `yu-xiang-pork.webp`
- runtime verification: pending because Docker Desktop Linux engine is unavailable
