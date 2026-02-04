/**
 * Demos Section Tests
 * 
 * DemosPage encapsulates report viewer interactions.
 * If the iframe implementation changes, only the page
 * object needs updating—not every test.
 */

import { test, expect } from '../fixtures/test';

test.describe('demos section', () => {
  test.beforeEach(async ({ demosPage }) => {
    await demosPage.goto();
    await demosPage.navigateTo('demos');
  });

  test('displays framework cards', async ({ demosPage }) => {
    await expect(demosPage.frameworkCards).toHaveCount(3);
    await expect(demosPage.getCard('playwright')).toBeVisible();
    await expect(demosPage.getCard('ruby-cucumber')).toBeVisible();
    await expect(demosPage.getCard('codeceptjs')).toBeVisible();
  });

  test('opens report viewer on click', async ({ demosPage, page }) => {
    await demosPage.openReports('playwright');
    await expect(demosPage.reportViewer).toBeVisible();
    
    // Wait for async fetch, then either iframe or fallback visible
    await page.waitForTimeout(500);
    const iframeVisible = await page.getByTestId('report-iframe').isVisible();
    const fallbackVisible = await page.getByTestId('report-fallback').isVisible();
    expect(iframeVisible || fallbackVisible).toBe(true);
  });

  test('closes report viewer', async ({ demosPage }) => {
    await demosPage.openReports('playwright');
    await demosPage.closeReports();
    await expect(demosPage.reportViewer).toBeHidden();
  });

  test('iframe has sandbox for security', async ({ demosPage }) => {
    await demosPage.openReports('playwright');
    const sandbox = await demosPage.getIframeSandbox();
    expect(sandbox).toContain('allow-scripts');
    expect(sandbox).toContain('allow-same-origin');
    expect(sandbox).not.toContain('allow-forms');
  });

  test('repo links point to github', async ({ demosPage }) => {
    for (const fw of ['playwright', 'ruby-cucumber', 'codeceptjs']) {
      const repoLink = demosPage.getCard(fw).locator('a');
      await expect(repoLink).toHaveAttribute('href', /github\.com\/nokillkenny/);
    }
  });
});
