# Food Real Photo Batch 177

- scope: 补齐鱼籽村招牌鱼籽拌饭真实菜品图
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `yuzicun-254` 鱼籽村 招牌鱼籽拌饭
  - source: Wikimedia Commons `Ikura don.jpg`
  - source tier: third_party_public
  - license: CC BY 2.0，需署名/版权复核
  - semantic check: 图片主体为鱼籽覆盖米饭的鱼籽盖饭，鱼籽和米饭清晰可辨；按鱼籽类菜品级图片使用，不宣称为鱼籽村官方图

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径、版权和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=349`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=353`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 137 rows (`P1=41`, `P2=96`)
- visual spot check: production WebP clearly shows fish roe over rice
- runtime verification: pending because Docker Desktop Linux engine is unavailable
