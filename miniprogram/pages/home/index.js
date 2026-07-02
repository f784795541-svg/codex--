const { get } = require("../../utils/request");
const { ensureUser } = require("../../utils/session");

const FOOD_LIBRARY_LIMIT = 500;

const MEAL_RECOMMENDATION_BLUEPRINTS = {
  home: [
    {
      key: "breakfast",
      label: "早餐",
      focus: "先把主食和蛋白吃稳，上午更不容易乱加餐",
      structure: "家常早餐：主食 + 蛋白 + 水果或奶",
      slots: [
        { keywords: ["燕麦", "全麦面包", "吐司", "玉米", "红薯", "南瓜", "小米粥"], categories: ["主食"], grams: 120, macro: "carbs", avoidBrand: true },
        { keywords: ["鸡蛋", "牛奶", "无糖酸奶", "豆浆", "豆腐"], categories: ["蛋类", "奶制品", "豆制品"], grams: 150, macro: "protein", avoidBrand: true },
        { keywords: ["苹果", "香蕉", "橙", "猕猴桃", "酸奶"], categories: ["水果", "奶制品"], grams: 150, macro: "light", avoidBrand: true },
      ],
    },
    {
      key: "lunch",
      label: "午餐",
      focus: "中午把整餐补完整，下午状态会更稳",
      structure: "家常午餐：主食 + 一道蛋白 + 一道青菜",
      slots: [
        { keywords: ["米饭", "糙米饭", "面条", "红薯", "玉米"], categories: ["主食"], grams: 180, macro: "carbs", avoidBrand: true },
        { keywords: ["鸡胸肉", "牛肉", "虾仁", "鱼", "豆腐", "鸡蛋"], categories: ["肉类", "海鲜", "豆制品", "蛋类"], grams: 150, macro: "protein", avoidBrand: true },
        { keywords: ["西兰花", "生菜", "菠菜", "黄瓜", "番茄", "油麦菜"], categories: ["蔬菜"], grams: 180, macro: "vegetable", avoidBrand: true },
      ],
    },
    {
      key: "dinner",
      label: "晚餐",
      focus: "晚餐更轻一点，但别把恢复和饱腹感丢掉",
      structure: "家常晚餐：适量主食 + 轻蛋白 + 蔬菜",
      slots: [
        { keywords: ["糙米饭", "米饭", "南瓜", "山药", "玉米"], categories: ["主食"], grams: 140, macro: "carbs", avoidBrand: true },
        { keywords: ["鱼", "虾仁", "鸡胸肉", "豆腐", "鸡蛋"], categories: ["海鲜", "肉类", "豆制品", "蛋类"], grams: 130, macro: "protein", avoidBrand: true, maxCalories: 240 },
        { keywords: ["西兰花", "生菜", "菠菜", "黄瓜", "番茄"], categories: ["蔬菜"], grams: 200, macro: "vegetable", avoidBrand: true },
      ],
    },
  ],
  fitness: [
    {
      key: "breakfast",
      label: "早餐",
      focus: "健身模式先把稳主食和优质蛋白补进去",
      structure: "健身早餐：稳主食 + 轻蛋白 + 水果或奶",
      slots: [
        { keywords: ["燕麦", "全麦面包", "糙米饭", "玉米", "红薯"], categories: ["主食"], grams: 110, macro: "carbs", avoidBrand: true },
        { keywords: ["鸡蛋", "无糖酸奶", "希腊酸奶", "牛奶", "豆浆", "鸡胸肉"], categories: ["蛋类", "奶制品", "豆制品", "肉类"], grams: 150, macro: "protein", avoidBrand: true, maxCalories: 220 },
        { keywords: ["香蕉", "苹果", "蓝莓", "酸奶"], categories: ["水果", "奶制品"], grams: 140, macro: "light", avoidBrand: true },
      ],
    },
    {
      key: "lunch",
      label: "午餐",
      focus: "训练日午餐优先高蛋白和高纤蔬菜",
      structure: "健身午餐：主食 + 优质蛋白 + 高纤蔬菜",
      slots: [
        { keywords: ["糙米饭", "燕麦", "玉米", "红薯", "藜麦"], categories: ["主食"], grams: 170, macro: "carbs", avoidBrand: true },
        { keywords: ["鸡胸肉", "虾仁", "三文鱼", "牛肉", "豆腐"], categories: ["肉类", "海鲜", "豆制品"], grams: 160, macro: "protein", avoidBrand: true, maxCalories: 260 },
        { keywords: ["西兰花", "生菜", "菠菜", "黄瓜", "番茄"], categories: ["蔬菜"], grams: 190, macro: "vegetable", avoidBrand: true },
      ],
    },
    {
      key: "dinner",
      label: "晚餐",
      focus: "晚餐保留恢复蛋白，主食适量收一点",
      structure: "健身晚餐：适量主食 + 恢复蛋白 + 蔬菜",
      slots: [
        { keywords: ["糙米饭", "玉米", "南瓜", "山药", "红薯"], categories: ["主食"], grams: 130, macro: "carbs", avoidBrand: true },
        { keywords: ["鸡胸肉", "虾仁", "三文鱼", "豆腐", "鸡蛋"], categories: ["肉类", "海鲜", "豆制品", "蛋类"], grams: 140, macro: "protein", avoidBrand: true, maxCalories: 240 },
        { keywords: ["西兰花", "生菜", "黄瓜", "菠菜", "番茄"], categories: ["蔬菜"], grams: 210, macro: "vegetable", avoidBrand: true },
      ],
    },
  ],
  eat_out: [
    {
      key: "breakfast",
      label: "早餐",
      focus: "外食早餐先求好买到，再尽量别太油",
      structure: "外食早餐：饭团或三明治 + 蛋白 + 饮品或水果",
      slots: [
        { keywords: ["饭团", "三明治", "全麦面包", "燕麦", "玉米"], categories: ["主食", "轻食", "连锁餐厅"], grams: 120, macro: "carbs", preferBrand: true },
        { keywords: ["茶叶蛋", "鸡蛋", "鸡胸肉", "无糖酸奶", "豆浆"], categories: ["蛋类", "奶制品", "豆制品", "轻食", "连锁餐厅"], grams: 140, macro: "protein", preferBrand: true, maxCalories: 240 },
        { keywords: ["香蕉", "苹果", "牛奶", "酸奶", "豆浆"], categories: ["水果", "奶制品", "饮品"], grams: 150, macro: "light", preferBrand: true },
      ],
    },
    {
      key: "lunch",
      label: "午餐",
      focus: "外食午餐优先可见蛋白，再补一份蔬菜或汤",
      structure: "外食午餐：主食 + 可见蛋白 + 一份蔬菜或汤",
      slots: [
        { keywords: ["米饭", "糙米饭", "意面", "寿司", "沙拉"], categories: ["主食", "轻食", "连锁餐厅"], grams: 170, macro: "carbs", preferBrand: true },
        { keywords: ["鸡胸肉", "牛肉", "虾仁", "鸡蛋", "豆腐"], categories: ["肉类", "海鲜", "蛋类", "豆制品", "轻食", "连锁餐厅"], grams: 150, macro: "protein", preferBrand: true, maxCalories: 280 },
        { keywords: ["沙拉", "生菜", "西兰花", "番茄", "蔬菜汤"], categories: ["蔬菜", "轻食", "连锁餐厅"], grams: 180, macro: "vegetable", preferBrand: true },
      ],
    },
    {
      key: "dinner",
      label: "晚餐",
      focus: "晚餐继续外食时，尽量选更清爽的组合收尾",
      structure: "外食晚餐：轻主食 + 清爽蛋白 + 汤或蔬菜",
      slots: [
        { keywords: ["米饭", "玉米", "寿司", "三明治", "南瓜"], categories: ["主食", "轻食", "连锁餐厅"], grams: 130, macro: "carbs", preferBrand: true },
        { keywords: ["鸡胸肉", "虾仁", "豆腐", "鸡蛋", "鱼"], categories: ["肉类", "海鲜", "豆制品", "蛋类", "轻食", "连锁餐厅"], grams: 140, macro: "protein", preferBrand: true, maxCalories: 240 },
        { keywords: ["沙拉", "生菜", "西兰花", "番茄", "蔬菜汤"], categories: ["蔬菜", "轻食", "连锁餐厅"], grams: 190, macro: "vegetable", preferBrand: true },
      ],
    },
  ],
};

