# FOOD_IMAGE_REAL_PRODUCT_ASSET_EXECUTION_PLAN

## 1. 目标

本目标文件用于继续推进当前食物图片治理，重点不是做前端改版，而是把“用户搜索食物时看到的图片”尽量改成与食物一一对应的真实商品图体系。

本轮核心目标只有一条：

- 当用户搜索品牌商品、便利店单品、咖啡奶茶、能量饮料、汉堡、炸鸡、披萨、饭团、三明治、便当等高感知食物时，结果图不要再大量重复，不要一堆同图，不要图文不符。

执行原则：

1. 优先使用品牌官方公开素材、品牌官网公开商品页、品牌公开菜单页、品牌官方公开活动页中可稳定留档的真实商品图。
2. 如果官方公开素材拿不到，允许降级到与商品外观高度接近的真实照片。
3. 即使使用近似真实图，也必须先统一分辨率、角度、裁切、主体占比、背景，再接入系统。
4. 所有真实图片统一本地保存到 `A:\body-food-images`。
5. 后端 `image_key` 继续作为网页端、移动端、小程序端的唯一图片口径。

最终验收口径：

- 搜索品牌商品时，图片明显更像真实商品库。
- 结果图与食物文字能对应上。
- 三端口径一致。
- 后续还能按同一流程继续补库，不依赖临时手工救火。

## 2. 本轮不做的事

1. 不删除用户数据。
2. 不重置数据库。
3. 不做 destructive 操作。
4. 不整体前端改版。
5. 不推翻当前网页端、移动端、小程序端结构。
6. 不把图片二进制写进数据库。
7. 不在运行时依赖外链图片。
8. 不接外部 AI。
9. 不接第三方营养 API。
10. 不为了追数量，把明显不匹配的图硬塞进系统。

## 3. 硬性要求

### 3.1 单一主口径

1. 后端 `image_key` 是三端唯一主口径。
2. 正式图片文件名必须等于 `image_key`，例如 `lawson-523.webp`。
3. 所有真实图正式文件统一放在 `A:\body-food-images`。
4. 三端只能读取本地静态资源，不依赖外链。

### 3.2 来源优先级

每个 `image_key` 必须标记 `source_tier`，固定顺序如下：

1. `official_public`
   - 品牌官网公开商品页
   - 品牌官网公开菜单页
   - 品牌官网公开宣传页中可稳定截取的商品图
   - 品牌官方公开素材页
2. `official_channel_like`
   - 品牌官方公开电商页
   - 品牌官方公开社媒页
   - 品牌官方公开新闻稿、活动页中的商品图
3. `near_product_photo`
   - 非官方但与外观、包装、杯型、颜色、主成分高度接近的真实照片
4. `local_illustration`
   - 当前本地拟真图兜底

固定规则：

1. 先找 `official_public`。
2. 超过合理时间仍拿不到稳定可用图，立刻降级。
3. 降级顺序只能是：
   - `official_public`
   - `official_channel_like`
   - `near_product_photo`
   - `local_illustration`
4. 不能因为某一个商品卡住整批任务。

### 3.3 禁止一图多品的边界

1. 不允许跨品牌复用同一张图。
2. 不允许跨大类复用同一张图。
3. 不允许把明显是 A 商品的图顶给 B 商品。
4. 已经拆出独立 `image_key` 的品牌商品，原则上必须单独找图。
5. 只有在“本质同一商品、外观几乎一致、用户不会误判”的情况下，才允许有限复用。

### 3.4 防卡住规则

1. 目标不是一次把 744 条全部补成官方图。
2. 目标是先把用户真实会搜、真实会看到、重复感最强的结果改掉。
3. 某个 `image_key` 一时拿不到官方公开图，不得阻塞当前批次交付。
4. 允许先落到 `near_product_photo`，但必须记录到台账。
5. 如果连可接受的近似真实图都没有，先保留 `local_illustration`，并明确标成 `fallback_only` 或 `blocked`。

## 4. 本轮执行总纲

### 阶段一：确认当前基线

先读并确认以下文件，不要跳过：

