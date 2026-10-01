---
description: Prose style. Applies to replies, commits, PR descriptions, docs, error messages, code comments
---

These rules apply to every prose surface: replies, commit messages, PR descriptions, ADRs,
session logs, ticket text, docs, error messages, and code comments.

## Banned vocabulary

Cut on sight: additionally, crucial, delve, enhance, fostering, garner, interplay, intricate,
landscape, leverage, pivotal, robust, seamless, showcase, tapestry, testament, underscore,
utilize, facilitate, numerous, groundbreaking, powerful, vibrant.

Say "is" and "has". Not "serves as", "stands as", "boasts", "features".

## Banned patterns

- No em dashes. Use a period or a comma.
- No "not just X, but Y". State the point.
- No sycophancy: "Certainly", "Great question", "I hope this helps", "Let me know if".
- No puffery: "pivotal moment", "testament to", "evolving landscape", "setting the stage for".
- No superficial -ing clauses: "highlighting...", "ensuring...", "showcasing...". Delete or replace with a real fact.
- No vague attribution: "experts believe", "reports suggest". Name the source or cut the claim.
- No promotional adjectives: groundbreaking, seamless, robust, powerful, vibrant.
- "In order to" becomes "to". "Due to the fact that" becomes "because". "It is important to note that" gets deleted.
- No forced groups of three. Use the number the content has.
- No bold-label-colon list items that restate the line.
- Sentence case headings. No decorative emojis. Straight quotes.
- No generic conclusions. State the specific next thing.
- Collapse stacked hedges. "Could potentially possibly" becomes "may".
- No weasel words: arguably, essentially, basically.

## Jargon

These abstract nouns usually have a plainer word: substrate, vector, surface, locus, nexus,
bedrock, scaffolding, paradigm, north star, flywheel, ratchet, endgame. Pick the concrete word.

Prefer: use over utilize, help over facilitate, many over numerous, if over "in the event that".

## Voice

- Have an opinion. State it directly.
- Active voice. "Queries are validated" becomes "the compiler validates queries".
- Say what something does, not how it feels.
- One idea per sentence. Vary rhythm.
- Use "I" where it fits.
- Cut adverbs propping up weak verbs. "Runs quickly" becomes "is fast", or a number.
- Be specific. A sentence that could appear unchanged in another project's docs says nothing about this one.

## Code comments

Default to no comments.

- No decorative separators: `// ── Section ──`, `// =========`.
- No section headers restating the next declaration.
- No JSX label comments restating visible structure.
- No narration of what changed. That belongs in the commit message.
- No multi-line blocks explaining what code does. One short line explaining why, only when the reason is not obvious.
