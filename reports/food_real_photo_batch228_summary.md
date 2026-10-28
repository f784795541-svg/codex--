# Food Real Photo Batch 228

- scope: `mapo-tofu` 麻婆豆腐
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `mapo-tofu` 麻婆豆腐
  - source: Wikimedia Commons `Mapo tofu.JPG`
  - license: CC BY-SA 2.0
  - semantic check: 文件标题明确为 Mapo tofu；原图和标准化后的双端 WebP 都清晰展示红油、花椒、葱花与豆腐块组成的麻婆豆腐成品。
  - use note: 作为菜品级视觉，不宣称任何餐厅或品牌的官方商品图；使用时保留署名与相同方式共享义务。

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端和小程序端资源及 manifest 保持一致
- `麻婆豆腐` 已从共享 `tofu-dish` 家族拆出精确 `mapo-tofu` key；`砂锅豆腐`、`锅塌豆腐` 等仍保留原 fallback，避免串图。

## Verification

- source-cache integrity: passed (`verified=416`, `failures=0`)
- target-mode asset gate: passed (`frontend=861`, `miniprogram=861`, `ledger=420`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=572`, `high=0`)
- backlog after batch: 71 rows（P1=10、P2=61）；共享 `tofu-dish` fallback 仍单独保留
- visual spot check: 已检查 Commons 候选原图及双端标准化后的 `mapo-tofu.webp`
- runtime verification: pending because Docker Desktop Linux engine is unavailable
