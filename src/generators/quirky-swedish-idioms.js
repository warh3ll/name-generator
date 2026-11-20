/* Quirky – Swedish first/last names built from idioms and sayings */
(function (root) {
  'use strict';

  // ───────────── EDIT ME: the building blocks ─────────────
  // One entry per saying. `first` and `last` are the pun-name made from it.
  // Add as many as you like – just copy a line.
  const IDIOMS = [
    { idiom: 'Ingen ko på isen', first: 'Inge', last: 'Kopåisen' },
    { idiom: 'Det är ingen fara på taket', first: 'Ingemar', last: 'Faratak' },
    { idiom: 'Nu är det kokta fläsket stekt', first: 'Stig', last: 'Kokfläsk' },
    { idiom: 'Dra alla över en kam', first: 'Allan', last: 'Överkamm' },
    { idiom: 'Ta saken i egna händer', first: 'Egon', last: 'Egnahänder' },
    { idiom: 'Gå som katten kring het gröt', first: 'Kattis', last: 'Hetgröt' },
    { idiom: 'Vara i sjunde himlen', first: 'Sigge', last: 'Sjundehimmel' },
    { idiom: 'Spola kröken', first: 'Krister', last: 'Spolkröken' },
    { idiom: 'Bita i det sura äpplet', first: 'Bertil', last: 'Suräpple' },
    { idiom: 'Som vatten på en gås', first: 'Gösta', last: 'Vattengås' },
    { idiom: 'Slå två flugor i en smäll', first: 'Flemming', last: 'Flugsmäll' },
    { idiom: 'Lägga benen på ryggen', first: 'Benny', last: 'Benrygg' },
    { idiom: 'Ana ugglor i mossen', first: 'Ulla', last: 'Mossuggla' },
    { idiom: 'Sitta med skägget i brevlådan', first: 'Sven', last: 'Brevlådeskägg' },
    { idiom: 'Ha en räv bakom örat', first: 'Rolf', last: 'Rävbakörat' },
    { idiom: 'Kasta pärlor för svin', first: 'Pär', last: 'Pärlsvin' },
    { idiom: 'Det ligger en hund begraven', first: 'Hubert', last: 'Hundbegraven' },
    { idiom: 'Tala är silver, tiga är guld', first: 'Tilda', last: 'Tigaguld' },
    { idiom: 'Måla fan på väggen', first: 'Malte', last: 'Fanpåväggen' },
    { idiom: 'Skjuta sig själv i foten', first: 'Folke', last: 'Fotskott' },
    { idiom: 'Ta sig i kragen', first: 'Tage', last: 'Kragen' },
    { idiom: 'Rakt på sak', first: 'Rakel', last: 'Raktpåsak' },
    { idiom: 'Ingen rök utan eld', first: 'Eldar', last: 'Utanrök' },
    { idiom: 'Gråta över spilld mjölk', first: 'Milla', last: 'Mjölkspill' },
    { idiom: 'Äpplet faller inte långt från trädet', first: 'Åsa', last: 'Äppelfall' },
    { idiom: 'Kasta in handduken', first: 'Hanna', last: 'Innehandduk' },
    { idiom: 'Sticka under stol med', first: 'Stina', last: 'Understol' },
    { idiom: 'Vända kappan efter vinden', first: 'Vendela', last: 'Kappvind' },
    { idiom: 'Lura någon på konfekten', first: 'Konrad', last: 'Påkonfekten' },
    { idiom: 'Lugn som en filbunke', first: 'Filip', last: 'Filbunke' },
    { idiom: 'Pigg som en mört', first: 'Mårten', last: 'Piggmört' },
    { idiom: 'Backa bandet', first: 'Bengt', last: 'Backaband' },
    { idiom: 'Få kaffet i vrångstrupen', first: 'Kajsa', last: 'Vrångstrupe' },
    { idiom: 'Tummen upp', first: 'Tom', last: 'Tummenupp' },
    { idiom: 'Vara i farozonen', first: 'Zacharias', last: 'Farozon' },
    { idiom: 'Regnet står som spön i backen', first: 'Ragna', last: 'Spöregn' },
    { idiom: 'Vara på ruta ett', first: 'Ruben', last: 'Rutaett' },
    { idiom: 'Fatta galoppen', first: 'Gabbe', last: 'Fattagalopp' },
    { idiom: 'Lägga näsan i blöt', first: 'Nils', last: 'Näsiblöt' },
    { idiom: 'Köpa grisen i säcken', first: 'Greta', last: 'Grisisäcken' },
    { idiom: 'Gå över ån efter vatten', first: 'Åke', last: 'Överån' },
    { idiom: 'Sjunga på sista versen', first: 'Siv', last: 'Sistavers' },
    { idiom: 'Komma som ett brev på posten', first: 'Britt', last: 'Brevpåposten' },
    { idiom: 'Ge järnet', first: 'Jerker', last: 'Gejärnet' },
    { idiom: 'Dra i trådarna', first: 'Dragan', last: 'Trådarna' },
    { idiom: 'Sätta myror i huvudet', first: 'Mirjam', last: 'Myrhuvud' },
  ];

  // How often a name is a "proper" pair from one saying (vs. first name from one
  // saying + last name from another, which gives far more variety). 0–1.
  const CHANCE_ORIGINAL_PAIR = 0.4;
  // ─────────────────────────────────────────────────────────

  root.NameGen.register({
    id: 'quirky-swedish-idioms',
    category: 'quirky',
    label: 'Swedish idiom names',
    description: 'Swedish first + last names hiding a saying (idiom shown underneath).',
    generate(ctx) {
      const a = ctx.pick(IDIOMS);
      if (ctx.chance(CHANCE_ORIGINAL_PAIR)) {
        return { name: a.first + ' ' + a.last, note: a.idiom };
      }
      let b = ctx.pick(IDIOMS);
      while (b === a) b = ctx.pick(IDIOMS);
      return { name: a.first + ' ' + b.last, note: a.idiom + ' × ' + b.idiom };
    },
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
