import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Validate } from 'class-validator';
import { IsNumberOrString } from '../../../validators/number-or-string';

export class MarginsDto {
  @ApiPropertyOptional() @Validate(IsNumberOrString) @IsOptional() top?: string | number;
  @ApiPropertyOptional() @Validate(IsNumberOrString) @IsOptional() bottom?: string | number;
  @ApiPropertyOptional() @Validate(IsNumberOrString) @IsOptional() left?: string | number;
  @ApiPropertyOptional() @Validate(IsNumberOrString) @IsOptional() right?: string | number;
}
