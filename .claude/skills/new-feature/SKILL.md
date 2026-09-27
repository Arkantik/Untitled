---
name: new-feature
description: Build a new feature or capability end to end. Use when the user asks to add, build, implement, or create something that does not exist yet.
---

# New feature

## 1. Know what you are building

- Restate the requirement in two sentences. If you cannot, you do not have enough to start. Ask.
- Working from a ticket? Read it, including its acceptance criteria and its blockers. Do not start a ticket whose blockers are open.
- Check `docs/CONTEXT.md` for the vocabulary. Name things with the words already in use, not new synonyms.

## 2. Plan before editing

- Spawn `codebase-scout` to map the code this touches. Keep the main context lean.
- State the plan: what files change, what gets created, where the seams are, which tests prove it.
- Decide test seams now, while the design is fresh. After the code exists you will rationalize whatever it already does.
- Crosses a module boundary or contradicts an ADR? Stop and raise it before writing code.

## 3. Implement

- Dependency order: core logic first, integration second, UI last.
- Build the minimum that satisfies the requirement. No speculative options, no abstractions for a second caller that does not exist.
- Follow `docs/conventions/` and any directory-scoped CLAUDE.md.
- Checkpoint-commit coherent units with `/commit`.

## 4. Verify, in this order

1. Lint and typecheck from the commands table in root CLAUDE.md. Must pass.
2. Tests for every new unit of logic: happy path plus at least one failure path.
3. Trace one full request through the code by hand: input validation, auth, logic, output.
4. UI work: confirm loading, error, and empty states actually render.
5. Generated a file tree? Run `scripts/check-scaffold.sh`. Empty files break installs silently.

## 5. Close out

- Non-trivial diff: run `/review` on it.
- Update the ticket status if one exists.
- Run `/end-session`.

## Hard rules

- Never report done on unverified work.
- Never add a dependency without saying why the standard library or an existing dependency will not do.
