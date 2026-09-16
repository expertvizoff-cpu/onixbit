import { expect, test } from "@playwright/test";

const legacyRedirects = [
  ["/company", "/o-kompanii"],
  ["/company/brands", "/certificates"],
] as const;

test.describe("verified legacy redirects", () => {
  for (const [legacyPath, destination] of legacyRedirects) {
    for (const suffix of ["", "/"] as const) {
      test(`${legacyPath}${suffix} redirects directly to ${destination}`, async ({ request }) => {
        const response = await request.get(`${legacyPath}${suffix}?utm_source=legacy`, {
          maxRedirects: 0,
        });

        expect(response.status()).toBe(308);
        expect(response.headers().location).toBe(`${destination}?utm_source=legacy`);
        expect((await request.get(destination)).status()).toBe(200);
      });
    }
  }

  test("other trailing slashes keep the existing normalization", async ({ request }) => {
    const response = await request.get("/contacts/?utm_source=legacy", { maxRedirects: 0 });

    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe("/contacts?utm_source=legacy");
  });

  test("unmapped catalog URLs remain real 404 pages", async ({ request }) => {
    for (const path of ["/product", "/product/gotovye-sayty"]) {
      const response = await request.get(path, { maxRedirects: 0 });

      expect(response.status()).toBe(404);
      expect(await response.text()).toContain('name="robots" content="noindex"');
    }
  });
});

test("confirmed routes expose canonical and branded OG metadata", async ({ page }) => {
  for (const route of ["/", "/contacts", "/o-kompanii", "/tarify-licenziy", "/articles"]) {
    await page.goto(route);
    const canonicalUrl = route === "/" ? "https://onixbit.ru" : `https://onixbit.ru${route}`;

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      canonicalUrl,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://onixbit.ru/brand/onixbit-og.png",
    );
  }
});

test("robots and sitemap preserve the verified public URL set", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("User-Agent: *");
  expect(robots).toContain("Allow: /");
  expect(robots).toContain("Sitemap: https://onixbit.ru/sitemap.xml");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://onixbit.ru/o-kompanii</loc>");
  expect(sitemap).toContain("<loc>https://onixbit.ru/certificates</loc>");
  expect(sitemap).not.toContain("<loc>https://onixbit.ru/company</loc>");
  expect(sitemap).not.toContain("<loc>https://onixbit.ru/product</loc>");
});

test("organization schema uses verified catalog and phone values", async ({ page }) => {
  await page.goto("/");
  const organization = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes
      .map((node) => JSON.parse(node.textContent || "{}"))
      .find((item) => item["@type"] === "Organization"),
  );

  expect(organization.telephone).toBe("+78001005303");
  expect(organization.contactPoint.map((item: { telephone: string }) => item.telephone)).toEqual([
    "+78001005303",
    "+79202724828",
  ]);
  expect(organization.hasOfferCatalog["@type"]).toBe("OfferCatalog");
  expect(organization.hasOfferCatalog.itemListElement).toHaveLength(3);
  expect(organization.makesOffer).toBeUndefined();
});

test("article dates distinguish publication from the documented update", async ({ page }) => {
  await page.goto("/articles/poverhnostnoe-vnedrenie-bitrix24");

  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute(
    "content",
    "2026-06-29",
  );
  await expect(page.locator('meta[property="article:modified_time"]')).toHaveAttribute(
    "content",
    "2026-07-01",
  );
  await expect(page.locator('time[datetime="2026-06-29"]')).toContainText("Опубликовано");
  await expect(page.locator('time[datetime="2026-07-01"]')).toContainText("Обновлено");

  const article = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes
      .flatMap((node) => {
        const parsed = JSON.parse(node.textContent || "{}");
        return parsed["@graph"] || [parsed];
      })
      .find((item) => item["@type"] === "Article"),
  );
  expect(article.datePublished).toBe("2026-06-29");
  expect(article.dateModified).toBe("2026-07-01");
});

test("confirmed heading and accessible-name fixes are present", async ({ page }) => {
  await page.goto("/contacts");
  await expect(page.locator("#contact-form h2")).toHaveText("Заявка на консультацию");

  await page.goto("/");
  const station = page.locator(".ob-system-route__station").first();
  await expect(station).toContainText("Битрикс24");
  await expect(station).toHaveAccessibleName("Битрикс24 воронки, роботы, задачи, коммуникации");
});

test("selected city survives a delayed lazy map load", async ({ page }) => {
  let releaseMap!: () => void;
  const gate = new Promise<void>((resolve) => {
    releaseMap = resolve;
  });

  await page.route("https://api-maps.yandex.ru/2.1/**", async (route) => {
    await gate;
    await route.fulfill({
      contentType: "application/javascript",
      body: `window.ymaps = {
        ready: callback => callback(),
        Map: class {
          constructor(node) { this.node = node; }
          behaviors = { disable() {} };
          geoObjects = { add() {} };
          setBounds() {}
          setCenter(coords) { this.node.dataset.center = JSON.stringify(coords); }
          destroy() {}
        },
        Placemark: class { options = { set() {} }; }
      };`,
    });
  });

  await page.goto("/contacts");
  await expect(page.locator('script[data-onixbit-ymaps="true"]')).toHaveCount(0);

  const map = page.locator(".ob-contact-map");
  await map.scrollIntoViewIfNeeded();
  await expect(map).toHaveAttribute("data-map-status", "loading");

  try {
    await map.getByRole("button", { name: "Кимовск", exact: true }).first().click();
    await expect(map.locator(".ob-contact-map__active h3")).toHaveText("Кимовск");
  } finally {
    releaseMap();
  }

  await expect(map).toHaveAttribute("data-map-status", "ready");
  await expect(map.locator(".ob-contact-map__canvas")).toHaveAttribute(
    "data-center",
    "[53.9691867,38.528019]",
  );
});
