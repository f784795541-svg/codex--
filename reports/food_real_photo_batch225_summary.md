# Food Real Photo Batch 225

- scope: `dish-569` 烤五花肉
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-569` 烤五花肉
  - source: Wikimedia Commons `Grilled Pork Belly.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件说明明确为 grilled pork belly；原图和裁切后的生产图均清晰展示烤熟五花肉、烤架和炭火，不是生肉或制作前原料。
  - use note: 作为菜品级视觉，不宣称为任何品牌官方商品图；使用时保留署名与相同方式共享义务。

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 已在裁切后重新标准化，提升成品主体的识别度

## Verification

- source-cache integrity: passed (`verified=415`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=419`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 71 rows（P1=10、P2=61）
- visual spot check: 已检查 Commons 候选原图及双端标准化后的 `dish-569.webp`
- runtime verification: pending because Docker Desktop Linux engine is unavailable
