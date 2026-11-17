const yearEl = document.getElementById('currentYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const modEl = document.getElementById('lastModified');
if (modEl) {
  const raw = document.lastModified;

  const modDate = new Date(raw);
  const formatted = modDate.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });

  modEl.textContent = `Last modified: ${formatted}`;
}

