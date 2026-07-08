# 当前进展整理（食物真实图片替换）

最后整理时间：2026-07-08

当前主目标文件：

- `FOOD_IMAGE_REAL_PHOTO_EXECUTION_TARGET.md`

## 1. 已完成事项

### 1.1 已完成并正式收口的批次

已完成并已有报告/验证产物的批次：

- `batch28`
  - `familymart-416` `全家 奥尔良鸡肉卷`
  - `lawson-420` `罗森 日式照烧鸡腿便当`
- `batch29`
  - `familymart-520` `全家 黑椒牛肉便当`
  - `lawson-691` `罗森 咖喱鸡排便当`

对应报告文件已存在：

- `reports/food_real_photo_batch29_summary.md`
- `reports/batch29_visual_check.json`
- `reports/batch29_desktop_check.png`
- `reports/batch29_mobile_check.png`
- `reports/batch28_visual_check.json`

### 1.2 已落实的资源与映射规则

已经确认并实际在项目里使用：

- 真实图片统一存放到 `A:\body-food-images`
- 三端统一通过后端 `image_key` 取图
- 网页端映射文件：
  - `frontend/assets/foods/food-image-assets.js`
- 小程序端映射文件：
  - `miniprogram/utils/foodImageAssets.js`
- 来源台账文件：
  - `reports/food_photo_source_ledger.csv`
- backlog 清单文件：
  - `reports/food_real_photo_backlog.csv`
- 当前图片审计汇总：
  - `reports/food_image_audit_summary.md`

### 1.3 当前已做但尚未正式收口的 batch30

下面两项已经完成了资源生成和映射接入，但**还没做完最终收口**：

1. `familymart-229` `全家 鸡肉卷`
2. `lawson-618` `罗森 烤肠`

当前已落实到代码/资源中的证据：

- `frontend/assets/foods/food-image-assets.js`
  - `familymart-229 -> familymart-229.webp`
  - `lawson-618 -> lawson-618.webp`
- `miniprogram/utils/foodImageAssets.js`
  - `familymart-229 -> familymart-229.webp`
  - `lawson-618 -> lawson-618.webp`
- `backend/tests/test_food_image_keys.py`
  - 已补：
    - `全家 鸡肉卷 -> familymart-229`
    - `罗森 烤肠 -> lawson-618`
- 本地真实图片已存在：
  - `A:\body-food-images\familymart-229.webp`
  - `A:\body-food-images\lawson-618.webp`
- 前端/小程序资源目录也已有：
  - `frontend/assets/foods/familymart-229.webp`
  - `frontend/assets/foods/lawson-618.webp`
  - `miniprogram/assets/foods/familymart-229.webp`
  - `miniprogram/assets/foods/lawson-618.webp`
- 前端 cache bust 已切到 batch30：
  - `frontend/index.html`
  - 当前版本串：`20260708-realphoto-batch30`

### 1.4 当前正式审计口径

以 `reports/food_image_audit_summary.md` 和 `reports/food_real_photo_backlog.csv` 为准，当前正式口径是：

- 总食物：`744`
- 总图片键：`606`
- 已是本地真实图：`97`
- 仍是本地插画 fallback：`509`
- 当前 backlog：`371`

注意：

- `familymart-229`
- `lawson-618`

虽然已经做进资源和映射，但由于**还没有完成最终视觉验证 + 串行刷新 audit/backlog**，所以在当前正式口径里仍然算“未收口”。

## 2. 关键决策

### 2.1 总体策略

- 目标不是一次把 `744` 个食物全部换成官方图。
- 当前优先级是：
  - 品牌商品
  - 连锁餐厅单品
  - 便利店饭团/便当/卷类
  - 咖啡/饮料/能量饮料
- 重点是让用户搜索品牌商品时，不再出现一堆相同图或明显错误图。

### 2.2 图片来源优先级

已确定并要继续坚持：

1. `official_public`
2. `official_channel_like`
3. `near_product_photo`
4. `local_illustration`

也就是说：

- 能拿品牌官方公开素材，优先官方
- 官方公开素材难拿时，可以退到“高度接近商品图的真实照片”
- 但不能为了凑数，继续让大量不同商品共用同一张明显不对应的图

### 2.3 三端统一原则

- 网页端、移动端、小程序端都继续使用同一套 `image_key`
- 不允许一端是新图，另一端还是旧图
- 映射变更后必须同步更新：
  - `frontend/assets/foods/food-image-assets.js`
  - `miniprogram/utils/foodImageAssets.js`

