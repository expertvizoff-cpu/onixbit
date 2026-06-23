import { expect, test } from "@playwright/test";

test.describe("Onixbit visual checks @visual", () => {
  test("home hero desktop snapshot @visual", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop baseline only.");

    await page.goto("/");
    await page.locator("main").waitFor();

    await expect(page).toHaveScreenshot("home-desktop.png", {
      fullPage: false,
      animations: "disabled",
    });
  });
});
