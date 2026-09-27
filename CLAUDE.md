# <Project name>

<One paragraph: what this project is and who uses it. Replace on day one.>

## Stack

<List what is actually installed. Delete lines that do not apply. This section is load-bearing:
the agent reads it to decide what is idiomatic here.>

- Language: <TypeScript>
- Runtime: <Node 22>
- Package manager: <pnpm>
- Repo shape: <single package | workspaces | Turborepo>
- Deploy target: <coolify | docker-compose | vercel | handoff | custom>

The deploy target names a file in `.claude/skills/ship/targets/`. `/ship` reads that one file and
no others. Client projects on infrastructure you do not control use `handoff`.

## Commands

Every command below must run as written from the repo root. If one is wrong, fix it here first.

| Purpose       | Command                       |
| ------------- | ----------------------------- |
| Install       | `<pnpm install>`              |
| Dev           | `<pnpm dev>`                  |
| Build         | `<pnpm build>`                |
| Typecheck     | `<pnpm typecheck>`            |
| Lint          | `<pnpm lint>`                 |
| Test          | `<pnpm test>`                 |
| Test one file | `<pnpm test -- path/to/file>` |

## Non-negotiables

<Five rules maximum. These are the ones worth interrupting work over. Each cites a path as evidence
so `/audit-foundation` can verify it mechanically. Delete the examples and write your own.>

1. <All source is TypeScript. No .js files outside config.> (evidence: `<tsconfig.json>`)
2. <The domain layer imports nothing from infrastructure.> (evidence: `<src/domain/>`)
3. <No secret is ever read outside the env module.> (evidence: `<src/env.ts>`)

## Where things live

<A short map. Not a file listing. The agent greps; this tells it where to grep first.>

- `<src/>` — <what>
- `docs/decisions/` — ADRs. Read before proposing an architectural change.
- `docs/conventions/` — how we write code here.
- `docs/CONTEXT.md` — domain vocabulary. Use these words exactly.
- `docs/ui/TOKENS.md` — every visual value. Components define none of their own.
- `docs/ui/COMPONENTS.md` — what exists. Read before building a component.
- `docs/tickets/` — the work queue. See `docs/tickets/README.md`.
- `docs/RUNBOOK.md` — what to do when production breaks.

## Skills

Setup: `/start-project` — run once, on day one.

Workflow: `/new-feature` `/fix-bug` `/refactor` `/perf` `/review` `/commit` `/research` `/end-session`

Tickets: `/to-tickets` `/triage` `/pick-next`

Frontend: `/design-system` `/new-component` `/loading-states` `/ui-details`

Contracts and data: `/api-contract` `/db-migration`

Infrastructure: `/ship` `/docker-service` `/queues-and-rate-limits` <`/provisioning-safety`>

Always applies: `sensitive-code` on auth, permissions, payments, and deletion. `unslop` on every
prose surface, including your replies.

Maintenance: `/audit-foundation` — run when the session-start hook reports drift.

## Working agreement

- Plan before editing anything that crosses a file boundary. Show the plan, wait for a yes.
- Scope discipline: unrelated problems found along the way get listed, not fixed.
- Never mark work done without running the verification the relevant skill requires.
- A passing build is not a passing feature. Exercise the real path.
- Prose follows `.claude/skills/unslop/SKILL.md`. That covers commit messages, PR descriptions,
  ADRs, session logs, ticket text, docs, and your replies in this session. Not code.