function clampPercent(actual, target) {
  if (!target) {
    return 0;
  }
  const value = (Number(actual) / Number(target)) * 100;
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }
  return Math.min(100, Math.round(value));
}

function goalLabel(goal) {
  const labels = {
    fat_loss: "减脂",
    maintain: "维持",
    muscle_gain: "增肌",
  };
  return labels[goal] || "健康管理";
}

function recommendationModeLabel(mode) {
  const labels = {
    home: "家常模式",
    fitness: "健身模式",
    eat_out: "外食模式",
  };
  return labels[mode] || "家常模式";
}

function resolveRecommendationMode(user) {
  return user?.recommendation_mode || "home";
}

function asNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function remainingMacroKey(summary) {
  const entries = [
    {
      key: "protein",
      remaining: Math.max(asNumber(summary.targets?.protein_target) - asNumber(summary.daily_report?.protein?.actual), 0),
    },
    {
      key: "fat",
      remaining: Math.max(asNumber(summary.targets?.fat_target) - asNumber(summary.daily_report?.fat?.actual), 0),
    },
    {
      key: "carbs",
      remaining: Math.max(asNumber(summary.targets?.carb_target) - asNumber(summary.daily_report?.carbs?.actual), 0),
    },
  ];

  entries.sort((left, right) => right.remaining - left.remaining);
  return entries[0]?.key || "balance";
}

