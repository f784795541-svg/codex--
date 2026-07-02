const { getStoredUser, setStoredUser, clearStoredUser } = require("./utils/auth");

App({
  globalData: {
    currentUser: null,
  },

  onLaunch() {
    this.globalData.currentUser = getStoredUser();
  },

  setCurrentUser(user) {
    this.globalData.currentUser = user;
    setStoredUser(user);
  },

  clearCurrentUser() {
    this.globalData.currentUser = null;
    clearStoredUser();
  },
});
