import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { eq } from 'drizzle-orm';
import { sqliteSchema } from '@veypost/db';
import type { DbClient } from '@veypost/db';
import { assertMember } from '../workspaces/workspaces.helpers.js';
import { notFound, badRequest } from '../common/app.exception.js';
import { PUBLISHING_QUEUE, type PublishJobPayload } from './publishing.types.js';

const { posts, postTargets } = sqliteSchema;

const JOB_OPTIONS = {
  attempts: 3,
  backoff: { type: 'exponential', delay: 5_000 },
  removeOnComplete: { count: 100 },
  removeOnFail: { count: 200 },
} as const;

@Injectable()
export class PublishingService {
  constructor(
    @Inject('DB') private readonly db: DbClient,
    @InjectQueue(PUBLISHING_QUEUE) private readonly queue: Queue<PublishJobPayload>,
  ) {}

  async enqueueTarget(targetId: string): Promise<void> {
    await (this.db as any)
      .update(postTargets)
      .set({ status: 'publishing' })
      .where(eq(postTargets.id, targetId));
    await this.queue.add('publish', { postTargetId: targetId }, JOB_OPTIONS);
  }

  async syncPostStatus(postId: string): Promise<void> {
    const rows: { status: string }[] = await (this.db as any)
      .select({ status: postTargets.status })
      .from(postTargets)
      .where(eq(postTargets.postId, postId));
    if (rows.length === 0) return;
    const allTerminal = rows.every((r) => r.status === 'published' || r.status === 'failed');
    if (!allTerminal) return;
    const anyFailed = rows.some((r) => r.status === 'failed');
    const patch: Record<string, unknown> = {
      status: anyFailed ? 'failed' : 'published',
      updatedAt: new Date().toISOString(),
    };
    if (!anyFailed) patch.publishedAt = new Date().toISOString();
    await (this.db as any).update(posts).set(patch).where(eq(posts.id, postId));
  }

  async retryTarget(postId: string, targetId: string, workspaceId: string, userId: string): Promise<void> {
    const db = this.db as any;
    await assertMember(db, workspaceId, userId);
    const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);
    if (!post || post.workspaceId !== workspaceId) throw notFound('Post not found');
    const [target] = await db.select().from(postTargets).where(eq(postTargets.id, targetId)).limit(1);
    if (!target || target.postId !== postId) throw notFound('Target not found');
    if (target.status !== 'failed') throw badRequest('Only failed targets can be retried');
    await db
      .update(posts)
      .set({ status: 'publishing', updatedAt: new Date().toISOString() })
      .where(eq(posts.id, postId));
    await this.enqueueTarget(targetId);
  }
}
