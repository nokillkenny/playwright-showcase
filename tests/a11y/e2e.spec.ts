/**
 * E2E Axe Audit
 * 
 * Runs axe-core at each step of a user flow to catch
 * violations that only appear in specific states.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('e2e flow passes axe audit at every state', async ({ page }) => {
  const audit = async (label: string) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .exclude('[data-testid="report-iframe"]')
      .analyze();
    console.log(`${label}: ${results.violations.length} violations`);
    results.violations.forEach(v => console.log(`  - ${v.id}: ${v.nodes.length} nodes`));
    return results.violations;
  };

  await page.goto('./');
  
  // Initial load (dark theme)
  expect(await audit('1. Initial load')).toEqual([]);
  
  // Toggle to light theme
  await page.getByTestId('theme-toggle').click();
  expect(await audit('2. Light theme')).toEqual([]);
  
  // Navigate to career
  await page.getByTestId('nav-career').click();
  expect(await audit('3. Career section')).toEqual([]);
  
  // Expand different job (accordion)
  await page.getByTestId('expand-2').click();
  expect(await audit('4. Job expanded')).toEqual([]);
  
  // Navigate to demos
  await page.getByTestId('nav-demos').click();
  expect(await audit('5. Demos section')).toEqual([]);
  
  // Open report viewer
  await page.locator('.link-btn[data-framework="playwright"]').click();
  await page.waitForTimeout(600);
  expect(await audit('6. Report viewer open')).toEqual([]);
  
  // Close report viewer
  await page.getByTestId('close-report').click();
  expect(await audit('7. Report viewer closed')).toEqual([]);
  
  // Trigger form validation errors
  await page.getByTestId('section-contact').scrollIntoViewIfNeeded();
  await page.getByRole('button', { name: 'Send' }).click();
  expect(await audit('8. Form with errors')).toEqual([]);
  
  // Fill form and submit
  await page.locator('#name').fill('Test');
  await page.locator('#email').fill('test@test.com');
  await page.getByRole('button', { name: 'Send' }).click();
  expect(await audit('9. Form submitted (toast visible)')).toEqual([]);
});
