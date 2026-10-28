# Food Real Photo Batch 180

- scope: 补齐米村拌饭照烧鸡排拌饭菜品级图片
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `micun-266` 米村拌饭 照烧鸡排拌饭
  - source: Wikimedia Commons `Chicken Teriyaki Don - J-Pub Shogun AUD11 (3428018378).jpg`
  - source tier: third_party_public
  - license: CC BY-SA 2.0，需署名/版权复核
  - semantic check: 图片清晰展示照烧鸡肉、米饭和蔬菜，满足照烧鸡肉拌饭的直观识别；记录明确不宣称图片证明鸡排切形或米村拌饭官方品牌

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径、版权和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=352`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=356`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 134 rows (`P1=38`, `P2=96`)
- visual spot check: production WebP clearly shows teriyaki chicken over rice
- runtime verification: pending because Docker Desktop Linux engine is unavailable
