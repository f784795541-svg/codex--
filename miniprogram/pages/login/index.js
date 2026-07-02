const { post } = require("../../utils/request");

Page({
  data: {
    username: "",
    password: "",
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
      getApp().setCurrentUser(result.user);
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

  goRegister() {
    wx.navigateTo({
      url: "/pages/register/index",
    });
  },
});
