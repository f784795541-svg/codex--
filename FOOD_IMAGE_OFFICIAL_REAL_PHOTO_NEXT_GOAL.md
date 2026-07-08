# 食物图片官方素材与真实商品图下一阶段目标文件

## 1. 目标

本目标文件用于把当前食物图片系统继续推进到下面这个结果：

1. 用户搜索品牌商品、便利店单品、连锁餐饮单品时，结果图尽量与具体食物一一对应。
2. 优先使用品牌官方公开素材或官方公开渠道可稳定留档的商品图。
3. 官方公开素材拿不到时，允许使用与商品高度接近的真实照片，但必须统一分辨率、角度、裁切、背景后再接入。
4. 不再出现“搜索一批不同商品，却连续出现一堆一样的图”这种强感知问题。
5. 三端继续统一使用后端 `image_key`，网页端、移动端、小程序端图片口径一致。

最终验收口径只有一条：

- 当用户搜索品牌商品和高频成品食物时，结果图明显更像真实商品库，且图片和文字能对应上。

## 2. 当前基线

以下内容以当前仓库和现有报告为准：

1. 总食物数：`744`
2. 总 `image_key` 数：`606`
3. 当前语义图片族数：`178`
4. 当前已接入本地真实图片的 `image_key`：`21`
5. 当前仍使用本地拟真图兜底的 `image_key`：`585`
6. 真实图片本地目录已存在：`A:\body-food-images`
7. 现有流水线已存在并应继续复用：
   - `scripts/prepare_food_photo_assets.py`
   - `scripts/sync_food_photo_assets.ps1`
   - `scripts/audit_food_images.py`
   - `scripts/build_food_photo_backlog.py`
   - `scripts/visual_food_image_check.cjs`
8. 现有台账与报告已存在并应继续维护：
   - `reports/food_photo_source_ledger.csv`
   - `reports/food_real_photo_backlog.csv`
   - `reports/food_real_photo_batch*.md`
   - `reports/visual_food_image_check.json`

## 3. 本轮明确不做的事

1. 不重置数据库
2. 不删除用户数据
3. 不整体改前端结构
4. 不推翻现有网页端、移动端、小程序端逻辑
5. 不接入外部 AI
6. 不在运行时依赖外链图片
7. 不把图片二进制写入数据库
8. 不为了追数量，把明显不相关的商品继续套同一张图

## 4. 硬性规则

### 4.1 单一口径

1. 后端 `image_key` 是唯一权威口径。
2. 图片文件名必须与 `image_key` 完全一致。
3. 三端都从本地静态资源取图，不允许端间分叉。

### 4.2 来源优先级

每张图必须在台账中标明 `source_tier`，优先级固定如下：

1. `official_public`
   - 官网公开产品页
   - 官方菜单页
   - 官方公开商品图
   - 官方公开活动页中可稳定裁取的商品图
2. `official_channel_like`
   - 官方公开电商页
   - 官方公开社媒/文章/公开渠道中的产品展示图
3. `near_product_photo`
   - 非官方但与商品包装、杯型、外观、主成分高度接近的真实照片
4. `local_illustration`
   - 本地拟真图兜底

要求：

1. 先尝试 `official_public`
2. 找不到就降级到 `official_channel_like`
3. 再不行用 `near_product_photo`
4. 实在没有才保留 `local_illustration`
5. 不允许为了等官方图而让整批任务停住

### 4.3 复用限制

1. 不允许跨品牌复用同一张图。
2. 不允许跨大类复用同一张图。
3. 只有满足以下情况时，才允许复用：
   - 同一商品不同规格
   - 同一商品不同容量但包装视觉基本一致
   - 当前运行态多个条目本质上就是同一商品
4. 只要是不同口味、不同包装、不同主形态，原则上就要独立找图。
5. 已经拆出独立 `image_key` 的商品，不允许再退回宽泛通用图。

### 4.4 运行态优先

后续推进时，以当前运行态搜索结果优先，不以静态种子文件想当然。

固定顺序：

1. 先跑当前 `/food/search`
2. 锁定用户当前真能搜到的前 3 到 5 项
3. 记录这些项的真实 `image_key`
4. 再找图、处理、同步、验证

## 5. 真实图片统一标准

