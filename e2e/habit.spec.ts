import { test, expect } from "@playwright/test";

test("habit flow: create habit via wizard → appears on home → check in", async ({
  page,
  request,
  context,
}) => {
  // --- Register a fresh account via API (faster than UI auth) ---
  const timestamp = Date.now();
  const email = `e2e_habit_${timestamp}@test.com`;
  const username = `e2ehabit${timestamp}`;
  const password = "TestPass123!";

  const registerRes = await request.post(
    "http://localhost:3001/api/auth/register",
    { data: { email, username, password } }
  );
  expect(registerRes.ok()).toBeTruthy();
  const { token, user } = await registerRes.json();

  // Inject token + user into localStorage before navigation
  await context.addInitScript(
    ([t, u]) => {
      localStorage.setItem("token", t);
      localStorage.setItem("user", JSON.stringify(u));
    },
    [token, user]
  );

  // --- Navigate to habit wizard ---
  await page.goto("/habits/new");

  // Step 1: Name
  await page.getByPlaceholder("e.g. Morning run").fill("E2E Test Habit");
  await page.getByRole("button", { name: /next/i }).click();

  // Step 2: Frequency (fill required number field)
  await page.locator('input[type="number"]').first().fill("1");
  await page.getByRole("button", { name: /next/i }).click();

  // Steps 3–5: optional fields, just click Next
  await page.getByRole("button", { name: /next/i }).click(); // Step 3
  await page.getByRole("button", { name: /next/i }).click(); // Step 4
  await page.getByRole("button", { name: /next/i }).click(); // Step 5

  // Step 6: Social mode — choose Private
  await page.getByRole("button", { name: /private/i }).click();
  await page.getByRole("button", { name: /next/i }).click();

  // Step 7: Create Habit
  await page.getByRole("button", { name: /create habit/i }).click();

  // Should redirect to /home
  await page.waitForURL("**/home");

  // Habit should appear in the list
  await expect(page.getByText("E2E Test Habit")).toBeVisible();

  // --- Check in ---
  await page.getByRole("button", { name: /check in/i }).first().click();

  // Button should change to "Done ✓"
  await expect(
    page.getByRole("button", { name: /done/i }).first()
  ).toBeVisible();
});
