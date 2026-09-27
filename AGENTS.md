# AGENTS.md

Guidance for agentic coding tools (Claude Code, Copilot, Cursor, Windsurf, etc.) working with the
Pulsarr codebase.

Read `CLAUDE.md` for project configuration, skills, and working agreements specific to Claude Code
sessions.

## Project context

Pulsarr is an open-source, self-hosted social media scheduling and publishing platform. Compose
once, publish to X, Bluesky, LinkedIn, Facebook, Instagram, Threads, and Discord. Includes
scheduling, analytics, team workspaces, and a public REST API. Licensed under Apache 2.0.

## Tech stack

- **Language:** TypeScript (all source; no `.js` files outside config)
- **Runtime:** Node 22
- **Package manager:** pnpm
- **Monorepo:** Turborepo with `apps/api`, `apps/web`, `packages/db`, `packages/shared`
- **Backend:** NestJS 12 with Fastify adapter
- **Frontend:** TanStack Start (TanStack Router + React 19)
- **ORM:** Drizzle (SQLite default, PostgreSQL for scaling)
- **Auth:** Better Auth
- **Queue:** BullMQ with Valkey (Redis-compatible)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **API docs:** Swagger/OpenAPI at `/api/docs`
- **Deploy:** docker-compose

## Development setup

### Prerequisites

- Node >= 22 (see `.nvmrc`)
- pnpm 10.x (corepack-managed via `packageManager` in `package.json`)
- Docker and Docker Compose (for Valkey + PostgreSQL)

### First run

```bash
pnpm install
docker compose -f docker/docker-compose.yml up -d   # starts PostgreSQL 17 + Valkey 8
pnpm dev                                             # starts API (port 3001) + web (port 3000)
```

### Commands (run from repo root)

| Purpose      | Command                                            |
| ------------ | -------------------------------------------------- |
| Install      | `pnpm install`                                     |
| Dev          | `pnpm dev`                                         |
| Build        | `pnpm build`                                       |
| Typecheck    | `pnpm typecheck`                                   |
| Test         | `pnpm test`                                        |
| DB generate  | `pnpm db:generate`                                 |
| DB migrate   | `pnpm db:migrate`                                  |
| Dev infra    | `docker compose -f docker/docker-compose.yml up -d` |

Turborepo orchestrates these; individual workspace scripts exist but should not be called directly.

## Architecture

### Monorepo layout

```
apps/
  api/          NestJS backend (Fastify adapter)
  web/          TanStack Start frontend (React 19)
packages/
  db/           Drizzle schemas (pg + sqlite), migrations, connection factory
  shared/       Constants, TypeScript types, Zod validation schemas (@pulsarr/shared)
docker/         Dockerfile, compose files, supervisord config
docs/           ADRs, conventions, domain vocabulary, UI tokens, tickets, runbook
```

### Backend (`apps/api`)

NestJS modules, one per domain:

| Module       | Responsibility                                   |
| ------------ | ------------------------------------------------ |
| `auth`       | Authentication via Better Auth                   |
| `posts`      | CRUD for post drafts and content                 |
| `accounts`   | Connected social media account management        |
| `workspaces` | Team workspaces, membership, roles               |
| `publishing` | Dispatching posts to platform APIs               |
| `scheduling` | BullMQ job scheduling for timed posts            |
| `analytics`  | Post performance metrics and reporting           |

Each module follows the standard NestJS pattern: `*.module.ts`, `*.controller.ts`, `*.service.ts`.

API prefix: `/api/v1`. Swagger docs at `/api/docs`.

#### Environment and secrets

`apps/api/src/config/env.ts` validates every environment variable with Zod. No secret is read
outside that file. Variables:

