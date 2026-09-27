---
name: new-component
description: Build a UI component. Use when adding any component, widget, form control, table, modal, or view to a frontend.
---

# New component

## 1. Check it does not already exist

Read `docs/ui/COMPONENTS.md` and grep the components directory. The most common waste in an
agent-built frontend is the fourth Button, each slightly different, none deletable.

Exists but does not quite fit? Extend it with a variant. Forking is the wrong answer unless the
behavior genuinely differs, and "it needs one more prop" is not that.

## 2. Decide where it sits

- Primitive: no domain knowledge, reusable anywhere. Lives in the shared UI directory and enters `docs/ui/COMPONENTS.md`.
- Composed: built from primitives, still domain-free. Same place.
- Feature component: knows about the domain. Lives with its feature and never enters the shared directory.

A primitive that imports a domain type is a feature component wearing the wrong label. That import
is how a shared directory turns into a second application.

## 3. Build it

- Tokens only, from `docs/ui/TOKENS.md`. No hardcoded color, spacing, radius, or font size.
- Props typed, with no `any`. Required props have no default; optional props do.
- Data comes in through props. A primitive that fetches its own data cannot be reused or tested.
- Composition over configuration. A component with nine boolean props wants to be three components.

## 4. Every state, not just the happy one

This is the step that gets skipped and the one users notice. Any component that renders
asynchronous or variable data must handle:

- Loading, with layout that does not shift when content arrives
- Empty, with text that says what would go here and how to get it
- Error, with what failed and what the user can do
- Partial, when some data loaded and some did not
- Long content: a name that does not wrap, a list of two hundred, a number with nine digits

Interactive components also need disabled, focused, and pending states, and pending must block
double submission.

## 5. Accessibility, non-negotiable

- Semantic element first. A `div` with a click handler is a bug, not a style choice.
- Keyboard reachable and operable. Tab order follows visual order. Escape closes anything overlaying.
- Focus visible, and focus trapped inside modals and returned to the trigger on close.
- Every input has a label. Placeholder text is not a label.
- Icon-only controls have an accessible name.
- Color never carries meaning alone. Pair it with text or an icon.

## 6. Verify

- Render it in every state from step 4. Actually render them; do not reason about them.
- Tab through it with the mouse untouched.
- Narrow the viewport to the smallest supported width.
- Toggle dark mode if the project has one.

## 7. Register it

New primitive or composed component: add a row to `docs/ui/COMPONENTS.md` with its states and its
props. An unregistered component gets rebuilt by the next session.

## Hard rules

- Never ship a component that renders remote data without loading, empty, and error states.
- Never use a non-semantic element for an interactive control.
- Never hardcode a design value.
- Icons come from **Hugeicons** only. Do not use Lucide or any other icon library.
