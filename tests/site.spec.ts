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

test.describe("Onixbit accessibility", () => {
  test("key pages have no critical or serious automated accessibility violations", async ({ page }) => {
    const keyRoutes = ["/", "/contacts", "/vnedrenie-bitrix24", "/o-kompanii"];

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
