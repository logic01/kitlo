import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/search', name: 'search' },
  { path: '/auth/login', name: 'login' },
  { path: '/auth/signup', name: 'signup' },
  { path: '/server-error', name: '500 page' },
  { path: '/not-a-real-route', name: '404 page' },
];

for (const { path, name } of PAGES) {
  test(`${name} has no critical or serious axe violations`, async ({ page }) => {
    await page.goto(path);
    // Let the page settle (skeletons, lazy chunks).
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );

    if (blocking.length > 0) {
      const summary = blocking
        .map((v) => `  - [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`)
        .join('\n');
      console.log(`\nA11y violations on ${path}:\n${summary}\n`);
    }

    expect(blocking, `Critical/serious a11y violations on ${path}:\n${JSON.stringify(blocking, null, 2)}`).toEqual([]);
  });
}
