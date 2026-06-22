# 健康管理系统 UI 交互高级化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不破坏现有整体布局的前提下，修复滚轮选择器的页面跳动与显示问题，并把全站交互、切换、视觉层次提升到更顺滑、更高级的成品状态。

**Architecture:** 以前端原生 `HTML/CSS/JS` 为主，保持现有 hash 面板结构、卡片布局、数据接口不变。核心策略是把“滚轮选择器”从文档流内展开改为真正的悬浮交互层，同时统一动效曲线、局部反馈、滚动定位策略和视觉 token，避免再次牵动已确认的业务结构。

**Tech Stack:** HTML, CSS, Vanilla JavaScript, Nginx static frontend, FastAPI backend, Docker Compose

---

## 文件结构与职责

**主要修改文件：**
- `frontend/app.js`
  - 负责选择器打开/关闭、自动定位、面板切换、提交后回跳、局部交互反馈
- `frontend/styles.css`
  - 负责滚轮浮层、卡片悬停、按钮反馈、动效节奏、响应式细节
- `frontend/index.html`
  - 仅在必要时补充选择器挂载容器或更稳定的交互标记，不改整体页面框架

**验证文件：**
- `backend/app/*.py`
  - 本轮不改逻辑，但仍执行语法检查，防止前端联调时忽略项目级验证要求

---

### Task 1: 把所有滚轮从“撑开页面”改成“真正浮层”

**Files:**
- Modify: `frontend/app.js`
- Modify: `frontend/styles.css`
- Test: 手动验证 `http://localhost:8080/`

- [ ] **Step 1: 梳理当前滚轮入口与触发方式**

Run:

```bash
rg -n "openPickerPanel|closeAllPickerPanels|bindPickerTrigger|picker-panel|picker-field" frontend/app.js frontend/styles.css
```

Expected:
- 找到现有所有滚轮相关函数和样式入口

- [ ] **Step 2: 在 `frontend/app.js` 中把选择器打开行为改成“悬浮层模式”**

Implementation notes:

```js
function openPickerPanel(panelId, currentValue = "") {
  closeAllPickerPanels(panelId);
  const panel = $(panelId);
  if (!panel) return;

  const field = panel.closest(".picker-field");
  field?.classList.add("is-open");
  panel.classList.remove("hidden");

  requestAnimationFrame(() => {
    scrollPickerToCurrent(panel, currentValue);
    bringPickerFieldIntoView(field);
  });
}
```

- [ ] **Step 3: 增加“点击哪里就把该区域柔和带到视野中央附近”的定位函数**

Implementation notes:

```js
function bringPickerFieldIntoView(field) {
  if (!field) return;
  const rect = field.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const targetTop = window.scrollY + rect.top - Math.max(120, viewportHeight * 0.22);

  window.scrollTo({
    top: Math.max(0, targetTop),
    behavior: "smooth",
  });
}
```

要求：
- 不要把字段顶到最顶部
- 保证字段附近上下文仍可见
- 让用户点开后能直接在当前区域完成后续操作

- [ ] **Step 4: 在 `frontend/styles.css` 中把滚轮面板改成真正覆盖式浮层**

Implementation notes:

```css
.picker-field {
  position: relative;
  overflow: visible;
}

.picker-field.is-open {
  z-index: 60;
}

.picker-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  width: 100%;
  margin-top: 0;
  background: rgba(255, 250, 244, 0.98);
  box-shadow: 0 28px 60px rgba(56, 36, 21, 0.18);
}
```

要求：
- 不能再把下面内容挤开
- 要覆盖下方内容，而不是与下方内容混在一起
- 背景透明度要足够低，避免“数字透模”

- [ ] **Step 5: 处理祖先容器裁切问题**

Implementation notes:

```css
#panel-food .card,
#panel-activity .card,
#panel-trend .card,
#panel-assessment .card,
#panel-settings .card {
  overflow: visible;
}
```

要求：
- 只局部放开，不重写全站卡片结构
- 优先修正包含表单与滚轮的业务区域

- [ ] **Step 6: 手动验证滚轮基础行为**

Checklist:
- 点击数值框时，页面轻柔定位到当前字段附近
- 浮层覆盖下方内容
- 选中后自动收起
- 框内只显示最终值
- 页面不会再被突然撑开

---

### Task 2: 优化滚轮的“苹果式弧线放大”和数值可读性

**Files:**
- Modify: `frontend/app.js`
- Modify: `frontend/styles.css`
- Test: 手动验证饮食、时间、运动、睡眠、体重、设置中的全部滚轮

- [ ] **Step 1: 调整 Dock 弧线放大参数，减少突兀感**

Implementation notes:

```js
const scaleMap = [1.18, 1.11, 1.05, 1.015];
const verticalOffsetMap = [-3, -2, -1, 0];
```

要求：
- 当前项最明显
- 相邻项跟随但不过分夸张
- 不要出现“抖动”或“卡顿感”

- [ ] **Step 2: 提升选项层的可读性**

Implementation notes:

```css
.picker-option {
  min-height: 48px;
  font-size: 1rem;
  line-height: 1.1;
  white-space: nowrap;
}

.picker-options {
  max-height: 260px;
}
```

