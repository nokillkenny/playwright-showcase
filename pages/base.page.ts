import { type Page, type Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly navLinks: Locator;
  readonly themeToggle: Locator;
  readonly githubLink: Locator;
  readonly linkedinLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.getByTestId('sidebar');
    this.navLinks = page.locator('.nav-link[data-section]');
    this.themeToggle = page.getByTestId('theme-toggle');
    this.githubLink = page.getByTestId('github-link');
    this.linkedinLink = page.getByTestId('linkedin-link');
  }

  async goto() {
    await this.page.goto('./');
  }

  async navigateTo(section: 'intro' | 'career' | 'demos') {
    await this.page.getByTestId(`nav-${section}`).click();
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async getTheme(): Promise<string> {
    return await this.page.locator('html').getAttribute('data-theme') || 'dark';
  }

  async getActiveSection(): Promise<string | null> {
    const active = this.page.locator('.nav-link[aria-current="true"]');
    return await active.getAttribute('data-section');
  }
}
