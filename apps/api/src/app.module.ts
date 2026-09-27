import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { PostsModule } from './posts/posts.module.js';
import { AccountsModule } from './accounts/accounts.module.js';
import { WorkspacesModule } from './workspaces/workspaces.module.js';
import { PublishingModule } from './publishing/publishing.module.js';
import { SchedulingModule } from './scheduling/scheduling.module.js';
import { AnalyticsModule } from './analytics/analytics.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PostsModule,
    AccountsModule,
    WorkspacesModule,
    PublishingModule,
    SchedulingModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
