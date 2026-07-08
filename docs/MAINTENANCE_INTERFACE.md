# 轻量维护接口

维护接口默认不开放。必须在 `.env` 设置：

```env
MAINTENANCE_TOKEN=CHANGE_ME_LONG_RANDOM_MAINTENANCE_TOKEN
```

然后重启 backend：

```bash
docker compose up -d --build backend
```

访问：

```http
GET /maintenance/summary
X-Maintenance-Token: <MAINTENANCE_TOKEN>
```

返回内容包括：

- 用户数量
- 食物库总数
- 最近搜索词
- 最近未命中词
- 高频未命中词
- 通用图片键条目数量和示例
- 营养数据异常条目
- 最近 500 类接口错误
- 备份目录状态

不要把维护 token 写入前端代码、小程序代码、截图、日志或文档示例的真实值中。
