# Food Real Photo Batch 230

- scope: `lion-head-meatball` 红烧狮子头
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `lion-head-meatball` 红烧狮子头
  - source: Wikimedia Commons `Lions head meatballs in brown sauce.jpg`
  - license: CC BY-SA 4.0, author Jpatokal
  - semantic check: Commons 文件说明明确为上海风味红烧狮子头；原图和标准化后的生产图清晰展示切开的红烧肉丸、棕色酱汁与青菜配菜。
  - use note: 作为菜品级视觉，不宣称任何餐厅或品牌的官方商品图；使用时保留署名与相同方式共享义务。

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源为 43,526 bytes，低于 300KB 上限
- 网页端和小程序端文件的 SHA-256 相同，manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=418`, `failures=0`)
- target-mode asset gate: passed (`frontend=861`, `miniprogram=861`, `ledger=422`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=572`, `high=0`)
- backlog after batch: 69 rows（P1=10、P2=59）
- visual spot check: 已检查 Commons 候选原图及双端标准化后的 `lion-head-meatball.webp`
- runtime verification: pending because Docker Desktop Linux engine is unavailable
