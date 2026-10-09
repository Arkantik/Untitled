---
id: "004"
title: Build post composer frontend
type: feature
status: ready
priority: p1
blocked_by: ["001"]
created: 2026-10-09
closed:
---

## Problem

There is a `dashboard-composer.tsx` component in the dashboard area, but the full composer experience is missing: selecting target accounts, writing platform-specific content, scheduling, and submitting. Users currently cannot create or schedule any posts through the UI.

## Acceptance criteria

- [ ] Composer lets the user write a post body (plain text; character count shown)
- [ ] User can select one or more connected accounts as targets
- [ ] User can choose "Post now" or "Schedule" (date + time picker)
- [ ] Submitting creates the post via `POST /api/v1/posts` and shows a success state
- [ ] Validation: body required, at least one target required, scheduled time must be in the future
- [ ] Composer is accessible from the dashboard quick-compose area and from a dedicated route
- [ ] Loading, error, and empty-state (no connected accounts) are handled
- [ ] Typecheck passes

## Notes

Per-platform content overrides (different text per platform) are out of scope for this ticket — wire the same body to all targets first.
Image attachment is a separate ticket (006).
The `content/posts.tsx` route (currently an EmptyState) can be the home for a full composer drawer/modal triggered from there.
