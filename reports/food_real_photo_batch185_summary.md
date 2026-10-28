# Food Real Photo Batch 185

- scope: 米村拌饭金枪鱼拌饭（`micun-280`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `micun-280` 米村拌饭 金枪鱼拌饭
  - source: Wikimedia Commons `Maguro-tataki-don of Sukiya.jpg`
  - source tier: third_party_public
  - license: CC0（无需署名）
  - semantic check: 文件说明为金枪鱼拌饭，图片清晰展示金枪鱼铺在米饭上；作为菜品级视觉图接入，不宣称米村拌饭品牌，也不延伸声称具体酱料或制作工艺
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=357`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=361`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 129 rows（P1=33、P2=96）
- visual spot check: production WebP clearly shows tuna over rice
- runtime verification: pending because Docker Desktop Linux engine is unavailable
