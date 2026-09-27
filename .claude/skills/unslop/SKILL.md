---
name: unslop
description: Remove AI tells from prose and add voice. Applies to every prose surface this repo produces, including your own replies. Not to code.
---

# Unslop

Adapted from the `unslop` skill in Lauren Tan's pstack pack:
https://github.com/cursor/plugins/tree/main/pstack/skills/unslop

## Where it applies

Commit messages, PR descriptions, ADRs, session logs, ticket text, README and docs files, error
messages a user reads, and your replies in the session. Your reply is a prose surface.

Not code. The rules below are about writing, and applying them to identifiers or string literals
produces nonsense.

## Process

1. Write the thing.
2. Scan for the patterns below and rewrite, preserving meaning and tone.
3. Ask what makes this obviously machine-written, and fix what remains.

## Content

- Cut puffery. "pivotal moment", "testament to", "evolving landscape", "setting the stage for". State what happened.
- No superficial -ing clauses: "highlighting...", "ensuring...", "reflecting...", "showcasing...". Delete them or replace with real detail.
- No vague attribution. "Experts believe", "reports suggest". Name the source or cut the claim.
- No promotional adjectives: groundbreaking, seamless, robust, powerful, vibrant.
- No formulaic tension. "Despite challenges, X continues to thrive." Give the specific fact.

## Language

- Cut AI vocabulary: additionally, crucial, delve, enhance, fostering, garner, interplay, intricate, landscape, leverage, pivotal, showcase, tapestry, testament, underscore.
- Say "is" and "has". Not "serves as", "stands as", "boasts", "features".
- No "not just X, but Y". State the point.
- No forced groups of three. Use the number the content has.
- No synonym cycling. Pick a word and repeat it.
- No false ranges. "From X to Y" only when X and Y sit on a real scale.

## Style

- No em dashes. Use a period or a comma. Reaching for parentheses instead trades one tell for another.
- Colons before a list or an example, never as a mid-sentence connector.
- Do not bold every proper noun.
- No bold-label-colon list items that restate the line. A bold lead-in ending in a period followed by genuinely new detail is fine.
- Sentence case headings. No decorative emojis. Straight quotes.

## Communication artifacts

- No chatbot phrases: "I hope this helps", "Let me know if", "Certainly", "Great question".
- No sycophancy. Answer directly.
- No cutoff or limitation disclaimers where a real answer is possible.

## Filler and hedging

- "In order to" becomes "to". "Due to the fact that" becomes "because". "It is important to note that" gets deleted.
- Collapse stacked hedges. "could potentially possibly" becomes "may".
- No generic conclusions. "The future looks bright" says nothing. State the specific next thing.

## Jargon

Abstract metaphor nouns read as technical and usually have a plainer word: substrate, vector,
surface, locus, nexus, bedrock, scaffolding, paradigm, north star, flywheel, ratchet, endgame.
Pick the concrete word. "Substrate" is "base". "Vector" is "way". "Evacuate" is "move out".

## Plain speech

- Say what something does, not how it feels. "The database stays close at hand" names a feeling. "`.toSQL()` returns the exact string sent to the database" names a mechanism. If you cannot restate a sentence as a fact, an instruction, or a number, cut it.
- A sentence that could appear unchanged in another project's docs says nothing about this one.
- One idea per sentence. Split anything that needs re-reading.
- Active voice. "Queries are validated" becomes "the compiler validates queries". Passive only when the actor genuinely does not matter.
- Cut adverbs propping up weak verbs. "Runs quickly" becomes "is fast", or the number.
- Prefer the plain word: use over utilize, help over facilitate, many over numerous, if over in the event that.

## Voice

Removing tells is half of it. Voiceless prose is equally obvious.

- Have an opinion. React to the facts rather than listing them neutrally.
- Vary rhythm. Short sentences. Then longer ones that take their time.
- Use "I" where it fits.
- Be specific rather than generically positive.
- No weasel words: arguably, essentially, basically.
