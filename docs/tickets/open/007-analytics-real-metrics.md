---
id: "007"
title: Wire real engagement metrics into analytics
type: feature
status: needs-triage
priority: p2
blocked_by: ["001", "002", "003"]
created: 2026-10-09
closed:
---

## Problem

The analytics module has one working endpoint (`GET /analytics/platform-summary`) but the `engagementThisWeek` field is hardcoded to 0. The analytics frontend has several charts (area chart, bar chart, follower growth, post performance, platform breakdown) that currently render with no data. The product has the UI but no real numbers behind it.

## Acceptance criteria

- [ ] `POST /api/v1/posts/:id/metrics/refresh` fetches fresh engagement data for a published post from each platform's API and stores it in the DB
- [ ] A `post_metrics` table (or column set on `post_targets`) stores impressions, likes, reposts, comments, clicks; schema covers both SQLite and PostgreSQL
- [ ] The platform summary endpoint returns real engagement counts summed over the last 7 days
- [ ] The analytics frontend charts display real data for workspaces that have published posts
- [ ] Rate limiting on the refresh endpoint (max 10 req/min per workspace)
- [ ] A scheduled job fetches metrics for posts published in the last 30 days once per day
- [ ] Typecheck passes

## Notes

Use a `POST /api/v1/posts/:id/metrics/refresh` endpoint rate-limited to 10 req/min per workspace, with a `metrics.enabled` config toggle.
Engagement metrics are only available for platforms that expose an analytics API (X, LinkedIn, Facebook/Instagram via Graph API). Threads and Discord do not surface engagement data — return 0 for those.
A `db:migration` skill run is required before this ticket can be closed.
