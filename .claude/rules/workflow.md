---
description: Skill loading triggers, planning discipline, verification requirements
---

## Load the right skill before starting work

| Task type                             | Skill to invoke   |
| ------------------------------------- | ----------------- |
| New feature or capability             | `/new-feature`    |
| Bug, error, regression                | `/fix-bug`        |
| Restructure without behavior change   | `/refactor`       |
| New UI component                      | `/new-component`  |
| Auth, permissions, payments, deletion | `/sensitive-code` |
| Performance                           | `/perf`           |
| Database schema change                | `/db-migration`   |

## Before cross-file changes

Plan before editing anything that crosses a file boundary. Spawn the `codebase-scout` agent
to map the code the task touches. Show the plan, wait for approval.

## Use the agents

- `codebase-scout`: before any change crossing a file boundary
- `docs-researcher`: when the task depends on a library's real API
- `code-reviewer`: when reviewing large diffs

## Read the docs

Before proposing an architectural change, read `docs/decisions/`. Before touching conventions,
read `docs/conventions/README.md`. Before UI work, read `docs/ui/TOKENS.md`, `DESIGN.md`,
and `COMPONENTS.md`.

## Verification

- Never mark work done without the verification the relevant skill requires
- A passing build is not a passing feature. Exercise the real path.
- UI work: confirm loading, error, and empty states actually render

## Scope discipline

Unrelated problems found along the way get listed, not fixed.
