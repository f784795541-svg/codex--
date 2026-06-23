# 飞牛 NAS 部署说明

这份项目已经整理成适合飞牛 NAS / Lucky Docker 的目录结构。

## 你需要上传什么

把整个项目文件夹上传到 NAS 即可，至少要包含：

- `docker-compose.yml`
- `.env.example`
- `backend/`
- `frontend/`

建议你上传后，把 `.env.example` 复制成 `.env`，再按需修改端口、数据库密码和基础镜像地址。

## 推荐部署方式

1. 把项目整个目录上传到 NAS，例如：
   - `/vol1/docker/body/`
2. 在该目录下复制环境变量文件：

```bash
cp .env.example .env
```

3. 如需修改端口或密码，编辑 `.env`
4. 如果飞牛拉 Docker Hub 不稳定，建议把 `.env` 里的基础镜像改成镜像站地址，例如：

```env
POSTGRES_IMAGE=docker.m.daocloud.io/library/postgres:16-alpine
PYTHON_BASE_IMAGE=docker.m.daocloud.io/library/python:3.12-slim
NGINX_BASE_IMAGE=docker.m.daocloud.io/library/nginx:1.27-alpine
```

5. 在飞牛 Docker / Compose 中导入 `docker-compose.yml`
6. 启动服务

## 默认端口

- 前端：`8080`
- 后端：`8000`

实际对外建议只暴露前端端口，再由 Lucky 做反向代理。

如果你部署到 Windows 服务器，通常可直接保留默认值：

```env
POSTGRES_IMAGE=postgres:16-alpine
PYTHON_BASE_IMAGE=python:3.12-slim
NGINX_BASE_IMAGE=nginx:1.27-alpine
```

## 访问方式

启动后先直接访问：

- `http://NAS_IP:8080`

前端已经改为通过同域 `/api` 调后端，因此：

- 浏览器访问前端时，不需要再单独手改前端 API 地址
- Lucky 反向代理时也只需要代理前端这个入口

## Lucky 建议

推荐这样做：

1. Docker 中先确认前端能从 `http://NAS_IP:8080` 打开
2. Lucky 反向代理只转发一个站点到：

```text
http://127.0.0.1:8080
```

3. 域名示例：

```text
https://health.your-domain.com -> http://127.0.0.1:8080
```

因为前端会把 `/api/...` 自动转发到后端容器，所以 Lucky 不需要单独再配一个 `/api` 规则。

## 数据库位置

数据库是 PostgreSQL，不是单文件 SQLite。

- 容器名：`health_database`
- 数据卷：`postgres_data`
- 容器内目录：`/var/lib/postgresql/data`

## 查看数据库

进入数据库容器：

```bash
docker exec -it health_database psql -U health_user -d health_db
```

查看表：

```sql
\dt
```

查看用户：

```sql
SELECT id, username, name, age, gender, height_cm, weight_kg FROM users;
```

查看食物：

```sql
SELECT food_id, name, category, brand, calories_per_100g, protein, fat, carbs
FROM food_database
ORDER BY food_id
LIMIT 50;
```

## 升级项目

后续你更新项目文件后，在项目目录执行：

```bash
docker compose up -d --build
```

## 备份建议

至少备份这两样：

1. 项目目录本身
2. PostgreSQL 数据卷

如果后面你愿意，我可以继续帮你补一版：

- `DEPLOY_WINDOWS.md`
- `Lucky` 反向代理截图式配置说明
- 备份与迁移说明
