# FOOD_IMAGE_REAL_PHOTO_TARGET_V2

## 1. 目标

本目标文件用于把当前食物图片体系继续推进到下面这个状态：

1. 用户搜索品牌商品、便利店单品、连锁餐饮单品时，搜索结果图尽量与具体食物一一对应。
2. 优先使用品牌官方公开素材、品牌官方公开渠道可长期留档的商品图。
3. 如果找不到稳定可用的官方图，就降级为与商品高度接近的真实照片。
4. 所有新增真实图在接入前都必须统一分辨率、角度、裁切、背景，不能把杂乱截图直接扔进系统。
5. 不能再出现“一堆不同商品连续共用同一张图”的强感知问题。
6. 网页端、移动端、小程序端继续统一使用后端 `image_key` 作为唯一图片口径。

本轮最终验收口径：

1. 用户搜索品牌商品时，结果图明显更像真实商品库，而不是一堆手绘图或同图反复复用。
2. 图片与食物文字基本对应，不再出现明显串图。
3. 三端结果一致。
4. 流程可持续，后续能按同样方法继续补库。

## 2. 本轮重点

本轮不是去追求 `744` 条食物一次性全部变成“一物一张官方图”。

本轮重点是先把用户感知最强的问题解决：

1. 品牌商品搜索结果中的重复图。
2. 明显不是真实商品图的手绘占位图。
3. 同品牌不同商品还在共用近似模板图的问题。
4. 便利店饭团、三明治、便当、咖啡奶茶、快餐单品这些强商品感品类。

同时把后续不会卡住的执行规则补齐：

1. 先看运行态，不只看 `foods.json`。
2. 先做高价值批次，不一上来全库铺开。
3. 官方图找不到时必须降级推进。
4. 每批都要闭环到同步、测试、视觉验证和台账更新。

## 3. 不做的事

1. 不删除用户数据。
2. 不重置数据库。
3. 不做 destructive 操作。
4. 不整体前端改版。
5. 不推翻现有网页端、移动端、小程序端结构。
6. 不把图片二进制写进数据库。
7. 不依赖运行时外链图片。
8. 不接外部 AI。
9. 不接第三方营养 API。
10. 不为了追数量把明显错误的图硬塞进系统。

## 4. 硬性规则

### 4.1 单一口径

1. 后端 `image_key` 是三端唯一权威口径。
2. 图片正式文件名必须与 `image_key` 完全一致。
3. 图片正式文件统一存放在：

```text
A:\body-food-images
```

4. 网页端、移动端、小程序端都只读取本地静态图片资源。
5. 新增真实图后必须同步：
   - `frontend/assets/foods/`
   - `miniprogram/assets/foods/`
   - `frontend/assets/foods/food-image-assets.js`
   - `miniprogram/utils/foodImageAssets.js`

### 4.2 来源优先级

每个 `image_key` 必须标记 `source_tier`，优先级固定如下：

1. `official_public`
   - 品牌官网公开产品页
   - 品牌官网公开菜单页
   - 品牌官方公开商品图
   - 品牌官方公开宣传图中可稳定裁出的商品图
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
2. 超过合理时间没有稳定来源，立刻降级到 `official_channel_like`。
3. 再不行降级到 `near_product_photo`。
4. 实在没有才保留 `local_illustration`。
5. 不允许为了等一张完美官方图把整批卡住。

### 4.3 复用限制

1. 不允许跨品牌复用同一张图。
2. 不允许跨大类复用同一张图。
3. 不允许把明显是 A 商品的图用于 B 商品。
4. 已经拆出独立 `image_key` 的品牌商品，原则上必须独立找图。
5. 只有在下面条件同时满足时，才允许临时复用：
   - 本质上是同一商品
   - 外观几乎一致
   - 用户搜索时不会误判成另一个商品
6. 不允许让一张图长期覆盖一串不同口味、不同包装、不同核心形态的商品。

### 4.4 运行态优先

后续执行不能只看静态种子，必须优先看当前 `/food/search` 实际返回结果。

固定顺序：

1. 先跑运行态搜索。
2. 锁定当前前 3 到 5 项真实显示的 `image_key`。
3. 再为这些 key 找图。
4. 再同步三端。
5. 再做视觉验证。

原因：

1. 用户真正看到的是当前运行态结果。
2. 数据库运行态和静态种子可能存在偏差。
3. 目标是先修用户当前会看到的问题。

### 4.5 审计顺序

这两个脚本不能并行跑：

1. `scripts/audit_food_images.py`
2. `scripts/build_food_photo_backlog.py`

固定顺序必须是：

