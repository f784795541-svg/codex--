# Food Real Photo Batch 158

- scope: 吉野家芝士牛肉饭候选图片语义复核
- result: 候选全部未通过，未接入生产资源

## Rejected

- `p1-next6/yoshinoya-297-c1.jpg`
- `p1-next6/yoshinoya-297-c2.png`
- `p1-next6/yoshinoya-297-c3.jpg`
- `p1-next6/yoshinoya-297-c4.jpeg`
- `p1-next6/yoshinoya-297-c5.jpg`
- `p1-next6/yoshinoya-297-c6.png`

复核结果：候选均为普通吉野家牛肉饭或套餐图，未明确呈现芝士/奶酪配料，不能代表“芝士牛肉饭”。候选保留在缓存中，不标记为 verified，目标 key 继续使用 fallback 并保留在 backlog。

## Verification

- semantic review: completed
- production assets changed: none
- runtime verification: pending because Docker Desktop Linux engine is unavailable
