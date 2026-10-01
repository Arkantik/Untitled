# Design guide

Single reference for decisions beyond token values: markup rules for interactive elements,
contrast requirements, motion, dark mode, and layout. Read alongside `TOKENS.md` and
`COMPONENTS.md` before building or modifying any UI surface.

| What you need          | File                    |
| ---------------------- | ----------------------- |
| Every visual value     | `docs/ui/TOKENS.md`     |
| What components exist  | `docs/ui/COMPONENTS.md` |
| How to build correctly | this file               |

---

## Accessibility

Non-negotiable. Every interactive element must comply before it ships.

### Buttons

Every `<button>` must have a `type`. The browser defaults to `type="submit"` inside a `<form>`,
which triggers form submission from non-submit buttons.

| Context              | Value           |
| -------------------- | --------------- |
| Submits a form       | `type="submit"` |
| Does anything else   | `type="button"` |
| Resets a form (rare) | `type="reset"`  |

### Icon-only controls

Any control without visible text needs `aria-label`. When the label changes with state, update
it alongside:

```tsx
<button type="button" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
  <HugeiconsIcon icon={collapsed ? SidebarRight01Icon : SidebarLeft01Icon} aria-hidden />
</button>
```

### Decorative icons

An icon is decorative when adjacent text or a parent `aria-label` already names it. Mark it
`aria-hidden` so screen readers skip it.

An icon is **not** decorative when it is the sole indicator of meaning. Add a visually hidden
label in that case:

```tsx
<span className="sr-only">Warning</span>
<HugeiconsIcon icon={Alert02Icon} />
```

### Landmark elements

Use the semantically correct element. Landmarks let assistive technology users jump sections.

| Element    | Role          | Use                                                       |
| ---------- | ------------- | --------------------------------------------------------- |
| `<header>` | banner        | top bar, page header                                      |
| `<nav>`    | navigation    | any link group; add `aria-label` when multiple navs exist |
| `<aside>`  | complementary | sidebar, secondary content                                |
| `<main>`   | main          | primary page content                                      |
| `<footer>` | contentinfo   | page footer                                               |

```tsx
// Two navs on one page must be distinguishable
<nav aria-label="Breadcrumb">...</nav>
<nav aria-label="Main">...</nav>
```

### Navigation state

```tsx
// Active link in a site nav
<Link aria-current={active ? 'page' : undefined} ...>
```

Omit `aria-current` entirely when inactive. Never set it to `false`.

### Expanded / collapsed

```tsx
<button type="button" aria-expanded={open} onClick={toggle}>
  {group.label}
</button>
```

Add `aria-controls="<id>"` when the controlled element is not immediately adjacent in DOM order.

### Dialogs and drawers

Modal overlays need `role="dialog"` and `aria-modal="true"` so keyboard focus stays inside them.
Use `aria-labelledby` pointing to the dialog title.

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Delete post</h2>
  ...
</div>
```

The Dialog component from `components/ui/dialog.tsx` handles this automatically. Use it.

### Form fields

Use the `Field` component for every form control. It wires `id`, `aria-describedby`, and
`invalid` automatically.

```tsx
<Field label="Email" hint="We'll never share it." error={errors.email}>
  {(props) => <Input type="email" {...props} />}
