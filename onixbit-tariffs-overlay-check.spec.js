const { test, expect } = require("@playwright/test");
const fs = require("fs");
const css = fs.readFileSync("onixbit-tilda-site-styles.css", "utf8");
const block = fs.readFileSync("onixbit-tilda-tariffs.html", "utf8");

test("enterprise dropdown opens without shifting license chooser", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1800 });
  await page.setContent("<!doctype html><html><head><style>" + css + "</style></head><body style=\"margin:0\">" + block + "</body></html>");

  await page.locator("[data-obx-tariff-plan=enterprise]").click();
  await page.locator("[data-obx-enterprise-users=\"250\"]").click();

  const closed = await page.evaluate(() => {
    const matrix = document.querySelector(".obx-tariffs__matrix").getBoundingClientRect();
    const decision = document.querySelector(".obx-tariffs__decision").getBoundingClientRect();
    return {
      matrixHeight: Math.round(matrix.height),
      decisionTop: Math.round(decision.top),
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
  });

  await page.locator("[data-obx-tariff-plan=enterprise]").click();
  await expect(page.locator(".obx-tariffs__enterprise-menu")).toBeVisible();

  const opened = await page.evaluate(() => {
    const menu = document.querySelector(".obx-tariffs__enterprise-menu").getBoundingClientRect();
    const picker = document.querySelector(".obx-tariffs__enterprise-picker").getBoundingClientRect();
    const matrix = document.querySelector(".obx-tariffs__matrix").getBoundingClientRect();
    const decision = document.querySelector(".obx-tariffs__decision").getBoundingClientRect();
    const top = document.elementFromPoint(Math.round(menu.left + menu.width / 2), Math.round(menu.top + 18));
    return {
      menuTop: Math.round(menu.top),
      pickerBottom: Math.round(picker.bottom),
      matrixHeight: Math.round(matrix.height),
      decisionTop: Math.round(decision.top),
      topInMenu: !!(top && top.closest && top.closest(".obx-tariffs__enterprise-menu")),
      overflow: document.documentElement.scrollWidth - window.innerWidth
    };
  });

  expect(closed.overflow).toBe(0);
  expect(opened.overflow).toBe(0);
  expect(opened.matrixHeight).toBe(closed.matrixHeight);
  expect(opened.decisionTop).toBe(closed.decisionTop);
  expect(opened.menuTop).toBeGreaterThanOrEqual(opened.pickerBottom - 1);
  expect(opened.topInMenu).toBeTruthy();
});
