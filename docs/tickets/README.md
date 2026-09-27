# Tickets

A local markdown queue. No account, no API, no network. One file per ticket, so tickets version
alongside the code that resolves them and diff in review.

## Layout

```
docs/tickets/
  INDEX.md        generated, do not hand-edit
  _template.md
  open/NNN-slug.md
  done/NNN-slug.md
```

## Commands

```
scripts/ticket.sh new "Title here"        create the next ticket from the template
scripts/ticket.sh status <id> <state>     move a ticket between states
scripts/ticket.sh close <id>              set done and move the file to done/
scripts/ticket.sh index                   rebuild INDEX.md
scripts/ticket.sh show <id>               print one ticket
```

## States

`needs-triage` `needs-info` `ready` `blocked` `in-progress` `done` `wontfix`

See `.claude/skills/triage/SKILL.md` for the transition rules. The short version: a ticket is
`ready` only when its problem is understandable, its acceptance criteria are checkable, and its
blockers are closed.

## Porting to GitHub Issues later

The frontmatter maps directly. `title` becomes the issue title, the body carries over unchanged,
`status` and `priority` become labels, and `blocked_by` becomes a task list or a native blocking
link. Keep ticket ids in commit messages and the history survives the move.

Port when a second person joins. Before that, a tracker is overhead.
