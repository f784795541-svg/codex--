# Food Real Photo Batch 175

- scope: 补齐山姆凯撒鸡肉沙拉菜品级图片
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `chicken-salad-bowl` 山姆 凯撒鸡肉沙拉
  - source: Wikimedia Commons `Caesar Salad & Grilled Chicken (30548011308).jpg`
  - source tier: third_party_public
  - license: CC BY 2.0，需署名/版权复核
  - semantic check: 图片清晰包含生菜、烤鸡肉、面包丁和芝士粉，符合凯撒鸡肉沙拉的菜品识别需求；按菜品级图片使用，不宣称为山姆官方商品图

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径、版权和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=347`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=351`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 139 rows (`P1=43`, `P2=96`)
- visual spot check: production WebP clearly shows Caesar salad with grilled chicken
- runtime verification: pending because Docker Desktop Linux engine is unavailable