</Field>
```

**Use the most specific `type` available:**

| Data            | type       |
| --------------- | ---------- |
| Email address   | `email`    |
| Password        | `password` |
| Search query    | `search`   |
| Phone           | `tel`      |
| URL             | `url`      |
| Number          | `number`   |
| Everything else | `text`     |

### Focus visibility

Never suppress the focus ring with `outline-none` unless you replace it with an equally visible
custom ring. The default is a 3px ring in the primary color.

`outline-none` on a Radix trigger is acceptable. Radix applies its own managed focus style.

### Keyboard navigation

Tab order follows DOM order. Never use positive `tabIndex` values. Radix handles keyboard
interaction inside its primitives; do not re-implement it.

---

## Color and contrast

AA is the floor. Target AAA wherever it can be achieved without compromising the design.

### WCAG 2.1 thresholds

| Content                               | AA      | AAA     |
| ------------------------------------- | ------- | ------- |
| Normal text (below 18pt or 14pt bold) | 4.5 : 1 | 7 : 1   |
| Large text (18pt+, or 14pt+ bold)     | 3 : 1   | 4.5 : 1 |
| UI components and graphical objects   | 3 : 1   | —       |
| Placeholder text                      | 4.5 : 1 | —       |
| Disabled elements                     | exempt  | —       |

### Approved pairings

Using semantic roles from `TOKENS.md` guarantees these ratios.

| Foreground       | Background       | Light   | Dark    | Level     |
| ---------------- | ---------------- | ------- | ------- | --------- |
| `text`           | `surface-raised` | > 12:1  | > 12:1  | AAA / AAA |
| `text-muted`     | `surface-raised` | 5.21:1  | 4.79:1  | AA / AA   |
| `primary-fg`     | `primary`        | 8.45:1  | 4.99:1  | AAA / AA  |
| `destructive-fg` | `destructive`    | > 4.5:1 | > 4.5:1 | AA / AA   |
| `warning-fg`     | `warning`        | > 4.5:1 | > 4.5:1 | AA / AA   |
| `success-fg`     | `success`        | > 4.5:1 | > 4.5:1 | AA / AA   |

### Rules

**Never** place `text-muted` on a background outside `surface` / `surface-raised` without first
verifying the ratio. At small sizes and on tinted surfaces it may fail.

**Never** use Electric Indigo steps 100–400 as foreground text on a light surface. Every step
in that range fails 4.5:1 against white.

**Never** communicate state or meaning with color alone. Pair every color indicator with a text
label, icon, or pattern. This applies to status badges, chart series, and form validation.

**Every new color** outside the semantic role table needs a verified WCAG ratio in the PR
description before merge. Use the browser devtools Accessibility panel, not intuition.

---

## Motion

Use token durations from `TOKENS.md`. No inline values.

| Token           | Value | Use                                        |
| --------------- | ----- | ------------------------------------------ |
| `duration-fast` | 120ms | hover color, focus ring, icon scale        |
| `duration-base` | 200ms | panel open/close, dropdown entrance, slide |

Always respect `prefers-reduced-motion`. Reduce to near-zero, not zero. State changes must
remain visually legible without animation.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Avoid motion that: loops without user action, displaces content more than ~16px, or flashes
more than 3 times per second.

---

## Dark mode

Color roles from `TOKENS.md` map to two palettes. Components never branch on the active theme.

```tsx
// correct
<div className="bg-surface text-text">

// wrong — hardcoded, breaks in dark mode
<div className="bg-[#F8F7F5] text-[#110E24]">

// wrong — branching on theme
<div className={isDark ? 'bg-gray-900' : 'bg-white'}>
```

The only valid theme-aware pattern is swapping icons (Sun / Moon toggle). That is appearance,
not color, and is exempt.

---

## Typography

Inter variable, loaded from Google Fonts. All sizes, weights, and line heights come from the
scale in `TOKENS.md`. No inline font sizes.

Minimum body text: `text-sm` (14px / 20px). Never render content text below 12px.

---

## Spacing and layout

Every margin, padding, and gap uses a token from the spacing scale. Arbitrary values (`p-[13px]`)
are never acceptable. When a value you need is missing from the scale, add the token first.

**Breakpoints:**

| Token     | Min-width | Pattern                            |
| --------- | --------- | ---------------------------------- |
| `compact` | 640px     | single column, stacked sections    |
| `regular` | 1024px    | sidebar visible, two-column layout |
| `wide`    | 1280px    | expanded dashboard, extra columns  |

Mobile is the default. Larger breakpoints override via `regular:` and `wide:` prefixes. No
component hardcodes a pixel width; use a token or a percentage.

---

## Component rules

- Components consume tokens. They define no colors, spacing, radius, or shadow of their own.
- Radix UI is the primitive layer for interactive components. Do not re-implement what Radix
  already provides: dialog, dropdown, select, switch, tooltip, etc.
- Class composition uses `cva` + `cn`. No inline `style` props for token-covered values.
- Icons use `@hugeicons/react`. All icon elements are `aria-hidden` unless they are the sole
  carrier of meaning.

---

## Icon conventions

### Overflow menus (⋮ vs …)

These two icons have distinct, non-interchangeable meanings. Using the wrong one misleads users.

| Icon             | HugeIcons name        | Meaning           | When to use                                     |
| ---------------- | --------------------- | ----------------- | ----------------------------------------------- |
| ⋮ vertical dots  | `MoreVerticalIcon`    | More **actions**  | Dropdown trigger: edit, delete, rename, share…  |
| … horizontal dots | `MoreHorizontalIcon` | More **content**  | Truncated text, "load more", pagination handles |

**Rule**: every action-menu trigger (`DropdownMenu`, `ContextMenu`) uses `MoreVerticalIcon`.
`MoreHorizontalIcon` is for content overflow only, never as a button that opens a menu.

---

## Tooltips

Use the `Tooltip` component (`components/ui/tooltip.tsx`, Radix Tooltip) for all hover-reveal text.
Never use the native `title` attribute. It renders an unstyled browser tooltip that ignores the
design system, has no dark-mode support, and is inaccessible on touch devices.

```tsx
// correct
<Tooltip>
  <TooltipTrigger asChild>
    <button type="button" aria-label="Copy link">
      <HugeiconsIcon icon={Copy01Icon} aria-hidden />
    </button>
  </TooltipTrigger>
  <TooltipContent>Copy link</TooltipContent>
