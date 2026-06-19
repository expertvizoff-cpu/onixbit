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
      await page.goto(`http://127.0.0.1:3000${path}`, { waitUntil: 'networkidle' });
      const data = await page.evaluate(() => {
        const body = document.body;
        const html = document.documentElement;
        const overflow = Math.max(body.scrollWidth, html.scrollWidth) - html.clientWidth;
        const header = document.querySelector('.ob-header');
        const footer = document.querySelector('.ob-footer');
        const dock = document.querySelector('.ob-mobile-dock');
        const hero = document.querySelector('.ob-hero, .ob-service-hero, .ob-page-hero');
        const scene = document.querySelector('.ob-scene');
        const dockDisplay = dock ? getComputedStyle(dock).display : 'missing';
        const heroRect = hero?.getBoundingClientRect();
        const sceneRect = scene?.getBoundingClientRect();
        return {
          overflow,
          header: Boolean(header),
          footer: Boolean(footer),
          dockDisplay,
          heroHeight: heroRect?.height || 0,
          sceneHeight: sceneRect?.height || 0,
        };
      });
      results.push({ path, viewport: viewport.name, errors, ...data });
      await page.close();
    }
  }
  await browser.close();
  const failed = results.filter((result) => result.errors.length || result.overflow > 1 || !result.header || !result.footer);
  console.table(results.map((result) => ({
    path: result.path,
    viewport: result.viewport,
    overflow: result.overflow,
    errors: result.errors.length,
    dock: result.dockDisplay,
    hero: Math.round(result.heroHeight),
    scene: Math.round(result.sceneHeight),
  })));
  if (failed.length) {
    console.error(JSON.stringify(failed, null, 2));
    process.exit(1);
  }
})();
