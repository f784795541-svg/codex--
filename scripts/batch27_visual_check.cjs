const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const CHECKS = [
  { keyword: "罗森 无糖豆浆", expectedKey: "lawson-235", expectedFile: "lawson-235.webp" },
  { keyword: "罗森 冰皮月亮蛋糕", expectedKey: "lawson-620", expectedFile: "lawson-620.webp" },
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
  const username = `batch27_visual_${Date.now()}`;
  const payload = {
    username,
    password: "VisualTest123456",
    name: "Batch27 Visual User",
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

async function captureViewport(browser, authData, name, viewport) {
  const context = await browser.newContext({ viewport });
  await context.addInitScript(({ user, token }) => {
    localStorage.setItem("health_manager_current_user", JSON.stringify(user));
    localStorage.setItem("health_manager_auth_token", token);
  }, { user: authData.user, token: authData.access_token });

  const page = await context.newPage();
  await page.goto("http://localhost:8080/#/food", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const tab = page.locator('button[data-panel="food"]');
  if (await tab.count() && await tab.isVisible()) {
    await tab.click();
    await page.waitForTimeout(300);
  }
  await page.waitForSelector("#food-search-input", { timeout: 10000 });

  const results = [];
  for (const check of CHECKS) {
    await page.fill("#food-search-input", check.keyword);
    await page.click("#food-search-btn");
    await page.waitForTimeout(900);

    const cards = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("#food-results .food-result-card"))
        .slice(0, 5)
        .map((card) => {
          const img = card.querySelector("img");
          const button = card.querySelector(".select-food-btn");
          let imageKey = "";
          try {
            imageKey = JSON.parse(button?.dataset.food || "{}").image_key || "";
          } catch {
            imageKey = "";
          }
          return {
            title: card.querySelector("h4")?.textContent?.trim() || "",
            imageKey,
            src: img?.getAttribute("src") || "",
          };
        });
    });

    if (!cards.length) {
      throw new Error(`No result cards rendered for ${check.keyword} in ${name}`);
    }
    const matched = cards.find((card) => card.imageKey === check.expectedKey);
    if (!matched) {
      throw new Error(
        `${check.keyword} in ${name} did not render ${check.expectedKey}; got ${cards.map((card) => `${card.title}:${card.imageKey}`).join(", ")}`
      );
    }
    if (!matched.src.endsWith(`/assets/foods/${check.expectedFile}`)) {
      throw new Error(`${check.keyword} in ${name} rendered unexpected src ${matched.src}`);
    }
    results.push({
      keyword: check.keyword,
      expectedKey: check.expectedKey,
      expectedFile: check.expectedFile,
      matched,
      cards,
    });
  }

  const screenshotPath = path.join("reports", `batch27_${name}_check.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await context.close();
  return { viewport, screenshotPath, results };
}

async function main() {
  fs.mkdirSync("reports", { recursive: true });
  const authData = await createVisualUser();
  const executablePath = findBrowserExecutable();
  const browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {}),
  });

  const output = {
    desktop: await captureViewport(browser, authData, "desktop", { width: 1280, height: 720 }),
    mobile: await captureViewport(browser, authData, "mobile", { width: 390, height: 844 }),
  };
  await browser.close();

  const reportPath = path.join("reports", "batch27_visual_check.json");
  fs.writeFileSync(reportPath, JSON.stringify(output, null, 2), "utf8");
  console.log(JSON.stringify({
    reportPath,
    desktopShot: output.desktop.screenshotPath,
    mobileShot: output.mobile.screenshotPath,
    desktop: output.desktop.results.map((item) => ({ keyword: item.keyword, matched: item.matched })),
    mobile: output.mobile.results.map((item) => ({ keyword: item.keyword, matched: item.matched })),
  }, null, 2));
}

main().catch((error) => {
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
