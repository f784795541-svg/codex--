# Food Real Photo Batch 167

- scope: 接入雪碧、芬达橙味、芬达葡萄味官方商品图
- result: 3 个 image_key 已接入并同步网页端与小程序端

## Promoted

- `product-203` 雪碧
  - source: Coca-Cola China official Sprite brand page
  - source tier: official_public
  - semantic check: 完整绿色雪碧瓶，品牌和清爽柠檬味标签清晰可识别
- `product-204` 芬达橙味
  - source: Coca-Cola China official Fanta brand page
  - source tier: official_public
  - semantic check: 完整橙色芬达瓶，橙味图形和品牌标签清晰可识别
- `product-205` 芬达葡萄味
  - source: Coca-Cola China official Fanta brand page
  - source tier: official_public
  - semantic check: 完整紫色芬达瓶，葡萄图形和品牌标签清晰可识别

三张源图均保留在 `reports/candidate_images/`，并已标准化为 750x750 WebP。官方页面未明确列出图片授权条款，来源 URL、采集日期和缓存路径已写入台账，后续仍保留版权复核事项。

## Verification

- source-cache integrity: passed (`verified=335`, `failures=0`)
- target-mode asset gate: passed (`frontend=858`, `miniprogram=858`, `ledger=339`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=2`; product-203/204/205 risk level `ok`
- backlog after batch: 151 rows (`P1=55`, `P2=96`)
- visual spot check: three official bottle images are complete and directly identifiable
- runtime verification: pending because Docker Desktop Linux engine is unavailable

## Next

- Continue sourcing `product-201` 美年达橙味 and `product-202` 美年达葡萄味.
- Continue P1/P2 real-photo backlog and the remaining 18 medium-risk shared keys.
- After Docker is available, run PostgreSQL seed synchronization, `/food/search`, and both client runtime checks.
