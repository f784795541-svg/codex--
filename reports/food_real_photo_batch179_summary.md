# Food Real Photo Batch 179

- scope: 补齐汉堡王薯霸王单品宣传图
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成视觉语义抽检

## Promoted

- `burgerking-693` 汉堡王 薯霸王
  - source: 公开第三方商品宣传图（什么值得买图片 CDN）
  - source tier: third_party_public
  - semantic check: 汉堡王品牌杯身、薯条和“薯霸王”文字清晰可辨；只用于未注明规格的薯霸王条目，不用于中份条目
  - copyright note: 来源页面未明确授权条款，已保留缓存、来源 URL 与版权复核说明

图片已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=351`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=355`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 135 rows (`P1=39`, `P2=96`)
- visual spot check: production WebP clearly shows a Burger King fries carton
- runtime verification: pending because Docker Desktop Linux engine is unavailable
