/**
 * Custom Test Fixtures
 * 
 * Why fixtures over direct instantiation?
 * - Automatic cleanup/teardown
 * - Consistent setup across all specs
 * - Easy to add cross-cutting concerns (logging, screenshots)
 * - Enables parallel test isolation
 * 
 * In larger codebases, fixtures become the contract between
 * test infrastructure and test authors.
 */

import { test as base } from '@playwright/test';
import { BasePage } from '../pages/base.page';
import { DemosPage } from '../pages/demos.page';

type Fixtures = {
  basePage: BasePage;
  demosPage: DemosPage;
};

export const test = base.extend<Fixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
  demosPage: async ({ page }, use) => {
    const demosPage = new DemosPage(page);
    await use(demosPage);
  },
});

export { expect } from '@playwright/test';
