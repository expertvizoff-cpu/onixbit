const { test } = require("@playwright/test");
const fs = require("fs");
const path = require("path");

process.env.LD_LIBRARY_PATH = [
  "/tmp/pwlibs/root/usr/lib/x86_64-linux-gnu",
  process.env.LD_LIBRARY_PATH || "",
].filter(Boolean).join(":");

const baseUrl = "https://million-operable-fish.tilda.ws";

const pages = [
  {
    name: "Главная",
    url: "/",
    expectedH1: "Внедряем Битрикс24 так, чтобы CRM стала рабочей системой бизнеса",
    expectedBlocks: [".obx-hero", ".obx-problems", ".obx-audience", ".obx-home-system", ".obx-home-process", ".obx-home-tariffs", ".obx-home-trust", ".obx-cases"],
  },
  {
    name: "Внедрение",
    url: "/vnedrenie-bitrix24",
    expectedH1: "Внедрение Битрикс24 под реальные процессы компании",
    expectedBlocks: [".obx-hero", ".obx-deep--scope", ".obx-problems", ".obx-process", ".obx-why", ".obx-trust", ".obx-cases", ".obx-faq"],
  },
  {
    name: "Интеграции",
    url: "/integratsii-bitrix24",
    expectedH1: "Связываем Битрикс24 с сайтом, 1С, телефонией и каналами заявок",
    expectedBlocks: [".obx-hero", ".obx-integrations", ".obx-deep--integration", ".obx-platforms", ".obx-services", ".obx-process", ".obx-certs", ".obx-faq"],
  },
  {
    name: "Тарифы",
    url: "/tarify-bitrix24",
    expectedH1: "Помогаем выбрать тариф Битрикс24 под задачи внедрения",
    expectedBlocks: [".obx-hero", ".obx-tariffs", ".obx-deep--tariff", ".obx-price-line", ".obx-faq"],
  },
  {
    name: "Кейсы",
    url: "/cases",
    expectedH1: "Показываем типовые ситуации, где Битрикс24 начинает работать как система",
    expectedBlocks: [".obx-hero", ".obx-deep--cases", ".obx-cases", ".obx-audience", ".obx-trust", ".obx-certs"],
  },
  {
    name: "Контакты",
    url: "/contacts",
    expectedH1: "Свяжитесь с нами, чтобы обсудить внедрение или развитие Битрикс24",
    expectedBlocks: [".obx-hero", ".obx-deep--contact", ".obx-requisites"],
  },
];

const viewports = [
  { name: "desktop", width: 1440, height: 1200 },
  { name: "mobile", width: 390, height: 1200 },
];

