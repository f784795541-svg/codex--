# Food Real Photo Batch 160

- scope: 夜宵烤五花肉串开放授权图片接入
- result: 1 个 image_key 已接入并同步双端

## Promoted

- `dish-741` 夜宵 烤五花肉串
  - source: Wikimedia Commons, `Butabara pork belly skewers Yakiniku ...`
  - license: CC BY-SA 4.0
  - semantic check: 来源文件标题和视觉复核均明确为猪五花肉串；结构化作者字段缺失，已在台账中保留来源页归属说明
  - normalized to 750x750 WebP and synchronized to frontend and miniprogram

## Verification

- source-cache integrity: passed (`verified=325`, `failures=0`)
- target-mode asset gate: passed (`frontend=853`, `miniprogram=853`, `ledger=329`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=7`
- backlog after batch: 161 rows
- visual spot check: `frontend/assets/foods/dish-741.webp` clearly shows grilled pork belly skewers
- runtime verification: pending because Docker Desktop Linux engine is unavailable
