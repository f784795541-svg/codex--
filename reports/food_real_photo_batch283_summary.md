# Food Real Photo Batch 283

- scope: `dish-582`（蒜蓉小龙虾）候选复核
- result: 未接入生产资源；所有候选均未同时满足成品语义清晰和可用画面标准

## Rejected

- Wikimedia Commons `Garlic Crawfish - 1, June 19, 2023.jpg` / `Garlic Crawfish - 2, June 19, 2023.jpg`：CC BY-SA 4.0，标题匹配，但主体被烹制蒸汽遮挡，无法清晰识别蒜蓉成品形态。
- Wikimedia Commons `Crawfish 01.jpg`：Public domain，但为自然生长特写，不是菜品成品。
- Wikimedia Commons `The Strandloper Restaurant...jpg`：CC BY 2.0，但为餐厅场景，不是蒜蓉小龙虾成品。

## Verification

- 未修改 `food_photo_source_ledger.csv`，未生成错误的 `image_key` 或生产 WebP。
- target-mode asset gate：通过（双端 861 个资源，0 失败）。
- source-cache integrity：通过（443 条 verified，0 失败）。
- image audit：通过（846 foods，572 image keys，high risk 0）。
- runtime verification：待 Docker Desktop Linux 引擎恢复后执行。
