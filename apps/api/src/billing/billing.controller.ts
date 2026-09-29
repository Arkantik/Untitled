import {
  Controller,
  Post,
  Body,
  Req,
  Headers,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { FastifyRequest } from 'fastify';
import {
  checkoutSchema,
  portalSchema,
  type CheckoutInput,
  type PortalInput,
} from '@pulsarr/shared';
import { BillingService } from './billing.service.js';
import { BillingWebhookService } from './billing.webhook.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/session.decorator.js';
import { ZodValidationPipe } from '../common/zod-validation.pipe.js';
import { Public } from '../auth/public.decorator.js';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(
    private readonly billingService: BillingService,
    private readonly webhookService: BillingWebhookService,
  ) {}

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  startCheckout(
    @Body(new ZodValidationPipe(checkoutSchema)) dto: CheckoutInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.billingService.startCheckout(user.id, dto);
  }

  @Post('portal')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  openPortal(
    @Body(new ZodValidationPipe(portalSchema)) dto: PortalInput,
    @CurrentUser() user: { id: string },
  ) {
    return this.billingService.openPortal(user.id, dto);
  }

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  webhook(
    @Req() req: FastifyRequest & { rawBody?: Buffer },
    @Headers('stripe-signature') sig: string,
  ) {
    const body = req.rawBody ?? Buffer.from(JSON.stringify(req.body ?? {}));
    return this.webhookService.handleWebhook(body, sig ?? '');
  }
}
