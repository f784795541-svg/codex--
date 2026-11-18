const { get, post, isUnauthorizedRedirectError } = require("../../utils/request");
const { ensureUser } = require("../../utils/session");
const { onShareAppMessage, onShareTimeline, setupSharePage } = require("../../utils/share");
const { asPositiveNumber, asNumberInRange, isFilled } = require("../../utils/validators");
const { buildNumberOptions, getOptionIndex, getOptionValue } = require("../../utils/picker");
const onboarding = require("../../utils/onboarding");

const APP_VERSION = "1.1.0";

const GOALS = [
  { label: "减脂", value: "fat_loss" },
  { label: "维持", value: "maintain" },
  { label: "增肌", value: "muscle_gain" }
];

const ACTIVITY_LEVELS = [
  { label: "低", value: "low" },
  { label: "中", value: "medium" },
  { label: "高", value: "high" }
];

const RECOMMENDATION_MODES = [
  { label: "家常模式", value: "home" },
  { label: "健身模式", value: "fitness" },
  { label: "外食模式", value: "eat_out" }
];

const AGE_OPTIONS = buildNumberOptions({ start: 12, end: 80, step: 1, suffix: " 岁" });
const HEIGHT_OPTIONS = buildNumberOptions({ start: 140, end: 210, step: 1, suffix: " cm" });
const WEIGHT_OPTIONS = buildNumberOptions({ start: 35, end: 150, step: 0.5, decimals: 1, suffix: " kg" });
const SLEEP_OPTIONS = buildNumberOptions({ start: 4, end: 12, step: 0.5, decimals: 1, suffix: " h" });

function buildProfileFocus(user) {
  return [
    `目标：${(GOALS.find((item) => item.value === user.goal) || GOALS[0]).label}`,
    `活动：${(ACTIVITY_LEVELS.find((item) => item.value === user.activity_level) || ACTIVITY_LEVELS[1]).label}`,
    `睡眠：${user.target_sleep_hours ? `${user.target_sleep_hours} h` : "待设置"}`
  ];
}

function buildPreviewState(user) {
  if (!user) {
    return null;
  }

  return {
    user,
    name: user.name || "",
    age: String(user.age || ""),
    height_cm: String(user.height_cm || ""),
    weight_kg: String(user.weight_kg || ""),
    target_weight_kg: String(user.target_weight_kg || ""),
    target_sleep_hours: String(user.target_sleep_hours || ""),
    ageIndex: getOptionIndex(AGE_OPTIONS, user.age || 25),
    heightIndex: getOptionIndex(HEIGHT_OPTIONS, user.height_cm || 170),
    weightIndex: getOptionIndex(WEIGHT_OPTIONS, user.weight_kg || 65),
    targetWeightIndex: getOptionIndex(WEIGHT_OPTIONS, user.target_weight_kg || user.weight_kg || 60),
    targetSleepIndex: getOptionIndex(SLEEP_OPTIONS, user.target_sleep_hours || 8),
    goalIndex: Math.max(0, GOALS.findIndex((item) => item.value === user.goal)),
    activityIndex: Math.max(0, ACTIVITY_LEVELS.findIndex((item) => item.value === user.activity_level)),
    recommendationModeIndex: Math.max(0, RECOMMENDATION_MODES.findIndex((item) => item.value === user.recommendation_mode)),
    displayName: user.name || "",
    displayWeight: `${user.weight_kg || "-"} kg`,
    profileFocus: buildProfileFocus(user),
    showEmptyState: false,
  };
}

