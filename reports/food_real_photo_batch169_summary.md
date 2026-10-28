# Food Real Photo Batch 169

- scope: 复核 `sams-721`（山姆提拉米苏杯）候选图
- result: 候选未通过语义核验，未接入生产

## Rejected

- `reports/candidate_images/sams-721/candidate-4`
  - 实际内容为透明塑料杯/茶水宣传图，与提拉米苏不符
- 其余候选分别为普通提拉米苏蛋糕、非目标器皿或带明显第三方水印，无法证明是山姆提拉米苏杯

已撤销本批临时台账记录，并恢复 `sams-721` 原有插画 fallback。没有错误商品图留在网页端或小程序端。

## Verification

- source-cache integrity: passed (`verified=337`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=341`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog remains: 149 rows (`P1=53`, `P2=96`)
- visual spot check: restored `sams-721.webp` is the original local fallback
- runtime verification: pending because Docker Desktop Linux engine is unavailable

## Next

- Keep `sams-721` in P1 backlog until a real tiramisu cup/product image is verified.
- Continue reviewing the remaining P1 candidates without lowering semantic requirements.
