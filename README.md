# Project shell

The base layer for a new project: agent configuration, skills, hooks, a ticket queue, and the
doc structure that keeps them honest. Stack-agnostic on purpose. Nothing here assumes a
framework, a language runtime, or a repo shape.

This is v2 of the foundation kit, with the infrastructure skills and a ticket system added.

## Install

```
./bootstrap.sh /path/to/your/project                    # defaults to coolify
./bootstrap.sh /path/to/client-project --target=handoff
```

It copies everything except itself and this README, never overwrites an existing file, keeps only
the deploy target you name, and writes that target into `CLAUDE.md`.

Then fill the placeholders in `CLAUDE.md`, starting with the commands table.

## What is in it

```
CLAUDE.md                root agent instructions, placeholders to fill
AGENTS.md                pointer for non-Claude agents
.claude/
  settings.json          hook wiring and permission rules
  hooks/                 session-start drift detection, bash guard, post-write check
  agents/                codebase-scout, code-reviewer, docs-researcher
  skills/                22 skills, listed below
docs/
  CONTEXT.md             domain vocabulary
  conventions/           how code gets written here, each rule with an evidence path
  decisions/             ADRs
  sessions/              session logs
  ui/                    TOKENS.md and COMPONENTS.md
  tickets/               local markdown queue
  RUNBOOK.md             what to do when production breaks
.github/workflows/       optional CI template that runs the commands table
scripts/
  ticket.sh              ticket CLI
  check-scaffold.sh      empty-file and install verification
```

## Skills

Setup: `start-project` — the day-one interview that fills every placeholder in this shell.

Workflow: `new-feature` `fix-bug` `refactor` `perf` `review` `commit` `research` `end-session`

Tickets: `to-tickets` `triage` `pick-next`

Frontend: `design-system` `new-component`

Contracts and data: `api-contract` `db-migration`

Infrastructure: `ship` `docker-service` `queues-and-rate-limits` `provisioning-safety`

Always applies: `sensitive-code`, which loads on its own whenever a change touches auth,
permissions, payments, or deletion. And `unslop`, on every prose surface the repo produces.

Delete what a project does not need. `provisioning-safety` only where the product creates
infrastructure for users. `queues-and-rate-limits` only where there is a queue or a rate-limited
external API. The frontend pair only where there is a UI. An unused skill is context you pay for
every session.

## Prose

`unslop` strips AI tells from commit messages, PR descriptions, ADRs, session logs, ticket text,
docs, and the agent's own replies. Adapted from the skill of the same name in Lauren Tan's pstack
pack. It is wired two ways on purpose: as a skill file with the full rules, and as one line in the
root CLAUDE.md working agreement, because a skill only loads when something triggers it and this
one needs to be on for every sentence.

It does not apply to code. The rules are about writing.

## Frontend

`design-system` runs once, before the first component exists, and produces `docs/ui/TOKENS.md`.
Retrofitting tokens onto a built UI is the most tedious refactor in frontend work, which is why
`start-project` schedules it on day one. It also has an audit mode for a UI that grew without them.

`new-component` checks `docs/ui/COMPONENTS.md` before building anything, because the most common
waste in an agent-built frontend is the fourth Button. It then enforces the part that gets skipped:
loading, empty, error, and partial states, long content, keyboard operation, and focus handling.

`docs/ui/COMPONENTS.md` ships as a catalog of the components most applications end up needing, each
with the states it owes the user. It is a spec rather than a library on purpose. Actual components
would tie this shell to one framework and one version and be stale within two projects. What stays
true is the contract, which survives a move from React to Angular. The implementation does not.

## Deploy targets

`ship` holds the rules that are true everywhere: env var parity before building, migration ordering
against currently running code, deploy order across services, verification on the real app, and a
rollback path noted before you start. Platform mechanics live in one file per target under
`.claude/skills/ship/targets/`, and the skill reads only the one this project uses.

| Target           | For                                                                                          |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `coolify`        | Default. Your own projects on the VPS.                                                       |
| `docker-compose` | A VPS without a control plane.                                                               |
| `vercel`         | Client frontends deployed from git.                                                          |
| `handoff`        | Client infrastructure you do not control. Makes the handoff verifiable instead of deploying. |
| `custom`         | Copies `_template.md`. Fill it in.                                                           |

