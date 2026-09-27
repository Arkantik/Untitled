---
name: ui-details
description: Audit fine-grained UI details — avatar groups, stacking, active states, switches, and gradients. Use when polishing interactions or reviewing visual correctness.
---

# UI Details Audit

## Avatar groups

- Overlapping avatars are separated by clipping each one against its neighbour, not by a border.
- Borders and outlines require the exact background colour, which breaks on gradients and images — use clip-path instead.
- Keep initials readable inside the visible portion of each avatar after clipping is applied.

## Stacking

- Order elements in the DOM so that `z-index` is rarely needed. Stacking context issues are usually a DOM order problem, not a `z-index` problem.
- Where `z-index` is unavoidable, leave a comment stating why.
- Do not nest absolute positioning without a documented reason.

## Active states

- Every pressable element has a visible pressed state, not just a hover state.
- Hover and press are ranked: the pressed state is visually stronger than the hover.
- Playful brands: use a subtle scale-down on press. Professional brands: shift tone (darken or desaturate) instead of moving.
- Pressed states are triggered hundreds of times a day — keep them subtle and fast (under 100 ms).

## Switches

- While the thumb is held, stretch it slightly toward the side it will travel to.
- Snap back quickly on release — the return is faster than the press.
- Match the weight and bounciness of the motion to the brand personality.

## Gradients

- Ease gradients instead of using hard linear stops — use an easing curve on the colour interpolation.
- Use gradients over imagery to preserve as much of the image as possible while keeping text readable.
- Eased gradients need less physical space to achieve the same legibility as linear ones — resist making them taller than necessary.

## Verification

Report covers:

1. Avatar groups: clipping confirmed, initials readable.
2. Stacking: `z-index` usages listed; each one has a comment or was removed.
3. Active states: every interactive element has a pressed state; press is visually stronger than hover.
4. Switches: stretch and snap behaviour confirmed or noted as needing motion implementation.
5. Gradients: linear stops replaced with eased equivalents; gradient height reduced where possible.
