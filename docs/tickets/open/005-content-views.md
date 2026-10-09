---
id: "005"
title: Build posts list, calendar, and queue views
type: feature
status: ready
priority: p2
blocked_by: ["001", "004"]
created: 2026-10-09
closed:
---

## Problem

The three content views (`content/posts`, `content/calendar`, `content/queue`) are empty EmptyState placeholders. Users have no way to see what posts are scheduled, in draft, or published.

## Acceptance criteria

- [ ] Posts list (`/content/posts`): paginated list of posts for the workspace, filterable by status (draft/scheduled/published/failed); each row shows body preview, targets, status, and scheduled time
- [ ] Calendar (`/content/calendar`): monthly grid; days with scheduled posts show a dot or badge; clicking a day shows that day's posts
- [ ] Queue (`/content/queue`): ordered list of upcoming scheduled posts sorted by `scheduledAt`; each item shows target platforms, scheduled time, and an edit/delete action
- [ ] Failed posts show an error message and a Retry button that calls the retry endpoint
- [ ] All three views handle loading, error, and empty states
- [ ] Typecheck passes

## Notes

Calendar and Queue are separate views. The same `GET /api/v1/posts` endpoint with status filtering can power all three — add a `GET /api/v1/posts/calendar?workspaceId=&month=YYYY-MM` endpoint if grouping by day server-side is more efficient.
