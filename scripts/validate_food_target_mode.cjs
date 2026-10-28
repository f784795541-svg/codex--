/* Validate the food-data/image target mode without touching application data. */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const MAX_BYTES = 300 * 1024;
const EXPECTED_SIZE = "750x750";

function readManifest(file) {
  const text = fs.readFileSync(file, "utf8");
  const start = text.indexOf("{");
  return JSON.parse(text.slice(start).trim().replace(/;$/, ""));
}

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") { row.push(field); field = ""; }
    else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0].map((key, index) => index === 0 ? key.replace(/^\uFEFF/, "") : key);
  return rows.slice(1).filter((item) => item.length > 1).map((item) => Object.fromEntries(header.map((key, index) => [key, item[index] ?? ""])));
}

function webpSize(buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") return null;
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)];
  if (chunk === "VP8L" && buffer[20] === 0x2f) {
    const bits = buffer.readUIntLE(21, 4);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  // Lossy WebP stores a key-frame signature followed by 14-bit dimensions.
  // The previous validator only handled VP8X/VP8L, which incorrectly marked
  // valid normalized files produced by Pillow's default encoder as failures.
  if (chunk === "VP8 " && buffer.length >= 30 && buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
    return [buffer.readUInt16LE(26) & 0x3fff, buffer.readUInt16LE(28) & 0x3fff];
  }
  return null;
}

function checkClient(client, manifestPath, assetDir) {
  const manifest = readManifest(manifestPath);
  const failures = [];
  const raster = [];
  const fallback = [];
  const legacyDuplicates = [];
  for (const [key, filename] of Object.entries(manifest)) {
    const file = path.join(assetDir, filename);
    if (!fs.existsSync(file)) { failures.push(`${client}: missing ${key} -> ${filename}`); continue; }
    if (path.extname(filename).toLowerCase() !== ".webp") {
      fallback.push({ key, filename });
      continue;
    }
    if (fs.existsSync(path.join(assetDir, `${key}.svg`))) legacyDuplicates.push(key);
    const stat = fs.statSync(file);
    const size = webpSize(fs.readFileSync(file));
    raster.push({ key, filename, bytes: stat.size, size: size ? `${size[0]}x${size[1]}` : null });
    if (!size || `${size[0]}x${size[1]}` !== EXPECTED_SIZE) failures.push(`${client}: non-${EXPECTED_SIZE} ${filename}`);
    if (stat.size > MAX_BYTES) failures.push(`${client}: over ${MAX_BYTES} bytes ${filename}`);
  }
  return { manifest_keys: Object.keys(manifest).sort(), raster, fallback, legacyDuplicates, failures };
}

function main() {
  const frontend = checkClient("frontend", path.join(ROOT, "frontend", "assets", "foods", "food-image-assets.js"), path.join(ROOT, "frontend", "assets", "foods"));
  const miniprogram = checkClient("miniprogram", path.join(ROOT, "miniprogram", "utils", "foodImageAssets.js"), path.join(ROOT, "miniprogram", "assets", "foods"));
  const ledger = parseCsv(fs.readFileSync(path.join(ROOT, "reports", "food_photo_source_ledger.csv"), "utf8"));
  const ledgerKeys = ledger.map((row) => row.image_key).filter(Boolean);
  const duplicateLedgerKeys = [...new Set(ledgerKeys.filter((key, index) => ledgerKeys.indexOf(key) !== index))];
  const missingCachePaths = ledger
    .filter((row) => row.source_cache_path && !fs.existsSync(row.source_cache_path))
    .map((row) => row.image_key || row.source_cache_path);
  const keyDiff = {
    frontend_only: frontend.manifest_keys.filter((key) => !miniprogram.manifest_keys.includes(key)),
    miniprogram_only: miniprogram.manifest_keys.filter((key) => !frontend.manifest_keys.includes(key)),
  };
  const report = {
    generated_at: new Date().toISOString(),
    standard: { size: EXPECTED_SIZE, format: "webp", max_bytes: MAX_BYTES },
    frontend: {
      manifest_keys: frontend.manifest_keys.length,
      raster: frontend.raster.length,
      fallback: frontend.fallback.length,
      legacy_duplicates: frontend.legacyDuplicates.length,
      failures: frontend.failures,
    },
    miniprogram: {
      manifest_keys: miniprogram.manifest_keys.length,
      raster: miniprogram.raster.length,
      fallback: miniprogram.fallback.length,
      legacy_duplicates: miniprogram.legacyDuplicates.length,
      failures: miniprogram.failures,
    },
    manifest_key_diff: keyDiff,
    source_ledger: {
      rows: ledger.length,
      unique_keys: new Set(ledgerKeys).size,
      duplicate_keys: duplicateLedgerKeys,
      missing_cache_paths: missingCachePaths,
    },
  };
  const output = path.join(ROOT, "reports", "food_target_mode_validation.json");
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + "\n");
  const failures = [...frontend.failures, ...miniprogram.failures, ...keyDiff.frontend_only, ...keyDiff.miniprogram_only, ...duplicateLedgerKeys, ...missingCachePaths];
  console.log(`frontend=${frontend.manifest_keys.length} miniprogram=${miniprogram.manifest_keys.length} ledger=${ledger.length} failures=${failures.length}`);
  console.log(`Wrote ${path.relative(ROOT, output)}`);
  if (failures.length) process.exitCode = 1;
}

main();