要求：
- 时间、分钟、克数都要完整显示
- 不能再出现“文字卡在框外”或“上下被切掉”

- [ ] **Step 3: 统一所有时间框的视觉结构**

需要验证的字段：
- 饮食时间
- 运动时间
- 睡眠开始/结束时间
- 体重记录时间

要求：
- 小时和分钟的框高一致
- `:` 垂直居中
- 选中后的数字在框正中央

---

### Task 3: 统一页面内“点击即就位”的微交互节奏

**Files:**
- Modify: `frontend/app.js`
- Modify: `frontend/styles.css`
- Test: 手动验证搜索、选择、提交、保存设置、面板切换

- [ ] **Step 1: 给滚轮、搜索框、快捷跳转统一“就位逻辑”**

Implementation notes:

```js
function scrollFieldGroupIntoView(node, offsetRatio = 0.22) {
  if (!node) return;
  const rect = node.getBoundingClientRect();
  const top = window.scrollY + rect.top - window.innerHeight * offsetRatio;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}
```

应用场景：
- 点击搜索食物
- 点击滚轮数值
- 点击记录食物后的当前选择区域
- 保存设置后返回概览

- [ ] **Step 2: 给当前字段增加轻微聚焦反馈**

Implementation notes:

```css
.picker-field.is-open .picker-trigger {
  border-color: rgba(208, 106, 71, 0.34);
  box-shadow: 0 14px 30px rgba(208, 106, 71, 0.12);
}
```

要求：
- 让用户感知“我点中了这里”
- 不使用夸张闪烁或强烈发光

---

### Task 4: 提升顶部七个板块切换的高级感，但不改布局

**Files:**
- Modify: `frontend/app.js`
- Modify: `frontend/styles.css`
- Test: 手动验证 `1->7`、`7->任意`、跨页签切换

- [ ] **Step 1: 调整面板切换动画，减少“凭空出现”**

Implementation notes:

```css
::view-transition-old(dashboard-panel-stage),
::view-transition-new(dashboard-panel-stage) {
  animation-duration: 0.42s;
  animation-timing-function: cubic-bezier(0.22, 0.86, 0.24, 1);
}
```

```css
@keyframes panelViewOut {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-4px) scale(0.998); }
}

@keyframes panelViewIn {
  from { opacity: 0; transform: translateY(10px) scale(0.998); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
```

- [ ] **Step 2: 保持导航指示器顺滑跟手**

要求：
- 顶部 7 个板块切换时不跳、不抖
- 指示器移动比内容出现更早一点点，形成“先导航、后内容”的顺序感

---

### Task 5: 全站高级感收尾，不改现有框架

**Files:**
- Modify: `frontend/styles.css`
- Modify: `frontend/app.js`
- Test: 手动浏览注册页、概览、饮食、运动睡眠、体重趋势、设置

- [ ] **Step 1: 统一卡片悬停反馈**

Implementation notes:

```css
.interactive-glow {
  transition:
    transform 0.32s cubic-bezier(0.22, 0.86, 0.24, 1),
    box-shadow 0.32s cubic-bezier(0.22, 0.86, 0.24, 1),
    border-color 0.32s ease;
}
```

要求：
- 抬升更柔和
- 不要“廉价网页”的硬放大

- [ ] **Step 2: 压缩过松的留白，提升精致度**

关注区域：
- 注册页说明区
- 概览页顶部状态区
- 卡片之间的垂直节奏
- 表单块上下留白

- [ ] **Step 3: 补齐操作反馈**

需要反馈的动作：
- 记录食物成功
- 记录运动成功
- 记录睡眠成功
- 记录体重成功
- 保存设置成功

要求：
- 使用局部状态文案或轻提示
- 不引入新的重型弹窗系统

---

### Task 6: 项目级验证与部署

**Files:**
- Verify: `frontend/app.js`
- Verify: `backend/app/*.py`

- [ ] **Step 1: 前端语法检查**

Run:

```bash
node --check frontend/app.js
```

Expected:
- 退出码为 0

- [ ] **Step 2: 后端语法检查**

Run:

```bash
python3 -m py_compile backend/app/*.py
```

Expected:
- 无报错

- [ ] **Step 3: 重建前端容器**

Run:

```bash
docker compose up -d --build frontend
```

Expected:
- `health_frontend` 成功启动

- [ ] **Step 4: 基础连通性验证**

Run:

```bash
curl -s http://localhost:8000/health
```

Expected:

```json
{"status":"ok"}
```

- [ ] **Step 5: 手动验证关键路径**

验证路径：
- 注册/登录
- 打开任意滚轮
- 选择分钟、克数、运动类型
- 记录食物并回跳
- 打开设置并保存返回首页
- 切换顶部 7 个板块

---

## 自检结果

### Spec coverage
- 已覆盖滚轮浮层化
- 已覆盖点击就位与自动定位
- 已覆盖动效柔化
- 已覆盖高级感收尾
- 已覆盖验证与部署

### Placeholder scan
- 无 `TODO`、`TBD`、`后续补充`

### Type consistency
- 计划中新增方法命名统一使用：
  - `bringPickerFieldIntoView`
  - `scrollFieldGroupIntoView`
  - `openPickerPanel`
  - `closeAllPickerPanels`