- `NODE_ENV`, `PORT`
- `DB_DIALECT` (`sqlite` | `postgresql`), `SQLITE_DB_PATH`, `DATABASE_URL`
- `VALKEY_URL`
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`

### Frontend (`apps/web`)

TanStack Start with file-based routing (TanStack Router). Routes live in `apps/web/src/routes/`.
TanStack Router generates `routeTree.gen.ts` automatically. Do not edit it.

Tailwind CSS v4 with design tokens from `docs/ui/TOKENS.md`. Components must not define their own
visual values. Check `docs/ui/COMPONENTS.md` before building a new component.

### Database (`packages/db`)

Drizzle ORM with dual-dialect schemas:

- `packages/db/src/schema/pg.ts` for PostgreSQL (production)
- `packages/db/src/schema/sqlite.ts` for SQLite (local dev default)

Both schemas define the same tables and must stay in sync:

- `users`, app users managed by Better Auth
- `workspaces`, team containers. Each has an owner.
- `workspace_members`, join table with role enum: `owner`, `admin`, `editor`, `viewer`
- `connected_accounts`, OAuth tokens for each social platform per workspace
- `posts`, content with status lifecycle: `draft` → `scheduled` → `publishing` → `published` | `failed`
- `post_targets`, per-platform publish record for a post, each tracking its own status

When modifying schemas, update both dialects, then run `pnpm db:generate` and `pnpm db:migrate`.

### Shared package (`packages/shared`)

`@pulsarr/shared` exports constants, TypeScript types, and Zod schemas. Both `apps/api` and
`apps/web` import from it. The project name is defined once in
`packages/shared/src/constants/app.ts`. Never duplicate shared types in app code.

### Infrastructure

`docker/docker-compose.yml` runs two services:

- PostgreSQL 17 (Alpine), port 5432, user/password/db all `pulsarr`
- Valkey 8 (Alpine), port 6379, append-only, `noeviction` memory policy

Both have health checks. Data volumes: `pgdata`, `valkeydata`.

## Code standards

### Non-negotiables

1. All source is TypeScript. No `.js` files outside config.
2. No secret is ever read outside `apps/api/src/config/env.ts`.
3. Shared types and constants live in `@pulsarr/shared`, not duplicated.
4. Database schemas exist for both SQLite and PostgreSQL and stay in sync.
5. The project name is defined once in `packages/shared/src/constants/app.ts`.

### Testing

- Prefer E2E tests over unit tests.
- Never write unit tests after writing the code they test.
- If you must test a system in isolation, first enumerate the failure modes, then write the code.
- E2E tests should produce a verifiable and repeatable artifact.

### Conventions

- Read `docs/conventions/README.md` before introducing new patterns.
- Read `docs/decisions/` (ADRs) before proposing architectural changes.
- Use terms from `docs/CONTEXT.md` exactly as defined; do not invent synonyms.

## Git workflow

- `main` is the primary branch.
- Create feature branches from `main`, open PRs back to `main`.
- Commit messages should explain why, not what.

## Gotchas

- `routeTree.gen.ts` is auto-generated. Do not edit it; add routes as files under
  `apps/web/src/routes/` and let TanStack Router regenerate it.
- SQLite and PostgreSQL schemas use different column types (e.g., `text` for dates in SQLite vs.
  `timestamp` in PostgreSQL). When adding a column, update both schema files.
- Valkey runs with `noeviction`. BullMQ jobs are never silently dropped, but Valkey will error
  if it runs out of memory. Monitor usage in production.
- Pulsarr uses the Fastify adapter, not Express. Do not use Express-specific middleware or
  decorators.
- CORS origin comes from `BETTER_AUTH_URL`. The frontend must run on the URL that matches this
  value (default: `http://localhost:3000`).

## Key files

| What                     | Where                                      |
| ------------------------ | ------------------------------------------ |
| API entry point          | `apps/api/src/main.ts`                     |
| Module registry          | `apps/api/src/app.module.ts`               |
| Env validation           | `apps/api/src/config/env.ts`               |
| PG schema                | `packages/db/src/schema/pg.ts`             |
| SQLite schema            | `packages/db/src/schema/sqlite.ts`         |
| Shared constants         | `packages/shared/src/constants/app.ts`     |
| Frontend routes          | `apps/web/src/routes/`                     |
| Route tree (generated)   | `apps/web/src/routeTree.gen.ts`            |
| Design tokens            | `docs/ui/TOKENS.md`                        |
| Component inventory      | `docs/ui/COMPONENTS.md`                    |
| Domain vocabulary        | `docs/CONTEXT.md`                          |
| ADRs                     | `docs/decisions/`                          |
| Docker Compose           | `docker/docker-compose.yml`                |
| Turbo config             | `turbo.json`                               |
| Workspace config         | `pnpm-workspace.yaml`                      |
