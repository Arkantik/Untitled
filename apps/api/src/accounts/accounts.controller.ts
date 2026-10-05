import { Controller, Get, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { AccountsService } from './accounts.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

const workspaceQuery = z.object({ workspaceId: z.string().min(1) });
type WorkspaceQuery = z.infer<typeof workspaceQuery>;

@ApiTags('Connected Accounts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(workspaceQuery)) query: WorkspaceQuery,
    @CurrentUser() user: { id: string },
  ) {
    return this.accountsService.listAccounts(query.workspaceId, user.id);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(workspaceQuery)) query: WorkspaceQuery,
    @CurrentUser() user: { id: string },
  ) {
    return this.accountsService.removeAccount(id, query.workspaceId, user.id);
  }
}
