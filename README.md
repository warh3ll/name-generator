# Name Generator

A personal name generator for sci-fi, quirky and fantasy names. Plain HTML + JavaScript, no build step, no dependencies.

- **Generate one** name with a single button, or a **list of up to 100** unique names.
- Click a name to copy it. Click ☆ to save it (kept in your browser).
- Every generator keeps its building blocks in a clearly marked `DATA` block at the top of its file.

## Run it

Open `index.html` in a browser. That's it.

To publish it as a website: **Settings → Pages → Deploy from branch → `main` / root**.

## Categories

| Category | Generator | File |
|---|---|---|
| Sci-fi, cyberpunk & netrunner | Character names | `src/generators/scifi-character.js` |
| | Corpo names | `src/generators/scifi-corpo.js` |
| | Hacking skill names | `src/generators/scifi-hacking.js` |
| Quirky | Swedish idiom names | `src/generators/quirky-swedish-idioms.js` |
| | Portmanteau names | `src/generators/quirky-portmanteau.js` |
| Fantasy | Witcher-esque names | `src/generators/fantasy-witcher.js` |

## Editing the names

Open a generator file and look for the block marked `EDIT ME`.

- **Word lists** (`first`, `last`, `root`, `verb`, …): add or remove entries. Repeat an entry to make it more common.
- **Patterns** (`PATTERNS`): each line is `['{first} {last}', weight]`. `{slot}` is replaced by a random entry from the list with that name; a higher weight means the pattern is picked more often. Add, remove or reshape patterns freely.
- **Swedish idioms**: each line is one saying with its pun name. Copy a line to add one. `CHANCE_ORIGINAL_PAIR` controls how often you get a first+last from the *same* saying versus a mix of two.
- **Portmanteau**: tweak the word themes, `MIN_LEN` / `MAX_LEN`, `MIN_KEEP` and `SLACK` to change how blends look. Add hand-made blends to `CURATED`.

Check your edit with `npm test` (or `node test/smoke.js --samples` to see sample output). It checks that each generator can produce 100 unique names and that no template is broken.

## Adding a new generator or category

1. Copy an existing file in `src/generators/` and change `id`, `category`, `label`, `description`, the `DATA` and the `generate` function.
2. Add a `<script src="src/generators/your-file.js"></script>` line to `index.html`.
3. For a new top-level category, add it to `src/categories.js` (label and accent colour).

A generator's `generate(ctx)` returns either a string or `{ name, note }` (the note is shown in small text under the name). `ctx` has `pick`, `weighted`, `chance`, `int`, `cap` and `fill` helpers; see the comment at the top of `src/engine.js`.

## Ideas / requesting changes

Open an issue (or just edit the files). Possible next steps: more categories (space ships, taverns, planets), name filters (starts with…, max length), export as CSV.