所有新增真实图都必须统一处理，不能把原图直接丢进系统。

### 5.1 输出标准

1. 统一画布：`1200x1200`
2. 优先格式：`webp`
3. 文件命名：`image_key.webp`
4. 存放目录：`A:\body-food-images`

### 5.2 视觉标准

1. 背景：
   - 纯白或接近纯白浅灰白
   - 不允许杂乱场景图直接入库
2. 主体占比：
   - 约 `75% - 85%`
3. 角度：
   - 瓶、罐、杯装：正面或轻微 3/4 视角
   - 汉堡、炸鸡、披萨、饭团、便当、三明治：轻微 3/4 视角
4. 裁切：
   - 不切断主体
   - 不保留过大空白
5. 清晰度：
   - 模糊明显的图不入库
6. 风格：
   - 尽量保持像商品库，不要混成抓拍杂图库

### 5.3 源图缓存规则

如果原始来源有防盗链、热链不稳定或后续可能失效：

1. 允许先把原始源图缓存到本地
2. 在台账中写入：
   - `source_url`
   - `source_referer`
   - `source_cache_path`
3. 后续统一由 `scripts/prepare_food_photo_assets.py` 从缓存源图继续标准化

## 6. 台账与交付物

### 6.1 必须维护的文件

1. 来源台账：`reports/food_photo_source_ledger.csv`
2. 待补清单：`reports/food_real_photo_backlog.csv`
3. 批次总结：`reports/food_real_photo_batch*.md`
4. 视觉验证结果：
   - `reports/visual_food_image_check.json`
   - 对应桌面端与移动端截图

### 6.2 来源台账字段

必须沿用当前实际列：

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

### 6.3 每一批必须交付的内容

每做完一批，必须至少产出：

1. 新增或更新的 `A:\body-food-images\*.webp`
2. 更新后的 `reports/food_photo_source_ledger.csv`
3. 更新后的三端图片 manifest
4. 一份新的批次总结，例如：
   - `reports/food_real_photo_batch5_summary.md`
5. 更新后的 backlog 和 refinement summary
6. 至少一轮运行态视觉验证结果

## 7. 本轮执行大纲

### 阶段一：锁定高价值运行态搜索结果

目标：

- 先锁定用户最容易感知的品牌搜索结果，而不是泛扫全部 744 条。

做法：

1. 跑以下关键词的运行态搜索：
   - `瑞幸 生椰`
   - `星巴克 星冰乐`
   - `红牛`
   - `711 饭团`
   - `罗森 饭团`
   - `全家 饭团`
   - `全家 三明治`
   - `麦当劳 双吉`
   - `KFC 原味鸡`
   - `必胜客 披萨`
   - `霸王茶姬 伯牙`
2. 每个关键词只锁定当前前 3 到 5 个结果。
3. 记录每项的 `name` 与 `image_key`。
4. 以这些运行态结果作为当前批次的唯一待办来源。

验收：

1. 每个关键词都能列出当前前几项结果
2. 每项结果都能对应到真实 `image_key`

### 阶段二：按品牌分批采集真实图

目标：

- 先做用户搜索频率高、视觉收益高、来源更容易拿到的品牌。

固定优先级建议：

1. `P0-1`：`霸王茶姬`
2. `P0-2`：`全家`
3. `P0-3`：补齐 `711 / 罗森` 余下高频未补项
4. `P0-4`：补齐 `麦当劳 / KFC / 必胜客` 余下高频项
5. `P0-5`：补齐 `瑞幸 / 星巴克 / 红牛` 余下高频项
6. `P1`：`米村 / 南城香 / 吉野家 / 味千 / 茶饮品牌`

每批建议：

1. 一次只做 `3` 到 `8` 个 `image_key`
2. 不追求一批做很多
3. 每批都必须完整跑完找图、标准化、同步、验证闭环

验收：

1. 每批都有明确的 `image_key` 清单
2. 每个 `image_key` 都有来源记录或 fallback 记录

### 阶段三：找图方法必须固定，避免卡住

每个 `image_key` 按下面顺序执行：

1. 先打开官方公开菜单页、产品页、品牌公开活动页
2. 从页面 HTML、公开 CDN、公开图片地址里找稳定可下载源图
3. 如果官方图存在防盗链：
   - 记录 `source_referer`
   - 必要时缓存源图到本地
