const { getStoredUser, getStoredAuthToken, setStoredUser, clearStoredUser } = require("./utils/auth");

App({
  globalData: {
    currentUser: null,
    authToken: "",
  },

  onLaunch() {
    this.globalData.currentUser = getStoredUser();
    this.globalData.authToken = getStoredAuthToken();
  },

  setCurrentUser(user, token = "") {
    this.globalData.currentUser = user;
    if (token) {
      this.globalData.authToken = token;
    }
    setStoredUser(user, token);
  },

  clearCurrentUser() {
    this.globalData.currentUser = null;
    this.globalData.authToken = "";
    clearStoredUser();
  },
});
