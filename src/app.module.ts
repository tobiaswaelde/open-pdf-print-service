import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { prismaModuleOptions } from './config/db';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    PrismaModule.forRoot(prismaModuleOptions),
    ScheduleModule.forRoot(),
    HealthModule,
    // modules
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
