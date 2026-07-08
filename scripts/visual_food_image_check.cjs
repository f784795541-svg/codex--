const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

function loadFoodImageAssetMap() {
  const manifestPath = path.join("frontend", "assets", "foods", "food-image-assets.js");
  if (!fs.existsSync(manifestPath)) {
    return {};
  }
  const content = fs.readFileSync(manifestPath, "utf8");
  const match = content.match(/window\.FOOD_IMAGE_ASSET_MAP\s*=\s*([\s\S]*);\s*$/);
  return match ? JSON.parse(match[1]) : {};
}

const FOOD_IMAGE_ASSET_MAP = loadFoodImageAssetMap();

const CHECKS = [
  "鸡排",
  "麦当劳 巨无霸",
  "麦当劳 中薯条",
  "麦当劳 麦辣鸡腿堡",
  "麦当劳 双吉",
  "KFC 鸡翅",
  "KFC 原味鸡",
  "炸鸡",
  "玉米油",
  "烤玉米",
  "瑞幸 生椰",
  "瑞幸 厚乳",
  "瑞幸 椰云",
  "星巴克 星冰乐",
  "星巴克 拿铁",
  "星巴克 香草拿铁",
  "星巴克 冷萃",
  "星巴克 美式",
  "星巴克 蓝莓麦芬",
  "霸王茶姬",
  "霸王茶姬 伯牙",
  "全家 饭团",
  "全家 三明治",
  "全家 关东煮",
  "全家 关东煮萝卜",
  "全家 关东煮贡丸",
  "全家 关东煮鱼豆腐",
  "全家 无糖酸奶",
  "全家 低糖希腊酸奶",
  "全家 冰拿铁",
  "全家 奥尔良鸡排便当",
  "全家 抹茶红豆卷",
  "全家 香葱肉松面包",
  "\u5168\u5bb6 \u6c99\u62c9\u9e21\u80f8\u8089",
  "\u5168\u5bb6 \u4f4e\u7cd6\u9e21\u80f8\u8089\u6c99\u62c9",
  "711 饭团",
  "711 \u4e09\u660e\u6cbb",
  "7-11 \u91d1\u67aa\u9c7c\u996d\u56e2",
  "7-11 \u8336\u53f6\u86cb",
  "7-11 \u7167\u70e7\u9e21\u817f\u4fbf\u5f53",
  "7-11 \u9e21\u80f8\u8089\u6c99\u62c9",
  "7-11 \u5373\u98df\u9e21\u80f8\u8089",
  "7-11 \u539a\u5207\u706b\u817f\u4e09\u660e\u6cbb",
  "7-11 \u9ed1\u6912\u725b\u8089\u610f\u9762",
  "7-11 \u65e0\u7cd6\u4e4c\u9f99\u8336",
  "7-11 \u6d77\u82d4\u8089\u677e\u996d\u56e2",
  "7-11 \u5168\u9ea6\u706b\u817f\u86cb\u4e09\u660e\u6cbb",
  "7-11 \u5168\u9ea6\u9e21\u80f8\u4e09\u660e\u6cbb",
  "711 \u9e21\u80f8\u8089",
  "7-11 \u51b0\u7f8e\u5f0f\u5496\u5561",
  "7-11 低糖豆浆",
  "7-11 低糖希腊酸奶",
  "7-11 低脂希腊酸奶杯",
  "7-11 关东煮海带结",
  "7-11 关东煮魔芋结",
  "7-11 关东煮鱼豆腐",
  "7-11 \u91d1\u67aa\u9c7c\u4e09\u660e\u6cbb",
  "7-11 \u9e21\u80f8\u8089\u51ef\u6492\u5377",
  "罗森 饭团",
  "罗森 火腿鸡蛋三明治",
  "罗森 关东煮萝卜",
  "罗森 关东煮海带结",
  "罗森 关东煮魔芋结",
  "罗森 关东煮鱼豆腐",
  "\u7f57\u68ee \u53cc\u86cb\u706b\u817f\u4e09\u660e\u6cbb",
  "\u7f57\u68ee \u5168\u9ea6\u9e21\u86cb\u4e09\u660e\u6cbb",
  "\u7f57\u68ee \u9e21\u80f8\u8089\u6c99\u62c9",
  "\u7f57\u68ee \u6d77\u82d4\u8089\u677e\u996d\u56e2",
  "\u7f57\u68ee \u5965\u5c14\u826f\u9e21\u8089\u5377",
  "\u7f57\u68ee \u6c99\u62c9\u9e21\u80f8\u8089",
  "\u7f57\u68ee \u51b0\u7f8e\u5f0f\u5496\u5561",
  "\u7f57\u68ee \u65e0\u7cd6\u8309\u8389\u82b1\u8336",
  "\u7f57\u68ee \u8336\u53f6\u86cb",
  "必胜客 披萨",
  "必胜客 超级至尊",
  "必胜客 榴莲披萨",
  "肯德基 蛋挞",
  "麦当劳 麦乐鸡块 4块",
  "麦当劳 麦乐鸡块 10块",
  "麦当劳 麦香鸡",
  "麦当劳 麦辣鸡翅",
  "麦当劳 苹果派",
  "麦当劳 奥利奥麦旋风",
  "麦当劳 热巧克力新地",
  "麦当劳 猪柳蛋麦满分",
  "麦当劳 脆薯饼",
  "味千拉面 冰绿茶",
  "北冰洋橙汽水",
  "麻辣烫",
  "鱼豆腐",
  "红烧肉",
  "锅包肉",
  "基础水果 榴莲",
  "青岛啤酒",
  "茅台",
  "重庆小面",
  "桂林米粉",
  "热干面",
  "鱼香肉丝",
  "回锅肉",
  "毛血旺",
  "红烧狮子头",
  "哈密瓜",
  "椰子水",
  "红牛",
  "东鹏特饮",
  "米村 炸鸡",
];

