import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { DashboardService } from './dashboard.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

const summaryQuerySchema = z.object({
  workspaceId: z.string().min(1),
});
type SummaryQuery = z.infer<typeof summaryQuerySchema>;

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  getSummary(
    @Query(new ZodValidationPipe(summaryQuerySchema)) query: SummaryQuery,
    @CurrentUser() user: { id: string },
  ) {
    return this.dashboardService.getSummary(query.workspaceId, user.id);
  }
}
