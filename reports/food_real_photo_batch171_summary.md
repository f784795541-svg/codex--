# Food Real Photo Batch 171

- scope: 补齐米村拌饭与盒马菜品的真实菜品图
- result: 3 个 image_key 已接入并同步网页端与小程序端；候选均完成视觉语义抽检

## Promoted

- `micun-279` 米村拌饭 石锅拌饭
  - Wikimedia Commons `Dolsot-bibimbap.jpg`，CC BY 2.0，需署名
  - 石锅、蔬菜和鸡蛋主体清晰；按菜品级图片使用，不宣称为米村拌饭官方图

- `micun-676` 米村拌饭 韩式炸鸡
  - Wikimedia Commons `Yangnyeom Chicken Korean fried chicken.jpg`，CC0
  - 韩式甜辣炸鸡主体清晰；按菜品级图片使用，不宣称为米村拌饭官方图

- `hema-679` 盒马 鲜虾云吞面
  - Wikimedia Commons `Shrimp wonton noodle soup.jpg`，CC BY-SA 2.0，需署名
  - 虾仁云吞、面条和汤底主体清晰；按菜品级图片使用，不宣称为盒马官方图

三张图片均已标准化为 750x750 WebP、单张不超过 300KB，并同步到网页端和小程序端。来源 URL、采集日期、缓存路径和版权说明已写入来源台账。

## Verification

- source-cache integrity: passed (`verified=343`, `failures=0`)
- target-mode asset gate: passed (`frontend=860`, `miniprogram=860`, `ledger=347`, `failures=0`)
- image audit: `foods=846`, `image_keys=571`, `high=0`
- backlog after batch: 143 rows (`P1=47`, `P2=96`)
- visual spot check: all three production WebP files clearly show the intended dish type
- runtime verification: pending because Docker Desktop Linux engine is unavailable