4. 如果没有稳定官方产品图：
   - 转到 `official_channel_like`
   - 使用官方公开社媒、官方公开新闻稿、官方公开渠道图
5. 再不行：
   - 找与该商品包装、杯型、主视觉高度接近的真实照片
6. 仍拿不到：
   - 先保留 `local_illustration`
   - 在 ledger 和 backlog 中标注 `fallback_only` 或 `blocked`
   - 继续下一个 key，不得停工

禁止事项：

1. 不绕过登录
2. 不抓取需要授权的后台资源
3. 不为一张图牺牲整批进度
4. 不因为找不到完全同款，就拿明显不是这个商品的图硬顶

### 阶段四：统一化处理并生成本地资产

固定做法：

1. 先更新 `reports/food_photo_source_ledger.csv`
2. 再执行 `scripts/prepare_food_photo_assets.py`
3. 输出到 `A:\body-food-images`
4. 文件名与 `image_key` 完全一致

推荐命令模式：

```powershell
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\prepare_food_photo_assets.py --only-key chagee-639 --only-key chagee-640 --only-key chagee-641
```

验收：

1. 本地生成的 `webp` 文件存在
2. 分辨率、角度、背景满足统一标准

### 阶段五：同步到三端

固定顺序：

1. 执行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\sync_food_photo_assets.ps1
```

2. 同步网页端运行容器：

```powershell
docker cp frontend/. health_frontend:/usr/share/nginx/html/
docker restart health_frontend
```

3. 如有后端图片键或食物数据调整，再同步 `health_backend`
4. 小程序端至少保证：
   - `miniprogram/assets/foods`
   - `miniprogram/utils/foodImageAssets.js`
   已随同步脚本更新

特别要求：

1. 如果 manifest 已更新但页面还显示旧图，优先检查 `frontend/index.html` 里的 `food-image-assets.js` 版本串。
2. 不允许改完文件却不把运行中的前端容器同步更新。

### 阶段六：运行态验证

每批都必须做这几类验证：

1. 静态检查：

```powershell
node --check frontend/app.js
node --check frontend/assets/foods/food-image-assets.js
node --check miniprogram/utils/foodImageAssets.js
node --check scripts/visual_food_image_check.cjs
```

2. 后端图片键测试：

```powershell
docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q
```

3. 运行状态检查：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\check_runtime.ps1
```

4. 桌面端与移动端视觉验证：

```powershell
$env:NODE_PATH='C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules;C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\node_modules'
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\visual_food_image_check.cjs
```

5. 必须核对：
   - `reports/visual_food_image_check.json`
   - `reports/visual_desktop_food_images.png`
   - `reports/visual_mobile_food_images.png`

验收：

1. 新增真实图的目标关键词在桌面端和移动端都已经实际显示
2. `src` 指向的是新 manifest 中的真实图片文件，不是旧 `svg`
3. 没有把登录、搜索、记录、首页、报告链路带坏

### 阶段七：更新 backlog 与总结

每批完成后必须：

1. 重跑 `scripts/audit_food_images.py`
2. 重跑 `scripts/build_food_photo_backlog.py`
3. 更新或新建一份批次总结
4. 在总结中明确写出：
   - 本批处理了哪些 `image_key`
   - 哪些是 `official_public`
   - 哪些是 `official_channel_like`
   - 哪些是 `near_product_photo`
   - 哪些仍是 `fallback_only`
   - 哪些被 `blocked`

## 8. 建议的下一批顺序

基于当前可见进度，下一阶段建议按下面顺序推进：

### 批次 A：霸王茶姬

优先条目：

1. `chagee-639`
2. `chagee-640`
3. `chagee-641`

原因：

1. 用户感知强
2. 运行态搜索直接可见
3. 当前已知有官方公开页面与候选公开图

### 批次 B：全家

优先条目：

1. `familymart-693`
2. `familymart-227`
3. `familymart-418`
4. `familymart-519`

原因：

1. 便利店场景感知强
2. 当前仍大量使用拟真图
3. 与 `711 / 罗森` 已完成批次形成对照收益

### 批次 C：711 / 罗森 剩余高频项

优先条目示例：

1. 三明治
2. 酸奶
3. 咖啡
4. 即食鸡胸肉
5. 关东煮高频项

