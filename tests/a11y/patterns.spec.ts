/**
 * A11y Pattern Tests
 * 
 * Tests accessibility patterns holistically rather than
 * individual locators. Uses axe-core for automated checks
 * plus manual pattern verification.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('a11y patterns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('all interactive elements are keyboard accessible', async ({ page }) => {
    const interactives = page.locator('a:visible, button:visible, input:visible, textarea:visible');
    const count = await interactives.count();
    
    for (let i = 0; i < Math.min(count, 15); i++) { // Sample
      const el = interactives.nth(i);
      await el.focus();
      await expect(el).toBeFocused();
    }
  });

  test('all images have alt text or are decorative', async ({ page }) => {
    const images = page.locator('img, svg');
    const count = await images.count();
    
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const hasAlt = await img.getAttribute('alt');
      const isHidden = await img.getAttribute('aria-hidden');
      const role = await img.getAttribute('role');
      
      // Must have alt, aria-hidden="true", or role="presentation"
      expect(
        hasAlt !== null || isHidden === 'true' || role === 'presentation',
        `Image ${i} missing alt or aria-hidden`
      ).toBe(true);
    }
  });

  test('form inputs have associated labels', async ({ page }) => {
    const inputs = page.locator('input:not([type="hidden"]), textarea, select');
    const count = await inputs.count();
    
    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        expect(
          hasLabel || ariaLabel || ariaLabelledby,
          `Input ${id} missing label`
        ).toBeTruthy();
      }
    }
  });

  test('buttons have accessible names', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const btn = buttons.nth(i);
      if (await btn.isVisible()) {
        const text = await btn.textContent();
        const ariaLabel = await btn.getAttribute('aria-label');
        expect(
          (text && text.trim()) || ariaLabel,
          `Button ${i} missing accessible name`
        ).toBeTruthy();
      }
    }
  });

  test('links have discernible text', async ({ page }) => {
    const links = page.locator('a[href]');
    const count = await links.count();
    
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      if (await link.isVisible()) {
        const text = await link.textContent();
        const ariaLabel = await link.getAttribute('aria-label');
        expect(
          (text && text.trim()) || ariaLabel,
          `Link ${i} missing discernible text`
        ).toBeTruthy();
      }
    }
  });

  test('expandable elements have aria-expanded', async ({ page }) => {
    const expandables = page.locator('[aria-controls]');
    const count = await expandables.count();
    
    for (let i = 0; i < count; i++) {
      const el = expandables.nth(i);
      const expanded = await el.getAttribute('aria-expanded');
      expect(expanded, `Element ${i} with aria-controls missing aria-expanded`).not.toBeNull();
      
      const controlsId = await el.getAttribute('aria-controls');
      const target = page.locator(`#${controlsId}`);
      await expect(target, `aria-controls target ${controlsId} not found`).toBeAttached();
    }
  });

  test('page has no axe violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // Light theme accent is readable but fails strict ratio
      .exclude('[data-testid="report-iframe"]')
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('color contrast meets WCAG AA', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .exclude('[data-testid="report-iframe"]')
      .analyze();
    
    const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
    expect(contrastViolations).toEqual([]);
  });

  test('focus is visible on all interactive elements', async ({ page }) => {
    const interactives = page.locator('a:visible, button:visible');
    const count = await interactives.count();
    
    for (let i = 0; i < Math.min(count, 10); i++) { // Sample first 10
      const el = interactives.nth(i);
      await el.focus();
      
      // Check for visible focus indicator (box-shadow or outline)
      const styles = await el.evaluate(e => {
        const computed = window.getComputedStyle(e);
        return {
          outline: computed.outline,
          boxShadow: computed.boxShadow,
        };
      });
      
      const hasFocusStyle = 
        (styles.outline && styles.outline !== 'none') ||
        (styles.boxShadow && styles.boxShadow !== 'none');
      
      expect(hasFocusStyle, `Element ${i} missing visible focus indicator`).toBe(true);
    }
  });
});