function buildRecommendationHeadline(summary, mode) {
  const dominantMacro = remainingMacroKey(summary);
  const modeLabel = recommendationModeLabel(mode);

  if (dominantMacro === "protein") {
    return `今天更适合优先补蛋白，先按${modeLabel}把优质蛋白排在前面。`;
  }
  if (dominantMacro === "carbs") {
    return `今天主食偏少，三餐先按${modeLabel}把碳水补稳。`;
  }
  if (dominantMacro === "fat") {
    return "今天脂肪摄入偏低，推荐会保留更容易执行的脂肪来源。";
  }
  return `今天整体比较接近目标，继续按${modeLabel}稳住节奏即可。`;
}

function buildRecommendationNote(mode) {
  const notes = {
    home: "家常模式优先推荐更常见、更容易在家做出来的搭配，减少额外采购压力。",
    fitness: "健身模式会更偏向高蛋白、相对清爽、训练日也更容易执行的三餐组合。",
    eat_out: "外食模式优先推荐便利店、轻食或常见外卖更容易买到的食物，尽量避开负担太重的选择。",
  };
  return notes[mode] || notes.home;
}

function mealBucketFromTime(timeText = "") {
  const hour = Number(String(timeText).split(":")[0] || 0);
  if (hour < 10) {
    return "breakfast";
  }
  if (hour < 16) {
    return "lunch";
  }
  return "dinner";
}

function buildMealLogMap(foodItems = []) {
  const map = {
    breakfast: { count: 0 },
    lunch: { count: 0 },
    dinner: { count: 0 },
  };

  foodItems.forEach((item) => {
    const bucket = mealBucketFromTime(item.time);
    map[bucket].count += 1;
  });

  return map;
}

