import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service.js';

@Module({
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
