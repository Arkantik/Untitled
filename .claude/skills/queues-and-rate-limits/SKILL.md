---
name: queues-and-rate-limits
description: Design or fix background jobs and calls to rate-limited external APIs. Use for BullMQ or Valkey work, retry and backoff logic, 429 handling, concurrency limits, idempotency, or when a job produces partial or lost results under load.
---

# Queues and rate limits

Two problems that look separate and are the same problem: work that must survive being interrupted. Most of the rules below exist because a partial success got thrown away.

## The rule that matters most

**Never discard successful work because a later item failed.**

A batch of 50 lookups where item 37 gets a 429 has 36 successful results. Throwing an error from the client layer loses all 36. Return partial results with an explicit failure list, and let the calling layer persist what succeeded before it handles the failures. This is the bug that costs the most and looks the most like correct error handling.

Shape it like this:

```ts
type BatchResult<T> = {
  succeeded: T[];
  failed: { key: string; reason: "rate_limited" | "not_found" | "error" }[];
};
```

The client never throws for a per-item failure. It throws only when the whole call could not be attempted.

## Rate limits have at least two dimensions

Before tuning anything, find out which limit you are actually hitting:

- Requests per minute or per window
- Maximum concurrent in-flight requests
- Per-key or per-account limits shared across all your users

Getting 429s with conservative per-minute settings usually means you are over the concurrency limit, not the rate limit. Log the response headers and confirm which one the API is enforcing before changing a number.

When the limit is per-account and many users can trigger calls at once, per-request throttling does nothing. The limiter must be a single shared coordinator that every caller queues through, not a limiter constructed per request.

## Lookup order

Always try the cheapest source first, and stop as soon as you have a fresh answer:

1. In-memory cache, short TTL, for duplicate work inside one batch or one minute
2. Database, with an explicit staleness threshold
3. External API

Record which tier answered, per item. When throughput drops you need to know whether the cache stopped helping or the API got slower.

Staleness is a domain decision, not a constant to guess. Ask what makes a stored record wrong, then set the threshold from that.

## Retries

- Retry only on 429, on an explicit "not ready yet" status the API defines, and on 5xx.
- Never retry 400, 401, 403, or 404. Retrying a permanent failure burns quota and hides a bug.
- Exponential backoff with jitter. Fixed delays from many callers re-synchronize into the same burst.
- Cap total attempts, and on exhaustion fall back to stale data rather than failing the whole operation. Stale is better than unknown for anything user-facing.
- Say in the response which values are stale. Silent fallback turns into a support question later.

## Job design

- Every job is idempotent. Assume it will run twice, because a worker crash between side effect and acknowledgement guarantees it eventually will.
- Derive the job id from the input, so an accidental duplicate enqueue collapses instead of duplicating work.
- Write intent to the database before performing a side effect, not after. A crashed job must be recoverable from persisted state, not reconstructed from logs.
- Keep the job payload small. Pass an id, let the worker load the record. Large payloads sit in the queue store and go stale between enqueue and execution.
- Set `attempts`, `backoff`, and a removal policy for completed and failed jobs explicitly. Defaults will fill the store.
- Route jobs with different runtime profiles to different queues. A 20-second parse job behind 200 fast jobs is fine; the reverse is not.

## Progress and failure surfacing

- Long jobs report progress through the queue's progress mechanism or a persisted record, not an in-memory map on one process. In-memory works until you run two workers.
- An operation that partially succeeded reports as partial, with counts. Not as success, not as failure.
- Errors the user can act on reach the user. Rate limiting is usually not one of those: fall back and continue rather than surfacing a 429 to someone uploading a file.

## Diagnosing a queue problem

Answer these in order before changing code:

1. Is the job running twice, or running once and doing the wrong thing?
2. Is the failure per-item or whole-batch?
3. Which limit is the API enforcing, and is your limiter shared or per-request?
4. Does the successful portion of the work survive the failing portion? Test it directly by forcing a mid-batch failure.

## Hard rules

- Never throw away fetched data because a sibling item failed.
- Never retry a permanent client error.
- Never share an external rate limit across users without a single shared coordinator.
- Never make a job non-idempotent and rely on the queue to deliver exactly once.
