const { test } = require("@playwright/test");
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

test("tariffs layout metrics", async ({ page }) => {
  const viewports = [
    { name: "desktop", width: 1440, height: 1400 },
    { name: "tablet", width: 900, height: 1600 },
    { name: "mobile", width: 390, height: 1900 },
  ];

  for (const viewport of viewports) {
    await mount(page, viewport);
    await page.locator('[data-obx-tariff-plan="enterprise"]').click();
    const metrics = await page.evaluate((name) => {
      const doc = document.documentElement;
      const elements = Array.from(document.querySelectorAll(".obx-tariffs *"));
      const overflow = elements
        .filter((el) => el.scrollWidth > el.clientWidth + 1)
        .slice(0, 20)
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          className: el.className || "",
          text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
          clientWidth: el.clientWidth,
          scrollWidth: el.scrollWidth,
        }));
      const menu = document.querySelector(".obx-tariffs__enterprise-menu").getBoundingClientRect();
      const matrix = document.querySelector(".obx-tariffs__matrix").getBoundingClientRect();
      const note = document.querySelector(".obx-tariffs__note").getBoundingClientRect();
      return {
        name,
        viewportWidth: window.innerWidth,
        documentScrollWidth: doc.scrollWidth,
        horizontalOverflow: doc.scrollWidth - window.innerWidth,
        menuBottom: Math.round(menu.bottom),
        matrixBottom: Math.round(matrix.bottom),
        noteTop: Math.round(note.top),
        menuOverlapsNote: menu.bottom > note.top,
        overflow,
      };
    }, viewport.name);
    console.log(JSON.stringify(metrics, null, 2));
  }
});
