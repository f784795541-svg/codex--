const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://www.szeastroc.com/product/', { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.waitForTimeout(5000);
  const imgs = page.locator('img');
  const count = await imgs.count();
  console.log('COUNT', count);
  for (let i = 0; i < Math.min(count, 8); i++) {
    const loc = imgs.nth(i);
    const src = await loc.getAttribute('src');
    const box = await loc.boundingBox();
    console.log('IDX', i, 'SRC', src, 'BOX', JSON.stringify(box));
    if (box && box.width > 40 && box.height > 40) {
      await loc.screenshot({ path: `reports/candidate_images/batch19/dongpeng_probe_${i}.png` });
    }
  }
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
