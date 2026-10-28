# 维护接口

维护接口默认不开启。必须先在 `.env` 中设置：

```env
MAINTENANCE_TOKEN=CHANGE_ME_LONG_RANDOM_MAINTENANCE_TOKEN
```

然后重启后端：

```bash
docker compose up -d --build backend
```

请求时需要在 header 中携带：

```http
X-Maintenance-Token: <MAINTENANCE_TOKEN>
```

目前支持的维护接口：

```http
GET /maintenance/summary
POST /maintenance/reset-password
```

`GET /maintenance/summary` 返回内容包括：

- 用户数量
- 食物库总数
- 最近搜索词
- 最近未命中词
- 高频未命中词
- 通用图片键条目数量和示例
- 营养数据异常条目
- 最近 500 类接口错误
- 备份目录状态

`POST /maintenance/reset-password` 请求体示例：

```json
{
  "username": "demo_user",
  "new_password": "12345678"
}
```

适用场景：

- 用户确实忘记密码
- 管理员需要人工重置为临时密码
- 用户登录后再到“我的”页面自行修改

不要把维护 token 写进前端代码、小程序代码、截图、日志或任何公开文档里。
