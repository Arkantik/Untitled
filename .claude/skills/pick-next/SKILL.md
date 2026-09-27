---
name: pick-next
description: Choose what to work on next and start it. Use for what should I do next, what is unblocked, or at the start of a working session.
---

# Pick next

## 1. Read the queue

- `scripts/ticket.sh index` to refresh, then read `docs/tickets/INDEX.md`.
- Candidate set: status `ready`, all blockers closed. Nothing else is pickable, whatever its priority.

## 2. Rank

In order:

1. `p0` always wins.
2. Among equal priority, prefer the ticket that unblocks the most others. Check the blocking graph, not the priority label.
3. Among equal unblocking power, prefer the smaller ticket. Finishing something beats starting something.

## 3. Present, do not decide alone

- Show the top three with one line each: id, title, what it unblocks, rough size.
- Recommend one and say why in a sentence.
- Wait for the user to pick.

## 4. Start it

- Set status `in-progress` via `scripts/ticket.sh status <id> in-progress`.
- Route by type: `feature` and `chore` to `/new-feature`, `bug` to `/fix-bug`, `decision` to `/research`.
- Carry the acceptance criteria into the work. They are the definition of done, and they are what `/review` checks the diff against.

## If nothing is pickable

Say so plainly, and report why: everything blocked, everything `needs-info`, or the queue is empty.
Then offer `/triage` or `/to-tickets`. Do not invent work.
