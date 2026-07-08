# 食物图片官方公开素材执行目标文件

## 1. 目标

本目标文件用于把当前食物图片体系继续推进到下面这个状态：

1. 用户搜索品牌商品、便利店单品、连锁餐饮单品时，结果图尽量与具体食物一一对应。
2. 优先使用品牌官方公开素材那种商品图。
3. 找不到稳定可用的官方公开素材时，允许使用与商品高度接近的真实照片，但必须先统一分辨率、角度、裁切、背景再入库。
4. 不再出现“一堆不同商品反复共用同一张图”的强感知问题。
5. 网页端、移动端、小程序端继续统一使用后端 `image_key` 作为唯一图片口径。
6. 图片继续走本地静态资源，不依赖运行时外链。

最终验收口径只有一条：

当用户搜索品牌商品时，结果图明显更像真实商品库，图片与食物文字基本对应，三端口径一致，后续还能按同一流程持续补库。

## 2. 当前已确认基线

以当前仓库和最新已验证报告为准：

1. 总食物数：`744`
2. 总 `image_key` 数：`606`
3. 本地真实图 `image_key` 数：`45`
4. 本地拟真兜底图 `image_key` 数：`561`
5. 当前待补 backlog：`423` 条数据行
6. 正式真实图目录：`A:\body-food-images`
7. 三端 manifest 已存在：
   - `frontend/assets/foods/food-image-assets.js`
   - `miniprogram/utils/foodImageAssets.js`
8. 同步链路已存在：
   - `scripts/sync_food_photo_assets.ps1`
9. 审计与验证链路已存在：
   - `scripts/audit_food_images.py`
   - `scripts/build_food_photo_backlog.py`
   - `scripts/visual_food_image_check.cjs`
   - `scripts/check_runtime.ps1`
   - `backend/tests/test_food_image_keys.py`
10. 最近一批已闭环验证到运行态的罗森单品包括：
   - `lawson-523`
   - `lawson-616`
   - `lawson-231`

本轮不是重做机制，而是在现有机制上持续补“官方公开素材优先”的真实商品图库。

## 3. 本轮不做的事

1. 不删除用户数据。
2. 不重置数据库。
3. 不做 destructive 操作。
4. 不整体前端改版。
5. 不推翻当前网页端、移动端、小程序端结构。
6. 不把图片二进制写进数据库。
7. 不依赖运行时外链图片。
8. 不接外部 AI。
9. 不接第三方营养 API。
10. 不为了追数量把明显不匹配的图硬塞进系统。

## 4. 硬性规则

### 4.1 单一口径

1. 后端 `image_key` 是三端唯一权威口径。
2. 正式图片文件名必须与 `image_key` 完全一致。
3. 正式真实图统一存放于：

```text
A:\body-food-images
```

4. 网页端、移动端、小程序端都只能读取本地静态图片资源。
5. 任意新增真实图后，必须同步：
   - `frontend/assets/foods/`
   - `miniprogram/assets/foods/`
   - `frontend/assets/foods/food-image-assets.js`
   - `miniprogram/utils/foodImageAssets.js`

### 4.2 图片来源优先级

每个 `image_key` 必须标记 `source_tier`，优先级固定如下：

1. `official_public`
   - 品牌官网公开产品页
   - 品牌官网公开菜单页
   - 品牌公开 CDN 商品图
   - 品牌官方公开宣传物料中可稳定裁出的单品图
2. `official_channel_like`
   - 品牌官方公开社媒图
   - 品牌官方公开活动页图
   - 品牌官方公开电商图
   - 品牌官方公开新闻稿或文章图中可稳定裁出的商品图
3. `near_product_photo`
   - 非官方但与商品外观、包装、杯型、主色、主体形态高度接近的真实照片
4. `local_illustration`
   - 本地拟真图兜底

执行要求：

1. 先尝试 `official_public`。
2. 找不到稳定来源时，立刻降级到 `official_channel_like`。
3. 再不行降级到 `near_product_photo`。
4. 实在没有才继续保留 `local_illustration`。
5. 不允许为了等一张完美官方图把整批卡住。

### 4.3 复用限制

1. 不允许跨品牌复用同一张图。
2. 不允许跨大类复用同一张图。
3. 不允许把明显是 A 商品的图用于 B 商品。
4. 已经拆出独立 `image_key` 的品牌商品，原则上必须独立找图。
5. 只有同时满足下面条件，才允许临时复用：
   - 本质上是同一商品
   - 外观几乎一致
   - 用户搜索时不会误判成另一个商品
6. 不允许让一张图长期覆盖一串不同口味、不同包装、不同核心形态的商品。

### 4.4 运行态优先

后续执行不能只看静态种子，必须优先看当前 `/food/search` 实际返回结果。

固定顺序：

