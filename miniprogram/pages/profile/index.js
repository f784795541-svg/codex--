const { get, post } = require("../../utils/request");
const { ensureUser } = require("../../utils/session");
const { asPositiveNumber, asNumberInRange, isFilled } = require("../../utils/validators");
const { buildNumberOptions, getOptionIndex, getOptionValue } = require("../../utils/picker");

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
    saveButtonText: "保存设置",
  },

  onLoad() {
    const previewUser = getApp().globalData.currentUser;
    const previewState = buildPreviewState(previewUser);
    if (previewState) {
      this.setData({
        ...previewState,
        showProfileContent: true,
      });
    }
  },

  onShow() {
    const user = ensureUser();
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
  },

  onHide() {
    this.clearHomeSwitchTimer();
  },

  onUnload() {
    this.clearHomeSwitchTimer();
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

  async submit() {
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
      this.goHomeAfterSuccess();
    } catch (error) {
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

  logout() {
    getApp().clearCurrentUser();
    wx.reLaunch({
      url: "/pages/login/index",
    });
  },
});
