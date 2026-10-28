# 食物真实图片治理批次 31

日期：2026-08-31

## 执行目标

将 4 个仍使用 SVG fallback 的肯德基 P0 商品替换为可核验的公开商品/促销图，并保持双端图片规范一致。

## 处理条目

- `kfc-689`：吮指原味鸡 1 块
- `kfc-161`：吮指原味鸡 2 块
- `kfc-162`：新奥尔良烤翅 2 块
- `kfc-163`：香辣鸡翅 2 块

## 执行与验收

- 来源已写入 `reports/food_photo_source_ledger.csv`，每个 key 唯一且有本地缓存路径。
- 使用 `scripts/prepare_food_photo_assets.py` 标准化后同步到网页端和小程序端。
- 图片抽检确认品牌和食物类型清晰；份数由食物记录字段表达，未将图片作为精确份数依据。
- `frontend/assets/foods/food-image-assets.js` 与 `miniprogram/utils/foodImageAssets.js` 已改为指向对应 WebP。
- 4 个文件均为 750×750 WebP，单张低于 300KB，双端哈希一致。

## 全量门禁结果

- manifest：841 / 841
- 实际资源：841 / 841
- 缺失文件：0
- 超大文件：0
- 目标模式 failures：0
- 图片审计 high risk：0

后续继续处理其他 P0 fallback；来源不可靠或无法确认具体口味时，维持 fallback 并保留在 backlog。
