# 食物图片候选复核（2026-09-03）

## mixue-704｜蜜雪冰城 摩天脆脆

- 候选缓存：`reports/candidate_images/mixue-704-source.jpg`
- 语义复核：画面中是带有蜜雪冰城雪王标识的软冰淇淋甜筒，和目标食物类型一致。
- 授权复核：候选来自媒体图片，当前未找到可复用许可、权利人授权或官方素材使用许可的证据。
- 处置结果：不接入网页端、小程序端或来源台账；继续保留在 P1 backlog，避免以未经授权的网络图片替换现有占位图。
- 后续接入标准：仅接受可核验的公开许可素材，或经项目方取得品牌／权利人授权的官方商品图；同时仍须满足 750×750 WebP、单图不超过 300KB 的双端规范。

## burgerking-664｜汉堡王 薯霸王 中份

- 候选缓存：`reports/candidate_images/batch216/burgerking-664-wikimedia.jpg`
- 语义复核：画面为多块不规则、非薯条形态的油炸面食，未出现汉堡王标识、薯条包装或中份规格信息。
- 处置结果：拒绝。即使来源具有公开许可，也不能把不相符的图片用于汉堡王薯条。

## yuzicun-292｜鱼籽村 照烧鸡腿鱼籽拌饭

- 候选缓存：`reports/candidate_images/batch213/yuzicun-292-wikimedia.jpg`
- 语义复核：画面中餐盘明确印有 KFC 标识，菜品也无法证明是鱼籽村照烧鸡腿鱼籽拌饭。
- 处置结果：拒绝，不能以其他品牌餐品图代替目标品牌和具体口味。

## 其他本地候选

- `dish-582`（小龙虾 蒜蓉）：候选图是锅中烹煮过程，蒜蓉口味和成品摆盘均无法确认，拒绝。
- `dish-748`（火锅 肥牛卷）：候选图文件不完整且画面仅露出部分生肉，不能作为可用生产素材，拒绝。
- `dish-569`（烤五花肉）：候选图展示生五花肉或烧烤场景，未展示烤熟成品，拒绝。
- `tofu-dish`（麻婆豆腐）：候选图文件不完整，无法作为稳定生产素材，拒绝。
- `chicken-gizzard`（卤鸡胗）：候选图为生鸡胗切片，不是卤制成品，拒绝。

## 本轮新增候选（batch282）

- `dish-582`（蒜蓉小龙虾）：Wikimedia Commons `Garlic Crawfish - 1, June 19, 2023.jpg`，页面许可为 CC BY-SA 4.0，标题语义匹配；但画面主体被大量烹制蒸汽遮挡，无法清晰识别蒜蓉成品形态，拒绝接入。
- `dish-748`（火锅肥牛卷）：继续复核既有候选，只有生肉拼盘或不完整文件，没有合格的肥牛卷成品/清晰包装图，保持 P2 待办。
## batch283 Wikimedia 复核补充

- `dish-582`（蒜蓉小龙虾）：`Crawfish 01.jpg` 为自然生长特写，`The Strandloper Restaurant...jpg` 为餐厅场景，均不是蒜蓉小龙虾成品；拒绝接入。

## batch285 Wikimedia 复核补充

- `dish-553`（火锅羊肉卷）：Wikimedia Commons `ラムシャブ (3423334287).jpg`，许可为 CC BY 2.0，授权可核验；但画面是羊肉片已在锅内烹煮的过程图，没有展示清晰可识别的火锅羊肉卷分装盘、成品或包装。为避免以近似热锅图替代具体食材图，拒绝接入，保持 P2 待办。

## batch286 Wikimedia 复核补充

- `dish-556`（鸭肠）：Wikimedia Commons `Nanfang Duck Intestine Hotpot.jpg`，许可为 CC BY-SA 4.0，标题语义与火锅鸭肠相关；但画面主体是调制中的红油火锅锅底，鸭肠没有清晰可辨的独立外观，不能满足用户搜索时“一眼识别”的标准。拒绝接入，保持 P2 待办。

## batch289 Wikimedia 复核补充

- `dish-383`（外婆菜炒蛋）：Wikimedia Commons `梅菜肉碎炒蛋` 候选为 CC0，标题和配料结构接近；但下载文件存在截断，且可见画面为包含多道菜的餐盘局部，目标菜没有独立、完整、可一眼识别的展示。拒绝接入，保持 P2 待办。

## batch290 Wikimedia 复核补充

- `dish-581`（扬州炒面）：Wikimedia Commons `Singapore style noodles.jpg` 的授权为 CC BY-SA 2.0，画面清晰且是完成态炒制粉面；但主食材为细米粉，目标是扬州炒面，面条类型和地域做法均不一致。拒绝接入，避免把“星洲炒米”类图片误当成扬州炒面。

## batch292-293 Wikimedia 复核补充

- `tofu-dish`（砂锅豆腐）：`Stir-fry spinach with tofu` 为可核验公开许可素材，但画面是菠菜、肉末与煎豆腐的炒菜，既非砂锅成品，也不是目标配料结构；拒绝接入。
- `dish-359`（白灼生菜）：`Holly Seafood Restaurant ... oyster sauce ... vegetable` 的文件页为 CC0 且分类含 `Lettuce as food`；但可访问的文件传输多次中断，未形成可完整解码的来源缓存，且文件名无法证明画面为白灼生菜独立成品。拒绝接入，保持 P2 待办。

## batch295 Wikimedia 复核补充

