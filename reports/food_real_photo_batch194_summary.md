# Food Real Photo Batch 194

- scope: 家常地三鲜（`dish-738`）、扬州炒饭（`dish-501`）、松鼠桂鱼（`dish-502`）
- result: 3 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-738` 家常 地三鲜
  - source: Wikimedia Commons `Di san xian (home-made).jpg`
  - license: CC BY 3.0
  - semantic check: 文件标题与画面均明确展示茄子、土豆和青椒组合
- `dish-501` 扬州炒饭
  - source: Wikimedia Commons `Yangzhou fried rice and drinks 06-09-2019.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示扬州炒饭；画面中的饮料不影响主菜识别
- `dish-502` 松鼠桂鱼
  - source: Wikimedia Commons `Suzhou Squirrel fish (松鼠鱖魚) - img 01.jpg`
  - license: CC BY 4.0
  - semantic check: 文件标题与画面均明确展示松鼠桂鱼的造型和酸甜酱汁

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 双端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=371`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=375`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 115 rows（P1=28、P2=87）
- visual spot check: production WebP 清晰展示地三鲜、扬州炒饭和松鼠桂鱼
- runtime verification: pending because Docker Desktop Linux engine is unavailable
