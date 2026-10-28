# Food Real Photo Batch 173

- scope: 补齐盒马奥尔良烤鸡腿菜品级图片
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `hema-678` 盒马 奥尔良烤鸡腿
  - source: Wikimedia Commons `Halal Roast Chicken Leg + Roasted Sweet Potato - Foodilic 2024-03-25.jpg`
  - source tier: third_party_public
  - license: CC0
  - semantic check: 图片主体为烤鸡腿，能直观看出目标菜品的主体形态；按菜品级图片使用，不宣称为盒马官方包装，也不以图片证明具体奥尔良配方

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径、版权和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=345`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=349`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 141 rows (`P1=45`, `P2=96`)
- visual spot check: production WebP clearly shows a roasted chicken leg
- runtime verification: pending because Docker Desktop Linux engine is unavailable
