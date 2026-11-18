# 微信小程序目录说明

这是项目的原生微信小程序版本首版工程，和现有 `frontend/` 网页端并行存在，不互相替换。

## 当前范围

- 已搭建原生小程序目录与开发配置
- 已落地页面：
  - `首页`
  - `好友 PK`
  - `记录`
  - `今日饮食记录`
  - `近期饮食记录`
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
  - `/report/food-history`
  - `/wechat/session`
  - `/wechat/steps`
  - `/wechat/device-link/*`
  - `/friend-pk/*`

## 当前限制

- 当前通过微信会话自动建立账户，保存用户资料及 Bearer token；已保存的健康账户优先恢复。
- 趋势页已有体重图表、日报和周报。首次自动建号使用默认资料，用户应在「我的」确认实际资料。
- 新手引导第 4 步要求用户保存确认身体资料，避免默认值持续参与热量计算。
- 「我的 > 数据与支持」支持导出当前账号资料与全部记录、检查微信正式版更新及提交问题反馈。
- 朋友圈单页模式显示公开示例，不登录、不加载个人健康数据；正常打开后恢复自己的账户。
- 正式发布前仍需在 Android 和 iOS 真机验证分享、微信运动授权及完整记录链路。

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
   - 新用户微信会话初始化
   - 已有账户恢复
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

## 微信转发

- 所有页面均支持通过右上角「...」菜单转发给微信好友或群聊。
- 所有页面也支持右上角菜单「分享到朋友圈」。朋友圈卡片保留当前页面路径，清空查询参数，使用固定标题与封面。
- 分享标题与固定封面统一在 `utils/share.js` 中配置。好友分享进入首页；朋友圈先打开公开示例，再通过微信自带的「前往小程序」进入完整服务。
- 分享使用 `assets/share-cover.png`，不会截取当前页面的健康记录或设备绑定码。
- 离线验证：在仓库根目录运行 `node scripts/check_miniprogram_share.cjs` 和 `node scripts/check_miniprogram_session.cjs`。
- 运行验证：微信开发者工具开启原生自动化端口 `9420` 后，在仓库根目录运行 `node scripts/verify_miniprogram_runtime.cjs`。脚本创建独立测试账号，验证七页分享、四类记录和报告；测试凭据只留在内存，完成后恢复原账户，测试数据会保留在数据库。
- 再在真机检查右上角菜单、两种分享卡片、朋友圈公开预览和完整小程序入口。
- 本地修改后，需要在微信开发者工具重新上传、提审并发布，微信中的正式版才会更新；普通用户使用正式版验收。

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

- 微信账户初始化 / 首页 / 记录 / 趋势 / 我的完整主链路
- 接口真实联调与提交回归
- 首页、记录、趋势、我的四主屏的成品化信息密度和视觉收口

上传前仍建议至少完成一次开发者工具联调和一次真机回归。
