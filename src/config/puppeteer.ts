import { LaunchOptions } from 'puppeteer';
import { ENV } from './env';

/**
 * Puppeteer launch options configuration.
 */
export const puppeteerLaunchOptions: LaunchOptions = {
  args: ['--no-sandbox'],
  headless: true, // browser should start in headless mode
  executablePath: ENV.isProd ? '/usr/bin/chromium' : undefined,
  timeout: ENV.PUPPETEER_TIMEOUT,
};
