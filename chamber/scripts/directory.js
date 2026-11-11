/**
 * directory.js
 * Fetches member data from data/members.json and renders
 * member cards on the directory page.
 * Supports Grid ↔ List view toggle.
 */

// ── Constants ──────────────────────────────────────────────────────────────
const DATA_URL   = 'data/members.json';
const CARD_AREA  = document.getElementById('member-cards');
const BTN_GRID   = document.getElementById('btn-grid');
const BTN_LIST   = document.getElementById('btn-list');

const LEVEL_MAP = {
  1: { label: 'Member',        css: 'member' },
  2: { label: 'Silver Member', css: 'silver' },
  3: { label: 'Gold Member',   css: 'gold'   },
};

// ── Fetch & Render ──────────────────────────────────────────────────────────
/**
 * Fetches the JSON data file and returns the members array.
 * @returns {Promise<Array>}
 */
async function fetchMembers() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to load member data: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.members;
}

/**
 * Builds and returns a single member <article> card element.
 * @param {Object} member
 * @returns {HTMLElement}
 */
function buildCard(member, isFirstCard) {
  const { name, address, phone, website, image, membershipLevel,
          tagline, industry, founded } = member;

  const level    = LEVEL_MAP[membershipLevel] ?? LEVEL_MAP[1];
  const hostname = new URL(website).hostname.replace(/^www\./, '');

  const article = document.createElement('article');
  article.classList.add('member-card');

  article.innerHTML = `
    <img
      src="${image}"
      alt="${name} logo"
      width="80"
      height="80"
      loading="${isFirstCard ? 'eager' : 'lazy'}"
      ${isFirstCard ? 'fetchpriority="high"' : ''}
      onerror="this.src='images/placeholder-logo.svg'"
    />
    <h3>${name}</h3>
    <p class="industry">${industry}</p>
    <address>${address}</address>
    <p class="phone">${phone}</p>
    <a class="website" href="${website}" target="_blank" rel="noopener noreferrer">
      ${hostname}
    </a>
    <p class="tagline">"${tagline}"</p>
    <p class="founded">Est. ${founded}</p>
    <span class="membership-level ${level.css}">${level.label}</span>
  `;

  return article;
}

/**
 * Clears the card container and renders all member cards.
 * @param {Array} members
 */
function renderCards(members) {
  CARD_AREA.innerHTML = '';                     // clear loading state
  const fragment = document.createDocumentFragment();
  members.forEach((member, index) => {
    fragment.appendChild(buildCard(member, index === 0));
  });
  CARD_AREA.appendChild(fragment);
}

/**
 * Shows a user-friendly error message inside the card area.
 * @param {Error} err
 */
function showError(err) {
  CARD_AREA.innerHTML = `
    <p class="error-msg" role="alert">
      ⚠️ Unable to load member directory. Please try refreshing the page.
      <br><small>${err.message}</small>
    </p>
  `;
}

// ── View Toggle ─────────────────────────────────────────────────────────────
function setView(view) {
  if (view === 'list') {
    CARD_AREA.classList.add('list-view');
    BTN_LIST.classList.add('active');
    BTN_GRID.classList.remove('active');
    BTN_LIST.setAttribute('aria-pressed', 'true');
    BTN_GRID.setAttribute('aria-pressed', 'false');
    localStorage.setItem('chamber-view', 'list');
  } else {
    CARD_AREA.classList.remove('list-view');
    BTN_GRID.classList.add('active');
    BTN_LIST.classList.remove('active');
    BTN_GRID.setAttribute('aria-pressed', 'true');
    BTN_LIST.setAttribute('aria-pressed', 'false');
    localStorage.setItem('chamber-view', 'grid');
  }
}

BTN_GRID.addEventListener('click', () => setView('grid'));
BTN_LIST.addEventListener('click', () => setView('list'));

// Restore user's last preference
const savedView = localStorage.getItem('chamber-view') ?? 'grid';
setView(savedView);

// ── Init ────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const members = await fetchMembers();
    renderCards(members);
  } catch (err) {
    console.error(err);
    showError(err);
  }
})();
