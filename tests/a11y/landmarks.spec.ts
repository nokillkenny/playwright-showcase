/**
 * Skip Link & Landmark Tests
 * 
 * Tests navigation accessibility:
 * - Skip link functionality
 * - Landmark regions
 */

import { test, expect } from '@playwright/test';

test.describe('skip link', () => {
  test('skip link exists and targets main', async ({ page }) => {
    await page.goto('./');
    const skipLink = page.getByTestId('skip-link');
    await expect(skipLink).toHaveAttribute('href', '#main');
  });

  test('skip link becomes visible on focus', async ({ page }) => {
    await page.goto('./');
    const skipLink = page.getByTestId('skip-link');
    
    await skipLink.focus();
    await expect(skipLink).toBeFocused();
    // CSS :focus moves it into view
    await expect(skipLink).toBeInViewport();
  });

  test('skip link navigates to main', async ({ page }) => {
    await page.goto('./');
    const skipLink = page.getByTestId('skip-link');
    await skipLink.focus();
    await skipLink.click();
    
    // URL should have #main
    expect(page.url()).toContain('#main');
  });
});

test.describe('landmarks', () => {
  test('page has main landmark', async ({ page }) => {
    await page.goto('./');
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
  });

  test('page has navigation landmarks', async ({ page }) => {
    await page.goto('./');
    const navs = page.getByRole('navigation');
    await expect(navs).toHaveCount(2); // sidebar + top-bar
  });

  test('navigation landmarks have labels', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('navigation', { name: 'Main sections' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Social links' })).toBeVisible();
  });
});
