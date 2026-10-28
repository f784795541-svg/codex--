# Food Real Photo Batch 174

- scope: 补齐米村拌饭肥牛拌饭真实菜品图
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `micun-257` 米村拌饭 肥牛拌饭
  - source: Wikimedia Commons `Korean Beef Bulgogi Rice Bowl (34817154336).jpg`
  - source tier: third_party_public
  - license: CC BY-SA 2.0，需署名/版权复核
  - semantic check: 图片主体为韩式牛肉拌饭，含牛肉、米饭、蔬菜和鸡蛋；按菜品级图片使用，不宣称为米村拌饭官方图

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径、版权和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=346`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=350`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 140 rows (`P1=44`, `P2=96`)
- visual spot check: production WebP clearly shows a beef bibimbap/rice bowl
- runtime verification: pending because Docker Desktop Linux engine is unavailable
