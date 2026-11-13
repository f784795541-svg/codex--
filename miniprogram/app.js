const { getStoredUser, getStoredAuthToken, setStoredUser, clearStoredUser } = require("./utils/auth");
const { post } = require("./utils/request");

function getWechatCode() {
  return new Promise((resolve, reject) => {
    wx.login({
      success: result => result.code ? resolve(result.code) : reject(new Error("小程序身份初始化失败")),
      fail: reject,
    });
  });
}

async function openWechatSession() {
  try {
    return await post("/wechat/session", { code: await getWechatCode() }, { redirectOnUnauthorized: false });
  } catch (error) {
    if (error.statusCode !== 404) {
      throw error;
    }
  }

  try {
    return await post("/wechat/login", { code: await getWechatCode() }, { redirectOnUnauthorized: false });
  } catch (error) {
    if (error.statusCode !== 404) {
      throw error;
    }
  }

  return post("/wechat/register", {
    code: await getWechatCode(),
    name: "轻养用户",
    age: 25,
    gender: "female",
    height_cm: 165,
    weight_kg: 60,
    target_weight_kg: 55,
    target_sleep_hours: 8,
  }, { redirectOnUnauthorized: false });
}

async function restoreStoredAccount(app) {
  if (!app.globalData.currentUser || !app.globalData.authToken) {
    return null;
  }

  // A device's saved health account takes priority over automatic WeChat session creation.
  // Explicit actions such as step sync or device linking decide when to bind WeChat again.
  return {
    user: app.globalData.currentUser,
    access_token: app.globalData.authToken,
  };
}

App({
  globalData: {
    currentUser: null,
    authToken: "",
  },

  onLaunch() {
    this.globalData.currentUser = getStoredUser();
    this.globalData.authToken = getStoredAuthToken();
    this.bootstrapSession();
  },

  bootstrapSession(force = false) {
    if (!force && this.globalData.bootstrapPromise) {
      return this.globalData.bootstrapPromise;
    }

    this.globalData.bootstrapPromise = restoreStoredAccount(this)
      .then(auth => auth || openWechatSession())
      .then((auth) => {
        this.setCurrentUser(auth.user, auth.access_token);
        return auth.user;
      });
    return this.globalData.bootstrapPromise;
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