1. 先跑运行态搜索。
2. 锁定当前前 `3` 到 `8` 项真实显示的 `image_key`。
3. 再为这些 key 找图。
4. 再同步三端。
5. 再做视觉验证。

### 4.5 小批次闭环

1. 每批只做 `3` 到 `8` 个 `image_key`。
2. 每批必须完成素材收集、标准化、同步、测试、视觉验证、台账更新、backlog 更新后再开下一批。
3. 不允许无限扩批导致验证失控。

## 5. 为什么这样做

当前真正的问题不是“图片键还没拆”，而是“很多拆开的商品仍然看起来像同一类图”。

本轮的重点必须放在：

1. 用户当前会搜到的品牌商品。
2. 用户当前运行态会看到的前几项结果。
3. 官方公开素材优先。
4. 找不到时不要卡死，要按降级规则继续交付。
5. 即使降级，也要保持统一的商品图库观感。

## 6. 执行大纲

### 阶段一：锁定当前高价值运行态条目

先对当前用户高感知关键词做运行态搜索，优先看前几项结果：

1. `711 饭团`
2. `711 三明治`
3. `711 鸡胸肉`
4. `罗森 饭团`
5. `罗森 鸡胸肉`
6. `全家 饭团`
7. `全家 三明治`
8. `全家 鸡胸肉`
9. `瑞幸`
10. `星巴克`
11. `红牛`
12. `麦当劳`
13. `KFC`
14. `必胜客`
15. `霸王茶姬`

目标不是一次全做完，而是先锁定本批最值得补的 `image_key`。

### 阶段二：给每个候选 key 找来源

每个候选 `image_key` 都必须先建台账，再开始收图。

台账文件：

```text
reports/food_photo_source_ledger.csv
```

至少包含：

1. `image_key`
2. `food_name`
3. `brand`
4. `source_tier`
5. `source_url`
6. `source_domain`
7. `captured_at`
8. `local_filename`
9. `normalized`
10. `status`
11. `notes`

### 阶段三：统一做图

所有新增真实图必须统一处理后再入库。

输出标准：

1. 画布：`1200x1200`
2. 格式：优先 `webp`
3. 文件名：`image_key.webp`
4. 主体占比：约 `75% - 85%`
5. 背景：纯白或接近纯白的浅灰白
6. 角度：
   - 瓶、罐、杯装：正面或轻微 `3/4` 角
   - 汉堡、炸鸡、饭团、便当、三明治、披萨、甜品：轻微 `3/4` 角
7. 裁切：
   - 不切断主体
   - 不保留过大留白
   - 不保留杂乱背景
8. 清晰度：
   - 模糊图不入库
9. 风格：
   - 优先商品库风格
   - 不要混成抓拍图库风格

### 阶段四：同步三端

正式图进入 `A:\body-food-images` 后，必须同步到三端静态资源和 manifest。

同步要求：

