/* Build a repeatable, read-only baseline for the food catalog and image assets. */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const FOODS_PATH = path.join(ROOT, "backend", "app", "foods.json");
const REPORT_DIR = path.join(ROOT, "reports");
const ASSET_DIRS = {
  frontend: path.join(ROOT, "frontend", "assets", "foods"),
  miniprogram: path.join(ROOT, "miniprogram", "assets", "foods"),
};
const MANIFESTS = {
  frontend: path.join(ROOT, "frontend", "assets", "foods", "food-image-assets.js"),
  miniprogram: path.join(ROOT, "miniprogram", "utils", "foodImageAssets.js"),
};
const IMAGE_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png", ".gif"]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readManifest(file) {
  const source = fs.readFileSync(file, "utf8").trim().replace(/;$/, "");
  const jsonStart = source.indexOf("{");
  if (jsonStart < 0) throw new Error(`Manifest JSON not found: ${file}`);
  return JSON.parse(source.slice(jsonStart));
}

function pngSize(buffer) {
  if (buffer.length >= 24 && buffer.readUInt32BE(0) === 0x89504e47) {
    return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
  }
  return null;
}

function webpSize(buffer) {
  if (buffer.length < 30 || buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    return null;
  }
  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X" && buffer.length >= 30) {
    return [1 + buffer.readUIntLE(24, 3), 1 + buffer.readUIntLE(27, 3)];
  }
  if (chunk === "VP8 " && buffer.length >= 30) {
    const marker = buffer.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
    if (marker >= 0 && marker + 7 < buffer.length) {
      return [buffer.readUInt16LE(marker + 3) & 0x3fff, buffer.readUInt16LE(marker + 5) & 0x3fff];
    }
  }
  if (chunk === "VP8L" && buffer.length >= 25 && buffer[20] === 0x2f) {
    const bits = buffer.readUIntLE(21, 4);
    return [1 + (bits & 0x3fff), 1 + ((bits >> 14) & 0x3fff)];
  }
  return null;
}

function jpegSize(buffer) {
  if (buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) continue;
    if (offset + 2 > buffer.length) break;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) break;
    const isSof = (marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) ||
      (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf);
    if (isSof && length >= 7) return [buffer.readUInt16BE(offset + 5), buffer.readUInt16BE(offset + 3)];
    offset += length;
  }
  return null;
}

function imageInfo(file) {
  const stat = fs.statSync(file);
  const ext = path.extname(file).toLowerCase();
  if (ext === ".svg") return { format: "svg", bytes: stat.size, width: null, height: null, vector: true };
  const buffer = fs.readFileSync(file);
  const size = ext === ".png" ? pngSize(buffer) : ext === ".webp" ? webpSize(buffer) : jpegSize(buffer);
  return { format: ext.slice(1), bytes: stat.size, width: size?.[0] ?? null, height: size?.[1] ?? null, vector: false };
}

function listAssets(dir) {
  const result = new Map();
  if (!fs.existsSync(dir)) return result;
  for (const name of fs.readdirSync(dir)) {
    const file = path.join(dir, name);
    if (!fs.statSync(file).isFile() || name.startsWith("._")) continue;
    const ext = path.extname(name).toLowerCase();
    if (!IMAGE_EXTENSIONS.has(ext) && ext !== ".svg") continue;
    const key = path.basename(name, ext);
    const current = result.get(key);
    const info = imageInfo(file);
    if (!current || (info.format === "webp" && current.format !== "webp")) result.set(key, { file: name, ...info });
  }
  return result;
}

function histogram(items, key) {
  const output = {};
  for (const item of items) {
    const value = item[key] ?? "<missing>";
    output[value] = (output[value] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(output).sort((a, b) => String(a[0]).localeCompare(String(b[0]))));
}

function main() {
  const foods = readJson(FOODS_PATH);
  const names = new Map();
  for (const food of foods) names.set(food.name, (names.get(food.name) || 0) + 1);
  const catalog = {
    generated_at: new Date().toISOString(),
    source_file: path.relative(ROOT, FOODS_PATH),
    total_foods: foods.length,
    categories: histogram(foods, "category"),
    sources: histogram(foods, "source"),
    missing_fields: {
      brand: foods.filter((food) => !food.brand).length,
      serving_size_g: foods.filter((food) => !food.serving_size_g).length,
      portion_hint: foods.filter((food) => !food.portion_hint).length,
      aliases_text: foods.filter((food) => !food.aliases_text).length,
      search_text: foods.filter((food) => !food.search_text).length,
    },
    duplicate_names: [...names.entries()].filter(([, count]) => count > 1).map(([name, count]) => ({ name, count })),
    invalid_nutrition: foods.filter((food) => ["calories_per_100g", "protein", "fat", "carbs"].some((key) => Number(food[key]) < 0)),
  };

  const assetReports = {};
  for (const [client, dir] of Object.entries(ASSET_DIRS)) {
    const assets = listAssets(dir);
    const files = [...assets.values()];
    const manifest = readManifest(MANIFESTS[client]);
    const missingFiles = Object.values(manifest).filter((name) => !fs.existsSync(path.join(dir, name)));
    assetReports[client] = {
      asset_dir: path.relative(ROOT, dir),
      manifest_file: path.relative(ROOT, MANIFESTS[client]),
      asset_keys: assets.size,
      manifest_keys: Object.keys(manifest).length,
      manifest_missing_files: [...new Set(missingFiles)].sort(),
      unreferenced_asset_keys: [...assets.keys()].filter((key) => !Object.prototype.hasOwnProperty.call(manifest, key)).sort(),
      formats: histogram(files, "format"),
      dimensions: histogram(files.filter((item) => item.width && item.height).map((item) => ({ dimension: `${item.width}x${item.height}` })), "dimension"),
      non_square_raster: files.filter((item) => item.width && item.height && item.width !== item.height).map((item) => ({ file: item.file, width: item.width, height: item.height })),
      oversized_raster_over_300kb: files.filter((item) => item.bytes > 300 * 1024).map((item) => ({ file: item.file, bytes: item.bytes })),
      total_bytes: files.reduce((sum, item) => sum + item.bytes, 0),
      files,
    };
  }

  const frontendKeys = new Set(Object.keys(readManifest(MANIFESTS.frontend)));
  const miniKeys = new Set(Object.keys(readManifest(MANIFESTS.miniprogram)));
  const assets = {
    generated_at: catalog.generated_at,
    clients: assetReports,
    manifest_key_diff: {
      frontend_only: [...frontendKeys].filter((key) => !miniKeys.has(key)).sort(),
      miniprogram_only: [...miniKeys].filter((key) => !frontendKeys.has(key)).sort(),
    },
  };

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(path.join(REPORT_DIR, "food_catalog_baseline.json"), JSON.stringify(catalog, null, 2) + "\n");
  fs.writeFileSync(path.join(REPORT_DIR, "food_asset_baseline.json"), JSON.stringify(assets, null, 2) + "\n");
  console.log(`Catalog foods=${catalog.total_foods} missing_brand=${catalog.missing_fields.brand} missing_portion_hint=${catalog.missing_fields.portion_hint}`);
  for (const [client, report] of Object.entries(assetReports)) {
    console.log(`${client} manifest=${report.manifest_keys} assets=${report.asset_keys} missing_files=${report.manifest_missing_files.length} oversized=${report.oversized_raster_over_300kb.length}`);
  }
  console.log(`Wrote reports/food_catalog_baseline.json and reports/food_asset_baseline.json`);
}

main();
