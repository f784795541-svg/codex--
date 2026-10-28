const { get, isUnauthorizedRedirectError } = require("../../utils/request");
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

function buildWeightLineChart(weights, key, days) {
  const normalizedWeights = sortWeightsNewestFirst(Array.isArray(weights) ? weights : []);
  const latestDate = normalizedWeights[0]?.record_date;
  if (!latestDate) {
    return {
      key,
      count: 0,
      points: [],
      rangeLabel: "--",
    };
  }

  const cutoff = new Date(`${latestDate}T12:00:00`);
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const cutoffDate = cutoff.toISOString().slice(0, 10);
  const latestByDate = new Map();
  normalizedWeights.forEach((item) => {
    if (item.record_date >= cutoffDate && !latestByDate.has(item.record_date)) {
      latestByDate.set(item.record_date, item);
    }
  });

  const points = [...latestByDate.values()]
    .reverse()
    .map((item, index) => ({
      id: item.id || `${item.record_date}-${item.record_time || index}`,
      value: Number(item.weight_kg),
      date: item.record_date,
      label: formatShortDateLabel(item.record_date),
    }))
    .filter((item) => Number.isFinite(item.value));

  return {
    key,
    count: points.length,
    points,
    rangeLabel: points.length ? formatDateRange(points[0].date, points[points.length - 1].date) : "--",
  };
}

function traceSmoothLine(context, coordinates) {
  if (!coordinates.length) {
    return;
  }

  context.moveTo(coordinates[0].x, coordinates[0].y);
  if (coordinates.length === 1) {
    return;
  }

  for (let index = 1; index < coordinates.length - 1; index += 1) {
    const current = coordinates[index];
    const next = coordinates[index + 1];
    context.quadraticCurveTo(current.x, current.y, (current.x + next.x) / 2, (current.y + next.y) / 2);
  }

  const last = coordinates[coordinates.length - 1];
  context.lineTo(last.x, last.y);
}

