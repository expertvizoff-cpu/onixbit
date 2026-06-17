const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const css = fs.readFileSync(path.join(root, "onixbit-tilda-site-styles.css"), "utf8");
const block = fs.readFileSync(path.join(root, "onixbit-tilda-tariffs.html"), "utf8");

async function mount(page, viewport) {
  await page.setViewportSize(viewport);
  await page.setContent(`<!doctype html>
    <html lang="ru">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>${css}</style>
      </head>
      <body style="margin:0">${block}</body>
    </html>`);
}

test.describe("Onixbit tariff navigator", () => {
  const viewports = [
    { name: "desktop", width: 1440, height: 1400 },
    { name: "tablet", width: 900, height: 1500 },
    { name: "mobile", width: 390, height: 1900 },
  ];

  for (const viewport of viewports) {
    test(`renders and switches plans on ${viewport.name}`, async ({ page }) => {
      await mount(page, viewport);

      await expect(page.locator(".obx-tariffs")).toBeVisible();
      await expect(page.locator(".obx-tariffs__edition")).toHaveCount(2);
      await expect(page.locator(".obx-tariffs__scenario-title")).toHaveText("Профессиональный");

      await page.locator('[data-obx-tariff-plan="standard"]').click();
      await expect(page.locator(".obx-tariffs__scenario-title")).toHaveText("Стандартный");

      await page.locator('[data-obx-tariff-plan="enterprise"]').click();
      await expect(page.locator(".obx-tariffs__enterprise-menu")).toBeVisible();
      await page.locator('[data-obx-enterprise-users="1000"]').click();
      await expect(page.locator(".obx-tariffs__scenario-title")).toHaveText("Энтерпрайз");
      await expect(page.locator("[data-obx-enterprise-current]")).toHaveText("1000");

      await page.locator('[data-obx-tariff-plan="box-enterprise"]').click();
      await expect(page.locator(".obx-tariffs__scenario-title")).toHaveText("Коробочный Энтерпрайз");

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBe(0);

      await page.screenshot({
        path: `test-results/onixbit-tariffs-${viewport.name}.png`,
        fullPage: true,
      });
    });
  }
});