function resolveRecommendationGrams(food, fallbackGrams) {
  const servingSize = Math.round(asNumber(food?.serving_size_g));
  return servingSize > 0 ? servingSize : fallbackGrams;
}

function normalizeFoodPool(foods = []) {
  return Array.isArray(foods) ? foods.filter((food) => food && asNumber(food.calories_per_100g) > 0) : [];
}

function pickRecommendationFood(foods, slot, usedNames) {
  let bestFood = null;
  let bestScore = -Infinity;

  foods.forEach((food) => {
    if (!food || usedNames.has(food.name)) {
      return;
    }

    const name = String(food.name || "");
    const category = String(food.category || "");
    const calories = asNumber(food.calories_per_100g);
    const protein = asNumber(food.protein);
    const carbs = asNumber(food.carbs);
    const matchedIndex = (slot.keywords || []).findIndex((keyword) => name.includes(keyword));
    const categoryMatched = (slot.categories || []).includes(category);

    if (matchedIndex === -1 && !categoryMatched) {
      return;
    }

    let score = 0;
    score += matchedIndex >= 0 ? 120 - matchedIndex * 8 : 24;
    score += categoryMatched ? 22 : 0;
    score += slot.preferBrand ? (food.brand ? 18 : -6) : 0;
    score += slot.avoidBrand ? (food.brand ? -10 : 4) : 0;

    if (slot.maxCalories && calories > slot.maxCalories) {
      score -= (calories - slot.maxCalories) / 6;
    }

    if (slot.macro === "protein") {
      score += protein * 2.2 - calories / 20;
    } else if (slot.macro === "carbs") {
      score += carbs * 1.35 - calories / 32;
    } else if (slot.macro === "vegetable") {
      score += 28 - calories / 18;
    } else {
      score += 16 - calories / 24;
    }

    if (score > bestScore) {
      bestScore = score;
      bestFood = food;
    }
  });

  return bestFood;
}

function buildMealStatusText(mealLog) {
  return mealLog?.count ? `已记录 ${mealLog.count} 项，可按这顿缺口补齐` : "当前还没记录，适合直接照着吃";
}

function buildMealRecommendation(summary, foods) {
  const mode = resolveRecommendationMode(summary.user);
  const blueprint = MEAL_RECOMMENDATION_BLUEPRINTS[mode] || MEAL_RECOMMENDATION_BLUEPRINTS.home;
  const pool = normalizeFoodPool(foods);

  if (!pool.length) {
    return null;
  }

  const usedNames = new Set();
  const mealLogs = buildMealLogMap(summary.daily_report?.food_items || []);
  const meals = blueprint
    .map((meal) => {
      const items = meal.slots
        .map((slot) => {
          const food = pickRecommendationFood(pool, slot, usedNames);
          if (!food) {
            return null;
          }

          usedNames.add(food.name);
          const grams = resolveRecommendationGrams(food, slot.grams);
          return {
            name: food.name,
            grams,
            kcal: Math.round((asNumber(food.calories_per_100g) * grams) / 100),
          };
        })
        .filter(Boolean);

      if (!items.length) {
        return null;
      }

      return {
        label: meal.label,
        focus: meal.focus,
        structure: meal.structure,
        status: buildMealStatusText(mealLogs[meal.key]),
        totalKcal: items.reduce((sum, item) => sum + item.kcal, 0),
        summary: items.map((item) => `${item.name} ${item.grams}g`).join(" + "),
        items,
      };
    })
    .filter(Boolean);

  if (!meals.length) {
    return null;
  }

  return {
    headline: buildRecommendationHeadline(summary, mode),
    note: buildRecommendationNote(mode),
    modeLabel: recommendationModeLabel(mode),
    meals,
  };
}