function drawWeightLineCanvas(canvas, chart, selectedIndex, width, height) {
  const context = canvas.getContext("2d");
  const pixelRatio = wx.getSystemInfoSync().pixelRatio || 1;
  const padding = { top: 24, right: 18, bottom: 34, left: 46 };
  const values = chart.points.map((item) => item.value);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const dataRange = Math.max(maximum - minimum, 0.4);
  const valuePadding = Math.max(dataRange * 0.18, 0.2);
  const lowerBound = minimum - valuePadding;
  const upperBound = maximum + valuePadding;
  const plotWidth = Math.max(width - padding.left - padding.right, 1);
  const plotHeight = Math.max(height - padding.top - padding.bottom, 1);
  const valueRange = Math.max(upperBound - lowerBound, 0.1);
  const coordinates = chart.points.map((item, index) => ({
    ...item,
    x: padding.left + (chart.points.length === 1 ? plotWidth / 2 : (index / (chart.points.length - 1)) * plotWidth),
    y: padding.top + ((upperBound - item.value) / valueRange) * plotHeight,
  }));

  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  context.scale(pixelRatio, pixelRatio);
  context.clearRect(0, 0, width, height);

  context.strokeStyle = "rgba(111, 145, 151, 0.16)";
  context.lineWidth = 1;
  context.setLineDash([3, 4]);
  context.font = "11px sans-serif";
  context.fillStyle = "#789196";
  for (let index = 0; index < 3; index += 1) {
    const ratio = index / 2;
    const y = padding.top + ratio * plotHeight;
    const value = upperBound - ratio * valueRange;
    context.beginPath();
    context.moveTo(padding.left, y);
    context.lineTo(width - padding.right, y);
    context.stroke();
    context.fillText(`${value.toFixed(1)}`, 2, y + 4);
  }
  context.setLineDash([]);

  const gradient = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, "rgba(64, 129, 139, 0.22)");
  gradient.addColorStop(1, "rgba(64, 129, 139, 0.01)");
  context.beginPath();
  traceSmoothLine(context, coordinates);
  context.lineTo(coordinates[coordinates.length - 1].x, height - padding.bottom);
  context.lineTo(coordinates[0].x, height - padding.bottom);
  context.closePath();
  context.fillStyle = gradient;
  context.fill();

  context.beginPath();
  traceSmoothLine(context, coordinates);
  context.strokeStyle = "#2f6670";
  context.lineWidth = 2.5;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.stroke();

  coordinates.forEach((point, index) => {
    const isSelected = index === selectedIndex;
    context.beginPath();
    context.arc(point.x, point.y, isSelected ? 5 : 2.2, 0, Math.PI * 2);
    context.fillStyle = isSelected ? "#1d4f58" : "#6f9ea5";
    context.fill();
    if (isSelected) {
      context.beginPath();
      context.arc(point.x, point.y, 8, 0, Math.PI * 2);
      context.strokeStyle = "rgba(47, 102, 112, 0.22)";
      context.lineWidth = 4;
      context.stroke();
      context.beginPath();
      context.moveTo(point.x, padding.top);
      context.lineTo(point.x, height - padding.bottom);
      context.setLineDash([3, 4]);
      context.strokeStyle = "rgba(47, 102, 112, 0.36)";
      context.lineWidth = 1;
      context.stroke();
      context.setLineDash([]);
    }
  });

  const labels = [coordinates[0], coordinates[Math.floor((coordinates.length - 1) / 2)], coordinates[coordinates.length - 1]];
  context.fillStyle = "#799197";
  context.font = "11px sans-serif";
  labels.forEach((point, index) => {
    context.textAlign = index === 0 ? "left" : index === labels.length - 1 ? "right" : "center";
    context.fillText(point.label, point.x, height - 10);
  });
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
  let statusClass = "status-normal";

  if (bmi < 18.5) {
    status = "偏轻";
    description = "当前 BMI 偏低，建议优先保证规律进食、蛋白质摄入和睡眠恢复。";
    statusClass = "status-under";
  } else if (bmi >= 24 && bmi < 28) {
    status = "偏高";
    description = "当前 BMI 已高于常见参考区间，建议继续控制热量并维持活动量。";
    statusClass = "status-over";
  } else if (bmi >= 28) {
    status = "肥胖";
    description = "当前 BMI 明显偏高，需要更系统地控制饮食结构并持续记录趋势。";
    statusClass = "status-obese";
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
    statusClass,
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
  const weightInsights = buildWeightInsights(normalizedWeights.slice(0, 30));
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
  const monthWeightChart = buildWeightLineChart(normalizedWeights, "month", 30);
  const halfYearWeightChart = buildWeightLineChart(normalizedWeights, "halfYear", 180);

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
    monthWeightChart,
    halfYearWeightChart,
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
    monthWeightChart: null,
    halfYearWeightChart: null,
    activeWeightChartKey: "",
    activeWeightPoint: null,
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
        get("/weight/history", { user_id: userId, limit: 180 }),
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
        monthWeightChart: view.monthWeightChart,
        halfYearWeightChart: view.halfYearWeightChart,
        activeWeightChartKey: "",
        activeWeightPoint: null,
        assessment: view.assessment,
        suggestionItems: view.suggestionItems,
        warningItems: view.warningItems,
      }, () => this.drawWeightLineCharts());
    } catch (error) {
      if (requestId !== this.trendRequestId) {
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
      if (requestId === this.trendRequestId) {
        this.trendLoadingUserId = null;
        this.setData({
          loading: false,
        });
      }
    }
  },

  drawWeightLineCharts() {
    ["month", "halfYear"].forEach((key) => {
      const chart = this.data[`${key}WeightChart`];
      if (!chart?.points?.length) {
        return;
      }
      wx.createSelectorQuery()
        .in(this)
        .select(`#weight-line-${key}`)
        .fields({ node: true, size: true, rect: true }, (result) => {
          if (!result?.node || !result.width || !result.height) {
            return;
          }
          this.weightChartCanvases = this.weightChartCanvases || {};
          this.weightChartCanvases[key] = {
            canvas: result.node,
            width: result.width,
            height: result.height,
            left: result.left,
          };
          const selectedIndex = this.data.activeWeightChartKey === key ? this.data.activeWeightPoint?.index : -1;
          drawWeightLineCanvas(result.node, chart, selectedIndex, result.width, result.height);
        })
        .exec();
    });
  },

  handleWeightChartTouch(event) {
    const key = event.currentTarget.dataset.chartKey;
    const chart = this.data[`${key}WeightChart`];
    const canvasInfo = this.weightChartCanvases?.[key];
    const touch = event.touches?.[0] || event.changedTouches?.[0];
    if (!chart?.points?.length || !canvasInfo || !touch) {
      return;
    }

    const clientX = Number(touch.clientX);
    const localX = Number.isFinite(clientX) ? clientX - canvasInfo.left : Number(touch.x || 0);
    const ratio = Math.max(0, Math.min(1, (localX - 46) / Math.max(canvasInfo.width - 64, 1)));
    const index = Math.round(ratio * (chart.points.length - 1));
    const point = chart.points[index];
    this.setData({
      activeWeightChartKey: key,
      activeWeightPoint: {
        index,
        date: point.date,
        value: `${point.value.toFixed(1)} kg`,
        leftPercent: Math.max(13, Math.min(87, 8 + ratio * 84)).toFixed(1),
      },
    }, () => this.drawWeightLineCharts());
  },

  handleWeightChartTouchEnd() {
    if (!this.data.activeWeightChartKey) {
      return;
    }
    this.setData({
      activeWeightChartKey: "",
      activeWeightPoint: null,
    }, () => this.drawWeightLineCharts());
  },
});
