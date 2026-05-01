import { expect, test } from '@playwright/test';

test.describe('Auth flow', () => {
  test('login page surfaces field validation when an invalid email is entered', async ({
    page,
  }) => {
    await page.goto('/auth/login');
    // Type an invalid value so the email validator fires; this also marks the
    // control dirty, which is what FormField gates the error display on.
    const emailInput = page.getByPlaceholder('you@example.com');
    await emailInput.fill('not-an-email');
    await emailInput.press('Tab');
    await expect(page.locator('app-form-field [role="alert"]').first()).toBeVisible();
  });

  test('signup wizard renders the account step', async ({ page }) => {
    await page.goto('/auth/signup');
    await expect(page.getByRole('heading', { name: /Create your account/i })).toBeVisible();
  });

  test('forgot password page loads', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page).toHaveURL(/forgot-password/);
  });
});
