import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JsonValue } from '@prisma/client/runtime/library';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateDataDto {
  @ApiProperty()
  @IsNotEmpty()
  json: JsonValue;

  @ApiPropertyOptional()
  @IsBoolean()
  deleteAfterUse?: boolean = true;
}
