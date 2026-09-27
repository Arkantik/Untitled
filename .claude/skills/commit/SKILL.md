---
name: commit
description: Stage and commit work. Use when the user asks to commit, or at checkpoints during a larger task.
---

# Commit

## Before staging

- `git status` and `git diff`. Read what you are about to commit.
- Never stage: env files, credentials, generated build output, editor directories, debug logging you added while investigating.
- Unrelated changes in the working tree? Split into separate commits rather than one mixed commit.

## Message

`<type>(<scope>): <description>`

Types: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `perf`.

- Description in the imperative, lower case, no trailing period.
- Body only when the why is not obvious from the diff. Explain the reason, not the mechanics.
- Reference the ticket when one exists: `refs #<id>` or the local ticket id.

## Hard rules

- Never commit with failing typecheck or lint.
- Never use `git add -A` without reading `git status` first.
- Never amend or force push a commit that has already been pushed unless the user asks.
- Never commit generated output without saying so in the message.
