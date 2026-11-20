/* UI glue: tabs, buttons, results, copy, saved names. No need to edit for new generators. */
(function () {
  'use strict';
  const NG = window.NameGen;
  const $ = (sel) => document.querySelector(sel);
  const SAVED_KEY = 'namegen.saved';

  let currentId = null;

  // ── Saved names (localStorage; wrapped because storage can throw) ──
  function loadSaved() {
    try { return JSON.parse(localStorage.getItem(SAVED_KEY)) || []; } catch (e) { return []; }
  }
  function storeSaved(list) {
    try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }
  let saved = loadSaved();
  const isSaved = (name, gen) => saved.some((s) => s.name === name && s.gen === gen);

  function toggleSaved(name, note, gen) {
    saved = isSaved(name, gen)
      ? saved.filter((s) => !(s.name === name && s.gen === gen))
      : [{ name, note, gen }].concat(saved);
    storeSaved(saved);
    renderSaved();
    document.querySelectorAll('.item .star').forEach((b) => {
      const on = isSaved(b.dataset.name, b.dataset.gen);
      b.classList.toggle('on', on);
      b.textContent = on ? '★' : '☆';
    });
  }

  // ── Helpers ──
  let toastTimer;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 1400);
  }
  function copy(text) {
    const done = () => toast('Copied');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => toast('Could not copy'));
    } else {
      toast('Could not copy');
    }
  }

  function makeItem(result, gen) {
    const li = document.createElement('li');
    li.className = 'item';

    const text = document.createElement('button');
    text.className = 'text';
    text.title = 'Click to copy';
    const n = document.createElement('span');
    n.className = 'n';
    n.textContent = result.name;
    text.appendChild(n);
    if (result.note) {
      const note = document.createElement('span');
      note.className = 'note';
      note.textContent = result.note;
      text.appendChild(note);
    }
    text.addEventListener('click', () => copy(result.name));

    const star = document.createElement('button');
    star.className = 'star';
    star.dataset.name = result.name;
    star.dataset.gen = gen;
    star.title = 'Save this name';
    star.setAttribute('aria-label', 'Save ' + result.name);
    const on = isSaved(result.name, gen);
    star.classList.toggle('on', on);
    star.textContent = on ? '★' : '☆';
    star.addEventListener('click', () => toggleSaved(result.name, result.note, gen));

    li.append(text, star);
    return li;
  }

  // ── Rendering ──
  function renderSaved() {
    const ul = $('#saved');
    ul.textContent = '';
    saved.forEach((s) => ul.appendChild(makeItem({ name: s.name, note: s.note }, s.gen)));
    $('#saved-empty').hidden = saved.length > 0;
    $('#btn-clear-saved').hidden = saved.length === 0;
  }

  function categoryKeys() {
    const used = [...new Set(NG.generators().map((g) => g.category))];
    const known = Object.keys(NG.categories).filter((k) => used.includes(k));
    return known.concat(used.filter((k) => !known.includes(k)));
  }
  const categoryMeta = (key) => NG.categories[key] || { label: key, accent: '#22d3ee' };

  function renderTabs() {
    const gen = NG.get(currentId);
    const catNav = $('#categories');
    catNav.textContent = '';
    categoryKeys().forEach((key) => {
      const b = document.createElement('button');
      b.textContent = categoryMeta(key).label;
      b.setAttribute('aria-current', String(key === gen.category));
      b.addEventListener('click', () => select(NG.generators().find((g) => g.category === key).id));
      catNav.appendChild(b);
    });

    const subNav = $('#subcategories');
    subNav.textContent = '';
    NG.generators().filter((g) => g.category === gen.category).forEach((g) => {
      const b = document.createElement('button');
      b.textContent = g.label;
      b.setAttribute('aria-current', String(g.id === currentId));
      b.addEventListener('click', () => select(g.id));
      subNav.appendChild(b);
    });

    document.documentElement.style.setProperty('--accent', categoryMeta(gen.category).accent);
  }

  function clearResults() {
    $('#single').textContent = '';
    $('#results').textContent = '';
    $('#results').className = '';
    $('#list-actions').hidden = true;
  }

  function select(id) {
    currentId = id;
    const gen = NG.get(id);
    $('#gen-title').textContent = gen.label;
    $('#gen-description').textContent = gen.description || '';
    try {
      if (location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    } catch (e) { /* some browsers refuse this on file:// pages; the link just won't update */ }
    renderTabs();
    clearResults();
    generateOne();
  }

  function generateOne() {
    const result = NG.generateOne(currentId);
    const box = $('#single');
    box.textContent = '';
    $('#results').textContent = '';
    $('#list-actions').hidden = true;

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = result.name;
    box.appendChild(name);
    if (result.note) {
      const note = document.createElement('div');
      note.className = 'note';
      note.textContent = result.note;
      box.appendChild(note);
    }
    const row = document.createElement('div');
    row.style.marginTop = '.75rem';
    const copyBtn = document.createElement('button');
    copyBtn.className = 'ghost small';
    copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', () => copy(result.name));
    const starBtn = document.createElement('button');
    starBtn.className = 'ghost small';
    starBtn.textContent = isSaved(result.name, currentId) ? '★ Saved' : '☆ Save';
    starBtn.addEventListener('click', () => {
      toggleSaved(result.name, result.note, currentId);
      starBtn.textContent = isSaved(result.name, currentId) ? '★ Saved' : '☆ Save';
    });
    row.append(copyBtn, ' ', starBtn);
    box.appendChild(row);
  }

  function generateMany() {
    const input = $('#count');
    let count = parseInt(input.value, 10);
    if (!(count >= 1)) count = 20;
    count = Math.min(count, 100);
    input.value = count;

    const results = NG.generateMany(currentId, count);
    $('#single').textContent = '';
    const ol = $('#results');
    ol.textContent = '';
    ol.className = 'many';
    results.forEach((r) => ol.appendChild(makeItem(r, currentId)));
    $('#list-actions').hidden = false;
    $('#btn-copy-all').onclick = () => copy(results.map((r) => r.name).join('\n'));
  }

  // ── Wire up ──
  $('#btn-one').addEventListener('click', generateOne);
  $('#btn-many').addEventListener('click', generateMany);
  $('#count').addEventListener('keydown', (e) => { if (e.key === 'Enter') generateMany(); });
  $('#btn-clear-saved').addEventListener('click', () => {
    saved = [];
    storeSaved(saved);
    renderSaved();
    document.querySelectorAll('.item .star').forEach((b) => { b.classList.remove('on'); b.textContent = '☆'; });
  });

  renderSaved();
  const fromHash = location.hash.slice(1);
  select(NG.get(fromHash) ? fromHash : NG.generators()[0].id);
})();
