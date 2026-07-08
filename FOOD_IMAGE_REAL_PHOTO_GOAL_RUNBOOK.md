# 食物图片真实商品图目标执行 Runbook

## 1. 目标

本文件用于把当前食物图片系统从“已经拆出较多独立 `image_key`，但仍有大量拟真图、重复图、风格不统一图”继续推进到下面这个可验收状态：

1. 用户搜索品牌商品、便利店单品、连锁餐饮单品时，搜索结果图尽量与具体食物一一对应。
2. 优先使用品牌官方公开素材或品牌官方公开渠道可稳定留档的商品图。
3. 找不到稳定官方图时，允许使用与商品高度接近的真实照片，但必须统一分辨率、角度、裁切、背景后再接入。
4. 不再出现“同一次搜索里一批不同商品连续共用一张图”的强感知问题。
5. 网页端、移动端、小程序端继续统一使用后端 `image_key` 作为唯一图片口径。

最终验收口径：

- 用户搜索品牌商品时，结果图明显更像真实商品库，而不是一堆手绘图或同图复用。
- 图片与食物文字能够对应上。
- 三端口径一致。
- 整套流程可持续继续补库，而不是一次性临时修补。

## 2. 当前基线

以当前仓库和最近审计结果为准：

1. 总食物数：`744`
2. 总 `image_key` 数：`606`
3. 总语义图片族数：`178`
4. 已接入本地真实图片的 `image_key`：`28`
5. 仍使用本地拟真图兜底的 `image_key`：`578`
6. 真实图本地正式目录：`A:\body-food-images`
7. 候选源图缓存目录：`reports/candidate_images`
8. 当前已存在并应继续复用的脚本链路：
   - `scripts/prepare_food_photo_assets.py`
   - `scripts/sync_food_photo_assets.ps1`
   - `scripts/audit_food_images.py`
   - `scripts/build_food_photo_backlog.py`
   - `scripts/visual_food_image_check.cjs`
   - `scripts/check_runtime.ps1`
9. 当前已存在并应持续维护的台账与报告：
   - `reports/food_photo_source_ledger.csv`
   - `reports/food_real_photo_backlog.csv`
   - `reports/food_image_refinement_summary.md`
   - `reports/food_real_photo_batch*.md`
   - `reports/visual_food_image_check.json`

## 3. 关键判断

### 3.1 整库推进不等于 744 条都找官方图

全库目标必须按类型拆开，不然任务会长期卡住：

1. 品牌商品、便利店单品、连锁餐饮单品：
   - 目标是一物一图，优先官方真实商品图。
2. 普通家常菜、基础食材、泛化菜品：
   - 目标是语义正确、风格真实、尽量缩窄复用范围。
   - 不要求每一条都必须有品牌官方商品图，但不能继续让明显不同的食物共用一张图。

### 3.2 运行态结果优先于静态种子

后续执行不能只看 `backend/app/foods.json`，必须先看当前 `/food/search` 的真实返回结果。真正优先修的是用户当前搜索时前几项看到的图。

### 3.3 真实路线优先，但不能被单张图拖死

每个 `image_key` 优先找官方公开素材，但找不到时必须按降级策略继续推进，不能因为一个品牌页面难抓、某一项没有完美图，就卡住整个批次。

## 4. 本轮不做的事

1. 不删除用户数据。
2. 不重置数据库。
3. 不做 destructive 操作。
4. 不整体前端改版。
5. 不推翻现有网页端、移动端、小程序端结构。
6. 不把图片二进制写进数据库。
7. 不在运行时依赖外链图片。
8. 不接外部 AI。
9. 不接不稳定第三方营养 API。
10. 不为了追数量而把明显不匹配的图硬塞进系统。

## 5. 硬性规则

### 5.1 单一口径

1. 后端 `image_key` 是三端唯一权威口径。
2. 图片正式文件名必须与 `image_key` 完全一致。
3. 网页端、移动端、小程序端都只读本地静态资源。
4. 新增真实图后必须同步：
   - `frontend/assets/foods/`
   - `miniprogram/assets/foods/`
   - `frontend/assets/foods/food-image-assets.js`
   - `miniprogram/utils/foodImageAssets.js`

