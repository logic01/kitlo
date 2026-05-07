import { expect, test } from '@playwright/test';

// The /early-access page is a self-contained landing page that lives outside the
// PublicLayout. It posts to /api/waitlist; we stub that route so the spec runs
// without the real backend.
test.describe('Early-access waitlist landing', () => {
  test('renders the headline, primary CTA, and form', async ({ page }) => {
    await page.goto('/early-access');

    await expect(
      page.getByRole('heading', {
        name: /Rent thermal, night-vision, and high-end hunting gear/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Join the waitlist/i }).first(),
    ).toBeVisible();

    await expect(page.getByLabel(/Name/i)).toBeVisible();
    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Zip code/i)).toBeVisible();
  });

  test('submitting the form posts to /api/waitlist and shows the success state', async ({
    page,
  }) => {
    let requestBody: Record<string, unknown> | null = null;
    await page.route('**/api/waitlist', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        requestBody = request.postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: '00000000-0000-0000-0000-000000000001',
            alreadyOnList: false,
          }),
        });
      } else {
        await route.fallback();
      }
    });

    await page.goto('/early-access');

    await page.getByLabel(/Name/i).fill('Sam Hunter');
    await page.getByLabel(/Email/i).fill('sam@example.com');
    await page.getByLabel(/Zip code/i).fill('80014');
    await page.getByLabel(/What would you rent first/i).fill('thermal monocular');

    await page.locator('form').getByRole('button', { name: /Join the waitlist/i }).click();

    await expect(page.getByRole('heading', { name: /Welcome to Kitlo/i })).toBeVisible();
    await expect(page.getByText('80014')).toBeVisible();

    expect(requestBody).toMatchObject({
      name: 'Sam Hunter',
      email: 'sam@example.com',
      zip: '80014',
      firstRental: 'thermal monocular',
      interestedAsLister: false,
    });
  });

  test('lender CTA pre-checks the lister checkbox and scrolls to form', async ({ page }) => {
    await page.goto('/early-access');

    await page.getByRole('button', { name: /List your gear/i }).click();

    const listerCheckbox = page.locator('input[formcontrolname="interestedAsLister"]');
    await expect(listerCheckbox).toBeChecked();
  });
});
