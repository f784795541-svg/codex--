# Food Real Photo Batch 192

- scope: 基础火锅鱼丸（`dish-764`）
- result: 1 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-764` 基础火锅 鱼丸
  - source: Wikimedia Commons `Fish balls and Octopus Balls at Hot Pot day.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 原图清晰展示分开的鱼丸盘和章鱼丸盘，鱼丸形态可直接识别；作为火锅鱼丸的菜品级图片，不宣称品牌或具体配方

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 双端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=366`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=370`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 120 rows（P1=28、P2=92）
- visual spot check: production WebP 清晰展示火锅鱼丸
- runtime verification: pending because Docker Desktop Linux engine is unavailable
