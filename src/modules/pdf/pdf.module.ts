import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PuppeteerService } from '../../services/puppeteer.service';

@Module({
  providers: [
    { provide: PdfService.token, useClass: PdfService },
    { provide: PuppeteerService.token, useClass: PuppeteerService },
  ],
  controllers: [PdfController],
})
export class PdfModule {}
