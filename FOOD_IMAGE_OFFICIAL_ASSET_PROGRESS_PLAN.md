# 食物图片官方素材与真实商品图目标进度方案

## 1. 这份文件的用途

这份文件不是讨论稿，是下一轮目标模式直接执行的底稿。

目标只有一条：

- 把当前食物图片体系继续推进到“用户搜索品牌商品、高频便利店单品、连锁餐饮单品时，结果图尽量与食物文字一一对应，优先走品牌官方公开素材；找不到稳定可用的官方公开素材时，就降级为与商品高度接近的真实照片，并统一处理后再接入”的状态。

## 2. 最终目标

最终验收口径只有一条：

- 当用户搜索瑞幸、星巴克、红牛、东鹏、711、罗森、全家、麦当劳、KFC、必胜客、霸王茶姬等品牌词，或搜索饭团、三明治、便当、汉堡、炸鸡、披萨、咖啡、奶茶、能量饮料、关东煮等高频商品时，搜索结果不再是一堆重复感很强的图，而是图片和食物文字基本对应，真实感明显提升，网页端、移动端、小程序端口径一致。

补充约束：

1. 这轮目标不是一次性把 `744` 条食物全部做成一物一张官方图。
2. 这轮目标是先把用户真实会搜到、真实会看到、重复感最强、品牌感最强的结果做实。
3. 但治理规则必须能持续覆盖整个数据库，而不是只修几个热点词。

## 3. 当前已验证基线

以下基线以仓库当前已落地文件和最近一轮已验证结果为准：

1. 总食物数：`744`
2. 总 `image_key` 数：`606`
3. 当前图片键总族数：`178`
4. 当前已接入本地真实图片的 `image_key`：`71`
5. 当前仍使用本地拟真图兜底的 `image_key`：`535`
6. 当前 backlog 行数：`397`
7. 正式真实图目录：`A:\body-food-images`
8. 三端 manifest 已存在：
   - `frontend/assets/foods/food-image-assets.js`
   - `miniprogram/utils/foodImageAssets.js`
9. 已有脚本链路：
   - `scripts/prepare_food_photo_assets.py`
   - `scripts/sync_food_photo_assets.ps1`
   - `scripts/audit_food_images.py`
   - `scripts/build_food_photo_backlog.py`
   - `scripts/visual_food_image_check.cjs`
   - `scripts/check_runtime.ps1`
   - `backend/tests/test_food_image_keys.py`
10. 当前 backlog 顶部仍有一批用户一眼能感知成“还不是商品图”的运行态高价值条目，例如：
   - `711-411` `7-11 照烧鸡腿便当`
   - `711-223` `7-11 茶叶蛋`
   - `711-222` `7-11 金枪鱼饭团`
   - `711-412` `7-11 鸡胸肉沙拉`
   - `711-517` `7-11 黑椒牛肉便当`

结论：

- 现在不是从零搭机制，而是在现有机制之上，把“官方公开素材优先、真实商品图优先、统一处理后接入”的流程继续往前推。

## 4. 本轮明确不做的事

1. 不删除用户数据。
2. 不重置数据库。
3. 不做 destructive 操作。
4. 不整体前端改版。
5. 不推翻现有网页端、移动端、小程序端结构。
6. 不把图片二进制写入数据库。
7. 不在运行时依赖外链图片。
8. 不接外部 AI。
9. 不接第三方营养 API。
10. 不为了追数量把明显不对应的图硬塞进系统。

## 5. 核心规则

### 5.1 单一口径

1. 后端 `image_key` 继续作为三端唯一图片主口径。
2. 图片文件名必须与 `image_key` 完全一致。
3. 正式真实图统一存放在：

```text
A:\body-food-images
```

4. 网页端、移动端、小程序端都只允许读取本地静态资源。
5. 每次接入新图，必须同时覆盖：
   - `frontend/assets/foods/`
   - `miniprogram/assets/foods/`
   - `frontend/assets/foods/food-image-assets.js`
   - `miniprogram/utils/foodImageAssets.js`

