# Food Real Photo Batch 181

- scope: 山姆瑞士卷（`sams-680`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `sams-680` 山姆 瑞士卷
  - source: Wikimedia Commons `Classic roll cake - Ikigai Coffee 2024-09-21.jpg`
  - source tier: third_party_public
  - license: CC0（无需署名）
  - semantic check: 图片清晰展示原味奶油瑞士卷，满足“瑞士卷”直观识别；记录为菜品级视觉图，不宣称山姆官方包装、品牌专供或具体口味/规格
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=353`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=357`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 133 rows（P1=37、P2=96）
- visual spot check: production WebP clearly shows a cream roll cake
- runtime verification: pending because Docker Desktop Linux engine is unavailable
