---
name: ship
description: Deploy a change to production or staging safely. Use when the user asks to deploy, ship, or release, and when a change touches env vars, migrations, Dockerfiles, or build configuration.
---

# Ship

The rules below hold on every platform. The mechanics differ, so this skill loads one target file
for the commands and the platform-specific traps.

## 0. Identify the target

Read the deploy target line in root `CLAUDE.md`, then read the matching file in `targets/`:

| Target | File |
|---|---|
| Coolify on a VPS | `targets/coolify.md` |
| Plain Docker Compose on a VPS | `targets/docker-compose.md` |
| Vercel | `targets/vercel.md` |
| A pipeline you do not control (client CI/CD) | `targets/handoff.md` |
| Anything else | `targets/_template.md`, and write the real one |

No target declared in CLAUDE.md: ask, then record the answer there. Never guess from the presence
of a config file. A repo can carry a `vercel.json` and deploy somewhere else entirely.

Read only the target file you need. Loading all of them wastes context on platforms this project
does not use.

## 1. Classify the change

`git diff <last-deployed-ref>..HEAD --stat`, then:

- Source only, no new env vars, no schema change: go to step 5.
- Touches a shared package in a monorepo: every dependent service needs rebuilding, not just the one you edited. List them before deploying.
- Adds or renames a required env var: step 2.
- Adds a migration: step 3.
- Changes build configuration or a Dockerfile: step 4.

## 2. Env var parity, before any build

A new required key crashes the container on boot if the platform does not have it.

- Grep the env validation module for keys added in this diff.
- Confirm each exists on the target for the environment you are deploying to. The target file says where they live and how to check.
- Never add a default value to keep boot alive. A service running with a silently wrong config is worse than one that refuses to start.
- Secrets belong in the platform's secret store, never in a build argument. Build args persist in image layers.
- Variables compiled into a client bundle at build time (`NEXT_PUBLIC_*`, `VITE_*`, and equivalents) need a rebuild, not a restart. Say so out loud when one changes.

## 3. Migrations

- Migrations run as their own step, before the new code serves traffic. See `/db-migration` for the ordering rules and what counts as backward compatible.
- Old and new code overlap during a rolling deploy. Every migration must be safe against the code currently running.
- Confirm the down migration exists and that you have run it.

## 4. Build the real artifact locally

A passing typecheck is not a passing build. Produce the artifact the platform will produce, using
the command in the target file. Monorepo builds fail here for reasons typecheck never sees: a
workspace dependency missing from the pruned context, a file excluded by ignore rules, a native
module needing a build stage.

## 5. Deploy in dependency order

One service at a time, verifying each before starting the next:

1. Migrations
2. Backend or API
3. Workers
4. Frontend

Shipping the frontend first against an API that lacks the resolver it calls puts errors in front of
users for the length of the gap.

## 6. Verify on the running app

A green deploy means the build succeeded and the process started. It does not mean the feature works.

- Exercise the changed path on the real domain, logged out and logged in.
- Both apex and `www` if both resolve, including that auth cookies survive whichever one redirects.
- Read boot logs for warnings, not only errors.
- Worker changed? Confirm a job completes. A worker connected to a queue and processing nothing looks healthy from outside.

## 7. Rollback

Note the currently running version before deploying. If step 6 fails, restore it first and diagnose
after. Never debug forward in production.

If a migration already ran, restoring the old version is not enough. State immediately whether the
old code can run against the new schema. If it cannot, you are fixing forward, and saying so early
is the difference between a short incident and a long one.

## Hard rules

- Never deploy a change you have not built the way the platform builds it.
- Never add a required env var and deploy in the same step.
- Never let a successful deploy count as verification.
- Never deploy to a client's environment without their deployment window and their rollback path confirmed.
