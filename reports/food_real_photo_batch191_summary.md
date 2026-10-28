# Food Real Photo Batch 191

- scope: 夜宵烤玉米（`dish-746`）、夜宵烤金针菇（`dish-747`）、夜宵烤韭菜（`dish-744`）
- result: 3 个 `image_key` 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `dish-746` 夜宵 烤玉米
  - source: Wikimedia Commons `Grilled Corn (Unsplash).jpg`
  - license: CC0
  - semantic check: 原图清晰展示带炭烤痕迹的玉米，符合烤玉米菜品级识别
- `dish-747` 夜宵 烤金针菇
  - source: Wikimedia Commons `Grilled enoki-dake mushrooms (5993870972).jpg`
  - license: CC BY-SA 2.0
  - semantic check: 文件标题和画面均明确展示烤制金针菇；需署名并遵守相同方式共享
- `dish-744` 夜宵 烤韭菜
  - source: Wikimedia Commons `Grilled Asian Chives.jpg`
  - license: CC BY-SA 4.0
  - semantic check: 文件标题和画面均明确展示烤制亚洲韭菜；需署名并遵守相同方式共享

## Image standard

- 生产资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 双端资源和 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=365`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=369`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 121 rows（P1=28、P2=93）
- visual spot check: 三张生产 WebP 分别清晰展示烤玉米、烤金针菇和烤韭菜
- runtime verification: pending because Docker Desktop Linux engine is unavailable
