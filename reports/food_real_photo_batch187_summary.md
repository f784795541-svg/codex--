# Food Real Photo Batch 187

- scope: 山姆牛肉卷（`sams-682`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `sams-682` 山姆 牛肉卷
  - source: Wikimedia Commons `Beef Wrap (25450201374).jpg`
  - source tier: third_party_public
  - license: CC BY 2.0（需署名）
  - semantic check: 文件标题为 Beef Wrap，图片清晰展示切开的牛肉馅 tortilla wrap；作为菜品级视觉图接入，不宣称山姆官方产品、包装或配方
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=359`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=363`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 127 rows（P1=31、P2=96）
- visual spot check: production WebP clearly shows a beef-filled wrap
- runtime verification: pending because Docker Desktop Linux engine is unavailable