1. 先跑 `scripts/audit_food_images.py`
2. 再跑 `scripts/build_food_photo_backlog.py`

## 5. 图片标准化规则

所有新增真实图都必须处理后再接入。

### 5.1 输出标准

1. 画布：`1200x1200`
2. 格式：优先 `webp`
3. 文件名：`image_key.webp`
4. 正式目录：`A:\body-food-images`

### 5.2 视觉标准

1. 背景：
   - 优先纯白或接近纯白的浅灰白
   - 不允许杂乱背景直接入库
2. 主体占比：
   - 约 `75% - 85%`
3. 角度：
   - 瓶、罐、杯装：正面或轻微 `3/4` 角
   - 汉堡、炸鸡、饭团、便当、披萨、三明治、甜品：轻微 `3/4` 角
4. 裁切：
   - 不切断主体
   - 不保留过大留白
5. 清晰度：
   - 模糊图不入库
6. 风格：
   - 优先商品库风格
   - 不要混成抓拍图库风格

### 5.3 源图缓存规则

如果源图有防盗链、Referer 限制、未来可能失效，允许先缓存到本地。

缓存目录：

```text
reports/candidate_images
```

台账中必须记录：

1. `source_url`
2. `source_domain`
3. `source_referer`
4. `source_cache_path`

## 6. 台账与文档要求

必须持续维护：

1. `reports/food_photo_source_ledger.csv`
2. `reports/food_real_photo_backlog.csv`
3. `reports/food_real_photo_batch*.md`
4. `reports/visual_food_image_check.json`

### 6.1 来源台账字段

沿用当前台账并补齐下面字段：

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

### 6.2 status 规则

固定使用：

1. `collected`
2. `normalized`
3. `synced`
4. `verified`
5. `fallback_only`
6. `blocked`

### 6.3 blocked 的边界

只有满足下面条件之一，才允许写 `blocked`：

1. 官方公开素材无法稳定获取。
2. 近似真实图也没有可接受来源。
3. 当前找到的图存在明显版权、清晰度、背景或语义问题，暂时不应上线。

即使某项 `blocked`，也不能阻塞同批其它项继续推进。

## 7. 优先级与推进范围

### 7.1 P0：必须先做的品牌组

1. 星巴克
2. 瑞幸
3. 红牛及高频功能饮料
4. 霸王茶姬
5. 麦当劳
6. KFC
7. 必胜客
8. 7-11
9. 罗森
10. 全家

### 7.2 P1：便利店扩展组

1. 饭团
2. 三明治
3. 便当
4. 沙拉鸡胸肉
5. 咖啡
6. 酸奶
7. 关东煮高频项

### 7.3 P2：连锁餐饮扩展组

1. 汉堡
2. 鸡翅
3. 原味鸡
4. 蛋挞
5. 苹果派
6. 披萨
7. 咖啡
8. 茶饮

### 7.4 P3：普通成品菜与基础食材

这一层不是要求全部找到品牌官方商品图，而是要求：

1. 图片与文字语义对应。
2. 不同核心形态尽量不要继续共用宽泛图。
3. 高频搜索项逐步从宽泛图拆细到更具体的真实食物照片。

## 8. 单批执行流程

每一批都必须走完整闭环，不允许只做“找图”不做“接入验证”。

### 第一步：先读基线

开始前先读：

1. `FOOD_IMAGE_REAL_PHOTO_TARGET_V2.md`
2. `reports/food_photo_source_ledger.csv`
3. `reports/food_real_photo_backlog.csv`
4. 最近一份 `reports/food_real_photo_batch*.md`

### 第二步：锁定运行态高价值项

先用实际运行态搜索，锁定当前用户真实会看到的项。

建议优先查这些关键词：

1. `瑞幸 生椰`
2. `瑞幸 厚乳`
3. `星巴克 星冰乐`
4. `星巴克 香草拿铁`
5. `红牛`
6. `711 饭团`
7. `罗森 饭团`
8. `全家 饭团`
9. `全家 三明治`
10. `麦当劳 双吉`
11. `麦当劳 苹果派`
12. `KFC 鸡翅`
13. `肯德基 蛋挞`
14. `必胜客 披萨`
15. `霸王茶姬 伯牙`

执行要求：

1. 每个关键词只锁定前 `3` 到 `5` 项。
2. 优先处理当前仍是拟真图、重复图、模板图的项。

### 第三步：更新来源台账

每个待处理 `image_key` 先写台账，再继续。

至少写清：

1. 对应商品名
2. 品牌
3. 来源层级
4. 来源网址
5. 是否需要 Referer
6. 是否已缓存源图
7. 当前状态

