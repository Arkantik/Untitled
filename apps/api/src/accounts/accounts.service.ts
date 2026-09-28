import { Injectable, Inject, NotImplementedException } from '@nestjs/common';
import type { DbClient } from '@pulsarr/db';
import { assertAccountLimit } from '../workspaces/workspaces.helpers.js';

@Injectable()
export class AccountsService {
  constructor(@Inject('DB') private readonly db: DbClient) {}

  // Drizzle's dialect union can't be narrowed to a single schema; cast once here.
  private get q() { return this.db as any; }

  async createConnectedAccount(workspaceId: string, _userId: string): Promise<never> {
    await assertAccountLimit(this.q, workspaceId);
    throw new NotImplementedException('Connected account creation is not yet implemented');
  }
}
