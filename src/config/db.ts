import { Logger } from '@nestjs/common';
import { PrismaModuleOptions, loggingMiddleware } from 'nestjs-prisma';

export const prismaModuleOptions: PrismaModuleOptions = {
  isGlobal: true,

  prismaServiceOptions: {
    prismaOptions: {
      errorFormat: 'minimal',
    },
    middlewares: [
      loggingMiddleware({
        logger: new Logger('db'),
        logLevel: 'debug',
      }),
    ],
  },
};
