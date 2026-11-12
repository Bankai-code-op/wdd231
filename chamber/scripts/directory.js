//  Constants
const DATA_URL   = 'data/members.json';
const CARD_AREA  = document.getElementById('member-cards');
const BTN_GRID   = document.getElementById('btn-grid');
const BTN_LIST   = document.getElementById('btn-list');

const LEVEL_MAP = {
  1: { label: 'Member',        css: 'member' },
  2: { label: 'Silver Member', css: 'silver' },
  3: { label: 'Gold Member',   css: 'gold'   },
};

//  Fetch & Render
async function fetchMembers() {
  const response = await fetch(DATA_URL);
  if (!response.ok) {
    throw new Error(`Failed to load member data: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.members;
}

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
    <h2>${name}</h2>
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

function renderCardsChunked(members) {
  const hasStaticFirstCard = CARD_AREA.querySelector('.member-card') !== null;
  const toRender = hasStaticFirstCard ? members.slice(1) : members;
  let i = 0;

  function renderNext(deadline) {
    while (i < toRender.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
      const isFirst = i === 0 && !hasStaticFirstCard;
      CARD_AREA.appendChild(buildCard(toRender[i], isFirst));
      i++;
    }
    if (i < toRender.length) {
      requestIdleCallback(renderNext);
    }
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(renderNext);
  } else {
    function fallbackBatch() {
      const batchEnd = Math.min(i + 2, toRender.length);
      for (; i < batchEnd; i++) {
        CARD_AREA.appendChild(buildCard(toRender[i], false));
      }
      if (i < toRender.length) setTimeout(fallbackBatch, 0);
    }
    fallbackBatch();
  }
}

function showError(err) {
  const errorEl = document.createElement('p');
  errorEl.className = 'error-msg';
  errorEl.setAttribute('role', 'alert');
  errorEl.innerHTML = `
    ⚠️ Unable to load the rest of the member directory. Please try refreshing the page.
    <br><small>${err.message}</small>
  `;
  CARD_AREA.appendChild(errorEl);
}

//  View Toggle
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

const savedView = localStorage.getItem('chamber-view') ?? 'grid';
setView(savedView);

//  Init
function init() {
  (async () => {
    try {
      const members = await fetchMembers();
      renderCardsChunked(members);
    } catch (err) {
      console.error(err);
      showError(err);
    }
  })();
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(init);
} else {
  setTimeout(init, 1);
}
