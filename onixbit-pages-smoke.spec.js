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

const pages = [
  {
    slug: "home",
    title: "Главная",
    blocks: [
      "onixbit-tilda-hero-home.html",
      "onixbit-tilda-problems.html",
      "onixbit-tilda-audience.html",
      "onixbit-tilda-services-home.html",
      "onixbit-tilda-process-home.html",
      "onixbit-tilda-tariffs-home.html",
      "onixbit-tilda-trust-home.html",
      "onixbit-tilda-cases.html",
    ],
    counts: {
      ".obx-problems__scan-row": 4,
      ".obx-audience__card": 4,
      ".obx-home-system__node": 8,
      ".obx-home-process__step": 5,
      ".obx-home-tariffs__card": 3,
      ".obx-home-trust__proof": 4,
      ".obx-cases__case": 3,
    },
  },
  {
    slug: "implementation",
    title: "Внедрение",
    blocks: [
      "onixbit-tilda-hero-implementation.html",
      "onixbit-tilda-implementation-scope.html",
      "onixbit-tilda-problems.html",
      "onixbit-tilda-process.html",
      "onixbit-tilda-why.html",
      "onixbit-tilda-trust.html",
      "onixbit-tilda-cases.html",
      "onixbit-tilda-faq.html",
    ],
    counts: {
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
    slug: "integrations",
    title: "Интеграции",
    blocks: [
      "onixbit-tilda-hero-integrations.html",
      "onixbit-tilda-integrations.html",
      "onixbit-tilda-integration-scenarios.html",
      "onixbit-tilda-platforms.html",
      "onixbit-tilda-services.html",
      "onixbit-tilda-process.html",
      "onixbit-tilda-certificates.html",
      "onixbit-tilda-faq.html",
    ],
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
    slug: "tariffs",
    title: "Тарифы",
    blocks: [
      "onixbit-tilda-hero-tariffs.html",
      "onixbit-tilda-tariffs.html",
      "onixbit-tilda-tariff-decision.html",
      "onixbit-tilda-price-line.html",
      "onixbit-tilda-faq.html",
    ],
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
    slug: "cases",
    title: "Кейсы",
    blocks: [
      "onixbit-tilda-hero-cases.html",
      "onixbit-tilda-cases-method.html",
      "onixbit-tilda-cases.html",
      "onixbit-tilda-audience.html",
      "onixbit-tilda-trust.html",
      "onixbit-tilda-certificates.html",
    ],
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
    slug: "contacts",
    title: "Контакты",
    blocks: ["onixbit-tilda-hero-contacts.html", "onixbit-tilda-contact-start.html", "onixbit-tilda-requisites.html"],
    counts: {
      ".obx-deep--contact": 1,
      ".obx-deep--contact .obx-deep__compare-card": 2,
      ".obx-deep--contact .obx-deep__mini": 4,
      ".obx-contacts__link-card": 2,
      ".obx-requisites__row": 7,
      ".obx-footer__link": 9,
    },
  },
];

const viewports = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "mobile", width: 390, height: 1200 },
];

function readBlocks(files) {
  return files
    .map((file) => fs.readFileSync(path.join(root, file), "utf8"))
    .join("\n")
    .replaceAll("src=\"logo_jumtp.png\"", "src=\"data:image/png;base64," + logoData + "\"")
    .replaceAll("src=\"https://onixbit.su/upload/onixbitru/logo/logo_jumtp.png\"", "src=\"data:image/png;base64," + logoData + "\"");
}

function htmlFor(pageConfig) {
  const header = readBlocks(["onixbit-tilda-header.html"]);
  const content = readBlocks(pageConfig.blocks);
  const footer = readBlocks(["onixbit-tilda-contacts-footer.html", "onixbit-tilda-privacy-modal.html"]);

  return "<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><base href=\"" +
    baseHref +
    "\"><style>" +
    css +
    "</style></head><body style=\"margin:0\">" +
    header +
    content +
    footer +
    "</body></html>";
}

async function expectNoLayoutBreaks(page) {
  const brokenLocalImages = await page.evaluate(() => Array.from(document.images)
    .filter((img) => {
      const src = img.getAttribute("src") || "";
      if (!src || src.startsWith("http://") || src.startsWith("https://")) return false;
      return !img.complete || img.naturalWidth === 0;
    })
    .map((img) => img.getAttribute("src")));
  expect(brokenLocalImages).toEqual([]);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBe(0);
}

async function exerciseSharedInteractions(page) {
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
    test(pageConfig.title + " " + viewport.name, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.setContent(htmlFor(pageConfig));

      await expect(page.locator(".ob-site-header")).toHaveCount(1);
      await expect(page.locator(".obx-contacts")).toHaveCount(1);
      await expect(page.locator(".obx-privacy")).toHaveCount(1);
      await expect(page.locator(".obx-contacts__form-panel")).toHaveCount(1);

      for (const [selector, count] of Object.entries(pageConfig.counts)) {
        await expect(page.locator(selector)).toHaveCount(count);
      }

      await exerciseSharedInteractions(page);
      await expectNoLayoutBreaks(page);

      await page.screenshot({
        path: "test-results/pages/" + pageConfig.slug + "-" + viewport.name + ".png",
        fullPage: true,
      });
    });
  }
}