### 5.2 来源优先级固定

每个 `image_key` 都必须在台账中标记 `source_tier`，优先级固定如下：

1. `official_public`
   - 品牌官网公开产品页
   - 品牌官网公开菜单页
   - 品牌官网公开商品图
   - 品牌官方公开宣传物料中可稳定裁出的单品图
   - 品牌官方公开 PDF / 海报 / 文章页中可稳定裁出的单品图
2. `official_channel_like`
   - 品牌官方公开社媒图
   - 品牌官方公开电商图
   - 品牌官方公开活动页或渠道页中的商品图
   - 品牌公开 CDN 静态图或可稳定留档的官方渠道素材
3. `near_product_photo`
   - 非官方但与商品外观、包装、杯型、主色、主体形态高度接近的真实照片
4. `local_illustration`
   - 本地拟真图兜底

执行顺序固定为：

1. 先找 `official_public`
2. 超时后立刻降级 `official_channel_like`
3. 再不行降级 `near_product_photo`
4. 仍没有可接受真实来源，就临时保留 `local_illustration`
5. 不允许为了等一张完美官方图把整批卡死

### 5.3 复用限制

1. 不允许跨品牌复用同一张图。
2. 不允许跨大类复用同一张图。
3. 不允许把明显是 A 商品的图用于 B 商品。
4. 已经拆出独立 `image_key` 的品牌商品，原则上必须独立找图。
5. 只有下面情况允许复用：
   - 同一商品不同容量但包装几乎一致
   - 同一商品不同规格但视觉差异极小
   - 运行态多个条目实际对应同一商品

### 5.4 整个数据库都要逐步适用

1. 这套规则不是只给几个热门品牌用。
2. 整个数据库后续都要按“图与文字对应、语义正确优先”的规则推进。
3. 执行顺序上先做品牌商品和高频成品食物，再推进普通泛食物。
4. 对没有官方商品图概念的普通食物，也至少要做到：
   - 图片语义正确
   - 不与相邻食物串图
   - 不让一张图覆盖一堆本质不同的东西

## 6. 这轮会优化什么地方

这轮不是只补几张图，而是把下面这些地方一起做稳：

1. 搜索结果图和食物文字的对应关系。
2. 品牌商品的真实感和商品感。
3. 图片分辨率、角度、裁切、背景、主体占比的一致性。
4. 三端的图片口径一致性。
5. 图片来源台账的可追溯性。
6. backlog 的持续消化能力。
7. 每一批补图后的实际运行态验证，而不是只改仓库文件。

## 7. 目标大纲

1. 先读当前基线文件和最新批次总结，确认已做到了哪里。
2. 先看运行态 `/food/search`，锁定真正展示给用户的候选 `image_key`。
3. 按来源优先级找官方公开素材或近似真实图。
4. 统一做图，不能把原图直接扔进系统。
5. 同步三端静态资源和 manifest。
6. 跑测试、运行态检查、视觉验证。
7. 更新审计、backlog、批次总结，再开下一批。

## 8. 详细执行步骤和做法

### 阶段一：先确认基线，不凭记忆开工

开始执行时必须先读：

1. `FOOD_IMAGE_OFFICIAL_ASSET_PROGRESS_PLAN.md`
2. `FOOD_IMAGE_REAL_PHOTO_EXECUTION_TARGET.md`
3. `reports/food_photo_source_ledger.csv`
4. `reports/food_real_photo_backlog.csv`
5. `reports/food_image_refinement_summary.md`
6. 最近一份 `reports/food_real_photo_batch*.md`

要求：

1. 先确认当前真实图数量、fallback 数量、backlog 数量。
2. 先确认最近一批已经替换了哪些 `image_key`，避免重复劳动。
3. 先确认哪些脚本、manifest、测试已经存在，避免另起炉灶。

验收：

1. 能说清楚当前基线。
2. 能说清楚当前批次为什么从这些 key 开始。

### 阶段二：先看运行态结果，再锁定本批 key

固定先看当前运行态 `/food/search`，不要凭静态文件猜。

