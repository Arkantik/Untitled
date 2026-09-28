import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { AccountsService } from './accounts.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

const createAccountSchema = z.object({ workspaceId: z.string().min(1) });
type CreateAccountInput = z.infer<typeof createAccountSchema>;

@ApiTags('Connected Accounts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createAccountSchema)) dto: CreateAccountInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.accountsService.createConnectedAccount(dto.workspaceId, user.id);
  }
}
