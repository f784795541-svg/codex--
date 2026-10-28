# Food Real Photo Batch 149

- target image key: `yoshinoya-297`
- food: 吉野家 芝士牛肉饭
- result: deferred; candidate rejected by semantic and provenance gates

## Candidate review

The cached candidate `reports/candidate_images/yosh297-next/candidate-3` shows a branded bowl with sliced beef, but the image does not clearly show a rice base or a distinct cheese/cheese-sauce layer. It also contains a prominent third-party watermark (`销量 TOP1`) and is not accompanied by a verifiable reuse license or an official 吉野家 source page. It therefore cannot be promoted to the production asset.

No source-ledger `verified` row or production asset was added in this batch. The existing fallback remains in place and `yoshinoya-297` stays in the P1 backlog.

## Verification

- semantic review: rejected; dish identity is not sufficiently unambiguous for “芝士牛肉饭”
- provenance/licensing review: rejected; third-party watermarked image with no verified reuse permission
- runtime verification: pending because Docker Desktop Linux engine is unavailable