### 2.4 真实图片存放原则

- 真实图片主存放位置固定为：`A:\body-food-images`
- 项目运行时只读取本地静态资源
- 不在运行时依赖外链图片

### 2.5 执行顺序必须串行

这条非常重要，已经踩过坑：

**不要并行执行下面这些步骤。**

必须串行：

1. 修改 ledger / 映射
2. 生成或准备图片资源
3. 必要时把 `A:\body-food-images` 里的 `.webp` 复制到项目资源目录
4. 执行 `scripts/sync_food_photo_assets.ps1`
5. 定向同步到运行中的前端容器
6. 重启前端容器
7. 检查前端容器里 manifest 和静态资源
8. 做桌面端/移动端实机验证
9. 跑 `scripts/audit_food_images.py`
10. 跑 `scripts/build_food_photo_backlog.py`

不要把这些并行跑，否则会出现：

- manifest 还是旧值
- `.webp` 明明生成了但容器还在读 `.svg`
- backlog 统计没刷新

### 2.6 容器同步原则

- 优先定向 `docker cp`
- 不要无脑整目录覆盖同步
- 前端改动后要重启 `health_frontend`

### 2.7 收口标准

某张图只有在下面都完成后，才算正式“补完”：

1. `A:\body-food-images` 有真实图
2. 网页端映射已改
3. 小程序端映射已改
4. 前端容器已经拿到新资源
5. 桌面端实机搜索可见正确图
6. 移动端实机搜索可见正确图
7. `audit` 和 `backlog` 已串行刷新
8. 对应批次报告已写完

## 3. 当前未完成待办

### 3.1 batch30 还没正式收口

当前最直接待办：

1. 完成 `familymart-229` `全家 鸡肉卷` 的桌面端实机验证
2. 完成 `lawson-618` `罗森 烤肠` 的桌面端实机验证
3. 完成上面两项的移动端实机验证
4. 生成并保存：
   - `reports/batch30_visual_check.json`
   - `reports/batch30_desktop_check.png`
   - `reports/batch30_mobile_check.png`
5. 新建：
   - `reports/food_real_photo_batch30_summary.md`
6. 串行刷新：
   - `scripts/audit_food_images.py`
   - `scripts/build_food_photo_backlog.py`

如果 batch30 收口成功，预期正式口径会从：

- 真实图 `97`
- fallback `509`
- backlog `371`

变为大致：

- 真实图 `99`
- fallback `507`
- backlog `369`

### 3.2 下一批优先项（P0）

batch30 收口后，优先继续做这些 P0：

- `711-517` `7-11 黑椒牛肉便当`
- `711-687` `7-11 黑椒鸡扒便当`

如果这两项官方或近商品图难拿，也可以转去做更容易收集素材的 P0：

- `luckin-624` `瑞幸 冰美式 标准杯`
- `luckin-625` `瑞幸 橙C美式 标准杯`
- `luckin-679` `瑞幸 茉莉轻乳茶 标准杯`

### 3.3 当前正式未完成数量

按当前 backlog 口径，仍未完成：

- `371` 个 image_key

其中当前最重要的是 P0 未完成项，重点品牌仍包括：

- `7-11`
- `全家`
- `罗森`
- `瑞幸`
- `麦当劳`
- `肯德基`
- `必胜客`

## 4. 新开对话时建议直接说的话

新开对话后，建议直接给 Codex 这样的指令：

```text
先读根目录 progress.md 和 FOOD_IMAGE_REAL_PHOTO_EXECUTION_TARGET.md，然后继续执行。

当前先不要重做分析，直接从 batch30 收口开始：
1. 完成 familymart-229 全家 鸡肉卷 与 lawson-618 罗森 烤肠 的桌面端/移动端实机验证
2. 生成 batch30_visual_check.json、batch30_desktop_check.png、batch30_mobile_check.png
3. 写 food_real_photo_batch30_summary.md
4. 串行刷新 audit 和 backlog
5. 汇报刷新后的真实图数量、fallback 数量、backlog 数量
6. 若 batch30 收口成功，再继续下一批 P0

注意：
- 不要并行跑 prepare/sync/audit/backlog
- 不要做 destructive 操作
- 不要重置数据库
- 不要改动无关前端结构
- 三端继续统一用 image_key
```

## 5. 这份进展文件的用途

这份文件的作用是：

- 帮新对话快速接力
- 避免重新讨论已经确认过的策略
- 避免把“已做资源但未正式收口”和“正式已完成”混为一谈

