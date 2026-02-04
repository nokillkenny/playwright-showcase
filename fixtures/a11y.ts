/**
 * Accessibility Fixture
 * 
 * Centralizes axe-core configuration so all a11y tests
 * use consistent rules and exclusions. In regulated
 * environments, this becomes the single source of truth
 * for compliance standards (WCAG 2.1 AA, Section 508, etc).
 */

import { test as base, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

type A11yFixtures = {
  makeAxeBuilder: () => AxeBuilder;
};

export const test = base.extend<A11yFixtures>({
  makeAxeBuilder: async ({ page }, use) => {
    await use(() => new AxeBuilder({ page }));
  },
});

export { expect };

export async function expectNoViolations(axeBuilder: AxeBuilder) {
  const results = await axeBuilder.analyze();
  expect(results.violations).toEqual([]);
}
