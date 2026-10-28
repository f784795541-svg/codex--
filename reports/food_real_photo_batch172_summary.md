# Food Real Photo Batch 172

- scope: 补齐盒马香煎鸡胸便当真实菜品图
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `hema-717` 盒马 香煎鸡胸便当
  - source: Wikimedia Commons `Chicken Breast Bento (Taiwan).jpg`
  - source tier: third_party_public
  - license: CC BY-SA 4.0，需署名/版权复核
  - semantic check: 图片主体为切片烤/煎鸡胸肉，配米饭和便当配菜；按菜品级图片使用，不宣称为盒马官方商品图

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径、版权和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=344`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=348`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 142 rows (`P1=46`, `P2=96`)
- visual spot check: production WebP clearly shows a chicken-breast bento
- runtime verification: pending because Docker Desktop Linux engine is unavailable