</Tooltip>

// wrong — unstyled browser tooltip, touch-inaccessible
<button type="button" title="Copy link">
  <HugeiconsIcon icon={Copy01Icon} aria-hidden />
</button>
```

**Accessibility when a visible label is absent**: `aria-label` on the trigger covers screen
readers. The `TooltipContent` is for sighted pointer users. Both are needed on icon-only
controls. They are not substitutes for each other.

**When to add a tooltip**:

| Situation | Use |
| --- | --- |
| Icon-only button | Always. Add `aria-label` on the trigger and `TooltipContent` as a visible hint. |
| Truncated text | On the text element, content is the full string |
| Data value needing context | On the value, content explains the unit or source |
| Button whose label is already clear | Never. Tooltips on obvious controls add noise. |

`TooltipProvider` is already mounted in the sidebar root. Wrap any other subtree that uses
`Tooltip` in its own `TooltipProvider` when it sits outside the sidebar.

---

## Interactive element checklist

Run through this before every PR that adds or modifies an interactive element.

**Markup**

- [ ] `type` on every `<button>`
- [ ] `aria-label` on every icon-only control
- [ ] `aria-hidden` on every decorative icon
- [ ] Correct semantic landmark element
- [ ] `aria-current` on active nav links
- [ ] `aria-expanded` on disclosure controls
- [ ] `role="dialog"` + `aria-modal="true"` on modal overlays
- [ ] Form controls wrapped in `Field`
- [ ] Input `type` is the most specific applicable value
- [ ] Positive `tabIndex` values absent
- [ ] No native `title` attributes. Use `Tooltip` instead.

**Visual**

- [ ] Focus ring visible in light and dark mode
- [ ] Every text/background pair is in the approved list or ratio is verified in the PR
- [ ] State is not communicated by color alone
- [ ] Transitions use token durations

**Motion**

- [ ] `prefers-reduced-motion` handled
- [ ] No looping animation without user action

---

## Chart animation

All Recharts components animate on first load only. Re-renders and tab revisits must not
retrigger the animation.

### Pattern (required for every chart widget)

All three pieces are required. Skip any one and the animation replays on every render or never
plays at all.

**1. `useAnimateOnce(key)`**: returns `true` only on the first committed mount for a given key.
Pass a stable, unique string (e.g. the chart's purpose + workspaceId). After one rAF frame it
flips to `false` internally, but the chart already drew with `true` and will not re-render
because of step 2.

```ts
import { useAnimateOnce } from '~/hooks/use-animate-once';
const animate = useAnimateOnce(`my-chart-${workspaceId}`);
```

**2. `memo()`**: wrap the chart widget. Without it, any parent re-render (e.g. `useCountUp`
updating stat tiles 60 times/second) reaches the chart, flips `animate` to `false`, and
Recharts jumps to its final state mid-draw.

```tsx
export const MyChart = memo(function MyChart({ data, chartKey }: Props) { … });
```

**3. `useMemo()` for data transforms**: stable prop references are what make `memo` effective.
If `rows.map(…)` runs inline in the parent on every render, a new array reference bypasses memo
and re-renders the chart anyway.

```tsx
// in the parent
const rows = useMemo(() => data.map(transform), [data]);

// in the chart widget
const chartData = useMemo(() => rows.map(toRecharts), [rows]);
```

Pass `isAnimationActive={animate}` (and matching `animationDuration` / `animationEasing`) to
every `<Area>`, `<Bar>`, `<Line>`, or equivalent Recharts series element.

### `useCountUp` placement

`useCountUp` fires ~60 state updates over 700ms. Keep it in a **child component**, never in a
component that also renders charts. When it lives in a sibling rather than an ancestor, its
updates stay contained and never reach chart components at all.

### Checklist

- [ ] Chart widget wrapped in `memo()`
- [ ] Data transform memoized with `useMemo` in both the parent and the widget
- [ ] `isAnimationActive={animate}` on every series element — no hardcoded `true` or `false`
- [ ] `useAnimateOnce` key is unique per chart instance (include workspaceId or equivalent)
- [ ] `useCountUp` (if present) lives in a child component, not an ancestor of any chart
