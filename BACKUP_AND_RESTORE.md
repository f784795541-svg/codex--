# 数据库备份与恢复

本项目的 PostgreSQL 数据在 Docker 命名卷中：

- 容器名：`health_database`
- 数据卷：`body-nas-deploy-final-v2_postgres_data`
- 容器内目录：`/var/lib/postgresql/data`

正常执行 `docker compose up -d --build` 或重建 `backend`、`frontend` 不会删除该数据卷。不要执行 `docker compose down -v`，也不要手动删除 `postgres_data` 数据卷，除非你已经确认要清空数据库并且有可用备份。

## 备份

Windows / PowerShell 环境优先使用：

```powershell
.\scripts\backup_db.ps1
```

备份文件默认保存到：

```text
backups\db\
```

文件名格式类似：

```text
health_db-20260706-153000.dump
```

脚本使用 `pg_dump -Fc` 在 `health_database` 容器内导出，再复制到项目目录下的 `backups\db`。备份过程只读数据库，不会停止当前服务。

也可以指定输出目录或文件名：

```powershell
.\scripts\backup_db.ps1 -OutputDir D:\health-backups -FileName health_db-before-upgrade.dump
```

## 恢复

恢复会覆盖当前项目数据库。恢复前必须确认：

1. 已经额外生成一份最新备份。
2. 备份文件来自本项目数据库。
3. 当前确实要把数据库回退到该备份状态。
4. 没有正在提交重要记录的用户。

恢复命令必须带显式确认文本：

```powershell
.\scripts\restore_db.ps1 -BackupPath .\backups\db\health_db-YYYYMMDD-HHMMSS.dump -ConfirmRestore -ConfirmText "RESTORE health_database"
```

恢复脚本只操作 `health_database` 容器中的 `POSTGRES_DB`，不会访问系统其它数据库，也不会删除项目目录文件。

## 每日自动备份（Windows + Docker Desktop）

项目提供 Windows 计划任务注册脚本。它每天运行一次现有的只读导出脚本，数据库容器不需要停止：

```powershell
.\scripts\register_backup_task.ps1
```

默认每日 `03:00` 备份。仅在当前 Windows 用户保持登录、Docker Desktop 正常运行时执行；这是为了让任务使用当前用户的 Docker 上下文，避免系统账户无法访问 Docker Desktop。可自定义时间：

```powershell
.\scripts\register_backup_task.ps1 -DailyAt 02:30
```

备份仍写入 `backups\db\`，任务日志写入 `backups\logs\daily-backup.log`。如需停用自动任务：

```powershell
.\scripts\register_backup_task.ps1 -Remove
```

脚本不会自动删除旧备份。请定期把至少一份近期 `.dump` 复制到另一块磁盘或可信云盘，并按可用空间人工清理过期副本。

## 恢复演练

建议每次大版本发布前做一次恢复演练：先执行一份新备份，再用一份较早的副本恢复到临时环境或维护窗口，最后访问 `/health`、登录并核对一条历史记录。恢复会覆盖当前数据库，生产数据不能直接拿来试错。

## 查看用户反馈

反馈会先写入 PostgreSQL，管理员可在项目根目录运行以下命令查看，不会在终端打印维护凭证：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\list_feedback.ps1
```

如需把新反馈自动发送到邮箱，再在 `.env` 配置 `FEEDBACK_SMTP_*` 项。SMTP 密码只能保存在本机 `.env`，不要提交到 Git 仓库。

## 大改前流程

每次做数据库结构、账号权限、迁移脚本、批量食物库导入等高风险改动前，先执行：

```powershell
.\scripts\backup_db.ps1
```

确认输出了非空 `.dump` 文件后，再继续改动。

## 部署环境注意事项

- `.env` 不要提交到仓库。
- 生产环境必须修改 `.env` 中的 `POSTGRES_PASSWORD` 和 `APP_SECRET_KEY`，不要继续使用示例值。
- 备份文件可能包含用户资料和记录数据，不要公开分享。
- 建议定期把 `backups\db` 中的重要备份复制到另一块磁盘、外置盘或可信云盘。
