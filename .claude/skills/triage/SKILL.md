---
name: triage
description: Move tickets through the triage state machine. Use when the user asks to triage, groom the backlog, or when a ticket is missing information.
---

# Triage

Runs over `docs/tickets/open/`. The job is to make every ticket either actionable or explicitly parked.
A backlog full of half-written tickets is worse than a short one.

## States

```
needs-triage -> needs-info -> ready -> in-progress -> done
                    |            |          |
                    +---------> wontfix <---+
                                 |
                              blocked (open blockers, returns to ready when they close)
```

- `needs-triage` — arrived, not yet assessed. Default for anything new.
- `needs-info` — cannot proceed without an answer from a human. The question is written in the ticket.
- `ready` — scope clear, acceptance criteria checkable, no open blockers. Pickable.
- `blocked` — everything is clear but a blocker is open.
- `in-progress` — someone or something is working on it now.
- `done` — acceptance criteria met and verified.
- `wontfix` — closed with a recorded reason. The reason is the whole point.

## Triaging one ticket

Ask in order, and stop at the first no:

1. Is the problem statement understandable without asking the author? No: `needs-info`, write the specific question.
2. Are the acceptance criteria checkable? No: rewrite them, or `needs-info` if you cannot.
3. Is it still worth doing? No: `wontfix` with the reason.
4. Are its blockers closed? No: `blocked`.
5. Otherwise: `ready`, and set a priority.

## Priority

- `p0` broken in production, or blocking every other ticket.
- `p1` this milestone.
- `p2` wanted, not scheduled.
- `p3` someday. Be honest. Most backlogs are p3 wearing a p2 label.

## Session shape

- Default to the full `needs-triage` set. The user can scope it narrower.
- Batch the questions. Present everything needing a human answer in one list at the end rather than interrupting per ticket.
- Report counts by state before and after, then run `scripts/ticket.sh index`.

## Hard rules

- Never set `ready` on a ticket with open blockers.
- Never close as `wontfix` without a reason written in the file.
- Never invent acceptance criteria the user did not agree to. Ask.
