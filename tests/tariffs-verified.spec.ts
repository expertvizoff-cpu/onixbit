import { expect, test } from "@playwright/test";

test("verified Bitrix24 license prices, limits and billing periods stay separate", async ({ page }) => {
  await page.goto("/tarify-licenziy");
  const main = page.locator("main");

  await expect(main).toContainText("Цены и лимиты проверены 16.09.2026");
  await expect(main).not.toContainText("-30%");
  await expect(page.getByRole("link", { name: "Облачные тарифы вендора" })).toHaveAttribute(
    "href",
    "https://www.bitrix24.ru/prices/",
  );
  await expect(page.getByRole("link", { name: "Коробочные лицензии" })).toHaveAttribute(
    "href",
    "https://www.bitrix24.ru/prices/self-hosted.php",
  );

  const licenses = page.locator('[data-obx-panel="cloud"]');
  const basic = licenses.locator("article").filter({
    has: page.getByRole("heading", { name: "Базовый", exact: true }),
  });
  const standard = licenses.locator("article").filter({
    has: page.getByRole("heading", { name: "Стандартный", exact: true }),
  });
  const professional = licenses.locator("article").filter({
    has: page.getByRole("heading", { name: "Профессиональный", exact: true }),
  });
  const enterprise = licenses.locator("article").filter({
    has: page.getByRole("heading", { name: "Энтерпрайз", exact: true }),
  });

  await expect(basic.locator(".obx-price-line__price > strong")).toHaveText("1 990 ₽");
  await expect(basic).toContainText("1 ТБ диск");
  await expect(standard.locator(".obx-price-line__price > strong")).toHaveText("5 590 ₽");
  await expect(standard).toContainText("5 ТБ диск");
  await expect(professional.locator(".obx-price-line__price > strong")).toHaveText("11 190 ₽");
  await expect(professional).toContainText("134 280 ₽ за 12 месяцев");
  await expect(professional).toContainText("10 ТБ диск");
  await expect(enterprise.locator(".obx-price-line__price > strong")).toHaveText("27 190 ₽");
  await expect(enterprise).toContainText("15 ТБ диск");

  await page
    .getByRole("tablist", { name: "Срок лицензии Битрикс24" })
    .getByRole("tab", { name: "1 месяц", exact: true })
    .click();
  await expect(professional.locator(".obx-price-line__price > strong")).toHaveText("13 990 ₽");

  await page
    .getByRole("tablist", { name: "Тип лицензии Битрикс24" })
    .getByRole("tab", { name: "Коробка", exact: true })
    .click();
  const boxLicenses = page.locator('[data-obx-panel="box"]');
  await expect(boxLicenses.locator("article").first()).toContainText("159 000 ₽");
  await expect(boxLicenses.locator("article").last()).toContainText("599 000 ₽");

  await expect(main).toContainText("25 ГБ диск");
  await expect(main).toContainText("неограниченно пользователей");
});

test("Marketplace and BitrixGPT use base prices without VAT and annual discount", async ({ page }) => {
  await page.goto("/tarify-licenziy");
  const market = page.locator(".obx-marketplace-plus");
  const marketProfessional = market.locator("article").filter({
    has: page.getByRole("heading", { name: "Профессиональный", exact: true }),
  });

  await expect(market).toContainText("базовые цены без НДС на 16.09.2026");
  await expect(page.getByRole("link", { name: "Базовые цены" })).toHaveAttribute(
    "href",
    "https://www.bitrix24.ru/apps/subscribe_base.php",
  );
  await expect(page.getByRole("link", { name: "Текущие акции и условия" })).toHaveAttribute(
    "href",
    "https://www.bitrix24.ru/apps/subscribe.php",
  );

  await expect(marketProfessional.locator(".obx-marketplace-plus__price > strong")).toHaveText("6 000 ₽");
  await expect(marketProfessional).toContainText("10 ТБ диск");
  await expect(marketProfessional).toContainText("в месяц за всех пользователей, без НДС");

  await market.getByRole("tab", { name: "12 месяцев", exact: true }).click();
  await expect(marketProfessional.locator(".obx-marketplace-plus__price > strong")).toHaveText("4 800 ₽");
  await expect(marketProfessional).toContainText("57 600 ₽ за 12 месяцев, без НДС");

  await market.getByRole("tab", { name: "Коробка", exact: true }).click();
  await expect(market.locator("article").first()).toContainText("60 000 ₽");
  await expect(market.locator("article").last()).toContainText("210 000 ₽");
  await expect(market.locator("article").first()).toContainText("за 12 месяцев, без НДС");
});
