const { post } = require("../../utils/request");
const { isFilled, asPositiveNumber, asNumberInRange } = require("../../utils/validators");
const { buildNumberOptions, getOptionIndex, getOptionValue } = require("../../utils/picker");

const GENDERS = [
  { label: "男", value: "male" },
  { label: "女", value: "female" },
];

const GOALS = [
  { label: "减脂", value: "fat_loss" },
  { label: "维持", value: "maintain" },
  { label: "增肌", value: "muscle_gain" },
];

const ACTIVITY_LEVELS = [
  { label: "低", value: "low" },
  { label: "中", value: "medium" },
  { label: "高", value: "high" },
];

const AGE_OPTIONS = buildNumberOptions({ start: 12, end: 80, step: 1, suffix: " 岁" });
const HEIGHT_OPTIONS = buildNumberOptions({ start: 140, end: 210, step: 1, suffix: " cm" });
const WEIGHT_OPTIONS = buildNumberOptions({ start: 35, end: 150, step: 0.5, decimals: 1, suffix: " kg" });
const SLEEP_OPTIONS = buildNumberOptions({ start: 4, end: 12, step: 0.5, decimals: 1, suffix: " h" });

function clampWeightByGender(genderValue, weightValue) {
  const fallback = genderValue === "female" ? "55" : "65";
  return Number(weightValue) > 0 ? String(weightValue) : fallback;
}

Page({
  data: {
    username: "",
    password: "",
    name: "",
    age: "25",
    height_cm: "170",
    weight_kg: "65",
    target_weight_kg: "60",
    target_sleep_hours: "8",
    genderLabels: GENDERS.map((item) => item.label),
    goalLabels: GOALS.map((item) => item.label),
    activityLabels: ACTIVITY_LEVELS.map((item) => item.label),
    ageOptions: AGE_OPTIONS,
    heightOptions: HEIGHT_OPTIONS,
    weightOptions: WEIGHT_OPTIONS,
    targetWeightOptions: WEIGHT_OPTIONS,
    sleepOptions: SLEEP_OPTIONS,
    ageIndex: getOptionIndex(AGE_OPTIONS, 25),
    genderIndex: 0,
    heightIndex: getOptionIndex(HEIGHT_OPTIONS, 170),
    weightIndex: getOptionIndex(WEIGHT_OPTIONS, 65),
    targetWeightIndex: getOptionIndex(WEIGHT_OPTIONS, 60),
    targetSleepIndex: getOptionIndex(SLEEP_OPTIONS, 8),
    goalIndex: 0,
    activityIndex: 1,
    loading: false,
  },

  onShow() {
    const app = getApp();
    if (app.globalData.currentUser) {
      wx.switchTab({
        url: "/pages/home/index",
      });
    }
  },

  handleInput(event) {
    const field = event.currentTarget.dataset.field;
    this.setData({
      [field]: event.detail.value,
    });
  },

  handlePicker(event) {
    const field = event.currentTarget.dataset.field;
    const nextIndex = Number(event.detail.value);
    const nextState = {
      [field]: nextIndex,
    };

    if (field === "genderIndex") {
      const nextGender = GENDERS[nextIndex].value;
      const currentWeight = clampWeightByGender(nextGender, this.data.weight_kg);
      nextState.weight_kg = currentWeight;
      nextState.weightIndex = getOptionIndex(WEIGHT_OPTIONS, currentWeight, nextIndex === 1 ? 40 : 60);
    }

    this.setData(nextState);
  },

  handleValuePicker(event) {
    const field = event.currentTarget.dataset.field;
    const indexField = event.currentTarget.dataset.indexField;
    const optionsKey = event.currentTarget.dataset.options;
    const options = this.data[optionsKey] || [];
    const nextIndex = Number(event.detail.value);
    this.setData({
      [indexField]: nextIndex,
      [field]: getOptionValue(options, nextIndex, this.data[field]),
    });
  },

  async submit() {
    const { username, password, name, loading } = this.data;
    if (loading) {
      return;
    }

    const age = asNumberInRange(this.data.age, 1, 120);
    const heightCm = asPositiveNumber(this.data.height_cm);
    const weightKg = asPositiveNumber(this.data.weight_kg);
    const targetWeightKg = asPositiveNumber(this.data.target_weight_kg);
    const targetSleepHours = asNumberInRange(this.data.target_sleep_hours, 4, 12);

    if (
      !isFilled(username) ||
      !isFilled(password) ||
      !isFilled(name) ||
      username.trim().length < 3 ||
      password.length < 6 ||
      !age ||
      !heightCm ||
      !weightKg ||
      !targetWeightKg ||
      !targetSleepHours
    ) {
      wx.showToast({
        title: "请检查注册信息是否完整有效",
        icon: "none",
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const result = await post("/auth/register", {
        username: username.trim(),
        password,
        name: name.trim(),
        age,
        gender: GENDERS[this.data.genderIndex].value,
        height_cm: heightCm,
        weight_kg: weightKg,
        target_weight_kg: targetWeightKg,
        target_sleep_hours: targetSleepHours,
        goal: GOALS[this.data.goalIndex].value,
        activity_level: ACTIVITY_LEVELS[this.data.activityIndex].value,
      });
      getApp().setCurrentUser(result.user);
      wx.showToast({
        title: "注册成功",
        icon: "success",
      });
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/home/index",
        });
      }, 300);
    } catch (error) {
      const registerErrorMessage =
        error.message === "用户名已存在"
          ? "用户名已存在，请更换后再注册"
          : error.message;
      wx.showToast({
        title: registerErrorMessage,
        icon: "none",
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  goLogin() {
    wx.navigateBack();
  },
});
