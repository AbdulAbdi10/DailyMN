/* Preserve the original top-level JSON array used by Daily Digest MN. */
(function () {
  function validate(entries) {
    if (!Array.isArray(entries)) throw new Error('Journal must be a JSON array.');
    for (const entry of entries) {
      if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
        throw new Error('Each journal entry must be an object.');
      }
      for (const field of ['date', 'title', 'topic', 'body']) {
        if (typeof entry[field] !== 'string') throw new Error('Missing text field: ' + field);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) throw new Error('Use YYYY-MM-DD dates.');
    }
    return Digest.validate(entries);
  }
  CMS.registerCustomFormat('journal-json', 'json', {
    fromFile: function (text) {
      return { entries: validate(JSON.parse(text)) };
    },
    toFile: function (value) {
      const entries = validate(value.entries);
      const sorted = entries.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
      return JSON.stringify(sorted, null, 2) + '\n';
    }
  });
})();