### 批次 D：快餐与咖啡茶饮尾项

优先条目示例：

1. 麦当劳余下高频单品
2. KFC 余下高频单品
3. 必胜客余下高频单品
4. 瑞幸、星巴克未补高频单品

## 9. 防卡点要求

为避免目标模式执行时反复卡住，必须遵守：

1. 运行态结果优先，不空谈全库
2. 每批只做少量 key，做完闭环再进下一批
3. 找不到官方图时立刻降级，不等待
4. 必须用 ledger 记录来源、降级原因、缓存路径
5. 如果页面仍显示旧图，优先排查：
   - manifest 未更新
   - 前端容器未同步
   - `index.html` 缓存版本串未更新
6. 如果微信开发者工具当前无法联通，不以此阻塞整批：
   - 先完成小程序资产与 manifest 同步
   - 先保证三端代码口径一致
   - 把小程序视觉实机验证列入当批待补说明
7. 不因为单张图的完美主义拖垮整批推进

## 10. 本轮完成标准

满足以下条件即可视为本轮目标完成：

1. 新增若干批真实商品图，且都已经进入运行时
2. 高价值品牌搜索结果中，明显减少同图/近同图
3. 新接入图片与食物文字语义能对上
4. 三端都使用同一套 `image_key` 与本地资产
5. 每批都有台账、总结、同步和验证证据
6. 未完成项已整理进 backlog，可继续推进

## 11. 给目标模式的直接执行提示词

下面这段可以直接作为你待会目标模式的执行要求：

```text
按 C:\Users\admin\Documents\Codex\2026-06-22\docker-docker\work\body-nas-deploy-final-v2\FOOD_IMAGE_OFFICIAL_REAL_PHOTO_NEXT_GOAL.md 直接执行，不要停在讨论层。

目标：
继续把食物图片从拟真图和重复图，升级为尽量真实、尽量与商品一一对应的图片系统。优先使用品牌官方公开素材；找不到时使用官方公开渠道可稳定留档的商品图；再不行使用与商品高度接近的真实照片，但必须统一分辨率、角度、裁切、背景后再接入。

硬性要求：
1. 不删除用户数据。
2. 不重置数据库。
3. 不做 destructive 操作。
4. 不整体前端改版。
5. 后端 image_key 仍是三端唯一口径。
6. 新图片统一保存到 A:\body-food-images。
7. 必须复用现有流水线：prepare_food_photo_assets.py、sync_food_photo_assets.ps1、audit_food_images.py、build_food_photo_backlog.py、visual_food_image_check.cjs。
8. 每批都必须做：来源台账更新、本地标准化、三端同步、运行态验证、批次总结。
9. 必须优先按当前 /food/search 的真实结果锁定 image_key，不要只看 foods.json。
10. 找不到官方图时不要卡住，按 official_channel_like -> near_product_photo -> local_illustration 顺序降级，并在台账里写清楚。
11. 如果 manifest 改了但页面还是旧图，优先检查 frontend/index.html 的 food-image-assets.js 版本串、前端容器同步和缓存问题。
12. 每完成一批都要自己验证桌面端和移动端真实显示结果。

执行顺序：
第一步：先读目标文件，再读取 reports/food_photo_source_ledger.csv、reports/food_real_photo_backlog.csv、reports/food_image_refinement_summary.md，确认当前基线。
第二步：先跑运行态搜索，锁定当前批次前 3 到 5 个真实 image_key。
第三步：先完成一小批高价值品牌，建议从 霸王茶姬 开始，再做 全家，再补 711/罗森 剩余高频项。
第四步：每个 image_key 都要找来源、记录 source_tier、必要时缓存源图、做统一化处理。
第五步：同步到 frontend 和 miniprogram，本地 manifest 要更新，运行中的前端容器也要同步。
第六步：跑静态检查、后端图片键测试、check_runtime、visual_food_image_check.cjs，并核对 reports 里的 json 和截图。
第七步：更新 backlog、summary、batch summary，再继续下一批。

验收口径：
功能完成即可。重点是用户搜索品牌商品、便利店单品、连锁餐饮单品时，图片和文字能对应，真实感提升明显，不再一堆同图，三端口径一致，而且整套流程可持续继续补库。
```
