---
name: fix-bug
description: Diagnose and fix a bug, error, crash, regression, or unexpected behavior. Use whenever something works differently from how it should.
---

# Fix bug

Gated. Do not advance to the next phase until the current one produces its stated artifact.
The most expensive failure mode in this repo is fixing the layer that looked guilty instead of
the layer that was.

## Phase 1: reproduce

Artifact: a reliable way to trigger the failure.

- Get the exact error, stack trace, or observed versus expected behavior. Unclear? Ask before investigating.
- Reproduce it yourself. A bug you cannot trigger is a bug you cannot confirm you fixed.
- Narrow when it broke: `git log` on the suspect area. A recent regression collapses the search.

Cannot reproduce: say so and stop. Do not fix speculatively.

## Phase 2: isolate

Artifact: the smallest scope where behavior diverges from expectation.

- Spawn `codebase-scout` to map the path rather than reading half the repo into context.
- Follow the data, not the symptom. The component that renders wrong is rarely the component that is wrong.
- Temporary logging and asserts are fine here. Remove them before committing.

## Phase 3: hypothesize, then prove

Artifact: a failing test, or a reproduction through the exact suspected path.

- State the suspected root cause in one sentence.
- Prove it before touching the fix. Multiple candidates: rank by likelihood, check the cheapest first, never test two at once.
- If a change makes the symptom disappear but you cannot explain the mechanism, you have not found the cause. Go back to phase 2.

## Phase 4: fix

- Fix the cause, not the symptom. No try/catch wrapped around broken logic, no defensive null check that hides why the value was null.
- Minimal diff. Zero unrelated refactoring.
- Race conditions and async ordering: fix the guarantee. Never add a sleep or a retry to mask it.

## Phase 5: prevent

- The failing test from phase 3 becomes the permanent regression test. It must fail without the fix and pass with it.
- Grep for the same pattern elsewhere. List what you find. Fix only with approval.
- A misleading doc caused it? Correct the doc in the same commit.
- Commit as `fix(<scope>): <description>`.

## Hard rules

- Never skip phase 3.
- Never fix two hypotheses in one change.
