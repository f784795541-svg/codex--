# 食物真实图片治理批次 47

日期：2026-09-01

## 执行目标

为 `mcd-686`（麦当劳 开心乐园餐麦乐鸡块）补充可核验的官方商品图，保持双端资源规范，不改变系统架构、数据库表结构或业务接口。

## 执行记录

- 通过麦当劳中国官方产品页确认商品名称、4 块麦乐鸡描述和图片资源。
- 官方图片地址：`https://officiaweb-afd.mcdonalds.com.cn/public/upload/attachment/2022/08/202208091607474918.png`
- 实际查看候选图，确认主体为麦乐鸡块与蘸酱；随后生成 `mcd-686.webp`。
- 同一 WebP 已复制到 `frontend/assets/foods/` 和 `miniprogram/assets/foods/`，并更新两个 manifest。

## 门禁结果

- frontend manifest：841
- miniprogram manifest：841
- 实际资源：841 / 841
- 缺失文件：0
- 超大文件：0
- target-mode failures：0
- 图片审计 high risk：0
- backlog：286 条（P0 30、P1 133、P2 123）

视觉抽检文件：`reports/food_real_photo_batch47_contact.jpg`。

## 运行验证说明

Docker Desktop Linux 引擎仍无法连接；本批已完成静态门禁、本地图片处理和视觉语义抽检，容器内运行回归待 Docker 恢复后执行。
