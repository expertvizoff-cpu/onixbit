const { test, expect } = require("@playwright/test");
const fs = require("fs");
const css = fs.readFileSync("onixbit-tilda-site-styles.css", "utf8");
const block = fs.readFileSync("onixbit-tilda-price-line.html", "utf8");

test.describe("Onixbit Bitrix24 price line block", () => {
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1500 },
    { name: "tablet", width: 900, height: 1700 },
    { name: "mobile", width: 390, height: 2200 },
  ]) {
    test(viewport.name, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.setContent("<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><style>" + css + "</style></head><body style=\"margin:0\">" + block + "</body></html>");

      await expect(page.locator(".obx-price-line")).toBeVisible();
      await expect(page.locator("[data-obx-price-line]")).toBeVisible();
      await expect(page.locator(".obx-price-line__card")).toHaveCount(7);
      await expect(page.locator('[data-obx-cloud-card="free"]')).toContainText("Бесплатный старт");
      await expect(page.locator('[data-obx-free-panel]')).not.toContainText("0 ₽");
      await expect(page.locator('[data-obx-cloud-card="basic"] .obx-price-line__user-line')).toContainText("5 пользователей");
      await expect(page.locator('[data-obx-cloud-card="standard"] .obx-price-line__user-line')).toContainText("50 пользователей");
      await expect(page.locator('[data-obx-cloud-card="professional"] .obx-price-line__user-line')).toContainText("100 пользователей");
      await expect(page.locator('[data-obx-cloud-card="basic"] .obx-price-line__features li').first()).toContainText("Совместная работа");
      await expect(page.locator('[data-obx-cloud-card="standard"] [data-obx-price]')).toContainText("4 893 ₽");

      await page.locator('[data-obx-price-period="month"]').click();
      await expect(page.locator('[data-obx-cloud-card="standard"] [data-obx-price]')).toContainText("6 990 ₽");

      if (viewport.width >= 1180) {
        const cloudRows = await page.evaluate(() => {
          const selectors = ["basic", "standard", "professional", "enterprise"];
          return selectors.map((key) => {
            const card = document.querySelector(`[data-obx-cloud-card="${key}"]`);
            return {
              userTop: Math.round(card.querySelector(".obx-price-line__user-line").getBoundingClientRect().top),
              descriptionTop: Math.round(card.querySelector(".obx-price-line__description").getBoundingClientRect().top),
            };
          });
        });
        expect(new Set(cloudRows.map((row) => row.userTop)).size).toBe(1);
        expect(new Set(cloudRows.map((row) => row.descriptionTop)).size).toBe(1);
        const featureRows = await page.evaluate(() => {
          const selectors = ["basic", "standard", "professional", "enterprise"];
          return selectors.map((key) => {
            const card = document.querySelector(`[data-obx-cloud-card="${key}"]`);
            return {
              count: card.querySelectorAll(".obx-price-line__features li").length,
              firstTop: Math.round(card.querySelector(".obx-price-line__features li").getBoundingClientRect().top),
            };
          });
        });
        expect(featureRows.map((row) => row.count)).toEqual([14, 19, 22, 25]);
        expect(new Set(featureRows.map((row) => row.firstTop)).size).toBe(1);

        const featureIcon = await page.evaluate(() => {
          const item = document.querySelector('[data-obx-cloud-card="basic"] .obx-price-line__features li');
          const icon = getComputedStyle(item, "::before");
          return { image: icon.backgroundImage, mask: icon.webkitMaskImage || icon.maskImage };
        });
        expect(featureIcon.image).toContain("rgb(200, 32, 15)");
        expect(featureIcon.mask).toBe("none");

        const cloudOrder = await page.evaluate(() => {
          const card = document.querySelector("[data-obx-cloud-card=\"basic\"]");
          const link = card.querySelector(".obx-price-line__link").getBoundingClientRect();
          const firstFeature = card.querySelector(".obx-price-line__features:not(.obx-price-line__features--bottom) li").getBoundingClientRect();
          const selectors = ["basic", "standard", "professional", "enterprise"];
          const serviceRows = selectors.map((key) => {
            const tariffCard = document.querySelector("[data-obx-cloud-card=\"" + key + "\"]");
            const bottomRows = Array.from(tariffCard.querySelectorAll(".obx-price-line__features--bottom li"));
            const support = bottomRows.find((row) => row.textContent.trim() === "Поддержка").getBoundingClientRect();
            const admin = bottomRows.find((row) => row.textContent.trim() === "Администрирование");
            return {
              supportTop: Math.round(support.top),
              adminTop: admin ? Math.round(admin.getBoundingClientRect().top) : null,
              supportHeight: Math.round(support.height),
              bottomAlignContent: getComputedStyle(tariffCard.querySelector(".obx-price-line__features--bottom")).alignContent,
            };
          });
          return {
            buttonToList: Math.round(firstFeature.top - link.bottom),
            supportTops: serviceRows.map((row) => row.supportTop),
            adminTops: serviceRows.filter((row) => row.adminTop !== null).map((row) => row.adminTop),
            supportHeights: serviceRows.map((row) => row.supportHeight),
            bottomAlignments: serviceRows.map((row) => row.bottomAlignContent),
          };
        });
        const rowSpread = (values) => Math.max(...values) - Math.min(...values);
        expect(cloudOrder.buttonToList).toBeGreaterThan(10);
        expect(cloudOrder.buttonToList).toBeLessThan(34);
        expect(rowSpread(cloudOrder.supportTops)).toBeLessThanOrEqual(1);
        expect(rowSpread(cloudOrder.adminTops)).toBeLessThanOrEqual(1);
        expect(new Set(cloudOrder.bottomAlignments)).toEqual(new Set(["start"]));
        expect(rowSpread(cloudOrder.supportHeights)).toBeLessThanOrEqual(1);
        expect(Math.max(...cloudOrder.supportHeights)).toBeLessThan(48);

        await page.locator('[data-obx-cloud-card="standard"] .obx-price-line__features li').first().hover();
        await expect(page.locator('[data-obx-feature-row-frame]')).toHaveClass(/is-active/);
        await page.waitForTimeout(240);
        const frame = await page.locator('[data-obx-feature-row-frame]').boundingBox();
        const firstCard = await page.locator('[data-obx-cloud-card="basic"] .obx-price-line__features li').first().boundingBox();
        const lastCard = await page.locator('[data-obx-cloud-card="enterprise"] .obx-price-line__features li').first().boundingBox();
        expect(frame.width).toBeGreaterThan(lastCard.x + lastCard.width - firstCard.x - 8);
      }

      await page.locator('[data-obx-user-toggle="cloud-enterprise"]').click();
      await page.locator('[data-obx-cloud-enterprise-users="1000"]').click();
      await expect(page.locator('[data-obx-cloud-card="enterprise"] [data-obx-price]')).toContainText("99 990 ₽");

      await page.locator('[data-obx-price-mode="box"]').click();
      await expect(page.locator('[data-obx-free-panel]')).toBeHidden();
      await expect(page.locator('[data-obx-box-price="cp"]')).toContainText("159 000 ₽");

      await page.locator('[data-obx-user-toggle="box-cp"]').click();
      await page.locator('[data-obx-box-cp-users="250"]').click();
      await expect(page.locator('[data-obx-box-price="cp"]')).toContainText("349 000 ₽");

      await page.locator('[data-obx-user-toggle="box-ent"]').click();
      await page.locator('[data-obx-box-ent-users="10000"]').click();
      await expect(page.locator('[data-obx-box-price="ent"]')).toContainText("9 390 000 ₽");

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBe(0);
      await page.screenshot({ path: "test-results/onixbit-price-line-" + viewport.name + ".png", fullPage: true });
    });
  }
});
