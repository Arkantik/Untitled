# Design tokens

The single reference for every visual value in this project. Components read from here and define
nothing of their own.

Implemented in `apps/web/src/styles/globals.css`. CSS custom properties, consumed via an `@theme inline` block as Tailwind utilities.

---

## Spacing

One scale. Every margin, padding, and gap comes from it. No arbitrary values.

| Token     | Value | Typical use           |
| --------- | ----- | --------------------- |
| `space-1` | 4px   | icon-to-label gap     |
| `space-2` | 8px   | inside a control      |
| `space-3` | 12px  | between related items |
| `space-4` | 16px  | card padding          |
| `space-6` | 24px  | between groups        |
| `space-8` | 32px  | section separation    |

---

## Type

Typeface: **Inter** (variable, loaded from Google Fonts). Fallback: `system-ui, sans-serif`.

| Token       | Size | Line height | Weight | Use                |
| ----------- | ---- | ----------- | ------ | ------------------ |
| `text-xs`   | 12px | 16px        | 400    | metadata, captions |
| `text-sm`   | 14px | 20px        | 400    | body, most UI      |
| `text-base` | 16px | 24px        | 400    | long-form reading  |
| `text-lg`   | 20px | 28px        | 600    | section headings   |
| `text-xl`   | 28px | 36px        | 700    | page titles        |

---

## Color roles

Semantic names only. A component that names a hex value or a palette step directly cannot be
themed and will break in dark mode.

**Palette:** Electric Indigo. **Dark mode:** yes. Roles map to two palettes. No component branches on theme.

| Role             | Light     | Dark      | Use                             |
| ---------------- | --------- | --------- | ------------------------------- |
| `surface`        | `#F8F7F5` | `#111113` | page background                 |
| `surface-raised` | `#FFFFFF` | `#1C1C1F` | cards, modals, popovers         |
| `border`         | `#E3E0F2` | `#2C2C30` | dividers, input outlines        |
| `text`           | `#110E24` | `#E8E6F5` | primary content                 |
| `text-muted`     | `#6A6482` | `#8F8F9E` | secondary, placeholders         |
| `primary`        | `#3530D0` | `#7E78ED` | primary actions, active state   |
| `primary-fg`     | `#FFFFFF` | `#110E24` | text/icons on `primary`         |
| `destructive`    | `#DC2626` | `#F87171` | delete, irreversible actions    |
| `destructive-fg` | `#FFFFFF` | `#110E24` | text/icons on `destructive`     |
| `warning`        | `#D97706` | `#D97706` | needs attention, not yet failed |
| `warning-fg`     | `#FFFFFF` | `#FFFFFF` | text/icons on `warning`         |
| `success`        | `#059669` | `#059669` | confirmed outcomes              |
| `success-fg`     | `#FFFFFF` | `#FFFFFF` | text/icons on `success`         |

**WCAG AA contrast ratios** (normal text ≥ 4.5:1, UI components ≥ 3:1):

| Pair                              | Ratio    | Level |
| --------------------------------- | -------- | ----- |
| `primary-fg` on `primary` (light) | 8.45:1   | AAA   |
| `primary-fg` on `primary` (dark)  | 4.99:1   | AA    |
| `text` on `surface-raised` (both) | > 12:1   | AAA   |
| `text-muted` on `surface-raised` (light) | 5.21:1 | AA |
| `text-muted` on `surface-raised` (dark)  | 4.79:1 | AA |

### Electric Indigo: full scale

| Step | Hex       |
| ---- | --------- |
| 50   | `#EDECFC` |
| 100  | `#D8D6F9` |
| 200  | `#B2AEF4` |
| 300  | `#7E78ED` |
| 400  | `#5550E0` |
| 500  | `#3530D0` |
| 600  | `#2A26B0` |
| 700  | `#201D8C` |
| 800  | `#181568` |
| 900  | `#100F48` |

---

## Radius, elevation, border

| Token          | Value   | Use                                          |
| -------------- | ------- | -------------------------------------------- |
| `radius-sm`    | 4px     | badges, small chips                          |
| `radius-md`    | 6px     | cards, inputs, buttons (`rounded-md`)        |
| `radius-full`  | 9999px  | avatars, pill tags                           |
| `elevation-1`  | `0 1px 3px rgba(0,0,0,.08), 0 1px 2px rgba(0,0,0,.06)` | raised surface |
| `elevation-2`  | `0 4px 12px rgba(0,0,0,.12), 0 2px 6px rgba(0,0,0,.08)` | dropdown, popover |
| `elevation-3`  | `0 20px 40px rgba(0,0,0,.16), 0 8px 16px rgba(0,0,0,.08)` | modal |
| `border-width` | 1px     | all borders                                  |

Dark mode: multiply shadow alpha values by 3× (surfaces are darker, shadows need more contrast).

---

## Breakpoints

Named by intent, not device.

| Token     | Min width | Use                          |
| --------- | --------- | ---------------------------- |
| `compact` | 640px     | single-column layout         |
| `regular` | 1024px    | standard two-column layout   |
| `wide`    | 1280px    | expanded dashboard layout    |

---

## Motion

| Token           | Value    | Use          |
| --------------- | -------- | ------------ |
| `duration-fast` | 120ms    | hover, focus |
| `duration-base` | 200ms    | open, close  |
| `easing`        | ease-out | everything   |

Respect `prefers-reduced-motion`. Reduce to near-zero duration rather than removing transitions.
State changes must remain legible without motion.

---

## Archived: Amber Gold

Not active. Stashed here for potential future use or white-label theming.

Primary: `#CC8100`. **Primary Fg: `#1E1608` (dark text. White fails AA at 2.9:1).**
Warning shifts to `#EA580C` (orange-red) to create hue distance from the amber primary.

| Step | Hex       |
| ---- | --------- |
| 50   | `#FFF8E8` |
| 100  | `#FFEFC0` |
| 200  | `#FFD97A` |
| 300  | `#FFBA30` |
| 400  | `#F09500` |
| 500  | `#CC8100` |
| 600  | `#A86800` |
| 700  | `#864F00` |
| 800  | `#653C00` |
| 900  | `#442800` |

Surface tokens:
- Light: surface `#FCF8F2`, raised `#FFFFFF`, border `#EDE2C8`, text `#1E1608`, muted `#7A6040`
- Dark: surface `#131210`, raised `#1C1A16`, border `#2D2A22`, text `#F0EDE5`, muted `#8A8070`
