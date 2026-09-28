import { z } from 'zod';

export const checkoutSchema = z.object({
  workspaceId: z.string().min(1),
  plan: z.enum(['free', 'pro']),
});

export const portalSchema = z.object({
  workspaceId: z.string().min(1),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type PortalInput = z.infer<typeof portalSchema>;
