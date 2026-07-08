# 食物图片官方真实商品图目标进度方案 V2

## 1. 目标

本目标文件用于继续推进当前食物图片系统，重点解决下面这件事：

当用户搜索品牌商品、便利店单品、连锁餐饮单品、咖啡茶饮、能量饮料、饭团、三明治、汉堡、炸鸡、披萨等食物时，搜索结果里的图片要尽量与具体食物一一对应，不再出现一堆不同商品却连续显示同图或近同图的情况。

本轮总目标不是一次性把全库 `744` 条食物都补成官方图，而是把高价值、高感知、高频搜索结果先做成可持续推进的真实商品图库流程。

最终验收口径：

1. 用户搜索高频品牌商品时，前几项结果图明显更像真实商品库。
2. 图片与文字基本对应，不再有明显串图、错图、同图泛滥。
3. 网页端、移动端、小程序端继续统一使用后端 `image_key`。
4. 整套补图流程可继续批量推进，不靠临时手工救火。

## 2. 当前基线

以当前仓库与最新报告为准：

1. 总食物数：`744`
2. 总 `image_key` 数：`606`
3. 语义图片族数：`178`
4. 当前已接入本地真实图片的 `image_key`：`63`
5. 当前仍使用本地拟真图兜底的 `image_key`：`543`
6. 当前真实图片本地目录：`A:\body-food-images`
7. 当前主台账：`reports/food_photo_source_ledger.csv`
8. 当前待补清单：`reports/food_real_photo_backlog.csv`
9. 当前图片总结：`reports/food_image_refinement_summary.md`
10. 当前已有批次总结：`reports/food_real_photo_batch*.md`

说明：

1. 现在不是从零开始，已有多批真实图已落地。
2. 当前重点不是重做机制，而是把真实商品图补图机制继续推进到更稳定、更可维护的状态。
3. 当前真实图覆盖仍偏少，用户对品牌商品搜索时的真实感提升还不够明显，这是本轮主要痛点。

## 3. 本轮明确不做的事

1. 不删除用户数据。
2. 不重置数据库。
3. 不执行 destructive 操作。
4. 不整体前端改版。
5. 不推翻现有网页端、移动端、小程序端结构。
6. 不接入外部 AI。
7. 不接入第三方营养 API。
8. 不在运行时依赖外链图片。
9. 不把图片二进制写进数据库。
10. 不为了追数量，把明显不相关的食物继续共用同一张图。

## 4. 硬性规则

### 4.1 单一口径

1. 后端 `image_key` 仍然是三端唯一权威口径。
2. 图片文件名必须与 `image_key` 完全一致。
3. 三端都从本地静态资源读取图片，不允许端间分叉。
4. 已经拆出独立 `image_key` 的商品，不允许再退回宽泛通用图。

### 4.2 图片来源优先级

每一张图都必须在台账中标注 `source_tier`，并严格按下面顺序选择：

1. `official_public`
   - 官网公开产品页
   - 官方公开菜单页
   - 官方公开商品详情页
   - 官方公开活动页中可稳定裁取的商品图
2. `official_channel_like`
   - 官方公开电商页
   - 官方公开社媒图
   - 官方公开新闻稿、公开渠道图、公开宣传页
3. `near_product_photo`
   - 非官方但与商品外观、包装、杯型、主视觉高度接近的真实照片
4. `local_illustration`
   - 本地拟真图兜底

执行规则：

1. 先尝试 `official_public`
2. 找不到就降级到 `official_channel_like`
3. 再不行使用 `near_product_photo`
4. 还不行才保留 `local_illustration`
5. 不允许因为一张官方图找不到就卡住整批任务

### 4.3 复用限制

1. 不允许跨品牌共用同一张真实图。
2. 不允许不同主形态商品共用同一张真实图。
3. 不允许拿别的品牌明确带标商品图硬顶当前品牌商品。
4. 只有满足下面情况才允许复用：
   - 同一商品不同规格
   - 同一商品不同容量但包装视觉基本一致
   - 同一商品在当前系统中本质就是同款不同录入名
5. 饭团、三明治、便当、咖啡、茶饮、汉堡、炸鸡、披萨、能量饮料这几类高感知商品，原则上都要尽量独立找图。

### 4.4 运行态优先

所有补图工作优先以当前运行态真实搜索结果为准，不凭静态文件猜。

固定流程：

1. 先跑当前 `/food/search`
2. 锁定用户此刻能搜到的前 `3` 到 `5` 个结果
3. 记录这些结果的 `name` 和 `image_key`
4. 只对这些运行态命中的结果找图、补图、验证

## 5. 真实图片统一标准

所有新增真实图都必须统一处理后再接入。

