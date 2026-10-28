const { get } = require("../../utils/request");
const { ensureUser } = require("../../utils/session");

function normalizeDailyRecords(records) {
  if (!Array.isArray(records)) {
    return [];
  }

  return records
    .map((record) => ({
      ...record,
      date: record.date || "",
      total_intake_kcal: Math.round(Number(record.total_intake_kcal) || 0),
      protein: Number(Number(record.protein) || 0).toFixed(1),
      fat: Number(Number(record.fat) || 0).toFixed(1),
      carbs: Number(Number(record.carbs) || 0).toFixed(1),
      food_items: Array.isArray(record.food_items) ? record.food_items : [],
    }))
    .filter((record) => record.food_items.length)
    .reverse();
}

function buildRangeSummary(records) {
  return records.reduce(
    (summary, record) => ({
      calories: summary.calories + record.total_intake_kcal,
      protein: summary.protein + Number(record.protein),
      fat: summary.fat + Number(record.fat),
      carbs: summary.carbs + Number(record.carbs),
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

Page({
  data: {
    rangeDays: 7,
    rangeTabs: [
      { days: 7, label: "近 7 天" },
      { days: 30, label: "近 30 天" },
    ],
    startDate: "",
    endDate: "",
    records: [],
    totalCalories: 0,
    totalProtein: "0.0",
    totalFat: "0.0",
    totalCarbs: "0.0",
    loading: true,
  },

  onShow() {
    this.loadHistory();
  },

  goBack() {
    if (getCurrentPages().length > 1) {
      wx.navigateBack();
      return;
    }

    wx.switchTab({
      url: "/pages/record/index",
    });
  },

  switchRange(event) {
    const rangeDays = Number(event.currentTarget.dataset.days) || 7;
    if (rangeDays === this.data.rangeDays) {
      return;
    }
    this.setData({ rangeDays }, () => this.loadHistory());
  },

  async loadHistory() {
    const user = ensureUser();
    if (!user) {
      return;
    }

    this.setData({ loading: true });
    try {
      const history = await get(
        "/report/food-history",
        {
          user_id: user.id,
          days: this.data.rangeDays,
        },
        { cacheMs: 0 }
      );
      const records = normalizeDailyRecords(history?.daily_records);
      const summary = buildRangeSummary(records);
      this.setData({
        startDate: history?.start_date || "",
        endDate: history?.end_date || "",
        records,
        totalCalories: Math.round(summary.calories),
        totalProtein: summary.protein.toFixed(1),
        totalFat: summary.fat.toFixed(1),
        totalCarbs: summary.carbs.toFixed(1),
      });
    } catch (error) {
      wx.showToast({
        title: error.message || "加载失败",
        icon: "none",
      });
      this.setData({ records: [] });
    } finally {
      this.setData({ loading: false });
    }
  },
});
