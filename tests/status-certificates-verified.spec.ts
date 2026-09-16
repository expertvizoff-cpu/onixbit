import { expect, test } from "@playwright/test";

test("current partner statuses replace unsupported active claims", async ({ page }) => {
  await page.goto("/razrabotka-saitov-na-1c-bitrix");
  await expect(page.locator("main")).toContainText("Сертифицированный партнёр 1С-Битрикс");
  await expect(page.locator("main")).not.toContainText("Золотой партнёр 1С-Битрикс");

  await page.goto("/vnedrenie-bitrix24");
  await expect(page.locator("main")).toContainText("Золотой партнёр Битрикс24");

  await page.goto("/certificates");
  await expect(page.getByRole("link", { name: "Битрикс24 — золотой партнёр" })).toHaveAttribute(
    "href",
    "https://www.bitrix24.ru/partners/partner/10553488/",
  );
  await expect(page.getByRole("link", { name: "1С-Битрикс — сертифицированный партнёр" })).toHaveAttribute(
    "href",
    "https://www.1c-bitrix.ru/partners/10553488.php",
  );
  await expect(page.locator("main")).toContainText("Статусы проверены 16.09.2026");
});

test("certificate catalog exposes originals and marks archived proof", async ({ page, request }, testInfo) => {
  await page.setViewportSize(testInfo.project.name === "mobile-chromium"
    ? { width: 390, height: 844 }
    : { width: 1440, height: 1000 });
  await page.goto("/certificates");
  await expect(page.locator('.obx-certs[data-hydrated="true"]')).toBeVisible();

  const currentBitrix24 = page.locator(".obx-certs__card").filter({
    has: page.getByRole("heading", { name: "Золотой партнёр Битрикс24", exact: true }),
  });
  const currentBitrix = page.locator(".obx-certs__card").filter({
    has: page.getByRole("heading", { name: "Сертифицированный партнёр 1С-Битрикс", exact: true }),
  });
  const archivedGold = page.locator(".obx-certs__card").filter({
    has: page.getByRole("heading", { name: "Золотой партнёр 1С-Битрикс — архив", exact: true }),
  });

  await expect(currentBitrix24).toContainText("01.11.2026");
  await expect(currentBitrix).toContainText("08.04.2027");
  await expect(archivedGold).toContainText("Архив");
  await expect(archivedGold).toContainText("27.03.2024");

  for (const card of [currentBitrix24, currentBitrix, archivedGold]) {
    const original = card.getByRole("link", { name: "Открыть оригинал", exact: true });
    const href = await original.getAttribute("href");
    expect(href).toBeTruthy();
    expect((await request.get(href!)).status()).toBe(200);
  }

  const integration = page.locator(".obx-certs__card").filter({
    has: page.getByRole("heading", { name: "Компетенция интеграция с 1С", exact: true }),
  });
  const composite = page.locator(".obx-certs__card").filter({
    has: page.getByRole("heading", { name: "Компетенция Композитный сайт", exact: true }),
  });
  await expect(integration).toContainText("24.03.2024");
  await expect(composite).toContainText("18.04.2023");

  const trigger = currentBitrix24.getByRole("button", { name: "Открыть сертификат: Золотой партнёр Битрикс24" });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Открыть оригинал документа" })).toBeVisible();
  await expect(dialog.locator(".obx-certs__modal-media")).toHaveCSS("min-height", "0px");
  await page.getByRole("button", { name: "Закрыть сертификат", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});
