const { test, expect } = require("@playwright/test");

process.env.LD_LIBRARY_PATH = [
  "/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu",
  process.env.LD_LIBRARY_PATH || "",
].filter(Boolean).join(":");

const baseUrl = "https://million-operable-fish.tilda.ws";

const pages = [
  {
    slug: "/",
    title: "Главная",
    counts: {
      ".obx-hero": 1,
      ".obx-problems__scan-row": 4,
      ".obx-audience__card": 4,
      ".obx-home-system__node": 8,
      ".obx-home-process__step": 5,
      ".obx-home-trust__proof": 4,
      ".obx-cases__case": 3,
    },
  },
  {
    slug: "/vnedrenie-bitrix24",
    title: "Внедрение",
    counts: {
      ".obx-hero": 1,
      ".obx-deep--scope": 1,
      ".obx-deep--scope .obx-deep__card": 6,
      ".obx-problems__scan-row": 4,
      ".obx-process__step": 6,
      ".obx-why__card": 4,
      ".obx-trust__card": 4,
      ".obx-cases__case": 3,
      ".obx-faq__item": 6,
    },
  },
  {
    slug: "/integratsii-bitrix24",
    title: "Интеграции",
    counts: {
      ".obx-integrations__node": 6,
      ".obx-deep--integration": 1,
      ".obx-deep--integration .obx-deep__flow-card": 4,
      ".obx-platforms__source": 6,
      ".obx-services__card": 4,
      ".obx-process__step": 6,
      ".obx-certs__card": 8,
      ".obx-faq__item": 6,
    },
  },
  {
    slug: "/tarify-bitrix24",
    title: "Тарифы",
    counts: {
      ".obx-tariffs__edition": 2,
      ".obx-deep--tariff": 1,
      ".obx-deep--tariff .obx-deep__compare-card": 2,
      ".obx-deep--tariff .obx-deep__mini": 4,
      ".obx-price-line__card": 7,
      ".obx-faq__item": 6,
    },
  },
  {
    slug: "/cases",
    title: "Кейсы",
    counts: {
      ".obx-deep--cases": 1,
      ".obx-deep--cases .obx-deep__method article": 4,
      ".obx-cases__case": 3,
      ".obx-audience__card": 4,
      ".obx-trust__card": 4,
      ".obx-certs__card": 8,
    },
  },
  {
    slug: "/contacts",
    title: "Контакты",
    counts: {
      ".obx-deep--contact": 1,
      ".obx-deep--contact .obx-deep__compare-card": 2,
      ".obx-deep--contact .obx-deep__mini": 4,
      ".obx-requisites__row": 7,
      ".obx-contacts__link-card": 2,
      ".obx-footer__link": 9,
    },
  },
];

const viewports = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "mobile", width: 390, height: 1200 },
];

async function expectSharedLayout(page) {
  await expect(page.locator(".ob-site-header")).toHaveCount(1);
  await expect(page.locator(".obx-contacts")).toHaveCount(1);
  await expect(page.locator(".obx-privacy")).toHaveCount(1);
  await expect(page.locator(".obx-contacts__form-panel")).toHaveCount(1);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);

  const brokenLoadedImages = await page.evaluate(() => Array.from(document.images)
    .filter((img) => (img.getAttribute("src") || img.currentSrc) && img.complete && img.naturalWidth === 0)
    .map((img) => img.currentSrc || img.src || img.getAttribute("src")));
  expect(brokenLoadedImages).toEqual([]);
}

async function exerciseInteractions(page) {
  const faqItems = page.locator(".obx-faq__item");
  if (await faqItems.count()) {
    await faqItems.nth(1).locator(".obx-faq__question").click();
    await expect(faqItems.nth(1)).toHaveClass(/is-open/);
  }

  const tariffPlan = page.locator("[data-obx-tariff-plan=\"professional\"]");
  if (await tariffPlan.count()) {
    await tariffPlan.click();
    await expect(page.locator(".obx-tariffs__scenario-title")).toHaveText("Профессиональный");
  }

  const platformSource = page.locator("[data-obx-platform=\"phone\"]");
  if (await platformSource.count()) {
    await platformSource.click();
    await expect(page.locator(".obx-platforms__route-title")).toHaveText("Телефония");
  }

  const certificatePreview = page.locator(".obx-certs__preview:visible, .obx-certs__showcase:visible").first();
  if (await certificatePreview.count()) {
    await certificatePreview.click();
    await expect(page.locator(".obx-certs__modal")).toHaveClass(/is-open/);
    await page.locator(".obx-certs__modal-close").click();
    await expect(page.locator(".obx-certs__modal")).not.toHaveClass(/is-open/);
  }

  const cookieButton = page.locator("[data-obx-cookie-accept]");
  if (await cookieButton.count()) {
    await cookieButton.click();
    await expect(page.locator("[data-obx-cookie]")).not.toHaveClass(/is-visible/);
  }

  await page.locator(".obx-footer__link[data-obx-privacy-open]").click();
  await expect(page.locator("[data-obx-privacy-modal]")).toHaveClass(/is-open/);
  await page.locator("[data-obx-privacy-close]").last().click();
  await expect(page.locator("[data-obx-privacy-modal]")).not.toHaveClass(/is-open/);
}

for (const pageConfig of pages) {
  for (const viewport of viewports) {
    test(pageConfig.title + " live " + viewport.name, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(baseUrl + pageConfig.slug, { waitUntil: "domcontentloaded" });
      expect(response.status()).toBeLessThan(400);

      for (const [selector, count] of Object.entries(pageConfig.counts)) {
        await expect(page.locator(selector)).toHaveCount(count);
      }

      await exerciseInteractions(page);
      await expectSharedLayout(page);

      await page.screenshot({
        path: "test-results/live-" + pageConfig.title + "-" + viewport.name + ".png",
        fullPage: true,
      });
    });
  }
}
