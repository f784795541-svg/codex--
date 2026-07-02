function formatNumber(value, decimals) {
  return Number(value)
    .toFixed(decimals)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*[1-9])0+$/, "$1");
}

function buildNumberOptions({ start, end, step = 1, decimals = 0, suffix = "" }) {
  const options = [];
  const precision = Math.max(decimals, 4);

  for (let current = start; current <= end + step / 2; current += step) {
    const rounded = Number(current.toFixed(precision));
    const value = formatNumber(rounded, decimals);
    options.push({
      label: `${value}${suffix}`,
      value,
    });
  }

  return options;
}

function getOptionIndex(options, targetValue, fallbackIndex = 0) {
  const numericTarget = Number(targetValue);
  if (!Array.isArray(options) || !options.length) {
    return 0;
  }

  if (!Number.isFinite(numericTarget)) {
    return Math.max(0, Math.min(fallbackIndex, options.length - 1));
  }

  let bestIndex = 0;
  let bestDiff = Number.POSITIVE_INFINITY;

  options.forEach((option, index) => {
    const diff = Math.abs(Number(option.value) - numericTarget);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIndex = index;
    }
  });

  return bestIndex;
}

function getOptionValue(options, index, fallback = "") {
  if (!Array.isArray(options) || !options.length) {
    return fallback;
  }

  const safeIndex = Math.max(0, Math.min(Number(index) || 0, options.length - 1));
  return String(options[safeIndex].value);
}

module.exports = {
  buildNumberOptions,
  getOptionIndex,
  getOptionValue,
};