function findBrowserExecutable() {
  const candidates = [
    process.env.PLAYWRIGHT_EXECUTABLE_PATH,
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(candidate));
}

async function createVisualUser() {
  const username = `visual_food_${Date.now()}`;
  const payload = {
    username,
    password: "VisualTest123456",
    name: "视觉验证用户",
    age: 30,
    gender: "male",
    height_cm: 175,
    weight_kg: 70,
    target_weight_kg: 68,
    target_sleep_hours: 8,
    goal: "maintain",
    activity_level: "moderate",
    recommendation_mode: "home",
    body_type: "balanced",
    target_algorithm: "classic",
  };

  const response = await fetch("http://localhost:8000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}

async function runViewport(browser, authData, name, viewport) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(({ user, token }) => {
    localStorage.setItem("health_manager_current_user", JSON.stringify(user));
    localStorage.setItem("health_manager_auth_token", token);
  }, { user: authData.user, token: authData.access_token });

  const page = await context.newPage();
  await page.goto("http://localhost:8080/#/food", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  const tab = page.locator('button[data-panel="food"]');
  if (await tab.count() && await tab.isVisible()) {
    await tab.click();
  }
  await page.waitForSelector("#food-search-input", { timeout: 10000 });

  const results = [];
  for (const keyword of CHECKS) {
    await page.fill("#food-search-input", keyword);
    await page.click("#food-search-btn");
    await page.waitForTimeout(700);
    const cards = await page.evaluate((searchKeyword) => {
      return Array.from(document.querySelectorAll("#food-results .food-result-card"))
        .slice(0, 3)
        .map((card) => {
          const img = card.querySelector("img");
          const button = card.querySelector(".select-food-btn");
          let imageKey = "";
          try {
            imageKey = JSON.parse(button?.dataset.food || "{}").image_key || "";
          } catch {
            imageKey = "";
          }
          const cardRect = card.getBoundingClientRect();
          const imgRect = img?.getBoundingClientRect();
          return {
            keyword: searchKeyword,
            title: card.querySelector("h4")?.textContent?.trim() || "",
            imageKey,
            src: img?.getAttribute("src") || "",
            card: { width: Math.round(cardRect.width), height: Math.round(cardRect.height) },
            image: imgRect ? { width: Math.round(imgRect.width), height: Math.round(imgRect.height) } : null,
          };
        });
    }, keyword);
    if (!cards.length) {
      throw new Error(`No food result cards rendered for ${keyword} in ${name}`);
    }
    for (const card of cards) {
      if (!card.imageKey) {
        throw new Error(`Missing image_key for ${keyword}: ${card.title}`);
      }
      const expectedFile = FOOD_IMAGE_ASSET_MAP[card.imageKey] || `${card.imageKey}.svg`;
      if (!card.src.endsWith(`/assets/foods/${expectedFile}`)) {
        throw new Error(`Image src mismatch for ${keyword}: ${card.title} ${card.src} != ${card.imageKey}`);
      }
      if (!card.image || card.image.width <= 0 || card.image.height <= 0) {
        throw new Error(`Image has invalid dimensions for ${keyword}: ${card.title}`);
      }
    }
    results.push(...cards);
  }

  const screenshot = path.join("reports", `visual_${name}_food_images.png`);
  await page.screenshot({ path: screenshot, fullPage: false });
  await context.close();
  return { name, viewport, screenshot, results };
}

(async () => {
  fs.mkdirSync("reports", { recursive: true });
  const authData = await createVisualUser();
  const executablePath = findBrowserExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });
  const output = {
    desktop: await runViewport(browser, authData, "desktop", { width: 1280, height: 720 }),
    mobile: await runViewport(browser, authData, "mobile", { width: 390, height: 844 }),
  };
  await browser.close();
  fs.writeFileSync(
    path.join("reports", "visual_food_image_check.json"),
    JSON.stringify(output, null, 2),
    "utf8"
  );
  console.log(JSON.stringify({
    desktopShot: output.desktop.screenshot,
    mobileShot: output.mobile.screenshot,
    desktopSample: output.desktop.results.slice(0, 6),
    mobileSample: output.mobile.results.slice(0, 6),
  }, null, 2));
})().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
