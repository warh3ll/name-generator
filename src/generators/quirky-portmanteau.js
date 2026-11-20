/* Quirky – portmanteau names (two words smashed together) */
(function (root) {
  'use strict';

  // ───────────── EDIT ME: the building blocks ─────────────
  // Words are grouped by theme. A name blends two words, usually from
  // different themes. Lower-case, simple words blend best.
  const WORDS = {
    animal: ['badger', 'otter', 'walrus', 'falcon', 'gecko', 'moose', 'panda', 'weasel', 'lemur', 'heron', 'mantis', 'bison', 'toad', 'crow'],
    food: ['noodle', 'pickle', 'waffle', 'biscuit', 'pepper', 'butter', 'cookie', 'mango', 'pretzel', 'custard', 'toast', 'olive', 'ginger', 'muffin'],
    tech: ['pixel', 'robot', 'laser', 'router', 'cache', 'signal', 'binary', 'widget', 'cursor', 'gadget', 'modem', 'script', 'server', 'circuit'],
    nature: ['thunder', 'meadow', 'glacier', 'pebble', 'comet', 'marsh', 'canyon', 'breeze', 'cinder', 'willow', 'tundra', 'ember', 'fjord', 'lagoon'],
    feeling: ['grumble', 'giggle', 'wonder', 'shiver', 'mellow', 'frantic', 'snooze', 'jolly', 'cranky', 'dazzle', 'whimsy', 'hustle'],
    thing: ['lantern', 'button', 'ladder', 'pocket', 'teapot', 'marble', 'ribbon', 'bucket', 'candle', 'anchor', 'mitten', 'compass'],
  };

  // Hand-made blends you want in the mix (optional). Shown with their note.
  const CURATED = [
    { name: 'Grumblecat', note: 'grumble + cat' },
    { name: 'Wafflebot', note: 'waffle + robot' },
    { name: 'Otterpoint', note: 'otter + waypoint' },
  ];

  const CHANCE_CURATED = 0.05; // 0–1, how often a curated one shows up
  const CHANCE_SAME_THEME = 0.15; // 0–1, how often both words share a theme

  // Blend rules
  const MIN_LEN = 5; // shortest result
  const MAX_LEN = 11; // longest result
  const MIN_KEEP = 3; // letters that must survive from the start of word A and the end of word B
  const SLACK = 0.15; // 0 = always the single best blend, higher = more variety (and more weird ones)
  // ─────────────────────────────────────────────────────────

  const isVowel = (c) => 'aeiouy'.includes(c);

  // All ways to join the start of `a` to the end of `b`, best first.
  // "Best" = both words stay recognisable and the join is pronounceable.
  function blends(a, b) {
    const scored = [];
    for (let i = MIN_KEEP; i < a.length; i++) {
      for (let j = 1; j <= b.length - MIN_KEEP; j++) {
        const left = a[i - 1];
        const right = b[j];
        const merged = left === right; // shared letter: "bis|cuit" + "cu|rry" style overlap
        let word;
        if (merged) word = a.slice(0, i) + b.slice(j + 1);
        else if (isVowel(left) !== isVowel(right)) word = a.slice(0, i) + b.slice(j);
        else continue;
        if (word.length < MIN_LEN || word.length > MAX_LEN) continue;
        if (word === a || word === b || a.startsWith(word) || b.endsWith(word)) continue;
        if (/[^aeiouy]{4}/.test(word) || /[aeiouy]{3}/.test(word)) continue; // unpronounceable
        if ((word.match(/[aeiouy]+/g) || []).length < 2) continue; // needs two syllables
        const shareA = i / a.length;
        const shareB = (b.length - j) / b.length;
        const score = shareA + shareB - Math.abs(shareA - shareB) * 0.5 + (merged ? 0.4 : 0);
        scored.push({ word, score });
      }
    }
    if (!scored.length) return [];
    const best = Math.max(...scored.map((s) => s.score));
    return scored.filter((s) => s.score >= best - SLACK).map((s) => s.word);
  }

  root.NameGen.register({
    id: 'quirky-portmanteau',
    category: 'quirky',
    label: 'Portmanteau names',
    description: 'Two words blended into one (the source words are shown underneath).',
    generate(ctx) {
      if (CURATED.length && ctx.chance(CHANCE_CURATED)) return ctx.pick(CURATED);

      const themes = Object.keys(WORDS);
      for (let attempt = 0; attempt < 50; attempt++) {
        const t1 = ctx.pick(themes);
        let t2 = ctx.pick(themes);
        if (!ctx.chance(CHANCE_SAME_THEME)) while (t2 === t1) t2 = ctx.pick(themes);
        const a = ctx.pick(WORDS[t1]);
        const b = ctx.pick(WORDS[t2]);
        if (a === b) continue;
        const options = blends(a, b);
        if (!options.length) continue;
        return { name: ctx.cap(ctx.pick(options)), note: a + ' + ' + b };
      }
      return { name: 'Blendo', note: 'blend + combo (fallback)' };
    },
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
