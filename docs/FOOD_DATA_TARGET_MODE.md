# 食物数据库与图片资产目标模式

## 1. 范围与边界

- 只处理 `backend/app/foods.json` 的食物数据质量、`image_key` 映射、图片资产和来源台账。
- 不修改数据库表结构、API 接口契约、前端业务流程或 Docker 架构。
- 不把图片二进制写入 PostgreSQL；运行时继续通过现有静态资源和 manifest 加载。

## 2. 目标状态（Definition of Done）

每个可展示食物必须满足：

1. 名称、品牌、系列、口味、规格与图片语义一致；不能用相近品牌或相近口味冒充。
2. `image_key` 在网页端和小程序端 manifest 中都存在，且实际文件可读。
3. 两端图片均为 750×750 WebP，单张不超过 300KB；同一 key 的 SHA-256 完全一致。
4. 商品图优先使用品牌官网、公开商品页或可核验的标准商品图；无法核验时保留 SVG fallback，并进入 backlog，不伪造来源。
5. 来源台账记录来源 URL、来源类型、抓取日期、缓存路径、处理状态和语义核验备注。

## 3. 优先级模式

- **P0**：高频品牌/连锁商品、用户点名商品、当前使用 SVG fallback 且容易误认的条目。
- **P1**：常见零售商品和菜品，优先补齐品牌与系列差异。
- **P2**：低频、季节性或暂时难以核验的条目。

同一优先级内按“搜索曝光频率 > 语义风险 > 来源可得性”排序。找不到可靠图片时不降低语义标准，维持 fallback 并记录原因。

## 4. 单批执行流程

### Step 1：盘点

- 从 `foods.json`、双端 manifest 和资源目录生成当前基线。
- 输出缺图、fallback、重复映射、语义高风险和来源缓存缺失清单。

验证：

```text
node scripts/build_food_asset_baseline.cjs
python scripts/audit_food_images.py
python scripts/build_food_photo_backlog.py
```

### Step 2：选源与建台账

- 每批选择 5–10 个同品牌或同类 key。
- 先记录来源，再下载到 `reports/candidate_images/` 或 `remote_cache/`。
- 台账必须有唯一 `image_key`；远程源必须有本地缓存路径，避免构建时依赖外网。

### Step 3：标准化

- 使用 `scripts/prepare_food_photo_assets.py` 生成 750×750 WebP。
- 输出到 `A:\body-food-images` 后分别复制到：
  - `frontend/assets/foods/`
  - `miniprogram/assets/foods/`
- 不删除旧 SVG；manifest 仅在 WebP 已通过门禁后优先指向 WebP。

### Step 4：门禁与抽检

必须全部通过：

```text
node scripts/validate_food_target_mode.cjs
python scripts/validate_food_source_cache.py
```

检查项：尺寸、大小、格式、双端 hash、manifest 覆盖、台账缓存路径。随后对本批和相邻高风险条目做图片语义抽检（品牌、口味、规格、包装是否一致）。

### Step 5：记录结果

- 更新 `reports/food_asset_normalization_report.json`、`food_asset_baseline.json`、`food_real_photo_backlog.csv`。
- 在批次报告中记录已完成 key、跳过 key、失败原因和下一批候选。
- 只有门禁通过且语义抽检无误，才将条目标记为 `done/verified`。

## 5. 质量门槛与停止条件

- 任一图片尺寸、大小、hash 或 manifest 检查失败：本批不交付，先修复再继续。
- 来源 403、登录墙、版权或语义不确定：停止该条目，保留 fallback 并记录，不使用猜测图。
- 发现具体名称被宽泛关键词命中：先修复映射优先级，再补图。
- Docker 不可用时可完成静态门禁和资源抽检，但必须明确标注未完成运行态 `/food/search` 与浏览器验证；不能声称全部通过。

## 6. 当前基线（2026-08-31）

- 食物记录：834
- 双端 manifest：841 / 841
- 双端实际资源：841 / 841
- 当前门禁 failures：0
- 图片审计 high risk：0
- 仍需真实商品图的 backlog：P0 83、P1 133、P2 123

下一执行批次优先处理 P0 中仍为 SVG fallback 的品牌官网商品；对无法核验的可爱多香草、麦当劳不素之霸等条目，不使用相近商品替代。
