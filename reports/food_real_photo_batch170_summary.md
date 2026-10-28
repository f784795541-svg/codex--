# Food Real Photo Batch 170

- scope: 补齐留学生餐厅菜品的真实菜品图
- result: 2 个 image_key 已接入并同步网页端与小程序端；图片语义通过视觉抽检

## Promoted

- `intl-cafe-288` 留学生餐厅 照烧鸡腿饭
  - source: Wikimedia Commons `Teriyaki Chicken Rice Bowl from Botejyu (2024-12-21).jpg`
  - source tier: third_party_public
  - license: CC BY 4.0，需保留署名/版权复核
  - semantic check: 图片主体为照烧鸡肉、白米饭和沙拉，能直观看出照烧鸡腿饭；按菜品级图片使用，不宣称为留学生餐厅官方宣传图

- `intl-cafe-290` 留学生餐厅 咖喱牛肉饭
  - source: Wikimedia Commons `Sukiya Beef Curry Rice.jpg`
  - source tier: third_party_public
  - license: CC BY-SA 4.0，需保留署名/版权复核
  - semantic check: 图片主体为牛肉、咖喱汁和米饭，能直观看出咖喱牛肉饭；按菜品级图片使用，不宣称为留学生餐厅官方宣传图

- `intl-cafe-289` 留学生餐厅 台式卤肉饭
  - source: 已核验的 Wikimedia Commons `Braised Pork and Rice (Taiwan).jpg`
  - source tier: third_party_public
  - license: CC BY-SA 4.0，需保留署名/版权复核
  - semantic check: 图片主体为台式卤肉盖饭，能直观看出卤肉饭；复用已核验来源，不宣称为留学生餐厅官方宣传图

三张图片均已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径和语义说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=340`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=344`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 146 rows (`P1=50`, `P2=96`)
- visual spot check: all three production WebP files clearly show the intended dish type
- runtime verification: pending because Docker Desktop Linux engine is unavailable

## Next

- Continue remaining P1 backlog and review 18 medium-risk shared image keys.
- Keep restaurant-specific branding claims separate from dish-level photos.
- After Docker is available, run PostgreSQL seed synchronization, `/food/search`, and both client runtime checks.
