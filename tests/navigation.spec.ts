/**
 * Navigation Tests
 * 
 * Uses POM fixtures to demonstrate scalable test architecture.
 * In a growing test suite, this pattern prevents selector
 * duplication and makes refactoring safer.
 */

import { test, expect } from '../fixtures/test';

test.describe('navigation', () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.goto();
  });

  test('loads homepage with sidebar', async ({ basePage }) => {
    await expect(basePage.sidebar).toBeVisible();
  });

  test('navigates between sections', async ({ basePage, page }) => {
    await basePage.navigateTo('career');
    await expect(page.getByTestId('section-career')).toBeInViewport();
    
    await basePage.navigateTo('demos');
    await expect(page.getByTestId('section-demos')).toBeInViewport();
  });

  test('scroll spy updates active section', async ({ basePage, page }) => {
    await page.getByTestId('section-career').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    expect(await basePage.getActiveSection()).toBe('career');
  });

  test('theme toggle switches themes', async ({ basePage }) => {
    const initial = await basePage.getTheme();
    await basePage.toggleTheme();
    expect(await basePage.getTheme()).not.toBe(initial);
  });

  test('external links have correct targets', async ({ basePage }) => {
    await expect(basePage.githubLink).toHaveAttribute('href', /github\.com\/nokillkenny/);
    await expect(basePage.linkedinLink).toHaveAttribute('href', /linkedin\.com\/in\/kenny-lin/);
  });
});

test.describe('back to top', () => {
  test('hidden on intro section', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByTestId('back-to-top')).toBeHidden();
  });

  test('visible at demos section', async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('nav-demos').click();
    await page.waitForTimeout(300);
    await expect(page.getByTestId('back-to-top')).toBeVisible();
  });

  test('scrolls to top on click', async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('nav-demos').click();
    await page.waitForTimeout(300);
    await page.getByTestId('back-to-top').click();
    await page.waitForTimeout(500);
    await expect(page.getByTestId('section-intro')).toBeInViewport();
  });
});
