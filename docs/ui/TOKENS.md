# Design tokens

The single reference for every visual value in this project. Components read from here and define
nothing of their own. Written by `/design-system`, corrected by hand.

Implemented in: `<CSS custom properties | Tailwind theme | library theme>` at `<path>`.
A token that lives only in this file and not in code gets ignored within a month.

## Spacing

One scale. Every margin, padding, and gap comes from it.

| Token     | Value    | Typical use           |
| --------- | -------- | --------------------- |
| `space-1` | `<4px>`  | icon to text          |
| `space-2` | `<8px>`  | inside a control      |
| `space-3` | `<12px>` | between related items |
| `space-4` | `<16px>` | card padding          |
| `space-6` | `<24px>` | between groups        |
| `space-8` | `<32px>` | section separation    |

## Type

| Token       | Size     | Line height | Weight | Use                |
| ----------- | -------- | ----------- | ------ | ------------------ |
| `text-xs`   | `<12px>` | `<16px>`    | 400    | metadata, captions |
| `text-sm`   | `<14px>` | `<20px>`    | 400    | body, most UI      |
| `text-base` | `<16px>` | `<24px>`    | 400    | long-form reading  |
| `text-lg`   | `<20px>` | `<28px>`    | 600    | section headings   |
| `text-xl`   | `<28px>` | `<36px>`    | 600    | page titles        |

## Color roles

Semantic names only. A component naming a hex value or a palette step cannot be themed.

| Role             | Light | Dark | Use                             |
| ---------------- | ----- | ---- | ------------------------------- |
| `surface`        |       |      | page background                 |
| `surface-raised` |       |      | cards, modals, popovers         |
| `border`         |       |      | dividers, input outlines        |
| `text`           |       |      | primary content                 |
| `text-muted`     |       |      | secondary, placeholders         |
| `primary`        |       |      | primary actions, active state   |
| `primary-fg`     |       |      | text on primary                 |
| `destructive`    |       |      | delete, irreversible actions    |
| `warning`        |       |      | needs attention, not yet failed |
| `success`        |       |      | confirmed outcomes              |

Dark mode: `<yes | no>`. If yes, roles map to two palettes and no component branches on theme.

## Radius, elevation, border

| Token          | Value    | Use               |
| -------------- | -------- | ----------------- |
| `radius-sm`    | `<4px>`  | inputs, badges    |
| `radius-md`    | `<8px>`  | cards, modals     |
| `radius-full`  | `9999px` | avatars, pills    |
| `elevation-1`  |          | raised surface    |
| `elevation-2`  |          | overlay, dropdown |
| `elevation-3`  |          | modal             |
| `border-width` | `<1px>`  | all borders       |

## Breakpoints

Named by intent, not device.

| Token     | Min width  |
| --------- | ---------- |
| `compact` | `<640px>`  |
| `regular` | `<1024px>` |
| `wide`    | `<1280px>` |

## Motion

| Token           | Value        | Use          |
| --------------- | ------------ | ------------ |
| `duration-fast` | `<120ms>`    | hover, focus |
| `duration-base` | `<200ms>`    | open, close  |
| `easing`        | `<ease-out>` | everything   |

Respect `prefers-reduced-motion`. Reduce to near-zero duration rather than removing the transition,
so state changes stay legible.
