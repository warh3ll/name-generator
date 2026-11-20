/*
 * Name Generator – core engine.
 * You normally don't need to touch this file. To change what names come out,
 * edit the DATA block at the top of a file in src/generators/.
 *
 * A generator is registered like this:
 *
 *   NameGen.register({
 *     id: 'scifi-corpo',            // unique, used in the URL (#scifi-corpo)
 *     category: 'scifi',            // must match a key in src/categories.js
 *     label: 'Corpo names',
 *     description: 'Shown under the title',
 *     generate(ctx) { return 'A Name'; }   // or { name: 'A Name', note: 'extra' }
 *   });
 *
 * ctx helpers: pick(arr), weighted([[value, weight], ...]), chance(p),
 *              int(min, max), cap(str), fill('{a} {b}', { a: [...], b: [...] })
 */
(function (root) {
  'use strict';

  const NameGen = (root.NameGen = root.NameGen || {});
  const generators = [];

  NameGen.register = function (generator) {
    if (NameGen.get(generator.id)) throw new Error('Duplicate generator id: ' + generator.id);
    generators.push(generator);
  };
  NameGen.generators = () => generators.slice();
  NameGen.get = (id) => generators.find((g) => g.id === id);

  // Small seeded RNG so a result can be reproduced (used by the tests).
  NameGen.seededRng = function (seed) {
    let h = 1779033703 ^ String(seed).length;
    for (const ch of String(seed)) {
      h = Math.imul(h ^ ch.charCodeAt(0), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    let a = h >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  function makeCtx(rng) {
    const ctx = {
      rng,
      int: (min, max) => min + Math.floor(rng() * (max - min + 1)),
      pick: (arr) => arr[Math.floor(rng() * arr.length)],
      chance: (p) => rng() < p,
      weighted(entries) {
        const total = entries.reduce((sum, e) => sum + e[1], 0);
        let r = rng() * total;
        for (const [value, weight] of entries) {
          r -= weight;
          if (r < 0) return value;
        }
        return entries[entries.length - 1][0];
      },
      cap: (s) => s.charAt(0).toUpperCase() + s.slice(1),
      fill(template, slots) {
        return template.replace(/\{(\w+)\}/g, (_, key) => {
          if (!(key in slots)) throw new Error('Unknown slot {' + key + '} in "' + template + '"');
          return ctx.pick(slots[key]);
        });
      },
    };
    return ctx;
  }

  function normalise(result) {
    return typeof result === 'string' ? { name: result } : result;
  }

  NameGen.generateOne = function (id, rng) {
    const g = NameGen.get(id);
    if (!g) throw new Error('Unknown generator: ' + id);
    return normalise(g.generate(makeCtx(rng || Math.random)));
  };

  // Up to `count` unique names (a small generator may run out of unique ones).
  NameGen.generateMany = function (id, count, rng) {
    const out = [];
    const seen = new Set();
    const maxTries = count * 30;
    for (let tries = 0; out.length < count && tries < maxTries; tries++) {
      const result = NameGen.generateOne(id, rng);
      const key = result.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(result);
    }
    return out;
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
