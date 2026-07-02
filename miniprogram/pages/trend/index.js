const { get } = require("../../utils/request");
const { ensureUser } = require("../../utils/session");

function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return "最近 7 天";
  }
  return `${String(startDate).slice(5)} 至 ${String(endDate).slice(5)}`;
}

function formatShortDateLabel(value) {
  return value ? String(value).slice(5) : "--";
}

function buildWeightSortKey(item) {
  return `${item?.record_date || ""} ${item?.record_time || ""}`;
}

function sortWeightsNewestFirst(weights = []) {
  return [...weights].sort((left, right) => buildWeightSortKey(right).localeCompare(buildWeightSortKey(left)));
}

function clampPercent(actual, target) {
  const value = (Number(actual || 0) / Math.max(Number(target || 0), 1)) * 100;
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return Math.min(100, Math.round(value));
}

function buildAssessment(user) {
  if (!user) {
    return null;
  }

  const heightM = Number(user.height_cm || 0) / 100;
  const weight = Number(user.weight_kg || 0);
  const age = Number(user.age || 0);
  const bmi = heightM > 0 ? weight / (heightM * heightM) : 0;
  let status = "正常";
  let description = "当前 BMI 处于常见成人参考区间，继续保持当前节奏即可。";

  if (bmi < 18.5) {
    status = "偏轻";
    description = "当前 BMI 偏低，建议优先保证规律进食、蛋白质摄入和睡眠恢复。";
  } else if (bmi >= 24 && bmi < 28) {
    status = "偏高";
    description = "当前 BMI 已高于常见参考区间，建议继续控制热量并维持活动量。";
  } else if (bmi >= 28) {
    status = "肥胖";
    description = "当前 BMI 明显偏高，需要更系统地控制饮食结构并持续记录趋势。";
  }

  let bmr = 0;
  if (user.gender === "female") {
    bmr = 10 * weight + 6.25 * Number(user.height_cm || 0) - 5 * age - 161;
  } else {
    bmr = 10 * weight + 6.25 * Number(user.height_cm || 0) - 5 * age + 5;
  }

  const markerPercent = Math.max(8, Math.min(((bmi - 14) / 18) * 100, 92));

  return {
    bmi: bmi ? Number(bmi.toFixed(1)) : 0,
    status,
    description,
    bmr: Math.round(Math.max(bmr, 0)),
    markerPercent: Number.isFinite(markerPercent) ? markerPercent.toFixed(1) : "8.0",
    currentWeight: `${weight || "-"} kg`,
    targetWeight: user.target_weight_kg ? `${user.target_weight_kg} kg` : "未设置",
  };
}

function buildWeightInsights(weights) {
  const normalizedWeights = sortWeightsNewestFirst(Array.isArray(weights) ? weights : []);
  if (!normalizedWeights.length) {
    return {
      weightSummary: null,
      weightStats: [],
    };
  }

  const values = normalizedWeights.map((item) => Number(item.weight_kg || 0)).filter((value) => Number.isFinite(value));
  const latestWeight = normalizedWeights[0];
  const earliestWeight = normalizedWeights[normalizedWeights.length - 1];
  const latestValue = Number(latestWeight.weight_kg || 0);
  const earliestValue = Number(earliestWeight.weight_kg || 0);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const delta = latestValue - earliestValue;
  const deltaLabel = `${delta > 0 ? "+" : ""}${delta.toFixed(1)} kg`;

  return {
    weightSummary: {
      latest: `${latestWeight.weight_kg} kg`,
      note: `${latestWeight.record_date}${latestWeight.record_time ? ` ${latestWeight.record_time}` : ""}`,
    },
    weightStats: [
      {
        label: "最新体重",
        value: `${latestValue.toFixed(1)} kg`,
        note: "最近一次记录",
      },
      {
        label: "阶段变化",
        value: deltaLabel,
        note: `${formatShortDateLabel(earliestWeight.record_date)} 至 ${formatShortDateLabel(latestWeight.record_date)}`,
      },
      {
        label: "区间波动",
        value: `${(maxValue - minValue).toFixed(1)} kg`,
        note: `${minValue.toFixed(1)} - ${maxValue.toFixed(1)} kg`,
      },
    ],
  };
}

