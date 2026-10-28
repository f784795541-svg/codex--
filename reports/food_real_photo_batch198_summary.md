# Food Real Photo Batch 198

- scope: `dish-350` 白切鸡、`dish-354` 清蒸鲈鱼、`dish-351` 烧鹅、`dish-497` 西湖醋鱼、`sweet-sour-pork` 锅包肉、`dish-507` 响油鳝糊、`dish-491` 拔丝地瓜
- result: 7 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-350` 白切鸡
  - source: Wikimedia Commons `BeiQieJi-WhiteCutChicken.jpg`
  - license: CC BY-SA 3.0
  - semantic check: 文件说明与画面均明确展示白切鸡切片和配菜；作为菜品级视觉
- `dish-354` 清蒸鲈鱼
  - source: Wikimedia Commons `Chinese Steamed Perch.jpg`
  - license: CC BY-SA 2.0
  - semantic check: 文件标题与画面均明确展示整条清蒸鲈鱼；作为菜品级视觉
- `dish-351` 烧鹅
  - source: Wikimedia Commons `Roasted goose made in north China(JiaoXiangMei) on dish.jpg`
  - license: CC0
  - semantic check: 文件标题与画面均明确展示切块烧鹅；作为菜品级视觉
- `dish-497` 西湖醋鱼
  - source: Wikimedia Commons `West Lake Fish in Vinegar Gravy.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示西湖醋鱼及醋汁；作为菜品级视觉
- `sweet-sour-pork` 锅包肉
  - source: Wikimedia Commons `Guobaorou at Zhenbutong, Changchun (20220826174428).jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示锅包肉的酥脆肉片和酸甜挂汁；作为菜品级视觉
- `dish-507` 响油鳝糊
  - source: Wikimedia Commons `Stir-fried shredded eel with hot oil and ginger at Songhelou Suzhou Noodles, Parkview Green (20210126165145).jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件说明与画面均明确展示热油姜汁炒鳝丝；作为菜品级视觉
- `dish-491` 拔丝地瓜
  - source: Wikimedia Commons `拔丝地瓜.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示拔丝地瓜的焦糖糖丝；作为菜品级视觉

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=386`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=390`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 100 rows (P1=26, P2=74)
- visual spot check: 七张候选原图均已确认语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