Page({
  onShareAppMessage,
  onShareTimeline,

  data: {
    user: null,
    name: "",
    age: "",
    height_cm: "",
    weight_kg: "",
    target_weight_kg: "",
    target_sleep_hours: "",
    ageOptions: AGE_OPTIONS,
    heightOptions: HEIGHT_OPTIONS,
    weightOptions: WEIGHT_OPTIONS,
    targetWeightOptions: WEIGHT_OPTIONS,
    sleepOptions: SLEEP_OPTIONS,
    ageIndex: getOptionIndex(AGE_OPTIONS, 25),
    heightIndex: getOptionIndex(HEIGHT_OPTIONS, 170),
    weightIndex: getOptionIndex(WEIGHT_OPTIONS, 65),
    targetWeightIndex: getOptionIndex(WEIGHT_OPTIONS, 60),
    targetSleepIndex: getOptionIndex(SLEEP_OPTIONS, 8),
    goalLabels: GOALS.map((item) => item.label),
    activityLabels: ACTIVITY_LEVELS.map((item) => item.label),
    recommendationLabels: RECOMMENDATION_MODES.map((item) => item.label),
    goalIndex: 0,
    activityIndex: 1,
    recommendationModeIndex: 0,
    displayName: "",
    displayWeight: "- kg",
    profileFocus: [],
    saveNotice: "",
    showProfileContent: false,
    showEmptyState: false,
    loading: true,
    saving: false,
    deviceLinkCode: "",
    deviceLinkInput: "",
    deviceLinkPlaceholder: "输入另一台设备显示的\n8 位码",
    deviceLinkCountdown: "",
    deviceLinkLoading: false,
    wechatBound: false,
    unbindConfirmOpen: false,
    onboardingVisible: false,
    onboardingStep: 0,
    onboardingTotal: 0,
    onboardingTitle: "",
    onboardingCopy: "",
    onboardingFocusStyle: "",
    saveButtonText: "保存设置",
    appVersion: APP_VERSION,
    feedbackContent: "",
    feedbackSubmitting: false,
    exportLoading: false,
    updateChecking: false,
  },

  onLoad() {
    setupSharePage.call(this);
    if (this.data.timelinePreview) return;
    const previewUser = getApp().globalData.currentUser;
    const previewState = buildPreviewState(previewUser);
    if (previewState) {
      this.setData({
        ...previewState,
        showProfileContent: true,
      });
    }
  },

  async onShow() {
    const user = await ensureUser();
    if (!user) {
      return;
    }

    const previewState = buildPreviewState(user);
    if (previewState) {
      this.setData({
        ...previewState,
        showProfileContent: true,
      });
    }

    this.loadUser(user.id);
    this.updateDeviceLinkCountdown();
    this.refreshWechatBindingStatus();
    this._onboardingPageTimer = setTimeout(() => this.showOnboarding(user.id), 320);
  },

  onHide() {
    this.clearHomeSwitchTimer();
    this.clearDeviceLinkTimer();
    onboarding.clearTimer(this);
  },

  onUnload() {
    this.clearHomeSwitchTimer();
    this.clearDeviceLinkTimer();
    onboarding.clearTimer(this);
  },

  async nextOnboarding() {
    if (this.data.onboardingStep === 4) {
      await this.submit({ continueOnboarding: true });
      return;
    }
    onboarding.next(this, "profile", getApp().globalData.currentUser?.id);
  },

  showOnboarding(userId = getApp().globalData.currentUser?.id) {
    onboarding.show(this, "profile", userId);
  },

  async loadUser(userId) {
    if (this.profileLoadingUserId === userId) {
      return;
    }

    const requestId = (this.profileRequestId || 0) + 1;
    this.profileRequestId = requestId;
    this.profileLoadingUserId = userId;

    this.setData({
      loading: !this.data.user,
      showProfileContent: !!this.data.user,
      showEmptyState: false,
    });

    try {
      const user = await get("/user/info", {
        user_id: userId,
      });
      if (requestId !== this.profileRequestId) {
        return;
      }
      this.setData({
        ...buildPreviewState(user),
        showProfileContent: true,
      });
    } catch (error) {
      if (requestId !== this.profileRequestId) {
        return;
      }
      if (isUnauthorizedRedirectError(error)) {
        return;
      }
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    } finally {
      if (requestId === this.profileRequestId) {
        this.profileLoadingUserId = null;
        this.setData({
          loading: false,
          showProfileContent: !!this.data.user,
          showEmptyState: !this.data.user,
        });
      }
    }
  },

  handleInput(event) {
    const field = event.currentTarget.dataset.field;
    const value = event.detail.value;
    const nextState = {
      [field]: value,
      saveNotice: "",
    };
    if (field === "name") {
      nextState.displayName = value || (this.data.user ? this.data.user.name || "" : "");
    }
    if (field === "weight_kg") {
      nextState.displayWeight = `${value || "-"} kg`;
    }
    this.setData(nextState);
  },

  handleFeedbackInput(event) {
    this.setData({ feedbackContent: event.detail.value });
  },

  async exportMyData() {
    if (!this.data.user || this.data.exportLoading) {
      return;
    }
    try {
      this.setData({ exportLoading: true });
      const payload = await get("/user/data-export", { user_id: this.data.user.id }, { cacheMs: 0 });
      const safeTime = new Date().toISOString().replace(/[:.]/g, "-");
      const filePath = `${wx.env.USER_DATA_PATH}/health-data-${safeTime}.txt`;
      wx.getFileSystemManager().writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8");
      wx.openDocument({
        filePath,
        fileType: "txt",
        showMenu: true,
        fail: () => wx.showToast({ title: "数据已导出到本机文件", icon: "none" }),
      });
    } catch (error) {
      if (!isUnauthorizedRedirectError(error)) wx.showToast({ title: error.message || "导出失败，请重试", icon: "none" });
    } finally {
      this.setData({ exportLoading: false });
    }
  },

  async submitFeedback() {
    const content = this.data.feedbackContent.trim();
    if (!content || this.data.feedbackSubmitting || !this.data.user) {
      wx.showToast({ title: "请先填写反馈内容", icon: "none" });
      return;
    }
    try {
      this.setData({ feedbackSubmitting: true });
      await post("/feedback", {
        user_id: this.data.user.id,
        content,
        client_platform: "miniprogram",
        app_version: APP_VERSION,
      });
      this.setData({ feedbackContent: "" });
      wx.showToast({ title: "反馈已提交", icon: "success" });
    } catch (error) {
      if (!isUnauthorizedRedirectError(error)) wx.showToast({ title: error.message || "提交失败，请重试", icon: "none" });
    } finally {
      this.setData({ feedbackSubmitting: false });
    }
  },

  checkForUpdate() {
    if (this.data.updateChecking) {
      return;
    }
    if (typeof wx.getUpdateManager !== "function") {
      wx.showToast({ title: "当前环境不支持版本检查", icon: "none" });
      return;
    }
    this.setData({ updateChecking: true });
    const manager = wx.getUpdateManager();
    let settled = false;
    const finish = () => {
      if (!settled) {
        settled = true;
        this.setData({ updateChecking: false });
      }
    };
    manager.onCheckForUpdate((result) => {
      if (!result.hasUpdate) {
        wx.showToast({ title: "当前已是最新版本", icon: "none" });
        finish();
      }
    });
    manager.onUpdateReady(() => {
      finish();
      wx.showModal({
        title: "发现新版本",
        content: "新版本已下载完成，重启后即可使用。",
        confirmText: "立即重启",
        success: (result) => {
          if (result.confirm) manager.applyUpdate();
        },
      });
    });
    manager.onUpdateFailed(() => {
      finish();
      wx.showToast({ title: "新版本下载失败，请稍后重试", icon: "none" });
    });
  },

  handleDeviceLinkInput(event) {
    this.setData({ deviceLinkInput: event.detail.value.toUpperCase().replace(/\s/g, "") });
  },

  async refreshWechatBindingStatus() {
    try {
      const login = await new Promise((resolve, reject) => wx.login({ success: resolve, fail: reject }));
      if (!login.code) {
        return;
      }
      const result = await post("/wechat/device-link/status", { code: login.code });
      this.setData({ wechatBound: !!result.is_linked });
    } catch (error) {
      this.setData({ wechatBound: false });
    }
  },

  clearDeviceLinkTimer() {
    if (this.deviceLinkTimer) {
      clearInterval(this.deviceLinkTimer);
      this.deviceLinkTimer = null;
    }
  },

  updateDeviceLinkCountdown() {
    this.clearDeviceLinkTimer();
    if (!this.deviceLinkExpiresAt || !this.data.deviceLinkCode) {
      return;
    }

    const refresh = () => {
      const seconds = Math.max(0, Math.ceil((this.deviceLinkExpiresAt - Date.now()) / 1000));
      if (!seconds) {
        this.clearDeviceLinkTimer();
        this.deviceLinkExpiresAt = 0;
        this.setData({ deviceLinkCode: "", deviceLinkCountdown: "" });
        return;
      }
      const minutes = Math.floor(seconds / 60);
      this.setData({ deviceLinkCountdown: `${minutes}:${String(seconds % 60).padStart(2, "0")}` });
    };

    refresh();
    this.deviceLinkTimer = setInterval(refresh, 1000);
  },

  async showDeviceLinkCode() {
    if (this.data.deviceLinkLoading) {
      return;
    }
    try {
      this.setData({ deviceLinkLoading: true });
      const result = await post("/wechat/device-link/code", {});
      this.setData({ deviceLinkCode: result.code });
      this.deviceLinkExpiresAt = Date.now() + (Number(result.expires_in_seconds) || 600) * 1000;
      this.updateDeviceLinkCountdown();
    } catch (error) {
      if (!isUnauthorizedRedirectError(error)) wx.showToast({ title: error.message || "连接码生成失败", icon: "none" });
    } finally {
      this.setData({ deviceLinkLoading: false });
    }
  },

  async connectDevice() {
    const code = this.data.deviceLinkInput.trim();
    if (code.length !== 8 || this.data.deviceLinkLoading) {
      wx.showToast({ title: "请输入 8 位连接码", icon: "none" });
      return;
    }
    try {
      this.setData({ deviceLinkLoading: true });
      const result = await post("/wechat/device-link/connect", { code });
      getApp().setCurrentUser(result.user, result.access_token);
      this.setData({
        ...buildPreviewState(result.user),
        deviceLinkCode: "",
        deviceLinkInput: "",
        deviceLinkCountdown: "",
        wechatBound: true,
        showProfileContent: true,
      });
      this.clearDeviceLinkTimer();
      this.deviceLinkExpiresAt = 0;
      wx.showToast({ title: "设备连接成功", icon: "success" });
      await this.loadUser(result.user.id);
    } catch (error) {
      if (!isUnauthorizedRedirectError(error)) wx.showToast({ title: error.message || "设备连接失败", icon: "none" });
    } finally {
      this.setData({ deviceLinkLoading: false });
    }
  },

  openUnbindConfirm() {
    if (!this.data.deviceLinkLoading && this.data.wechatBound) {
      this.setData({ unbindConfirmOpen: true });
    }
  },

  closeUnbindConfirm() {
    if (!this.data.deviceLinkLoading) {
      this.setData({ unbindConfirmOpen: false });
    }
  },

  noop() {},

  async unbindCurrentDevice() {
    if (this.data.deviceLinkLoading || !this.data.wechatBound) {
      return;
    }
    try {
      this.setData({ deviceLinkLoading: true });
      const login = await new Promise((resolve, reject) => wx.login({ success: resolve, fail: reject }));
      if (!login.code) throw new Error("当前设备识别失败，请重试");
      await post("/wechat/device-link/unbind", { code: login.code });
      this.setData({
        deviceLinkCode: "",
        deviceLinkInput: "",
        deviceLinkCountdown: "",
        wechatBound: false,
        unbindConfirmOpen: false,
        showProfileContent: true,
      });
      this.clearDeviceLinkTimer();
      this.deviceLinkExpiresAt = 0;
      wx.showToast({ title: "当前微信已解除绑定", icon: "success" });
    } catch (error) {
      if (!isUnauthorizedRedirectError(error)) wx.showToast({ title: error.message || "解绑失败", icon: "none" });
    } finally {
      this.setData({ deviceLinkLoading: false });
    }
  },

  handlePicker(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      [field]: Number(event.detail.value),
      saveNotice: "",
    });
  },

  handleValuePicker(event) {
    const field = event.currentTarget.dataset.field;
    const indexField = event.currentTarget.dataset.indexField;
    const optionsKey = event.currentTarget.dataset.options;
    const options = this.data[optionsKey] || [];
    const nextIndex = Number(event.detail.value);
    const nextValue = getOptionValue(options, nextIndex, this.data[field]);
    const nextState = {
      [indexField]: nextIndex,
      [field]: nextValue,
      saveNotice: "",
    };

    if (field === "weight_kg") {
      nextState.displayWeight = `${nextValue || "-"} kg`;
    }

    this.setData(nextState);
  },

  clearHomeSwitchTimer() {
    if (this.homeSwitchTimer) {
      clearTimeout(this.homeSwitchTimer);
      this.homeSwitchTimer = null;
    }
  },

  goHomeAfterSuccess(delay = 720) {
    this.clearHomeSwitchTimer();
    this.homeSwitchTimer = setTimeout(() => {
      wx.switchTab({
        url: "/pages/home/index",
      });
    }, delay);
  },

  async submit(options = {}) {
    if (!this.data.user) {
      return;
    }

    const name = this.data.name.trim();
    const age = asNumberInRange(this.data.age, 1, 120);
    const heightCm = asPositiveNumber(this.data.height_cm);
    const weightKg = asPositiveNumber(this.data.weight_kg);
    const targetWeightKg = asPositiveNumber(this.data.target_weight_kg);
    const targetSleepHours = asNumberInRange(this.data.target_sleep_hours, 4, 12);

    if (!isFilled(name) || !age || !heightCm || !weightKg || !targetWeightKg || !targetSleepHours) {
      wx.showToast({
        title: "请检查资料填写是否完整有效",
        icon: "none",
      });
      return;
    }

    try {
      this.setData({
        saving: true,
        saveButtonText: "保存中...",
      });
      const result = await post("/user/update", {
        user_id: this.data.user.id,
        name,
        age,
        height_cm: heightCm,
        weight_kg: weightKg,
        target_weight_kg: targetWeightKg,
        target_sleep_hours: targetSleepHours,
        goal: GOALS[this.data.goalIndex].value,
        activity_level: ACTIVITY_LEVELS[this.data.activityIndex].value,
        recommendation_mode: RECOMMENDATION_MODES[this.data.recommendationModeIndex].value,
      });
      getApp().setCurrentUser(result.user);
      const nextState = buildPreviewState(result.user);
      this.setData({
        ...nextState,
        saveNotice: "已按当前资料刷新首页摘要、记录默认值和趋势解释。",
        showProfileContent: true,
        showEmptyState: false,
      });
      wx.showToast({
        title: "资料已更新",
        icon: "success",
      });
      if (options.continueOnboarding) {
        onboarding.next(this, "profile", result.user.id);
      } else {
        this.goHomeAfterSuccess();
      }
    } catch (error) {
      if (isUnauthorizedRedirectError(error)) {
        return;
      }
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    } finally {
      this.setData({
        saving: false,
        saveButtonText: "保存设置",
      });
    }
  },

});
