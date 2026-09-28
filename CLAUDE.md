# Pulsarr

Self-hosted social media scheduling and publishing platform. Compose once, publish to X, Bluesky,
LinkedIn, Facebook, Instagram, Threads, and Discord. Includes scheduling, analytics, team
workspaces, and a public REST API. Open source (Apache 2.0).

## Stack

- Language: TypeScript
- Runtime: Node 24
- Package manager: pnpm
- Repo shape: Turborepo (apps/api, apps/web, packages/db, packages/shared)
- Backend: NestJS 12 with Fastify adapter
- Frontend: TanStack Start with React 19
- ORM: Drizzle (SQLite default, PostgreSQL for scaling)
- Auth: Better Auth
- Queue: BullMQ with Valkey
- Styling: Tailwind CSS v4 + shadcn/ui
- Deploy target: docker-compose

The deploy target names a file in `.claude/skills/ship/targets/`. `/ship` reads that one file and
no others.

## Commands

Every command below must run as written from the repo root. If one is wrong, fix it here first.

| Purpose         | Command                             |
| --------------- | ----------------------------------- |
| Install         | `pnpm install`                      |
| Dev             | `pnpm dev`                          |
| Build           | `pnpm build`                        |
| Typecheck       | `pnpm typecheck`                    |

| Test            | `pnpm test`                         |
| DB generate     | `pnpm db:generate`                  |
| DB migrate      | `pnpm db:migrate`                   |
| Dev infra       | `docker compose -f docker/docker-compose.yml up -d` |

## Non-negotiables

1. All source is TypeScript. No `.js` files outside config. (evidence: `tsconfig.base.json`)
2. No secret is ever read outside `apps/api/src/config/env.ts`. (evidence: `apps/api/src/config/env.ts`)
3. Shared types and constants live in `@pulsarr/shared`, not duplicated. (evidence: `packages/shared/src/`)
4. Database schemas exist for both SQLite and PostgreSQL. (evidence: `packages/db/src/schema/`)
5. The project name is defined once in `packages/shared/src/constants/app.ts`. (evidence: `packages/shared/src/constants/app.ts`)

## Where things live

- `apps/api/`, NestJS backend. Modules: auth, posts, accounts, workspaces, publishing, scheduling, analytics.
- `apps/web/`, TanStack Start frontend. Routes, components, hooks.
- `packages/db/`, Drizzle schemas (pg + sqlite), migrations, connection factory.
- `packages/shared/`, shared constants, TypeScript types, Zod validation schemas.
- `docker/`, Dockerfile, compose files, supervisord config.
- `.claude/rules/`, auto-loaded guardrails. Scoped by globs so UI rules load only for UI files.
- `.claude/skills/`, on-demand workflows invoked with `/skill-name`.
- `.claude/agents/`, custom agent definitions (codebase-scout, code-reviewer, docs-researcher).
- `docs/decisions/`, ADRs. Read before proposing an architectural change.
- `docs/conventions/`, how we write code here.
- `docs/CONTEXT.md`, domain vocabulary. Use these words exactly.
- `docs/ui/TOKENS.md`, every visual value. Components define none of their own.
- `docs/ui/COMPONENTS.md`, what exists. Read before building a component.
- `docs/ui/DESIGN.md`, how to build correctly: accessibility rules, contrast requirements, motion, dark mode. Read alongside TOKENS.md and COMPONENTS.md before touching any UI.
- `docs/tickets/`, the work queue. See `docs/tickets/README.md`.
- `docs/RUNBOOK.md`, what to do when production breaks.

## Skills

Setup: `/start-project`, run once, on day one.

Workflow: `/new-feature` `/fix-bug` `/refactor` `/perf` `/review` `/commit` `/research` `/end-session`

Tickets: `/to-tickets` `/triage` `/pick-next`

Frontend: `/design-system` `/new-component` `/loading-states` `/ui-details`

Contracts and data: `/api-contract` `/db-migration`

Infrastructure: `/ship` `/docker-service` `/queues-and-rate-limits` `/provisioning-safety`

Always applies: `sensitive-code` on auth, permissions, payments, and deletion. `unslop` on every
prose surface, including your replies.

Maintenance: `/audit-foundation`. Run when the session-start hook reports drift.

## Code comments

Default: write no comment. The only valid comment explains a non-obvious WHY — a hidden
constraint, a workaround for a specific bug, an invariant that would surprise a reader.

Never write:

- Decorative separators: `// ── Section ──`, `// =========`
- JSX labels restating the element below: `{/* Header */}` above `<header>`
- Section headers above their own function or export
- Narration of what the code does: `// fetch the user`, `// set state`
- Empty-catch narration: `} catch { // ignore }` — leave the block empty
- Multi-line blocks explaining what code does

## File size

Keep files under ~150 lines. When a file would exceed that, split it by logical unit before
writing more: types, sub-components, utilities, orchestrator each get their own file. Flag and
propose the split — don't add to an already-long file. See `docs/conventions/README.md`.

## Working agreement

- Plan before editing anything that crosses a file boundary. Show the plan, wait for a yes.
- Scope discipline: unrelated problems found along the way get listed, not fixed.
- Never mark work done without running the verification the relevant skill requires.
- A passing build is not a passing feature. Exercise the real path.
- Prose follows `.claude/skills/unslop/SKILL.md`. That covers commit messages, PR descriptions,
  ADRs, session logs, ticket text, docs, your replies in this session, and code comments.
