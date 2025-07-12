import { ApiProperty } from '@nestjs/swagger';
import { DataPayload } from '.';

export class DataCreatedDto {
  @ApiProperty() id: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() deleteAfterUse: boolean;

  constructor(partial: Partial<DataCreatedDto>) {
    Object.assign(this, partial);
  }

  public static fromModel(model: DataPayload): DataCreatedDto {
    if (!model) return null;
    return new DataCreatedDto({ ...model });
  }
}