### 第四步：找图与降级

固定顺序：

1. 找 `official_public`
2. 找不到找 `official_channel_like`
3. 再不行找 `near_product_photo`
4. 实在没有保留 `local_illustration`

禁止事项：

1. 为了等完美官方图把整批停住
2. 拿明显不匹配的图顶上去
3. 跨品牌复用
4. 用一张图长期覆盖多个差异明显的单品

### 第五步：标准化处理

优先复用现有处理脚本：

```powershell
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\prepare_food_photo_assets.py --only-key <image_key>
```

多 key 时重复追加 `--only-key`。

### 第六步：同步三端

固定执行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\sync_food_photo_assets.ps1
docker cp frontend/. health_frontend:/usr/share/nginx/html/
docker restart health_frontend
```

如果这批涉及后端图片键、兼容映射、测试数据更新，再同步后端：

```powershell
docker cp backend/app/. health_backend:/app/app/
docker restart health_backend
```

### 第七步：处理缓存版本

如果 manifest 已变化，必须检查 `frontend/index.html` 中：

```text
/assets/foods/food-image-assets.js?v=...
```

版本串是否需要递增，否则运行页可能继续读旧 manifest。

### 第八步：静态检查与测试

每批至少执行：

```powershell
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check frontend\app.js
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check frontend\assets\foods\food-image-assets.js
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check miniprogram\utils\foodImageAssets.js
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check scripts\visual_food_image_check.cjs
docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q
powershell -ExecutionPolicy Bypass -File scripts\check_runtime.ps1
```

### 第九步：视觉验证

必须至少做一次桌面端视觉验证和一次移动端视觉验证。

执行参考：

```powershell
$env:NODE_PATH='C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules;C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\node_modules'
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\visual_food_image_check.cjs
```

至少覆盖：

1. `瑞幸 生椰`
2. `星巴克 星冰乐`
3. `红牛`
4. `711 饭团`
5. `罗森 饭团`
6. `麦当劳 双吉`
7. `KFC 鸡翅`
8. `必胜客 披萨`
9. `霸王茶姬 伯牙`

### 第十步：刷新审计与 backlog

固定顺序：

```powershell
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\audit_food_images.py
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\build_food_photo_backlog.py
```

### 第十一步：写批次总结

每批至少写一份：

```text
reports/food_real_photo_batchX_summary.md
```

必须写清：

1. 本批补了哪些品牌和单品
2. 替换了哪些 `image_key`
3. 哪些是 `official_public`
4. 哪些是 `official_channel_like`
5. 哪些是 `near_product_photo`
6. 哪些仍是 `fallback_only`
7. 跑了哪些验证
8. 哪些页面或功能确认正常

## 9. 防卡住规则

### 9.1 单 key 时间盒

1. 单个 `image_key` 找官方图超过 `15` 分钟仍无稳定结果，必须降级。
2. 降级后继续推进，不要反复卡在同一来源。

### 9.2 单品牌时间盒

1. 同一品牌一批累计超过 `45` 分钟仍推进缓慢，就先收口已完成项。
2. 转下一品牌或下一组 key，避免整批停住。

### 9.3 单批规模限制

1. 每批只做 `3` 到 `8` 个 `image_key`。
2. 每批必须完成同步和验证后，才能开下一批。

### 9.4 小程序阻塞规避

如果微信开发者工具当前不方便联调：

1. 不以此阻塞整批。
2. 先保证 `miniprogram/assets/foods` 和 `miniprogram/utils/foodImageAssets.js` 已同步。
3. 先保证三端代码口径一致。
4. 把小程序视觉实测列为当批待补验证项。

### 9.5 旧图排查顺序

如果代码已改但页面仍显示旧图，按这个顺序排查：

1. `frontend/assets/foods/food-image-assets.js` 是否已更新
2. `frontend/index.html` 的版本串是否已更新
3. `health_frontend` 是否已同步并重启
4. 浏览器缓存是否仍命中旧文件

## 10. 建议执行顺序

为了尽量快出可见结果，建议目标模式按下面顺序推进：

### 批次 A：麦当劳与 KFC 当前高感知缺口

优先项：

1. 麦当劳当前搜索前排仍是拟真图的高频单品
2. KFC 鸡翅、蛋挞、原味鸡相关剩余高频项

### 批次 B：便利店高频项

优先项：

1. 7-11 饭团剩余高频项
2. 罗森 饭团剩余高频项
3. 全家 饭团、三明治、便当剩余高频项

### 批次 C：茶饮和咖啡尾项

优先项：

1. 霸王茶姬剩余项
2. 瑞幸剩余项
3. 星巴克剩余项
4. 红牛及功能饮料扩展项

### 批次 D：普通成品菜高复用语义图拆细

目标：

1. 逐步减少宽泛图覆盖过多条目的情况
2. 让普通食物也逐步从“同一张图”过渡到“更具体的真实照片”

## 11. 完成标准

满足下面条件即可验收：

1. 新增若干批真实商品图，并已真正进入运行时显示。
2. 高价值品牌搜索结果中，明显减少同图或近同图。
3. 图片与食物文字语义能对上。
4. 三端都继续使用同一套 `image_key`。
5. 每批都有台账、同步、测试、视觉验证和总结。
6. 未完成项已进入 backlog，下一轮可直接接着做。

## 12. 目标模式要求

待会开启目标模式时，要求必须写清楚：

1. 不要停在讨论层，直接执行。
2. 先读本文件和当前台账，再开始做。
3. 优先看当前运行态搜索结果，不要只看 `foods.json`。
4. 官方公开素材优先，但找不到时不准卡住，必须按降级策略继续推进。
5. 每一批都必须完成：
   - 来源台账更新
   - 图片标准化
   - 三端同步
   - 测试与视觉验证
   - backlog 与 summary 更新
6. 不要整体前端改版。
7. 不要删除用户数据。
8. 不要重置数据库。
9. 不要做 destructive 操作。
10. 不要泄漏密码、token、cookie、密钥。
11. 不要把 `audit_food_images.py` 和 `build_food_photo_backlog.py` 并行跑。
12. 完成每批后都要汇报：
   - 补了哪些品牌和单品
   - 替换了哪些 `image_key`
   - 哪些仍是近似图或拟真图
   - 跑了哪些验证
   - 哪些功能确认正常

## 13. 可直接复制的目标模式提示词

```text
/goal 按 C:\Users\admin\Documents\Codex\2026-06-22\docker-docker\work\body-nas-deploy-final-v2\FOOD_IMAGE_REAL_PHOTO_TARGET_V2.md 直接执行，不要停在讨论层。