1. `FOOD_IMAGE_REAL_PHOTO_EXECUTION_TARGET.md`
2. `reports/food_photo_source_ledger.csv`
3. `reports/food_real_photo_backlog.csv`
4. `reports/food_image_refinement_summary.md`
5. 最近一份 `reports/food_real_photo_batch*.md`

目标：

1. 确认当前已经有哪些 `image_key` 是真实图。
2. 确认哪些高价值品牌仍在用 SVG 或重复图。
3. 确认当前 backlog 顶部优先项。
4. 如果 PowerShell 里中文 Markdown 出现乱码，先切换 UTF-8 再读取，不要基于乱码内容继续执行。

### 阶段二：按运行态锁定高价值 key

不要只看静态 `foods.json`。必须以运行态搜索结果为准。

固定先查这些词，并记录前 3 到 5 个结果的真实 `image_key`：

1. `M记 双吉`
2. `麦当劳 双吉`
3. `KFC 鸡排`
4. `711 饭团`
5. `罗森 饭团`
6. `罗森 鸡胸肉`
7. `全家 饭团`
8. `瑞幸 生椰`
9. `星巴克 星冰乐`
10. `霸王茶姬 伯牙`
11. `必胜客 披萨`
12. `红牛`

做法：

1. 直接调用运行中的 `/food/search`。
2. 记录每个关键词前几项对应的 `image_key`、食品名、当前图类型。
3. 只优先处理用户现在能直接看到的结果。

### 阶段三：建立批次候选

每一批只处理 5 到 10 个 `image_key`，不要铺太大。

优先顺序固定如下：

1. 星巴克
2. 瑞幸
3. 红牛及功能饮料
4. 711
5. 罗森
6. 全家
7. 麦当劳
8. KFC
9. 必胜客
10. 霸王茶姬

每批选入标准：

1. 运行态搜索靠前。
2. 当前仍是 SVG 或明显重复图。
3. 用户感知强。
4. 容易形成一物一图收益。

### 阶段四：找图与降级

每个 `image_key` 固定按下面流程走：

1. 先找 `official_public`
2. 找不到再找 `official_channel_like`
3. 再找 `near_product_photo`
4. 还没有再保留 `local_illustration`

必须记录：

1. `source_url`
2. `source_domain`
3. `source_referer`
4. `source_cache_path`
5. `source_tier`
6. `status`
7. `notes`

说明：

1. 有防盗链、临时页、懒加载时，可以先缓存到 `reports/candidate_images`。
2. 如果某品牌官网难抓，不要反复耗死在单页上，按降级规则继续推进。
3. 对同一品牌内部，要优先保证“不同商品不是同一张图”。

### 阶段五：统一标准化处理

所有新图必须先标准化，再入库。

固定输出标准：

1. 画布：`1200x1200`
2. 格式：优先 `webp`
3. 文件名：`image_key.webp`
4. 正式目录：`A:\body-food-images`

固定视觉标准：

1. 背景优先纯白或接近纯白的浅灰白。
2. 主体居中。
3. 主体占比约 `75% - 85%`。
4. 饮料、杯装、瓶罐商品优先正面或轻微 3/4 角度。
5. 汉堡、炸鸡、饭团、三明治、披萨、便当优先轻微 3/4 角度。
6. 不允许模糊严重、主体被裁断、背景杂乱直接入库。
7. 不允许有的商品横图、有的竖图、有的裁很紧、有的留白过大。

处理要求：

1. 不拉伸主体。
2. 不做廉价滤镜。
3. 不过度锐化。
4. 统一商品库风格，优先干净、稳定、可识别。

### 阶段六：接入三端

必须复用现有链路：

1. `scripts/prepare_food_photo_assets.py`
2. `scripts/sync_food_photo_assets.ps1`
3. `frontend/assets/foods/food-image-assets.js`
4. `miniprogram/utils/foodImageAssets.js`

执行要求：

1. 先更新 `reports/food_photo_source_ledger.csv`
2. 再运行 `scripts/prepare_food_photo_assets.py`
3. 再运行 `scripts/sync_food_photo_assets.ps1`
4. 再检查前端和小程序 manifest 是否已更新

串行限制：

