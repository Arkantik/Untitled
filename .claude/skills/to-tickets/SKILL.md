---
name: to-tickets
description: Turn a plan, spec, or conversation into tickets. Use after a design discussion, when the user says break this down, or when a task is too large for one session.
---

# To tickets

Converts something already decided into a queue you can pick up cold in three weeks.
This skill does not design. If the shape is still open, that is a decision ticket, not a work ticket.

## 1. Find the slices

- Each ticket is a tracer bullet: a thin vertical slice that leaves the app working when it lands. Not a layer, not a file.
- A ticket one person finishes in one sitting is the right size. Bigger means split, smaller means merge.
- Anything still undecided becomes a `decision` ticket, with the options and what would settle it. Never a work ticket with a question inside.

## 2. Declare the edges

- For each ticket, list what must land before it can start, by ticket id.
- If everything depends on everything, the slices are wrong. Go back to step 1.
- A ticket with no blockers is immediately pickable. Aim for at least one.

## 3. Write them

Use `scripts/ticket.sh new "<title>"`, then fill the template. Every ticket needs:

- Problem: what is wrong or missing, in the project's own vocabulary from `docs/CONTEXT.md`.
- Acceptance criteria: checkable statements. "Works correctly" is not one. "Returns 409 when the slug already exists" is.
- Blocked by: ticket ids, or empty.

Leave status at `needs-triage` unless the user confirms scope and priority now.

## 4. Report

- Show the list with ids, titles, and the blocking graph as a short list of edges.
- Name the pickable ones.
- Rebuild the index: `scripts/ticket.sh index`.

## Hard rules

- Never write a ticket whose acceptance criteria you could not verify yourself.
- Never bury an open question inside a work ticket.
