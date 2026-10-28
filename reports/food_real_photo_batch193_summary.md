# Food Real Photo Batch 193

- scope: 卤牛肉（`dish-362`）、叫花鸡（`dish-499`）
- result: 2 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-362` 卤牛肉
  - source: Wikimedia Commons `Chinese Braised Beef (紅燒牛肉).jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示红烧牛肉块；作为卤牛肉的菜品级视觉，不宣称具体地域配方
- `dish-499` 叫花鸡
  - source: Wikimedia Commons `Beggar's Chicken (叫化雞).jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题与画面均明确展示整只叫花鸡及配料；作为叫花鸡菜品级视觉

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 双端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=368`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=372`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 118 rows（P1=28、P2=90）
- visual spot check: production WebP 清晰展示卤牛肉和叫花鸡
- runtime verification: pending because Docker Desktop Linux engine is unavailable
