import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PostsModule } from './posts/posts.module.js';
import { AccountsModule } from './accounts/accounts.module.js';
import { WorkspacesModule } from './workspaces/workspaces.module.js';
import { PublishingModule } from './publishing/publishing.module.js';
import { SchedulingModule } from './scheduling/scheduling.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';
import { BillingModule } from './billing/billing.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    PostsModule,
    AccountsModule,
    WorkspacesModule,
    BillingModule,
    PublishingModule,
    SchedulingModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
