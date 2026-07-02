const { get, post } = require("../../utils/request");
const { ensureUser } = require("../../utils/session");
const { getCurrentDate, getCurrentTime } = require("../../utils/date");
const { asPositiveNumber } = require("../../utils/validators");
const { buildNumberOptions, getOptionIndex, getOptionValue } = require("../../utils/picker");

const TAB_META = {
  food: {
    label: "饮食",
    note: "先搜食物，再连续录入",
  },
  workout: {
    label: "运动",
    note: "先估算热量，再决定是否微调",
  },
  sleep: {
    label: "睡眠",
    note: "按时间段补齐恢复节奏",
  },
  weight: {
    label: "体重",
    note: "同步到首页和趋势页追踪",
  },
};

const FOOD_WEIGHT_STEP = 5;
const DEFAULT_FOOD_WEIGHT = 100;
const FOOD_WEIGHT_OPTIONS = buildNumberOptions({ start: FOOD_WEIGHT_STEP, end: 1000, step: FOOD_WEIGHT_STEP, suffix: " g" });
const WORKOUT_DURATION_OPTIONS = buildNumberOptions({ start: 5, end: 240, step: 5, suffix: " 分钟" });
const WORKOUT_CALORIE_OPTIONS = buildNumberOptions({ start: 10, end: 2000, step: 10, suffix: " kcal" });
const BODY_WEIGHT_OPTIONS = buildNumberOptions({ start: 30, end: 180, step: 0.5, decimals: 1, suffix: " kg" });
const PORTION_RANGE_PATTERN = /(\d+(?:\.\d+)?)\s*[-~至]\s*(\d+(?:\.\d+)?)\s*(?:g|克)/gi;
const PORTION_SINGLE_PATTERN = /(\d+(?:\.\d+)?)\s*(?:g|克)/gi;

function buildFoodPreview(selectedFood, weightText) {
  const weight = asPositiveNumber(weightText);
  if (!selectedFood || !weight) {
    return "选中食物后会在这里预估本次摄入热量。";
  }
  const calories = Math.round((selectedFood.calories_per_100g * weight) / 100);
  return `约 ${calories} kcal · ${weight} g`;
}

function buildWorkoutPreview(option, durationText, caloriesText) {
  const duration = asPositiveNumber(durationText);
  const calories = asPositiveNumber(caloriesText);
  if (!option) {
    return "先选择运动类型，再补时长和热量。";
  }
  if (!duration) {
    return `已选 ${option.label}，还差时长。`;
  }
  if (!calories && calories !== 0) {
    return `${option.label} ${duration} 分钟，建议先估算热量。`;
  }
  return `${option.label} · ${duration} 分钟 · ${calories} kcal`;
}

function calculateSleepDuration(start, end) {
  if (!start || !end) {
    return "";
  }
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  if ([startHour, startMinute, endHour, endMinute].some((value) => Number.isNaN(value))) {
    return "";
  }
  let totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  if (totalMinutes <= 0) {
    totalMinutes += 24 * 60;
  }
  const hours = (totalMinutes / 60).toFixed(1);
  return `约 ${hours} 小时`;
}

function buildWeightPreview(currentWeight, inputWeight, date, time) {
  const nextWeight = asPositiveNumber(inputWeight);
  if (!nextWeight) {
    return "输入体重后会在这里提示和当前档案的差值。";
  }
  if (!currentWeight) {
    return `${nextWeight} kg · ${date} ${time}`;
  }
  const delta = (nextWeight - currentWeight).toFixed(1);
  const direction = Number(delta) > 0 ? "+" : "";
  return `${nextWeight} kg · 较当前 ${direction}${delta} kg`;
}

function roundFoodWeight(value) {
  const normalized = Math.round((Number(value) || 0) / FOOD_WEIGHT_STEP) * FOOD_WEIGHT_STEP;
  return Math.max(FOOD_WEIGHT_STEP, Math.min(1000, normalized));
}

