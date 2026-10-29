import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Focusing the form loads Turnstile from the network; the smoke test never needs it.
  await page.route("https://challenges.cloudflare.com/**", (route) => route.abort());
  await page.goto("/");
});

test("the inquiry form renders", async ({ page }) => {
  const form = page.getByTestId("inquiry-form");
  await expect(page.getByRole("heading", { name: "Request a catering quote." })).toBeVisible();
  for (const label of ["Name", "Email", "Phone", "Event date", "Guest count", "Event type"]) {
    await expect(form.getByLabel(label)).toBeVisible();
  }
  await expect(form.getByRole("button", { name: "Send Inquiry" })).toBeEnabled();
});

test("an empty submit is blocked in the browser", async ({ page }) => {
  const apiRequests: string[] = [];
  page.on("request", (req) => {
    if (new URL(req.url()).pathname === "/api/inquiry") apiRequests.push(req.url());
  });

  const form = page.getByTestId("inquiry-form");
  await form.getByRole("button", { name: "Send Inquiry" }).click();

  // The form is `novalidate`, so the `invalid` class is the only sign of a blocked submit.
  for (const label of ["Name", "Email", "Event date", "Guest count"]) {
    await expect(form.getByLabel(label)).toHaveClass(/\binvalid\b/);
  }
  await expect(form.getByLabel("Phone")).not.toHaveClass(/\binvalid\b/);
  await expect(form.getByRole("status")).not.toHaveClass(/show-/);
  expect(apiRequests).toEqual([]);
});