优先检查这些关键词：

1. `711 饭团`
2. `711 三明治`
3. `711 便当`
4. `711 茶叶蛋`
5. `罗森 饭团`
6. `全家 饭团`
7. `瑞幸 生椰`
8. `星巴克 星冰乐`
9. `红牛`
10. `东鹏`
11. `麦当劳 双吉`
12. `KFC 鸡排`
13. `必胜客 披萨`
14. `霸王茶姬 伯牙`

要求：

1. 每个词先记录前 `3` 到 `8` 项真实返回结果。
2. 记录每项的 `food_name`、`brand`、`image_key`、当前资产类型。
3. 本批只从运行态结果和 backlog 顶部 `P0/A` 项里选 key。
4. 每一批只允许做 `3` 到 `8` 个 `image_key`。

建议的默认起步顺序：

1. 当前运行态已可见、但仍是 SVG 的便利店高频单品。
2. 用户一眼就会问“为什么还不像商品图”的咖啡、能量饮料、奶茶品牌单品。
3. 再推进麦当劳、KFC、必胜客、霸王茶姬等品牌强感知组。

当前可作为下一批起点的候选项：

1. `711-411` `7-11 照烧鸡腿便当`
2. `711-223` `7-11 茶叶蛋`
3. `711-222` `7-11 金枪鱼饭团`
4. `711-412` `7-11 鸡胸肉沙拉`
5. `711-517` `7-11 黑椒牛肉便当`

验收：

1. 当前批次每个 `image_key` 都来自真实运行态或 backlog 顶部高价值项。
2. 能说清楚为什么先做这批，而不是泛扫全库。

### 阶段三：先记台账，再收图

台账文件固定为：

```text
reports/food_photo_source_ledger.csv
```

每个候选 `image_key` 必须至少记录：

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

要求：

1. 先记账，再收图。
2. 即使最后只能降级到 `near_product_photo`，也必须写清楚原因。
3. 如果确实找不到可接受真实来源，也要明确保留 `local_illustration` 的理由。

### 阶段四：来源搜集方法固定，避免乱搜

优先使用下面这些来源路径：

1. 官方官网公开产品页。
2. 官方官网公开菜单页。
3. 官方公开英文站、国际站、品牌资料页。
4. 官方公开活动页、文章页、海报页中可稳定裁出的单品图。
5. 品牌公开 CDN 静态图。
6. 官方公开社媒图、官方公开电商图。
7. 找不到以上来源时，再使用与商品高度接近的真实照片。

允许的取图方式：

1. 直接下载公开图片 URL。
2. 从公开页面稳定裁切商品区域。
3. 从官方公开页面截图后做商品裁切。
4. 把候选原图先缓存到本地，再做标准化处理。

不允许的做法：

1. 运行时继续依赖外链图片。
2. 使用明显模糊、严重压缩、角度混乱的图。
3. 用品牌 A 的带标签商品图去冒充品牌 B。
4. 因为某个站点 `403` 或 `Service unavailable` 就卡整批。

### 阶段五：固定降级和不停工规则

为避免目标模式卡住，必须写死下面这些规则：

1. 单个 `image_key` 搜 `official_public` 不超过 `15` 分钟。
2. 搜 `official_channel_like` 不超过 `10` 分钟。
3. 搜 `near_product_photo` 不超过 `10` 分钟。
4. 如果官方站点 `403`、超时、连接重置、页面脚本封锁、只返回占位页：
   - 立即记录到台账
   - 立刻降级，不要持续消耗时间
5. 如果已知官方公开图片 URL 可直接拿到，就允许直接走公开 URL 或公开页面裁切，不必强行反复打品牌首页。
6. 如果仍然没有可接受真实来源：
   - 保留独立 `image_key`
   - 暂时继续使用 `local_illustration`
   - 记入 backlog
   - 不阻塞整批继续推进

### 阶段六：统一做图，不能直接扔原图

所有新增真实图必须统一处理后再入库。

输出标准固定为：

