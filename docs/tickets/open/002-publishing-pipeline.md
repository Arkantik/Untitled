---
id: "002"
title: Implement BullMQ publishing pipeline
type: feature
status: ready
priority: p1
blocked_by: ["001"]
created: 2026-10-09
closed:
---

## Problem

The publishing module is an empty stub. There is no mechanism to dispatch a scheduled post to its target platforms, track per-target status, or retry failures. Without this, posts can be created and scheduled but never actually published.

## Acceptance criteria

- [ ] A BullMQ queue (`publishing`) processes one `post_target` at a time
- [ ] A scheduler job (runs every minute via `@nestjs/schedule`) enqueues all post targets whose parent post has `scheduledAt <= now` and status `scheduled`
- [ ] Before enqueue, target status transitions to `publishing`; if dispatch succeeds, to `published` with `publishedAt`; if it fails, to `failed` with `error` message
- [ ] Failed targets can be retried via `POST /api/v1/posts/:id/targets/:targetId/retry`
- [ ] A post's top-level status updates automatically: `published` once all targets are done, `failed` if any target fails (partial success is surfaced, not silently ignored)
- [ ] BullMQ job has `attempts: 3`, exponential backoff, and a removal policy; completed and failed jobs do not accumulate indefinitely
- [ ] Job payload is just `{ postTargetId }` — the worker loads the full record from the DB
- [ ] Jobs are idempotent: re-queuing an already-`published` target is a no-op
- [ ] Valkey connection config comes from `getEnv()` in `apps/api/src/config/env.ts`
- [ ] Typecheck passes

## Notes

BullMQ is already in the stack (see `CLAUDE.md`). Valkey is the broker.
`apps/api/src/publishing/` is the home for this module.
Platform dispatch clients are a separate ticket (003) — the job worker calls them.
BatchResult pattern applies: a failure on one target must not discard progress on others.
