---
id: "001"
title: Implement posts CRUD API
type: feature
status: ready
priority: p1
blocked_by: []
created: 2026-10-09
closed:
---

## Problem

The posts API module exists but has no endpoints or business logic. The DB schema for `posts` and `post_targets` is complete (statuses: draft/scheduled/publishing/published/failed), but nothing can create, read, update, or delete posts through the API. All content views on the frontend are empty placeholders waiting on this.

## Acceptance criteria

- [ ] `POST /api/v1/posts` creates a post with at least `body`, `scheduledAt`, and a list of target account IDs
- [ ] `GET /api/v1/posts?workspaceId=&status=` lists posts for a workspace; supports filtering by status
- [ ] `GET /api/v1/posts/:id` returns a single post with its targets
- [ ] `PUT /api/v1/posts/:id` updates body, scheduledAt, or target list on a draft/scheduled post
- [ ] `DELETE /api/v1/posts/:id` deletes a draft or scheduled post (soft-delete or hard, stated before merging)
- [ ] `POST /api/v1/posts/:id/duplicate` creates a draft copy
- [ ] Each post target stores `platform`, `accountId`, `status`, `error`, and `publishedAt`
- [ ] Membership is asserted before any write or read
- [ ] Shared types for Post, PostTarget, and list/create/update inputs live in `@pulsarr/shared`
- [ ] Typecheck passes

## Notes

DB schema: `packages/db/src/schema/sqlite.ts` (and pg.ts) — tables `posts` and `post_targets` already exist.
Status enum is already defined: draft/scheduled/publishing/published/failed.
The publishing pipeline (ticket 002) depends on this.
