# Food Real Photo Batch 178

- scope: 补齐鱼籽村双拼鱼籽拌饭真实菜品图
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `yuzicun-255` 鱼籽村 双拼鱼籽拌饭
  - source: Wikimedia Commons `Rice bowl topped with salmon and salmon egg (14904439935).jpg`
  - source tier: third_party_public
  - license: CC BY-SA 2.0，需署名/版权复核
  - semantic check: 图片同时展示三文鱼片和鱼籽覆盖米饭，符合“双拼”及鱼籽主体的视觉识别需求；按菜品级图片使用，不宣称为鱼籽村官方图

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径、版权和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=350`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=354`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 136 rows (`P1=40`, `P2=96`)
- visual spot check: production WebP clearly shows salmon and fish roe over rice
- runtime verification: pending because Docker Desktop Linux engine is unavailable
