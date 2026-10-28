# Food Real Photo Batch 197

- scope: `dish-345` 水煮牛肉、`dish-216` 红烧茄子、`dish-373` 肉末茄子、`sams-720` 山姆烤鸡腿、`intl-cafe-273` 番茄牛腩饭
- result: 5 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-345` 水煮牛肉
  - source: Wikimedia Commons `Boiled beef in spicy sauce @ Restaurant Les Saveurs du Sichuan @ Paris (34468605914).jpg`
  - license: CC BY 2.0
  - semantic check: 画面明确展示牛肉片、红油和川味配料；作为菜品级视觉，不宣称特定餐厅或品牌
- `dish-216` 红烧茄子
  - source: Wikimedia Commons `Hong shao qie zi.jpg`
  - license: CC BY 2.0
  - semantic check: 画面明确展示酱汁茄子块；文件标题与菜品语义一致，作为菜品级视觉
- `dish-373` 肉末茄子
  - source: Wikimedia Commons `Hong Kong style fired Eggplant with minced pork.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 画面明确展示茄子块与肉末；作为菜品级视觉，不宣称特定餐厅或品牌
- `sams-720` 山姆烤鸡腿
  - source: Wikimedia Commons `Roast Chicken Legs and Thighs (31196736704).jpg`
  - license: CC BY-SA 2.0
  - semantic check: 画面明确展示烤制鸡腿与鸡大腿；作为近似商品视觉，不宣称山姆官方包装图
- `intl-cafe-273` 番茄牛腩饭
  - source: Wikimedia Commons `Diced Beef with pepper and lemon sauce on tomato rice - An An AUD11.50 (3514908300).jpg`
  - license: CC BY-SA 2.0
  - semantic check: 文件标题与画面均明确展示牛肉配番茄米饭；作为菜品级近似视觉，不宣称特定餐厅配方

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=379`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=383`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 107 rows (P1=26, P2=81)
- visual spot check: 五张候选原图均已确认语义匹配
- runtime verification: pending because Docker Desktop Linux engine is unavailable
