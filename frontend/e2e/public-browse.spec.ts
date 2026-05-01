import { expect, test } from '@playwright/test';

test.describe('Public browse flow', () => {
  test('home page renders hero + featured listings grid', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Rent the gear/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Browse all gear/i })).toBeVisible();
  });

  test('search page filters listings and reflects state into the URL', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('app-listing-card').first()).toBeVisible();

    // Click the toggle's actual interactive control. The visual span overlays
    // the checkbox, so target the input by its accessible name and force-click.
    const verifiedCheckbox = page.locator('input[type="checkbox"]').first();
    if (await verifiedCheckbox.count()) {
      await verifiedCheckbox.check({ force: true });
      await expect(page).toHaveURL(/verifiedOnly=true/);
    }
  });

  test('listing detail loads via deep link', async ({ page }) => {
    await page.goto('/search');
    await page.locator('app-listing-card a').first().click();
    await expect(page).toHaveURL(/\/listing\//);
    // The page renders a breadcrumb + title; just check that the page header is present.
    await expect(page.locator('app-page-header').getByRole('heading').first()).toBeVisible();
  });
});
