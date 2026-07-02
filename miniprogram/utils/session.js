const { getStoredUser } = require("./auth");

function ensureUser() {
  const app = getApp();
  const user = app.globalData.currentUser || getStoredUser();
  if (user) {
    app.setCurrentUser(user);
    return user;
  }

  wx.reLaunch({
    url: "/pages/login/index",
  });
  return null;
}

module.exports = {
  ensureUser,
};
