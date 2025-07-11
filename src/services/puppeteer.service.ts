import { Injectable, Logger } from '@nestjs/common';
import { Browser, launch } from 'puppeteer';
import { puppeteerLaunchOptions } from '../config/puppeteer';
import { ENV } from '../config/env';

@Injectable()
export class PuppeteerService {
  public static readonly token = 'PUPPETEER_SERVICE';
  private readonly logger = new Logger(PuppeteerService.name);

  private browserLaunchPromise: Promise<Browser> | null = null;
  private browser: Browser | null = null;

  constructor() {
    // open browser on service initialization
    this.getBrowser();

    // close browser after a specified time of inactivity
    process.on('exit', () => {
      this.closeBrowser();
    });
  }

  /**
   * Gets the browser instance. Opens a new browser if no browser exists.
   * @returns {Browser} The browser instance.
   */
  public async getBrowser(): Promise<Browser> {
    if (this.browser) {
      return this.browser;
    }

    // lanch browser if not already launched
    if (!this.browserLaunchPromise) {
      this.logger.log('Launching browser...');
      this.browserLaunchPromise = launch(puppeteerLaunchOptions).then((browser) => {
        this.browser = browser;
        this.browserLaunchPromise = null; // Reset the promise after launch
        return browser;
      });
    }

    return this.browserLaunchPromise;
  }

  /**
   * Closes the browser after it has been unused for a specified time.
   */
  private async closeBrowser() {
    if (!this.browser) return;

    this.logger.log(
      `Browser unused for ${ENV.KEEP_BROWSER_OPEN_SECONDS} seconds. Closing browser...`,
    );
    await this.browser.close();

    this.logger.log('Browser closed.');
    this.browser = null;
  }
}
