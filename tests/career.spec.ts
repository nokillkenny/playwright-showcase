/**
 * Career Section A11y Tests
 * 
 * Tests specific a11y patterns:
 * - Table semantics with proper headers
 * - Expandable rows with aria-expanded
 * - Keyboard navigation
 */

import { test, expect } from '../fixtures/test';

test.describe('career section', () => {
  test.beforeEach(async ({ basePage }) => {
    await basePage.goto();
    await basePage.navigateTo('career');
  });

  test('career table has proper structure', async ({ page }) => {
    const table = page.getByTestId('career-table');
    await expect(table).toBeVisible();
    
    // Headers exist (visually hidden but accessible)
    const headers = table.locator('th');
    await expect(headers).toHaveCount(4);
  });

  test('first job is expanded by default', async ({ page }) => {
    const btn = page.getByTestId('expand-0');
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('career-detail-0')).toBeVisible();
  });

  test('career rows are keyboard accessible', async ({ page }) => {
    const expandBtn = page.getByTestId('expand-1');
    await expandBtn.focus();
    await expect(expandBtn).toBeFocused();
    
    await page.keyboard.press('Enter');
    await expect(expandBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('career-detail-1')).toBeVisible();
  });

  test('accordion - only one detail open at a time', async ({ page }) => {
    // First is open by default
    await expect(page.getByTestId('expand-0')).toHaveAttribute('aria-expanded', 'true');
    
    // Click second
    await page.getByTestId('expand-1').click();
    
    // Second open, first closed
    await expect(page.getByTestId('expand-1')).toHaveAttribute('aria-expanded', 'true');
    await expect(page.getByTestId('expand-0')).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('career-detail-1')).toBeVisible();
    await expect(page.getByTestId('career-detail-0')).toBeHidden();
  });

  test('clicking open row closes it', async ({ page }) => {
    const btn = page.getByTestId('expand-0');
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByTestId('career-detail-0')).toBeHidden();
  });

  test('expanded detail has aria-controls relationship', async ({ page }) => {
    const btn = page.getByTestId('expand-0');
    const controlsId = await btn.getAttribute('aria-controls');
    expect(controlsId).toBe('detail-0');
    
    const detail = page.locator(`#${controlsId}`);
    await expect(detail).toBeAttached();
  });
});
