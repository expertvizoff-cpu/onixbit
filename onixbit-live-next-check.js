const { chromium } = require('./node_modules/playwright');

const pages = [
  '/',
  '/vnedrenie-bitrix24',
  '/razrabotka-saitov-na-1c-bitrix',
  '/raboty-po-1c-predpriyatie',
  '/cases',
  '/certificates',
  '/articles',
  '/tarify-licenziy',
  '/contacts',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const path of pages) {
    for (const viewport of [
      { name: 'desktop', width: 1440, height: 1000 },
      { name: 'mobile', width: 390, height: 1000 },
    ]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });
      await page.goto(`https://onixbit.ru${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1800);
      const data = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        const overflow = Math.max(body.scrollWidth, html.scrollWidth) - html.clientWidth;
        const header = document.querySelector('.ob-header');
        const footer = document.querySelector('.ob-footer');
        const dock = document.querySelector('.ob-mobile-dock');
        const dockDisplay = dock ? getComputedStyle(dock).display : 'missing';
        return { overflow, header: Boolean(header), footer: Boolean(footer), dockDisplay };
      });
      results.push({ path, viewport: viewport.name, errors, ...data });
      await page.close();
    }
  }
  await browser.close();
  console.table(results.map((result) => ({
    path: result.path,
    viewport: result.viewport,
    overflow: result.overflow,
    errors: result.errors.length,
    dock: result.dockDisplay,
    header: result.header,
    footer: result.footer,
  })));
  const failed = results.filter((result) => result.errors.length || result.overflow > 1 || !result.header || !result.footer);
  if (failed.length) {
    console.error(JSON.stringify(failed, null, 2));
    process.exit(1);
  }
})();
