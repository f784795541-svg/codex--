# Food Real Photo Batch 148

- target image key: `chicken-gizzard`
- food: 卤鸡胗
- result: deferred; no candidate passed the semantic gate

## Candidate review

The search returned several pages labeled as 卤鸡胗/鸡胗, but visual review found the downloaded images were whole braised chicken, chicken legs, or raw gizzard slices rather than a clearly identifiable cooked/braised chicken-gizzard dish. They were rejected to avoid a semantic false match.

- rejected: `https://pic3.zhimg.com/v2-5b6e143abbd481d78d6cefe311d30d0e_r.jpg` — whole roasted chicken, not gizzard
- rejected: `https://pic.nximg.cn/file/20221205/27916432_112239208108_2.jpg` — whole braised chicken, not gizzard
- rejected: `https://i2.chuimg.com/68836cd846bd406583263dcae89c0e7c_1080w_1184h.jpg` — whole chicken dish, not gizzard
- rejected: `https://upload.wikimedia.org/wikipedia/commons/7/74/Chicken_gizzard_slices.jpg` — raw gizzard slices, not 卤制成品

No source-ledger `verified` row or production asset was added in this batch. The existing SVG/WebP fallback remains in place and `chicken-gizzard` stays in the P2 backlog.

## Verification

- semantic review: passed as a rejection decision; no false-positive asset promoted
- runtime verification: pending because Docker Desktop Linux engine is unavailable
