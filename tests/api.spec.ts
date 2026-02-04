/**
 * API Health Check Tests
 * 
 * Validates external dependencies are reachable.
 * Useful for catching broken links before users do,
 * and verifying report URLs after CI publishes them.
 */

import { test, expect } from '@playwright/test';
import { EXTERNAL_LINKS, REPORT_URLS } from '../config/constants';

test.describe('API health checks', () => {
  test.describe('external links', () => {
    for (const [name, url] of Object.entries(EXTERNAL_LINKS)) {
      test(`${name} is reachable`, async ({ request }) => {
        const response = await request.get(url); // GET, not HEAD (LinkedIn blocks HEAD)
        expect(response.status()).toBeLessThan(400);
      });
    }
  });

  test.describe('report URLs', () => {
    for (const [name, url] of Object.entries(REPORT_URLS)) {
      test(`${name} reports accessible`, async ({ request }) => {
        const response = await request.head(url);
        expect([200, 404]).toContain(response.status()); // 404 ok if not yet published
      });
    }
  });

  test('all page links return valid responses', async ({ page, request }) => {
    await page.goto('./');
    const hrefs = await page.locator('a[href^="http"]').evaluateAll(
      els => [...new Set(els.map(e => e.getAttribute('href')))]
    );
    for (const url of hrefs) {
      const response = await request.head(url!);
      expect(response.status(), `${url}`).toBeLessThan(500);
    }
  });
});
