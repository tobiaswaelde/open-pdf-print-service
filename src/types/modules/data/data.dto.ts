import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { DataPayload } from '.';
import { JsonValue } from '@prisma/client/runtime/library';

export class DataDto {
  @ApiProperty() id: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() deleteAfterUse: boolean;
  @ApiProperty() json: JsonValue;

  constructor(partial: Partial<DataDto>) {
    Object.assign(this, partial);
  }

  public static fromModel(model: DataPayload): DataDto {
    if (!model) return null;
    return new DataDto({ ...model });
  }
}