### 5.2 来源优先级

每个 `image_key` 在台账中必须标记 `source_tier`，固定顺序如下：

1. `official_public`
   - 官网公开产品页
   - 官网公开菜单页
   - 官网公开商品图
   - 官方公开活动页中可稳定裁取的商品图
2. `official_channel_like`
   - 官方公开社媒图
   - 官方公开电商图
   - 官方公开新闻稿或活动图中可稳定裁取的商品图
3. `near_product_photo`
   - 非官方但与包装、杯型、颜色、主成分、摆放方式高度接近的真实照片
4. `local_illustration`
   - 本地拟真图兜底

执行规则：

1. 先尝试 `official_public`
2. 搜索超过合理时间仍无稳定结果，立刻降级
3. 降级顺序必须是：
   - `official_public`
   - `official_channel_like`
   - `near_product_photo`
   - `local_illustration`
4. 不允许为了等官方图而停止整批推进

### 5.3 复用限制

1. 不允许跨品牌复用同一张图。
2. 不允许跨大类复用同一张图。
3. 不允许拿明显是 A 商品的图去顶 B 商品。
4. 已经拆出独立 `image_key` 的品牌商品，原则上必须独立找图。
5. 仅在以下条件同时满足时，才允许复用：
   - 本质上是同一商品
   - 外观几乎一致
   - 用户搜索时不会误判成别的商品

### 5.4 脚本顺序规则

`scripts/audit_food_images.py` 和 `scripts/build_food_photo_backlog.py` 不允许并行跑。

固定顺序必须是：

1. 先跑 `scripts/audit_food_images.py`
2. 再跑 `scripts/build_food_photo_backlog.py`

否则 backlog 容易读到旧审计结果。

## 6. 图片统一标准

所有新增真实图都必须处理后再接入，不允许把来源原图直接丢进系统。

### 6.1 输出标准

1. 画布：`1200x1200`
2. 格式：优先 `webp`
3. 文件名：`image_key.webp`
4. 正式文件目录：`A:\body-food-images`

### 6.2 视觉标准

1. 背景：
   - 优先纯白或接近纯白的浅灰白
   - 杂乱场景背景不得直接入库
2. 主体占比：
   - 约 `75% - 85%`
3. 角度：
   - 瓶、罐、杯装商品：正面或轻微 3/4 角
   - 汉堡、炸鸡、饭团、三明治、披萨、便当：轻微 3/4 角
4. 裁切：
   - 不切断主体
   - 不保留过大留白
5. 清晰度：
   - 模糊图不入库
6. 风格：
   - 尽量统一成商品库风格
   - 不要混成抓拍图库风格

### 6.3 源图缓存规则

如果官方源图存在防盗链、referer 限制或未来失效风险：

1. 允许先缓存到本地
2. 缓存文件优先放在 `reports/candidate_images`
3. 在台账中补齐：
   - `source_url`
   - `source_referer`
   - `source_cache_path`

## 7. 台账规则

必须持续维护：

1. `reports/food_photo_source_ledger.csv`
2. `reports/food_real_photo_backlog.csv`
3. `reports/food_real_photo_batch*.md`
4. `reports/visual_food_image_check.json`

### 7.1 来源台账字段

沿用当前真实字段，不要另起一套：

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

### 7.2 status 规则

建议固定使用：

1. `collected`
2. `normalized`
3. `synced`
4. `verified`
5. `fallback_only`
6. `blocked`

### 7.3 blocked 使用边界

只有满足下面条件之一，才允许写 `blocked`：

1. 官方公开素材无法稳定获取
2. 近似真实图也没有可接受来源
3. 当前找到的图存在明显版权、清晰度、背景或语义问题，暂不应上线

即使某项是 `blocked`，也不能阻塞同批其它项继续推进。

## 8. 全库推进策略

### 8.1 P0：品牌商品一物一图

