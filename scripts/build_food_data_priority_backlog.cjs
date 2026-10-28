/* Create a repeatable, source-free backlog for food data expansion. */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const foods = JSON.parse(fs.readFileSync(path.join(ROOT, "backend", "app", "foods.json"), "utf8"));
const REPORT = path.join(ROOT, "reports", "food_data_priority_backlog.csv");

const priorities = [
  ["P0", "百事薯片各口味", ["百事薯片", "百事 原味薯片", "百事 黄瓜味薯片", "百事 番茄味薯片"]],
  ["P0", "可爱多各口味", ["可爱多", "可爱多香草", "可爱多巧克力", "可爱多草莓"]],
  ["P0", "八喜各口味", ["八喜", "八喜香草", "八喜巧克力", "八喜草莓"]],
  ["P0", "常见雪糕与冰淇淋", ["雪糕", "冰淇淋", "老冰棍", "小布丁", "梦龙"]],
  ["P0", "常见薯片与膨化零食", ["薯片", "乐事薯片", "品客", "妙脆角"]],
  ["P1", "常见饮料与能量饮料", ["可口可乐", "百事可乐", "红牛", "东鹏", "茶饮料"]],
  ["P1", "连锁餐厅单品", ["麦当劳", "肯德基", "必胜客", "赛百味", "汉堡王"]],
  ["P1", "便利店即食", ["7-11", "全家", "罗森", "便利店"]],
  ["P1", "奶茶咖啡", ["喜茶", "霸王茶姬", "奈雪", "瑞幸", "星巴克", "奶茶", "拿铁"]],
  ["P1", "家常炒菜", ["宫保鸡丁", "番茄炒蛋", "鱼香肉丝", "回锅肉", "红烧肉", "麻婆豆腐"]],
  ["P1", "地方菜与小吃", ["沙县", "兰州拉面", "螺蛳粉", "煎饼果子", "肉夹馍", "烧烤"]],
  ["P2", "基础主食与早餐", ["米饭", "面条", "馒头", "包子", "饺子", "全麦面包"]],
  ["P2", "水果蔬菜", ["苹果", "香蕉", "橙子", "西红柿", "西兰花", "黄瓜"]],
];

function csv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const rows = [];
for (const [priority, group, terms] of priorities) {
  for (const term of terms) {
    const matches = foods.filter((food) => `${food.name} ${food.brand || ""} ${food.aliases_text || ""}`.includes(term));
    rows.push({
      priority,
      group,
      query_term: term,
      matched_food_count: matches.length,
      matched_food_names: matches.slice(0, 8).map((food) => food.name).join(" | "),
      status: matches.length ? "catalog_has_match_review_images" : "catalog_missing_add_with_source",
    });
  }
}

fs.mkdirSync(path.dirname(REPORT), { recursive: true });
const header = ["priority", "group", "query_term", "matched_food_count", "matched_food_names", "status"];
const content = [header, ...rows.map((row) => header.map((key) => csv(row[key])))]
  .map((row) => row.join(","))
  .join("\n") + "\n";
fs.writeFileSync(REPORT, content, "utf8");
console.log(`Wrote ${path.relative(ROOT, REPORT)} rows=${rows.length}`);
console.log(`Missing terms=${rows.filter((row) => row.matched_food_count === 0).length} review terms=${rows.filter((row) => row.matched_food_count > 0).length}`);
