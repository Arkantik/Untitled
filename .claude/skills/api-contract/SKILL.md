---
name: api-contract
description: Change an API surface safely. Use when editing a GraphQL schema, REST route, shared type package, or anything another codebase consumes.
---

# API contract

A schema is a promise to code you are not editing. Deployed clients, generated types in another
package, a client's integration, a mobile app you cannot update. Treat every change as additive
until proven otherwise.

## Additive, and therefore safe

- A new optional field, argument, or endpoint
- A new value in an output enum, if clients handle unknown values
- Loosening a validation rule
- A new type

## Breaking, and therefore a migration

- Removing or renaming anything
- Making an optional argument required
- Narrowing a return type, including making a nullable field non-null in a way clients did not expect
- Changing the meaning of a field while keeping its name. This is the worst one, because nothing fails at compile time and the data is quietly wrong.
- A new value in an input enum, for clients validating against the old set

## Making a breaking change

Never edit in place. Four steps, at least two deploys:

1. Add the replacement alongside the old one.
2. Mark the old one deprecated, with a reason and the replacement named.
3. Migrate every consumer you control. Find them by grepping the generated client, not by memory.
4. Remove the old one in a later release, once you can show nothing calls it.

Cannot see all consumers, as with a public API or a client integration: step 4 needs a notice period
and a stated date, not a judgement call.

## Generated types

- Regenerate in the same commit as the schema change. A schema and its generated client drifting apart produces type errors that look unrelated to the change that caused them.
- The generated output is committed or it is not, and either is fine, but the choice is recorded in CLAUDE.md. Half-committed generated code causes merge conflicts nobody can resolve.
- A regeneration producing a diff larger than the schema change means something else changed: a codegen version, a plugin, a config. Investigate before committing it.

## Errors are part of the contract

- Error shapes and codes are as public as the success path. Changing a code breaks client branching.
- New failure modes get a new code, not a reused one.
- Never leak internal detail through an error message on a public surface.

## Before finishing

- List every consumer of the changed surface, by path.
- State plainly whether this is additive or breaking. If you are unsure, it is breaking.
- Update whatever documents the API in the same commit.
