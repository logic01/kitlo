import { expect, test } from '@playwright/test';

test('404 page renders for unknown routes', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { name: /Trail's gone cold/i })).toBeVisible();
});

test('500 page is reachable directly', async ({ page }) => {
  await page.goto('/server-error');
  await expect(page.getByRole('heading', { name: /Something broke/i })).toBeVisible();
});

test('forbidden page is reachable', async ({ page }) => {
  await page.goto('/forbidden');
  await expect(page.getByRole('heading', { name: /No access/i })).toBeVisible();
});
