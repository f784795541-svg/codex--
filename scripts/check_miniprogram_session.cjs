const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const { test } = require("node:test");

const root = path.resolve(__dirname, "../miniprogram");

function loadRequest() {
  const requests = [];
  const app = { globalData: { authToken: "TEST_ACCOUNT_A" }, clearCurrentUser() { this.cleared = true; } };
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, "utils/request.js"), "utf8"), {
    module,
    require: () => ({ API_BASE: "https://test.invalid" }),
    getApp: () => app,
    wx: { request(options) { requests.push(options); }, showToast() {} },
    setTimeout() {},
  });
  return { ...module.exports, requests, app };
}

test("cached account data is isolated after switching accounts", async () => {
  const api = loadRequest();
  const first = api.get("/friend-pk/state", {}, { cacheMs: 30000 });
  api.requests[0].success({ statusCode: 200, data: { owner: "A" } });
  await first;
  api.app.globalData.authToken = "TEST_ACCOUNT_B";
  const second = api.get("/friend-pk/state", {}, { cacheMs: 30000 });
  assert.equal(api.requests.length, 2);
  api.requests[1].success({ statusCode: 200, data: { owner: "B" } });
  assert.equal((await second).owner, "B");
});

test("identical reads share a request within one account", async () => {
  const api = loadRequest();
  const first = api.get("/report/daily");
  const second = api.get("/report/daily");
  assert.equal(api.requests.length, 1);
  api.requests[0].success({ statusCode: 200, data: { version: 1 } });
  assert.equal((await first).version, (await second).version);
});

test("an older read cannot refill the cache after a successful write", async () => {
  const api = loadRequest();
  const older = api.get("/report/daily", {}, { cacheMs: 30000 });
  const write = api.post("/food/log", {});
  api.requests[1].success({ statusCode: 200, data: { id: 1 } });
  await write;
  api.requests[0].success({ statusCode: 200, data: { version: "old" } });
  await older;
  const fresh = api.get("/report/daily", {}, { cacheMs: 30000 });
  assert.equal(api.requests.length, 3);
  api.requests[2].success({ statusCode: 200, data: { version: "fresh" } });
  assert.equal((await fresh).version, "fresh");
});

test("an older read cannot remove a newer in-flight read", async () => {
  const api = loadRequest();
  const older = api.get("/report/daily");
  api.clearRequestCache();
  const newer = api.get("/report/daily");
  api.requests[0].success({ statusCode: 200, data: {} });
  await older;
  const duplicate = api.get("/report/daily");
  assert.equal(api.requests.length, 2);
  api.requests[1].success({ statusCode: 200, data: {} });
  await Promise.all([newer, duplicate]);
});

test("an old account's unauthorized response cannot clear the new account", async () => {
  const api = loadRequest();
  const request = api.get("/user/info");
  api.app.globalData.authToken = "TEST_ACCOUNT_B";
  api.requests[0].success({ statusCode: 401, data: {} });
  await assert.rejects(request);
  assert.equal(api.app.cleared, undefined);
});

function loadApp(post) {
  let app;
  let storedReads = 0;
  vm.runInNewContext(fs.readFileSync(path.join(root, "app.js"), "utf8"), {
    App(value) { app = value; },
    require: name => name === "./utils/auth" ? {
      getStoredUser() { storedReads += 1; return null; },
      getStoredAuthToken: () => "",
      setStoredUser() {},
      clearStoredUser() {},
    } : { post, clearRequestCache() {} },
    wx: { login: options => options.success({ code: "TEST_CODE" }) },
  });
  return { app, storedReads: () => storedReads };
}

test("timeline launch does not read a stored account or start login", () => {
  let loginCalls = 0;
  const { app, storedReads } = loadApp(() => { loginCalls += 1; });
  app.onLaunch({ scene: 1154 });
  assert.equal(app.globalData.timelinePreview, true);
  assert.equal(storedReads(), 0);
  assert.equal(loginCalls, 0);
});

test("account initialization can retry after a temporary network failure", async () => {
  let attempts = 0;
  const { app } = loadApp(async () => {
    attempts += 1;
    if (attempts === 1) throw new Error("TEST_NETWORK_FAILURE");
    return { user: { id: 1 }, access_token: "TEST_TOKEN" };
  });
  await assert.rejects(app.bootstrapSession());
  assert.equal((await app.bootstrapSession()).id, 1);
  assert.equal(attempts, 2);
});

test("clearing an account discards its completed bootstrap promise", async () => {
  let account = 1;
  const { app } = loadApp(async () => ({ user: { id: account }, access_token: "TEST_TOKEN" }));
  await app.bootstrapSession();
  app.clearCurrentUser();
  account = 2;
  assert.equal((await app.bootstrapSession()).id, 2);
});

for (const value of ["0", "80.53", "", "-1", "Infinity", "invalid"]) {
  test(`workout calories ${JSON.stringify(value)} are ${["0", "80.53"].includes(value) ? "submitted" : "rejected"}`, async () => {
    const filename = path.join(root, "pages/record/index.js");
    const requirePage = createRequire(filename);
    const submissions = [];
    let page;
    vm.runInNewContext(fs.readFileSync(filename, "utf8"), {
      Page(definition) { page = definition; },
      require: name => name === "../../utils/session"
        ? { ensureUser: async () => ({ id: 1 }) }
        : name === "../../utils/request"
          ? { post: async (url, data) => { submissions.push({ url, data }); }, isUnauthorizedRedirectError: () => false }
          : requirePage(name),
      wx: { showToast() {} },
    });
    page.data = { ...page.data, workoutOptions: [{ type: "walking", label: "Walking" }], workoutCalories: value, workoutTime: "18:30" };
    page.setData = data => Object.assign(page.data, data);
    page.setLastSubmission = () => {};
    page.goHomeAfterSuccess = () => {};
    await page.submitWorkout();
    const valid = ["0", "80.53"].includes(value);
    assert.equal(submissions.length, valid ? 1 : 0);
    if (valid) {
      assert.equal(submissions[0].url, "/workout/log");
      assert.equal(submissions[0].data.calories_burned, Number(value));
    }
  });
}

test("backdated weight submission keeps the server's current account weight", async () => {
  const filename = path.join(root, "pages/record/index.js");
  const requirePage = createRequire(filename);
  const currentUser = { id: 1, weight_kg: 72 };
  const submissions = [];
  let savedUser;
  let page;
  vm.runInNewContext(fs.readFileSync(filename, "utf8"), {
    Page(definition) { page = definition; },
    require: name => name === "../../utils/session"
      ? { ensureUser: async () => currentUser }
      : name === "../../utils/request"
        ? {
          post: async (url, data) => { submissions.push({ url, data }); },
          get: async () => currentUser,
          isUnauthorizedRedirectError: () => false,
        }
        : requirePage(name),
    getApp: () => ({ setCurrentUser(user) { savedUser = user; } }),
    wx: { showToast() {} },
  });
  page.data = { ...page.data, weightValue: "75", weightDate: "2026-01-01", weightTime: "08:00" };
  page.setData = (data, callback) => { Object.assign(page.data, data); if (callback) callback(); };
  page.setLastSubmission = () => {};
  page.refreshDerivedState = () => {};
  page.goHomeAfterSuccess = () => {};
  await page.submitWeight();
  assert.equal(submissions.length, 1);
  assert.equal(submissions[0].data.weight_kg, 75);
  assert.equal(savedUser.weight_kg, 72);
  assert.equal(page.data.submittingWeight, false);
});
