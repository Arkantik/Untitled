---
name: research
description: Investigate a technical question, library, or approach before committing to it. Use when the user asks to research, compare, evaluate, or figure out how something works.
---

# Research

## 1. Sharpen the question

- Restate what decision this research is meant to settle. Research without a decision attached is browsing.
- Name the constraints that rule options out: existing stack, deployment target, team size of one, cost ceiling.

## 2. Gather

- Current codebase first. How do we already solve adjacent problems here?
- Then primary sources: official docs, the library's own repo, release notes. Delegate to `docs-researcher` for anything long.
- Blog posts and forum answers are hints, not evidence. Verify against the source.

## 3. Report

- Lead with the recommendation and the one reason it wins.
- Two or three real alternatives, each with what it costs you, not just what it offers.
- State what would change the answer. A recommendation with no failure condition has not been thought through.
- Flag anything you could not verify. Never present an inferred API as a documented one.

## 4. Record

- Decision made? Write an ADR in `docs/decisions/`. The reasoning is the valuable part, not the conclusion.
- Decision deferred? Open a decision ticket so it does not get rediscovered from scratch in a month.
