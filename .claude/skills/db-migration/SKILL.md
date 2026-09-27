---
name: db-migration
description: Write or review a database migration. Use for schema changes, column additions, renames, drops, backfills, or index changes.
---

# Database migration

## Backward compatibility is the constraint

Old and new code run simultaneously during any rolling deploy. Every migration must be safe
against the currently deployed code, not just the code in your working tree.

Not backward compatible, and how to split it:

- Adding a non-nullable column: add nullable, backfill, deploy code that writes it, tighten in a later migration.
- Renaming a column: add the new one, write both, migrate readers, drop the old one later.
- Dropping a column: deploy code that stops reading it first. Drop in a later migration.
- Narrowing a type or adding a constraint: validate existing rows first, then apply.

## Before writing

- Read the existing migrations to match the conventions already in use.
- Confirm the change against `docs/decisions/` and the entity definitions.

## Every migration

- Has a working down migration, and you have run it.
- Is tested against a database with realistic data volume, not an empty one.
- Backfills in batches when the table is large. A single unbounded update statement locks the table.
- Creates indexes concurrently where the engine supports it.
- Contains no application logic. Data transformation only.

## Review checklist

1. Safe against currently deployed code
2. Down migration exists and works
3. No table-wide lock on a large table
4. Index creation does not block writes
5. Backfill batched and resumable
6. Entity or model definitions updated in the same commit

## Hard rules

- Never edit a migration that has already run anywhere. Write a new one.
- Never combine a schema change and a data backfill in a way that cannot be resumed after a failure halfway.
