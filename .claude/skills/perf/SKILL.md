---
name: perf
description: Investigate and fix a performance problem. Use for slow, laggy, timing out, high memory, or too many queries.
---

# Performance

Gated, for the same reason `/fix-bug` is: the intuitive cause is usually not the real one, and an
optimization applied to the wrong layer costs the time and buys nothing.

## Phase 1: measure

Artifact: a number.

- What is slow, measured how, and what would count as fixed? "Feels laggy" is a report, not a measurement.
- Reproduce it and record the number before changing anything. Without a baseline you cannot tell an improvement from a placebo.
- Measure the real conditions: production data volume, a cold cache, a real network. Local with fifty rows proves nothing about production with fifty thousand.

Cannot measure it: say so and stop. Do not optimize speculatively.

## Phase 2: locate

Artifact: the specific operation consuming the time.

Check in this order, because this is roughly the frequency order of real causes:

1. Query count. N+1 is the most common backend cause by a wide margin. Log the queries for one request and count them.
2. Missing index. Explain the slow query and look for a sequential scan on a large table.
3. Payload size. Fetching columns or fields nobody renders.
4. Serial work that could be parallel, or parallel work hitting a concurrency limit.
5. Render cost: re-renders from an unstable reference, a list rendering everything, work in a hot path that belongs in a memo.
6. Bundle size, for anything measured as time to interactive.

Profile before assuming. Attribute the time to a specific operation, not to a subsystem.

## Phase 3: fix the biggest thing only

- Fix the one operation that dominates the measurement. Two optimizations at once means you cannot attribute the change.
- Re-measure. No improvement means the hypothesis was wrong: revert and return to phase 2. Keeping a change that did not help is how codebases accumulate complexity with nothing to show for it.
- Record the before and after numbers in the commit message.

## Phase 4: hold the line

- Where a regression would matter, add an assertion that catches it: a query count test, a bundle size budget in CI, a timing assertion with a generous threshold.
- Structural fix, like a dataloader or an index: note it in `docs/conventions/` so the next similar query gets it for free.

## Hard rules

- Never optimize without a before measurement.
- Never keep a change that did not move the number.
- Never trade correctness for speed without saying so explicitly.
