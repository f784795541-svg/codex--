# 食物真实图片治理批次 49

日期：2026-09-01

## 执行目标

为 `yili-512`（伊利纯牛奶）补充可识别的标准商品图，保持双端 750×750 WebP 规范，不改变系统架构、数据库表结构或业务接口。

## 执行记录

- 通过京东公开零售图片确认伊利纯牛奶 250ml 包装主体。
- 对原促销图裁剪去除价格和活动文字，仅保留商品包装，再生成 `yili-512.webp`。
- 同一 WebP 已复制到前端和小程序资源目录，并更新两个 manifest。

## 门禁结果

- frontend manifest：841
- miniprogram manifest：841
- 实际资源：841 / 841
- 缺失文件：0
- 超大文件：0
- target-mode failures：0
- 图片审计 high risk：0
- backlog：284 条（P0 28、P1 133、P2 123）

视觉抽检文件：`reports/food_real_photo_batch49_contact.jpg`。

## 运行验证说明

Docker Desktop Linux 引擎仍无法连接；本批已完成静态门禁、本地图片处理和视觉语义抽检，容器内运行回归待 Docker 恢复后执行。
