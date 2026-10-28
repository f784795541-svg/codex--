# 食物真实图片治理批次 50

日期：2026-09-01

## 执行目标

为 `yili-515`（伊利优酸乳原味）补齐可识别商品图，保持双端 750×750 WebP 规范，不改变系统架构、数据库表结构或业务接口。

## 执行记录

- 伊利官网产品页确认“优酸乳原味”产品存在，但页面主图为含其他口味的活动海报，不作为该单品图片使用。
- 采用公开零售商品图，画面可识别伊利、优酸乳、原味和 250ml 包装；来源级别如实登记为 `retail_public`。
- 生成并同步 `yili-515.webp` 至前端和小程序资源目录，更新两个 manifest。

## 门禁结果

- frontend manifest：841
- miniprogram manifest：841
- 实际资源：841 / 841
- 缺失文件：0
- 超大文件：0
- target-mode failures：0
- 图片审计 high risk：0
- backlog：283 条（P0 27、P1 133、P2 123）

视觉抽检文件：`reports/food_real_photo_batch50_contact.jpg`。

## 运行验证说明

Docker Desktop Linux 引擎仍无法连接；本批已完成静态门禁、本地图片处理和视觉语义抽检，容器内运行回归待 Docker 恢复后执行。
