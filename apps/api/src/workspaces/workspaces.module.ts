import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller.js';
import { WorkspacesService } from './workspaces.service.js';
import { WorkspaceMembersService } from './workspace-members.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspaceMembersService],
  exports: [WorkspacesService, WorkspaceMembersService],
})
export class WorkspacesModule {}
