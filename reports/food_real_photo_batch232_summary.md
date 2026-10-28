# Food Real Photo Batch 232

- scope: `spicy-stew-bowl` 夫妻肺片
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `spicy-stew-bowl` 夫妻肺片
  - source: Wikimedia Commons `Fuqi Fei Pian.jpg`
  - license: CC BY-SA 3.0
  - semantic check: 文件标题精确对应夫妻肺片；候选图和标准化后的生产图均清晰展示牛肉/牛杂片、红油、花生碎、芝麻与香菜。
  - use note: 作为菜品级视觉，不宣称任何餐厅或品牌的官方商品图；使用时保留署名与相同方式共享义务。

## Verification

- source-cache integrity: passed (`verified=420`, `failures=0`)
- target-mode asset gate: passed (`frontend=861`, `miniprogram=861`, `ledger=424`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=572`, `high=0`)
- asset: 双端 `750×750 WebP`，单张 47,610 bytes
- backlog after batch: 67 rows（P1=10、P2=57）
- runtime verification: pending because Docker Desktop Linux engine is unavailable
