---
description: Guardrails for auth, permissions, payments, and destructive operations
---

When any change touches authentication, authorization, payments, or data deletion,
invoke `/sensitive-code` and follow the full skill before writing code.

## Quick checks

- Permission checks at the boundary that serves the data, not in the UI
- Deny by default. A new endpoint with no explicit check is open.
- Actor identity from verified session, never client-supplied
- Token expiry has a defined refresh-or-fail behavior
- Webhook is source of truth for payments, not client redirect
- Soft delete unless there is a reason not to
- Confirm intent with the thing being destroyed named
- Cascades stated before writing

## Hard rules

- Never gate on the client
- Never grant access on an unverified webhook
- Never delete without a stated cascade
- Never write your own crypto, token format, or password hashing

Secrets are read only in `apps/api/src/config/env.ts`. Nowhere else.