目标：
继续把食物图片系统从拟真图和重复图，升级为尽量真实、尽量与具体食物对应的图片系统。品牌商品、便利店单品、连锁餐饮单品优先使用品牌官方公开素材；找不到稳定官方图时，按 official_public -> official_channel_like -> near_product_photo -> local_illustration 顺序降级，但必须继续推进，不能被单张图卡住。新增真实图接入前必须统一分辨率、角度、裁切、背景。真实图片正式文件统一放到 A:\body-food-images，三端继续统一使用后端 image_key 作为唯一图片口径。

执行要求：
1. 先读目标文件，再读 reports/food_photo_source_ledger.csv、reports/food_real_photo_backlog.csv、最近一份 food_real_photo_batch 总结。
2. 先看当前 /food/search 的真实搜索结果，锁定前 3 到 5 个用户当前真会看到的 image_key，不要只看 foods.json。
3. 按小批次推进，每批只做 3 到 8 个 image_key，做完必须闭环。
4. 每个 image_key 必须先更新来源台账，再找图、标准化、同步三端、跑测试、做视觉验证。
5. 图片来源优先级固定为 official_public -> official_channel_like -> near_product_photo -> local_illustration。
6. 不要因为一个品牌或一个商品找不到完美官方图而卡住整批。
7. 不要整体前端改版，不要删除用户数据，不要重置数据库，不要做 destructive 操作，不接外部 AI，不接第三方营养 API。
8. 每一批完成后必须执行 scripts/sync_food_photo_assets.ps1，同步 frontend 运行容器，必要时同步 backend，并检查 frontend/index.html 中的 food-image-assets.js 版本串。
9. 每一批完成后必须运行静态检查、test_food_image_keys.py、check_runtime.ps1、visual_food_image_check.cjs。
10. 运行 scripts/audit_food_images.py 和 scripts/build_food_photo_backlog.py 时必须串行，不要并行。

建议起步顺序：
第一批先做当前麦当劳与 KFC 搜索前排仍是拟真图的高频项；
第二批做 7-11 / 罗森 / 全家 剩余高频便利店单品；
第三批做 霸王茶姬、瑞幸、星巴克、红牛剩余高频项；
第四批继续拆细普通成品菜的高复用语义图。

最终验收：
功能完成即可。重点是用户搜索品牌商品、便利店单品、连锁餐饮单品时，结果图与食物文字能对应，真实感明显提升，不再一堆同图，三端口径一致，而且后续可以按同一流程继续补库。
```
