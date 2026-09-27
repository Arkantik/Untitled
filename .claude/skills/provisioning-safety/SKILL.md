---
name: provisioning-safety
description: Design or review code that creates, shares, or destroys per-tenant database instances and their containers. Use for dockerode provisioning, connection string issuing, teardown, orphan reconciliation, PgBouncer pooling, or tenant isolation.
---

# Provisioning safety

This covers a control plane that creates real infrastructure on behalf of users. The failure modes are different from normal application code: a bug does not throw an error, it leaves a running container nobody knows about, holding a volume nobody will reclaim, reachable with a credential nobody rotated.

## State before side effect, always

The control plane database is the source of truth. The Docker daemon is not.

1. Write the instance record with status `requested`, including the generated identifier.
2. Enqueue the provisioning job.
3. The job transitions to `provisioning`, then performs the side effect.
4. On success, transition to `ready` and store the resolved connection details.
5. On failure, transition to `failed` and enqueue teardown for whatever was created.

If the process dies at any point, the record tells you what state to reconcile toward. If you call the daemon first and record afterwards, a crash in between creates infrastructure with no owner and no way to find it except by listing every container on the host.

Model the states explicitly: `requested`, `provisioning`, `ready`, `failed`, `destroying`, `destroyed`. Reject transitions that are not in the machine. A status column of free-form strings becomes untrustworthy within a month.

## Label everything at creation

Every container, volume, and network carries labels identifying the tenant, the instance id, and the control plane that created it. Set them in the create call, never afterwards.

Labels are what make reconciliation possible. Without them, an orphan is indistinguishable from someone else's container on the same host.

## Reconciliation loop

Run on a schedule, not only on demand. It compares the daemon against the control plane and reports three sets:

- Resources labelled with an instance id that has no record, or a record in `destroyed`. These are orphans. Report first, delete only under an explicit policy with a grace period.
- Records in `ready` with no running resource. These are phantoms. The user believes they have a database and does not.
- Records stuck in `provisioning` or `destroying` past a timeout. These are interrupted jobs. Resume or fail them.

Never let reconciliation delete on its first observation. A container can be missing because the daemon is briefly unreachable.

## Teardown

- Teardown is idempotent. Calling it on an already-destroyed instance succeeds quietly.
- Teardown removes the volume, not just the container. A stopped container with an orphaned volume is the default outcome of a careless destroy, and it is how a host runs out of disk.
- Teardown removes the network and any generated credentials.
- Teardown is a job with retries, not a synchronous handler on a delete request. A failed teardown must be retried, not lost with the HTTP response.
- Destroying data is irreversible. Require an explicit confirmation carrying the instance identifier, and honour a retention window before the volume actually goes.

## Connection strings are credentials

- Generate a distinct password per instance, from a cryptographic source. Never derive one from the tenant id, the instance name, or anything guessable.
- Never log a connection string, at any level, including on error. Redact at the point of construction, not at the point of logging, so a future log line cannot leak it by accident.
- Store the password encrypted at rest, or store only what is needed to reconstruct access and keep the secret in a secrets store.
- A shareable link is a bearer token. Give it an expiry, a revocation path, and a rotation that actually changes the database role's password rather than only invalidating the link.
- Revoking access means altering the role. A link that stops working while the credential still does is not revocation.

## Isolation

- One database role per instance, owning only its own database. No shared superuser reachable from tenant credentials.
- Separate networks per tenant. Two tenant containers on one bridge network can reach each other.
- Set CPU, memory, and disk limits at create time. An unbounded tenant container is a denial of service against every other tenant on the host.
- Pin the Postgres major version and the extension set per instance, recorded on the instance record. "Latest" makes two instances created a month apart behave differently with no explanation.
- Creating an extension requires elevated rights. Create it during provisioning as the admin role, then hand the tenant a role that cannot.

## Pooling

PgBouncer's pooling mode changes what the client can do:

- Transaction mode breaks session-scoped features: prepared statements held across statements, `LISTEN`/`NOTIFY`, session-level `SET`, advisory locks tied to a session, and temporary tables.
- ORMs frequently use prepared statements by default. If you issue transaction-mode connection strings, either disable prepared statements in the documented client configuration or issue session-mode strings and accept the lower connection density.
- Decide this per product tier and document it in the connection string handoff. A user whose ORM breaks on a pooled connection has no way to diagnose it from their side.

## Review checklist

1. Record written before the daemon call
2. Explicit state machine, invalid transitions rejected
3. Labels set at creation, covering tenant and instance
4. Reconciliation covers orphans, phantoms, and stuck jobs
5. Teardown idempotent, removes volume and network, runs as a retried job
6. Per-instance credentials, cryptographically generated
7. No connection string reachable from any log path
8. Revocation alters the role, not just the link
9. Resource limits set at create time
10. Pooling mode decided, documented, and matched to the client's capabilities

## Hard rules

- Never call the daemon before persisting intent.
- Never delete on a single reconciliation observation.
- Never log a connection string.
- Never destroy a volume without confirmation and a retention window.
