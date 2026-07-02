# 微信小程序目录说明

这是项目的原生微信小程序版本首版工程，和现有 `frontend/` 网页端并行存在，不互相替换。

## 当前范围

- 已搭建原生小程序目录与开发配置
- 已落地页面：
  - `登录`
  - `注册`
  - `首页`
  - `记录`
  - `趋势`
  - `我的`
- 已接入接口：
  - `/auth/login`
  - `/auth/register`
  - `/dashboard/summary`
  - `/food/search`
  - `/food/log`
  - `/workout/options`
  - `/workout/estimate`
  - `/workout/log`
  - `/sleep/log`
  - `/weight/log`
  - `/weight/history`
  - `/report/daily`
  - `/report/weekly`
  - `/user/info`
  - `/user/update`

## 当前限制

- 首版仍复用现有后端登录方式：登录成功后本地存 `user` 对象，不是 token 鉴权
- 趋势页当前先用摘要和列表，未上图表
- 当前版本已完成成品级首轮精修，但正式提审前仍建议做一次真机回归

## 使用方式

1. 微信开发者工具打开 `miniprogram/`
2. 当前已填入小程序 AppID：`wxfcfff339561d5671`
3. 开发期可参考 [project.private.config.example.json](/C:/Users/admin/Documents/Codex/2026-06-22/docker-docker/work/body-nas-deploy-final-v2/miniprogram/project.private.config.example.json) 自建本地私有配置
4. 如本地调试未配置正式域名，可在开发者工具里临时关闭域名校验
5. 上线前必须配置正式 HTTPS 接口域名

## 需要改的配置

接口基础地址在：

- [utils/config.js](/C:/Users/admin/Documents/Codex/2026-06-22/docker-docker/work/body-nas-deploy-final-v2/miniprogram/utils/config.js)

当前已填入正式接口地址：

```js
const API_BASE = "https://health.fujunhao.cn:2345/api";
```

当前按你最新确认的信息，公网联调实际走 `https://health.fujunhao.cn:2345`。

## 上传前清单

1. 微信后台配置 `request合法域名` 时，先以你当前真实联调地址为准核对
2. 确认该域名证书有效，且能从手机微信外网访问
3. 在微信开发者工具里至少跑一遍：
   - 登录
   - 注册
   - 首页加载
   - 饮食记录提交
   - 运动记录提交
   - 睡眠记录提交
   - 体重记录提交
   - 我的页保存
4. 准备并核对以下提审信息：
   - 小程序名称：`雾屿轻养`
   - 小程序简介：`用更轻的方式管理每天的健康节奏。记录饮食、运动、睡眠与体重，查看变化趋势和完成情况，让坚持变得更简单。`
   - 类目：`工具 > 健康管理`
   - 服务口径：日常健康记录、饮食/运动/睡眠/体重管理、每日目标与趋势查看，不涉及医疗诊断和治疗
5. 真机再跑一遍主链路后再上传代码

## 微信后台配置建议

- 原生小程序首版重点配置：
  - `request合法域名`
- 如果后面加上传功能，再补：
  - `uploadFile合法域名`
- 当前版本不依赖：
  - `业务域名`
  - `socket合法域名`
  - `udp合法域名`
  - `tcp合法域名`

## 当前阶段判断

这版已经不再是“只有空骨架”，而是“可导入、可联调、可直接进入上传前验收”的可用工程。

当前已具备：

- 登录 / 注册 / 首页 / 记录 / 趋势 / 我的 六页完整主链路
- 接口真实联调与提交回归
- 首页、记录、趋势、我的四主屏的成品化信息密度和视觉收口

上传前仍建议至少完成一次开发者工具联调和一次真机回归。
