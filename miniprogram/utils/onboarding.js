const GUIDE_VERSION = "v2";

const STEPS = [
  {
    page: "home",
    path: "/pages/home/index",
    target: "#onboarding-home-overview",
    title: "先看今天的整体状态",
    copy: "首页汇总了体重、运动消耗、可摄入量和微信步数。每天先在这里判断今天该把重点放在哪里。",
  },
  {
    page: "record",
    path: "/pages/record/index",
    target: "#record-top-anchor",
    title: "记录四类日常数据",
    copy: "饮食、运动、睡眠和体重都从这里录入。先记真实发生的数据，系统会自动汇总到首页和趋势页。",
  },
  {
    page: "trend",
    path: "/pages/trend/index",
    target: "#onboarding-trend-overview",
    title: "用趋势看实际变化",
    copy: "趋势页用日报、周报和体重曲线帮你判断节奏是否有效，不需要每天靠感觉猜。",
  },
  {
    page: "profile",
    path: "/pages/profile/index",
    target: "#onboarding-profile-basics",
    title: "先补齐身体基础资料",
    copy: "在“我的”里填写昵称、身高、当前体重和目标体重。它们会直接影响热量估算和好友 PK 展示。",
  },
  {
    page: "profile",
    path: "/pages/profile/index",
    target: "#onboarding-profile-plan",
    title: "最后设置你的健康节奏",
    copy: "这里汇总了目标、活动水平和推荐模式。继续向下到“节奏设定”中修改并保存，系统会按这套资料给出每天的热量与饮食建议。",
  },
];

function storageKey(userId) {
  return `health_onboarding_${GUIDE_VERSION}_${userId}`;
}

function readState(userId) {
  return userId ? wx.getStorageSync(storageKey(userId)) || null : null;
}

function writeState(userId, state) {
  wx.setStorageSync(storageKey(userId), state);
}

function getActiveStep(userId, startIfNeeded = false) {
  const state = readState(userId);
  if (state?.completed || (!state && !startIfNeeded)) {
    return null;
  }
  const stepIndex = Math.max(0, Math.min(Number(state?.stepIndex) || 0, STEPS.length - 1));
  if (!state) {
    writeState(userId, { stepIndex, completed: false });
  }
  return { ...STEPS[stepIndex], stepIndex };
}

function hide(page) {
  page.setData({ onboardingVisible: false });
}

function positionGuide(page, step) {
  const query = wx.createSelectorQuery().in(page);
  query.select(step.target).boundingClientRect();
  query.selectViewport().scrollOffset();
  query.exec((results) => {
    const rect = results?.[0];
    const viewport = results?.[1] || { scrollTop: 0 };
    if (!rect) {
      page.setData({
        onboardingVisible: true,
        onboardingFocusStyle: "top:118px;left:14px;width:calc(100% - 28px);height:132px;",
      });
      return;
    }
    const windowHeight = wx.getSystemInfoSync().windowHeight || 667;
    const topLimit = 74;
    const bottomLimit = windowHeight - 214;
    if (rect.top < topLimit || rect.bottom > bottomLimit) {
      wx.pageScrollTo({ scrollTop: Math.max(0, viewport.scrollTop + rect.top - topLimit), duration: 260 });
      page._onboardingTimer = setTimeout(() => positionGuide(page, step), 320);
      return;
    }
    page.setData({
      onboardingVisible: true,
      onboardingFocusStyle: `top:${Math.max(8, rect.top - 6)}px;left:${Math.max(8, rect.left - 6)}px;width:${rect.width + 12}px;height:${rect.height + 12}px;`,
    });
  });
}

function show(page, pageName, userId, startIfNeeded = false) {
  const step = getActiveStep(userId, startIfNeeded);
  if (!step || step.page !== pageName) {
    hide(page);
    return;
  }
  const app = getApp();
  const pending = app.globalData.onboardingPendingStep;
  if (pending && pending.stepIndex === step.stepIndex && pending.userId === userId) {
    app.globalData.onboardingPendingStep = null;
  }
  page.setData({
    onboardingVisible: true,
    onboardingStep: step.stepIndex + 1,
    onboardingTotal: STEPS.length,
    onboardingTitle: step.title,
    onboardingCopy: step.copy,
  });
  clearTimeout(page._onboardingTimer);
  page._onboardingTimer = setTimeout(() => positionGuide(page, step), 120);
}

function next(page, pageName, userId) {
  const current = getActiveStep(userId);
  if (!current || current.page !== pageName) {
    hide(page);
    return;
  }
  const nextIndex = current.stepIndex + 1;
  if (nextIndex >= STEPS.length) {
    writeState(userId, { completed: true });
    hide(page);
    wx.showToast({ title: "引导完成", icon: "success" });
    return;
  }
  writeState(userId, { stepIndex: nextIndex, completed: false });
  const nextStep = STEPS[nextIndex];
  if (nextStep.page === pageName) {
    show(page, pageName, userId);
    return;
  }
  hide(page);
  getApp().globalData.onboardingPendingStep = {
    stepIndex: nextIndex,
    userId,
  };
  wx.switchTab({
    url: nextStep.path,
    success: () => {
      // Tab pages can finish their first render after switchTab succeeds. Their onShow
      // handler is still the fallback; this direct handoff keeps the guide continuous.
      setTimeout(() => {
        const targetPage = getCurrentPages().slice(-1)[0];
        if (targetPage && typeof targetPage.showOnboarding === "function") {
          targetPage.showOnboarding(userId);
        }
      }, 220);
    },
  });
}

function clearTimer(page) {
  clearTimeout(page._onboardingTimer);
  clearTimeout(page._onboardingPageTimer);
}

module.exports = { show, next, clearTimer };
