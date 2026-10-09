import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
  type CreateWorkspaceInput,
  type UpdateWorkspaceInput,
  type InviteMemberInput,
  type UpdateMemberRoleInput,
} from '@veypost/shared';
import { WorkspacesService } from './workspaces.service.js';
import { WorkspaceMembersService } from './workspace-members.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { z } from 'zod';

const avatarSchema = z.object({
  data: z.string().min(1),
  mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),
});
type AvatarDto = z.infer<typeof avatarSchema>;

@ApiTags('Workspaces')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly workspacesService: WorkspacesService,
    private readonly membersService: WorkspaceMembersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body(new ZodValidationPipe(createWorkspaceSchema)) dto: CreateWorkspaceInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.workspacesService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.workspacesService.findAllForUser(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.workspacesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateWorkspaceSchema)) dto: UpdateWorkspaceInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.workspacesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.workspacesService.remove(id, user.id);
  }

  @Patch(':id/avatar')
  uploadAvatar(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(avatarSchema)) dto: AvatarDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.workspacesService.uploadAvatar(id, user.id, dto);
  }

  @Delete(':id/avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAvatar(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    await this.workspacesService.removeAvatar(id, user.id);
  }

  @Get(':id/members')
  listMembers(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.membersService.listMembers(id, user.id);
  }

  @Post(':id/members')
  @HttpCode(HttpStatus.CREATED)
  addMember(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(inviteMemberSchema)) dto: InviteMemberInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.membersService.addMember(id, user.id, dto);
  }

  @Patch(':id/members/:userId')
  updateMemberRole(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Body(new ZodValidationPipe(updateMemberRoleSchema)) dto: UpdateMemberRoleInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.membersService.updateMemberRole(id, user.id, userId, dto);
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.membersService.removeMember(id, user.id, userId);
  }
}
