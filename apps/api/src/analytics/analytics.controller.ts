import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { AnalyticsService } from './analytics.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

const workspaceQuery = z.object({ workspaceId: z.string().min(1) });
type WorkspaceQuery = z.infer<typeof workspaceQuery>;

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('platform-summary')
  platformSummary(
    @Query(new ZodValidationPipe(workspaceQuery)) query: WorkspaceQuery,
    @CurrentUser() user: { id: string },
  ) {
    return this.analyticsService.getPlatformSummary(query.workspaceId, user.id);
  }
}