function extractPortionCandidates(portionHint) {
  const text = String(portionHint || "");
  const candidates = [];
  let match = null;

  PORTION_RANGE_PATTERN.lastIndex = 0;
  while ((match = PORTION_RANGE_PATTERN.exec(text))) {
    candidates.push(Number(match[1]), Number(match[2]));
  }

  PORTION_SINGLE_PATTERN.lastIndex = 0;
  while ((match = PORTION_SINGLE_PATTERN.exec(text))) {
    candidates.push(Number(match[1]));
  }

  return candidates.filter((value) => Number.isFinite(value) && value > 0);
}

function inferFoodServingSize(food) {
  const name = String(food?.name || "");
  const category = String(food?.category || "");

  if (/米饭|糙米饭|寿司饭/.test(name)) {
    return 220;
  }
  if (/面条|意面|意大利面|河粉|米线|粉丝|米粉|凉面|拌面|面片|刀削面|拉面|牛肉面|小面|螺蛳粉|酸辣粉|热干面|馄饨面|云吞面/.test(name)) {
    return 350;
  }
  if (/粥|汤面|汤粉/.test(name)) {
    return 300;
  }
  if (/燕麦|麦片/.test(name)) {
    return 60;
  }
  if (/面包|吐司|贝果|可颂|馒头|包子|花卷|烧麦|饺子|春卷|蛋挞|披萨/.test(name)) {
    return 120;
  }
  if (/玉米|红薯|紫薯|土豆|山药|南瓜|芋头/.test(name)) {
    return 180;
  }
  if (/鸡胸|火鸡胸|牛肉|牛腱|牛排|猪里脊|猪肉|羊肉|鸭胸|鱼|三文鱼|鳕鱼|虾|虾仁|贝|鱿鱼|海参/.test(name)) {
    return 160;
  }
  if (/鸡蛋|炒蛋|蛋羹|蒸蛋/.test(name) || category === "蛋类") {
    return 120;
  }
  if (/牛奶|豆浆/.test(name)) {
    return 250;
  }
  if (/酸奶|奶昔|奶茶|咖啡|可乐|汽水|果汁|茶饮|苏打水/.test(name) || category === "饮品") {
    return 300;
  }
  if (/香蕉/.test(name)) {
    return 120;
  }
  if (/苹果|梨|橙|橘|柚|桃|李|猕猴桃|火龙果|芒果/.test(name)) {
    return 180;
  }
  if (/葡萄|草莓|蓝莓|车厘子|樱桃/.test(name)) {
    return 120;
  }
  if (/西瓜|哈密瓜|木瓜|菠萝/.test(name)) {
    return 250;
  }
  if (/水果/.test(category)) {
    return 180;
  }
  if (/蔬菜|轻食/.test(category)) {
    return 200;
  }
  if (/豆制品|家常炒菜/.test(category)) {
    return 180;
  }
  if (/零食|甜点|烘焙|补剂/.test(category)) {
    return 60;
  }
  if (/油脂|调味/.test(category)) {
    return 15;
  }
  if (/连锁餐厅/.test(category)) {
    return 180;
  }
  if (/主食/.test(category)) {
    return 180;
  }
  if (/肉类|海鲜/.test(category)) {
    return 160;
  }
  return 150;
}

function resolveFoodDefaultWeight(food) {
  if (!food) {
    return 100;
  }

  const candidates = [];
  const servingSize = Number(food.serving_size_g || 0);
  if (Number.isFinite(servingSize) && servingSize > 0) {
    candidates.push(servingSize);
  }
  candidates.push(...extractPortionCandidates(food.portion_hint));

  if (candidates.length) {
    return roundFoodWeight(Math.max(...candidates));
  }

  return roundFoodWeight(inferFoodServingSize(food));
}

