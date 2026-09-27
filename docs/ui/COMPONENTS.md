# Component inventory

What exists, so nothing gets built twice. `/new-component` reads this first and writes to it last.

The catalog below is the set most applications end up needing. It is a checklist of what to build
and what each one owes the user, not code. Delete the rows this project does not have, and add a
path as each gets built.

## Why this is a spec and not a component library

Shipping actual components would tie this shell to one framework and one version, and the code
would be stale within two projects. What stays true across every project is the contract: which
states a component must handle, which keys must work, what must have an accessible name. That
survives a move from React to Angular. The implementation does not.

## Primitives

| Component        | Path | States it must handle                            | Notes                                                              |
| ---------------- | ---- | ------------------------------------------------ | ------------------------------------------------------------------ |
| Button           |      | default, hover, focus, active, disabled, pending | Pending blocks double submission                                   |
| Input            |      | default, focus, disabled, error, with-value      | Label required, placeholder is not a label                         |
| Textarea         |      | as Input, plus max length feedback               |                                                                    |
| Select           |      | as Input, plus open, empty options               | Keyboard: arrows, type-ahead, escape                               |
| Checkbox / Radio |      | default, checked, indeterminate, disabled, error | Label is the click target                                          |
| Switch           |      | on, off, disabled, pending                       | Pending matters: it usually writes immediately                     |
| Label            |      | default, required, error                         |                                                                    |
| Field wrapper    |      | label, help text, error text                     | Ties label, control, and error via aria                            |
| Badge            |      | one per semantic color role                      | Never color alone for meaning                                      |
| Avatar           |      | image, initials fallback, loading                | Fallback is the common case, not the edge                          |
| Icon             |      |                                                  | Decorative icons hidden from assistive tech, meaningful ones named. Use **Hugeicons** — not Lucide or any other library |
| Spinner          |      |                                                  | Only for waits under a second. Longer waits want a skeleton        |
| Skeleton         |      |                                                  | Must match the height of what it replaces or the layout jumps      |
| Tooltip          |      |                                                  | Never the only place information exists. Unreachable by touch      |
| Separator        |      |                                                  |                                                                    |

## Composed

| Component       | Path | States it must handle                               | Notes                                                             |
| --------------- | ---- | --------------------------------------------------- | ----------------------------------------------------------------- |
| Modal / Dialog  |      | open, closing, pending action                       | Focus trapped, returned to trigger, escape closes                 |
| Drawer / Sheet  |      | as Modal                                            | The mobile answer to Modal                                        |
| Dropdown menu   |      | closed, open, disabled item                         | Full keyboard navigation                                          |
| Tabs            |      | active, disabled, overflow                          | URL-synced when tabs are navigation                               |
| Table           |      | loading, empty, error, sorted, paginated, selection | See below                                                         |
| Pagination      |      | first, middle, last, single page                    |                                                                   |
| Form            |      | idle, validating, submitting, error, success        | Errors at the field, summary at the top for long forms            |
| Toast           |      | success, error, info, stacked                       | Errors persist until dismissed. Successes auto-dismiss            |
| Empty state     |      |                                                     | Says what would be here and how to get it. Never a bare "no data" |
| Error boundary  |      |                                                     | What failed and one action. Never a stack trace                   |
| Confirm dialog  |      |                                                     | Names the object. Destructive actions get the destructive role    |
| Card            |      | default, interactive, selected                      |                                                                   |
| Breadcrumb      |      |                                                     |                                                                   |
| Command palette |      | empty query, no results, loading                    | Worth it once there are more than a dozen destinations            |

## The table is where projects lose the most time

Build it once, properly, and reuse it. It needs: server-side sorting, filtering, and pagination with
state in the URL so a view is shareable and survives a refresh; a loading state that does not collapse
the layout; separate empty states for no data and no results matching a filter; a row action column;
optional multi-select with a bulk action bar; horizontal scroll or column collapse on narrow screens;
and a keyboard path to every row action.

Search input state is local and debounced, and the URL updates without a re-render. Writing the URL
on every keystroke through the router causes input lag, which is expensive to diagnose and easy to
avoid.

## Rules

- A primitive importing a domain type is a feature component in the wrong directory.
- A component with nine boolean props wants to be three components.
- Anything rendering remote data has loading, empty, and error states before it is done.
