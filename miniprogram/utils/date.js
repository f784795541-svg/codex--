function pad(value) {
  return String(value).padStart(2, "0");
}

function getCurrentDate() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function getCurrentTime() {
  const now = new Date();
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

module.exports = {
  getCurrentDate,
  getCurrentTime,
  toNumber,
};