### 5.1 输出标准

1. 统一画布：`1200x1200`
2. 输出格式：优先 `webp`
3. 文件命名：`image_key.webp`
4. 存放目录：`A:\body-food-images`

### 5.2 视觉标准

1. 背景统一为纯白或接近纯白的浅灰白。
2. 主体居中。
3. 主体占比约 `75% - 85%`。
4. 不允许主体被切断。
5. 不允许明显糊图、脏背景、杂乱场景图直接入库。
6. 瓶、罐、杯装饮料优先正面或轻微 `3/4` 视角。
7. 饭团、三明治、便当、炸鸡、汉堡、披萨优先轻微 `3/4` 视角。
8. 同一批次内，角度、留白、裁切、背景尽量一致。

### 5.3 允许的降级策略

如果某品牌公开素材难找：

1. 优先找官方公开页面截图可裁出的商品图。
2. 如果官方页面图片防盗链或直链难取，允许本地截图后裁切，但必须在台账中记清来源页和抓取时间。
3. 如果连稳定官方截图都拿不到，就降级到 `near_product_photo`。
4. `near_product_photo` 必须满足“看起来像这个商品”，不能只满足“同大类”。
5. 实在找不到才保留 `local_illustration`，并标记 `fallback_only`。

## 6. 必须维护的文件

1. 目标文件：`FOOD_IMAGE_OFFICIAL_REAL_PHOTO_GOAL_V2.md`
2. 来源台账：`reports/food_photo_source_ledger.csv`
3. 待补清单：`reports/food_real_photo_backlog.csv`
4. 图片总结：`reports/food_image_refinement_summary.md`
5. 批次总结：`reports/food_real_photo_batch*.md`
6. 视觉验证结果：
   - `reports/visual_food_image_check.json`
   - `reports/visual_desktop_food_images.png`
   - `reports/visual_mobile_food_images.png`

## 7. 台账要求

每个新增或替换的 `image_key` 必须在 `reports/food_photo_source_ledger.csv` 中完整记录，至少包含：

1. `image_key`
2. `food_name`
3. `brand`
4. `source_tier`
5. `source_url`
6. `source_domain`
7. `captured_at`
8. `local_filename`
9. `background_mode`
10. `normalized`
11. `status`
12. `notes`
13. `source_referer`
14. `source_cache_path`

`status` 建议值：

1. `collected`
2. `normalized`
3. `synced`
4. `verified`
5. `fallback_only`
6. `blocked`

## 8. 执行大纲

### 阶段一：确认当前真实基线

先读下面文件并确认当前状态：

1. `reports/food_photo_source_ledger.csv`
2. `reports/food_real_photo_backlog.csv`
3. `reports/food_image_refinement_summary.md`
4. 最新 `reports/food_real_photo_batch*.md`

需要确认：

1. 当前真实图数量
2. 当前 backlog 数量
3. 当前优先品牌剩余待补项
4. 当前哪些品牌已经做过几批

### 阶段二：按运行态搜索锁定当前批次

不要直接泛扫全库，先按用户真实能搜到的词锁定当前批次。

建议优先验证这些关键词：

1. `瑞幸 生椰`
2. `星巴克 星冰乐`
3. `红牛`
4. `东鹏特饮`
5. `711 饭团`
6. `711 三明治`
7. `711 咖啡`
8. `罗森 饭团`
9. `全家 饭团`
10. `全家 三明治`
11. `麦当劳 双吉`
12. `KFC 鸡排`
13. `必胜客 披萨`
14. `霸王茶姬 伯牙`

每个关键词只锁定前 `3` 到 `5` 个结果，记录：

1. `food_name`
2. `image_key`
3. 当前图片是否仍是 `svg`
4. 当前是否已经有真实图

### 阶段三：按批次推进，不贪多

固定原则：

1. 一次只做 `3` 到 `8` 个 `image_key`
2. 每批必须完整闭环
3. 不做半批
4. 一批完成再进下一批

建议优先级：

1. `P0-A`：`711 / 罗森 / 全家` 便利店高频单品
2. `P0-B`：`瑞幸 / 星巴克 / 霸王茶姬` 饮品高频单品
3. `P0-C`：`红牛 / 东鹏` 能量饮料
4. `P0-D`：`麦当劳 / KFC / 必胜客` 连锁快餐高频单品
5. `P1`：其他高频品牌和用户点名项

### 阶段四：每个 image_key 的固定处理流程

每个 `image_key` 必须按下面顺序执行：