`handoff` is the one worth reading before a client engagement rather than during it. Its checklist
is mostly questions to answer before the work starts: who deploys, on what schedule, where env vars
live and who can add one, and what the rollback path is. Those answers have the longest lead time
and get discovered last.

Adding a target: copy `_template.md`, fill it in, name it in `CLAUDE.md`. The traps section is the
reason the file exists, and it gets written as you hit them, not upfront.

## The ticket workflow

Designed to earn its keep at one developer and survive the move to a real tracker later.

```
conversation or spec
   -> /to-tickets     writes tracer-bullet tickets with blocking edges
   -> /triage         moves each to ready, needs-info, blocked, or wontfix
   -> /pick-next      picks the highest-value unblocked ticket and starts it
   -> /new-feature or /fix-bug
   -> /review         checks the diff against the ticket's acceptance criteria
   -> /commit
   -> /end-session    records state, ticket moves, and doc drift
```

Tickets are markdown files in `docs/tickets/`, so they version with the code that resolves them
and show up in diffs. `scripts/ticket.sh` handles ids, state transitions, and the index. The
frontmatter maps one to one onto GitHub Issues when you outgrow it, which happens when a second
person joins and not before.

## The anti-decay system

Stale docs are worse than no docs, because the agent follows them confidently. Three mechanisms:

1. The session-start hook nudges when CLAUDE.md has gone 50 commits without a change, when the
   last audit was more than 45 days ago, or when session logs need rotating. Thresholds sit at
   the top of the script.
2. `/audit-foundation` runs every command in the commands table, checks that every cited path
   exists, greps for violations to find rules the codebase already ignores, and records the
   audit date.
3. Rules cite an evidence path, and `/end-session` has a mandatory doc drift section. A
   contradiction found mid-work gets fixed or logged, never silently worked around.

## Guards

The bash hook blocks force pushes, hard resets, blanket working-tree discards, recursive deletes
of root or home paths, and scaffolding with `touch`. The last one is specific: `touch` creates
0-byte files that pass an existence check and break the install later, which has happened here
before. The post-write hook warns on empty files and on anything shaped like a live credential.

## Keeping copies in sync

Three tiers, because they solve different halves of the problem.

**Machine-wide, for skills with no project-specific content.**

```
./bootstrap.sh --global
```

Copies `unslop`, `commit`, `research`, and `perf` into `~/.claude/skills/`, which Claude Code reads
in addition to a repo's own. Edit once, applies in every repo on that machine. They do not travel
to another machine, to CI, or to anyone who clones a client repo. Anything that must travel stays
per-repo.

**Per-repo, via the sync script.** This repo is upstream.

```
./sync.sh register ~/projects/veybase     # track a project
./sync.sh check                           # what has drifted, and in which direction
./sync.sh push                            # update every tracked project
./sync.sh push --add-new                  # also install files a project is missing
./sync.sh pull ~/projects/veybase .claude/skills/commit/SKILL.md
```

`shell.manifest` records who owns what. Skills, agents, hooks, and scripts belong to the shell.
`CLAUDE.md`, `settings.json`, tokens, conventions, ADRs, tickets, and the runbook belong to the
project and are never touched.

Three behaviours worth knowing. `push` only updates files a project already has, so a project that
dropped a skill never has it reappear; `--add-new` is the explicit opt-in for introducing one. A
file edited more recently in the project is reported as AHEAD and skipped rather than overwritten,
so an improvement made mid-task is never lost, and `pull` brings it upstream. A project that
deliberately removed a skill lists it in `.claude/.shell-ignore` so even `--add-new` leaves it out.

**claude.ai preferences, by hand.** There is no API, no file, and no sync. Settings only.

```
./sync.sh prefs
```

prints a paste-ready block from the unslop skill. Re-run it after editing the rules so the two
copies do not drift. This is the one place automation cannot reach, and pretending otherwise is
how it quietly falls out of date.

## Maintaining it

An improvement made while working on a project goes upstream first, then forward to the others.
`sync.sh check` is what tells you a project has moved ahead. Without that loop you get five
diverging copies within a year.

Worth adding when you know what goes in them: an observability skill, once the VPS logging and
alerting setup is settled, and a project-specific skill for whatever each codebase does that
nothing else does.
