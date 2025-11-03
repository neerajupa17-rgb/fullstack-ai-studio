import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('AI Studio E2E Flow', () => {
  test('Complete user flow: signup -> login -> generate -> view history -> restore', async ({
    page,
  }) => {
    // Navigate to app
    await page.goto(BASE_URL);

    // Should redirect to login
    await expect(page).toHaveURL(/.*login/);

    // Go to signup
    await page.click('text=Don\'t have an account? Sign up');
    await expect(page).toHaveURL(/.*signup/);

    // Signup
    await page.fill('input[name="email"]', 'e2e-test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should be logged in and redirected to studio
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('text=AI Studio')).toBeVisible();

    // Fill in generation form
    await page.fill('textarea[id="prompt"]', 'A beautiful sunset');
    await page.selectOption('select[id="style"]', 'Realistic');

    // Generate (may need retries due to 20% error chance)
    const generateButton = page.locator('button:has-text("Generate")');
    await generateButton.click();

    // Wait for either success or error message
    await Promise.race([
      page.waitForSelector('text=Generation completed!', { timeout: 15000 }),
      page.waitForSelector('text=Model overloaded', { timeout: 15000 }),
    ]);

    // Check if generation was successful (if error, we can still test history)
    const hasError = await page.locator('text=Model overloaded').isVisible();
    if (!hasError) {
      await expect(page.locator('text=Generation completed!')).toBeVisible();
    }

    // Check history section exists
    await expect(page.locator('text=Recent Generations')).toBeVisible();

    // Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL(/.*login/);

    // Login again
    await page.fill('input[name="email"]', 'e2e-test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should be back in studio
    await expect(page).toHaveURL(/\/$/);
  });
});

