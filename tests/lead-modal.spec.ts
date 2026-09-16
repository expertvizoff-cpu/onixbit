import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("onixbitPrivacyConsent", "essential");
  });
});

async function openLeadModal(page: Page) {
  const privacyBanner = page.getByRole("complementary", { name: "Согласие на обработку данных" });
  if (await privacyBanner.isVisible()) {
    await privacyBanner.getByRole("button", { name: "Только обязательные", exact: true }).click();
  }
  const menu = page.getByRole("button", { name: "Открыть меню", exact: true });
  if (await menu.isVisible()) await menu.click();
  const opener = page.locator("[data-obx-lead-open]").filter({ visible: true }).first();
  await opener.click();
  await expect(page.getByRole("dialog", { name: /Опишите ситуацию/ })).toBeVisible();
  return opener;
}

test("branded modal preserves fields, source and UTM through successful submission", async ({ page }) => {
  let submitted: Record<string, unknown> | undefined;
  await page.route("**/api/leads", async (route) => {
    submitted = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });

  await page.goto("/contacts?utm_source=search&utm_medium=cpc&utm_campaign=crm&utm_content=header&utm_term=bitrix24");
  await openLeadModal(page);
  const dialog = page.getByRole("dialog", { name: /Опишите ситуацию/ });

  await expect(dialog.getByLabel("Имя")).toBeVisible();
  await expect(dialog.getByLabel("Фамилия")).toBeVisible();
  await expect(dialog.getByLabel("Телефон")).toBeVisible();
  await expect(dialog.getByLabel("E-mail")).toBeVisible();
  await expect(dialog.getByLabel("Короткое описание задачи")).toBeVisible();
  await expect(page.locator('script[data-b24-form^="click/28/"]')).toHaveCount(0);

  await dialog.getByLabel("Имя").fill("Александр");
  await dialog.getByLabel("Фамилия").fill("Тестовый");
  await dialog.getByLabel("Телефон").fill("+7 920 000-00-00");
  await dialog.getByLabel("E-mail").fill("qa@example.test");
  await dialog.getByLabel("Короткое описание задачи").fill("Проверка branded modal без записи в CRM");
  await dialog.getByLabel(/Я согласен на обработку/).check();
  await dialog.getByRole("button", { name: /Отправить заявку/ }).click();

  await expect(dialog.getByRole("heading", { name: "Заявка принята" })).toBeVisible();
  expect(submitted).toMatchObject({
    name: "Александр",
    lastName: "Тестовый",
    phone: "+7 920 000-00-00",
    email: "qa@example.test",
    comments: "Проверка branded modal без записи в CRM",
    consent: true,
    utm: {
      utm_source: "search",
      utm_medium: "cpc",
      utm_campaign: "crm",
      utm_content: "header",
      utm_term: "bitrix24",
    },
  });
  expect(String(submitted?.source)).toContain("Обсудить проект");
  expect(String(submitted?.pageUrl)).toContain("utm_source=search");
});

test("modal validates contact and consent before sending", async ({ page }) => {
  let apiCalls = 0;
  await page.route("**/api/leads", async (route) => {
    apiCalls += 1;
    await route.fulfill({ status: 201, contentType: "application/json", body: JSON.stringify({ ok: true }) });
  });
  await page.goto("/");
  await openLeadModal(page);
  const dialog = page.getByRole("dialog", { name: /Опишите ситуацию/ });

  await dialog.getByRole("button", { name: /Отправить заявку/ }).click();
  await expect(dialog.getByText("Укажите телефон или e-mail, чтобы мы могли ответить.")).toBeVisible();
  await expect(dialog.getByText("Подтвердите согласие на обработку персональных данных.")).toBeVisible();
  expect(apiCalls).toBe(0);

  await dialog.getByLabel("Телефон").fill("123");
  await dialog.getByLabel(/Я согласен на обработку/).check();
  await dialog.getByRole("button", { name: /Отправить заявку/ }).click();
  await expect(dialog.getByText("Проверьте номер телефона.")).toBeVisible();
  expect(apiCalls).toBe(0);
});

test("modal traps keyboard focus, closes with Escape and restores the opener", async ({ page }) => {
  await page.goto("/");
  await openLeadModal(page);
  await expect(page.getByLabel("Имя")).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: /Опишите ситуацию/ })).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => {
    const active = document.activeElement;
    return active instanceof HTMLElement
      && (active.matches("[data-obx-lead-open]") || active.matches(".ob-header__burger"));
  })).toBe(true);
});

test("mobile modal has no horizontal overflow and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await openLeadModal(page);
  const dialog = page.getByRole("dialog", { name: /Опишите ситуацию/ });

  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await expect(dialog).toHaveCSS("animation-name", "none");

  const scan = await new AxeBuilder({ page })
    .include("[data-obx-lead-modal]")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = scan.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking).toEqual([]);
});

test("lead API rejects unsafe requests and hides server configuration errors", async ({ page }) => {
  await page.goto("/");

  const crossOrigin = await page.request.post("/api/leads", {
    headers: { origin: "https://example.invalid", "content-type": "application/json" },
    data: {},
  });
  expect(crossOrigin.status()).toBe(403);

  const invalid = await page.evaluate(async () => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ requestId: "qa-invalid", consent: false }),
    });
    return { status: response.status, body: await response.json() as { ok?: boolean } };
  });
  expect(invalid.status).toBe(400);
  expect(invalid.body).toMatchObject({ ok: false });

  const unavailable = await page.evaluate(async () => {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: "QA",
        lastName: "",
        phone: "+7 920 000-00-00",
        email: "",
        comments: "Проверка ответа без настроенного webhook",
        consent: true,
        website: "",
        pageUrl: window.location.href,
        pageTitle: document.title,
        source: "QA preview",
        requestId: `qa-unavailable-${Date.now()}`,
        utm: {},
      }),
    });
    return { status: response.status, body: await response.json() as { ok?: boolean; message?: string } };
  });
  expect(unavailable.status).toBe(502);
  expect(unavailable.body).toEqual({
    ok: false,
    message: "Не удалось отправить заявку. Позвоните нам или попробуйте ещё раз.",
  });
});

test("@visual captures branded lead modal for review", async ({ page }, testInfo) => {
  await page.goto("/contacts");
  await openLeadModal(page);
  await mkdir(".work/branded-modal", { recursive: true });
  await page.screenshot({
    path: `.work/branded-modal/lead-modal-${testInfo.project.name}.png`,
    animations: "disabled",
  });
});
