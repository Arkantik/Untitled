---
description: Code conventions enforced on every change — file size, comments, vocabulary, shared code
---

## File size

Keep files under ~150 lines. When a file would exceed that, split by logical unit (types,
sub-components, utilities, orchestrator) before adding more. Propose the split; do not silently
grow the file.

## Comments

Default: no comments. The only valid comment explains a non-obvious WHY.

Never write:

- Decorative separators: `// ── Section ──`, `// =========`
- JSX labels restating the element: `{/* Header */}` above `<header>`
- Section headers above their own function or export
- Narration: `// fetch the user`, `// set state`
- Empty-catch narration: `} catch { // ignore }` — leave the block empty
- Multi-line blocks explaining what code does

## Domain vocabulary

Before naming anything new, check `docs/CONTEXT.md`. Use the words already defined there.
Do not invent synonyms.

## Shared code

Types and constants shared between apps live in `@pulsarr/shared`. Never duplicate them.
Database schemas exist for both SQLite and PostgreSQL — changes must cover both.
