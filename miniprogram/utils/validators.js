function isFilled(value) {
  return String(value || "").trim().length > 0;
}

function asPositiveNumber(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }
  return numeric;
}

function asNumberInRange(value, min, max) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < min || numeric > max) {
    return null;
  }
  return numeric;
}

module.exports = {
  isFilled,
  asPositiveNumber,
  asNumberInRange,
};