- `dish-557`（虾滑）：`Frozen shrimp cakes.jpg` 为 CC0，标题、分类均指向冷冻虾滑块；但画面是近距离原料纹理，缺乏包装、火锅场景或可一眼识别的虾滑展示，不适合作为用户搜索结果主图。拒绝接入，保持 P2 待办。

## batch296 Wikimedia 复核补充

- `dish-510`（杭椒牛柳）：`Beef and Pea Pod Stir Fry` 为 CC BY 2.0，描述虽提及彩椒，但菜名和主要配菜是荷兰豆，无法证明为杭椒牛柳；下载也未形成完整缓存。拒绝接入，保持 P2 待办。

## batch297 Wikimedia 复核补充

- `dish-749`（火锅毛肚）：`DZ3 0582 Slicing thin sheets of tripe with chopsticks to cook in a sizzling Thai-style hotpot...jpg` 为 CC BY-SA 4.0，许可可核验。但页面描述将盘中主体表述为宽米粉或米糕等不确定食材，画面也是泰式火锅用餐场景，无法把白色片状主体稳定判定为可一眼识别的火锅毛肚。为避免把不确定的火锅过程图当作独立食材图，拒绝接入，保持 P2 待办。

## batch298 Wikimedia 复核补充

- `dish-482`（小鸡炖蘑菇）：`Chicken Mushroom Claypot.jpg` 为 CC0，来源页明确标注为 Chicken Mushroom Claypot，画面完整展示鸡块与木耳/蘑菇的炖煮成品。它不是东北小鸡炖蘑菇的同款菜谱，但主料和成品形态高度一致，满足“近似菜品图”候选标准；后续接入时必须在来源台账标记为 `near_dish_photo`，不可标为精确同款。2026-09-04 从 Wikimedia 下载时受到限流，得到的本轮临时文件不完整且已移除，尚未进入来源台账、生产资源或待补完成数；待取得完整可校验缓存后再处理。

## batch299 本地候选复核补充

- `dish-482`（小鸡炖蘑菇）：已有缓存 `batch260/dish-482-chicken-mushroom-broth.jpg` 能完整解码，但视觉抽检显示为清汤类鸡肉蘑菇汤，鸡肉主体不清晰，且成品形态与小鸡炖蘑菇不符。拒绝接入，保持 P2 待办；不得因文件完整或标题含 chicken/mushroom 而错误替换现有占位图。
- `dish-209`（番茄牛腩）：2026-09-04 对公开许可图库按 `tomato beef stew` 检索，结果为肉酱意面、非目标地区的配餐或泛肉汤，未出现可同时确认牛腩块、番茄和中式炖煮成品的候选。保持 P2 待办。

## batch300 接入复核

- `dish-482`（小鸡炖蘑菇）：此前通过视觉、菜名和 CC0 许可复核的 `Chicken Mushroom Claypot.jpg` 已于 2026-09-04 成功取得完整 250×333 缩略源图并完成解码校验。画面完整呈现鸡块、深色菌菇/木耳和砂锅炖煮形态；作为主料与成品形态高度一致的 `near_dish_photo` 接入，不声称为东北同款菜谱。已写入来源台账，标准化为 750×750 WebP（32,884 bytes）并同步至网页端和小程序端；两端 SHA-256 一致。 

## batch301 Wikimedia 复核补充

- `dish-563`（宽粉）：`Shahe fen, dried form.jpg` 为 CC BY-SA 4.0，画面清晰展示沙河粉包装和宽扁米粉，许可与食品语义均可核验；但沙河粉属于米制河粉，目标“宽粉”通常指更宽厚、半透明的薯类或豆类粉条。两者并非同一食品类型，拒绝用该图替代宽粉，保持 P2 待办。

## batch302 Wikimedia 复核补充

- `dish-359`（白灼生菜）：按 `blanched lettuce` 与 `lettuce oyster sauce` 检索，结果为生菜种植资料、菜单扫描件、餐厅环境或含多道菜的餐桌照片，未发现可以独立确认“焯/白灼生菜成品”的图片。保持 P2 待办，不以生菜沙拉、炒生菜或环境图替代。

## batch303 Wikimedia 复核补充

- `dish-487`（尖椒干豆腐）：按 `dried tofu green pepper stir fry` 检索，结果主要为菠菜炒豆腐、食谱文档和泛青椒/豆制品资料，未出现同时清晰呈现干豆腐与尖椒成品的候选。保持 P2 待办，不以普通豆腐、麻婆豆腐或混合配菜替代。
- `dish-387`（干锅花菜）：按 `dry pot cauliflower`、`stir-fried cauliflower Chinese` 等关键词检索，结果主要为烹饪书、种植资料或含虾/肉/多种蔬菜的混合炒菜，未找到可确认干锅/干煸风格且以花菜为主体的独立成品图。保持 P2 待办。
## batch305 review supplement (2026-09-04)

- `sams-721`: Cached candidates are generic tiramisu, empty containers, a Sam's display, or unrelated desserts; none simultaneously prove the Sam's brand, tiramisu-cup subject, and reusable authorization. Keep P1 backlog.
- `chabaidao-653`: Cached candidates show Chabaidao ice cream or ingredients, not the 豆乳玉麒麟 drink. Keep P1 backlog.
- `chicken-gizzard`: Cached candidate is raw sliced gizzard, not a braised finished dish. Keep P2 backlog.
- `dish-493`: Cached candidate is ordinary stir-fried cabbage, without 老厨白菜-specific evidence. Keep P2 backlog.
- `dish-735`: Search results did not clearly show both green pepper and shredded pork in an authorized finished dish. Keep P2 backlog.
