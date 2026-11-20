/*
 * Categories shown as the top-level tabs. Order here = order in the UI.
 * Add a new category here, then point a generator at it with `category: 'key'`.
 */
(function (root) {
  'use strict';
  const NameGen = (root.NameGen = root.NameGen || {});

  NameGen.categories = {
    scifi: { label: 'Sci-fi, cyberpunk & netrunner', accent: '#22d3ee' },
    quirky: { label: 'Quirky', accent: '#facc15' },
    fantasy: { label: 'Fantasy', accent: '#4ade80' },
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
