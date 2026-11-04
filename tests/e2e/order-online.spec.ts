import { expect, test } from "@playwright/test";

// Mirrors `business.orderUrl` in src/data/business.ts. Hardcoded because that module reads
// `import.meta.env`, which Playwright's Node runner doesn't provide.
const ORDER_URL = "https://cash.app/$chuystacosytaquizas";

// Header bar, header mobile menu, Hero, menu footer note, site footer.
const EXPECTED_LINKS = 5;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("every Order Online link points at Cash App and opens in a new tab", async ({ page }) => {
  // A CSS locator includes hidden elements, so the closed mobile menu's link is counted too.
  const links = page.locator(`a[href="${ORDER_URL}"]`);
  await expect(links).toHaveCount(EXPECTED_LINKS);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
  }
  await expect(page.locator("#top").getByRole("link", { name: /^Order Online/ })).toBeVisible();
});

test("the mobile menu shows Order Online", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  const menu = page.locator("details.nav-mobile");
  await menu.locator("summary").click();
  await expect(menu.getByRole("link", { name: /^Order Online/ })).toBeVisible();
});

test("the Restaurant JSON-LD advertises the order action", async ({ page }) => {
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(json ?? "{}");
  expect(data.potentialAction).toMatchObject({
    "@type": "OrderAction",
    target: { "@type": "EntryPoint", urlTemplate: ORDER_URL },
  });
});
