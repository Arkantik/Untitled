import { Controller, Post, Param, Query, UseGuards, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { PublishingService } from './publishing.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

const retryQuery = z.object({ workspaceId: z.string().min(1) });

@ApiTags('Publishing')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('posts')
export class PublishingController {
  constructor(private readonly publishingService: PublishingService) {}

  @Post(':id/targets/:targetId/retry')
  @HttpCode(204)
  retry(
    @Param('id') postId: string,
    @Param('targetId') targetId: string,
    @Query(new ZodValidationPipe(retryQuery)) query: { workspaceId: string },
    @CurrentUser() user: { id: string },
  ) {
    return this.publishingService.retryTarget(postId, targetId, query.workspaceId, user.id);
  }
}
