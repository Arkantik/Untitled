import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { Redis } from 'ioredis';
import { getEnv } from './config/env.js';
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
import { UsersModule } from './users/users.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      connection: new Redis(getEnv().VALKEY_URL, { maxRetriesPerRequest: null }),
    }),
    DatabaseModule,
    AuthModule,
    PostsModule,
    AccountsModule,
    WorkspacesModule,
    BillingModule,
    UsersModule,
    PublishingModule,
    SchedulingModule,
    AnalyticsModule,
    DashboardModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