1. 画布：`1200x1200`
2. 格式：优先 `webp`
3. 文件名：`image_key.webp`
4. 背景：纯白或接近纯白的浅灰白
5. 主体占比：约 `75% - 85%`
6. 角度规则：
   - 瓶、罐、杯装：正面或轻微 `3/4` 角
   - 饭团、三明治、汉堡、炸鸡、披萨、甜品、关东煮、便当：轻微 `3/4` 角
7. 裁切规则：
   - 不切断主体
   - 不保留大块杂乱背景
   - 不保留过大留白
8. 清晰度规则：
   - 明显模糊图不入库
9. 风格规则：
   - 尽量保持“商品库”观感
   - 不混成随手抓拍图库

### 阶段七：同步三端，避免“文件改了但系统没用上”

每次补图后，必须确认新资产真的进入系统：

1. 更新 `frontend/assets/foods/food-image-assets.js`
2. 更新 `miniprogram/utils/foodImageAssets.js`
3. 把正式图片同步到：
   - `frontend/assets/foods/`
   - `miniprogram/assets/foods/`
4. 前端改动后必须同步到运行中的前端容器并重启 `health_frontend`
5. 如果后端测试文件有变化，也要同步到 `health_backend` 再测
6. 不允许只改仓库文件，不验证运行中的系统是否真的用了新图

脚本串行要求写死：

1. `scripts/prepare_food_photo_assets.py` 和 `scripts/sync_food_photo_assets.ps1` 不能并行跑。
2. `scripts/audit_food_images.py` 和 `scripts/build_food_photo_backlog.py` 必须串行跑。

### 阶段八：每批必须做完整验证

每一批至少要做下面几类验证：

1. 语法/脚本检查
   - `node --check frontend/assets/foods/food-image-assets.js`
   - `node --check miniprogram/utils/foodImageAssets.js`
   - `node --check scripts/visual_food_image_check.cjs`
   - `python -m py_compile scripts/prepare_food_photo_assets.py backend/tests/test_food_image_keys.py`
2. 后端图片键测试
   - `docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q`
3. 运行状态检查
   - `powershell -ExecutionPolicy Bypass -File scripts/check_runtime.ps1`
4. 运行态资源验证
   - 新图片静态资源返回 `200`
   - `/food/search` 返回的目标 `image_key` 已切到新图
5. 视觉验证
   - 桌面端搜索截图
   - 移动端搜索截图
   - 条件允许时的小程序端抽检
6. 审计与 backlog 更新
   - `python scripts/audit_food_images.py`
   - `python scripts/build_food_photo_backlog.py`

### 阶段九：每批必须产出可追踪交付物

每批必须至少产出：

1. 新增真实图文件
2. 更新后的三端 manifest
3. 更新后的 `reports/food_photo_source_ledger.csv`
4. 更新后的 `reports/food_real_photo_backlog.csv`
5. 更新后的 `reports/food_image_refinement_summary.md`
6. 新的批次总结，例如：
   - `reports/food_real_photo_batch21_summary.md`
7. 新的视觉验证结果和截图
8. 本批替换成功的 `image_key` 清单
9. 本批仍保留 `near_product_photo` 的清单
10. 本批仍保留 `local_illustration` 的清单
11. 下一批建议优先项

## 9. 为了让目标模式顺利执行，必须避免这些卡点

1. 不要一上来试图扫完整个 `744` 条数据库。
2. 不要跳过运行态检查，只按静态文件挑 key。
3. 不要为了某个精确官方图长时间卡在被封的品牌站。
4. 不要补完仓库文件却不把运行中容器同步起来。
5. 不要一批做十几二十个 key，容易验证失控。
6. 不要只看“图片数量增加了”，而不看“图和文字是否对应”。

## 10. 本轮明确完成标准

满足下面这些，就算这轮目标达标：

