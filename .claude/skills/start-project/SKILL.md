---
name: start-project
description: Set up a new project's foundation on day one. Use immediately after bootstrapping the shell into an empty or near-empty repo, before writing any feature code.
---

# Start project

Fills the shell's placeholders and verifies what it wrote. Runs once. The goal is a CLAUDE.md an
agent can act on in a cold session, not a complete project plan.

Ask in batches, not one question at a time. Propose a default for every question so the user can
accept rather than compose an answer.

## Pick a mode first

**New project**, no code yet: the source of truth is the user. Interview, then write. Follow the
steps below as written.

**Existing project**, code already there: the source of truth is the codebase. Read first, propose
what you found, and only ask about what the code cannot tell you. Every step below has an existing
project note. Never interview someone about facts sitting in their repo.

If `CLAUDE.md` already existed before the shell was copied in, bootstrap left it alone and the
shell's version is at `CLAUDE.md.shell`. Merge them: keep the project's content, adopt the shell's
structure, in particular the commands table, the deploy target line, the skill index, and the
working agreement. Delete `CLAUDE.md.shell` when done.

## 1. What this is

- One paragraph: what the project does and who uses it.
- Own product or client work? Client work changes the deploy target, the commit conventions, and who verifies.
- Write it into the top of CLAUDE.md.
- Existing project: take it from the README or the existing CLAUDE.md. Confirm rather than ask.

## 2. Stack and commands

- Language, runtime, package manager, repo shape.
- Then fill the commands table, and run every command you wrote. A command that does not run as written is worse than a missing one, because the agent will trust it. If the project is empty, mark them `<not yet>` and say they must be filled before the first feature.
- Existing project: read the scripts block in the package manifest and any CI workflow. Run each candidate before writing it down. A script that exists but fails is the most valuable thing this step finds.

## 3. Deploy target

- Pick from `.claude/skills/ship/targets/`. Default `coolify` for own projects, `handoff` for client infrastructure.
- `handoff`: walk its pre-engagement questions now. Who deploys, on what schedule, where env vars live, who can add one, what the rollback path is. These have the longest lead time and get discovered last.
- Record the answer in the Deploy target line in CLAUDE.md, and delete the target files the project does not use.

## 4. Localization, if any

- Will this ship in more than one language? If yes, decide now, because retrofitting is expensive.
- Key structure, locale routing, where date, number, and currency formatting happens, and whether content is translated or duplicated.
- Record as an ADR. This is a decision people re-litigate later.

## 5. The first three non-negotiables

- Three rules maximum. The ones worth interrupting work over.
- Each needs an evidence path so `/audit-foundation` can check it mechanically.
- No evidence path yet because the code does not exist? Write the rule with the path it will live at, and verify at the first audit.
- Existing project: derive them from what the code already does consistently, then confirm. A rule the codebase already follows is free to enforce. A rule it half-follows is a decision, so raise it as one rather than writing it in.

## 6. Domain vocabulary

- Seed `docs/CONTEXT.md` with the terms already in use in the conversation. Three to five is plenty.
- For each, what it is and what it is not. The second line does more work than the first.
- Existing project: pull the terms from entity, model, and type names. Where two names mean the same thing, say so and ask which one wins.

## 7. UI, if the project has one

- Run `/design-system` before any component exists. Tokens retrofitted onto a built UI is the most tedious refactor in frontend work.
- Existing UI: run `/design-system` in audit mode instead. It reports the scale the code already uses implicitly, which is the one worth codifying. Seed `docs/ui/COMPONENTS.md` from the components that exist, so the next session stops rebuilding them.

## 7b. Backfill decisions, existing projects only

Decisions already made and not written down are the first thing lost. While the reasoning is still
recoverable, write an ADR for each choice that was contested, expensive to reverse, or where a
reasonable alternative was rejected. Stack choices, architecture shape, anything a future session
would otherwise reopen.

Keep them short. Context, decision, alternatives with the specific reason each lost, consequences
and what would make you revisit. Skip anything that had no alternative.

Then run `/to-tickets` over whatever work is already planned, so the queue reflects reality rather
than starting empty.

## 8. Verify and close

- Run `scripts/check-scaffold.sh` and confirm no placeholder markers remain in committed files.
- Set `last_audit` in `docs/.foundation-state` to today.
- Delete skills the project will not use. `provisioning-safety` unless it creates infrastructure for users. `queues-and-rate-limits` unless there is a queue or a rate-limited API. `db-migration` unless there is a database. Record each deletion in `.claude/.shell-ignore`, one path per line, so a later sync does not bring it back.
- Commit as `chore: project foundation`.
- Report what is still unfilled. Do not leave a placeholder without naming it.

## Hard rules

- Never invent a stack detail the user did not confirm.
- Never write a command into the commands table without running it.
