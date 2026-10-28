# 食物真实图片治理批次 36

日期：2026-08-31

## 处理条目

- `starbucks-646`：拿铁 中杯
- `starbucks-647`：美式咖啡 中杯
- `starbucks-648`：星冰乐 摩卡风味 中杯
- `starbucks-649`：蓝莓麦芬
- `starbucks-700`：香草拿铁 中杯
- `starbucks-701`：抹茶星冰乐 中杯
- `starbucks-702`：冷萃咖啡 中杯

## 执行与语义抽检

- 复用对应的星巴克中国站公开商品来源和本地缓存。
- 使用 `prepare_food_photo_assets.py` 生成 750×750 WebP，并同步双端。
- 视觉抽检确认咖啡、星冰乐和蓝莓麦芬主体与名称一致。
- 来源台账使用真实 `starbucks.com.cn` URL，无占位或虚构地址。

## 门禁结果

- manifest：841 / 841
- 实际资源：841 / 841
- 缺失文件：0
- 超大文件：0
- failures：0
- 图片审计 high risk：0
- backlog：316 条（P0 58、P1 133、P2 123）
