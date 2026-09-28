import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const url = process.argv[2] || 'http://127.0.0.1:3234/preview/vnedrenie-bitrix24';
const output = process.argv[3] || 'output/bitrix24-prototype-control-v2.png';
const width = Number(process.argv[4] || 1600);
const height = Number(process.argv[5] || 1000);
const scale = Number(process.argv[6] || 1);

await mkdir('output', { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: scale,
  colorScheme: 'dark',
  reducedMotion: 'reduce',
});
const page = await context.newPage();
await page.goto(url, { waitUntil: 'networkidle' });

const accept = page.getByRole('button', { name: /принять/i });
if (await accept.count()) {
  try { await accept.first().click({ timeout: 1500 }); } catch {}
}
await page.evaluate(async () => {
  const step = Math.max(520, Math.floor(window.innerHeight * 0.72));
  for (let position = 0; position < document.documentElement.scrollHeight; position += step) {
    window.scrollTo(0, position);
    await new Promise((resolve) => setTimeout(resolve, 65));
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await new Promise((resolve) => setTimeout(resolve, 220));
  window.scrollTo(0, 0);
});

await page.waitForLoadState('networkidle');
await page.waitForTimeout(600);
await page.screenshot({ path: output, fullPage: true, animations: 'disabled' });
const dimensions = await page.evaluate(() => ({
  width: document.documentElement.scrollWidth,
  height: document.documentElement.scrollHeight,
}));
console.log(JSON.stringify({ output, dimensions, scale }));
await browser.close();