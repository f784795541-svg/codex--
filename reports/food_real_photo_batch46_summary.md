# 食物真实图片治理批次 46

日期：2026-09-01

## 执行目标

补齐并规范化 `mengniu-513`（蒙牛 纯牛奶）图片，同时修复历史遗留的 3 个尺寸/大小不合规 WebP；不改变数据库表结构、接口契约或页面架构。

## 处理条目

- `mengniu-513`：使用公开零售商品图，画面可识别蒙牛纯牛奶 250ml；来源级别记录为 `retail_public`，不宣称为品牌官网托管图。
- `familymart-229`、`lawson-618`、`mcd-139`：从现有已核验 raster 素材重新归一化，修复 1200×1200 及超 300KB 的历史版本。

## 执行标准与方式

- 通过 `prepare_food_photo_assets.py` 生成 `mengniu-513.webp`。
- 通过 `normalize_food_assets.py` 重新归一化历史 raster 资源。
- 双端资源保持相同 WebP 字节内容，尺寸 750×750，单张不超过 300KB。
- 更新来源台账、双端 manifest，并生成批次 contact sheet。
- 候选图实际查看后才入库；品牌、品类或规格无法确认的图片不替换。

## 门禁结果

- frontend manifest：841
- miniprogram manifest：841
- 实际资源：841 / 841
- 缺失文件：0
- 超大文件：0
- target-mode failures：0
- 图片审计 high risk：0
- backlog：287 条（P0 31、P1 133、P2 123）

视觉抽检文件：`reports/food_real_photo_batch46_contact.jpg`。

## 运行验证说明

Docker Desktop Linux 引擎当前仍无法连接，因此本批完成了静态门禁和本地视觉抽检，容器内接口/页面回归待 Docker 恢复后执行。
