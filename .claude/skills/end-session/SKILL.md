---
name: end-session
description: Close out a working session. Use when the user says they are done, stopping, or wrapping up, and before any long break.
---

# End session

Writes `docs/sessions/YYYY-MM-DD-<slug>.md`. The reader is you, cold, in three weeks.

## Sections, all mandatory

**What changed.** Files and why, in one line each. Not a diff summary, a reason summary.

**Decisions made.** Anything a future session should not re-litigate. Load-bearing ones become an ADR in `docs/decisions/` instead, and get referenced here.

**Doc drift observed.** Any place the docs contradicted reality during this session. Small and obvious, like a renamed command: fix it now and record that you did. Judgement-based: log it here for `/audit-foundation`. Silently working around a stale rule guarantees the next session hits the same wall.

**Ticket state.** Which tickets moved, and to what. Run `scripts/ticket.sh index` so the index matches.

**Next steps.** Concrete and specific. "Continue the refactor" is not a next step. "Extract the resolver logic in `<path>` into a use case, tests already written" is.

**Uncommitted work.** If anything is uncommitted, say what and why. Never leave this implicit.

## Then

- Rotate: more than ten session logs means condense the oldest into a single dated summary file and delete them.
- If the session-start hook reported drift and you did not act on it, say so in Next steps.
