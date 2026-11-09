const { post } = require("./request");

function login() {
  return new Promise((resolve, reject) => wx.login({ success: result => result.code ? resolve(result.code) : reject(new Error("微信登录失败")), fail: reject }));
}

function authorizeWeRun() {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope: "scope.werun",
      success: resolve,
      fail: () => {
        wx.openSetting({
          success: result => result.authSetting["scope.werun"] ? resolve() : reject(new Error("请在设置中允许微信运动授权")),
          fail: () => reject(new Error("微信运动授权未完成")),
        });
      },
    });
  });
}

async function sync(bind) {
  await authorizeWeRun();
  const code = await login();
  const data = await new Promise((resolve, reject) => wx.getWeRunData({ success: resolve, fail: reject }));
  return post("/wechat/steps", { code, encrypted_data: data.encryptedData, iv: data.iv, bind });
}

module.exports = { sync };
