# Food Real Photo Batch 188

- scope: 赛百味巧克力曲奇（`cookie`）
- result: 1 个 image_key 已接入并同步网页端与小程序端；完成来源核验、标准化和视觉语义抽检

## Promoted

- `cookie` 赛百味 巧克力曲奇
  - source: Wikimedia Commons `Chocolate Chip Cookies, Subway Northbridge, 2026 (01).jpg`
  - source tier: third_party_public
  - license: CC BY-SA 4.0（需署名并遵守相同方式共享）
  - semantic check: 文件说明明确为 Subway 巧克力曲奇，图片同时展示 Subway 标识及双巧克力曲奇；作为产品级视觉图接入，不延伸声称中国大陆门店的具体配方或规格
  - image: 已标准化为 750x750 WebP，单张不超过 300KB，并同步到网页端和小程序端

## Verification

- source-cache integrity: passed (`verified=360`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=364`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 126 rows（P1=30、P2=96）
- visual spot check: production WebP clearly shows Subway cookies and branding
- runtime verification: pending because Docker Desktop Linux engine is unavailable
