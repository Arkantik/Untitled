---
name: audit-foundation
description: Verify the agent docs still match reality. Use when the session-start hook reports drift, or on request. Never run unprompted.
---

# Audit foundation

Stale docs are worse than no docs, because the agent follows them confidently.
This skill edits only `CLAUDE.md` and `docs/`. It never touches source code.

## 1. Commands

Run every command in the root CLAUDE.md commands table. Each either works as written or gets fixed.
A command that needs a flag not listed is wrong as written.

## 2. Path anchors

Every path referenced in `CLAUDE.md`, `docs/conventions/`, and directory-scoped CLAUDE.md files must exist.
Report each missing one with the rule that cites it. A rule whose evidence path is gone is a dead rule.

## 3. Dead rules

For each non-negotiable, grep for violations.

- Zero violations and the pattern is everywhere: the rule is alive. Keep it.
- Many violations and nobody noticed: the rule is dead. Either enforce it or delete it. A rule the codebase ignores teaches the agent that rules are optional.

## 4. ADRs superseded in practice

Read `docs/decisions/`. For each, check whether the code still does what it says.
Where the code diverged and the divergence was deliberate, propose a superseding ADR.
Never silently edit an ADR: they are a record, not a spec.

## 5. Vocabulary

Check `docs/CONTEXT.md` terms against the code. A term nobody uses is noise. A concept in the code
with no term is a gap. Propose both edits.

## 6. Report and record

- Present findings grouped by file, each with a proposed edit. Wait for approval before writing.
- After applying, set `last_audit=<today>` in `docs/.foundation-state`.
- Commit as `chore(docs): foundation audit <YYYY-MM-DD>`.

## Hard rules

- Never edit source code.
- Never apply an edit without approval.