function buildFoodWeightState(food) {
  const defaultWeight = resolveFoodDefaultWeight(food);
  return {
    foodWeight: String(defaultWeight),
    foodWeightIndex: getOptionIndex(FOOD_WEIGHT_OPTIONS, defaultWeight),
  };
}

function enrichFoodSearchResult(food) {
  if (!food) {
    return food;
  }

  const defaultWeight = resolveFoodDefaultWeight(food);
  const nextServingSize = Number(food.serving_size_g || 0) > 0 ? Number(food.serving_size_g) : defaultWeight;
  const nextPortionHint = food.portion_hint || `默认一份约 ${defaultWeight}g，可按实际情况微调`;

  return {
    ...food,
    serving_size_g: nextServingSize,
    portion_hint: nextPortionHint,
  };
}

const RECORD_SCROLL_TARGETS = {
  food: { top: "#record-food-card", bottom: "#record-food-action" },
  workout: { top: "#record-workout-card", bottom: "#record-workout-action" },
  sleep: { top: "#record-sleep-card", bottom: "#record-sleep-action" },
  weight: { top: "#record-weight-card", bottom: "#record-weight-action" },
};

function getRecordScrollSelector(tabKey, kind) {
  const targets = RECORD_SCROLL_TARGETS[tabKey] || RECORD_SCROLL_TARGETS.food;
  return targets[kind] || targets.top;
}

