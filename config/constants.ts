/**
 * Test Configuration Constants
 * 
 * Centralized config enables:
 * - Single source of truth for URLs, viewports, selectors
 * - Easy CI overrides via env vars
 * - Type safety across specs
 */

export const BASE_URL = process.env.BASE_URL || 'https://nokillkenny.github.io/';

export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
} as const;

export const EXTERNAL_LINKS = {
  github: 'https://github.com/nokillkenny',
  linkedin: 'https://linkedin.com/in/kenny-lin',
} as const;

export const REPORT_URLS = {
  playwright: 'https://github.com/nokillkenny/playwright-showcase/',
  rubyCucumber: 'https://github.com/nokillkenny/rspec-capybara-page-object-example',
  codeceptjs: 'https://github.com/nokillkenny/codeceptjs-rest-bdd',
} as const;

export const SECTIONS = ['intro', 'career', 'demos'] as const;
export const FRAMEWORKS = ['playwright', 'ruby-cucumber', 'codeceptjs'] as const;
