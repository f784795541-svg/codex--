const STORAGE_KEY = "health_manager_miniprogram_user";

function getStoredUser() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || null;
  } catch (error) {
    return null;
  }
}

function setStoredUser(user) {
  wx.setStorageSync(STORAGE_KEY, user);
}

function clearStoredUser() {
  wx.removeStorageSync(STORAGE_KEY);
}

module.exports = {
  STORAGE_KEY,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
};
