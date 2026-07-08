# 自动化回归测试

当前核心测试放在 `backend/tests/`，覆盖：

- 指定食物搜索关键词
- 饮食、运动、睡眠、体重真实写入
- 首页、日报、周报同步
- 食物库重复名称和关键字段检查
- 后端健康检查与基础服务接口

运行命令：

```powershell
docker compose up -d --build backend
docker exec health_backend python -m pytest /app/tests
```

测试会创建 `pytest_stability_*` 测试账号和少量记录，不会删除已有用户数据。