1. 先运行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\sync_food_photo_assets.ps1
```

2. 如果整目录 `docker cp` 不稳定，不要硬顶，改用定向复制需要变更的文件和本批新增图片。
3. 修改前端可见资源后，确保运行容器拿到最新文件。

### 阶段五：验证闭环

每批至少做以下验证：

1. 静态检查

```powershell
node --check frontend\assets\foods\food-image-assets.js
node --check miniprogram\utils\foodImageAssets.js
node --check scripts\visual_food_image_check.cjs
```

2. 后端图片键测试

```powershell
docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q
```

3. 运行态健康检查

```powershell
powershell -ExecutionPolicy Bypass -File scripts\check_runtime.ps1
```

4. 视觉验证
   - 桌面端搜索验证
   - 移动端搜索验证
   - 小程序端至少确认资源映射已同步

5. 审计与 backlog 更新

```powershell
python scripts\audit_food_images.py
python scripts\build_food_photo_backlog.py
```

注意：

1. `scripts/audit_food_images.py` 和 `scripts/build_food_photo_backlog.py` 必须串行跑。
2. `scripts/prepare_food_photo_assets.py` 和 `scripts/sync_food_photo_assets.ps1` 不要并行跑。

### 阶段六：批次总结

每批完成后都必须产出：

1. 本批替换了哪些 `image_key`
2. 每个 key 的 `source_tier`
3. 哪些是 `official_public`
4. 哪些是 `official_channel_like`
5. 哪些是 `near_product_photo`
6. 哪些仍保留 `local_illustration`
7. 跑了哪些验证
8. 哪些搜索词已经明显改善
9. 哪些高价值 key 还在 backlog

建议文件：

```text
reports/food_real_photo_batch*.md
```

## 7. 具体卡点处理规则

### 7.1 官方素材难找时怎么办

不要在一个商品上耗太久。

建议时间预算：

1. `official_public` 搜索不超过 `15` 分钟
2. 如果明显只有拼图海报、低清图、错口味图，立即降级
3. 降级后优先选 `official_channel_like`
4. 再不行就选 `near_product_photo`
5. 仍找不到，再保留 `local_illustration`，但必须保留独立 `image_key` 并写进 backlog

### 7.2 哪些图不要直接入库

除非没有更好选择，否则不要直接用：

1. 多商品拼图海报
2. 大面积文案覆盖图
3. 强水印图
4. 人手持商品的宣传照
5. 主体过小的图
6. 模糊、过曝、噪点重的图

### 7.3 哪些情况算 blocked

只有满足下面任一情况，才允许标记 `blocked`：

1. 官方公开素材无法稳定获取
2. 近似真实图也没有可接受来源
3. 当前能找到的图都存在明显语义错误
4. 当前图存在严重版权、清晰度、背景问题，处理后仍不可用

即使 `blocked`，也不能阻塞整批，必须继续推进下一个 `image_key`。

## 8. 推荐执行顺序

为了减少卡住概率，优先按“运行态可见 + 官方来源相对容易 + 用户感知强”的组合推进。

建议下一阶段按下面顺序做：

1. 先补当前运行态已经明确可见但仍未闭环的便利店单品
   - `familymart-226`
   - `familymart-417`
   - `711-612`
   - `711-686`
2. 再补品牌饮品中仍不是官方公开图的单品
3. 再补搜索量高但图风格仍偏拟真的餐饮单品
4. 最后再推进普通泛食物的近似真实图库

判断原则：

1. 先做用户马上能搜到的问题
2. 先做能稳定形成成果的一批
3. 不要上来就啃全量最难品牌

## 9. 本轮交付物

本目标执行后，至少要交付下面这些东西：

1. 更新后的真实图片资产
2. 更新后的三端 manifest
3. 更新后的 `reports/food_photo_source_ledger.csv`
4. 更新后的 `reports/food_real_photo_backlog.csv`
5. 更新后的审计摘要
6. 更新后的视觉验证结果
7. 本轮批次总结文档

## 10. 验收标准

满足下面这些，就算本轮达标：

1. 用户搜索品牌商品时，不再大面积看到同图复用。
2. 图片与具体食物文字基本对应。
3. 新增真实图优先来自官方公开素材或官方公开渠道可稳定落地的图。
4. 找不到官方图时，近似真实图也经过统一处理，不是杂乱拼凑。
5. 三端继续使用同一套后端 `image_key`。
6. 每批都有台账、验证、backlog 更新，不是只改图不留记录。
7. 搜索、登录、记录、首页、报告等现有功能不被破坏。

## 11. 目标模式执行要求

后面开启目标模式时，必须按下面要求执行：

1. 不要停在讨论层，直接执行。
2. 先读本文件，再看当前 ledger、backlog、批次总结。
3. 每次只做一个小批次，完成后必须闭环验证。
4. 不要凭感觉猜图，先看运行态 `/food/search` 返回的 `image_key`。
5. 优先官方公开素材，找不到就按降级规则继续，不准卡死。
6. 不要改数据库结构，不要改业务接口，不要删数据。
7. 不要整体前端改版。
8. 有风险前先说明，但不要因为低风险步骤反复停下来问。
9. 每批完成后必须汇报：
   - 替换了哪些 `image_key`
   - 各自来源层级
   - 跑了哪些验证
   - 哪些搜索词已改善
   - 哪些仍待补

## 12. 可直接复制的目标模式提示词

```text
/goal 按 FOOD_IMAGE_OFFICIAL_REAL_ASSET_EXECUTION_TARGET.md 直接执行食物图片官方公开素材补库，不要停在讨论层。目标是让用户搜索品牌商品、便利店单品、连锁餐饮单品时，结果图尽量与具体食物一一对应，并优先使用品牌官方公开素材那种商品图；如果找不到稳定可用的官方公开素材，就降级为与商品高度接近的真实照片，但必须先统一分辨率、角度、裁切、背景后再接入。正式真实图统一存放在 A:\body-food-images，后端 image_key 继续作为三端唯一主口径。执行时先看运行态 /food/search 返回的真实 image_key，再按小批次推进，每批只做 3 到 8 个 key，必须完成来源台账、图片标准化、三端同步、测试、运行态检查、视觉验证、审计更新、backlog 更新和批次总结，再开下一批。不要删除用户数据，不要重置数据库，不要做 destructive 操作，不要整体前端改版，不要破坏网页端、移动端、小程序端现有功能，不要接外部 AI，不要接第三方营养 API。优先从当前运行态高价值且仍未闭环的 711、罗森、全家、瑞幸、星巴克、红牛、麦当劳、KFC、必胜客、霸王茶姬等搜索词开始，先修用户马上能搜到的问题。完成后必须汇报本轮补了哪些品牌和单品、替换了哪些 image_key、各自 source_tier、哪些仍是近似真实图或拟真图、跑了哪些验证、哪些功能确认正常、哪些高价值 key 还在 backlog。
```
