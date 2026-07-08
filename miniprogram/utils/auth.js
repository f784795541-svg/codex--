const STORAGE_KEY = "health_manager_miniprogram_user";
const TOKEN_STORAGE_KEY = "health_manager_miniprogram_token";

function getStoredUser() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || null;
  } catch (error) {
    return null;
  }
}

function getStoredAuthToken() {
  try {
    return wx.getStorageSync(TOKEN_STORAGE_KEY) || "";
  } catch (error) {
    return "";
  }
}

function setStoredUser(user, token = "") {
  wx.setStorageSync(STORAGE_KEY, user);
  if (token) {
    wx.setStorageSync(TOKEN_STORAGE_KEY, token);
  }
}

function clearStoredUser() {
  wx.removeStorageSync(STORAGE_KEY);
  wx.removeStorageSync(TOKEN_STORAGE_KEY);
}

module.exports = {
  STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  getStoredUser,
  getStoredAuthToken,
  setStoredUser,
  clearStoredUser,
};
