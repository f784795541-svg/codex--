const { API_BASE } = require("./config");

const inflightRequests = new Map();
const responseCache = new Map();
const DEFAULT_GET_CACHE_MS = 900;
let unauthorizedRedirectPending = false;

function buildRequestKey(method, url, data) {
  return `${method}:${url}:${JSON.stringify(data || {})}`;
}

function clearRequestCache() {
  inflightRequests.clear();
  responseCache.clear();
}

function createRequestError(message, statusCode = 0, redirectedToLogin = false) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.redirectedToLogin = redirectedToLogin;
  return error;
}

function isUnauthorizedRedirectError(error) {
  return !!(error && error.redirectedToLogin);
}

function shouldRedirectOnUnauthorized(url, redirectOnUnauthorized) {
  if (typeof redirectOnUnauthorized === "boolean") {
    return redirectOnUnauthorized;
  }
  return !String(url || "").startsWith("/auth/");
}

function redirectToLoginOnUnauthorized() {
  if (unauthorizedRedirectPending) {
    return;
  }

  unauthorizedRedirectPending = true;
  const pages = typeof getCurrentPages === "function" ? getCurrentPages() : [];
  const currentRoute = pages.length ? `/${pages[pages.length - 1].route}` : "";

  if (currentRoute === "/pages/login/index") {
    unauthorizedRedirectPending = false;
    return;
  }

  wx.showToast({
    title: "Session expired",
    icon: "none",
    duration: 1500,
  });

  setTimeout(() => {
    wx.reLaunch({
      url: "/pages/login/index",
      complete: () => {
        setTimeout(() => {
          unauthorizedRedirectPending = false;
        }, 300);
      },
    });
  }, 220);
}

function request({ url, method = "GET", data, header = {}, cacheMs = 0, redirectOnUnauthorized }) {
  const normalizedMethod = String(method || "GET").toUpperCase();
  const requestKey = buildRequestKey(normalizedMethod, url, data);
  const effectiveCacheMs =
    normalizedMethod === "GET"
      ? (typeof cacheMs === "number" && Number.isFinite(cacheMs) ? Math.max(0, cacheMs) : DEFAULT_GET_CACHE_MS)
      : 0;
  const redirectUnauthorized = shouldRedirectOnUnauthorized(url, redirectOnUnauthorized);

  if (normalizedMethod === "GET") {
    const cached = responseCache.get(requestKey);
    if (cached && cached.expiresAt > Date.now()) {
      return Promise.resolve(cached.value);
    }

    if (inflightRequests.has(requestKey)) {
      return inflightRequests.get(requestKey);
    }
  }

  const requestPromise = new Promise((resolve, reject) => {
    const app = getApp();
    const authToken = app && app.globalData ? app.globalData.authToken : "";
    wx.request({
      url: `${API_BASE}${url}`,
      method: normalizedMethod,
      data,
      timeout: 30000,
      header: {
        "content-type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...header,
      },
      success: (response) => {
        const { statusCode, data: body } = response;
        if (statusCode >= 200 && statusCode < 300) {
          if (normalizedMethod === "GET" && effectiveCacheMs > 0) {
            responseCache.set(requestKey, {
              value: body,
              expiresAt: Date.now() + effectiveCacheMs,
            });
          } else if (normalizedMethod !== "GET") {
            clearRequestCache();
          }

          resolve(body);
          return;
        }

        if (statusCode === 401 && redirectUnauthorized) {
          if (app && typeof app.clearCurrentUser === "function") {
            app.clearCurrentUser();
          }
          redirectToLoginOnUnauthorized();
          reject(createRequestError("Session expired", statusCode, true));
          return;
        }

        const message = body && (body.detail || body.message) ? body.detail || body.message : `请求失败(${statusCode})`;
        reject(createRequestError(message, statusCode));
      },
      fail: (error) => {
        const message = error && error.errMsg ? error.errMsg : "网络请求失败，请检查域名、证书或后端服务";
        reject(createRequestError(message));
      },
    });
  }).finally(() => {
    inflightRequests.delete(requestKey);
  });

  if (normalizedMethod === "GET") {
    inflightRequests.set(requestKey, requestPromise);
  }

  return requestPromise;
}

function get(url, data, options = {}) {
  return request({ url, method: "GET", data, ...options });
}

function post(url, data, options = {}) {
  return request({ url, method: "POST", data, ...options });
}

module.exports = {
  clearRequestCache,
  request,
  get,
  post,
  isUnauthorizedRedirectError,
};
