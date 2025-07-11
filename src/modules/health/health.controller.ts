import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthStatusDto } from '../../types/modules/health/health-status.dto';
import { HealthStatus } from '../../types/modules/health/health-status';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get('/')
  @ApiOperation({ description: 'Get health status' })
  @ApiOkResponse({ description: 'Health status', type: HealthStatusDto })
  async getHealth() {
    return new HealthStatusDto({
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      status: HealthStatus.Online,
      description: process.env.npm_package_description,
      author: {
        name: process.env.npm_package_author_name,
        email: process.env.npm_package_author_email,
        url: process.env.npm_package_author_url,
      },
    });
  }
}
