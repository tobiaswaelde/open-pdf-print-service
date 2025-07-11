import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaperFormatEnum } from './paper-format';
import { Transform, Type } from 'class-transformer';
import { MarginsDto } from './margins.dto';
import { transformBoolean } from '../../../util/transform';

export class PrintOptionsDto {
  @ApiProperty({ description: 'The URL of the page to print.' })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    description:
      'The page format. One of `letter`, `legal`, `tabloid`, `ledger`, `a0`, `a1`, `a2`, `a3`, `a4`, `a5`, `a6`. Default: `a4`',
  })
  @IsEnum(PaperFormatEnum)
  @IsOptional()
  format: PaperFormatEnum = PaperFormatEnum.A4;

  @ApiPropertyOptional({ description: 'If `true` the page will be printed in landscape mode.' })
  @IsBoolean()
  @Transform(transformBoolean)
  @IsOptional()
  landscape: boolean = false;

  @ApiPropertyOptional({ description: 'Custom page margins.' })
  @Type(() => MarginsDto)
  @IsOptional()
  margins: MarginsDto = { top: 0, bottom: 0, left: 0, right: 0 };

  @ApiPropertyOptional({
    description:
      'If `true`, display the default header and footer containing e.g. filename and timestamp.',
  })
  @IsBoolean()
  @Transform(transformBoolean)
  @IsOptional()
  displayHeaderFooter: boolean = true;

  @ApiPropertyOptional({ description: 'If `true`, backfground will be omitted.' })
  @IsBoolean()
  @Transform(transformBoolean)
  @IsOptional()
  omitBackground: boolean = false;

  @ApiPropertyOptional({ description: 'If `true`, background graphics will be printed.' })
  @IsBoolean()
  @Transform(transformBoolean)
  @IsOptional()
  printBackground: boolean = true;

  @ApiPropertyOptional({ description: 'Wait for the given selector until PDF generation starts.' })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  waitForSelector?: string;

  @ApiPropertyOptional({ description: 'If `true` the result will be the file content as Base64.' })
  @IsBoolean()
  @Transform(transformBoolean)
  @IsOptional()
  base64: boolean = false;

  @ApiPropertyOptional({
    description:
      'If set, the browser will attempt to download the file (only if `base64`=`false`).',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  filename?: string;
}
