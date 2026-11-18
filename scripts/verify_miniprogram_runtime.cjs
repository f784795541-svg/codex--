const assert = require("node:assert/strict");
const { API_BASE } = require("../miniprogram/utils/config");
const config = require("../miniprogram/app.json");

async function main() {
  const socket = new WebSocket("ws://127.0.0.1:9420");
  await new Promise((resolve, reject) => {
    socket.onopen = resolve;
    socket.onerror = reject;
  });
  let sequence = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const response = JSON.parse(event.data);
    const request = pending.get(response.id);
    if (!request) return;
    pending.delete(response.id);
    clearTimeout(request.timer);
    if (response.error) request.reject(new Error("WeChat automation command failed"));
    else request.resolve(response.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = String(++sequence);
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`WeChat automation timed out: ${method}`));
    }, 20000);
    pending.set(id, { resolve, reject, timer });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (fn, ...args) => (await send("App.callFunction", { functionDeclaration: fn.toString(), args })).result;
  const waitFor = async (fn, ...args) => {
    for (let attempt = 0; attempt < 60; attempt += 1) {
      if (await evaluate(fn, ...args)) return;
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    throw new Error("Mini-program page did not become ready");
  };
  const navigate = async pagePath => {
    await evaluate(function(url) {
      return new Promise((resolve, reject) => wx.reLaunch({ url, success: resolve, fail: () => reject(new Error("Navigation failed")) }));
    }, `/${pagePath}`);
    for (let attempt = 0; attempt < 60; attempt += 1) {
      const current = await send("App.getCurrentPage");
      if (current.path === pagePath) return;
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    throw new Error(`Mini-program navigation did not reach ${pagePath}`);
  };
  let accountInstalled = false;
  try {
    const initialized = await evaluate(async function(base) {
      const app = getApp();
      if (app.globalData.timelinePreview) return false;
      const api = (path, data) => new Promise((resolve, reject) => wx.request({
        url: base + path, method: "POST", data,
        success: response => response.statusCode === 200 ? resolve(response.data) : reject(new Error("Test account request failed")),
        fail: () => reject(new Error("Test account network request failed")),
      }));
      const username = `miniprogram_regression_${Date.now()}`;
      const password = "TEST_PASSWORD_ONLY";
      await api("/auth/register", {
        username, password, name: "Regression Test", age: 30, gender: "male",
        height_cm: 175, weight_kg: 72, target_weight_kg: 68, target_sleep_hours: 8,
      });
      const auth = await api("/auth/login", { username, password });
      app.__codexRegression = {
        user: app.globalData.currentUser, token: app.globalData.authToken,
        setCurrentUser: app.setCurrentUser, bootstrapPromise: app.globalData.bootstrapPromise,
      };
      // Keep test credentials in memory; leave the user's saved account untouched.
      app.setCurrentUser = function(user, token) {
        this.globalData.currentUser = user;
        if (token) this.globalData.authToken = token;
      };
      app.globalData.currentUser = auth.user;
      app.globalData.authToken = auth.access_token;
      return { testUserId: auth.user.id };
    }, API_BASE);
    assert.ok(initialized && initialized.testUserId);
    accountInstalled = true;
    console.log(JSON.stringify({ account: "isolated test account", ...initialized }));

    for (const pagePath of config.pages) {
      await navigate(pagePath);
      const result = await evaluate(function() {
        const page = getCurrentPages().slice(-1)[0];
        const friend = page.onShareAppMessage();
        const timeline = page.onShareTimeline();
        return {
          route: page.route, preview: !!page.data.timelinePreview,
          friendHome: friend.path === "/pages/home/index",
          timelineQueryEmpty: timeline.query === "",
          timelineHasNoPath: !Object.prototype.hasOwnProperty.call(timeline, "path"),
          coverAvailable: wx.getFileSystemManager().statSync(timeline.imageUrl).size > 0,
        };
      });
      assert.equal(result.route, pagePath);
      assert.equal(result.preview, false);
      for (const key of ["friendHome", "timelineQueryEmpty", "timelineHasNoPath", "coverAvailable"]) assert.equal(result[key], true);
      console.log(JSON.stringify({ share: result }));
    }

    await navigate("pages/record/index");
    await waitFor(function() { return getCurrentPages().slice(-1)[0].data.workoutOptions.length > 0; });
    const recordResult = await evaluate(async function() {
      const page = getCurrentPages().slice(-1)[0];
      const submitted = tab => new Promise(resolve => {
        let attempts = 0;
        const check = () => {
          if (page.data.lastSubmission?.tab === tab) resolve(true);
          else if (attempts++ >= 50) resolve(false);
          else setTimeout(check, 20);
        };
        check();
      });
      page.setData({ foodQuery: "\u7c73\u996d" });
      await page.searchFood();
      if (!page.data.foodResults.length) throw new Error("Food search did not return results");
      page.selectFood({ currentTarget: { dataset: { index: 0 } } });
      page.setData({ foodWeight: "120", foodTime: "12:20" });
      await page.submitFood();
      const food = await submitted("food") && page.data.foodQuery === "" && !page.data.selectedFood;
      const walking = page.data.workoutOptions.findIndex(item => item.type === "walking");
      page.setData({ workoutTypeIndex: walking, workoutDuration: "20", workoutCalories: "80.53", workoutTime: "18:30" });
      await page.submitWorkout();
      page.clearHomeSwitchTimer();
      const workout = await submitted("workout");
      page.setData({ sleepStart: "23:30", sleepEnd: "07:10" });
      await page.submitSleep();
      page.clearHomeSwitchTimer();
      const sleep = await submitted("sleep");
      page.setData({ weightValue: "71.8" });
      await page.submitWeight();
      page.clearHomeSwitchTimer();
      return { food, workout, sleep, weight: await submitted("weight") };
    });
    console.log(JSON.stringify({ formSubmissions: recordResult }));
    for (const value of Object.values(recordResult)) assert.equal(value, true);

    await navigate("pages/profile/index");
    await waitFor(function() { const page = getCurrentPages().slice(-1)[0]; return !page.data.loading && !!page.data.user; });
    const profileSaved = await evaluate(async function() {
      const page = getCurrentPages().slice(-1)[0];
      page.setData({ name: "Regression Verified" });
      await page.submit();
      page.clearHomeSwitchTimer();
      return getApp().globalData.currentUser.name === "Regression Verified";
    });
    assert.equal(profileSaved, true);

    await navigate("pages/trend/index");
    await waitFor(function() { return !getCurrentPages().slice(-1)[0].data.loading; });
    const reports = await evaluate(function() {
      const page = getCurrentPages().slice(-1)[0];
      const daily = page.data.dailyReport;
      return {
        foodVisible: daily.food_items.length > 0,
        workoutVisible: daily.total_burned_kcal >= 80.53,
        sleepVisible: daily.sleep_hours >= 7.67,
        weightVisible: page.data.weights.some(row => row.weight_kg === 71.8),
        weeklyVisible: !!page.data.weeklyReport.daily_reports.length,
      };
    });
    for (const value of Object.values(reports)) assert.equal(value, true);
    console.log(JSON.stringify({ profileSaved, reports }));
  } finally {
    if (accountInstalled) {
      await evaluate(function() {
        const app = getApp();
        const backup = app.__codexRegression;
        app.setCurrentUser = backup.setCurrentUser;
        app.globalData.currentUser = backup.user;
        app.globalData.authToken = backup.token;
        app.globalData.bootstrapPromise = backup.bootstrapPromise;
        delete app.__codexRegression;
        return true;
      });
      await navigate("pages/home/index");
    }
    socket.close();
  }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
