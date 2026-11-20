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
    // ── Royal & noble variant ──
    titleRoyalMale: ['King', 'Prince', 'Crown Prince', 'Emperor', 'Konung', 'High King', 'Regent', 'Pretender'],
    titleRoyalFemale: ['Queen', 'Princess', 'Crown Princess', 'Empress', 'High Queen', 'Queen Regent', 'Dowager Queen', 'Pretender'],
    titleNobleMale: ['Duke', 'Count', 'Baron', 'Margrave', 'Burgrave', 'Lord', 'Jarl', 'Voivode', 'Hetman', 'Ealdorman', 'Castellan', 'Marshal', 'Sir'],
    titleNobleFemale: ['Duchess', 'Countess', 'Baroness', 'Margravine', 'Lady', 'Jarlessa', 'Voivodess', 'Dame'],
    titleCourt: ['Chancellor', 'Seneschal', 'Spymaster', 'Master of Coin', 'Court Mage', 'Royal Sorcerer', 'Royal Herald', 'Lord Steward', 'High Chamberlain', 'Keeper of the Seal', 'Royal Physician', 'Master of Hounds'],
    royalRealm: ['Kaedmar', 'Ard Velnar', 'Redmoor', 'Aedvar', 'Stavna', 'Oreshka', 'Hollowmere', 'Dunmarrow', 'Whitmere', 'Draugvik', 'Hrafnholt', 'Skoldvale', 'Moldavar', 'Brenwood', 'Kaer Dhuin', 'Thornwick', 'the Nine Marches', 'the Black Fen', 'the Iron Coast', 'the Seven Rivers'],
    royalEpithet: ['Just', 'Bold', 'Elder', 'Younger', 'Cruel', 'Pious', 'Fair', 'Lame', 'Unready', 'Old', 'Mad', 'Magnificent', 'Silent', 'Grey', 'Iron-Fisted', 'Wise', 'Usurper', 'Peacemaker', 'Wolf-Bane', 'Wyrmslayer', 'Beloved', 'Burned', 'Hollow', 'Two-Crowned'],
    royalHouse: ['Blackwolf', 'Ravenmoor', 'Greycrown', 'Ironthorn', 'Stagheart', 'Whitehart', 'Frostmere', 'Goldenmarch', 'Redfalcon', 'Silverbough', 'Dunmarrow', 'Emberhall'],
    regnal: ['II', 'III', 'IV', 'V', 'VII'],
    // Hunter schools: "of the Heron School"
    school: ['Heron', 'Stag', 'Boar', 'Lynx', 'Marten', 'Hawk', 'Adder', 'Raven'],
  };

  const CHANCE_FEMALE = 0.4;
  // Share of names that come out as royals/nobles/courtiers instead of hunters
  const CHANCE_ROYAL = 0.25;

  const PATTERNS = [
    ['{first} {surname}', 28],
    ['{first} of {place}', 18],
    ['{first} the {epithetThe}', 14],
    ['{first} {epithetOne}', 10],
    ['{first} of the {school} School', 8],
    ['{first} {surname} of {place}', 8],
    ['Old {first}', 4],
  ];
  const ROYAL_PATTERNS = [
    ['{title} {first}', 22],
    ['{title} {first} of {royalRealm}', 18],
    ['{title} {first} the {royalEpithet}', 14],
    ['{title} {first} {house}', 12],
    ['{first} {house}, {title} of {royalRealm}', 10],
    ['{title} {first} {regnal} of {royalRealm}', 8],
    ['{first} the {royalEpithet}, {title} of {royalRealm}', 8],
    ['{title} {first} {house} of {royalRealm}', 8],
  ];
  // ─────────────────────────────────────────────────────────

  root.NameGen.register({
    id: 'fantasy-witcher',
    category: 'fantasy',
    label: 'Witcher-esque names',
    description: 'Monster hunters, hedge witches, roadside swords-for-hire and the odd king.',
    generate(ctx) {
      const female = ctx.chance(CHANCE_FEMALE);
      const connector = ctx.chance(0.4) ? ctx.pick(DATA.connector) : '';
      const first = female
        ? ctx.pick(DATA.femaleStart) + ctx.pick(DATA.femaleEnd)
        : ctx.pick(DATA.maleStart) + connector + ctx.pick(DATA.maleEnd);
      const surname = ctx.chance(0.7)
        ? ctx.pick(DATA.surnameStem) + ctx.pick(DATA.surnameEnd)
        : ctx.pick(DATA.surnameNature);
      if (ctx.chance(CHANCE_ROYAL)) {
        // Royal variant: rank band picks the title list, matched to gender
        const band = ctx.weighted([['Royal', 45], ['Noble', 40], ['Court', 15]]);
        const title = band === 'Court' ? ctx.pick(DATA.titleCourt) : ctx.pick(DATA['title' + band + (female ? 'Female' : 'Male')]);
        const house = ctx.chance(0.65) ? surname : ctx.pick(DATA.royalHouse);
        const royalSlots = Object.assign({}, DATA, { first: [first], house: [house], title: [title] });
        return ctx.fill(ctx.weighted(ROYAL_PATTERNS), royalSlots);
      }
      const slots = Object.assign({}, DATA, { first: [first], surname: [surname] });
      return ctx.fill(ctx.weighted(PATTERNS), slots);
    },
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
