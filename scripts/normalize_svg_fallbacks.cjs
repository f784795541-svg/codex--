const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const CLIENT_DIRS = [
  path.join(ROOT, "frontend", "assets", "foods"),
  path.join(ROOT, "miniprogram", "assets", "foods"),
];
const REPORT_PATH = path.join(ROOT, "reports", "food_svg_fallback_normalization_report.json");
const SIZE = 750;
const MAX_BYTES = 300 * 1024;
const CONCURRENCY = 8;
const apply = process.argv.includes("--apply");
const prune = process.argv.includes("--prune-svg");

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function svgFiles() {
  return allSvgFiles()
    .filter((name) => !fs.existsSync(path.join(CLIENT_DIRS[0], `${path.basename(name, ".svg")}.webp`)));
}

function allSvgFiles() {
  return fs.readdirSync(CLIENT_DIRS[0])
    .filter((name) => name.toLowerCase().endsWith(".svg") && !name.startsWith("._"))
    .sort();
}

async function convertOne(name) {
  const key = path.basename(name, ".svg");
  const source = path.join(CLIENT_DIRS[0], name);
  const targets = CLIENT_DIRS.map((dir) => path.join(dir, `${key}.webp`));
  const buffer = await sharp(source).resize(SIZE, SIZE, { fit: "contain", background: { r: 250, g: 250, b: 248, alpha: 1 } }).webp({ quality: 86, effort: 6 }).toBuffer();
  if (buffer.length > MAX_BYTES) throw new Error(`${key}: ${buffer.length} bytes exceeds ${MAX_BYTES}`);
  if (apply) targets.forEach((target) => fs.writeFileSync(target, buffer));
  const row = { image_key: key, source: path.relative(ROOT, source), width: SIZE, height: SIZE, bytes: buffer.length };
  if (apply) {
    row.sha256_frontend = sha256(targets[0]);
    row.sha256_miniprogram = sha256(targets[1]);
    if (row.sha256_frontend !== row.sha256_miniprogram) throw new Error(`${key}: client hashes differ`);
  }
  return row;
}

async function main() {
  const names = svgFiles();
  let previousItems = [];
  if (fs.existsSync(REPORT_PATH)) {
    try { previousItems = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8")).items || []; }
    catch { previousItems = []; }
  }
  const rows = new Array(names.length);
  const failures = [];
  let nextIndex = 0;
  let completed = 0;
  async function worker() {
    while (true) {
      const index = nextIndex++;
      if (index >= names.length) return;
      const name = names[index];
      try { rows[index] = await convertOne(name); }
      catch (error) { failures.push({ file: name, error: error.message }); }
      completed += 1;
      if (completed % 50 === 0 || completed === names.length) console.log(`processed=${completed}/${names.length}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, names.length) }, () => worker()));
  if (failures.length) throw new Error(`conversion failures=${failures.length}: ${JSON.stringify(failures.slice(0, 5))}`);
  const convertedRows = rows.filter(Boolean);
  const rowMap = new Map(previousItems.map((item) => [item.image_key, item]));
  convertedRows.forEach((item) => rowMap.set(item.image_key, item));
  const orderedRows = [...rowMap.values()].sort((a, b) => a.image_key.localeCompare(b.image_key));
  if (apply && prune) {
    for (const name of allSvgFiles()) {
      const key = path.basename(name, ".svg");
      if (fs.existsSync(path.join(CLIENT_DIRS[0], `${key}.webp`))) {
        for (const dir of CLIENT_DIRS) {
          const svgPath = path.join(dir, name);
          if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
        }
      }
    }
  }
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify({
    generated_at: new Date().toISOString(),
    applied: apply,
    pruned_svg: apply && prune,
    size: `${SIZE}x${SIZE}`,
    max_bytes: MAX_BYTES,
    converted: orderedRows.length,
    failures,
    items: orderedRows,
  }, null, 2) + "\n");
  console.log(`SVG fallbacks=${rows.length} apply=${apply} pruned=${apply && prune} failures=${failures.length}`);
}

main().catch((error) => { console.error(error.message); process.exit(1); });
