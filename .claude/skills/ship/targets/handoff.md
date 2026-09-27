# Target: a pipeline you do not control

Client infrastructure, their CI/CD, their ops team. You are shipping a change into someone else's
process. Your job is to make the handoff verifiable, not to deploy.

## Before writing any code

Find out and record in root CLAUDE.md:

- Who deploys, and on what schedule. A client with a Thursday release train makes Wednesday merges different from Friday ones.
- What the pipeline runs. If it runs lint and tests you do not run locally, you will find out at the worst moment. Run them locally first.
- Where env vars live and who can add one. This is usually the longest lead time on the whole change, and it is the one people discover last.
- What the rollback path is, and whether you can trigger it.
- Whether migrations are part of the pipeline or a separate DBA-owned step.

Unknown answers are a blocker, not a detail. Raise them before the work starts, not at handoff.

## Shipping the change

- Every configuration requirement goes in the PR description explicitly: new env vars with what they do and an example value, migration ordering, any manual step. Assume the person deploying did not read the diff.
- New env var: it must be set in their environment before the code merges. Say this in the PR, in one line, at the top.
- Match their conventions, not yours. Their commit format, their branch naming, their PR template.
- Leave the repo deployable by someone who has never spoken to you.

## Verifying

- You may not have production access. Get someone who does to exercise the specific path and report back, and give them the exact steps rather than asking them to "check it works".
- If you cannot verify at all, say so in writing at handoff. Silence reads as confirmation.

## Hard rules

- Never deploy to a client environment without their explicit go-ahead, even with access.
- Never add a required env var without flagging it in the PR description.
- Never assume their pipeline runs what your local checks run.
