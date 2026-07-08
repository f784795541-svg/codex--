const { chromium } = require("playwright");
const targets = [
  'https://www.szeastroc.com/product/',
  'https://www.7-11.com.tw/7app/delivery/CAFE.html',
  'https://www.7-11.com.tw/freshfoods/breakfast/RWD/index.html'
];
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe' });
  for (const url of targets) {
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await page.waitForTimeout(5000);
      const payload = await page.evaluate(() => ({
        title: document.title,
        bodyText: document.body ? document.body.innerText.slice(0, 4000) : '',
        images: Array.from(document.images).map(img => ({ src: img.src, alt: img.alt || '', title: img.title || '' })).filter(x => x.src)
      }));
      console.log('URL', url);
      console.log(JSON.stringify(payload, null, 2));
    } catch (err) {
      console.log('URL', url);
      console.log('ERROR', String(err));
    } finally {
      await page.close();
    }
  }
  await browser.close();
})().catch(err => { console.error(err); process.exit(1); });
