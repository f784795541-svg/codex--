# 三端业务接口口径

电脑网页端、手机网页端、小程序端可以有不同界面，但核心业务结果必须来自同一套后端接口。

## 登录结果

`POST /auth/login` 和 `POST /auth/register` 返回：

- `user`
- `access_token`
- `token_type`
- `expires_in`

旧客户端仍可继续传 `user_id`。新客户端应保存 `access_token`，后续请求带：

```http
Authorization: Bearer <token>
```

带 token 时，后端以 token 识别出的用户为准；如果请求里的 `user_id` 和 token 用户不一致，返回 403。

## 统一字段

三端都应按同一含义使用：

- 用户资料：`id`、`username`、`name`、`age`、`gender`、`height_cm`、`weight_kg`、`target_weight_kg`、`target_sleep_hours`、`goal`、`activity_level`、`recommendation_mode`、`body_type`、`target_algorithm`
- 食物搜索：`food_id`、`name`、`category`、`brand`、`calories_per_100g`、`protein`、`fat`、`carbs`、`serving_size_g`、`portion_hint`、`cooking_options`、`aliases`、`image_key`
- 记录提交：服务端返回的 `id` 代表真实写入记录 ID
- 报告：首页 `/dashboard/summary`、日报 `/report/daily`、周报 `/report/weekly` 以后端计算结果为准

## 兼容规则

- 修改接口前必须检查网页端、移动端、小程序端调用。
- 新增字段优先可选，不删除旧字段。
- 搜索排序、营养值、图片映射键必须由后端统一返回。
- 三端提交同一天同一账号数据后，应看到一致的首页、日报、周报结果。

## 当前验证

自动化测试已覆盖：

- token 调用和旧 `user_id` 调用同一账号首页结果一致
- 同一关键词在 `web`、`mobile_web`、`miniprogram` 平台参数下返回同一核心搜索结果