1. 先确认当前运行态结果确实命中该 `image_key`
2. 查找 `official_public`
3. 不行则查找 `official_channel_like`
4. 再不行使用 `near_product_photo`
5. 把来源先记入 `reports/food_photo_source_ledger.csv`
6. 准备原始素材或本地缓存素材
7. 统一标准化输出为 `A:\body-food-images\image_key.webp`
8. 同步到三端资源目录和 manifest
9. 做运行态验证
10. 更新 backlog 和批次总结

### 阶段五：统一化处理

继续复用现有脚本链路，不重造一套。

固定顺序：

1. 先准备来源台账
2. 再运行 `scripts/prepare_food_photo_assets.py`
3. 再运行 `scripts/sync_food_photo_assets.ps1`
4. 再同步运行中的前端容器
5. 再做视觉验证

注意：

1. `scripts/prepare_food_photo_assets.py` 和 `scripts/sync_food_photo_assets.ps1` 不要并行跑。
2. `scripts/audit_food_images.py` 和 `scripts/build_food_photo_backlog.py` 按顺序串行执行。
3. 如果 backlog 首次更新看起来异常，允许再重跑一次 `scripts/build_food_photo_backlog.py` 校正结果。

## 9. 详细做法

### 9.1 官方图优先的具体找法

优先检查：

1. 官网产品页
2. 官方菜单页
3. 官方活动页
4. 官方公开商城或公开电商页
5. 官方公开社媒或新闻稿

如果源图直链被拦：

1. 允许通过浏览器打开页面
2. 允许截图页面中的商品主图
3. 裁切成单商品图
4. 在台账记录页面地址、抓取时间、来源说明

### 9.2 近似真实图的具体要求

只有在官方公开素材拿不到时才允许使用。

必须满足：

1. 包装颜色接近
2. 杯型或容器接近
3. 主视觉接近
4. 主形态接近
5. 不带明显错误品牌标识

不允许：

1. 用另一品牌明确带标包装图硬顶
2. 用餐桌随手拍、背景脏乱图直接入库
3. 用完全不同口味、不同商品的图凑数

### 9.3 统一背景和风格的方法

每张图接入前都要做下面处理：

1. 去掉杂乱背景
2. 统一到浅白背景
3. 调整主体位置和留白
4. 控制主体比例
5. 输出到同一尺寸
6. 保证一批内风格接近

### 9.4 避免卡住的执行规则

为了让目标模式顺利推进，必须遵守：

1. 任何单个 `image_key` 找不到官方图，最多记录原因后立刻降级，不准拖住整批。
2. 任何单个品牌站点如果有 WAF 或防盗链，不准围着它长时间空转，允许转页面截图方案或降级。
3. 任何批次只要已经完成大部分 `image_key`，就先收尾同步和验证，不准为了补最后一张图无限拖延。
4. 小程序视觉实机如果当前环境不方便，也不能阻塞整批；先保证代码资产和 manifest 已同步，再在总结里标记剩余验证。
5. 如果页面仍显示旧图，优先排查缓存版本串、manifest、运行中容器同步，而不是怀疑图片逻辑本身。

## 10. 每批必须执行的验证

### 10.1 静态检查

```powershell
node --check frontend\app.js
node --check frontend\assets\foods\food-image-assets.js
node --check miniprogram\utils\foodImageAssets.js
node --check scripts\visual_food_image_check.cjs
```

### 10.2 后端图片键测试

```powershell
docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q
```

### 10.3 运行状态检查

```powershell
powershell -ExecutionPolicy Bypass -File scripts\check_runtime.ps1
```

### 10.4 视觉验证

```powershell
$env:NODE_PATH='C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules;C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\node_modules'
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\visual_food_image_check.cjs
```

必须核对：

1. `reports/visual_food_image_check.json`
2. `reports/visual_desktop_food_images.png`
3. `reports/visual_mobile_food_images.png`

### 10.5 运行态确认

每批至少确认：

1. 搜索结果中目标商品已经显示新图
2. `src` 指向新 `.webp`，不是旧 `svg`
3. 网页端桌面视图正常
4. 网页端移动视图正常
5. 小程序资源映射文件已同步
6. 登录、搜索、记录、首页、报告未被带坏

## 11. 每批交付物

每完成一批，必须交付：

1. 新增或替换后的 `A:\body-food-images\*.webp`
2. 更新后的 `reports/food_photo_source_ledger.csv`
3. 更新后的 `reports/food_real_photo_backlog.csv`
4. 更新后的 `reports/food_image_refinement_summary.md`
5. 新增一份批次总结 `reports/food_real_photo_batchXX_summary.md`
6. 更新后的 manifest
7. 新的视觉验证结果与截图

批次总结至少写清楚：

1. 本批处理了哪些品牌和单品
2. 对应哪些 `image_key`
3. 哪些是 `official_public`
4. 哪些是 `official_channel_like`
5. 哪些是 `near_product_photo`
6. 哪些仍为 `fallback_only`
7. 跑了哪些验证
8. 哪些功能确认正常

