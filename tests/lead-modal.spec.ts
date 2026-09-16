import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const nativeFormAdapter = `(() => {
  const marker = document.querySelector('script[data-b24-form="inline/28/bslxb8"]');
  if (!marker || marker.parentElement.querySelector('.b24-form')) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'b24-form b24-form-wrapper';
  wrapper.innerHTML = '<form class="b24-form-content">'
    + '<label class="b24-form-field"><span class="b24-form-field-title">Имя</span><input class="b24-form-control" name="CONTACT_NAME" autocomplete="given-name"></label>'
    + '<label class="b24-form-field"><span class="b24-form-field-title">Фамилия</span><input class="b24-form-control" name="CONTACT_LAST_NAME" autocomplete="family-name"></label>'
    + '<label class="b24-form-field"><span class="b24-form-field-title">Телефон</span><input class="b24-form-control" name="CONTACT_PHONE" type="tel" value="+7"></label>'
    + '<label class="b24-form-field"><span class="b24-form-field-title">E-mail</span><input class="b24-form-control" name="CONTACT_EMAIL" type="email"></label>'
    + '<label class="b24-form-field"><span class="b24-form-field-title">Короткое описание задачи</span><textarea class="b24-form-control" name="DEAL_COMMENTS"></textarea></label>'
    + '<label class="b24-form-field-agreement"><input type="checkbox" checked> Я согласен на обработку персональных данных</label>'
    + '<button class="b24-form-btn" type="button">Отправить</button>'
    + '</form>';
  marker.after(wrapper);
})();`;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("onixbitPrivacyConsent", "essential");
  });
});

async function mockNativeForm(page: Page) {
  await page.route("https://cdn-ru.bitrix24.ru/**/loader_28.js**", (route) =>
    route.fulfill({ contentType: "application/javascript", body: nativeFormAdapter }),
  );
}

async function openLeadModal(page: Page) {
  const mobileOpener = page
    .getByRole("navigation", { name: "Быстрая мобильная навигация" })
    .getByRole("link", { name: "Заявка", exact: true });
  const opener = await mobileOpener.isVisible()
    ? mobileOpener
    : page.locator("[data-obx-lead-open]").filter({ visible: true }).first();
  await opener.click();
  await expect(page.getByRole("dialog", { name: /Опишите ситуацию/ })).toBeVisible();
  return opener;
}

test("branded modal embeds the configured Bitrix24 form 28", async ({ page }) => {
  await mockNativeForm(page);
  await page.goto("/contacts?utm_source=search&utm_medium=cpc&utm_campaign=crm");
  await openLeadModal(page);
  const dialog = page.getByRole("dialog", { name: /Опишите ситуацию/ });

  await expect(page.locator('script[data-b24-form="inline/28/bslxb8"]')).toHaveCount(1);
  await expect(page.locator('script[data-b24-form^="click/28/"]')).toHaveCount(0);
  await expect(dialog.getByLabel("Имя")).toBeVisible();
  await expect(dialog.getByLabel("Фамилия")).toBeVisible();
  await expect(dialog.getByLabel("Телефон")).toBeVisible();
  await expect(dialog.getByLabel("E-mail")).toBeVisible();
  await expect(dialog.getByLabel("Короткое описание задачи")).toBeVisible();
  await expect(dialog.getByLabel(/Я согласен на обработку/)).toBeChecked();
  await expect(dialog.getByRole("button", { name: "Отправить", exact: true })).toBeVisible();
  await expect(dialog.locator(".ob-form-slot")).toHaveAttribute("data-form-status", "ready");
});

test("failed native loader exposes direct contact fallback", async ({ page }) => {
  await page.route("https://cdn-ru.bitrix24.ru/**/loader_28.js**", (route) => route.abort());
  await page.goto("/");
  await openLeadModal(page);
  const alert = page.getByRole("dialog", { name: /Опишите ситуацию/ }).getByRole("alert");
  await expect(alert).toContainText("Не удалось загрузить форму");
  await expect(alert.getByRole("link", { name: "8 800 100-53-03" })).toHaveAttribute("href", "tel:+78001005303");
  await expect(alert.getByRole("link", { name: "info@onixbit.ru" })).toHaveAttribute("href", "mailto:info@onixbit.ru");
});

test("modal traps keyboard focus, closes with Escape and restores the opener", async ({ page }) => {
  await mockNativeForm(page);
  await page.goto("/");
  await openLeadModal(page);
  await expect(page.getByRole("button", { name: "Закрыть форму" })).toBeFocused();
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
  await mockNativeForm(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await openLeadModal(page);
  const dialog = page.getByRole("dialog", { name: /Опишите ситуацию/ });

  expect(await dialog.evaluate((element) => element.scrollWidth <= element.clientWidth + 1)).toBe(true);
  await expect(dialog).toHaveCSS("animation-name", "none");
  await expect(dialog.getByText("После заявки", { exact: true })).toBeVisible();
  await expect(dialog.getByText("Обозначим состав первого этапа", { exact: true })).toBeVisible();

  const scan = await new AxeBuilder({ page })
    .include("[data-obx-lead-modal]")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const blocking = scan.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious");
  expect(blocking).toEqual([]);
});

test("@visual captures branded native Bitrix24 form for review", async ({ page }, testInfo) => {
  await mockNativeForm(page);
  await page.goto("/contacts");
  await openLeadModal(page);
  await mkdir(".work/branded-modal", { recursive: true });
  await page.screenshot({
    path: `.work/branded-modal/lead-modal-${testInfo.project.name}.png`,
    animations: "disabled",
  });
});
