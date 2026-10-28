# 食物真实图片治理批次 30

日期：2026-08-31

## 执行目标

- 处理来源台账中已具备本地缓存的 15 个商品图片来源。
- 统一生成 750×750 WebP，并同步网页端与小程序端。
- 确保 manifest、缓存路径和双端文件哈希一致。

## 处理范围

- 星巴克：`starbucks-626`、`627`、`628`、`629`、`680`、`681`、`682`
- 瑞幸：`luckin-622`、`luckin-623`、`luckin-678`
- 肯德基：`kfc-142`、`kfc-155`
- 必胜客：`pizzahut-648`、`pizzahut-649`
- 红牛：`redbull-406`

## 执行方式

1. 读取 `reports/food_photo_source_ledger.csv` 的 `source_cache_path`，确认缓存文件存在。
2. 使用 `scripts/prepare_food_photo_assets.py` 生成标准 WebP 到 `A:\body-food-images`。
3. 将同一文件复制到 `frontend/assets/foods/` 和 `miniprogram/assets/foods/`。
4. 运行 `scripts/validate_food_target_mode.cjs`，检查尺寸、格式、大小、双端 hash、manifest 和缓存路径。
5. 运行图片审计、backlog 和资产基线脚本，记录全量结果。

## 结果与验收

- 成功处理：15；失败：0；跳过：0。
- 本批文件全部为 750×750 WebP，大小约 6–50KB，均低于 300KB。
- 双端 manifest：841 / 841；实际资源：841 / 841；缺失文件：0。
- 目标模式门禁：`failures=0`。
- 来源台账：131 条、唯一 key、缺失缓存路径：0。
- 全量语义审计 high risk：0。

## 后续

继续按 P0 backlog 处理仍为 SVG fallback 的品牌商品；来源无法核验时保留 fallback，不使用相近商品冒充。