1. 不要并行跑 `scripts/audit_food_images.py` 和 `scripts/build_food_photo_backlog.py`
2. 不要并行跑 `scripts/prepare_food_photo_assets.py` 和 `scripts/sync_food_photo_assets.ps1`

容器同步要求：

1. Windows 下 `docker cp frontend/. ...` 失败概率高。
2. 默认改用定向复制：
   - `frontend/index.html`
   - `frontend/assets/foods/food-image-assets.js`
   - 本批新增的 `.webp`
3. 同步后重启 `health_frontend`

### 阶段七：验证

每一批完成后必须验证，不允许只改代码不验。

最少验证集：

1. `node --check frontend\\app.js`
2. `node --check frontend\\assets\\foods\\food-image-assets.js`
3. `node --check miniprogram\\utils\\foodImageAssets.js`
4. `node --check scripts\\visual_food_image_check.cjs`
5. 后端图片键测试
6. `powershell -ExecutionPolicy Bypass -File scripts\\check_runtime.ps1`
7. 运行视觉检查脚本，产出：
   - `reports/visual_food_image_check.json`
   - 桌面端截图
   - 移动端截图

验证重点：

1. 新图是否真正命中运行态搜索结果。
2. 是否还是同图重复。
3. 图文是否匹配。
4. 网页端和移动端是否一致。
5. 小程序 manifest 是否跟上。
6. `/health`、`/food/search`、`/dashboard/summary` 是否正常。

### 阶段八：回写台账和总结

每批完成后必须回写：

1. `reports/food_photo_source_ledger.csv`
2. `reports/food_real_photo_backlog.csv`
3. `reports/food_image_refinement_summary.md`
4. `reports/food_real_photo_batchX_summary.md`

批次总结必须写清楚：

1. 本批补了哪些品牌和单品。
2. 替换了哪些 `image_key`。
3. 哪些是 `official_public`。
4. 哪些是 `official_channel_like`。
5. 哪些是 `near_product_photo`。
6. 哪些仍然是 `local_illustration`。
7. 跑了哪些验证。
8. 哪些搜索结果确认已改善。

## 5. 详细交付要求

### 5.1 每批最低交付

一批任务不算完成，除非同时满足：

1. 至少完成 5 个真实图替换，或明确完成一个品牌组的小闭环。
2. 台账已更新。
3. 真实文件已进入 `A:\body-food-images`。
4. 三端静态资源已同步。
5. 运行态已验证。
6. 批次总结已写。

### 5.2 blocked 的使用边界

只有以下情况才允许标 `blocked`：

1. 官方公开素材无法稳定获取。
2. 近似真实图也没有可接受来源。
3. 找到的图存在明显版权、清晰度、背景、语义错误风险。

即使有 `blocked` 项，也不能阻塞整批任务继续推进。

### 5.3 关于“整个数据库都要应用”的落实方式

这句话不能理解成“一次做完 744 条”。正确做法是：

1. 先把品牌商品和高频商品做成一物一图。
2. 再逐步压缩普通通用图的复用范围。
3. 最终把“同图覆盖一堆不相干食物”的问题不断收窄。
4. 每一轮都以 backlog 和审计报告推进下一批，而不是重新从头人工翻。

## 6. 本轮建议优先优化点

本轮新目标模式启动后，优先优化这些地方：

1. 罗森、711、全家饭团与便当类继续拆细到更具体图片。
2. 星巴克、瑞幸、霸王茶姬把仍是手绘或近似重复的杯型商品继续替换。
3. 红牛及功能饮料优先争取官方公开商品图；拿不到时用外观高度接近图并统一白底。
4. 麦当劳、KFC、必胜客把用户高频搜索前几项先做成独立真实图。
5. 继续减少一个品牌组里多个商品共用一张图的情况。
6. 继续提高 `reports/food_image_refinement_summary.md` 中真实图占比。

## 7. 目标模式执行要求

你待会开目标模式时，执行者必须遵守下面这些要求：

