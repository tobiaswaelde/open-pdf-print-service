import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PuppeteerService } from '../../services/puppeteer.service';
import { PrintOptionsDto } from '../../types/modules/pdf/print-options.dto';

@Injectable()
export class PdfService {
  public static readonly token = 'PDF_SERVICE';
  private readonly logger = new Logger(PdfService.name);

  constructor(
    @Inject(PuppeteerService.token) private readonly puppeteerService: PuppeteerService,
  ) {}

  /**
   * Create PDF buffer from given URL with given options.
   * @throws {InternalServerErrorException} Error while generating PDF.
   */
  public async createPdf(options: PrintOptionsDto): Promise<Buffer> {
    console.time('Generate PDF');
    try {
      this.logger.log('Generating PDF...');

      const browser = await this.puppeteerService.getBrowser();
      const page = await browser.newPage();

      // if `waitForSelector` is provided, wait for the selector before generating PDF
      if (options.waitForSelector) {
        await page.waitForSelector(options.waitForSelector);
      }

      // navigate to the given URL
      const url = decodeURI(options.url);
      await page.goto(url, { waitUntil: 'networkidle0' });

      // print page to PDF
      const buffer = await page.pdf({
        format: options.format,
        landscape: options.landscape,
        margin: options.margins,
        displayHeaderFooter: options.displayHeaderFooter,
        omitBackground: options.omitBackground,
        printBackground: options.printBackground,
      });

      // close page
      await page.close();

      console.timeEnd('Generate PDF');
      return Buffer.from(buffer);
    } catch (err) {
      this.logger.error(`Error while generating PDF: ${err.message}`);
      throw new InternalServerErrorException('Error while generating PDF.');
    }
  }
}
