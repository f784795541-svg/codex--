const { get, del } = require("../../utils/request");
const { ensureUser } = require("../../utils/session");
const { getCurrentDate } = require("../../utils/date");

function normalizeFoodItems(foodItems) {
  if (!Array.isArray(foodItems)) {
    return [];
  }

  return foodItems
    .map((item) => ({
      ...item,
      id: Number(item.id) || 0,
      calories: Math.round(Number(item.calories) || 0),
      protein: Number(Number(item.protein) || 0).toFixed(1),
      fat: Number(Number(item.fat) || 0).toFixed(1),
      carbs: Number(Number(item.carbs) || 0).toFixed(1),
      weight_g: Number(item.weight_g) || 0,
      time: item.time || "--:--",
    }))
    .sort((left, right) => String(right.time).localeCompare(String(left.time)));
}

function buildSummary(foodItems) {
  if (!foodItems.length) {
    return {
      totalCalories: 0,
      text: "这里会把你今天所有已记录的食物集中展示，方便回看今天到底吃了什么。",
    };
  }

  const totalCalories = foodItems.reduce((sum, item) => sum + (Number(item.calories) || 0), 0);
  const totalWeight = foodItems.reduce((sum, item) => sum + (Number(item.weight_g) || 0), 0);

  return {
    totalCalories: Math.round(totalCalories),
    text: `今天已记录 ${foodItems.length} 条，共约 ${Math.round(totalWeight)} g，可以按时间回看今天吃过的每一条。`,
  };
}

Page({
  data: {
    reportDateLabel: "今天",
    summaryText: "加载中...",
    totalCalories: 0,
    foodItems: [],
    deletingLogId: 0,
  },

  onShow() {
    this.loadTodayFoodHistory();
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

  async loadTodayFoodHistory() {
    const user = ensureUser();
    if (!user) {
      return;
    }

    try {
      const reportDate = getCurrentDate();
      const report = await get(
        "/report/daily",
        {
          user_id: user.id,
          report_date: reportDate,
        },
        {
          cacheMs: 0,
        }
      );
      const foodItems = normalizeFoodItems(report?.food_items || []);
      const summary = buildSummary(foodItems);
      this.setData({
        reportDateLabel: report?.date || reportDate,
        summaryText: summary.text,
        totalCalories: summary.totalCalories,
        foodItems,
      });
    } catch (error) {
      this.setData({
        reportDateLabel: getCurrentDate(),
        summaryText: "今天饮食记录暂时加载失败，可以稍后再试。",
        totalCalories: 0,
        foodItems: [],
      });
      wx.showToast({
        title: error.message || "加载失败",
        icon: "none",
      });
    }
  },

  handleDeleteFoodLog(event) {
    const logId = Number(event.currentTarget.dataset.logId || 0);
    const foodName = String(event.currentTarget.dataset.foodName || "");
    if (!logId || this.data.deletingLogId) {
      return;
    }

    wx.showModal({
      title: "删除记录",
      content: foodName ? `确定删除“${foodName}”这条饮食记录吗？` : "确定删除这条饮食记录吗？",
      confirmColor: "#d85b57",
      success: ({ confirm }) => {
        if (!confirm) {
          return;
        }
        this.deleteFoodLog(logId, foodName);
      },
    });
  },

  async deleteFoodLog(logId, foodName = "") {
    const user = ensureUser();
    if (!user) {
      return;
    }

    this.setData({
      deletingLogId: logId,
    });

    try {
      await del(`/food/log/${logId}`, {
        user_id: user.id,
      });
      await this.loadTodayFoodHistory();
      wx.showToast({
        title: foodName ? `${foodName}已删除` : "记录已删除",
        icon: "none",
      });
    } catch (error) {
      wx.showToast({
        title: error.message || "删除失败",
        icon: "none",
      });
    } finally {
      this.setData({
        deletingLogId: 0,
      });
    }
  },
});