## 12. 本轮建议的大纲

### 第一部分：先补高感知便利店与饮品

1. `711`
2. `罗森`
3. `全家`
4. `瑞幸`
5. `星巴克`
6. `霸王茶姬`
7. `红牛`
8. `东鹏特饮`

目的：

1. 最快拉开用户感知差异
2. 先减少“搜出来都是一堆像模板图”的问题

### 第二部分：再补连锁餐饮单品

1. `麦当劳`
2. `KFC`
3. `必胜客`
4. 其他高频连锁品牌

目的：

1. 把用户高频搜索的汉堡、炸鸡、披萨、套餐类结果做得更像真实商品库

### 第三部分：整理剩余 backlog

1. 把已完成真实图的项从 backlog 移出
2. 把仍缺真实图的项分成：
   - 可继续找官方图
   - 只能先用近似真实图
   - 暂时 blocked

## 13. 目标模式执行要求

待会开目标模式时，要求必须写清楚下面这些点：

1. 不要停在讨论层，直接执行。
2. 先读本目标文件，再读 ledger、backlog、summary。
3. 优先按当前 `/food/search` 的真实结果锁定 `image_key`，不要只看 `foods.json`。
4. 每批只做少量 `image_key`，做完闭环再继续。
5. 官方公开素材优先，但找不到不准卡住，必须按 `official_channel_like -> near_product_photo -> local_illustration` 顺序降级。
6. 新图加入前必须统一分辨率、角度、裁切、背景。
7. 新图统一保存到 `A:\body-food-images`。
8. 每批都必须更新台账、同步三端、跑验证、写批次总结。
9. 不允许破坏现有登录、搜索、记录、首页、报告。
10. 不允许删除用户数据，不允许重置数据库，不允许 destructive 操作。

## 14. 可直接复制的目标模式提示词

```text
/goal 按 C:\Users\admin\Documents\Codex\2026-06-22\docker-docker\work\body-nas-deploy-final-v2\FOOD_IMAGE_OFFICIAL_REAL_PHOTO_GOAL_V2.md 直接执行，不要停在讨论层。

目标：
继续把食物图片从“很多 still 是拟真图、品牌商品搜索时真实感不够、不同商品还会出现同图或近同图”推进到“高频品牌商品搜索结果尽量与具体商品一一对应，优先使用品牌官方公开素材，实在找不到就使用与商品高度接近的真实照片，并统一分辨率、角度、裁切、背景后再接入”的状态。

硬性要求：
1. 不删除用户数据。
2. 不重置数据库。
3. 不做 destructive 操作。
4. 不整体前端改版。
5. 不推翻现有网页端、移动端、小程序端结构。
6. 后端 image_key 仍然是三端唯一口径。
7. 新图片统一保存到 A:\body-food-images。
8. 优先使用 official_public，其次 official_channel_like，再其次 near_product_photo，最后才允许 local_illustration。
9. 找不到官方图时不准卡住整批，必须降级继续推进。
10. 每批只做 3 到 8 个 image_key，做完一批再做下一批。
11. 每批都必须更新 reports/food_photo_source_ledger.csv、reports/food_real_photo_backlog.csv、reports/food_image_refinement_summary.md、reports/food_real_photo_batchXX_summary.md。
12. 每批都必须同步三端并做真实运行态验证。
13. 所有图片接入前必须统一为 1200x1200、统一背景、统一主体比例、统一裁切风格。
14. 优先按当前 /food/search 的真实结果锁定本批 image_key，不要只凭静态文件猜。
15. 不允许跨品牌硬复用同一张商品图。

执行顺序：
第一步：先读取目标文件、ledger、backlog、summary 和最新 batch summary，确认当前基线。
第二步：先跑运行态搜索，锁定当前批次高感知关键词前 3 到 5 项真实 image_key。
第三步：优先补 711、罗森、全家、瑞幸、星巴克、霸王茶姬、红牛、东鹏特饮这些高感知品牌，再推进麦当劳、KFC、必胜客。
第四步：每个 image_key 都要先找来源，再写入台账，再做标准化，再同步到三端。
第五步：每批都要跑静态检查、后端图片键测试、check_runtime、visual_food_image_check.cjs，并核对 reports 里的 json 和截图。
第六步：每批完成后都要更新 backlog 和总结，再继续下一批。

验收口径：
功能完成即可。重点是用户搜索品牌商品、便利店单品、连锁餐饮单品时，图片和文字能对应，真实感明显提升，不再是一堆同图或近同图，三端口径一致，而且后续还能继续按批次稳定补库。
```
