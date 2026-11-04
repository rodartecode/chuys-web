import { expect, test } from "@playwright/test";

// Mirrors `business.social` in src/data/business.ts. Hardcoded because that module reads
// `import.meta.env`, which Playwright's Node runner doesn't provide.
const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/chuys_tacos/" },
  { label: "Facebook", href: "https://www.facebook.com/ChuysTacosFresno/" },
];

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("the footer Follow column links to each social profile in a new tab", async ({ page }) => {
  const footer = page.locator("footer.site-footer");
  await expect(footer.getByRole("heading", { name: "Follow" })).toBeVisible();
  for (const { label, href } of SOCIAL) {
    const link = footer.getByRole("link", { name: new RegExp(`^${label}`) });
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
  }
});

test("the Restaurant JSON-LD lists the social profiles as sameAs", async ({ page }) => {
  const json = await page.locator('script[type="application/ld+json"]').textContent();
  const data = JSON.parse(json ?? "{}");
  expect(data.sameAs).toEqual(SOCIAL.map((link) => link.href));
});

test("the footer fits a phone screen without horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  const overflow = await page
    .locator("footer.site-footer")
    .evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
