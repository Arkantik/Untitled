import {
  Controller, Get, Patch, Delete,
  Body, Req, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import type { FastifyRequest } from 'fastify';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';
import { passwordSchema } from '@veypost/shared';
import { UsersService } from './users.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';

const updateProfileSchema = z.object({ name: z.string().min(1).max(255) }).partial();

const avatarSchema = z.object({
  data: z.string().min(1),
  mimetype: z.enum(['image/jpeg', 'image/png', 'image/webp']),
});
type AvatarDto = z.infer<typeof avatarSchema>;

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

const notificationsSchema = z.object({
  postPublished: z.boolean(),
  workspaceActivity: z.boolean(),
});

type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
type NotificationsDto = z.infer<typeof notificationsSchema>;

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: { id: string }) {
    return this.usersService.findMe(user.id);
  }

  @Patch('me')
  updateProfile(
    @Body(new ZodValidationPipe(updateProfileSchema)) dto: UpdateProfileDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('me/avatar')
  uploadAvatar(
    @Body(new ZodValidationPipe(avatarSchema)) dto: AvatarDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.usersService.uploadAvatar(user.id, dto);
  }

  @Delete('me/avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAvatar(@CurrentUser() user: { id: string }) {
    await this.usersService.removeAvatar(user.id);
  }

  @Patch('me/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changePassword(
    @Body(new ZodValidationPipe(changePasswordSchema)) dto: ChangePasswordDto,
    @Req() req: FastifyRequest,
  ) {
    await this.usersService.changePassword(dto, req);
  }

  @Patch('me/notifications')
  updateNotifications(
    @Body(new ZodValidationPipe(notificationsSchema)) dto: NotificationsDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.usersService.updateNotifications(user.id, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(
    @CurrentUser() user: { id: string },
    @Req() req: FastifyRequest,
  ) {
    await this.usersService.deleteAccount(user.id, req);
  }
}
