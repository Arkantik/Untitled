import { Module } from '@nestjs/common';
import { getEnv } from '../config/env.js';
import { DatabaseModule } from '../database/database.module.js';
import { STRIPE_GATEWAY } from './stripe/stripe-gateway.interface.js';
import { StripeGatewayImpl } from './stripe/stripe.gateway.js';
import { FakeStripeGateway } from './stripe/fake-stripe.gateway.js';
import { BillingService } from './billing.service.js';
import { BillingWebhookService } from './billing.webhook.service.js';
import { BillingController } from './billing.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [BillingController],
  providers: [
    {
      provide: STRIPE_GATEWAY,
      useFactory: () => {
        return getEnv().STRIPE_SECRET_KEY ? new StripeGatewayImpl() : new FakeStripeGateway();
      },
    },
    BillingService,
    BillingWebhookService,
  ],
  exports: [STRIPE_GATEWAY, BillingService],
})
export class BillingModule {}
