import * as dotenv from 'dotenv';
import * as path from 'node:path';
import { cleanEnv, num, str } from 'envalid';
import { Logger } from '@nestjs/common';

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath, quiet: true });

/** App Environment */
export const ENV = cleanEnv(process.env, {
  PORT: num({ default: 3001 }),
  // db
  DATABASE_URL: str(),
  SHADOW_DATABASE_URL: str(),
  // auth
  API_TOKEN: str({
    default: null,
    desc: 'API Token to protect the API from unauthorized access.',
  }),
  DATA_KEEP_SECONDS: num({
    default: 60 * 60 * 24,
    desc: 'Number of seconds to keep created data in DB.',
  }), // 1 day
  PUPPETEER_TIMEOUT: num({
    default: 60 * 1000,
    desc: 'Timeout for Puppeteer operations in milliseconds.',
  }), // 1 minute
  KEEP_BROWSER_OPEN_SECONDS: num({
    default: 10,
    desc: 'Number of seconds to keep browser open after printing.',
  }),
});

// log environment variables to console if app was started in dev mode
if (ENV.isDev) {
  const logger = new Logger('ENV');
  // console.log('ENVIRONMENT VARIABLES:');
  for (const key of Object.keys(ENV)) {
    // logger.log(key, '=', ENV[key]);
    logger.debug(`${key} = ${ENV[key]}`);
  }
}
