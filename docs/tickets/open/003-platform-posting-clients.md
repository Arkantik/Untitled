---
id: "003"
title: Implement per-platform post dispatch clients
type: feature
status: ready
priority: p1
blocked_by: ["001", "002"]
created: 2026-10-09
closed:
---

## Problem

There are no API clients for actually publishing content to the social platforms. The accounts module handles OAuth connection and token refresh, but nothing calls the platform APIs to post text or media. The publishing pipeline worker (ticket 002) needs a `dispatch(postTarget, post)` function per platform.

## Acceptance criteria

- [ ] One dispatcher per platform: X, LinkedIn, Facebook, Instagram, Threads, Discord (Bluesky deferred, "coming soon")
- [ ] Each dispatcher takes the post body and returns `{ platformPostId: string }` on success or throws with a descriptive error
- [ ] Text posts work end-to-end for all six platforms
- [ ] Image attachment works for at least X, LinkedIn, and Instagram (other platforms as their APIs allow)
- [ ] Access token for each dispatch is read from the DB `connected_accounts` row — never from client input
- [ ] Rate limit and auth errors are thrown with a reason string the BullMQ retry/failure handler can log
- [ ] All platform credentials (API keys, client secrets) come from `getEnv()` only
- [ ] Dispatchers live in `apps/api/src/publishing/platforms/`
- [ ] Typecheck passes

## Notes

The token refresh logic in `apps/api/src/accounts/platforms/token-refresh.ts` is a useful reference for how each platform's OAuth is structured.
Platform API docs:
- X v2: text via `POST /2/tweets`, media via upload API
- LinkedIn: `POST /rest/posts` (UGC posts)
- Facebook: `POST /{page-id}/feed`
- Instagram: Graph API content publishing
- Threads: `POST /{user-id}/threads` + `POST /{user-id}/threads_publish`
- Discord: webhook `POST`
