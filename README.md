# 轻量级健康管理 Web 系统

一个完全基于“食物数据库 + 数学公式 + 规则引擎”的健康记录与分析系统，不包含任何 AI 能力。

## 技术栈

- 后端：FastAPI
- 数据库：PostgreSQL
- 前端：静态 HTML / CSS / JavaScript
- 部署：Docker + docker-compose

## 功能

- 用户基础信息管理
- 内置 100+ 常见食物营养数据库
- 饮食记录与营养自动换算
- 运动记录
- 睡眠记录
- 日报 / 周报
- 固定公式计算 BMR、TDEE、每日目标
- 基于 if/else 的规则建议
- 支持手动新增自定义食物

## 启动

```bash
docker-compose up -d --build
```

启动后访问：

- 前端：[http://localhost:8080](http://localhost:8080)
- 后端 API：[http://localhost:8000/docs](http://localhost:8000/docs)

## API

- `POST /user/create`
- `GET /user/info`
- `GET /food/search`
- `GET /food/database`
- `POST /food/create`
- `POST /food/log`
- `POST /workout/log`
- `POST /sleep/log`
- `GET /report/daily`
- `GET /report/weekly`

## 计算规则

- BMR：Mifflin-St Jeor
- TDEE：`BMR × activity_factor`
- 减脂目标：`TDEE - 400`
- 蛋白质目标：`weight × 1.6`
- 脂肪目标：`weight × 0.8`
- 碳水目标：剩余热量 / 4

## 说明

- 系统不调用任何外部 AI 或营养 API
- 食物营养值为内置参考数据，可继续扩展
- 如需新增食物，可调用 `POST /food/create`
