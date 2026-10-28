# Food Real Photo Batch 166

- scope: 百事可乐与百事无糖可乐官方商品图接入
- result: 2 个 image_key 已接入并同步双端

## Promoted

- `product-199` 百事可乐
  - source: Pepsi official product page
  - source tier: official_public
  - semantic check: 完整经典 Pepsi 罐装商品图，品牌和普通可乐口味清晰可识别
- `product-200` 百事无糖可乐
  - source: Pepsi official product page
  - source tier: official_public
  - semantic check: 完整 Pepsi Zero Sugar 黑罐商品图，明确匹配无糖口味

两张图片均已标准化为 750x750 WebP 并同步到网页端和小程序端。官方页面未明确列出图片授权条款，来源和页面地址已完整记录，后续仍保留版权复核事项。

## Verification

- source-cache integrity: passed (`verified=332`, `failures=0`)
- target-mode asset gate: passed (`frontend=855`, `miniprogram=855`, `ledger=336`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=5`; `product-199` and `product-200` risk level `ok`
- backlog after batch: 154 rows (`P1=58`, `P2=96`)
- visual spot check: both official can images are complete and directly identifiable
- runtime verification: pending because Docker Desktop Linux engine is unavailable
