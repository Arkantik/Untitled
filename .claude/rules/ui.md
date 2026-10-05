---
globs: ["apps/web/src/**/*.tsx", "apps/web/src/**/*.css", "apps/web/src/styles/**"]
description: UI guardrails: tokens, components, accessibility, responsive, icons
---

## Before any UI change

Read these docs before modifying UI code:

- `docs/ui/TOKENS.md` (every visual value)
- `docs/ui/DESIGN.md` (how to build correctly)
- `docs/ui/COMPONENTS.md` (what exists already)

Check COMPONENTS.md before building anything new. If it exists, use it. If it almost fits,
extend it with a variant. Invoke `/new-component` for new components.

## Tokens only

Components define no colors, spacing, radius, or font sizes of their own. Every value comes
from TOKENS.md. No arbitrary Tailwind values (`p-[13px]`). No hardcoded hex colors. No inline
`style` props for token-covered values. Class composition uses `cva` + `cn` from `~/lib/utils`.

## Borders and dividers

Always use `border-border` explicitly on every `border` or `divide` utility, never rely on
Tailwind's default border color. Write `border border-border`, `border-b border-border`,
`divide-y divide-border`, etc. This ensures the token maps correctly in both themes.

## Accessibility (non-negotiable)

- `type` on every `<button>` (`type="button"` unless it submits a form)
- `aria-label` on every icon-only control
- `aria-hidden` on every decorative icon
- Semantic landmarks: `<header>`, `<nav>`, `<aside>`, `<main>`, `<footer>`
- `aria-current="page"` on active nav links (omit entirely when inactive, never `false`)
- `aria-expanded` on disclosure controls
- Focus ring visible. Never suppress with `outline-none` without a replacement.
- WCAG AA minimum (4.5:1 normal text, 3:1 large text and UI components)
- Color never carries meaning alone. Pair with text or icon.

## Responsive

Mobile-first. Larger breakpoints override via `compact:`, `regular:`, `wide:` prefixes.
No hardcoded pixel widths. Test at all three breakpoints.

## Icons

- `@hugeicons/react` only. No Lucide, no other icon libraries.
- Every interactive icon button: `group` on the container, wrap icon in a `<span>` with
  `transition-transform duration-fast hover:scale-110 hover:-rotate-6`.

## Chart animation

Every Recharts widget must follow the three-part pattern in `docs/ui/DESIGN.md#chart-animation`:

1. `useAnimateOnce(key)`: pass `isAnimationActive={animate}` to every series element. Never
   hardcode `true` (replays on re-renders) or `false` (never animates).
2. `memo()`: wrap the chart component. Without it, parent re-renders flip `animate` to `false`
   mid-draw and Recharts jumps to the final state.
3. `useMemo()`: memoize data transforms in both parent and widget. Unstable references bypass
   `memo` entirely.

`useCountUp` must live in a child component, never in a component that also renders charts.

## Interactive components

Use Radix UI primitives. Do not re-implement dialog, dropdown, select, switch, tooltip.

## Skills to invoke

- `/ui-details` when polishing interactions or reviewing visual correctness
- `/loading-states` when the app feels slow or shows too many loading indicators
- `/design-system` when auditing or establishing tokens
