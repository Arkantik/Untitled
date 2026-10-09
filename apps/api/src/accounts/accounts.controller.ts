import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards, Redirect, HttpCode } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { connectDiscordSchema, connectBlueskySchema, confirmPagesSchema } from '@veypost/shared';
import { AccountsService } from './accounts.service.js';
import { AccountsOAuthService } from './accounts.oauth.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { Public } from '../auth/public.decorator.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { peekOAuthState, popOAuthState } from './oauth-state.store.js';
import { getEnv } from '../config/env.js';

const workspaceQuery = z.object({ workspaceId: z.string().min(1) });
type WorkspaceQuery = z.infer<typeof workspaceQuery>;

@ApiTags('Connected Accounts')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly oauthService: AccountsOAuthService,
  ) {}

  @Get()
  list(
    @Query(new ZodValidationPipe(workspaceQuery)) query: WorkspaceQuery,
    @CurrentUser() user: { id: string },
  ) {
    return this.accountsService.listAccounts(query.workspaceId, user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(workspaceQuery)) query: WorkspaceQuery,
    @CurrentUser() user: { id: string },
  ) {
    return this.accountsService.removeAccount(id, query.workspaceId, user.id);
  }

  @Post('connect/discord')
  @HttpCode(204)
  async connectDiscord(
    @Body(new ZodValidationPipe(connectDiscordSchema)) body: { workspaceId: string; webhookUrl: string },
    @CurrentUser() user: { id: string },
  ) {
    await this.accountsService.connectDiscord(body.workspaceId, user.id, body.webhookUrl);
  }

  @Post('connect/bluesky')
  @HttpCode(204)
  async connectBluesky(
    @Body(new ZodValidationPipe(connectBlueskySchema)) body: { workspaceId: string; handle: string; appPassword: string },
    @CurrentUser() user: { id: string },
  ) {
    await this.accountsService.connectBluesky(body.workspaceId, user.id, body.handle, body.appPassword);
  }

  @Get('connect/:platform')
  @Redirect('', 302)
  async initiateOAuth(
    @Param('platform') platform: string,
    @Query('workspaceId') workspaceId: string,
    @CurrentUser() user: { id: string },
  ) {
    const url = await this.oauthService.initiateOAuth(platform, workspaceId, user.id);
    return { url };
  }

  @Post(':id/refresh')
  @HttpCode(204)
  async refreshAccount(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(workspaceQuery)) query: WorkspaceQuery,
    @CurrentUser() user: { id: string },
  ) {
    await this.oauthService.refreshAccount(id, query.workspaceId, user.id);
  }

  @Get('pending/:token')
  listPendingPages(
    @Param('token') token: string,
    @Query(new ZodValidationPipe(workspaceQuery)) query: WorkspaceQuery,
    @CurrentUser() user: { id: string },
  ) {
    return this.oauthService.listPendingPages(token, query.workspaceId, user.id);
  }

  @Post('pending/:token')
  @HttpCode(204)
  async confirmPendingPages(
    @Param('token') token: string,
    @Query(new ZodValidationPipe(workspaceQuery)) query: WorkspaceQuery,
    @Body(new ZodValidationPipe(confirmPagesSchema)) body: { selectedIds: string[] },
    @CurrentUser() user: { id: string },
  ) {
    await this.oauthService.confirmPendingPages(token, query.workspaceId, user.id, body.selectedIds);
  }

  @Get('callback/:platform')
  @Public()
  @Redirect('', 302)
  async oauthCallback(
    @Param('platform') platform: string,
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') oauthError: string | undefined,
  ) {
    const { APP_URL } = getEnv();
    const ctx = state ? peekOAuthState(state) : null;
    const base = ctx ? `${APP_URL}/workspace/${ctx.workspaceId}/accounts` : APP_URL;

    if (oauthError || !code || !state) {
      if (state) popOAuthState(state);
      return { url: `${base}?error=connect_cancelled` };
    }

    try {
      const result = await this.oauthService.handleOAuthCallback(platform, code, state);
      const accountsBase = `${APP_URL}/workspace/${result.workspaceId}/accounts`;
      if (result.pendingToken) {
        return { url: `${accountsBase}?pick=${result.pendingToken}&platform=${platform}` };
      }
      return { url: `${accountsBase}?connected=${platform}` };
    } catch {
      return { url: `${base}?error=connect_failed` };
    }
  }
}
