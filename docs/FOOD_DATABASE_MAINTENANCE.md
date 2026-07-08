# 食物库与搜索维护流程

本项目继续坚持本地食物库和固定规则，不接外部营养 API，不盲目一次性扩到上万条。

## 未命中搜索导出

最近未命中：

```bash
python scripts/export_food_search_misses.py --limit 50
```

高频未命中：

```bash
python scripts/export_food_search_misses.py --top --limit 50
```

在 Docker 环境中可用 backend 镜像执行：

```powershell
docker run --rm --network body-nas-deploy-final-v2_default --env-file .env -v ${PWD}:/work -w /work body-nas-deploy-final-v2-backend python scripts/export_food_search_misses.py --top --limit 50
```

## 搜索选择回写

客户端搜索后，如果用户选择了某个结果，可调用：

```http
POST /food/search/selection
```

示例字段：

```json
{
  "query": "瑞幸 生椰",
  "food_id": 201,
  "platform": "web",
  "user_id": 1
}
```

登录后建议带 `Authorization: Bearer ...`，后端会校验 `user_id` 和 token 是否一致。

## 食物库检查

运行：

```bash
python scripts/check_food_catalog.py
```

检查内容：

- 重复名称
- 关键字段缺失
- 异常热量或营养值
- 仍使用通用 `meal` 图片键的条目数量和示例

## 补库节奏

1. 每周或每两周导出高频未命中词。
2. 先补家庭日常、连锁餐厅、便利店高频词。
3. 每次补库后运行食物库检查和核心测试。
4. 图片先保证语义正确，再提升质感。
5. 不从不稳定第三方接口自动导入营养值。
