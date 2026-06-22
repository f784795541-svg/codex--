# 项目协作说明

## 项目概览

- 项目名称：轻量级健康管理 Web 系统
- 目标：基于本地数据库、固定公式、规则引擎实现饮食、运动、睡眠、体重记录与分析
- 禁止事项：不接入 AI 模型、不接入生成式推荐、不依赖外部智能接口
- 当前技术栈：
  - 后端：FastAPI + SQLAlchemy + Pydantic
  - 数据库：PostgreSQL
  - 前端：原生 HTML / CSS / JavaScript
  - 部署：Docker Compose

## 包管理与依赖

- 后端包管理：`pip`
- 后端依赖文件：`/Users/fujunhao/Desktop/body /backend/requirements.txt`
- 前端无 `package.json`，当前不使用 npm / pnpm / yarn
- 容器编排文件：`/Users/fujunhao/Desktop/body /docker-compose.yml`

## 启动与构建命令

- 一键启动：
  - `docker compose up -d --build`
- 单独重建后端：
  - `docker compose up -d --build backend`
- 单独重建前端：
  - `docker compose up -d --build frontend`
- 查看容器状态：
  - `docker ps`
- 查看后端日志：
  - `docker logs --tail 200 health_backend`
- 查看前端日志：
  - `docker logs --tail 200 health_frontend`
- 后端本地语法检查：
  - `python3 -m py_compile backend/app/*.py`
- 前端本地语法检查：
  - `node --check frontend/app.js`

## 常用访问地址

- 前端首页：
  - `http://localhost:8080/`
- 前端概览页：
  - `http://localhost:8080/#/overview`
- 后端健康检查：
  - `http://localhost:8000/health`
- 后端 Swagger：
  - `http://localhost:8000/docs`

## 修改代码后必须执行的验证步骤

- 修改后端 Python 代码后必须执行：
  - `python3 -m py_compile backend/app/*.py`
- 修改前端 JavaScript 后必须执行：
  - `node --check frontend/app.js`
- 修改 `backend/app/foods.json`、`models.py`、`schemas.py`、`services.py`、`main.py` 任一文件后：
  - 必须重新同步后端容器并重启 `health_backend`
- 修改 `frontend/index.html`、`frontend/app.js`、`frontend/styles.css` 或 `frontend/assets/` 后：
  - 必须重新同步前端容器并重启 `health_frontend`
- 如果改动影响容器内运行结果，必须同步到运行中的容器或重建：
  - 前端快速同步：
    - `docker cp frontend/. health_frontend:/usr/share/nginx/html/`
  - 后端快速同步：
    - `docker cp backend/app/. health_backend:/app/app/`
  - 同步后建议重启对应容器：
    - `docker restart health_backend health_frontend`
- 至少验证以下接口或页面之一：
  - `curl -s http://localhost:8000/health`
  - 刷新 `http://localhost:8080/#/overview`
- 如果首页数据区显示不出来，优先检查：
  - `docker logs --tail 200 health_backend`
  - 重点确认 `/dashboard/summary` 是否报 500

## 提交前检查

- 确认前后端语法检查通过
- 确认 Docker 中前端和后端服务可访问
- 确认新增字段如果涉及数据库模型，同时补充迁移逻辑到 `backend/app/seed.py`
- 确认前端新增表单项已经接入：
  - 页面元素
  - JS 读写逻辑
  - 后端 schema
  - 后端持久化

## 代码风格约定

- 通用：
  - 默认使用 ASCII；除中文文案或已有中文文件外，不主动引入无必要的特殊字符
  - 尽量保持函数职责单一，命名直接清晰
  - 避免引入重量级新依赖，优先复用现有结构
- 后端：
  - 逻辑集中在 `services.py`
  - 路由集中在 `main.py`
  - 数据结构在 `schemas.py`
  - 模型变更时同步更新 `models.py` 和迁移逻辑
  - `DashboardSummaryResponse.targets` 当前是 `dict[str, float]`
  - 不要往 `targets` 中写入字符串、日期字符串或复杂对象，除非先同步改 schema
- 前端：
  - 继续维持单文件原生 JS 结构，不要突然切框架
  - 新增交互优先复用已有状态对象 `state`
  - 面板切换统一走 `showPanel` / `navigateToPanel`
  - 选择器/滚轮类交互优先复用已有 `picker` 风格
  - 概览页布局已多次被用户微调，默认先做局部修改，避免整体重写 `hero` 区

## 子目录规则

### 后端 `backend/`

- Dockerfile：`/Users/fujunhao/Desktop/body /backend/Dockerfile`
- 依赖安装来源：`requirements.txt`
- 验证命令：
  - `python3 -m py_compile backend/app/*.py`
- 额外注意：
  - `backend/app/foods.json` 是核心种子数据
  - `backend/app/seed.py` 负责初始化与轻量迁移
  - 新增数据库字段时不要只改模型，必须补迁移逻辑

### 前端 `frontend/`

- Dockerfile：`/Users/fujunhao/Desktop/body /frontend/Dockerfile`
- 主要文件：
  - `frontend/index.html`
  - `frontend/app.js`
  - `frontend/styles.css`
- 验证命令：
  - `node --check frontend/app.js`
- 额外注意：
  - 当前前端为纯静态页面，由 Nginx 直接托管
  - 新增页面入口通常通过 hash 路由和面板切换实现
  - 图片资源放在 `frontend/assets/`

### 数据与脚本

- `backend/app/foods.json`：
  - 属于项目内置营养数据库
  - 修改时注意 `food_id` 唯一且连续性尽量稳定
- 当前项目没有独立脚本目录
- 不要在工作区外创建新的运行时依赖文件

## 不能触碰的目录、密钥、外部系统

- 不要修改以下目录中的内部缓存或系统文件：
  - `/Users/fujunhao/Desktop/body /.git`
  - `/Users/fujunhao/Desktop/body /.agents`
  - `/Users/fujunhao/Desktop/body /.codex`
- 不要提交或硬编码任何密钥、密码、Token
- 不要依赖收费或不稳定的外部营养 API
- 不要擅自接入苹果健康、小米健康、微信运动等外部系统
  - 当前阶段只能做“预留说明”或本地数据结构准备

## 当前实现的重要事实

- 后端接口已包含：
  - 认证：`/auth/register`、`/auth/login`
  - 用户：`/user/info`、`/user/update`
  - 食物：`/food/database`、`/food/search`、`/food/create`、`/food/log`
  - 运动：`/workout/options`、`/workout/estimate`、`/workout/log`
  - 睡眠：`/sleep/log`
  - 体重：`/weight/log`、`/weight/history`
  - 报告：`/report/daily`、`/report/weekly`
  - 首页汇总：`/dashboard/summary`
- 当前前端是“单页多面板”模式，不是真正多 HTML 页面
- 当前 Docker 同步习惯：
  - 开发期通常直接 `docker cp` 到现有容器，不一定每次 `docker compose up -d --build`
- 当前体型功能定位：
  - 作为用户档案与说明性模块存在
  - 经典热量算法仍为主算法
  - `体型参考版` 仅作为预留选项，不应在没有可靠依据前强行改变核心公式

## 建议的工作顺序

1. 先看 `README.md` 和本文件
2. 再看 `backend/app/main.py`、`services.py`、`models.py`
3. 前端改动时同时检查 `index.html`、`app.js`、`styles.css`
4. 完成修改后先做语法检查，再同步或重启容器
