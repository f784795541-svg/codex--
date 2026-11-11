const { getStoredUser } = require("./auth");

async function ensureUser() {
  const app = getApp();
  const user = app.globalData.currentUser || getStoredUser();
  if (user) {
    app.setCurrentUser(user);
    return user;
  }

  try {
    return await app.bootstrapSession();
  } catch (error) {
    wx.showToast({ title: "暂时无法初始化账户，请重试", icon: "none" });
    return null;
  }
}

module.exports = {
  ensureUser,
};
