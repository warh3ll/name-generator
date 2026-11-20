// Run with: node test/smoke.js            (checks every generator)
//           node test/smoke.js --samples  (also prints sample names)
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'src');
require(path.join(src, 'engine.js'));
require(path.join(src, 'categories.js'));
const genDir = path.join(src, 'generators');
for (const f of fs.readdirSync(genDir).filter((f) => f.endsWith('.js')).sort()) require(path.join(genDir, f));

const NG = globalThis.NameGen;
const showSamples = process.argv.includes('--samples');
let failures = 0;

for (const g of NG.generators()) {
  const problems = [];
  if (!NG.categories[g.category]) problems.push('unknown category "' + g.category + '"');

  const rng = NG.seededRng(g.id);
  const names = NG.generateMany(g.id, 100, rng);
  if (names.length < 100) problems.push('only ' + names.length + ' unique names out of 100');
  for (const n of names) {
    if (!n.name || /undefined|\{|\}|NaN|\[object/.test(n.name)) problems.push('bad name: ' + JSON.stringify(n));
  }
  // Same seed must give the same result
  const again = NG.generateOne(g.id, NG.seededRng('x'));
  const again2 = NG.generateOne(g.id, NG.seededRng('x'));
  if (again.name !== again2.name) problems.push('seeded output not reproducible');

  console.log((problems.length ? 'FAIL ' : 'ok   ') + g.id + ' (' + names.length + ' unique)');
  problems.slice(0, 5).forEach((p) => console.log('       - ' + p));
  if (problems.length) failures++;
  if (showSamples) {
    names.slice(0, 12).forEach((n) => console.log('       ' + n.name + (n.note ? '   — ' + n.note : '')));
  }
}

if (failures) {
  console.log('\n' + failures + ' generator(s) failed');
  process.exit(1);
}
console.log('\nAll generators passed');
