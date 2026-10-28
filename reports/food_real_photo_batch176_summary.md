# Food Real Photo Batch 176

- scope: 补齐米村拌饭烤肉拌饭真实菜品图
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `micun-293` 米村拌饭 烤肉拌饭
  - source: Wikimedia Commons `Korean cuisine-BBQ Chicken Dolsot Bibimbap.jpg`
  - source tier: third_party_public
  - license: CC BY-SA 2.0，需署名/版权复核
  - semantic check: 图片清晰展示石锅烤肉拌饭，含烤肉、米饭、蔬菜和鸡蛋；适用于未指定肉类的“烤肉拌饭”菜品级展示，不宣称为米村拌饭官方图

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径、版权和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=348`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=352`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 138 rows (`P1=42`, `P2=96`)
- visual spot check: production WebP clearly shows a BBQ meat bibimbap bowl
- runtime verification: pending because Docker Desktop Linux engine is unavailable
