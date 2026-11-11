const { get, post } = require("../../utils/request");

Page({
  data: {
    username: "",
    password: "",
    loading: false,
    foodQuery: "",
    foodResults: [],
    foodLoading: false,
    foodSearched: false,
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

  handleFoodQuery(event) {
    this.setData({ foodQuery: event.detail.value });
  },

  async searchFoods() {
    const query = this.data.foodQuery.trim();
    if (!query || this.data.foodLoading) {
      return;
    }

    this.setData({ foodLoading: true, foodSearched: true });
    try {
      const foods = await get(
        "/food/search",
        { q: query, limit: 6, platform: "mini_program_guest" },
        { redirectOnUnauthorized: false, cacheMs: 0 }
      );
      this.setData({
        foodResults: (foods || []).map((food) => ({
          id: food.id || food.food_id,
          name: food.name,
          category: food.category || "食物",
          calories: Math.round(Number(food.calories_per_100g) || 0),
          protein: Number(food.protein || 0).toFixed(1),
        })),
      });
    } catch (error) {
      wx.showToast({ title: error.message || "暂时无法搜索", icon: "none" });
    } finally {
      this.setData({ foodLoading: false });
    }
  },

  async submit() {
    const { username, password, loading } = this.data;
    if (loading) {
      return;
    }

    if (!username.trim() || !password.trim()) {
      wx.showToast({
        title: "请输入账号和密码",
        icon: "none",
      });
      return;
    }

    this.setData({ loading: true });

    try {
      const result = await post("/auth/login", {
        username: username.trim(),
        password,
      });
      getApp().setCurrentUser(result.user, result.access_token);
      wx.showToast({
        title: "登录成功",
        icon: "success",
      });
      setTimeout(() => {
        wx.switchTab({
          url: "/pages/home/index",
        });
      }, 300);
    } catch (error) {
      wx.showToast({
        title: error.message,
        icon: "none",
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  async wechatLogin() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const result = await new Promise((resolve, reject) => wx.login({ success: resolve, fail: reject }));
      if (!result.code) throw new Error("微信登录失败，请重试");
      const auth = await post("/wechat/login", { code: result.code }, { redirectOnUnauthorized: false });
      getApp().setCurrentUser(auth.user, auth.access_token);
      wx.switchTab({ url: "/pages/home/index" });
    } catch (error) {
      if (error.statusCode === 404) {
        wx.showModal({
          title: "首次使用微信登录",
          content: "请先填写身体资料创建账号。已有账号可先使用账号密码登录，再到“我的”绑定微信。",
          confirmText: "创建账号",
          success: result => { if (result.confirm) wx.navigateTo({ url: "/pages/register/index?wechat=1" }); },
        });
        return;
      }
      wx.showToast({ title: error.message || "微信登录暂不可用", icon: "none" });
    } finally { this.setData({ loading: false }); }
  },

  goRegister() {
    wx.navigateTo({
      url: "/pages/register/index",
    });
  },

  showPasswordResetHelp() {
    wx.showModal({
      title: "忘记密码",
      content: "当前版本不支持只凭用户名直接改密码。请联系管理员按用户名重置临时密码，登录后再到“我的”里修改为自己的新密码。",
      showCancel: false,
      confirmText: "知道了",
    });
  },
});
