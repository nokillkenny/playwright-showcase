/**
 * Demos Page Object
 * 
 * Extends BasePage for section-specific interactions.
 * Encapsulates report viewer logic that would otherwise
 * be duplicated across multiple specs.
 */

import { type Page, type Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DemosPage extends BasePage {
  readonly section: Locator;
  readonly frameworkCards: Locator;
  readonly reportViewer: Locator;
  readonly reportIframe: Locator;
  readonly closeReportBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.section = page.getByTestId('section-demos');
    this.frameworkCards = page.locator('.framework-card');
    this.reportViewer = page.getByTestId('report-viewer');
    this.reportIframe = page.getByTestId('report-iframe');
    this.closeReportBtn = page.getByTestId('close-report');
  }

  async openReports(framework: 'playwright' | 'ruby-cucumber' | 'codecept') {
    const card = this.page.getByTestId(`card-${framework}`);
    await card.locator('.link-btn').click();
  }

  async closeReports() {
    await this.closeReportBtn.click();
  }

  async getIframeSrc(): Promise<string | null> {
    return await this.reportIframe.getAttribute('src');
  }

  async getIframeSandbox(): Promise<string | null> {
    return await this.reportIframe.getAttribute('sandbox');
  }

  getCard(framework: string): Locator {
    return this.page.getByTestId(`card-${framework}`);
  }
}
