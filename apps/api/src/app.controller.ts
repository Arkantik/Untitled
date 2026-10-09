import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { APP_NAME } from '@veypost/shared';
import { Public } from './auth/public.decorator.js';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Health check' })
  health() {
    return {
      status: 'ok',
      name: APP_NAME,
      timestamp: new Date().toISOString(),
    };
  }
}