这部分是用户感知最强、必须先补的核心层。

优先品牌组：

1. 星巴克
2. 瑞幸
3. 红牛及功能饮料
4. 霸王茶姬
5. 麦当劳
6. KFC
7. 必胜客
8. 7-11
9. 罗森
10. 全家

规则：

1. 以当前运行态搜索前 3 到 5 项为先
2. 这些项原则上都要落到独立真实图
3. 一个品牌一次只做少量 key，完成闭环再推进下一批

### 8.2 P1：高频便利店扩展项

目标类别：

1. 饭团
2. 三明治
3. 便当
4. 沙拉鸡胸肉
5. 咖啡
6. 酸奶
7. 关东煮高频项

规则：

1. 先补用户高频搜到、前排显示的商品
2. 对同一便利店内明显不同外观的单品，逐步拆到更细真实图
3. 不允许“金枪鱼饭团、鸡排饭团、泡菜饭团长期共用一张图”

### 8.3 P2：连锁餐饮高频单品扩展

目标类别：

1. 汉堡
2. 鸡翅
3. 原味鸡
4. 蛋挞
5. 苹果派
6. 披萨
7. 咖啡
8. 茶饮

规则：

1. 先做当前搜索结果前排仍是 `svg` 或广泛复用图的 key
2. 先解决强商品感品类

### 8.4 P3：普通成品菜与基础食材治理

这一层不要求每条都找官方商品图，但必须解决“宽泛图复用太多”的问题。

做法：

1. 优先处理当前复用量大的语义族：
   - `onigiri`
   - `sandwich`
   - `burger`
   - `latte-cup`
   - `coffee-cup`
   - `fried-chicken`
   - `frappuccino-cup`
   - `chicken-wings-real`
2. 对明显跨口味、跨形态的条目逐步拆细
3. 目标是“语义收窄”，不是“一张通用图覆盖一堆不相干食物”

## 9. 单批执行流程

每一批都必须完整走闭环，不要只做前半段。

### 第一步：先读基线

开始执行前，先读：

1. `FOOD_IMAGE_REAL_PHOTO_GOAL_RUNBOOK.md`
2. `reports/food_photo_source_ledger.csv`
3. `reports/food_real_photo_backlog.csv`
4. `reports/food_image_refinement_summary.md`

### 第二步：锁定运行态真实问题

先用实际运行态搜索关键词，锁定当前用户真正会看到的 `image_key`。

建议先查：

1. `瑞幸 生椰`
2. `星巴克 星冰乐`
3. `红牛`
4. `711 饭团`
5. `罗森 饭团`
6. `全家 饭团`
7. `全家 三明治`
8. `麦当劳 双吉`
9. `KFC 鸡翅`
10. `肯德基 蛋挞`
11. `麦当劳 苹果派`
12. `必胜客 披萨`
13. `霸王茶姬 伯牙`

规则：

1. 只锁定每个关键词前 3 到 5 项
2. 优先修当前仍显示旧图、同图或拟真图的项

### 第三步：更新来源台账

每个待处理 `image_key` 都要先在 `reports/food_photo_source_ledger.csv` 写清楚：

1. 是哪个商品
2. 来源层级是什么
3. 来源网址是什么
4. 是否有 referer
5. 是否有本地缓存
6. 当前状态是什么

### 第四步：找图与降级

固定顺序：

1. 找 `official_public`
2. 找不到就找 `official_channel_like`
3. 再不行找 `near_product_photo`
4. 实在没有就保留 `local_illustration`

禁止：

1. 为了等一个完美官方图停掉整批
2. 拿明显不对应的图硬顶
3. 跨品牌复用

### 第五步：标准化处理

使用现有脚本处理：

```powershell
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\prepare_food_photo_assets.py --only-key <image_key>
```

多 key 可重复追加 `--only-key`。

### 第六步：同步三端