function buildTrendView(user, dailyReport, weeklyReport, weights) {
  const normalizedWeights = sortWeightsNewestFirst(Array.isArray(weights) ? weights : []);
  const latestWeight = normalizedWeights.length ? normalizedWeights[0] : null;
  const assessment = buildAssessment(user);
  const weightInsights = buildWeightInsights(normalizedWeights);
  const macroItems = dailyReport ? [
    {
      label: "蛋白质",
      actual: dailyReport.protein.actual,
      target: dailyReport.protein.target,
      note: dailyReport.protein.status,
      percent: clampPercent(dailyReport.protein.actual, dailyReport.protein.target),
      accentClass: "progress-fill-protein",
    },
    {
      label: "脂肪",
      actual: dailyReport.fat.actual,
      target: dailyReport.fat.target,
      note: dailyReport.fat.status,
      percent: clampPercent(dailyReport.fat.actual, dailyReport.fat.target),
      accentClass: "progress-fill-fat",
    },
    {
      label: "碳水",
      actual: dailyReport.carbs.actual,
      target: dailyReport.carbs.target,
      note: dailyReport.carbs.status,
      percent: clampPercent(dailyReport.carbs.actual, dailyReport.carbs.target),
      accentClass: "progress-fill-carb",
    },
  ] : [];
  const weeklyDetails = (weeklyReport?.daily_reports || []).map((item) => ({
    date: formatShortDateLabel(item.date),
    intake: `${item.total_intake_kcal} kcal`,
    burned: `${item.total_burned_kcal} kcal`,
    sleep: `${item.sleep_hours} h`,
    balance: `${item.net_calorie_balance} kcal`,
    status: item.sleep_status,
    conclusion: item.conclusion,
  }));
  const weightBars = normalizedWeights.slice(0, 7).reverse().map((item, index, list) => {
    const values = list.map((entry) => Number(entry.weight_kg || 0)).filter((value) => Number.isFinite(value));
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const currentValue = Number(item.weight_kg || 0);
    const range = Math.max(maxValue - minValue, 0.1);
    const heightPercent = Math.max(26, Math.round(((currentValue - minValue) / range) * 74 + 26));
    return {
      id: item.id || `${item.record_date}-${index}`,
      date: formatShortDateLabel(item.record_date),
      value: `${currentValue.toFixed(1)} kg`,
      heightPercent,
    };
  });

  return {
    heroPills: [
      {
        label: "今日净差",
        value: dailyReport ? `${dailyReport.net_calorie_balance} kcal` : "--",
      },
      {
        label: "平均睡眠",
        value: weeklyReport ? `${weeklyReport.average_sleep_hours} h` : "--",
      },
      {
        label: "最近体重",
        value: latestWeight ? `${latestWeight.weight_kg} kg` : "--",
      },
    ],
    dailyItems: dailyReport ? [
      {
        label: "热量差值",
        value: dailyReport.net_calorie_balance,
        note: "kcal",
      },
      {
        label: "睡眠时长",
        value: dailyReport.sleep_hours,
        note: dailyReport.sleep_status,
      },
      {
        label: "今日摄入",
        value: dailyReport.total_intake_kcal,
        note: "kcal",
      },
      {
        label: "运动消耗",
        value: dailyReport.total_burned_kcal,
        note: "kcal",
      },
    ] : [],
    weeklyRangeLabel: weeklyReport ? formatDateRange(weeklyReport.start_date, weeklyReport.end_date) : "最近 7 天",
    weeklyItems: weeklyReport ? [
      {
        label: "平均摄入",
        value: weeklyReport.average_intake_kcal,
        note: "kcal",
      },
      {
        label: "平均消耗",
        value: weeklyReport.average_burned_kcal,
        note: "kcal",
      },
      {
        label: "平均睡眠",
        value: weeklyReport.average_sleep_hours,
        note: "h",
      },
      {
        label: "平均净值",
        value: weeklyReport.average_net_balance,
        note: "kcal",
      },
    ] : [],
    macroItems,
    weeklyDetails,
    weightSummary: weightInsights.weightSummary,
    weightStats: weightInsights.weightStats,
    weightBars,
    assessment,
    suggestionItems: (dailyReport?.suggestions || []).slice(0, 2),
    warningItems: (dailyReport?.warnings || []).slice(0, 2),
  };
}

Page({
  data: {
    dailyReport: null,
    weeklyReport: null,
    weights: [],
    heroPills: [],
    dailyItems: [],
    weeklyItems: [],
    macroItems: [],
    weeklyRangeLabel: "最近 7 天",
    weeklyDetails: [],
    weightSummary: null,
    weightStats: [],
    weightBars: [],
    assessment: null,
    suggestionItems: [],
    warningItems: [],
    loading: true,
  },

  onShow() {
    const user = ensureUser();
    if (!user) {
      return;
    }
    this.loadTrendData(user.id);
  },

  async loadTrendData(userId) {
    if (this.trendLoadingUserId === userId) {
      return;
    }

    const requestId = (this.trendRequestId || 0) + 1;
    this.trendRequestId = requestId;
    this.trendLoadingUserId = userId;

    if (!this.data.dailyReport && !this.data.loading) {
      this.setData({
        loading: true,
      });
    }

    try {
      const currentUser = getApp().globalData.currentUser;
      const [dailyReport, weeklyReport, weights] = await Promise.all([
        get("/report/daily", { user_id: userId }),
        get("/report/weekly", { user_id: userId }),
        get("/weight/history", { user_id: userId, limit: 14 }),
      ]);
      if (requestId !== this.trendRequestId) {
        return;
      }
      const normalizedWeights = sortWeightsNewestFirst(weights);
      const view = buildTrendView(currentUser, dailyReport, weeklyReport, normalizedWeights);
      this.setData({
        dailyReport,
        weeklyReport,
        weights: normalizedWeights,
        heroPills: view.heroPills,
        dailyItems: view.dailyItems,
        weeklyItems: view.weeklyItems,
        macroItems: view.macroItems,
        weeklyRangeLabel: view.weeklyRangeLabel,
        weeklyDetails: view.weeklyDetails,
        weightSummary: view.weightSummary,
        weightStats: view.weightStats,
        weightBars: view.weightBars,
        assessment: view.assessment,
        suggestionItems: view.suggestionItems,
        warningItems: view.warningItems,
      });
    } catch (error) {
      if (requestId !== this.trendRequestId) {
        return;
      }
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    } finally {
      if (requestId === this.trendRequestId) {
        this.trendLoadingUserId = null;
        this.setData({
          loading: false,
        });
      }
    }
  },
});