function formatDateLabel(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "持续观察";
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function computeGoalTimeline(summary) {
  const totalCalories = asNumber(summary.targets?.goal_total_calories);
  const tdee = asNumber(summary.targets?.tdee);
  const calorieTarget = asNumber(summary.targets?.calorie_target);
  const reportDate = summary.daily_report?.date;
  const goal = summary.user?.goal || "fat_loss";
  const suggestedGap = Math.max(Math.abs(tdee - calorieTarget), goal === "muscle_gain" ? 250 : 400);

  if (!totalCalories || goal === "maintain") {
    return {
      daysLabel: "无需倒计时",
      daysNote: "维持模式按周观察节奏变化即可。",
      dateLabel: "持续观察",
      dateNote: "先把当前节奏稳定住，再按周复盘。",
    };
  }

  const estimatedDays = Math.max(Math.ceil(totalCalories / Math.max(suggestedGap, 1)), 1);
  const date = new Date(reportDate);
  if (!Number.isNaN(date.getTime())) {
    date.setDate(date.getDate() + estimatedDays);
  }

  return {
    daysLabel: `${estimatedDays} 天`,
    daysNote: `按当前节奏估算，先稳定坚持 ${estimatedDays} 天左右。`,
    dateLabel: formatDateLabel(date),
    dateNote: `按当前热量差约 ${Math.round(suggestedGap)} kcal / 天推算。`,
  };
}

function buildSummaryView(summary) {
  const timeline = computeGoalTimeline(summary);
  const recommendationMode = recommendationModeLabel(resolveRecommendationMode(summary.user));
  const netBalance = asNumber(summary.daily_report.net_calorie_balance);
  const balanceCopy =
    netBalance > 200
      ? "今天整体摄入偏高，优先收一收热量。"
      : netBalance < -450
        ? "今天缺口偏大，注意别吃得太少。"
        : "今天节奏相对平稳，继续按当前状态执行。";
  const calorieTarget = asNumber(summary.targets?.calorie_target || summary.daily_report.calorie_target_kcal);
  const goalTotalCalories = asNumber(summary.targets?.goal_total_calories);

  return {
    heroSummary: `${goalLabel(summary.user.goal)} · ${recommendationMode} · ${balanceCopy}`,
    heroPills: [
      {
        label: "净差",
        value: `${summary.daily_report.net_calorie_balance} kcal`,
      },
      {
        label: "睡眠",
        value: `${summary.daily_report.sleep_hours} h`,
      },
      {
        label: "模式",
        value: recommendationMode,
      },
    ],
    homeMetrics: [
      {
        label: "当前体重",
        value: `${summary.user.weight_kg} kg`,
        note: summary.user.goal === "maintain" ? "当前以稳定维持为主" : `目标 ${summary.user.target_weight_kg || "-"} kg`,
      },
      {
        label: "目标体重",
        value: summary.user.target_weight_kg ? `${summary.user.target_weight_kg} kg` : "未设置",
        note: summary.user.target_weight_kg ? "可在我的页继续调整" : "建议先补充目标值",
      },
      {
        label: "到达日期",
        value: timeline.dateLabel,
        note: timeline.dateNote,
      },
      {
        label: "坚持天数",
        value: timeline.daysLabel,
        note: timeline.daysNote,
      },
      {
        label: "运动消耗",
        value: `${summary.daily_report.total_burned_kcal} kcal`,
        note: `总消耗 ${summary.daily_report.total_expenditure_kcal} kcal`,
      },
      {
        label: "目标总热量",
        value: goalTotalCalories ? `${Math.round(goalTotalCalories)} kcal` : "无需累计",
        note: calorieTarget ? `今日目标 ${Math.round(calorieTarget)} kcal` : "维持模式不单独累计",
      },
    ],
    goalItems: [
      {
        label: "热量",
        actual: summary.daily_report.total_intake_kcal,
        target: summary.targets?.calorie_target || summary.daily_report.calorie_target_kcal,
        unit: "kcal",
        percent: clampPercent(summary.daily_report.total_intake_kcal, summary.targets?.calorie_target || summary.daily_report.calorie_target_kcal),
      },
      {
        label: "蛋白质",
        actual: summary.daily_report.protein.actual,
        target: summary.daily_report.protein.target,
        unit: "g",
        percent: clampPercent(summary.daily_report.protein.actual, summary.daily_report.protein.target),
        accentClass: "progress-fill-protein",
      },
      {
        label: "脂肪",
        actual: summary.daily_report.fat.actual,
        target: summary.daily_report.fat.target,
        unit: "g",
        percent: clampPercent(summary.daily_report.fat.actual, summary.daily_report.fat.target),
        accentClass: "progress-fill-fat",
      },
      {
        label: "碳水",
        actual: summary.daily_report.carbs.actual,
        target: summary.daily_report.carbs.target,
        unit: "g",
        percent: clampPercent(summary.daily_report.carbs.actual, summary.daily_report.carbs.target),
        accentClass: "progress-fill-carb",
      },
    ],
    suggestionItems: (summary.daily_report.suggestions || []).slice(0, 3),
    warningItems: (summary.daily_report.warnings || []).slice(0, 2),
    recentWeightItems: summary.recent_weights || [],
  };
}

Page({
  data: {
    loading: true,
    summary: null,
    heroSummary: "",
    heroPills: [],
    homeMetrics: [],
    goalItems: [],
    suggestionItems: [],
    warningItems: [],
    recentWeightItems: [],
    mealRecommendation: null,
  },

  onShow() {
    const user = ensureUser();
    if (!user) {
      return;
    }
    this.loadSummary(user.id);
  },

  async ensureFoodLibrary() {
    const app = getApp();
    if (Array.isArray(app.globalData.foodLibrary) && app.globalData.foodLibrary.length) {
      return app.globalData.foodLibrary;
    }

    if (app.globalData.foodLibraryPromise) {
      return app.globalData.foodLibraryPromise;
    }

    app.globalData.foodLibraryPromise = get(
      "/food/database",
      {
        limit: FOOD_LIBRARY_LIMIT,
        offset: 0,
      },
      {
        cacheMs: 300000,
      }
    )
      .then((foods) => {
        const list = normalizeFoodPool(foods);
        app.globalData.foodLibrary = list;
        return list;
      })
      .finally(() => {
        app.globalData.foodLibraryPromise = null;
      });

    return app.globalData.foodLibraryPromise;
  },

  async loadSummary(userId) {
    if (this.summaryLoadingUserId === userId) {
      return;
    }

    const requestId = (this.summaryRequestId || 0) + 1;
    this.summaryRequestId = requestId;
    this.summaryLoadingUserId = userId;

    if (!this.data.summary && !this.data.loading) {
      this.setData({
        loading: true,
      });
    }

    try {
      const [summary, foodLibrary] = await Promise.all([
        get("/dashboard/summary", {
          user_id: userId,
        }),
        this.ensureFoodLibrary(),
      ]);

      if (requestId !== this.summaryRequestId) {
        return;
      }

      const view = buildSummaryView(summary);
      const mealRecommendation = buildMealRecommendation(summary, foodLibrary);
      this.setData({
        summary,
        heroSummary: view.heroSummary,
        heroPills: view.heroPills,
        homeMetrics: view.homeMetrics,
        goalItems: view.goalItems,
        suggestionItems: view.suggestionItems,
        warningItems: view.warningItems,
        recentWeightItems: view.recentWeightItems,
        mealRecommendation,
      });
    } catch (error) {
      if (requestId !== this.summaryRequestId) {
        return;
      }
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    } finally {
      if (requestId === this.summaryRequestId) {
        this.summaryLoadingUserId = null;
        this.setData({
          loading: false,
        });
      }
    }
  },

  goRecord() {
    wx.switchTab({
      url: "/pages/record/index",
    });
  },

  goTrend() {
    wx.switchTab({
      url: "/pages/trend/index",
    });
  },
});
