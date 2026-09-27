---
name: loading-states
description: Audit and fix loading states across the app — prefetching, caching, skeletons, spinners, waterfalls, and static shell. Use when the app feels slow to navigate or shows too many loading indicators.
---

# Loading States Audit

## 1. Prefetch and cache

- Prefetch route data on link hover and focus, not only on click.
- Keep visited pages in a cache so navigating back never refetches.
- Before showing any placeholder, check the cache first. A cached page must render without any skeleton.

## 2. Speed

- Skeletons and shimmers should feel fast, not calm.
- Shorten placeholder animations to under one second per cycle.
- Resolve parts of the page as soon as their data arrives — do not wait for the slowest query before rendering anything.

## 3. Data loading analysis

- List which components wait on which queries.
- Flag waterfalls: a waterfall is any place where one request cannot start until another finishes, and the dependency is not inherent to the data.
- Move slow queries off the critical path or split them. A page that is 80 % rendered is better than a blank page waiting for the last query.

## 4. Spinners

- Find every spinner in the codebase (`grep -r "Spinner\|loading\|isLoading" src/`).
- Replace each one with prefetched content, a skeleton, or nothing — in that priority order.
- Videos: serve smaller sizes, stream instead of sending the whole file, no third-party iframes on the critical path.

## 5. Static shell

- Navigation, header, and layout must render on the first frame, before any data loads.
- A root-level loading state must never block navigation — the shell is always visible.

## Verification

Report what changed and what still needs a backend change. A complete report covers:

1. Spinners removed and what replaced them.
2. Waterfalls eliminated or documented (with the reason they could not be fixed frontend-side).
3. Cache and prefetch behaviour confirmed by navigating back to a visited page and observing zero network requests.
4. Animation durations confirmed below one second.
5. Anything blocked on a backend change, listed explicitly so it can become a ticket.
