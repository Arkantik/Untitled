import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { TokenRefreshService } from './token-refresh.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [TokenRefreshService],
})
export class SchedulingModule {}
