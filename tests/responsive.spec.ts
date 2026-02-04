/**
 * Responsive Tests
 * 
 * Mobile viewport tests run in isolation via test.use().
 * This pattern scales better than conditional logic inside
 * tests when you need different viewports for different
 * test groups.
 */

import { test, expect } from '../fixtures/test';

test.describe('responsive - mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test.beforeEach(async ({ basePage }) => {
    await basePage.goto();
  });

  test('sidebar renders as bottom bar', async ({ basePage }) => {
    const box = await basePage.sidebar.boundingBox();
    expect(box?.y).toBeGreaterThan(500);
  });

  test('logo is hidden', async ({ page }) => {
    await expect(page.getByTestId('logo')).toBeHidden();
  });

  test('nav links are horizontal', async ({ basePage }) => {
    const links = await basePage.navLinks.all();
    const positions = await Promise.all(
      links.map(async (l) => (await l.boundingBox())?.y)
    );
    const unique = new Set(positions);
    expect(unique.size).toBe(1); // all same Y = horizontal
  });

  test('top bar icons visible', async ({ basePage }) => {
    await expect(basePage.githubLink).toBeVisible();
    await expect(basePage.linkedinLink).toBeVisible();
  });
});
