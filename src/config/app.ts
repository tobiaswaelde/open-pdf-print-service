import { Logger } from '@nestjs/common';
import { ENV } from './env';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';

const logger = new Logger('APP');
if (ENV.isProduction) {
  logger.localInstance.setLogLevels(['fatal', 'error', 'warn', 'log']);
}

export const appOptions: NestApplicationOptions = {
  bufferLogs: true,
  logger: logger,
};
