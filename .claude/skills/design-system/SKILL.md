---
name: design-system
description: Establish or audit a project's design tokens and UI foundations. Use before building the first component, when a UI has inconsistent spacing or color, or when adopting a component library.
---

# Design system

Two modes. Establish, on a project with no UI yet. Audit, on one that grew without tokens.
Both produce `docs/ui/TOKENS.md` as the single reference every component reads from.

## Establish

Decide these in order, because each constrains the next. Propose defaults; the user corrects.

**Spacing scale.** One scale, geometric, four to seven steps. Every margin, padding, and gap comes
from it. Arbitrary values are the single largest source of visual drift in a codebase, and they
accumulate one reasonable exception at a time.

**Type scale.** Sizes, line heights, weights. Fewer than you think: four sizes and two weights
covers most applications. Pair line height with size rather than setting it independently.

**Color.** Define semantic roles, not hex values: surface, surface-raised, border, text, text-muted,
primary, and one each for destructive, warning, and success. Components reference roles. A component
that names a hex value or a palette step directly cannot be themed and will break in dark mode.

**Radius, shadow, border.** Three values each at most. Shadows carry elevation meaning, so tie them
to a level rather than picking per component.

**Dark mode.** Decide now, even if the answer is no. Retrofitting means revisiting every color
reference. If yes, roles map to two palettes and components never branch on theme.

**Breakpoints.** Three is usually enough. Name them by intent, not device.

Write all of it to `docs/ui/TOKENS.md`, then implement it in whatever the project uses: CSS custom
properties, a Tailwind theme extension, or the library's theming mechanism. Tokens that live only
in a document get ignored within a month.

## Audit

Run on a UI that already exists.

1. Grep for hardcoded values: hex colors, pixel spacing outside the scale, font sizes set inline.
2. Group findings by how often each off-scale value appears. A value used twenty times is a missing token, not a violation. A value used once is a mistake.
3. Report the token set the code is already implicitly using. Codifying reality beats imposing a scale nobody follows.
4. Propose the migration in steps that each leave the UI working. Never one sweeping replacement.

## Component library

Adopting one (shadcn/ui or similar): its components must consume the project's tokens, not ship
their own. Wire the theme before copying in the second component, not after the twentieth.

## Hard rules

- Never let a component define a color, spacing, or radius value of its own.
- Never add a token that has exactly one consumer.
