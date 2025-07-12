import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { DataService } from './data.service';
import { CreateDataDto } from '../../types/modules/data/create-data.dto';
import { DataDto } from '../../types/modules/data/data.dto';
import { ApiUnauthorizedResponses } from '../../decorators/api-unauthorized-responses.decorator';
import { TokenAuthGuard } from '../../guards/token-auth.guard';
import { ApiNotFoundResponses } from '../../decorators/api-not-found-responses.decorator';
import { DataCreatedDto } from '../../types/modules/data/data-created.dto';

@ApiTags('data')
@ApiBearerAuth()
@ApiUnauthorizedResponses({
  description: 'Unauthorized',
  messages: ['Access denied. No token provided.', 'Access denied. Invalid token.'],
})
@Controller('data')
@UseGuards(TokenAuthGuard)
export class DataController {
  constructor(@Inject(DataService.token) private readonly dataService: DataService) {}

  @Post('/')
  @ApiOperation({
    summary: 'Create new data entry',
    description:
      'This method accepts any data type, serializes it to JSON, and stores it in the database. It returns the created data entry.',
  })
  @ApiCreatedResponse({ description: 'Data entry created successfully.', type: DataCreatedDto })
  async create(@Body() data: CreateDataDto) {
    const item = await this.dataService.create(data);
    return DataCreatedDto.fromModel(item);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Find data by ID',
    description:
      'Returns the data entry with the specified ID. If the data is marked for deletion after use, if will be deleted.',
  })
  @ApiOkResponse({ description: 'Data entry found successfully.', type: DataDto })
  @ApiNotFoundResponses({ messages: ['Data with id ${id} not found.'] })
  async find(@Param('id', ParseUUIDPipe) id: string) {
    const item = await this.dataService.find(id);
    return DataDto.fromModel(item);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete data by ID',
    description: 'Deletes the data entry with the specified ID and returns the deleted data.',
  })
  @ApiNotFoundResponses({ messages: ['Data with id ${id} not found.'] })
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    const item = await this.dataService.delete(id);
    return DataDto.fromModel(item);
  }
}