1. 不要停在讨论层，直接落地。
2. 先读本文件，再读当前台账和 backlog。
3. 每批必须形成闭环，不准只找图不接入、不验证。
4. 不要因为某个品牌官网难抓就停住。
5. 必须严格执行来源分级和降级策略。
6. 必须用运行态搜索结果选 key，不要只看静态种子文件。
7. 必须同步三端。
8. 必须跑视觉验证。
9. 必须写批次总结。
10. 不要做无关重构。
11. 如果 PowerShell 读取中文文档乱码，先显式设置 UTF-8 再继续，不要基于乱码文本执行。

## 8. 直接可用的目标模式提示词

```text
/goal 按 C:\Users\admin\Documents\Codex\2026-06-22\docker-docker\work\body-nas-deploy-final-v2\FOOD_IMAGE_REAL_PRODUCT_ASSET_EXECUTION_PLAN.md 直接执行，不要停在讨论层。

目标：继续把食物数据库里的品牌商品、高频商品、便利店单品、咖啡奶茶、能量饮料、汉堡炸鸡披萨饭团等搜索结果图，逐步替换为与食物对应的真实商品图体系。优先使用品牌官方公开素材、品牌官网公开商品页、品牌官方公开菜单页；如果找不到稳定可用的官方公开素材，就降级为与商品外观高度接近的真实照片，但必须统一分辨率、角度、裁切、主体占比和背景后再接入。真实图片统一存到 A:\body-food-images，后端 image_key 继续作为网页端、移动端、小程序端唯一图片口径。

执行要求：
1. 先读目标文件，再读 FOOD_IMAGE_REAL_PHOTO_EXECUTION_TARGET.md、reports/food_photo_source_ledger.csv、reports/food_real_photo_backlog.csv、reports/food_image_refinement_summary.md、最近一份 reports/food_real_photo_batch*.md。
2. 先以运行态 /food/search 结果为准，锁定高价值关键词前 3 到 5 个结果的真实 image_key，再决定本批要补哪些 key。
3. 每批只处理 5 到 10 个 image_key，优先做星巴克、瑞幸、红牛、711、罗森、全家、麦当劳、KFC、必胜客、霸王茶姬这些高感知品牌组。
4. 每个 image_key 必须按 official_public -> official_channel_like -> near_product_photo -> local_illustration 的顺序找图，不要因为单个商品卡住整批任务。
5. 必须把 source_url、source_domain、source_referer、source_cache_path、source_tier、status、notes 记录进 reports/food_photo_source_ledger.csv。
6. 所有新图必须先标准化成 1200x1200、优先 webp、主体居中、主体占比约 75% 到 85%、背景统一白底或近白底，再正式写入 A:\body-food-images。
7. 必须复用 scripts/prepare_food_photo_assets.py、scripts/sync_food_photo_assets.ps1、scripts/audit_food_images.py、scripts/build_food_photo_backlog.py、scripts/visual_food_image_check.cjs，不要另起一套流程。
8. 不要并行跑 audit_food_images.py 和 build_food_photo_backlog.py，不要并行跑 prepare_food_photo_assets.py 和 sync_food_photo_assets.ps1。
9. Windows 下如果 docker cp frontend/. 失败，就改用定向复制 frontend/index.html、frontend/assets/foods/food-image-assets.js 和本批新增 webp，再重启 health_frontend。
10. 每批完成后必须跑语法检查、后端图片键测试、scripts/check_runtime.ps1、视觉检查脚本，并确认新图已经命中网页端、移动端、小程序端口径。
11. 每批完成后必须写 batch 总结，明确本批替换了哪些 image_key、哪些是官方公开图、哪些是近似真实图、哪些仍然 blocked 或 fallback_only。
12. 不要删除用户数据，不要重置数据库，不要整体前端改版，不要做无关重构，不要泄漏任何真实密钥或凭据。

验收口径：搜索品牌商品时，不再是一堆同图；图片和食物文字能对应；三端口径一致；真实图片占比持续提升；流程可持续批量推进。
```

## 9. 你待会开启目标模式前，最好再补这一句

如果你想让执行更顺，可以在目标提示词后面再补一句：

```text
先从当前 backlog 顶部和运行态最明显重复图的品牌组开始，优先做能形成闭环的小批次，不要贪大，不要卡在单个品牌官网页面上。
```
