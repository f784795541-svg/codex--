# Food Real Photo Batch 184

- scope: 米村拌饭辣牛肉石锅拌饭（`micun-294`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `micun-294` 米村拌饭 辣牛肉石锅拌饭
  - source: Wikimedia Commons `Hot stone pot bibimbap with beef (Bulgogi dolsot bibimbap) - Kogi 2023-10-16.jpg`
  - source tier: third_party_public
  - license: CC0（无需署名）
  - semantic check: 文件说明明确为牛肉石锅拌饭，图片清晰展示牛肉、石锅、米饭和蔬菜；作为菜品级视觉图接入，不宣称米村拌饭品牌，也不把图片当作“辣味”证明
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=356`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=360`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 130 rows（P1=34、P2=96）
- visual spot check: production WebP clearly shows beef dolsot bibimbap
- runtime verification: pending because Docker Desktop Linux engine is unavailable
