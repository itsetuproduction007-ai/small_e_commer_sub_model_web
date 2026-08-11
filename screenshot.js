const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Capturing checkout page with product...');
  await page.goto('http://localhost:3000/checkout?product=RER-SAR-001', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'checkout.png', fullPage: true });

  await browser.close();
  console.log('Done!');
})();
