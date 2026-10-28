# Food Real Photo Batch 220

- scope: `nayuki-taro-tea` 奈雪 芋泥宝藏茶
- result: 1 个 `image_key` 已接入并同步网页端与小程序端，完成来源核验、标准化和视觉语义抽检

## Promoted

- `nayuki-taro-tea` 奈雪 芋泥宝藏茶
  - source: Sina media image associated with 奈雪的茶宝藏奶茶发布内容
  - source tier: near-product photo（媒体实拍，不宣称为官方包装图）
  - semantic check: 画面清晰展示奈雪品牌杯体、芋泥色奶茶和配料层次，与该饮品名称匹配；未采用泛甜品或错误规格图片

## Image standard

- 双端资源统一为 750×750 WebP
- 单张资源不超过 300KB
- 网页端、小程序端资源与 manifest 保持一致

## Verification

- source-cache integrity: passed (`verified=411`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=415`, `failures=0`)
- image audit: passed (`foods=846`, `image_keys=571`, `high=0`)
- backlog after batch: 75 rows（P1=13，P2=62）
- visual spot check: 已检查候选原图与标准化后的 `nayuki-taro-tea.webp`
- runtime verification: pending because Docker Desktop Linux engine is unavailable
