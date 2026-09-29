import { z } from 'zod';

const slugPattern = /^[a-z0-9-]+$/;

export const createWorkspaceSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(50).regex(slugPattern).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(50).regex(slugPattern).optional(),
  timezone: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().optional().nullable(),
});

export const inviteMemberSchema = z.object({
  email: z.email(),
  role: z.enum(['admin', 'editor', 'viewer']).optional().default('editor'),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'editor', 'viewer']),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
