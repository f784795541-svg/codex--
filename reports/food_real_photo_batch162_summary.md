# Food Real Photo Batch 162

- scope: 夜宵烤茄子开放授权图片接入
- result: 1 个 image_key 已接入并同步双端

## Promoted

- `dish-745` 夜宵 烤茄子
  - source: Wikimedia Commons, `焼きなす.jpg`
  - license: CC BY-SA 3.0
  - author: Gomurafuji
  - semantic check: 文件标题与视觉复核均明确为烤茄子；图片主体完整、可直接识别
  - normalized to 750x750 WebP and synchronized to frontend and miniprogram

## Verification

- source-cache integrity: passed (`verified=327`, `failures=0`)
- target-mode asset gate: passed (`frontend=853`, `miniprogram=853`, `ledger=331`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=7`
- backlog after batch: 159 rows
- visual spot check: `frontend/assets/foods/dish-745.webp` clearly shows grilled eggplant
- runtime verification: pending because Docker Desktop Linux engine is unavailable
