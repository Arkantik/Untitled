# Components

Read this before building a component. If what you need is here, use it. If it is not, add it after building.

All components live in `apps/web/src/components/ui/`. They consume tokens from `apps/web/src/styles/globals.css` and define no colors, spacing, or radius values of their own.

Icons use `@hugeicons/react` + `@hugeicons/core-free-icons`. Class composition uses `cva` + `cn` (`~/lib/utils`). Interactive components use Radix UI primitives.

---

## Primitives

### Button

`button.tsx`

Variants: `default`, `secondary`, `destructive`, `outline`, `ghost`, `link`.
Sizes: `sm`, `md` (default), `lg`, `icon`.
Props: `asChild` (renders as child element via Radix Slot), `loading` (disables + shows spinner).

### Input

`input.tsx`

Uncontrolled `<input>`. Prop: `invalid` (switches to destructive border + ring).

### PasswordInput

`password-input.tsx`

Input with a show/hide toggle. Same `invalid` prop as Input.

### Label

`label.tsx`

Radix Label. Pairs with Field or any form control via `htmlFor`.

### Switch

`switch.tsx`

Radix Switch. Checked state uses `primary` color.

### Select

`select.tsx`

Exports: `Select`, `SelectValue`, `SelectGroup`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectSeparator`. Radix Select with portal rendering.

---

## Layout

### Card

`card.tsx`

Exports: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.

### Dialog

`dialog.tsx`

Exports: `Dialog`, `DialogTrigger`, `DialogClose`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`. Portal rendered, backdrop blur, close button built in.

### DropdownMenu

`dropdown-menu.tsx`

Exports: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`. Portal rendered.

---

## Feedback

### Alert

`alert.tsx`

Inline status/alert banner. Tones: `info` (default), `success`, `error`.

### Badge

`badge.tsx`

Pill label. Tones: `neutral` (default), `brand`, `success`, `warning`, `destructive`.

### Skeleton

`skeleton.tsx`

Animated loading placeholder. Respects `prefers-reduced-motion`.

---

## Composition

### Field

`field.tsx`

Render-prop wrapper that wires a label, hint text, and error message to any form control. Generates accessible `id`, `aria-describedby`, and `invalid` props and passes them to the child via the render prop.

```tsx
<Field label="Email" error={errors.email}>
  {(props) => <Input type="email" {...props} />}
</Field>
```

### Segmented

`segmented.tsx`

Keyboard-navigable radio group rendered as a button strip. Generic over the option value type. Props: `options`, `value`, `onChange`, `label` (accessible group label).

### EmptyState

`empty-state.tsx`

Empty list placeholder. Props: `title` (required), `description`, `icon` (any ReactNode, sized automatically), `action` (CTA slot).

---

## Navigation

### ScrollToTop

`scroll-to-top.tsx`

Fixed button that appears after scrolling past `threshold` (default 480px). Smooth scroll respects `prefers-reduced-motion`.
