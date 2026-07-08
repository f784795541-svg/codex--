# 数据库迁移说明

本项目从 2026-07-06 起引入 Alembic 管理数据库结构迁移。

## 启动时迁移

`backend/start.sh` 会先执行：

```bash
alembic upgrade head
```

迁移成功后才启动 FastAPI。`seed.py` 仍保留食物库同步和老库兼容能力，但后续新增结构字段应优先写 Alembic migration。

## 大改前备份

任何结构迁移前，先执行：

```powershell
.\scripts\backup_db.ps1
```

确认生成非空 `.dump` 文件后再继续。

## 本地新增迁移

在 `backend/` 目录内执行：

```bash
alembic revision -m "describe_change"
```

编辑生成的 `backend/alembic/versions/*.py`，把结构变更写进 `upgrade()`。避免在迁移里删除用户数据；必须删数据时，先单独备份并明确确认。

## 部署执行迁移

常规部署仍执行：

```bash
docker compose up -d --build backend
```

backend 容器会在启动时自动执行 `alembic upgrade head`。如果迁移失败，容器不会进入正常服务状态，应先查看日志：

```bash
docker logs --tail 200 health_backend
```

## 失败处理

1. 不要执行 `docker compose down -v`。
2. 不要删除 `postgres_data` 数据卷。
3. 查看 `health_backend` 日志确认失败 migration。
4. 如果需要回退数据，按 `BACKUP_AND_RESTORE.md` 使用恢复脚本，且必须带显式确认文本。

## 空数据库初始化

基线迁移 `20260706_0001_baseline_schema.py` 使用幂等 SQL：

- 空数据库可创建当前核心表、字段、索引和 `pg_trgm` 搜索索引。
- 现有数据库可补缺字段和索引，不会删除表或清空数据。
- 食物库数据仍由 `seed.py` 同步。