1. 用户常搜品牌词的前几项结果，明显不再是一堆重复图。
2. 新接入图片大多为 `official_public`、`official_channel_like` 或可接受的 `near_product_photo`。
3. 所有新增真实图都经过统一处理，不是杂乱拼凑。
4. 三端继续使用同一套后端 `image_key`。
5. 每批都有台账、验证、backlog 更新和批次总结。
6. 运行中的网页端和移动端已经能看到新图，不只是仓库里改了文件。
7. 小程序端至少完成资源和 manifest 一致性同步；如果有联调环境，还要补实际页面抽检。

## 11. 目标模式执行要求

后面进入目标模式时，执行要求必须写清楚：

1. 先读本文件，再读基线文件和最新批次总结。
2. 不要停在讨论层，直接推进。
3. 先看当前运行态 `/food/search`，再决定本批 `image_key`。
4. 每批只做 `3` 到 `8` 个 key。
5. 优先官方公开素材，卡住就按规则降级，不要停工。
6. 每批都必须完整完成：
   - 运行态锁定
   - 来源台账
   - 图片标准化
   - 三端同步
   - 测试
   - 运行态检查
   - 视觉验证
   - 审计更新
   - backlog 更新
   - 批次总结
7. 不要删除用户数据，不要重置数据库，不要做 destructive 操作。
8. 不要整体前端改版，不要破坏网页端、移动端、小程序端现有功能。
9. 每批完成后必须明确汇报：
   - 补了哪些品牌和单品
   - 替换了哪些 `image_key`
   - 各自 `source_tier`
   - 哪些仍是 `near_product_photo`
   - 哪些仍是 `local_illustration`
   - 跑了哪些验证
   - 哪些功能确认正常
   - 哪些高价值 key 还在 backlog

## 12. 可直接使用的目标模式提示词

```text
/goal 按 FOOD_IMAGE_OFFICIAL_ASSET_PROGRESS_PLAN.md 直接执行食物图片官方素材与真实商品图优化，不要停在讨论层。目标是让用户搜索品牌商品、便利店单品、连锁餐饮单品、咖啡奶茶、能量饮料、饭团、三明治、便当、汉堡、炸鸡、披萨、关东煮等高频商品时，结果图尽量与具体食物一一对应，优先使用品牌官方公开素材；找不到稳定可用的官方公开素材时，降级使用与商品高度接近的真实照片，但必须先统一分辨率、角度、裁切、背景、主体占比后再接入。正式真实图统一存放在 A:\body-food-images，后端 image_key 继续作为三端唯一图片口径。执行时必须先读本文件、FOOD_IMAGE_REAL_PHOTO_EXECUTION_TARGET.md、reports/food_photo_source_ledger.csv、reports/food_real_photo_backlog.csv、reports/food_image_refinement_summary.md 和最近一份 reports/food_real_photo_batch*.md，确认当前基线；然后先看当前运行态 /food/search 返回的真实 image_key，再按小批次推进，每批只做 3 到 8 个 key，必须完整完成来源台账、图片标准化、三端同步、测试、运行态检查、视觉验证、审计更新、backlog 更新和批次总结，再开下一批。不要删除用户数据，不要重置数据库，不要做 destructive 操作，不要整体前端改版，不要破坏网页端、移动端、小程序端现有功能，不要接外部 AI，不要接第三方营养 API。优先从当前运行态高价值且仍未闭环的 711、罗森、全家、瑞幸、星巴克、红牛、东鹏、麦当劳、KFC、必胜客、霸王茶姬等结果开始，先修用户马上能看到的问题。完成后必须明确汇报补了哪些品牌和单品、替换了哪些 image_key、各自 source_tier、哪些仍是 near_product_photo 或 local_illustration、跑了哪些验证、哪些功能确认正常、哪些高价值 key 还在 backlog。
```

## 13. 你待会开目标模式前最好再补一句

为了让执行更顺，建议你在目标提示词后面再补这一句：

```text
优先修我当前运行态里用户一眼就能看出来还不像真实商品图的结果，不要为了追求完美官方图而卡住；只要官方站点封锁、403、资源难拿，就按规则立刻降级，但必须保证图片和食物文字对应，并且每批做完后马上完成运行态验证。
```
