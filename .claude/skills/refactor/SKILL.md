---
name: refactor
description: Restructure existing code without changing behavior. Use for refactor, clean up, extract, simplify, or restructure requests.
---

# Refactor

A refactor changes structure and never behavior. If behavior must change, that is a feature or a fix.
Say so and switch skills.

## 1. Safety net first

- Find the tests covering the target. Run them. Record that they pass.
- Critical path uncovered? Write characterization tests before touching anything. They capture current behavior, imperfections included.
- No safety net possible? Warn the user and get explicit approval before proceeding.

## 2. Name the target shape

- Two or three lines: what shape the code takes when this is done.
- Check it against `docs/decisions/` and `docs/conventions/`. A refactor that contradicts an ADR needs a new ADR first.
- Large refactor: break it into steps that each leave the repo green. Never one giant diff.

## 3. Execute green to green

- One transformation at a time: extract, move, rename, inline. Then run tests and typecheck.
- Update every call site in the same step. Never leave a deprecated duplicate for later.
- Keep public interfaces stable unless a breaking change was explicitly approved.

## 4. Scope discipline

- Do not fix unrelated bugs. List them at the end.
- Do not rename outside the stated scope.
- Do not add features or options while you are in there.

## 5. Close out

- Full lint, typecheck, and affected tests.
- Summarize what moved where, what callers must know, and what you spotted but did not touch.
- Commit as `refactor(<scope>): <description>`.
