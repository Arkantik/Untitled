---
name: review
description: Review a diff, branch, or recent changes. Use before opening a PR, after finishing a feature, or on request.
---

# Review

Default scope: uncommitted changes plus the last commit. Large diffs: delegate the read-through
to `code-reviewer` and synthesize its report.

## Axes, in priority order

1. Correctness. Logic errors, unhandled error paths, race conditions, off-by-one, null flows the type system cannot catch.
2. Security. Injection, missing auth checks, secrets in code, unvalidated input reaching queries, commands, or file paths.
3. Spec fidelity. Does this implement the ticket or the stated requirement, all of it, and nothing extra? Scope creep is a finding.
4. Architecture. Boundary violations, contradictions with `docs/decisions/`, drift from `docs/conventions/`.
5. Standards. Naming, duplication, dead code, primitive obsession, functions doing two jobs. A documented repo standard always overrides a general smell.
6. Tests. Does the diff's logic have tests, and do they test behavior rather than implementation?

## Reporting

- Group by axis. Cite file and line for every finding.
- Separate blocking from non-blocking. Blocking means correctness, security, or spec fidelity.
- Smells are judgement calls, never hard violations. Say which is which.
- Found nothing on an axis? Say so explicitly rather than omitting it.

## Hard rules

- Review the diff, not the whole file. Pre-existing problems outside the diff go in a separate list.
- Never fix while reviewing. Report, then ask.
