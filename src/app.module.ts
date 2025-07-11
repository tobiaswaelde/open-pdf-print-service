import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { prismaModuleOptions } from './config/db';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './modules/health/health.module';
import { DataModule } from './modules/data/data.module';
import { PdfModule } from './modules/pdf/pdf.module';

@Module({
  imports: [
    PrismaModule.forRoot(prismaModuleOptions),
    ScheduleModule.forRoot(),
    HealthModule,
    // modules
    DataModule,
    PdfModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
