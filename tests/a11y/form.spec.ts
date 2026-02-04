/**
 * Contact Form A11y Tests
 * 
 * Tests form accessibility patterns:
 * - Label association via for/id
 * - Error messages with aria-describedby
 * - aria-invalid state on validation
 * - Live region toast announcement
 */

import { test, expect } from '@playwright/test';

test.describe('contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('section-contact').scrollIntoViewIfNeeded();
  });

  test('inputs have associated labels', async ({ page }) => {
    const nameInput = page.locator('#name');
    const nameLabel = page.locator('label[for="name"]');
    await expect(nameLabel).toBeVisible();
    await expect(nameInput).toBeVisible();

    const emailInput = page.locator('#email');
    const emailLabel = page.locator('label[for="email"]');
    await expect(emailLabel).toBeVisible();
    await expect(emailInput).toBeVisible();
  });

  test('required fields have aria-required', async ({ page }) => {
    await expect(page.locator('#name')).toHaveAttribute('aria-required', 'true');
    await expect(page.locator('#email')).toHaveAttribute('aria-required', 'true');
  });

  test('error messages use aria-describedby', async ({ page }) => {
    const nameInput = page.locator('#name');
    const describedBy = await nameInput.getAttribute('aria-describedby');
    expect(describedBy).toBe('name-error');
    
    const errorEl = page.locator(`#${describedBy}`);
    await expect(errorEl).toBeAttached();
  });

  test('validation shows errors with aria-invalid', async ({ page }) => {
    await page.getByRole('button', { name: 'Send' }).click();
    
    const nameInput = page.locator('#name');
    await expect(nameInput).toHaveAttribute('aria-invalid', 'true');
    
    const nameError = page.locator('#name-error');
    await expect(nameError).toBeVisible();
    await expect(nameError).toHaveRole('alert');
  });

  test('valid submission shows toast with aria-live', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.getByRole('button', { name: 'Send' }).click();
    
    const toast = page.getByTestId('toast');
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute('aria-live', 'polite');
    await expect(toast).toContainText('Demo only');
  });

  test('form clears after successful submission', async ({ page }) => {
    await page.locator('#name').fill('Test User');
    await page.locator('#email').fill('test@example.com');
    await page.getByRole('button', { name: 'Send' }).click();
    
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
  });
});

test.describe('contact form - mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('toast is visible above bottom nav', async ({ page }) => {
    await page.goto('./');
    await page.getByTestId('section-contact').scrollIntoViewIfNeeded();
    await page.locator('#name').fill('Test');
    await page.locator('#email').fill('test@test.com');
    await page.getByRole('button', { name: 'Send' }).click();
    
    const toast = page.getByTestId('toast');
    await expect(toast).toBeVisible();
    
    const toastBox = await toast.boundingBox();
    const sidebar = page.getByTestId('sidebar');
    const sidebarBox = await sidebar.boundingBox();
    
    // Toast should be above the bottom nav
    expect(toastBox!.y + toastBox!.height).toBeLessThan(sidebarBox!.y);
  });
});