固定执行：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\sync_food_photo_assets.ps1
docker cp frontend/. health_frontend:/usr/share/nginx/html/
docker restart health_frontend
```

如有后端图片键或数据调整，再同步 `health_backend`。

### 第七步：版本与缓存处理

每做完一批，如果 manifest 已更新，必须检查 `frontend/index.html` 中 `food-image-assets.js` 的版本串是否需要递增。

否则页面可能继续读旧 manifest。

### 第八步：验证

必须至少执行：

```powershell
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check frontend\app.js
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check frontend\assets\foods\food-image-assets.js
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check miniprogram\utils\foodImageAssets.js
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check scripts\visual_food_image_check.cjs
docker exec health_backend python -m pytest /app/tests/test_food_image_keys.py -q
powershell -ExecutionPolicy Bypass -File scripts\check_runtime.ps1
```

视觉验证：

```powershell
$env:NODE_PATH='C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules;C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\.pnpm\node_modules'
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts\visual_food_image_check.cjs
```

### 第九步：刷新审计与 backlog

固定顺序：

```powershell
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\audit_food_images.py
& 'C:\Users\admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\build_food_photo_backlog.py
```

### 第十步：写批次总结

每批至少输出一份：

- `reports/food_real_photo_batchX_summary.md`

必须说明：

1. 本批补了哪些品牌和单品
2. 哪些 `image_key` 换成了真实图
3. 哪些是 `official_public`
4. 哪些是 `official_channel_like`
5. 哪些是 `near_product_photo`
6. 哪些仍是 `fallback_only`
7. 跑了哪些验证

## 10. 防卡点规则

### 10.1 单 key 时间盒

1. 单个 `image_key` 找官方图超过 `15` 分钟仍无稳定结果，必须降级
2. 降级后继续推进，不反复纠缠同一来源

### 10.2 单品牌时间盒

1. 同一品牌一批次累计投入超过 `45` 分钟仍推进缓慢，就先收口已完成项
2. 转下一品牌或下一组 key，避免整批停住

### 10.3 单批规模限制

1. 每批只做 `3` 到 `8` 个 `image_key`
2. 每批必须完成同步和验证后，才能开下一批

### 10.4 小程序阻塞规避

如果微信开发者工具当前无法方便联调：

1. 不以此阻塞整批
2. 先保证 `miniprogram/assets/foods` 和 `miniprogram/utils/foodImageAssets.js` 已同步
3. 先保证三端代码口径一致
4. 把小程序实机视觉验证写进当批待补说明

### 10.5 旧图排查顺序

如果代码已改但页面仍显示旧图，按下面顺序排查：

1. `frontend/assets/foods/food-image-assets.js` 是否已更新
2. `frontend/index.html` 的版本串是否已更新
3. `health_frontend` 是否已同步并重启
4. 浏览器缓存是否仍命中旧文件

## 11. 推荐执行顺序

下一轮目标模式建议按下面顺序推进：

### 批次 A：KFC 高感知缺口补齐

优先项：

1. `KFC 鸡翅`
2. `肯德基 蛋挞`

原因：

1. 当前搜索可见
2. 强商品感
3. 用户对“不是同一张图”感知明显

### 批次 B：麦当劳高感知缺口补齐

优先项：

1. `麦当劳 苹果派`
2. 其它当前搜索前排仍是拟真图的高频单品

### 批次 C：便利店剩余高频项

优先项：

1. 7-11 饭团剩余高频项
2. 罗森 饭团剩余高频项
3. 全家 饭团/三明治剩余高频项

### 批次 D：茶饮与咖啡尾项

优先项：

1. 霸王茶姬剩余项
2. 瑞幸剩余项
3. 星巴克剩余项
4. 红牛及功能饮料扩展项

### 批次 E：普通成品菜收窄复用

目标：

1. 将高复用语义族继续拆细
2. 让整库“图片与文字对应”的感知继续向普通食物扩展

## 12. 本轮目标完成标准

满足以下条件即可验收：

1. 新增若干批真实商品图，且已进入运行时显示
2. 高价值品牌搜索结果中，明显减少同图或近同图
3. 图片与食物文字语义能对上
4. 三端都继续使用同一套 `image_key`
5. 每批都有台账、同步、测试、视觉验证和总结
6. 未完成项已进入 backlog，可继续接着做

## 13. 目标模式要求

待会开启目标模式时，要求必须写清楚：

1. 不要停在讨论层，直接执行
2. 先读本文件和当前台账，再开始做
3. 优先看运行态搜索结果，不要只看 `foods.json`
4. 官方公开素材优先，但找不到时不准卡住，必须降级继续
5. 每一批都必须完成：
   - 来源台账更新
   - 图片标准化
   - 三端同步
   - 测试与视觉验证
   - backlog 与 summary 更新
6. 不要整体前端改版
7. 不要删除用户数据
8. 不要重置数据库
9. 不要做 destructive 操作
10. 不要泄漏密码、token、cookie、密钥
11. 不要把 `audit_food_images.py` 和 `build_food_photo_backlog.py` 并行跑
12. 完成每批后都要汇报：
   - 补了哪些品牌和单品
   - 替换了哪些 `image_key`
   - 哪些仍是近似图或拟真图
   - 跑了哪些验证
   - 哪些功能确认正常

## 14. 可直接复制的目标模式提示词

```text
/goal 按 C:\Users\admin\Documents\Codex\2026-06-22\docker-docker\work\body-nas-deploy-final-v2\FOOD_IMAGE_REAL_PHOTO_GOAL_RUNBOOK.md 直接执行，不要停在讨论层。