test("current live site audit", async ({ page }) => {
  const report = {
    baseUrl,
    generatedAt: new Date().toISOString(),
    pages: [],
    global: {
      issues: [],
      notes: [],
    },
  };

  for (const pageConfig of pages) {
    const pageReport = {
      name: pageConfig.name,
      url: baseUrl + pageConfig.url,
      seo: {},
      structure: {},
      conversion: {},
      forms: {},
      legal: {},
      analytics: {},
      responsive: {},
      issues: [],
      notes: [],
    };

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      const response = await page.goto(pageReport.url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(1200);

      const snapshot = await page.evaluate((expectedBlocks) => {
        const text = document.body ? document.body.innerText : "";
        const anchors = Array.from(document.querySelectorAll("a")).map((a) => ({
          text: (a.textContent || "").trim().replace(/\s+/g, " "),
          href: a.getAttribute("href") || "",
          target: a.getAttribute("target") || "",
        }));
        const forms = Array.from(document.querySelectorAll("form")).map((form) => ({
          action: form.getAttribute("action") || "",
          method: form.getAttribute("method") || "",
          fields: Array.from(form.querySelectorAll("input, textarea, select")).map((field) => ({
            tag: field.tagName.toLowerCase(),
            type: field.getAttribute("type") || "",
            name: field.getAttribute("name") || "",
            placeholder: field.getAttribute("placeholder") || "",
            value: field.getAttribute("value") || "",
          })),
        }));
        const scripts = Array.from(document.scripts).map((script) => script.src || script.textContent || "");
        const images = Array.from(document.images).map((img) => ({
          src: img.currentSrc || img.src || img.getAttribute("src") || "",
          alt: img.getAttribute("alt") || "",
          complete: img.complete,
          naturalWidth: img.naturalWidth,
        }));
        return {
          statusTitle: document.title,
          metaDescription: document.querySelector("meta[name='description']")?.getAttribute("content") || "",
          canonical: document.querySelector("link[rel='canonical']")?.getAttribute("href") || "",
          ogTitle: document.querySelector("meta[property='og:title']")?.getAttribute("content") || "",
          ogDescription: document.querySelector("meta[property='og:description']")?.getAttribute("content") || "",
          ogImage: document.querySelector("meta[property='og:image']")?.getAttribute("content") || "",
          h1s: Array.from(document.querySelectorAll("h1")).map((h) => h.textContent.trim().replace(/\s+/g, " ")),
          headerCount: document.querySelectorAll(".ob-site-header").length,
          footerContactsCount: document.querySelectorAll(".obx-contacts").length,
          privacyCount: document.querySelectorAll(".obx-privacy").length,
          tildaLabelCount: document.querySelectorAll("#tildacopy, .t-tildalabel").length,
          placeholderCount: (text.match(/Html code will be here/g) || []).length,
          blockCounts: Object.fromEntries(expectedBlocks.map((selector) => [selector, document.querySelectorAll(selector).length])),
          ctaLinks: anchors.filter((a) => /обсудить|подобрать|запросить|создать|написать|контакт|заяв/i.test(a.text)),
          phoneLinks: anchors.filter((a) => a.href.startsWith("tel:")),
          mailLinks: anchors.filter((a) => a.href.startsWith("mailto:")),
          messengerLinks: anchors.filter((a) => /t\.me|vk\.com|max\.ru|wa\.me|whatsapp/i.test(a.href)),
          forms,
          hasCookie: !!document.querySelector("[data-obx-cookie]"),
          hasPrivacyOpen: !!document.querySelector("[data-obx-privacy-open]"),
          hasPrivacyModal: !!document.querySelector("[data-obx-privacy-modal]"),
          hasMetrika: scripts.some((s) => /mc\.yandex|ym\(|metrika/i.test(s)),
          hasGoogleAnalytics: scripts.some((s) => /googletagmanager|gtag\(|analytics/i.test(s)),
          hasDataLayer: !!window.dataLayer,
          hasTildaStats: scripts.some((s) => /tilda-stat/i.test(s)),
          images,
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          bodyLength: text.length,
        };
      }, pageConfig.expectedBlocks);

      if (viewport.name === "desktop") {
        pageReport.seo = {
          title: snapshot.statusTitle,
          description: snapshot.metaDescription,
          canonical: snapshot.canonical,
          ogTitle: snapshot.ogTitle,
          ogDescription: snapshot.ogDescription,
          ogImage: snapshot.ogImage,
          h1s: snapshot.h1s,
        };
        pageReport.structure = {
          headerCount: snapshot.headerCount,
          footerContactsCount: snapshot.footerContactsCount,
          privacyCount: snapshot.privacyCount,
          tildaLabelCount: snapshot.tildaLabelCount,
          placeholderCount: snapshot.placeholderCount,
          blockCounts: snapshot.blockCounts,
          bodyLength: snapshot.bodyLength,
        };
        pageReport.conversion = {
          ctaLinks: snapshot.ctaLinks,
          phoneLinks: snapshot.phoneLinks,
          mailLinks: snapshot.mailLinks,
          messengerLinks: snapshot.messengerLinks,
        };
        pageReport.forms = {
          count: snapshot.forms.length,
          forms: snapshot.forms,
        };
        pageReport.legal = {
          hasCookie: snapshot.hasCookie,
          hasPrivacyOpen: snapshot.hasPrivacyOpen,
          hasPrivacyModal: snapshot.hasPrivacyModal,
        };
        pageReport.analytics = {
          hasMetrika: snapshot.hasMetrika,
          hasGoogleAnalytics: snapshot.hasGoogleAnalytics,
          hasDataLayer: snapshot.hasDataLayer,
          hasTildaStats: snapshot.hasTildaStats,
        };
      }

      pageReport.responsive[viewport.name] = {
        status: response ? response.status() : null,
        overflow: snapshot.overflow,
        brokenImages: snapshot.images.filter((img) => img.src && img.complete && img.naturalWidth === 0),
      };
    }

    const seo = pageReport.seo;
    if (pageReport.responsive.desktop.status >= 400) pageReport.issues.push("Страница отдаёт HTTP " + pageReport.responsive.desktop.status);
    if (seo.h1s.length !== 1) pageReport.issues.push("На странице должно быть ровно 1 H1, сейчас: " + seo.h1s.length);
    if (seo.h1s[0] !== pageConfig.expectedH1) pageReport.issues.push("H1 не совпадает с ожидаемым: " + (seo.h1s[0] || "нет H1"));
    if (!seo.title || seo.title.length < 20) pageReport.issues.push("Title пустой или слишком короткий");
    if (!seo.description || seo.description.length < 60) pageReport.issues.push("Meta description пустой или слишком короткий");
    if (!seo.ogImage) pageReport.issues.push("Нет OG image");
    if (pageReport.structure.headerCount !== 1) pageReport.issues.push("Шапка должна быть одна, сейчас: " + pageReport.structure.headerCount);
    if (pageReport.structure.footerContactsCount !== 1) pageReport.issues.push("Контактный футер должен быть один, сейчас: " + pageReport.structure.footerContactsCount);
    if (pageReport.structure.privacyCount !== 1) pageReport.issues.push("Privacy/cookie блок должен быть один, сейчас: " + pageReport.structure.privacyCount);
    if (pageReport.structure.placeholderCount) pageReport.issues.push("Остался Tilda placeholder: Html code will be here");
    for (const [selector, count] of Object.entries(pageReport.structure.blockCounts)) {
      if (count === 0) pageReport.issues.push("Не найден ожидаемый блок " + selector);
    }
    if (pageReport.responsive.desktop.overflow > 1) pageReport.issues.push("Desktop horizontal overflow: " + pageReport.responsive.desktop.overflow + "px");
    if (pageReport.responsive.mobile.overflow > 1) pageReport.issues.push("Mobile horizontal overflow: " + pageReport.responsive.mobile.overflow + "px");
    if (pageReport.responsive.desktop.brokenImages.length) pageReport.issues.push("Есть битые изображения на desktop");
    if (pageReport.responsive.mobile.brokenImages.length) pageReport.issues.push("Есть битые изображения на mobile");
    if (!pageReport.legal.hasCookie || !pageReport.legal.hasPrivacyModal) pageReport.issues.push("Не найден cookie/privacy механизм");
    if (pageReport.forms.count === 0) pageReport.notes.push("На странице нет настоящей HTML-формы; CTA ведут в контакты/почту/мессенджеры.");
    if (!pageReport.analytics.hasMetrika && !pageReport.analytics.hasGoogleAnalytics) pageReport.notes.push("Не найдена Яндекс.Метрика или Google Analytics; есть только Tilda/stat/dataLayer, если они включены.");
    if (pageReport.structure.tildaLabelCount) pageReport.notes.push("Виден Tilda label/copyright.");

    report.pages.push(pageReport);
  }

  const allTitles = report.pages.map((p) => p.seo.title);
  const duplicateTitles = allTitles.filter((title, index) => title && allTitles.indexOf(title) !== index);
  if (duplicateTitles.length) report.global.issues.push("Есть повторяющиеся title: " + Array.from(new Set(duplicateTitles)).join(" | "));

  const allDescriptions = report.pages.map((p) => p.seo.description);
  const duplicateDescriptions = allDescriptions.filter((description, index) => description && allDescriptions.indexOf(description) !== index);
  if (duplicateDescriptions.length) report.global.issues.push("Есть повторяющиеся meta description.");

  fs.writeFileSync(path.join(process.cwd(), "onixbit-current-audit-report.json"), JSON.stringify(report, null, 2));
});
