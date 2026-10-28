# Food Real Photo Batch 153

- scope: semantic triage of existing candidate caches for backlog items
- result: three candidates rejected; no production assets changed

## Rejected candidates

- `nayuki-taro-tea-c1.jpg` — candidate shows the Taj Mahal, not 奈雪 芋泥宝藏茶.
- `chicken-salad-bowl-c1.jpg` — candidate shows a packaged shrimp salad; it does not show the target 山姆凯撒鸡肉沙拉.
- `dish-370-search/candidate-1.jpg` — candidate shows braised chicken wings, but no visible Coca-Cola product or unambiguous cola flavor cue; it cannot represent 可乐鸡翅 under the semantic gate.

These candidates remain outside production and their target keys stay in the fallback backlog. The rejection prevents visually plausible but semantically incorrect images from being promoted later.

## Verification

- semantic triage: completed for the three candidates above
- target-mode production resources: unchanged
- runtime verification: pending because Docker Desktop Linux engine is unavailable