目标：
继续把食物图片系统从拟真图和重复图，升级为尽量真实、尽量与具体食物对应的图片系统。品牌商品、便利店单品、连锁餐饮单品优先使用品牌官方公开素材；找不到稳定官方图时，按 official_channel_like -> near_product_photo -> local_illustration 顺序降级，但必须继续推进，不能被单张图卡住。新增真实图接入前必须统一分辨率、角度、裁切、背景。真实图片正式文件统一放到 A:\body-food-images，三端继续统一使用后端 image_key 作为唯一图片口径。

执行要求：
1. 先读 runbook，再读 reports/food_photo_source_ledger.csv、reports/food_real_photo_backlog.csv、reports/food_image_refinement_summary.md。
2. 先看当前 /food/search 的真实搜索结果，锁定前 3 到 5 个用户当前真会看到的 image_key，不要只看 foods.json。
3. 按小批次推进，每批只做 3 到 8 个 image_key，做完必须闭环。
4. 每个 image_key 必须先更新来源台账，再找图、标准化、同步三端、跑测试、做视觉验证。
5. 图片来源优先级固定为 official_public -> official_channel_like -> near_product_photo -> local_illustration。
6. 不要因为一个品牌或一个商品找不到完美官方图而卡住整批。
7. 不要整体前端改版，不要删除用户数据，不要重置数据库，不要做 destructive 操作，不接外部 AI，不接第三方营养 API。
8. 每一批完成后必须执行 scripts/sync_food_photo_assets.ps1，同步 frontend 运行容器，必要时更新 frontend/index.html 中的 food-image-assets.js 版本串。
9. 每一批完成后必须运行静态检查、test_food_image_keys.py、check_runtime.ps1、visual_food_image_check.cjs。
10. 运行 scripts/audit_food_images.py 和 scripts/build_food_photo_backlog.py 时必须串行，不要并行。

建议起步顺序：
第一批先补 KFC 鸡翅、肯德基 蛋挞；
第二批补 麦当劳 苹果派 和其它当前前排仍是拟真图的麦当劳高频项；
第三批补 7-11 / 罗森 / 全家 剩余高频便利店单品；
第四批补 霸王茶姬、瑞幸、星巴克、红牛剩余高频项；
第五批再继续拆细普通成品菜的高复用语义图。

最终验收：
功能完成即可。重点是用户搜索品牌商品、便利店单品、连锁餐饮单品时，结果图与食物文字能对应，真实感明显提升，不再一堆同图，三端口径一致，而且后续可以按同一流程继续补库。
```
