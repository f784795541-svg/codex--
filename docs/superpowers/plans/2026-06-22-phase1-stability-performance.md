# 第一阶段稳定性与性能优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不大改现有页面格局的前提下，修复首页与录入流程中的结构性 bug，降低前端渲染风险，提升页面切换、弹层、滚轮与数据加载的稳定性和流畅度。

**Architecture:** 优先对前端单文件应用中的关键渲染链路做分层兜底，把高频 UI 更新、滚轮弹层定位、面板切换和首页加载拆成更安全的执行路径；后端只做最小必要校验，保证首页数据接口输出更稳定。整个阶段避免改动信息架构，重点优化体验层与容错层。

**Tech Stack:** 原生 HTML/CSS/JavaScript，FastAPI，SQLAlchemy，PostgreSQL，Docker Compose

---

### Task 1: 首页加载链路稳定化

**Files:**
- Modify: `/Users/fujunhao/Desktop/body /frontend/app.js`
- Test: `node --check frontend/app.js`

- [ ] 梳理 `loadDashboard()` 中的串行渲染流程，标出会导致整块内容空白的高风险节点。
- [ ] 为首页关键模块增加更细粒度的安全渲染入口，确保一个模块失败时不会拖垮同屏其它模块。
- [ ] 收敛首页首次加载时的重复 DOM 写入，减少多次同步触发布局。
- [ ] 运行 `node --check frontend/app.js`，确认语法正常。

### Task 2: 面板切换与滚动定位优化

**Files:**
- Modify: `/Users/fujunhao/Desktop/body /frontend/app.js`
- Modify: `/Users/fujunhao/Desktop/body /frontend/styles.css`
- Test: `node --check frontend/app.js`

- [ ] 优化 `showPanel()`、`navigateToPanel()`、`scrollToTarget()` 的执行顺序，减少切换与定位时的突兀感和错位风险。
- [ ] 为顶部七个板块切换建立更稳的激活态与滚动目标逻辑，避免定位不准或动画被打断。
- [ ] 降低切换过程中的强制重排与重复动画触发。
- [ ] 运行 `node --check frontend/app.js`，确认语法正常。

### Task 3: 滚轮弹层与时间选择兼容修复

**Files:**
- Modify: `/Users/fujunhao/Desktop/body /frontend/app.js`
- Modify: `/Users/fujunhao/Desktop/body /frontend/styles.css`
- Test: `node --check frontend/app.js`

- [ ] 统一 `picker` 打开、定位、滚动和关闭逻辑，避免弹层在复杂布局中再次出现遮挡、穿模或定位偏移。
- [ ] 优化时间类选择器的尺寸、居中、数值可视区域和视口边缘处理。
- [ ] 减少滚轮 hover 与 dock 放大效果对页面整体布局的副作用，只作用于弹层内部。
- [ ] 运行 `node --check frontend/app.js`，确认语法正常。

### Task 4: 视觉性能打底

**Files:**
- Modify: `/Users/fujunhao/Desktop/body /frontend/styles.css`
- Test: 页面人工检查

- [ ] 清理高开销但收益不高的阴影、模糊和多层 backdrop 叠加，优先保留关键区域质感。
- [ ] 为高频交互区域补充更合理的 transition、will-change、contain 或渲染隔离策略。
- [ ] 检查全屏和常规窗口下的溢出、裁切、遮挡和留白异常。

### Task 5: 后端首页汇总接口稳健性复查

**Files:**
- Modify: `/Users/fujunhao/Desktop/body /backend/app/services.py`
- Modify: `/Users/fujunhao/Desktop/body /backend/app/main.py`
- Test: `python3 -m py_compile backend/app/*.py`

- [ ] 复查 `/dashboard/summary` 依赖的目标计算、日报生成、体重曲线数据拼装逻辑，补足必要的空值与边界保护。
- [ ] 保证前端首页依赖字段在无数据、少数据、边界数据情况下仍有稳定返回。
- [ ] 运行 `python3 -m py_compile backend/app/*.py`，确认语法正常。

### Task 6: 阶段验证

**Files:**
- Test: `/Users/fujunhao/Desktop/body /frontend/app.js`
- Test: `/Users/fujunhao/Desktop/body /backend/app/*.py`

- [ ] 运行 `node --check frontend/app.js`
- [ ] 运行 `python3 -m py_compile backend/app/*.py`
- [ ] 如有容器运行环境，刷新 `http://localhost:8080/#/overview` 并重点检查：
  - 首页概览是否完整显示
  - 今日饮食建议是否恢复稳定
  - 时间选择器是否完整显示在框内
  - 滚轮弹层是否覆盖在上层且不被正文遮挡
  - 顶部板块切换是否平滑且定位准确
