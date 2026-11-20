/* Fantasy – Witcher-esque names (Slavic / Nordic / Celtic flavoured monster-hunter-world names) */
(function (root) {
  'use strict';

  // ───────────── EDIT ME: the building blocks ─────────────
  const DATA = {
    // Male first names = start + (optional connector) + end
    maleStart: ['Bran', 'Cor', 'Dar', 'Dob', 'Drag', 'Gor', 'Hal', 'Jar', 'Kaz', 'Kor', 'Lad', 'Mal', 'Mir', 'Nor', 'Ost', 'Rad', 'Rog', 'Sev', 'Stan', 'Tor', 'Vel', 'Vlad', 'Vor', 'Zar', 'Zor', 'Ald', 'Eth', 'Fen', 'Hjal', 'Skel'],
    maleEnd: ['mir', 'slav', 'gar', 'ek', 'ric', 'ald', 'dor', 'mund', 'wyn', 'ar', 'ovan', 'rik', 'bor', 'gast', 'ik'],
    // Female first names = start + end
    femaleStart: ['Ael', 'Bel', 'Cael', 'Dar', 'Eil', 'Fiel', 'Ker', 'Lil', 'Mir', 'Nes', 'Or', 'Ras', 'Sel', 'Tes', 'Vel', 'Yar', 'Zir', 'Ysl', 'Svet', 'Mar'],
    femaleEnd: ['a', 'ka', 'ena', 'ia', 'wen', 'issa', 'ina', 'ira', 'lyn', 'ana', 'ea', 'ys'],
    // Connector letters between start and end (sometimes)
    connector: ['a', 'o', 'e', 'i'],
    // Surnames = stem + ending ("Dobr" + "ovic")
    surnameStem: ['Vlad', 'Dobr', 'Mor', 'Zdan', 'Krast', 'Bor', 'Rad', 'Sev', 'Gor', 'Volk', 'Lesn', 'Stav', 'Hraf', 'Bryn', 'Caer'],
    surnameEnd: ['ovic', 'ski', 'ek', 'ov', 'ik', 'enko', 'anski', 'vych', 'ard', 'dhu'],
    // Or a nature compound surname
    surnameNature: ['Ashvale', 'Blackfen', 'Greywater', 'Wolfsbane', 'Ravenmoor', 'Thornwick', 'Hollowell', 'Stonebrook', 'Frostmere', 'Elderroot', 'Marshlight', 'Crowfield'],
    // "of {place}"
    place: ['Kaer Dhuin', 'Ard Velnar', 'Hollowmere', 'Blackfen', 'Dunmarrow', 'Stavna', 'Oreshka', 'Vrednik', 'Gorsk Hollow', 'Whitmere', 'Eldermoss', 'Thornwick', 'Crowhaven', 'Draugvik', 'Hrafnholt', 'Skoldvale', 'Moldavar', 'Brenwood'],
    // "the {epithet}" and one-word epithets
    epithetThe: ['Gray', 'Hollow-Eyed', 'Pale', 'Gravewarden', 'Silent', 'Unburied', 'Wanderer', 'Lantern-Bearer', 'Tallow-Faced', 'Long-Sighted', 'Ashen', 'Twice-Buried'],
    epithetOne: ['Bogwalker', 'Wraithbane', 'Hagsbane', 'Ravenfriend', 'Oathbreaker', 'Wyrmslayer', 'Salt-Tongue', 'Ironwrist', 'Moonblind', 'Marshcaller', 'Gravedigger', 'Nightwhistler'],
    // Hunter schools: "of the Heron School"
    school: ['Heron', 'Stag', 'Boar', 'Lynx', 'Marten', 'Hawk', 'Adder', 'Raven'],
  };

  const CHANCE_FEMALE = 0.4;

  const PATTERNS = [
    ['{first} {surname}', 28],
    ['{first} of {place}', 18],
    ['{first} the {epithetThe}', 14],
    ['{first} {epithetOne}', 10],
    ['{first} {surname}, called {epithetOne}', 10],
    ['{first} of the {school} School', 8],
    ['{first} {surname} of {place}', 8],
    ['Old {first}', 4],
  ];
  // ─────────────────────────────────────────────────────────

  root.NameGen.register({
    id: 'fantasy-witcher',
    category: 'fantasy',
    label: 'Witcher-esque names',
    description: 'Monster hunters, hedge witches and roadside swords-for-hire.',
    generate(ctx) {
      const female = ctx.chance(CHANCE_FEMALE);
      const connector = ctx.chance(0.4) ? ctx.pick(DATA.connector) : '';
      const first = female
        ? ctx.pick(DATA.femaleStart) + ctx.pick(DATA.femaleEnd)
        : ctx.pick(DATA.maleStart) + connector + ctx.pick(DATA.maleEnd);
      const surname = ctx.chance(0.7)
        ? ctx.pick(DATA.surnameStem) + ctx.pick(DATA.surnameEnd)
        : ctx.pick(DATA.surnameNature);
      const slots = Object.assign({}, DATA, { first: [first], surname: [surname] });
      return ctx.fill(ctx.weighted(PATTERNS), slots);
    },
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
