/* Sci-fi / cyberpunk / netrunner – corpo names */
(function (root) {
  'use strict';

  // ───────────── EDIT ME: the building blocks ─────────────
  const DATA = {
    // Brand-sounding roots
    root: [
      'Neo', 'Kiro', 'Vanta', 'Helix', 'Omni', 'Syn', 'Axiom', 'Nova', 'Zeno', 'Aeon',
      'Tetra', 'Obsid', 'Meridian', 'Quanta', 'Veil', 'Sol', 'Halcyon', 'Orbis', 'Kuro', 'Tessera',
      'Voltra', 'Argent', 'Sable', 'Nexo', 'Cyra', 'Mirai', 'Zenith', 'Hyper', 'Aegis', 'Titan',
    ],
    // Glued onto a root: "Vanta" + "dyne" = "Vantadyne"
    suffix: [
      'tek', 'dyne', 'corp', 'gen', 'tron', 'core', 'tech', 'sys', 'ware', 'onic',
      'ix', 'ex', 'ra', 'on', 'link', 'forge', 'cell', 'works',
    ],
    // Founder-style surnames for "Voss & Halloran" names
    surname: [
      'Voss', 'Halloran', 'Kessler', 'Mori', 'Dray', 'Okonkwo', 'Strand', 'Valdez', 'Ashworth', 'Kuznetsov',
      'Lindgren', 'Takeda', 'Bellamy', 'Zhao', 'Marlowe', 'Ferreira', 'Blackwood', 'Sinclair',
    ],
    industry: [
      'Biotech', 'Dynamics', 'Robotics', 'Logistics', 'Neurotech', 'Securities', 'Armaments', 'Orbital',
      'Genetics', 'Media', 'Systems', 'Heavy Industries', 'Pharmaceuticals', 'Data', 'Energy', 'Medical',
      'Cybernetics', 'Interactive', 'Aerospace', 'Water & Power',
    ],
    legal: [
      'Corporation', 'Group', 'Holdings', 'Ltd.', 'GmbH', 'Inc.', 'Consortium', 'AG', 'Syndicate', 'International',
    ],
    // Letters used for acronym names like "KZV Biotech"
    letter: ['K', 'V', 'X', 'Z', 'N', 'M', 'T', 'R', 'S', 'D', 'Q', 'H'],
  };

  const PATTERNS = [
    ['{root}{suffix}', 25],
    ['{root}{suffix} {legal}', 15],
    ['{root}{suffix} {industry}', 15],
    ['{root} {industry} {legal}', 12],
    ['{surname} & {surname} {industry}', 10],
    ['{surname}-{surname} {legal}', 6],
    ['{acronym} {industry}', 10],
    ['{root}{suffix}-{digit}', 3],
  ];
  // ─────────────────────────────────────────────────────────

  root.NameGen.register({
    id: 'scifi-corpo',
    category: 'scifi',
    label: 'Corpo names',
    description: 'Megacorps, shell companies and black-site contractors.',
    generate(ctx) {
      const slots = Object.assign({}, DATA, {
        acronym: [ctx.pick(DATA.letter) + ctx.pick(DATA.letter) + (ctx.chance(0.5) ? ctx.pick(DATA.letter) : '')],
        digit: [String(ctx.int(2, 9))],
      });
      let name = ctx.fill(ctx.weighted(PATTERNS), slots);
      // Avoid "Voss & Voss"
      const m = name.match(/^(\S+) & (\S+) /);
      if (m && m[1] === m[2]) return this.generate(ctx);
      return name;
    },
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
