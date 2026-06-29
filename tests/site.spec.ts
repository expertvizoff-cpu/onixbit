import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/vnedrenie-bitrix24",
  "/razrabotka-saitov-na-1c-bitrix",
  "/raboty-po-1c-predpriyatie",
  "/tarify-licenziy",
  "/cases",
  "/certificates",
  "/articles",
  "/o-kompanii",
  "/contacts",
  "/privacy",
];

test.describe("Onixbit pages", () => {
  for (const route of routes) {
    test(`loads ${route}`, async ({ page }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));

      const response = await page.goto(route);

      expect(response?.status(), `${route} should not return an HTTP error`).toBeLessThan(400);
      await expect(page.locator("main")).toBeVisible();
      await expect(page).toHaveTitle(/Ониксбит|Onixbit|404/i);

      const hasHorizontalOverflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth > root.clientWidth + 1;
      });

      expect(hasHorizontalOverflow, `${route} should not have horizontal overflow`).toBe(false);
      expect(pageErrors, `${route} should not throw browser page errors`).toEqual([]);
    });
  }
});

test.describe("Onixbit certificate media", () => {
  test("certificate previews load on trust sections", async ({ page }) => {
    for (const [route, selector] of [["/", ".ob-home-trust"], ["/o-kompanii", ".ob-about-cert-lite"]] as const) {
      await page.goto(route);
      const section = page.locator(selector);
      await section.scrollIntoViewIfNeeded();
      await expect(section.locator("img").first()).toBeVisible();

      const images = section.locator("img");
      const imageCount = await images.count();

      for (let index = 0; index < imageCount; index++) {
        const image = images.nth(index);
        await image.evaluate((element) => element.scrollIntoView({ block: "center", inline: "center" }));
        await expect
          .poll(async () => image.evaluate((element) => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 0))
          .toBe(true);
      }
    }
  });

  test("certificate modal keeps visible media area on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/certificates");

    const trigger = page.getByRole("button", { name: /Открыть сертификат: Золотой партнёр Битрикс24/ }).first();
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(page.getByRole("dialog")).toBeVisible();

    const modalMedia = page.locator(".obx-certs__modal-media");
    await expect
      .poll(async () => modalMedia.evaluate((element) => Math.round(element.getBoundingClientRect().height)))
      .toBeGreaterThan(100);

    await expect
      .poll(async () => page.locator(".obx-certs__modal-image").evaluate((image) => image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0))
      .toBe(true);
  });
});

test.describe("Onixbit accessibility", () => {
  test("key pages have no critical or serious automated accessibility violations", async ({ page }) => {
    const keyRoutes = ["/", "/contacts", "/vnedrenie-bitrix24", "/o-kompanii", "/certificates"];

    for (const route of keyRoutes) {
      await page.goto(route);

      const scan = await new AxeBuilder({ page })
        .exclude("iframe")
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blockingViolations = scan.violations.filter((violation) =>
        violation.impact === "critical" || violation.impact === "serious",
      );

      expect(blockingViolations, `${route} has blocking accessibility violations`).toEqual([]);
    }
  });

  test("health endpoint responds", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBe(true);
    await expect(response.json()).resolves.toEqual({ ok: true, service: "onixbit" });
  });
});