Page({
  data: {
    activeTab: "food",
    activeTabLabel: "饮食",
    activeTabNote: "先搜食物，再连续录入",
    tabs: [
      { key: "food", label: "饮食" },
      { key: "workout", label: "运动" },
      { key: "sleep", label: "睡眠" },
      { key: "weight", label: "体重" }
    ],
    foodQuery: "",
    foodResults: [],
    selectedFoodIndex: -1,
    selectedFood: null,
    foodWeight: String(DEFAULT_FOOD_WEIGHT),
    foodWeightOptions: FOOD_WEIGHT_OPTIONS,
    foodWeightIndex: getOptionIndex(FOOD_WEIGHT_OPTIONS, DEFAULT_FOOD_WEIGHT),
    foodTime: "",
    workoutOptions: [],
    workoutTypeIndex: 0,
    workoutDuration: "30",
    workoutDurationOptions: WORKOUT_DURATION_OPTIONS,
    workoutDurationIndex: getOptionIndex(WORKOUT_DURATION_OPTIONS, 30),
    workoutCalories: "",
    workoutCalorieOptions: WORKOUT_CALORIE_OPTIONS,
    workoutCalorieIndex: getOptionIndex(WORKOUT_CALORIE_OPTIONS, 300),
    workoutTime: "",
    sleepStart: "23:00",
    sleepEnd: "07:00",
    weightValue: "",
    weightValueOptions: BODY_WEIGHT_OPTIONS,
    weightValueIndex: getOptionIndex(BODY_WEIGHT_OPTIONS, 65),
    weightDate: "",
    weightTime: "",
    hasSearchedFood: false,
    foodResultSummary: "先搜食物，再从结果里点选。",
    foodPreview: "选中食物后会在这里预估本次摄入热量。",
    workoutPreview: "先选择运动类型，再补时长和热量。",
    sleepPreview: "按真实时间填写后会自动换算睡眠时长。",
    weightPreview: "输入体重后会在这里提示和当前档案的差值。",
    lastSubmission: null,
    foodTimeAuto: true,
    workoutTimeAuto: true,
    weightTimeAuto: true,
  },

  onLoad() {
    this.resetDynamicDefaults();
    this.syncActiveTabMeta(this.data.activeTab);
    this.refreshDerivedState();
  },

  onShow() {
    const user = ensureUser();
    if (!user) {
      return;
    }
    this.refreshDynamicTimes(user);
    if (!this.data.workoutOptions.length) {
      this.loadWorkoutOptions();
    }
    this.startAutoTimeTicker();
  },

  onHide() {
    this.stopAutoTimeTicker();
    this.clearFoodSearchTimer();
    this.clearScrollTimer();
    this.clearHomeSwitchTimer();
  },

  onUnload() {
    this.stopAutoTimeTicker();
    this.clearFoodSearchTimer();
    this.clearScrollTimer();
    this.clearHomeSwitchTimer();
  },

  resetDynamicDefaults(user = null, callback = null) {
    const currentUser = user || getApp().globalData.currentUser;
    const nextWeightValue = this.data.weightValue || (currentUser ? String(currentUser.weight_kg) : "");
    this.setData(
      {
        foodTime: this.data.foodTime || getCurrentTime(),
        workoutTime: this.data.workoutTime || getCurrentTime(),
        weightDate: this.data.weightDate || getCurrentDate(),
        weightTime: this.data.weightTime || getCurrentTime(),
        weightValue: nextWeightValue,
        weightValueIndex: getOptionIndex(BODY_WEIGHT_OPTIONS, nextWeightValue || 65),
      },
      () => {
        if (typeof callback === "function") {
          callback();
        }
      }
    );
  },

  refreshDynamicTimes(user = null) {
    const nextState = {};
    if (this.data.foodTimeAuto) {
      nextState.foodTime = getCurrentTime();
    }
    if (this.data.workoutTimeAuto) {
      nextState.workoutTime = getCurrentTime();
    }
    if (this.data.weightTimeAuto) {
      nextState.weightTime = getCurrentTime();
      nextState.weightDate = getCurrentDate();
    }

    if (Object.keys(nextState).length) {
      this.setData(nextState, () => {
        this.refreshDerivedState(user || getApp().globalData.currentUser);
      });
    } else if (user) {
      this.resetDynamicDefaults(user, () => {
        this.refreshDerivedState(user);
      });
    }
  },

  startAutoTimeTicker() {
    this.stopAutoTimeTicker();
    this.autoTimeTimer = setInterval(() => {
      this.refreshDynamicTimes();
    }, 30000);
  },

  stopAutoTimeTicker() {
    if (this.autoTimeTimer) {
      clearInterval(this.autoTimeTimer);
      this.autoTimeTimer = null;
    }
  },

  clearFoodSearchTimer() {
    if (this.foodSearchTimer) {
      clearTimeout(this.foodSearchTimer);
      this.foodSearchTimer = null;
    }
  },

  clearScrollTimer() {
    if (this.scrollTimer) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
    }
  },

  clearHomeSwitchTimer() {
    if (this.homeSwitchTimer) {
      clearTimeout(this.homeSwitchTimer);
      this.homeSwitchTimer = null;
    }
  },

  async loadWorkoutOptions() {
    if (this.loadingWorkoutOptions) {
      return;
    }

    this.loadingWorkoutOptions = true;
    try {
      const workoutOptions = await get("/workout/options");
      this.setData(
        {
          workoutOptions,
        },
        () => {
          this.refreshDerivedState();
        }
      );
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    } finally {
      this.loadingWorkoutOptions = false;
    }
  },

  switchTab(event) {
    const activeTab = event.currentTarget.dataset.tab;
    this.syncActiveTabMeta(activeTab);
    this.setData({
      activeTab,
    }, () => {
      this.scrollToRecordSection(activeTab, "top");
    });
  },

  goTrend() {
    wx.switchTab({
      url: "/pages/trend/index",
    });
  },

  goHomeAfterSuccess(delay = 720) {
    this.clearHomeSwitchTimer();
    this.homeSwitchTimer = setTimeout(() => {
      wx.switchTab({
        url: "/pages/home/index",
      });
    }, delay);
  },

  scrollToRecordSection(tabKey, kind = "top") {
    const selector = getRecordScrollSelector(tabKey, kind);
    this.clearScrollTimer();
    this.scrollTimer = setTimeout(() => {
      wx.pageScrollTo({
        selector,
        duration: kind === "bottom" ? 300 : 260,
        offsetTop: kind === "bottom" ? 16 : 12,
      });
    }, 56);
  },

  syncActiveTabMeta(tabKey) {
    const meta = TAB_META[tabKey] || TAB_META.food;
    this.setData({
      activeTabLabel: meta.label,
      activeTabNote: meta.note,
    });
  },

  handleInput(event) {
    const field = event.currentTarget.dataset.field;
    const nextState = {
      [field]: event.detail.value,
    };

    if (field === "foodTime") {
      nextState.foodTimeAuto = false;
    }
    if (field === "workoutTime") {
      nextState.workoutTimeAuto = false;
    }
    if (field === "weightTime" || field === "weightDate") {
      nextState.weightTimeAuto = false;
    }

    this.setData(
      nextState,
      () => {
        if (field === "foodQuery") {
          this.scheduleFoodSearch();
          return;
        }
        this.refreshDerivedState();
      }
    );
  },

  handleValuePicker(event) {
    const field = event.currentTarget.dataset.field;
    const indexField = event.currentTarget.dataset.indexField;
    const optionsKey = event.currentTarget.dataset.options;
    const options = this.data[optionsKey] || [];
    const nextIndex = Number(event.detail.value);
    this.setData(
      {
        [indexField]: nextIndex,
        [field]: getOptionValue(options, nextIndex, this.data[field]),
      },
      () => {
        this.refreshDerivedState();
      }
    );
  },

  handleWorkoutType(event) {
    this.setData(
      {
        workoutTypeIndex: Number(event.detail.value),
      },
      () => {
        this.refreshDerivedState();
      }
    );
  },

  refreshDerivedState(user = null) {
    const sessionUser = user || getApp().globalData.currentUser;
    const selectedOption = this.data.workoutOptions[this.data.workoutTypeIndex] || null;
    const foodCount = this.data.foodResults.length;
    let foodResultSummary = "输入关键词后会自动匹配数据库里的相关食物。";

    if (!this.data.foodQuery.trim()) {
      foodResultSummary = "输入关键词后会自动匹配数据库里的相关食物。";
    } else if (this.data.hasSearchedFood && !foodCount) {
      foodResultSummary = "没有找到匹配结果，建议换更短的关键词。";
    } else if (foodCount) {
      foodResultSummary = `共找到 ${foodCount} 条结果，已自动展开并默认选中第一项。`;
    }

    this.setData({
      foodResultSummary,
      foodPreview: buildFoodPreview(this.data.selectedFood, this.data.foodWeight),
      workoutPreview: buildWorkoutPreview(selectedOption, this.data.workoutDuration, this.data.workoutCalories),
      sleepPreview: calculateSleepDuration(this.data.sleepStart, this.data.sleepEnd) || "按真实时间填写后会自动换算睡眠时长。",
      weightPreview: buildWeightPreview(
        sessionUser ? Number(sessionUser.weight_kg) : 0,
        this.data.weightValue,
        this.data.weightDate,
        this.data.weightTime
      ),
    });
  },

  setLastSubmission(tab, title, detail) {
    this.setData({
      lastSubmission: {
        tab,
        title,
        detail,
      },
    });
  },

  dismissSubmission() {
    this.setData({
      lastSubmission: null,
    });
  },

  scheduleFoodSearch() {
    this.clearFoodSearchTimer();
    const query = this.data.foodQuery.trim();

    if (!query) {
      this.setData(
        {
          hasSearchedFood: false,
          foodResults: [],
          selectedFoodIndex: -1,
          selectedFood: null,
          foodWeight: String(DEFAULT_FOOD_WEIGHT),
          foodWeightIndex: getOptionIndex(FOOD_WEIGHT_OPTIONS, DEFAULT_FOOD_WEIGHT),
        },
        () => {
          this.refreshDerivedState();
        }
      );
      return;
    }

    this.foodSearchTimer = setTimeout(() => {
      this.searchFood(query);
    }, 260);
  },

  handleFoodSearchConfirm() {
    this.clearFoodSearchTimer();
    const query = this.data.foodQuery.trim();
    if (!query) {
      this.scheduleFoodSearch();
      return;
    }
    this.searchFood(query);
  },

  async searchFood(queryOverride = "") {
    const query = (queryOverride || this.data.foodQuery || "").trim();
    if (!query) {
      return;
    }

    const requestQuery = query;
    try {
      const rawFoodResults = await get("/food/search", {
        q: requestQuery,
        limit: 12,
      }, {
        cacheMs: 0,
      });
      const foodResults = Array.isArray(rawFoodResults) ? rawFoodResults.map(enrichFoodSearchResult) : [];
      if (requestQuery !== this.data.foodQuery.trim()) {
        return;
      }
      const defaultFoodWeightState = foodResults.length
        ? buildFoodWeightState(foodResults[0])
        : {
            foodWeight: String(DEFAULT_FOOD_WEIGHT),
            foodWeightIndex: getOptionIndex(FOOD_WEIGHT_OPTIONS, DEFAULT_FOOD_WEIGHT),
          };
      this.setData(
        {
          hasSearchedFood: true,
          foodResults,
          selectedFoodIndex: foodResults.length ? 0 : -1,
          selectedFood: foodResults.length ? foodResults[0] : null,
          ...defaultFoodWeightState,
        },
        () => {
          this.refreshDerivedState();
        }
      );
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    }
  },

  selectFood(event) {
    const selectedFoodIndex = Number(event.currentTarget.dataset.index);
    if (selectedFoodIndex === this.data.selectedFoodIndex) {
      this.scrollToRecordSection("food", "bottom");
      return;
    }
    const selectedFood = this.data.foodResults[selectedFoodIndex] || null;
    this.setData(
      {
        selectedFoodIndex,
        selectedFood,
        ...buildFoodWeightState(selectedFood),
      },
      () => {
        this.refreshDerivedState();
        this.scrollToRecordSection("food", "bottom");
      }
    );
  },

  async submitFood() {
    const user = ensureUser();
    if (!user) {
      return;
    }

    const selectedFood = this.data.foodResults[this.data.selectedFoodIndex];
    const weight = asPositiveNumber(this.data.foodWeight);
    if (!selectedFood) {
      wx.showToast({
        title: "请先选择食物",
        icon: "none",
      });
      return;
    }

    if (!weight) {
      wx.showToast({
        title: "请输入正确的克数",
        icon: "none",
      });
      return;
    }

    try {
      const submitTime = this.data.foodTime;
      await post("/food/log", {
        user_id: user.id,
        food_id: selectedFood.food_id,
        weight_g: weight,
        time: submitTime,
      });
      this.setData(
        {
          foodQuery: "",
          foodResults: [],
          selectedFoodIndex: -1,
          selectedFood: null,
          hasSearchedFood: false,
          foodTime: getCurrentTime(),
          foodWeight: String(DEFAULT_FOOD_WEIGHT),
          foodWeightIndex: getOptionIndex(FOOD_WEIGHT_OPTIONS, DEFAULT_FOOD_WEIGHT),
          foodTimeAuto: true,
        },
        () => {
          this.setLastSubmission("food", `${selectedFood.name} 已记录`, `${weight} g · ${submitTime}`);
          this.refreshDerivedState();
          this.scrollToRecordSection("food", "top");
        }
      );
      wx.showToast({
        title: `${selectedFood.name} 已记录`,
        icon: "success",
      });
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    }
  },

  async estimateWorkout() {
    const user = ensureUser();
    if (!user) {
      return;
    }

    const selectedOption = this.data.workoutOptions[this.data.workoutTypeIndex];
    const duration = asPositiveNumber(this.data.workoutDuration);
    if (!selectedOption) {
      return;
    }

    if (!duration) {
      wx.showToast({
        title: "请输入正确的运动时长",
        icon: "none",
      });
      return;
    }

    try {
      const result = await get("/workout/estimate", {
        user_id: user.id,
        type: selectedOption.type,
        duration_min: duration,
      });
      this.setData(
        {
          workoutCalories: String(result.estimated_calories),
          workoutCalorieIndex: getOptionIndex(WORKOUT_CALORIE_OPTIONS, result.estimated_calories),
        },
        () => {
          this.refreshDerivedState();
          this.scrollToRecordSection("workout", "bottom");
        }
      );
      wx.showToast({
        title: "已自动估算热量",
        icon: "success",
      });
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    }
  },

  async submitWorkout() {
    const user = ensureUser();
    if (!user) {
      return;
    }

    const selectedOption = this.data.workoutOptions[this.data.workoutTypeIndex];
    const duration = asPositiveNumber(this.data.workoutDuration);
    const calories = asPositiveNumber(this.data.workoutCalories);
    if (!selectedOption) {
      wx.showToast({
        title: "请先选择运动类型",
        icon: "none",
      });
      return;
    }

    if (!duration) {
      wx.showToast({
        title: "请输入正确的运动时长",
        icon: "none",
      });
      return;
    }

    if (!calories && calories !== 0) {
      wx.showToast({
        title: "请先填写或估算消耗热量",
        icon: "none",
      });
      return;
    }

    try {
      await post("/workout/log", {
        user_id: user.id,
        type: selectedOption.type,
        duration_min: duration,
        calories_burned: calories,
        workout_time: this.data.workoutTime,
      });
      this.setData({
        workoutTime: getCurrentTime(),
        workoutTimeAuto: true,
      });
      this.setLastSubmission("workout", "运动已记录", `${selectedOption.label} · ${duration} 分钟 · ${calories} kcal`);
      wx.showToast({
        title: "运动已记录",
        icon: "success",
      });
      this.goHomeAfterSuccess();
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    }
  },

  async submitSleep() {
    const user = ensureUser();
    if (!user) {
      return;
    }

    try {
      await post("/sleep/log", {
        user_id: user.id,
        sleep_start: this.data.sleepStart,
        sleep_end: this.data.sleepEnd,
      });
      this.setLastSubmission("sleep", "睡眠已记录", `${this.data.sleepStart} - ${this.data.sleepEnd} · ${calculateSleepDuration(this.data.sleepStart, this.data.sleepEnd)}`);
      wx.showToast({
        title: "睡眠已记录",
        icon: "success",
      });
      this.goHomeAfterSuccess();
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    }
  },

  async submitWeight() {
    const user = ensureUser();
    if (!user) {
      return;
    }

    const weight = asPositiveNumber(this.data.weightValue);
    if (!weight) {
      wx.showToast({
        title: "请输入正确的体重数值",
        icon: "none",
      });
      return;
    }

    try {
      await post("/weight/log", {
        user_id: user.id,
        weight_kg: weight,
        record_date: this.data.weightDate,
        record_time: this.data.weightTime,
      });
      const nextUser = {
        ...user,
        weight_kg: weight,
      };
      getApp().setCurrentUser(nextUser);
      const recordDate = this.data.weightDate;
      const recordTime = this.data.weightTime;
      this.setData(
        {
          weightValue: String(weight),
          weightValueIndex: getOptionIndex(BODY_WEIGHT_OPTIONS, weight),
          weightDate: getCurrentDate(),
          weightTime: getCurrentTime(),
          weightTimeAuto: true,
        },
        () => {
          this.setLastSubmission("weight", "体重已记录", `${weight} kg · ${recordDate} ${recordTime}`);
          this.refreshDerivedState(nextUser);
        }
      );
      wx.showToast({
        title: "体重已记录",
        icon: "success",
      });
      this.goHomeAfterSuccess();
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    }
  },
});
