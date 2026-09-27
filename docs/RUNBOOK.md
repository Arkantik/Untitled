# Runbook

What to do when production breaks. Written before you need it, because the moment you need it is
the worst moment to be working it out.

Skip this file for client projects where someone else operates the system. Their runbook is theirs.

## Fast facts

|                                  |                    |
| -------------------------------- | ------------------ |
| Production URL                   | `<>`               |
| Deploy target                    | `<see CLAUDE.md>`  |
| Where logs live                  | `<>`               |
| Where metrics live               | `<>`               |
| Database host and how to connect | `<>`               |
| Last known good version          | `<how to find it>` |

## First five minutes

1. Is it down, or slow, or wrong? These have different causes and different responses.
2. What changed? Last deploy, last migration, last config edit. Most incidents are the most recent change.
3. Roll back if a deploy is the likely cause. Diagnose from a working system. See `/ship` step 7.
4. If a migration ran, say immediately whether the old code works against the new schema. If not, you are fixing forward and everyone needs to know now rather than in twenty minutes.

## Known failure modes

Fill this in as they happen. This section is the reason the file exists.

### `<symptom>`

- Looks like: `<what you see>`
- Usually caused by: `<>`
- Check: `<the command or dashboard>`
- Fix: `<>`

## Recovery

- Restore a database backup: `<exact command, and how long it takes>`
- Rotate a leaked credential: `<where each one lives, in the order they must be rotated>`
- Drain and restart workers without losing jobs: `<>`
- Put up a maintenance page: `<>`

Untested recovery steps are guesses. Run each one at least once, on staging, and note the date here.

## After

Write the incident into `docs/sessions/` with what broke, the actual cause, and what would have
caught it. Then add the failure mode above. An incident that produces no durable artifact will
happen again.
