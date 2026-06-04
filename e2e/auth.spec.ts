import { test, expect } from "@playwright/test";

test("auth flow: register → home → sign out → log in → home", async ({
  page,
}) => {
  // Unique credentials so each test run creates a fresh account
  const timestamp = Date.now();
  const email = `e2e_${timestamp}@test.com`;
  const username = `e2euser${timestamp}`;
  const password = "TestPass123!";

  // --- Register ---
  await page.goto("/register");
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("yourname").fill(username);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: /create account/i }).click();

  // Should land on /home
  await page.waitForURL("**/home");
  await expect(
    page.getByRole("heading", { name: /today's habits/i })
  ).toBeVisible();

  // --- Sign out ---
  await page.getByRole("button", { name: /sign out/i }).click();
  await page.waitForURL("**/login");
  await expect(page).toHaveURL(/\/login/);

  // --- Log in ---
  await page.getByPlaceholder("you@example.com").fill(email);
  await page.getByPlaceholder("••••••••").fill(password);
  await page.getByRole("button", { name: /log in/i }).click();

  // Should land back on /home
  await page.waitForURL("**/home");
  await expect(
    page.getByRole("heading", { name: /today's habits/i })
  ).toBeVisible();
});
