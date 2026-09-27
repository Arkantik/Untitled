---
name: sensitive-code
description: Rules for code handling authentication, authorization, payments, or destructive operations. Applies automatically whenever a change touches auth, permissions, billing, or deletion.
---

# Sensitive code

Applies to auth, authorization, payments, and anything that destroys data. These changes fail
quietly and expensively. The default caution level is higher here than anywhere else in the repo.

## Authorization

- Check permission at the boundary that serves the data, not in the UI. A hidden button is not a permission check.
- Deny by default. A new endpoint, resolver, or route with no explicit check is open, not closed.
- Check the specific action against the specific resource. Role alone is not enough: an owner editing their own record and an owner editing someone else's are different authorizations.
- Enumerate the cases explicitly when roles interact. The bug pattern: an admin path and an owner path exist, and the case where an owner acts on themselves falls through both.
- Never trust a client-supplied id to identify the actor. Take it from the verified session.

## Authentication

- Tokens expire. Every expiry path needs a defined behavior: refresh transparently, or fail to a specific screen. Never a generic error in the middle of a user's work.
- Refresh must be safe under concurrency. Several requests failing at once must trigger one refresh, not several, and the queued requests retry after it.
- Session state lives in one place. Two sources of truth for who the user is means they will disagree.
- Cookie domain, path, secure, and sameSite are load-bearing. An apex and `www` mismatch silently logs users out.

## Payments

- The webhook is the source of truth, not the client redirect. A user closing the tab after paying must still end up subscribed.
- Webhook handlers verify the signature, and are idempotent. They will be delivered twice.
- Entitlement is derived from stored subscription state, checked server side, on every request that depends on it. Never from a value the client sends.
- Reconcile with the provider on a schedule. Webhooks get missed.
- Never log full payment payloads.

## Destructive operations

- Confirm intent explicitly, with the thing being destroyed named in the confirmation.
- Soft delete unless there is a reason not to, and record who and when.
- Cascades are stated before writing: exactly what else disappears. A delete that silently removes related records is discovered by the person who lost them.
- Bulk operations show the count and a sample before running.

## Review requirements

A diff touching any of the above gets `/review` regardless of size, with correctness and security
first. Say explicitly what authorization the change enforces and which paths reach it.

## Hard rules

- Never gate on the client.
- Never grant access on an unverified webhook.
- Never delete without a stated cascade.
- Never write your own crypto, token format, or password hashing.
