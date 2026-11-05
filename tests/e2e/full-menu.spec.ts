import { expect, test } from "@playwright/test";
// Relative import: Playwright doesn't read tsconfig paths here. menu.ts has no
// `import.meta.env`, so unlike business.ts it loads fine in Node.
import { fullMenu } from "../../src/data/menu";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("every full-menu item and drink option shows under its category", async ({ page }) => {
  await expect(page.locator("#menu").getByRole("heading", { name: "The full menu" })).toBeVisible();
  const menu = page.locator("#menu .full-menu");

  for (const category of fullMenu) {
    await expect(menu.getByRole("heading", { name: category.title, exact: true })).toBeVisible();
    const list = menu.getByTestId(`menu-${category.square.toLowerCase()}`);
    // Exact matching keeps "Taco" from also matching "Barbacoa Taco", and "Coke" from "Coke Zero".
    for (const item of category.items) {
      await expect(list.getByText(item.name, { exact: true })).toBeVisible();
      const line = list.locator("li").filter({ has: page.getByText(item.name, { exact: true }) });
      for (const option of item.options ?? []) {
        await expect(line.getByText(option, { exact: true })).toBeVisible();
      }
    }
  }
});

test("the menu section shows no prices", async ({ page }) => {
  await expect(page.locator("#menu")).not.toContainText(/\$\d/);
});

test("the full menu fits a phone screen without horizontal scroll", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  const overflow = await page.locator("#menu").evaluate((el) => el.scrollWidth - el.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
