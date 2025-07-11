import { Controller, Get, Inject, Query, Res, StreamableFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { TokenAuthGuard } from '../../guards/token-auth.guard';
import { PdfService } from './pdf.service';
import { ApiUnauthorizedResponses } from '../../decorators/api-unauthorized-responses.decorator';
import { PrintOptionsDto } from '../../types/modules/pdf/print-options.dto';
import { Response } from 'express';

@ApiTags('pdf')
@ApiBearerAuth()
@ApiUnauthorizedResponses({
  messages: ['Access denied. No token provided.', 'Access denied. Invalid token.'],
})
@Controller('pdf')
@UseGuards(TokenAuthGuard)
export class PdfController {
  constructor(@Inject(PdfService.token) private readonly pdfService: PdfService) {}

  @Get('/')
  @ApiInternalServerErrorResponse({ description: 'Error while generating PDF.' })
  async generatePdf(@Query() options: PrintOptionsDto, @Res({ passthrough: true }) res: Response) {
    // generate PDF buffer
    const buffer = await this.pdfService.createPdf(options);

    // output file as base64
    if (options.base64) {
      return buffer.toString('base64');
    }

    // output file as raw string
    res.set({ 'Content-Type': 'application/pdf' });
    if (options.filename) {
      // if filename is provided, set content-disposition header to allow browser to download the file
      const escapedFilename = options.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
      res.set({ 'Content-disposition': `attachment; filename="${escapedFilename}.pdf"` });
    }
    return new StreamableFile(buffer);
  }
}
