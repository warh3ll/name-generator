/* Sci-fi / cyberpunk / netrunner – character names */
(function (root) {
  'use strict';

  // ───────────── EDIT ME: the building blocks ─────────────
  const DATA = {
    first: [
      'Kaito', 'Zhen', 'Mara', 'Juno', 'Rix', 'Anya', 'Dex', 'Nyx', 'Imani', 'Soren',
      'Vik', 'Tala', 'Okoye', 'Lena', 'Marek', 'Sasha', 'Ravi', 'Ines', 'Toma', 'Yuki',
      'Cass', 'Idris', 'Mika', 'Bram', 'Noor', 'Ezra', 'Luz', 'Kofi', 'Petra', 'Dmitri',
      'Aiko', 'Joaquin', 'Siv', 'Tariq', 'Wren', 'Zola', 'Hana', 'Oskar', 'Priya', 'Leif',
    ],
    last: [
      'Voss', 'Kwan', 'Okafor', 'Reyes', 'Tanaka', 'Novak', 'Halvorsen', 'Singh', 'Castellan', 'Moreau',
      'Ibarra', 'Lindqvist', 'Abara', 'Volkov', 'Chen', 'Duarte', 'Sato', 'Brandt', 'Mbeki', 'Kovacs',
      'Rhee', 'Santoro', 'Eriksen', 'Navarro', 'Adeyemi', 'Petrov', 'Ishikawa', 'Dahl', 'Morrow', 'Quill',
    ],
    // Street / runner handles
    handle: [
      'Glitch', 'Wraith', 'Static', 'Sixer', 'Null', 'Moth', 'Rook', 'Sable', 'Cinder', 'Vex',
      'Halo', 'Zero', 'Lace', 'Patch', 'Spook', 'Chrome', 'Tangent', 'Pixel', 'Ember', 'Jackal',
      'Mute', 'Flux', 'Hex', 'Echo', 'Kilo', 'Lotus', 'Razor', 'Siren', 'Drift', 'Ghoul',
    ],
    // Suffix for "Wraith_07"-style net aliases
    aliasSuffix: ['_07', '_x', '.exe', '_404', '99', '_v2', '//', '_zero', '_null', '-9'],
  };

  // Which shapes a name can have, and how common each is (higher = more common).
  const PATTERNS = [
    ['{first} {last}', 45],
    ['{first} "{handle}" {last}', 25],
    ['{handle}', 12],
    ['{handle}{aliasSuffix}', 8],
    ['{first} {last}-{last}', 5],
    ['{handle} {last}', 5],
  ];
  // ─────────────────────────────────────────────────────────

  root.NameGen.register({
    id: 'scifi-character',
    category: 'scifi',
    label: 'Character names',
    description: 'Runners, fixers, drifters and ghosts in the machine.',
    generate(ctx) {
      return ctx.fill(ctx.weighted(PATTERNS), DATA);
    },
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
