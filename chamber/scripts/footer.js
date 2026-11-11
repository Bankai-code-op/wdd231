/**
 * footer.js
 * Writes the copyright year and last-modification date into the footer.
 * Reusable across all chamber pages — just include this script and
 * add the matching elements to each page's footer:
 *
 *   <footer>
 *     <p>&copy; <span id="currentYear"></span> Chamber of Commerce</p>
 *     <p id="lastModified"></p>
 *   </footer>
 */

// ── Copyright year ─────────────────────────────────────────────────────────
const yearEl = document.getElementById('currentYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ── Last modification date ─────────────────────────────────────────────────
// document.lastModified returns a locale string like "11/11/2026 16:04:00"
// We reformat it into a friendlier "Month Day, Year" display.
const modEl = document.getElementById('lastModified');
if (modEl) {
  const raw = document.lastModified;           // "MM/DD/YYYY HH:MM:SS"

  // Parse into a real Date so we can format it properly
  const modDate = new Date(raw);
  const formatted = modDate.toLocaleDateString('en-US', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  });

  modEl.textContent = `Last modified: ${formatted}`;
}

