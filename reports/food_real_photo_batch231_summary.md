# Food Real Photo Batch 231

- scope: `green-bean-stirfry` 干煸四季豆
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `green-bean-stirfry` 干煸四季豆
  - source: Wikimedia Commons `Sichuan-style-dried fried Green Beans with Minced Pork - Aberdeen Seafood, Brighton 2026-07-19.jpg`
  - license: CC0
  - semantic check: Commons 文件标题明确为四川风味干煸四季豆配肉末；候选图和标准化后的生产图均清晰展示煸炒四季豆、肉末和干红辣椒。
  - use note: 作为菜品级视觉，不宣称任何餐厅或品牌的官方商品图；该源文件为 CC0。

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源为 70,466 bytes，低于 300KB 上限
- 网页端和小程序端文件的 SHA-256 相同，manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=419`, `failures=0`)
- target-mode asset gate: passed (`frontend=861`, `miniprogram=861`, `ledger=423`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=572`, `high=0`)
- backlog after batch: 68 rows（P1=10、P2=58）
- visual spot check: 已检查完整的同源 Commons 缩略图及双端标准化后的 `green-bean-stirfry.webp`
- runtime verification: pending because Docker Desktop Linux engine is unavailable
