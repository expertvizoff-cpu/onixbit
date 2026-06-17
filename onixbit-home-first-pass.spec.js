const { test, expect } = require("@playwright/test");
const fs = require("fs");
const path = require("path");
const { pathToFileURL } = require("url");

process.env.LD_LIBRARY_PATH = [
  "/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu",
  process.env.LD_LIBRARY_PATH || "",
].filter(Boolean).join(":");

const root = __dirname;
const baseHref = pathToFileURL(root + path.sep).href;
const css = fs.readFileSync(path.join(root, "onixbit-tilda-site-styles.css"), "utf8");
const logoData = fs.readFileSync(path.join(root, "logo_jumtp.png")).toString("base64");
const contentBlocks = [
  "onixbit-tilda-hero-home.html",
  "onixbit-tilda-problems.html",
  "onixbit-tilda-audience.html",
  "onixbit-tilda-services-home.html",
  "onixbit-tilda-process-home.html",
  "onixbit-tilda-tariffs-home.html",
  "onixbit-tilda-trust-home.html",
  "onixbit-tilda-cases.html",
];

function readBlocks(files) {
  return files
    .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
    .join("\n")
    .replaceAll("src=\"logo_jumtp.png\"", "src=\"data:image/png;base64," + logoData + "\"")
    .replaceAll("src=\"https://onixbit.su/upload/onixbitru/logo/logo_jumtp.png\"", "src=\"data:image/png;base64," + logoData + "\"");
}

const blocks = [
  readBlocks(["onixbit-tilda-header.html"]),
  readBlocks(contentBlocks),
  readBlocks(["onixbit-tilda-contacts-footer.html", "onixbit-tilda-privacy-modal.html"]),
].join("\n");

for (const viewport of [
  { name: "desktop", width: 1440, height: 1400 },
  { name: "mobile", width: 390, height: 1800 },
]) {
  test("home first pass " + viewport.name, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.setContent("<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><base href=\"" + baseHref + "\"><style>" + css + "</style></head><body style=\"margin:0\">" + blocks + "</body></html>");

    await expect(page.locator(".ob-site-header")).toHaveCount(1);
    await expect(page.locator(".obx-hero")).toBeVisible();
    await expect(page.locator(".obx-problems__scan-row")).toHaveCount(4);
    await expect(page.locator(".obx-audience__card")).toHaveCount(4);
    await expect(page.locator(".obx-home-system__node")).toHaveCount(8);
    await expect(page.locator(".obx-home-process__step")).toHaveCount(5);
    await expect(page.locator(".obx-home-tariffs__card")).toHaveCount(3);
    await expect(page.locator(".obx-home-trust__proof")).toHaveCount(4);
    await expect(page.locator(".obx-cases__case")).toHaveCount(3);
    await expect(page.locator(".obx-contacts__link-card")).toHaveCount(2);
    await expect(page.locator(".obx-footer__link")).toHaveCount(9);
    await expect(page.locator(".obx-privacy")).toHaveCount(1);

    await page.locator("[data-obx-cookie-accept]").click();
    await expect(page.locator("[data-obx-cookie]")).not.toHaveClass(/is-visible/);

    await page.locator(".obx-footer__link[data-obx-privacy-open]").click();
    await expect(page.locator("[data-obx-privacy-modal]")).toHaveClass(/is-open/);
    await page.locator("[data-obx-privacy-close]").last().click();
    await expect(page.locator("[data-obx-privacy-modal]")).not.toHaveClass(/is-open/);

    const brokenImages = await page.evaluate(() => Array.from(document.images).filter((img) => {
      const src = img.getAttribute("src") || "";
      if (!src || src.startsWith("http://") || src.startsWith("https://")) return false;
      return !img.complete || img.naturalWidth === 0;
    }).map((img) => img.getAttribute("src")));
    expect(brokenImages).toEqual([]);

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBe(0);

    await page.screenshot({ path: "test-results/onixbit-home-first-pass-" + viewport.name + ".png", fullPage: true });
  });
}
