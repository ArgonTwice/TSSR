// app.js — TSSR Study App

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage?.addListener(() => true);
}

// ===== STORAGE =====
const store = {
  get: k => { try { return JSON.parse(localStorage.getItem('tssr_' + k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem('tssr_' + k, JSON.stringify(v)),
};

// ===== STATE =====
let state = {
  currentModule: null,
  currentCours: null,
  currentTab: null,
  currentScreen: 'home',  // 'home' | 'module' | 'terminal-fs'
  currentTerminal: null,  // 'linux' | 'windows' | 'cmd' | 'gameshell' | 'netrunner'
  openAccordion: null,
  qcm: { questions: [], idx: 0, answers: [], locked: false, done: false },
  fc: { cards: [], idx: 0, flipped: false, session: { easy: 0, medium: 0, hard: 0 } },
  cli: { type: null, history: [], histIdx: -1, cwd: '/', env: {} },
};

// ===== UTILS =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function sanitizeText(str) {
  if (!str) return '';
  return str
    .replace(/\u2500/g, '-').replace(/\u2501/g, '-')
    .replace(/\u2502/g, '|').replace(/\u2503/g, '|')
    .replace(/\u250C/g, '+').replace(/\u2510/g, '+').replace(/\u2514/g, '+').replace(/\u2518/g, '+')
    .replace(/\u251C/g, '+').replace(/\u2524/g, '+').replace(/\u252C/g, '+').replace(/\u2534/g, '+').replace(/\u253C/g, '+')
    .replace(/\u2550/g, '=').replace(/\u2551/g, '|')
    .replace(/\u2554/g, '+').replace(/\u2557/g, '+').replace(/\u255A/g, '+').replace(/\u255D/g, '+')
    .replace(/\u2560/g, '+').replace(/\u2563/g, '+').replace(/\u2566/g, '+').replace(/\u2569/g, '+').replace(/\u256C/g, '+')
    .replace(/\u2192/g, '->').replace(/\u2190/g, '<-').replace(/\u2191/g, '^').replace(/\u2193/g, 'v')
    .replace(/\u21D2/g, '=>').replace(/\u21D0/g, '<=').replace(/\u2194/g, '<->')
    .replace(/\u2014/g, '--').replace(/\u2013/g, '-').replace(/\u2026/g, '...')
    .replace(/\u00B2/g, '^2').replace(/\u00B3/g, '^3').replace(/\u00B9/g, '^1')
    .replace(/\u2070/g, '^0').replace(/\u2074/g, '^4').replace(/\u2075/g, '^5')
    .replace(/\u2076/g, '^6').replace(/\u2077/g, '^7').replace(/\u2078/g, '^8').replace(/\u2079/g, '^9')
    .replace(/\u2713/g, '[OK]').replace(/\u2717/g, '[X]').replace(/\u2718/g, '[X]')
    .replace(/\u2022/g, '*').replace(/\u00B7/g, '.')
    .replace(/\u00AB/g, '"').replace(/\u00BB/g, '"')
    .replace(/\u2018/g, "'").replace(/\u2019/g, "'")
    .replace(/\u201C/g, '"').replace(/\u201D/g, '"')
    .replace(/\u2020/g, '+').replace(/\u2021/g, '++')
    .replace(/\u25BA/g, '>').replace(/\u25C4/g, '<')
    .replace(/\u2248/g, '~=').replace(/\u2260/g, '!=')
    .replace(/\u2264/g, '<=').replace(/\u2265/g, '>=');
}
function getProgress(moduleId) {
  return store.get('progress_' + moduleId) || { pct: 0, qcm_best: 0, fc_mastered: 0 };
}
function setProgress(moduleId, data) {
  const prev = getProgress(moduleId);
  store.set('progress_' + moduleId, { ...prev, ...data });
  renderNav();
}

// ===== SIDEBAR SEARCH =====
let sidebarSearchQuery = '';

function initSidebarSearch() {
  const input = document.getElementById('sidebar-search-input');
  if (!input) return;
  input.addEventListener('input', () => {
    sidebarSearchQuery = input.value.toLowerCase().trim();
    renderNav();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { input.value = ''; sidebarSearchQuery = ''; renderNav(); }
  });
}

// ===== RENDER NAV =====
const MODULE_GROUPS = [
  { label: 'Fondamentaux',  ids: ['numerisation', 'reseaux', 'securite'] },
  { label: 'Linux',          ids: ['linux', 'linux-server'] },
  { label: 'Windows',        ids: ['windows', 'windows-server'] },
  { label: 'Infrastructure', ids: ['virtualisation', 'cisco', 'supervision'] },
];

function renderNav() {
  const nav = document.getElementById('module-nav');
  nav.innerHTML = '';

  const GROUPES = [
    { label: 'Réseaux',             modules: ['reseaux', 'cisco'] },
    { label: 'Systèmes Windows',    modules: ['windows', 'windows-server', 'ad-avance', 'messagerie'] },
    { label: 'Systèmes Linux',      modules: ['linux', 'linux-server'] },
    { label: 'Infrastructure',      modules: ['stockage', 'virtualisation', 'supervision', 'cloud'] },
    { label: 'Développement & BDD', modules: ['scripting-avance'] },
    { label: 'Fondamentaux',        modules: ['numerisation', 'securite'] },
    { label: 'Projet',              modules: ['documentation'] },
  ];

  const sq = sidebarSearchQuery;
  const isTermActive = state.currentScreen === 'terminal-fs';
  const isTermOpen   = state.openAccordion === 'terminals';
  const termKeywords = ['terminaux','terminal','linux','powershell','cmd','gameshell','netrunner'];
  const termVisible  = !sq || termKeywords.some(k => k.includes(sq));

  if (termVisible) {
    const termBtn = document.createElement('button');
    termBtn.className = 'nav-item nav-item-terminals' + (isTermActive ? ' active' : '');
    termBtn.setAttribute('aria-label', 'Terminaux');
    termBtn.setAttribute('aria-expanded', String(isTermOpen));
    termBtn.dataset.moduleId = 'terminals';
    termBtn.innerHTML = `
      <span class="nav-item-icon" style="background:rgba(0,229,160,0.1);color:var(--accent)">>_</span>
      <span>Terminaux</span>
      <span class="nav-chevron${isTermOpen ? ' open' : ''}">›</span>`;
    termBtn.addEventListener('click', () => toggleAccordion('terminals'));
    nav.appendChild(termBtn);

    const TERM_ITEMS = [
      { id: 'linux',     label: 'Terminal Linux' },
      { id: 'windows',   label: 'Terminal PowerShell' },
      { id: 'cmd',       label: 'Terminal Windows (CMD)' },
      { id: 'gameshell', label: 'GameShell' },
      { id: 'netrunner', label: 'NetRunner' },
    ];
    const termPanel = document.createElement('div');
    termPanel.className = 'nav-accordion' + (isTermOpen ? ' open' : '');
    termPanel.id = 'nav-acc-terminals';
    TERM_ITEMS.forEach(item => {
      const iBtn = document.createElement('button');
      iBtn.className = 'nav-cours-item' + (isTermActive && state.currentTerminal === item.id ? ' active' : '');
      iBtn.textContent = item.label;
      iBtn.addEventListener('click', () => { openTerminalFullscreen(item.id); closeSidebar(); });
      termPanel.appendChild(iBtn);
    });
    nav.appendChild(termPanel);
  }

  GROUPES.forEach(groupe => {
    const modulesGroupe = groupe.modules
      .map(id => MODULES.find(m => m.id === id))
      .filter(Boolean)
      .filter(m => !sq || m.label.toLowerCase().includes(sq) || m.id.toLowerCase().includes(sq));
    if (!modulesGroupe.length) return;

    const label = document.createElement('p');
    label.className = 'nav-section-label';
    label.textContent = groupe.label;
    nav.appendChild(label);

    modulesGroupe.forEach(m => {
      const isActive    = state.currentModule?.id === m.id;
      const isOpen      = state.openAccordion === m.id;
      const hasAccordion = m.cours.length > 1;

      const btn = document.createElement('button');
      btn.className = 'nav-item' + (isActive ? ' active' : '');
      btn.setAttribute('aria-label', m.label);
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.dataset.moduleId = m.id;

      const _iconEl = document.createElement('span');
      _iconEl.className = 'nav-item-icon';
      _iconEl.style.cssText = `background:${m.color}22;color:${m.color}`;
      _iconEl.textContent = (m.icon && [...m.icon].length <= 2) ? m.icon : m.label.slice(0, 2).toUpperCase();
      const _labelEl = document.createElement('span');
      _labelEl.textContent = m.label;
      btn.appendChild(_iconEl);
      btn.appendChild(_labelEl);

      if (hasAccordion) {
        const _chev = document.createElement('span');
        _chev.className = 'nav-chevron' + (isOpen ? ' open' : '');
        _chev.textContent = '›';
        btn.appendChild(_chev);
        btn.addEventListener('click', () => toggleAccordion(m.id));
      } else {
        btn.addEventListener('click', () => {
          if (m.cours.length === 1) {
            openModule(m.id, false, m.cours[0].id);
          } else {
            openModule(m.id);
          }
          closeSidebar();
        });
      }
      nav.appendChild(btn);

      if (hasAccordion) {
        const panel = document.createElement('div');
        panel.className = 'nav-accordion' + (isOpen ? ' open' : '');
        panel.id = 'nav-acc-' + m.id;
        m.cours.forEach(c => {
          const isCoursActive = isActive && state.currentCours === c.id;
          const cBtn = document.createElement('button');
          cBtn.className = 'nav-cours-item' + (isCoursActive ? ' active' : '');
          const titre = sanitizeText(c.titre);
          cBtn.textContent = titre.length > 55 ? titre.slice(0, 52) + '...' : titre;
          cBtn.title = titre;
          cBtn.addEventListener('click', () => {
            openModule(m.id, false, c.id);
            closeSidebar();
          });
          panel.appendChild(cBtn);
        });
        nav.appendChild(panel);
      }
    });
  });
}
function toggleAccordion(moduleId) {
  const isOpen = state.openAccordion === moduleId;
  // Close previous accordion if different
  if (state.openAccordion && state.openAccordion !== moduleId) {
    const prevPanel = document.getElementById('nav-acc-' + state.openAccordion);
    const prevBtn   = document.querySelector(`[data-module-id="${state.openAccordion}"]`);
    if (prevPanel) prevPanel.classList.remove('open');
    if (prevBtn)   prevBtn.querySelector('.nav-chevron')?.classList.remove('open');
  }
  state.openAccordion = isOpen ? null : moduleId;
  store.set('sidebar_open', state.openAccordion);
  const panel = document.getElementById('nav-acc-' + moduleId);
  const btn   = document.querySelector(`[data-module-id="${moduleId}"]`);
  if (panel) panel.classList.toggle('open', !isOpen);
  if (btn)   btn.querySelector('.nav-chevron')?.classList.toggle('open', !isOpen);
}
// ===== HOME =====
function goHome() {
  state.currentCours = null;
  renderHome();
}
function renderHome() {
  const grid = document.getElementById('module-grid');
  if (!grid) return;
  history.replaceState({ screen: 'home' }, '', '#');
  state.currentModule = null;
  state.currentTerminal = null;
  state.currentScreen = 'home';
  const mname = document.getElementById('mobile-module-name');
  if (mname) mname.textContent = '';
  renderNav();
  grid.innerHTML = '';
  MODULES.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.style = `--card-color:${m.color};animation-delay:${i*40}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Module ${m.label}`);
    card.innerHTML = `
      ${!m.cours.length ? '<span class="module-empty-badge">À venir</span>' : ''}
      <div class="module-card-icon-box"><span class="module-card-icon"></span></div>
      <div class="module-card-title"></div>
      <div class="module-card-desc"></div>
      <div class="module-card-tags"></div>`;
    card.querySelector('.module-card-icon').textContent = m.icon;
    card.querySelector('.module-card-title').textContent = m.label;
    card.querySelector('.module-card-desc').textContent = m.desc;
    const tagsEl = card.querySelector('.module-card-tags');
    const tagSpan = document.createElement('span');
    tagSpan.className = m.cours.length ? 'tag has-content' : 'tag';
    tagSpan.textContent = m.cours.length ? `cours (${m.cours.length})` : 'À venir';
    tagsEl.appendChild(tagSpan);
    card.addEventListener('click', () => openModule(m.id));
    card.addEventListener('keydown', e => e.key === 'Enter' && openModule(m.id));
    grid.appendChild(card);
  });
  showScreen('home-screen');
}

// ===== OPEN MODULE =====
function openModule(moduleId, skipHistory = false, directCours = null) {
  const m = MODULES.find(x => x.id === moduleId);
  if (!m) return;
  state.currentModule = m;
  state.currentCours = directCours;
  if (m.cours.length > 1) {
    state.openAccordion = m.id;
    store.set('sidebar_open', m.id);
  }
  document.getElementById('mobile-module-name').textContent = m.label;
  renderNav();
  const meta = document.getElementById('module-meta');
  meta.innerHTML = '';
  const _mIcon = document.createElement('span');
  _mIcon.className = 'module-meta-icon';
  _mIcon.textContent = m.icon;
  const _mTitle = document.createElement('span');
  _mTitle.className = 'module-meta-title';
  _mTitle.textContent = m.label;
  const _mBadge = document.createElement('span');
  _mBadge.className = 'module-meta-badge';
  _mBadge.style.cssText = `background:${m.color}22;color:${m.color}`;
  _mBadge.textContent = m.topics.slice(0,3).join(' · ');
  meta.appendChild(_mIcon);
  meta.appendChild(_mTitle);
  meta.appendChild(_mBadge);

  const TABS_ICONS = {
    cours:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><line x1="3.5" y1="4.5" x2="10.5" y2="4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="7" x2="10.5" y2="7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="9.5" x2="7.5" y2="9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    outils:      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 2.5L11.5 5.5L5.5 11.5L2 12L2.5 8.5L8.5 2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M7 4L10 7" stroke="currentColor" stroke-width="1.3"/></svg>',
    notes:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10v10H2z" stroke="currentColor" stroke-width="1.3"/><line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="4" y1="7.5" x2="10" y2="7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="4" y1="10" x2="7" y2="10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    linux_cli:   '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 5L6 7L3.5 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="7" y1="9" x2="10.5" y2="9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    windows_cli: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3 5.5L5.5 7.5L3 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="6.5" y1="9.5" x2="11" y2="9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    gameshell:   '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 5L6 7L3.5 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="7" y1="9" x2="10.5" y2="9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    netrunner:   '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3 5.5L5.5 7.5L3 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="6.5" y1="9.5" x2="11" y2="9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  };
  const tabs = [];
  if (m.cours.length)       tabs.push({ id: 'cours',       label: 'Cours',          cli: false });
  if (m.linux_cli)          tabs.push({ id: 'linux_cli',   label: 'Terminal',       cli: true,  color: '#00e5a0' });
  if (m.windows_cli)        tabs.push({ id: 'windows_cli', label: 'PowerShell',     cli: true,  color: '#3b82f6' });
  if (m.id === 'linux' && m.gameshell)   tabs.push({ id: 'gameshell',  label: 'Pratique',       cli: true, color: '#00e5a0' });
  if (m.id === 'windows' && m.netrunner) tabs.push({ id: 'netrunner',  label: 'Jeu PowerShell', cli: true, color: '#0ea5e9' });
  if (m.outils) tabs.push({ id: 'outils', label: 'Outils', cli: false });
  tabs.push({ id: 'notes', label: 'Notes', cli: false });

  const tabBar = document.getElementById('tab-bar');
  tabBar.innerHTML = '';
  if (tabs.length === 0) {
    renderTabContent('empty');
    showScreen('module-screen');
    if (!skipHistory) {
      history.replaceState({ ...history.state, scroll: document.getElementById('content').scrollTop }, '', location.href);
      history.pushState({ screen: 'module', moduleId: m.id, tab: null, scroll: 0 }, '', '#module-' + m.id);
    }
    closeSidebar();
    return;
  }
  tabs.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (t.cli ? ' tab-btn-cli' : '');
    if (t.cli) btn.style.setProperty('--cli-color', t.color);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.setAttribute('aria-controls', 'tab-content');
    btn.dataset.tab = t.id;
    const _tabIcon = TABS_ICONS[t.id] || '';
    btn.innerHTML = t.cli
      ? `<span class="tab-btn-cli-icon">${_tabIcon}</span><span>${t.label}</span><span class="tab-btn-cli-dot"></span>`
      : `<span class="tab-btn-icon">${_tabIcon}</span>${t.label}`;
    btn.addEventListener('click', () => switchTab(t.id));
    tabBar.appendChild(btn);
  });
  switchTab(tabs[0].id, true, true);
  showScreen('module-screen');
  if (!skipHistory) {
    history.replaceState({ ...history.state, scroll: document.getElementById('content').scrollTop }, '', location.href);
    const _firstTab = tabs[0].id;
    const _initCoursPath = (_firstTab === 'cours' && state.currentCours) ? '/' + state.currentCours : '';
    history.pushState({ screen: 'module', moduleId: m.id, tab: _firstTab, coursId: state.currentCours, scroll: 0 }, '', '#module-' + m.id + '/' + _firstTab + _initCoursPath);
  }
  closeSidebar();
}

// ===== TABS =====
function switchTab(tabId, skipHistory, keepCours = false) {
  if (!keepCours) state.currentCours = null;
  state.currentTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
    b.setAttribute('aria-selected', b.dataset.tab === tabId ? 'true' : 'false');
  });
  renderTabContent(tabId);
  if (!skipHistory && state.currentModule) {
    history.replaceState({ ...history.state, scroll: document.getElementById('content').scrollTop }, '', location.href);
    const _coursPath = (tabId === 'cours' && state.currentCours) ? '/' + state.currentCours : '';
    history.pushState(
      { screen: 'module', moduleId: state.currentModule.id, tab: tabId, coursId: state.currentCours, scroll: 0 },
      '',
      '#module-' + state.currentModule.id + '/' + tabId + _coursPath
    );
  }
}
function renderTabContent(tabId) {
  const el = document.getElementById('tab-content');
  const m = state.currentModule;
  if (tabId === 'empty' || !m) {
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">\u{1F527}</span><h3>Contenu à venir</h3><p>Ce module sera alimenté prochainement.</p></div>`;
    return;
  }
  if (tabId === 'cours')       renderCours(m, el);
  else if (tabId === 'linux_cli')   renderCLI('linux', m, el);
  else if (tabId === 'windows_cli') renderCLI('windows', m, el);
  else if (tabId === 'gameshell')    renderGameshell(el);
  else if (tabId === 'netrunner')    renderNetrunner(el);
  else if (tabId === 'outils')      renderOutils(m, el);
  else if (tabId === 'notes')       renderNotes(m, { id: state.currentCours || 'main' }, el);
}

// ===== GAMESHELL =====
function renderGameshell(el) {
  el.innerHTML = `
  <div style="width:100%;height:calc(100vh - 280px);min-height:500px;">
    <iframe src="gameshell.html" style="width:100%;height:100%;border:none;border-radius:8px;" title="GameShell — Terminal Linux"></iframe>
  </div>`;
}

// ===== NETRUNNER =====
function renderNetrunner(el) {
  el.innerHTML = `
  <div style="padding:0 0 16px">
    <div class="info-box" style="margin-bottom:16px">Jeu d'entraînement PowerShell/CMD — 3 missions progressives. Tape <strong>help</strong> dans le terminal pour les indices.</div>
    <table><thead><tr><th>Mission</th><th>Objectif</th><th>Commandes clés</th></tr></thead><tbody>
      <tr><td>1 — Infiltration Initiale</td><td>Tuer un processus et récupérer un flag</td><td><code>taskkill</code> · <code>dir</code> · <code>type</code></td></tr>
      <tr><td>2 — Extraction de Données</td><td>Localiser des credentials cachés</td><td><code>tasklist</code> · <code>taskkill</code> · <code>dir</code> · <code>type</code></td></tr>
      <tr><td>3 — Nettoyage des Traces</td><td>Effacer les logs avant détection IDS</td><td><code>wevtutil el</code> · <code>wevtutil cl</code> · <code>wevtutil qe</code></td></tr>
    </tbody></table>
  </div>
  <div style="width:100%;height:calc(100vh - 420px);min-height:460px;">
    <iframe src="netrunner.html" style="width:100%;height:100%;border:none;border-radius:8px;" title="NetRunner — Jeu PowerShell"></iframe>
  </div>`;
}

// ===== COURS =====
function renderCours(m, el) {
  if (!m.cours.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">\u{1F527}</span><h3>Cours à venir</h3><p>Les cours seront ajoutés prochainement.</p></div>`;
    return;
  }
  if (m.cours.length === 1) {
    state.currentCours = m.cours[0].id;
    renderCoursDetail(m, m.cours[0], 0, el);
    return;
  }
  if (state.currentCours) {
    const idx = m.cours.findIndex(c => c.id === state.currentCours);
    if (idx !== -1) {
      renderCoursDetail(m, m.cours[idx], idx, el);
      return;
    }
  }
  renderCoursIndex(m, el);
}
function renderCoursIndex(m, el) {
  const grid = m.cours.map((c, i) => `
    <div class="cours-card" role="button" tabindex="0"
         onclick="openCours('${c.id}')"
         onkeydown="if(event.key==='Enter')openCours('${c.id}')">
      <div class="cours-card-num">${String(i + 1).padStart(2, '0')}</div>
      <div class="cours-card-body">
        <div class="cours-card-title">${sanitizeText(c.titre)}</div>
        ${c.badge ? `<span class="cours-badge cours-badge-${c.badge}">${c.badge.toUpperCase()}</span>` : ''}
      </div>
    </div>`).join('');
  el.innerHTML = `<div class="cours-index"><div class="cours-index-grid">${grid}</div></div>`;
}
function renderCoursDetail(m, cours, idx, el) {
  const article = document.createElement('article');
  article.className = 'cours-article';
  article.id = `cours-${cours.id}`;

  const header = document.createElement('div');
  header.className = 'cours-article-header';
  const numDiv = document.createElement('div');
  numDiv.className = 'cours-article-num';
  numDiv.textContent = String(idx + 1).padStart(2, '0');
  const titleWrap = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.className = 'cours-article-title';
  h2.textContent = sanitizeText(cours.titre);
  titleWrap.appendChild(h2);
  if (cours.badge) {
    const badge = document.createElement('span');
    badge.className = `cours-badge cours-badge-${cours.badge}`;
    badge.textContent = cours.badge.toUpperCase();
    titleWrap.appendChild(badge);
  }
  header.appendChild(numDiv);
  header.appendChild(titleWrap);
  article.appendChild(header);

  const content = document.createElement('div');
  content.className = 'cours-content';
  (cours.sections || []).forEach(s => content.appendChild(renderSection(s)));
  article.appendChild(content);

  const breadcrumb = document.createElement('nav');
  breadcrumb.className = 'cours-breadcrumb';
  const bcMod = document.createElement('span');
  bcMod.textContent = m.label;
  const bcSep = document.createElement('span');
  bcSep.className = 'bc-sep';
  bcSep.textContent = '\u203A';
  const bcTitle = document.createElement('span');
  bcTitle.textContent = sanitizeText(cours.titre);
  breadcrumb.appendChild(bcMod);
  breadcrumb.appendChild(bcSep);
  breadcrumb.appendChild(bcTitle);

  const aiBtn = document.createElement('button');
  aiBtn.className = 'btn-ai-explain';
  aiBtn.innerHTML = '&#x2728; Expliquer visuellement ce cours';
  aiBtn.onclick = () => openAIExplainer(cours.titre, cours.sections);

  const wrap = document.createElement('div');
  wrap.className = 'cours-container';
  wrap.appendChild(breadcrumb);
  wrap.appendChild(article);
  wrap.appendChild(aiBtn);
  el.innerHTML = '';
  el.appendChild(wrap);
}
function openAIExplainer(titre, sections) {
  const contexte = sections
    .filter(s => s.type === 'p' || s.type === 'h2')
    .map(s => s.content)
    .join('\n')
    .slice(0, 800);

  const prompt = `Je révise pour mon BTS TSSR. Explique-moi "${titre}" de manière simple et visuelle :
1. Une analogie du quotidien
2. Les 3-5 points clés à retenir
3. Un exemple concret
4. Une astuce mémo

Contexte : ${contexte}`;

  const encoded = encodeURIComponent(prompt);
  const claudeUrl = `https://claude.ai/new?q=${encoded}`;

  const overlay = document.createElement('div');
  overlay.className = 'ai-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="ai-modal">
      <div class="ai-modal-header">
        <span class="ai-modal-title">&#x2728; Explication IA — ${titre}</span>
        <button class="ai-modal-close" onclick="this.closest('.ai-overlay').remove()">&#x2715;</button>
      </div>
      <div class="ai-modal-body" style="text-align:center;padding:2rem">
        <p style="color:#94a3b8;margin-bottom:1.5rem;line-height:1.6">
          Clique sur le bouton ci-dessous pour obtenir une explication
          personnalisée de <strong style="color:#e2e8f0">${titre}</strong>
          générée par Claude AI.
        </p>
        <a href="${claudeUrl}" target="_blank" rel="noopener"
           class="btn-open-claude"
           onclick="this.closest('.ai-overlay').remove()">
          &#x2728; Ouvrir dans Claude AI
        </a>
        <p style="color:#475569;font-size:0.78rem;margin-top:1.5rem">
          S’ouvre dans un nouvel onglet · Nécessite un compte Claude gratuit
        </p>
        <details style="margin-top:1.5rem;text-align:left">
          <summary style="color:#64748b;font-size:0.82rem;cursor:pointer">
            Voir la question préparée
          </summary>
          <pre style="background:#0d1117;border:1px solid #1e293b;border-radius:8px;padding:1rem;margin-top:0.75rem;font-size:0.78rem;color:#94a3b8;white-space:pre-wrap;word-break:break-word">${prompt}</pre>
        </details>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}
function openCours(coursId) {
  const m = state.currentModule;
  if (!m) return;
  const idx = m.cours.findIndex(c => c.id === coursId);
  if (idx === -1) return;
  state.currentCours = coursId;
  renderNav();
  const el = document.getElementById('tab-content');
  renderCoursDetail(m, m.cours[idx], idx, el);
  history.replaceState({ ...history.state, scroll: document.getElementById('content').scrollTop }, '', location.href);
  history.pushState(
    { screen: 'module', moduleId: m.id, tab: 'cours', coursId: coursId, scroll: 0 },
    '',
    '#module-' + m.id + '/cours/' + coursId
  );
  document.getElementById('content').scrollTop = 0;
}
function renderCoursContent(sections) {
  if (!sections) return '';
  return sections.map(s => {
    if (typeof s === 'string') return `<p>${sanitizeText(s)}</p>`;
    if (s.type === 'p')     return `<p>${sanitizeText(s.content)}</p>`;
    if (s.type === 'html') {
      let content = s.content;
      content = content.replace(/<head[\s\S]*?<\/head>/gi, '');
      content = content.replace(/<style[\s\S]*?<\/style>/gi, '');
      content = content.replace(/<script[\s\S]*?<\/script>/gi, '');
      content = content.replace(/<\/?html[^>]*>/gi, '');
      content = content.replace(/<\/?body[^>]*>/gi, '');
      content = content.replace(/<\/?head[^>]*>/gi, '');
      content = content.replace(/\s*style="[^"]*"/gi, '');
      content = content.replace(/\s*class="[^"]*"/gi, '');
      return `<div class="cours-html-block">${content}</div>`;
    }
    if (s.type === 'code')  return `<pre class="code-block">${escHtml(sanitizeText(s.content))}</pre>`;
    if (s.type === 'info')  return `<div class="info-box">${sanitizeText(s.content)}</div>`;
    if (s.type === 'warn')  return `<div class="warn-box">${sanitizeText(s.content)}</div>`;
    if (s.type === 'ul')    return `<ul>${s.items.map(i=>`<li>${sanitizeText(i)}</li>`).join('')}</ul>`;
    if (s.type === 'ol')    return `<ol>${s.items.map(i=>`<li>${sanitizeText(i)}</li>`).join('')}</ol>`;
    if (s.type === 'table') return renderTable(s);
    if (s.type === 'h2')    return `<h2>${sanitizeText(s.content)}</h2>`;
    if (s.type === 'h3')    return `<h3>${sanitizeText(s.content)}</h3>`;
    if (s.type === 'schema') return renderSchema(s.content);
    if (s.type === 'steps')  return renderSteps(s.items);
    if (s.type === 'html-file') {
      const uid = 'hf-' + Math.random().toString(36).slice(2, 9);
      setTimeout(() => {
        const el = document.getElementById(uid);
        if (!el) return;
        fetch(s.src)
          .then(r => r.text())
          .then(html => {
            html = html.replace(/<head[\s\S]*?<\/head>/gi, '');
            html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
            html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
            html = html.replace(/<\/?html[^>]*>/gi, '');
            html = html.replace(/<\/?body[^>]*>/gi, '');
            html = html.replace(/\s*style="[^"]*"/gi, '');
            html = html.replace(/\s*class="[^"]*"/gi, '');
            el.innerHTML = html;
          })
          .catch(() => { el.innerHTML = '<div class="warn-box">Erreur de chargement.</div>'; });
      }, 0);
      return `<div class="cours-html-block" id="${uid}"></div>`;
    }
    return '';
  }).join('');
}
function renderSchema(txt) {
  return `<pre class="schema-block">${escHtml(sanitizeText(txt))}</pre>`;
}
function renderSteps(items) {
  return items.map(step => {
    const codeBlock = step.code ? `<pre class="code-block" style="margin-top:10px">${escHtml(sanitizeText(step.code))}</pre>` : '';
    const whyBlock = step.why ? `<div class="step-why-block">${sanitizeText(step.why)}</div>` : '';
    return `<div class="cours-step">
      <div class="cours-step-num">${escHtml(step.num)}</div>
      <div class="cours-step-body">
        <div class="cours-step-title">${sanitizeText(step.title)}</div>
        ${step.content ? `<div class="cours-step-content">${sanitizeText(step.content)}</div>` : ''}
        ${codeBlock}
        ${whyBlock}
      </div>
    </div>`;
  }).join('');
}
function renderTable(s) {
  const thead = s.headers.map(h=>`<th>${sanitizeText(h)}</th>`).join('');
  const tbody = s.rows.map(r=>`<tr>${r.map(c=>`<td>${sanitizeText(String(c))}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`;
}

// ===== RENDER SECTION (DOM-based, textContent pour code/schema) =====
function renderSection(section) {
  const wrap = document.createElement('div');

  if (typeof section === 'string') {
    const p = document.createElement('p');
    p.innerHTML = sanitizeText(section);
    wrap.appendChild(p);
    return wrap;
  }

  switch (section.type) {
    case 'h2': {
      const h = document.createElement('h2');
      h.textContent = sanitizeText(section.content);
      wrap.appendChild(h); break;
    }
    case 'h3': {
      const h = document.createElement('h3');
      h.textContent = sanitizeText(section.content);
      wrap.appendChild(h); break;
    }
    case 'p': {
      const p = document.createElement('p');
      p.innerHTML = sanitizeText(section.content);
      wrap.appendChild(p); break;
    }
    case 'code': {
      const pre = document.createElement('pre');
      pre.className = 'code-block';
      pre.textContent = section.content;
      wrap.appendChild(pre); break;
    }
    case 'schema': {
      const pre = document.createElement('pre');
      pre.className = 'schema-block';
      pre.textContent = section.content;
      wrap.appendChild(pre); break;
    }
    case 'svg': {
      const div = document.createElement('div');
      div.className = 'schema-svg-wrapper';
      div.innerHTML = section.content;
      wrap.appendChild(div); break;
    }
    case 'info': {
      const div = document.createElement('div');
      div.className = 'info-box';
      div.innerHTML = sanitizeText(section.content);
      wrap.appendChild(div); break;
    }
    case 'warn': {
      const div = document.createElement('div');
      div.className = 'warn-box';
      div.innerHTML = sanitizeText(section.content);
      wrap.appendChild(div); break;
    }
    case 'ul': {
      const ul = document.createElement('ul');
      (section.items || []).forEach(i => {
        const li = document.createElement('li');
        li.innerHTML = sanitizeText(i);
        ul.appendChild(li);
      });
      wrap.appendChild(ul); break;
    }
    case 'ol': {
      const ol = document.createElement('ol');
      (section.items || []).forEach(i => {
        const li = document.createElement('li');
        li.innerHTML = sanitizeText(i);
        ol.appendChild(li);
      });
      wrap.appendChild(ol); break;
    }
    case 'table': {
      const tbl = document.createElement('table');
      const thead = document.createElement('thead');
      const hr = document.createElement('tr');
      (section.headers || []).forEach(h => {
        const th = document.createElement('th');
        th.textContent = sanitizeText(h);
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      tbl.appendChild(thead);
      const tbody = document.createElement('tbody');
      (section.rows || []).forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
          const td = document.createElement('td');
          td.innerHTML = sanitizeText(String(cell));
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      tbl.appendChild(tbody);
      wrap.appendChild(tbl); break;
    }
    case 'steps': {
      (section.items || []).forEach(step => {
        const stepEl = document.createElement('div');
        stepEl.className = 'cours-step';
        const numEl = document.createElement('div');
        numEl.className = 'cours-step-num';
        numEl.textContent = step.num || '';
        const bodyEl = document.createElement('div');
        bodyEl.className = 'cours-step-body';
        const titleEl = document.createElement('div');
        titleEl.className = 'cours-step-title';
        titleEl.textContent = sanitizeText(step.title || '');
        bodyEl.appendChild(titleEl);
        if (step.content) {
          const cEl = document.createElement('div');
          cEl.className = 'cours-step-content';
          cEl.innerHTML = sanitizeText(step.content);
          bodyEl.appendChild(cEl);
        }
        if (step.code) {
          const pre = document.createElement('pre');
          pre.className = 'code-block';
          pre.style.marginTop = '10px';
          pre.textContent = step.code;
          bodyEl.appendChild(pre);
        }
        if (step.why) {
          const wEl = document.createElement('div');
          wEl.className = 'step-why-block';
          wEl.innerHTML = sanitizeText(step.why);
          bodyEl.appendChild(wEl);
        }
        stepEl.appendChild(numEl);
        stepEl.appendChild(bodyEl);
        wrap.appendChild(stepEl);
      });
      break;
    }
    case 'html': {
      let c = section.content || '';
      c = c.replace(/<head[\s\S]*?<\/head>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
      c = c.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<\/?html[^>]*>/gi, '');
      c = c.replace(/<\/?body[^>]*>/gi, '').replace(/\s*style="[^"]*"/gi, '');
      c = c.replace(/\s*class="[^"]*"/gi, '');
      const div = document.createElement('div');
      div.className = 'cours-html-block';
      div.innerHTML = c;
      wrap.appendChild(div); break;
    }
    case 'html-file': {
      const uid = 'hf-' + Math.random().toString(36).slice(2, 9);
      const div = document.createElement('div');
      div.className = 'cours-html-block';
      div.id = uid;
      setTimeout(() => {
        const target = document.getElementById(uid);
        if (!target) return;
        fetch(section.src)
          .then(r => r.text())
          .then(html => {
            html = html.replace(/<head[\s\S]*?<\/head>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
            html = html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<\/?html[^>]*>/gi, '');
            html = html.replace(/<\/?body[^>]*>/gi, '').replace(/\s*style="[^"]*"/gi, '');
            html = html.replace(/\s*class="[^"]*"/gi, '');
            target.innerHTML = html;
          })
          .catch(() => { target.innerHTML = '<div class="warn-box">Erreur de chargement.</div>'; });
      }, 0);
      wrap.appendChild(div); break;
    }
  }

  return wrap;
}

// ===== OUTILS =====
function renderOutils(m, el) {
  el.innerHTML = `<div class="html-file-wrap"><iframe src="${m.outils}" class="cours-iframe" title="Outils" loading="lazy"></iframe></div>`;
}

// ===== NOTES =====
const KNOWN_MEMBERS = ['Esdine','Madjid','Fouad','Ilir','Jores','Ronel','Folly','Mick','Antho','Axel'];

async function renderNotes(m, cours, el) {
  if (window._noteUnsub) { window._noteUnsub(); window._noteUnsub = null; }

  const moduleId = m.id;
  const coursId  = cours.id;
  const myPseudo = localStorage.getItem('tssr_pseudo') || '';

  el.innerHTML = `
    <div class="notes-container">

      <div class="notes-section">
        <h3 class="notes-title">Votre identifiant</h3>
        <input type="text" id="note-pseudo" class="note-input"
               placeholder="Votre prénom..." maxlength="20" value="${escHtml(myPseudo)}">
      </div>

      <div id="members-cards" class="members-cards"></div>

      <div class="notes-section notes-summary-section">
        <div class="notes-summary-header">
          <h3 class="notes-title">Résumé</h3>
          <button class="note-generate-btn" id="note-generate-summary">Générer le résumé</button>
        </div>
        <p class="notes-meta" id="summary-meta">Aucun résumé généré</p>
        <div id="summary-content" class="notes-summary-content">
          <em>Cliquez sur "Générer le résumé" pour synthétiser les partages de tous les collègues.</em>
        </div>
      </div>

    </div>`;

  const pseudoInput = document.getElementById('note-pseudo');
  pseudoInput?.addEventListener('change', () => {
    localStorage.setItem('tssr_pseudo', pseudoInput.value.trim());
    renderMemberCards(moduleId, coursId, currentMembersCache);
  });

  let currentMembersCache = {};
  let myDraft = { text: null, files: null };

  function renderMemberCards(moduleId, coursId, members) {
    const container = document.getElementById('members-cards');
    if (!container) return;
    const myCurrentPseudo = localStorage.getItem('tssr_pseudo') || '';

    const prevTextarea = container.querySelector('.member-text-input');
    if (prevTextarea) myDraft.text = prevTextarea.value;

    const names = [...new Set([...KNOWN_MEMBERS, ...Object.keys(members)])];

    container.innerHTML = names.map(name => {
      const data    = members[name] || { text: '', files: [], updatedAt: null };
      const isMine  = name === myCurrentPseudo;
      const dateStr = data.updatedAt ? new Date(data.updatedAt).toLocaleString('fr-FR') : '';
      const filesHtml = (data.files || []).map(f => `
        <div class="member-file-chip" title="${escHtml(f.filename)}">
          <span>${escHtml(f.filename)}</span>
        </div>`).join('');

      return `
        <details class="member-card" data-member="${escHtml(name)}" ${isMine ? 'open' : ''}>
          <summary class="member-card-summary">
            <span class="member-name">${escHtml(name)}</span>
            ${isMine ? '<span class="member-badge-me">vous</span>' : ''}
            <span class="member-date">${dateStr}</span>
          </summary>
          <div class="member-card-body">
            ${isMine ? `
              <textarea class="note-textarea member-text-input" rows="5"
                placeholder="Vos notes à partager...">${escHtml(data.text || '')}</textarea>
              <div class="file-upload-zone member-upload-zone" data-member="${escHtml(name)}">
                <p class="upload-text">Glissez vos fichiers ici ou</p>
                <button type="button" class="upload-btn member-upload-trigger">Sélectionner un fichier</button>
                <input type="file" class="member-file-input" multiple accept=".txt,.html,.md,.pdf" style="display:none">
              </div>
              <div class="member-files-list"></div>
              <button class="note-save-btn member-save-btn">Sauvegarder mon partage</button>
            ` : `
              <div class="member-content">${data.text ? escHtml(data.text).replace(/\n/g,'<br>') : '<em>Aucune note</em>'}</div>
              <div class="member-files-list">${filesHtml || '<em class="notes-empty">Aucun fichier</em>'}</div>
            `}
          </div>
        </details>`;
    }).join('');

    const myCard = container.querySelector(`details[data-member="${myCurrentPseudo}"]`);
    if (myCard) {
      attachMyCardListeners(myCard, moduleId, coursId, myCurrentPseudo, updatedData => {
        currentMembersCache[myCurrentPseudo] = updatedData;
      });
      const newTextarea = myCard.querySelector('.member-text-input');
      if (newTextarea && myDraft.text !== null) newTextarea.value = myDraft.text;
    }
  }

  function attachMyCardListeners(card, moduleId, coursId, pseudo, onLocalUpdate) {
    let pendingFiles = myDraft.files !== null
      ? [...myDraft.files]
      : [...(currentMembersCache[pseudo]?.files || [])];

    const uploadZone  = card.querySelector('.member-upload-zone');
    const fileInput   = card.querySelector('.member-file-input');
    const triggerBtn  = card.querySelector('.member-upload-trigger');
    const filesListEl = card.querySelector('.member-files-list');
    const saveBtn     = card.querySelector('.member-save-btn');
    const textArea    = card.querySelector('.member-text-input');

    triggerBtn?.addEventListener('click', () => fileInput?.click());
    uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone?.addEventListener('drop', e => {
      e.preventDefault();
      uploadZone.classList.remove('drag-over');
      handleNewFiles(e.dataTransfer.files);
    });
    fileInput?.addEventListener('change', e => { handleNewFiles(e.target.files); fileInput.value = ''; });

    textArea?.addEventListener('input', () => { myDraft.text = textArea.value; });

    async function handleNewFiles(fileList) {
      for (const file of fileList) {
        try {
          const content = await extractFileContent(file);
          pendingFiles.push({
            filename: file.name,
            content: content.substring(0, 5000),
            uploadedAt: new Date().toISOString(),
          });
          myDraft.files = [...pendingFiles];
          renderFilesChips();
        } catch (err) {
          alert('Erreur lecture ' + file.name + ': ' + err.message);
        }
      }
    }

    function renderFilesChips() {
      filesListEl.innerHTML = pendingFiles.map((f, i) => `
        <div class="member-file-chip">
          <span>${escHtml(f.filename)}</span>
          <button type="button" class="file-chip-remove" data-idx="${i}">×</button>
        </div>`).join('');
      filesListEl.querySelectorAll('.file-chip-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          pendingFiles.splice(Number(btn.dataset.idx), 1);
          myDraft.files = [...pendingFiles];
          renderFilesChips();
        });
      });
    }
    renderFilesChips();

    saveBtn?.addEventListener('click', async () => {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Sauvegarde...';
      try {
        const { FirebaseNotes } = await import('./firebase-notes.js');
        const result = await FirebaseNotes.saveMemberData(moduleId, coursId, pseudo, textArea.value, pendingFiles);
        onLocalUpdate({ text: textArea.value, files: pendingFiles, updatedAt: new Date().toISOString() });
        myDraft = { text: null, files: null };
        saveBtn.textContent = result.success ? 'Sauvegardé !' : 'Erreur';
      } catch (_) {
        saveBtn.textContent = 'Erreur';
      }
      setTimeout(() => { saveBtn.disabled = false; saveBtn.textContent = 'Sauvegarder mon partage'; }, 1800);
    });
  }

  try {
    const { FirebaseNotes } = await import('./firebase-notes.js');

    const unsubMembers = FirebaseNotes.listenToAllMembers(moduleId, coursId, (members) => {
      currentMembersCache = members;
      renderMemberCards(moduleId, coursId, members);
    });

    const genBtn = document.getElementById('note-generate-summary');
    genBtn?.addEventListener('click', async () => {
      genBtn.disabled = true;
      genBtn.textContent = 'Génération...';

      const members = await FirebaseNotes.getAllMembers(moduleId, coursId);
      const entries = Object.entries(members).filter(([, d]) =>
        (d.text || '').trim() || (d.files || []).length
      );

      if (!entries.length) {
        document.getElementById('summary-content').innerHTML = '<em>Aucun contenu partagé à résumer.</em>';
        genBtn.disabled = false;
        genBtn.textContent = 'Générer le résumé';
        return;
      }

      let aggregated = '';
      entries.forEach(([name, data]) => {
        aggregated += `--- ${name} ---\n`;
        if (data.text) aggregated += `Notes: ${data.text}\n`;
        (data.files || []).forEach(f => {
          aggregated += `Fichier "${f.filename}":\n${f.content}\n`;
        });
        aggregated += '\n';
      });

      try {
        const response = await fetch('/api/auto-summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: aggregated, sourceCount: entries.length }),
        });
        if (!response.ok) throw new Error('API indisponible');
        const { summary } = await response.json();
        await FirebaseNotes.saveSummary(moduleId, coursId, summary);
        genBtn.disabled = false;
        genBtn.textContent = 'Régénérer le résumé';
      } catch (_) {
        const contentEl = document.getElementById('summary-content');
        const metaEl    = document.getElementById('summary-meta');
        if (metaEl) metaEl.textContent = 'Backend indisponible — saisie manuelle';
        if (contentEl) contentEl.innerHTML = `
          <p class="notes-hint">Backend /api/auto-summarize indisponible. Collez votre résumé ci-dessous&nbsp;:</p>
          <textarea class="note-textarea" id="summary-manual" rows="8" placeholder="Collez votre résumé ici..."></textarea>
          <button class="note-save-btn" id="summary-manual-save">Sauvegarder manuellement</button>`;
        document.getElementById('summary-manual-save')?.addEventListener('click', async () => {
          const text = document.getElementById('summary-manual')?.value || '';
          if (!text.trim()) return;
          const manBtn = document.getElementById('summary-manual-save');
          manBtn.disabled = true;
          manBtn.textContent = 'Sauvegarde...';
          const { FirebaseNotes: FN } = await import('./firebase-notes.js');
          const res = await FN.saveSummary(moduleId, coursId, text);
          manBtn.textContent = res.success ? 'Sauvegardé !' : 'Erreur';
          setTimeout(() => { manBtn.disabled = false; manBtn.textContent = 'Sauvegarder manuellement'; }, 1800);
        });
        genBtn.disabled = false;
        genBtn.textContent = 'Générer le résumé';
      }
    });

    const unsubSummary = FirebaseNotes.listenToSummary(moduleId, coursId, (data) => {
      const contentEl = document.getElementById('summary-content');
      const metaEl    = document.getElementById('summary-meta');
      if (data.summary) {
        if (contentEl) contentEl.innerHTML = escHtml(data.summary).replace(/\n/g, '<br>');
        if (metaEl) metaEl.textContent = data.updatedAt
          ? 'Généré le ' + data.updatedAt.toLocaleString('fr-FR') : 'Généré';
      }
    });

    window._noteUnsub = () => { unsubMembers(); unsubSummary(); };

  } catch (err) {
    console.warn('Firebase non disponible:', err);
    const container = document.getElementById('members-cards');
    if (container) container.innerHTML = '<p class="notes-empty">Mode hors-ligne — partage indisponible.</p>';
  }
}

// ===== NOTES — UPLOAD FICHIERS =====

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${url}"]`);
    if (existing) {
      if (existing.dataset.ready) { resolve(); return; }
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = url;
    s.onload = () => { s.dataset.ready = '1'; resolve(); };
    s.onerror = () => reject(new Error('Impossible de charger : ' + url));
    document.head.appendChild(s);
  });
}

function setupFileUpload(moduleId, coursId) {
  const zone  = document.getElementById('file-upload-zone');
  const input = document.getElementById('file-input');
  const btn   = document.getElementById('upload-btn-trigger');
  const list  = document.getElementById('files-list');
  if (!zone || !input) return;

  btn?.addEventListener('click', () => input.click());
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    processFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', e => { processFiles(e.target.files); input.value = ''; });

  async function processFiles(files) {
    for (const file of files) {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML = `
        <div class="file-item-header">
          <span class="file-icon">${getFileIcon(file.type, file.name)}</span>
          <span class="file-name">${escHtml(file.name)}</span>
          <span class="file-size">${formatFileSize(file.size)}</span>
          <button class="file-remove-btn" aria-label="Supprimer">✕</button>
        </div>
        <div class="file-item-status">Lecture…</div>
        <div class="file-item-preview" style="display:none"></div>
        <div class="file-actions" style="display:none"></div>`;
      list.appendChild(item);

      const statusEl  = item.querySelector('.file-item-status');
      const previewEl = item.querySelector('.file-item-preview');
      const actionsEl = item.querySelector('.file-actions');

      item.querySelector('.file-remove-btn').addEventListener('click', () => item.remove());

      try {
        const content = await extractFileContent(file);
        statusEl.style.color = 'var(--accent)';
        statusEl.textContent = `Extrait — ${content.length} caractères`;
        import('./firebase-notes.js').then(({ FirebaseNotes }) =>
          FirebaseNotes.trackFileUpload(moduleId, coursId, file, content)
            .then(() => regenerateAutoSummary(moduleId, coursId))
        ).then(() => {
          statusEl.textContent = `Extrait — ${content.length} car. · Sync collectif OK`;
        }).catch(() => {});

        previewEl.textContent = content.substring(0, 300) + (content.length > 300 ? '…' : '');
        previewEl.style.display = 'block';

        const addBtn = document.createElement('button');
        addBtn.className = 'file-add-btn';
        addBtn.textContent = '+ Ajouter aux notes';
        addBtn.addEventListener('click', () => {
          const ta = document.getElementById('notes-ta');
          if (!ta) { alert('Selectionnez d\'abord un membre dans les notes.'); return; }
          const stamp = new Date().toLocaleString('fr-FR');
          ta.value += (ta.value ? '\n\n' : '') + `--- ${file.name} (${stamp}) ---\n${content}`;
          ta.dispatchEvent(new Event('input'));
          statusEl.textContent = 'Ajouté aux notes ✓';
        });

        const sumBtn = document.createElement('button');
        sumBtn.className = 'file-summarize-btn';
        sumBtn.textContent = 'Résumer avec IA';
        sumBtn.addEventListener('click', () => generateSummaryFromFile(content, file.name));

        actionsEl.append(addBtn, sumBtn);
        actionsEl.style.display = 'flex';
      } catch (err) {
        statusEl.style.color = 'var(--red)';
        statusEl.textContent = 'Erreur : ' + err.message;
      }
    }
  }
}

async function extractFileContent(file) {
  const t = file.type;
  if (t === 'text/plain' || t === 'text/markdown' || file.name.endsWith('.md')) return file.text();
  if (t === 'text/html') {
    const html = await file.text();
    return new DOMParser().parseFromString(html, 'text/html').body.innerText || '';
  }
  if (t === 'application/pdf') return extractPDF(file);
  if (t === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return extractDOCX(file);
  try { return await file.text(); } catch (_) { throw new Error('Type non supporté : ' + (t || file.name)); }
}

async function extractPDF(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
  const lib = window.pdfjsLib;
  if (!lib) throw new Error('pdf.js non chargé');
  lib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  const pdf = await lib.getDocument({ data: await file.arrayBuffer() }).promise;
  let text = '';
  for (let i = 1; i <= Math.min(pdf.numPages, 50); i++) {
    const tc = await (await pdf.getPage(i)).getTextContent();
    text += tc.items.map(x => x.str).join(' ') + '\n';
  }
  return text.trim();
}

async function extractDOCX(file) {
  await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
  const lib = window.mammoth;
  if (!lib) throw new Error('mammoth.js non chargé');
  const result = await lib.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

async function generateSummaryFromFile(content, filename) {
  const modal = document.createElement('div');
  modal.className = 'ai-modal-overlay';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="ai-modal">
      <div class="ai-modal-header">
        <h3 class="ai-modal-title">Résumé — ${escHtml(filename)}</h3>
        <button class="ai-modal-close" aria-label="Fermer">✕</button>
      </div>
      <div class="ai-modal-body">
        <div class="ai-loading" id="ai-loading">Analyse en cours…</div>
        <div class="ai-result" id="ai-result"></div>
      </div>
      <div class="ai-modal-footer" id="ai-modal-footer"></div>
    </div>`;
  document.body.appendChild(modal);

  const closeModal = () => modal.remove();
  modal.querySelector('.ai-modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  const loadingEl = modal.querySelector('#ai-loading');
  const resultEl  = modal.querySelector('#ai-result');
  const footerEl  = modal.querySelector('#ai-modal-footer');

  const prompt = `Tu es un assistant TSSR (Technicien Supérieur Systèmes et Réseaux). Résume ce document en 5-8 points clés, organisés et lisibles pour un technicien en formation :\n\nFichier : ${filename}\n\nContenu :\n${content.substring(0, 4000)}`;

  try {
    const resp = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: content.substring(0, 4000), filename }),
    });
    if (!resp.ok) throw new Error('API non disponible (statut ' + resp.status + ')');
    const { summary } = await resp.json();
    loadingEl.style.display = 'none';
    resultEl.innerHTML = escHtml(summary).replace(/\n/g, '<br>');
    resultEl.classList.add('visible');
  } catch (_) {
    loadingEl.style.display = 'none';
    resultEl.innerHTML = `<p>API non configurée. Copiez ce prompt dans Claude.ai&nbsp;:</p>
      <pre class="ai-prompt-box">${escHtml(prompt)}</pre>`;
    resultEl.classList.add('visible');
    footerEl.innerHTML = `
      <button class="ai-btn ai-btn-copy" id="ai-copy-btn">Copier le prompt</button>
      <a class="ai-btn ai-btn-open" href="https://claude.ai/new" target="_blank" rel="noopener">Ouvrir Claude.ai</a>`;
    footerEl.querySelector('#ai-copy-btn').addEventListener('click', function() {
      navigator.clipboard.writeText(prompt).then(() => { this.textContent = '✓ Copié !'; });
    });
  }
}

function getFileIcon(mimeType, filename) {
  const ext = filename ? filename.split('.').pop().toUpperCase() : '';
  const m = {
    'text/plain': '[TXT]',
    'text/markdown': '[MD]',
    'text/html': '[HTML]',
    'application/pdf': '[PDF]',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '[DOCX]',
  };
  return m[mimeType] || (ext ? '[' + ext + ']' : '[FILE]');
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), 3);
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + ['B', 'KB', 'MB', 'GB'][i];
}

// ===== FIREBASE — SYNC COLLECTIF =====

async function regenerateAutoSummary(moduleId, coursId = 'main') {
  const { FirebaseNotes } = await import('./firebase-notes.js');
  const sources = await FirebaseNotes.getAggregatedContent(moduleId, coursId);
  if (!sources.length) return;

  let aggregated = `Notes et fichiers de ${new Set(sources.map(s => s.userId)).size} collègue(s) :\n\n`;
  sources.forEach((src, i) => {
    aggregated += `[Source ${i + 1} — ${src.userId}]\nType : ${src.type}${src.filename ? ' / ' + src.filename : ''}\n${src.content}\n\n`;
  });

  try {
    const resp = await fetch('/api/auto-summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: aggregated.substring(0, 5000), sourceCount: sources.length }),
    });
    if (!resp.ok) throw new Error('no-backend');
    const { summary } = await resp.json();
    await FirebaseNotes.saveSummary(moduleId, coursId, summary);
  } catch (_) {
    const users   = [...new Set(sources.map(s => s.userId))].join(', ');
    const fallback = `[${sources.length} source(s) — ${users}]\n\nFichiers et notes enregistrés. Configurez un backend (/api/auto-summarize) pour générer un résumé IA automatique.`;
    await FirebaseNotes.saveSummary(moduleId, coursId, fallback);
  }
}

// ===== FLASHCARDS =====
function renderFlashcards(m, el) {
  if (!m.flashcards.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">\u{1F4CB}</span><h3>Cartes à venir</h3><p>Les cartes seront ajoutées prochainement.</p></div>`;
    return;
  }
  state.fc = { cards: shuffle(m.flashcards), idx: 0, flipped: false, session: { easy:0, medium:0, hard:0 } };
  el.innerHTML = '';
  renderFlashcardView(el, m);
}
function renderFlashcardView(el, m) {
  const { cards, idx, session } = state.fc;
  const total = cards.length;
  if (idx >= total) {
    const mastered = session.easy;
    const pct = Math.round((mastered/total)*100);
    setProgress(m.id, { pct: Math.max(getProgress(m.id).pct||0, pct>=80?66:33), fc_mastered: mastered });
    el.innerHTML = `
      <div class="flashcard-arena">
        <div class="flashcard-done">
          <div style="margin-bottom:16px;font-family:var(--font-mono);color:var(--accent);font-size:28px;font-weight:700">[OK]</div>
          <h3>Session terminée !</h3>
          <p>Facile : <strong>${session.easy}</strong> · Moyen : <strong>${session.medium}</strong> · Difficile : <strong>${session.hard}</strong></p>
          <div style="display:flex;gap:12px;justify-content:center">
            <button class="btn-primary" onclick="renderFlashcards(state.currentModule,document.getElementById('tab-content'))">Recommencer</button>
          </div>
        </div>
      </div>`;
    return;
  }
  const card = cards[idx];
  state.fc.flipped = false;
  el.innerHTML = `
    <div class="flashcard-arena">
      <div class="flashcard-progress-bar">
        <div class="progress-bar-wrap" style="flex:1"><div class="progress-bar-fill" style="width:${Math.round((idx/total)*100)}%"></div></div>
        <span class="flashcard-counter">${idx+1} / ${total}</span>
      </div>
      <div class="flashcard-scene" id="fc-scene" role="button" tabindex="0" aria-label="Retourner la carte">
        <div class="flashcard-inner" id="fc-inner">
          <div class="flashcard-face flashcard-front">
            <span class="flashcard-side-label">Question</span>
            <div class="flashcard-text">${card.recto}</div>
            <span class="flashcard-hint"> cliquer pour révéler </span>
          </div>
          <div class="flashcard-face flashcard-back">
            <span class="flashcard-side-label">Réponse</span>
            <div class="flashcard-text">${card.verso}</div>
          </div>
        </div>
      </div>
      <div class="flashcard-actions" id="fc-actions" style="opacity:0;pointer-events:none;transition:opacity 0.2s">
        <button class="fc-btn hard"   onclick="fcRate('hard')"   aria-label="Difficile">Difficile<span class="fc-btn-sub">revoir maintenant</span></button>
        <button class="fc-btn medium" onclick="fcRate('medium')" aria-label="Moyen">Moyen<span class="fc-btn-sub">+1 jour</span></button>
        <button class="fc-btn easy"   onclick="fcRate('easy')"   aria-label="Facile">Facile<span class="fc-btn-sub">+4 jours</span></button>
      </div>
      <div style="display:flex;gap:16px;font-size:12px;color:var(--text3)">
        <span>✓ ${session.easy}</span><span>~ ${session.medium}</span><span>✗ ${session.hard}</span>
      </div>
    </div>`;
  const scene = document.getElementById('fc-scene');
  scene.addEventListener('click', flipCard);
  scene.addEventListener('keydown', e => (e.key==='Enter'||e.key===' ') && flipCard());
}
function flipCard() {
  if (state.fc.flipped) return;
  state.fc.flipped = true;
  document.getElementById('fc-inner').classList.add('flipped');
  const a = document.getElementById('fc-actions');
  a.style.opacity = '1'; a.style.pointerEvents = 'auto';
}
function fcRate(rating) {
  state.fc.session[rating]++;
  if (rating === 'hard') state.fc.cards.push(state.fc.cards[state.fc.idx]);
  const card = state.fc.cards[state.fc.idx];
  const days = rating==='easy'?4:rating==='medium'?1:0;
  const next = new Date(); next.setDate(next.getDate()+days);
  store.set(`fc_${state.currentModule.id}_${card.id}`, { rating, nextReview: next.toISOString() });
  state.fc.idx++;
  renderFlashcardView(document.getElementById('tab-content'), state.currentModule);
}

// ===== QCM =====
function renderQCM(m, el) {
  if (!m.qcm.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">\u{2753}</span><h3>QCM à venir</h3><p>Les questions seront ajoutées prochainement.</p></div>`;
    return;
  }
  state.qcm = {
    questions: shuffle(m.qcm).map(q => ({ ...q, options: shuffle(q.options) })),
    idx: 0, answers: [], locked: false, done: false, startTime: Date.now(),
  };
  renderQCMQuestion(el, m);
}
function renderQCMQuestion(el, m) {
  const { questions, idx } = state.qcm;
  if (idx >= questions.length) { renderQCMResults(el, m); return; }
  const q = questions[idx];
  const total = questions.length;
  el.innerHTML = `
    <div class="qcm-container">
      <div class="qcm-progress">
        <div class="progress-bar-wrap" style="flex:1"><div class="progress-bar-fill" style="width:${Math.round((idx/total)*100)}%"></div></div>
        <span class="qcm-counter">${idx+1} / ${total}</span>
      </div>
      <div class="qcm-question-block">
        <div class="qcm-question-num">Question ${idx+1}</div>
        <div class="qcm-question-text">${q.question}</div>
        <div class="qcm-options" role="radiogroup" id="qcm-opts">
          ${q.options.map((opt,i)=>`
            <div class="qcm-option" data-idx="${i}" role="radio" aria-checked="false" tabindex="0">
              <span class="qcm-option-letter">${String.fromCharCode(65+i)}</span>
              <span>${opt.text}</span>
            </div>`).join('')}
        </div>
        <div class="qcm-feedback" id="qcm-feedback" role="alert"></div>
      </div>
      <div class="qcm-nav">
        <button class="btn-primary" id="qcm-next-btn" style="display:none" onclick="qcmNext()">
          ${idx+1<total?'Question suivante ':'Voir les résultats '}
        </button>
      </div>
    </div>`;
  document.querySelectorAll('.qcm-option').forEach(opt => {
    opt.addEventListener('click', () => qcmSelect(parseInt(opt.dataset.idx), q));
    opt.addEventListener('keydown', e => e.key==='Enter' && qcmSelect(parseInt(opt.dataset.idx), q));
  });
}
function qcmSelect(optIdx, q) {
  if (state.qcm.locked) return;
  state.qcm.locked = true;
  const opts = document.querySelectorAll('.qcm-option');
  opts.forEach(o => o.classList.add('locked'));
  const correct = q.options[optIdx].correct;
  opts[optIdx].classList.add(correct ? 'correct' : 'wrong');
  if (!correct) {
    const ci = q.options.findIndex(o => o.correct);
    if (ci >= 0) opts[ci].classList.add('correct');
  }
  state.qcm.answers.push({ q, selectedIdx: optIdx, correct });
  const fb = document.getElementById('qcm-feedback');
  fb.className = 'qcm-feedback show ' + (correct?'good':'bad');
  fb.innerHTML = correct
    ? `✓ ${q.explication||'Bonne réponse !'}`
    : `✗ ${q.explication||'Mauvaise réponse. Bonne réponse : '+q.options.find(o=>o.correct)?.text}`;
  document.getElementById('qcm-next-btn').style.display = 'inline-flex';
}
function qcmNext() {
  state.qcm.idx++; state.qcm.locked = false;
  renderQCMQuestion(document.getElementById('tab-content'), state.currentModule);
}
function renderQCMResults(el, m) {
  const { answers, startTime } = state.qcm;
  const total = answers.length;
  const score = answers.filter(a=>a.correct).length;
  const pct = Math.round((score/total)*100);
  const elapsed = Math.round((Date.now()-startTime)/1000);
  const mm = Math.floor(elapsed/60).toString().padStart(2,'0');
  const ss = (elapsed%60).toString().padStart(2,'0');
  setProgress(m.id, { pct: Math.max(getProgress(m.id).pct||0, pct>=70?100:66), qcm_best: Math.max(getProgress(m.id).qcm_best||0, pct) });
  const emoji = pct>=80?'[+]':pct>=60?'[~]':'[-]';
  const msg = pct>=80?'Excellent !':pct>=60?'Pas mal, continue !':'À retravailler...';
  const errorsHtml = answers.filter(a=>!a.correct).map(a=>`
    <div class="qcm-error-item">
      <div class="qcm-error-q">${a.q.question}</div>
      <div class="qcm-error-your">✗ ${a.q.options[a.selectedIdx]?.text}</div>
      <div class="qcm-error-correct">✓ ${a.q.options.find(o=>o.correct)?.text}</div>
      ${a.q.explication?`<div style="font-size:12px;color:var(--text3);margin-top:6px">${a.q.explication}</div>`:''}
    </div>`).join('');
  el.innerHTML = `
    <div class="qcm-container">
      <div class="qcm-results">
        <div class="qcm-score-circle">
          <span class="qcm-score-num">${score}</span>
          <span class="qcm-score-denom">/ ${total}</span>
        </div>
        <h3>${emoji} ${msg}</h3>
        <p>${pct}% · ${mm}:${ss}</p>
        <div style="display:flex;gap:12px;justify-content:center">
          <button class="btn-primary" onclick="renderQCM(state.currentModule,document.getElementById('tab-content'))">Recommencer</button>
        </div>
        ${errorsHtml?`<div class="qcm-errors-list"><p style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px;text-align:left">Erreurs :</p>${errorsHtml}</div>`:''}
      </div>
    </div>`;
}

// ============================================================
// ===== CLI ENGINE ============================================
// ============================================================

// Filesystem virtuel partagé par session (réinitialisé à chaque ouverture du terminal)
function makeCLIState(type) {
  if (type === 'linux') {
    return {
      type: 'linux',
      user: 'tssr',
      host: 'debian-srv',
      cwd: '/home/tssr',
      history: [],
      histIdx: -1,
      tabBuf: '',
      env: { HOME: '/home/tssr', PATH: '/usr/local/bin:/usr/bin:/bin', USER: 'tssr', SHELL: '/bin/bash' },
      fs: {
        '/': { type: 'dir' },
        '/home': { type: 'dir' },
        '/home/tssr': { type: 'dir' },
        '/home/tssr/Documents': { type: 'dir' },
        '/home/tssr/Documents/rapport.txt': { type: 'file', content: 'Rapport TSSR\nModule réseaux\n' },
        '/home/tssr/notes.txt': { type: 'file', content: 'Notes de cours\nOSI, TCP/IP\n' },
        '/etc': { type: 'dir' },
        '/etc/passwd': { type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\ntssr:x:1000:1000::/home/tssr:/bin/bash\n' },
        '/etc/hostname': { type: 'file', content: 'debian-srv\n' },
        '/etc/hosts': { type: 'file', content: '127.0.0.1\tlocalhost\n127.0.1.1\tdebian-srv\n' },
        '/etc/network': { type: 'dir' },
        '/etc/network/interfaces': { type: 'file', content: 'auto lo\niface lo inet loopback\nauto eth0\niface eth0 inet dhcp\n' },
        '/var': { type: 'dir' },
        '/var/log': { type: 'dir' },
        '/var/log/syslog': { type: 'file', content: 'Jun  4 10:00:01 debian-srv systemd[1]: Starting...\n' },
        '/tmp': { type: 'dir' },
        '/usr': { type: 'dir' },
        '/usr/bin': { type: 'dir' },
      },
      perms: {
        '/etc/shadow': 'root',
        '/root': 'root',
      },
      sudoEnabled: false,
      networkFault: null,
    };
  } else if (type === 'cmd') {
    const base = makeCLIState('windows');
    base.type = 'cmd';
    return base;
  } else {
    return {
      type: 'windows',
      user: 'Administrateur',
      host: 'SRV-TSSR',
      cwd: 'C:\\Users\\Administrateur',
      history: [],
      histIdx: -1,
      tabBuf: '',
      env: { COMPUTERNAME: 'SRV-TSSR', USERNAME: 'Administrateur', USERPROFILE: 'C:\\Users\\Administrateur', OS: 'Windows_NT' },
      fs: {
        'C:\\': { type: 'dir' },
        'C:\\Users': { type: 'dir' },
        'C:\\Users\\Administrateur': { type: 'dir' },
        'C:\\Users\\Administrateur\\Documents': { type: 'dir' },
        'C:\\Users\\Administrateur\\Documents\\rapport.txt': { type: 'file', content: 'Rapport TSSR\r\nModule réseaux\r\n' },
        'C:\\Windows': { type: 'dir' },
        'C:\\Windows\\System32': { type: 'dir' },
        'C:\\Windows\\System32\\drivers': { type: 'dir' },
        'C:\\Windows\\System32\\drivers\\etc': { type: 'dir' },
        'C:\\Windows\\System32\\drivers\\etc\\hosts': { type: 'file', content: '127.0.0.1       localhost\r\n::1             localhost\r\n' },
        'C:\\inetpub': { type: 'dir' },
        'C:\\inetpub\\wwwroot': { type: 'dir' },
        'C:\\inetpub\\wwwroot\\index.html': { type: 'file', content: '<!DOCTYPE html>\r\n<html><body>IIS Default Page</body></html>\r\n' },
        'C:\\Temp': { type: 'dir' },
        'C:\\Shares': { type: 'dir' },
        'C:\\Shares\\Direction': { type: 'dir' },
        'C:\\Program Files': { type: 'dir' },
        'C:\\Program Files\\WindowsPowerShell': { type: 'dir' },
      },
      diskpartMode: false,
      dpSel: { disk: null, partition: null },
      disks: [
        { id: 0, size: '120 GB', type: 'GPT', status: 'En ligne',
          partitions: [
            { id: 1, type: 'Récup.', size: '499 MB', letter: null },
            { id: 2, type: 'Système', size: '100 MB', letter: null },
            { id: 3, type: 'Primaire', size: '119 GB', letter: 'C' },
          ]
        },
        { id: 1, size: '500 GB', type: 'RAW', status: 'En ligne', partitions: [] },
      ],
      localUsers: [
        { name: 'Administrateur', active: true,  groups: ['Administrateurs'] },
        { name: 'Invité',         active: false, groups: ['Invités'] },
      ],
      localGroups: [
        { name: 'Administrateurs',          members: ['Administrateur'] },
        { name: 'Utilisateurs',             members: [] },
        { name: 'Invités',                  members: ['Invité'] },
        { name: 'Opérateurs de sauvegarde', members: [] },
      ],
      acls: {
        'C:\\Users\\Administrateur': 'Administrateurs : (F)\r\nUtilisateurs : (RX)',
        'C:\\Windows\\System32':     'SYSTEM : (F)\r\nAdministrateurs : (F)\r\nUtilisateurs : (RX)',
        'C:\\Shares\\Direction':     'Héritage actif — Administrateurs : (F), Utilisateurs : (RX)',
      },
      bitlocker: {},
      networkFault: null,
      fwRules: [
        { name: 'Allow_RDP', display: 'Bureau à distance (TCP-In)', dir: 'Inbound',  proto: 'TCP', port: '3389', action: 'Allow', profile: 'Domain' },
        { name: 'Allow_SMB', display: 'Partage de fichiers (SMB)',  dir: 'Inbound',  proto: 'TCP', port: '445',  action: 'Allow', profile: 'Domain' },
      ],
    };
  }
}

let cliState = null;

function renderCLI(type, m, el) {
  cliState = makeCLIState(type);
  scenarioState = null;

  const isWin = type === 'windows' || type === 'cmd';
  const isCmd = type === 'cmd';
  const title = isCmd ? ' Invite de commandes — cmd.exe' : (isWin ? ' Windows PowerShell' : ' Bash — ' + cliState.host);
  const headerClass = isWin ? 'cli-header-win' : 'cli-header-linux';
  el.innerHTML = `
    <div class="cli-layout">
      <div class="cli-main">
        <div class="cli-wrap">
          <div class="cli-titlebar ${headerClass}">
            <div class="cli-dots">
              <span class="cli-dot cli-dot-red"></span>
              <span class="cli-dot cli-dot-yellow"></span>
              <span class="cli-dot cli-dot-green"></span>
            </div>
            <span class="cli-title">${title}</span>
            <button class="cli-clear-btn" onclick="cliClear()" aria-label="Effacer le terminal"> clear</button>
          </div>
          <div class="cli-help-bar">
            ${isCmd
              ? `<span>Cmds :</span>
                 <code>dir</code><code>cd</code><code>type</code><code>copy</code><code>move</code>
                 <code>del</code><code>mkdir</code><code>ipconfig</code><code>ping</code><code>netstat</code>
                 <code>tasklist</code><code>taskkill</code><code>whoami</code><code>cls</code>
                 &nbsp;·&nbsp;<code style="color:var(--blue)">tp</code> TP guidés`
              : isWin
              ? `<span>Cmds :</span>
                 <code>Get-ChildItem</code><code>Set-Location</code><code>Get-Content</code><code>New-Item</code>
                 <code>Remove-Item</code><code>Get-Process</code><code>ipconfig</code><code>ping</code>
                 <code>netstat</code><code>Get-Service</code><code>whoami</code><code>Get-ADUser</code><code>cls</code>
                 &nbsp;·&nbsp;<code style="color:var(--blue)">tp</code> TP guidés`
              : `<span>Cmds :</span>
                 <code>ls</code><code>cd</code><code>pwd</code><code>cat</code><code>mkdir</code>
                 <code>rm</code><code>touch</code><code>cp</code><code>mv</code><code>echo</code>
                 <code>grep</code><code>ps</code><code>ifconfig</code><code>ip</code><code>ping</code>
                 <code>netstat</code><code>chmod</code><code>chown</code><code>sudo</code><code>systemctl</code>
                 <code>vim</code><code>man</code><code>history</code><code>clear</code>
                 &nbsp;·&nbsp;<code style="color:var(--accent)">tp</code> TP guidés`}
          </div>
          <div class="cli-output" id="cli-output" aria-live="polite" aria-label="Sortie du terminal">
            <div id="vim-overlay" class="vim-overlay" style="display:none" tabindex="0">
              <div class="vim-editor">
                <div class="vim-lines"></div>
                <div class="vim-statusbar">
                  <span class="vim-statusbar-left"></span>
                  <span class="vim-statusbar-right"></span>
                </div>
                <div class="vim-cmdline"></div>
              </div>
            </div>
          </div>
          <div class="cli-input-row">
            <span class="cli-prompt" id="cli-prompt">${cliPrompt()}</span>
            <input type="text" class="cli-input" id="cli-input"
              autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
              aria-label="Saisir une commande" placeholder="Tapez une commande...">
          </div>
        </div>
      </div>
      <div id="scenario-panel" class="scenario-panel" style="display:none"></div>
    </div>`;

  cliPrint(isCmd
    ? `Microsoft Windows [Version 10.0.19045]\n(c) Microsoft Corporation. Tous droits réservés.\n\nTape <span style="color:#aaa">help</span> · <span style="color:var(--blue)">tp</span> pour les TP guidés\n`
    : isWin
    ? `<span style="color:var(--blue)">Windows PowerShell</span>\nCopyright (C) Microsoft Corporation.\n\nTape <span style="color:var(--blue)">help</span> · <span style="color:var(--blue)">tp</span> pour les TP guidés\n`
    : `<span style="color:var(--accent)">Bienvenue sur ${cliState.host}</span> — Debian GNU/Linux\nConnecté : <span style="color:var(--accent)">${cliState.user}</span>\nTape <span style="color:var(--accent)">help</span> · <span style="color:var(--accent)">tp</span> pour les TP guidés\n <span style="color:var(--accent)">GameShell TSSR</span> — 30 missions pour maîtriser Linux. Tape <strong>tp gameshell</strong> pour commencer.\n`
  );

  const input = document.getElementById('cli-input');
  input.addEventListener('keydown', cliKeydown);
  input.focus();
}

function cliPrompt() {
  if (!cliState) return '';
  if (cliState.type === 'linux') {
    const shortCwd = cliState.cwd.replace('/home/tssr', '~');
    return `<span class="cli-ps-user">${cliState.user}@${cliState.host}</span><span class="cli-ps-sep">:</span><span class="cli-ps-path">${shortCwd}</span><span class="cli-ps-dollar">$</span>`;
  } else if (cliState.diskpartMode) {
    return `<span class="cli-ps-path-win">DISKPART</span><span class="cli-ps-dollar-win">&gt;</span>`;
  } else if (cliState.type === 'cmd') {
    return `<span class="cli-ps-path-win">${cliState.cwd}</span><span class="cli-ps-dollar-win">&gt;</span>`;
  } else {
    return `<span class="cli-ps-path-win">PS ${cliState.cwd}</span><span class="cli-ps-dollar-win">&gt;</span>`;
  }
}

function cliPrint(html) {
  const out = document.getElementById('cli-output');
  if (!out) return;
  const line = document.createElement('div');
  line.className = 'cli-line';
  line.innerHTML = html;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

function cliPrintCmd(cmd) {
  const out = document.getElementById('cli-output');
  if (!out) return;
  const line = document.createElement('div');
  line.className = 'cli-line cli-line-cmd';
  line.innerHTML = `${cliPrompt()} <span class="cli-cmd-text">${escHtml(cmd)}</span>`;
  out.appendChild(line);
  out.scrollTop = out.scrollHeight;
}

function cliClear() {
  const out = document.getElementById('cli-output');
  if (out) out.innerHTML = '';
}

function cliKeydown(e) {
  const input = document.getElementById('cli-input');
  if (!input) return;

  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    input.value = '';
    cliState.histIdx = -1;
    if (cmd) {
      cliState.history.unshift(cmd);
      if (cliState.history.length > 100) cliState.history.pop();
    }
    cliPrintCmd(cmd);
    if (cmd) cliExec(cmd);
    document.getElementById('cli-prompt').innerHTML = cliPrompt();
  }
  else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (cliState.histIdx < cliState.history.length - 1) {
      cliState.histIdx++;
      input.value = cliState.history[cliState.histIdx] || '';
    }
  }
  else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (cliState.histIdx > 0) {
      cliState.histIdx--;
      input.value = cliState.history[cliState.histIdx] || '';
    } else {
      cliState.histIdx = -1;
      input.value = '';
    }
  }
  else if (e.key === 'Tab') {
    e.preventDefault();
    cliTab(input);
  }
  else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault();
    cliClear();
  }
  else if (e.key === 'c' && e.ctrlKey) {
    e.preventDefault();
    cliPrint(`${cliPrompt()} <span class="cli-cmd-text">${escHtml(input.value)}^C</span>`);
    input.value = '';
  }
}

// ===== TAB COMPLETION =====
function cliTab(input) {
  const val = input.value;
  const parts = val.split(' ');
  if (parts.length <= 1) return; // complétion de commandes non implémentée
  const partial = parts[parts.length - 1];
  const prefix = cliResolvePath(partial, true);

  const entries = Object.keys(cliState.fs).filter(p => {
    return p.startsWith(prefix) && p !== prefix;
  });

  // Garder seulement le niveau direct
  const sep = cliState.type === 'linux' ? '/' : '\\';
  const direct = [...new Set(entries.map(p => {
    const rest = p.slice(prefix.length);
    const slash = rest.indexOf(sep);
    return prefix + (slash === -1 ? rest : rest.slice(0, slash + 1));
  }))];

  if (direct.length === 1) {
    parts[parts.length - 1] = direct[0];
    input.value = parts.join(' ');
  } else if (direct.length > 1) {
    cliPrint(direct.map(p => escHtml(p.split(sep).pop())).join('  '));
  }
}

// ===== PATH RESOLUTION =====
function cliResolvePath(raw, forTab = false) {
  if (!raw) return cliState.cwd;
  const isWin = cliState.type === 'windows';
  const sep = isWin ? '\\' : '/';

  // Windows aliases
  if (isWin) {
    if (raw === '~' || raw.startsWith('~\\')) raw = 'C:\\Users\\Administrateur' + raw.slice(1);
    if (raw === '%USERPROFILE%') raw = 'C:\\Users\\Administrateur';
  } else {
    if (raw === '~' || raw.startsWith('~/')) raw = '/home/tssr' + raw.slice(1);
  }

  if (isWin ? /^[A-Z]:\\/i.test(raw) : raw.startsWith('/')) return normPath(raw, sep);

  const base = cliState.cwd.endsWith(sep) ? cliState.cwd.slice(0,-1) : cliState.cwd;
  return normPath(base + sep + raw, sep);
}

function normPath(p, sep) {
  const parts = p.split(sep).filter(Boolean);
  const result = [];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') result.pop();
    else result.push(part);
  }
  if (sep === '/') return '/' + result.join('/');
  if (parts.length && /^[A-Z]:$/i.test(parts[0])) return parts[0].toUpperCase() + '\\' + result.slice(1).join('\\');
  return result.join('\\') || sep;
}

function cliIsDir(path) { return cliState.fs[path]?.type === 'dir'; }
function cliIsFile(path) { return cliState.fs[path]?.type === 'file'; }
function cliExists(path) { return !!cliState.fs[path]; }

function cliListDir(path) {
  const sep = cliState.type === 'windows' ? '\\' : '/';
  const base = path.endsWith(sep) ? path.slice(0,-1) : path;
  return Object.keys(cliState.fs).filter(k => {
    if (k === base) return false;
    if (!k.startsWith(base === (sep==='/'?'/':'') ? '' : base + sep)) return false;
    const rest = k.slice(base.length > 0 ? base.length + 1 : 0);
    return rest && !rest.includes(sep);
  });
}

// ===== TP SCENARIO ENGINE =====
let scenarioState = null;
let scenarioCheck = null;

const TP_SCENARIOS = {
  windows: [
    {
      id: 'diskpart',
      title: 'Initialisation d\'un disque secondaire',
      desc: 'Configure le Disque 1 (500 GB, RAW) : initialiser, partitionner, formater et monter.',
      steps: [
        { instr: 'Lance l\'utilitaire diskpart pour entrer en mode interactif.',     hint: 'diskpart',                                    check: c => /^diskpart$/i.test(c.trim()) },
        { instr: 'Liste les disques physiques disponibles.',                         hint: 'list disk',                                   check: c => /^list\s+disk$/i.test(c.trim()) },
        { instr: 'Sélectionne le Disque 1 (500 GB, RAW).',                          hint: 'select disk 1',                               check: c => /^select\s+disk\s+1$/i.test(c.trim()) },
        { instr: 'Efface la table de partition du disque.',                          hint: 'clean',                                       check: c => /^clean$/i.test(c.trim()) },
        { instr: 'Convertis le disque au format GPT (UEFI / >2 To).',               hint: 'convert gpt',                                 check: c => /^convert\s+gpt$/i.test(c.trim()) },
        { instr: 'Crée une partition primaire sur tout l\'espace disponible.',       hint: 'create partition primary',                    check: c => /^create\s+partition\s+primary/i.test(c.trim()) },
        { instr: 'Formate la partition en NTFS avec le label "Data" (quick).',       hint: 'format fs=ntfs quick label=Data',              check: c => /^format\b.*fs=ntfs/i.test(c.trim()) },
        { instr: 'Attribue la lettre E: au volume.',                                hint: 'assign letter=e',                             check: c => /^assign\s+letter=e$/i.test(c.trim()) },
        { instr: 'Quitte diskpart et reviens en PowerShell.',                        hint: 'exit',                                        check: c => /^exit$/i.test(c.trim()) },
      ],
    },
    {
      id: 'sam',
      title: 'Création d\'un compte technicien',
      desc: 'Crée un utilisateur TechAdmin, un groupe G_Maintenance et affecte l\'utilisateur.',
      steps: [
        { instr: 'Crée l\'utilisateur "TechAdmin" avec le mot de passe "P@ssw0rd!".', hint: 'net user TechAdmin P@ssw0rd! /add',           check: c => /^net\s+user\s+\S+\s+\S+\s+\/add/i.test(c.trim()) },
        { instr: 'Crée le groupe local "G_Maintenance".',                             hint: 'net localgroup G_Maintenance /add',           check: c => /^net\s+localgroup\s+\S+\s+\/add/i.test(c.trim()) },
        { instr: 'Ajoute TechAdmin dans le groupe G_Maintenance.',                   hint: 'net localgroup G_Maintenance TechAdmin /add', check: c => /^net\s+localgroup\s+\S+\s+\S+\s+\/add/i.test(c.trim()) },
        { instr: 'Vérifie les membres du groupe G_Maintenance.',                     hint: 'net localgroup G_Maintenance',                check: c => /^net\s+localgroup\s+\S+$/i.test(c.trim()) },
      ],
    },
    {
      id: 'ntfs',
      title: 'Sécurisation d\'un dossier partagé',
      desc: 'Applique des droits NTFS stricts sur C:\\Shares\\Direction.',
      steps: [
        { instr: 'Affiche les ACL actuelles de C:\\Shares\\Direction.',              hint: 'icacls "C:\\Shares\\Direction"',               check: c => /^icacls\b.*Direction/i.test(c.trim()) },
        { instr: 'Romps l\'héritage (convertit les droits hérités en explicites).',  hint: 'icacls "C:\\Shares\\Direction" /inheritance:d', check: c => /icacls\b.*\/inheritance:d/i.test(c.trim()) },
        { instr: 'Donne le contrôle total (F) aux Administrateurs.',                 hint: 'icacls "C:\\Shares\\Direction" /grant:r "Administrateurs":(OI)(CI)(F)', check: c => /icacls\b.*\/grant:r.*\(F\)/i.test(c.trim()) },
        { instr: 'Donne le droit de modification (M) au groupe G_Direction.',        hint: 'icacls "C:\\Shares\\Direction" /grant:r "G_Direction":(OI)(CI)(M)',     check: c => /icacls\b.*\/grant:r.*\(M\)/i.test(c.trim()) },
        { instr: 'Vérifie les ACL finales du dossier.',                              hint: 'icacls "C:\\Shares\\Direction"',               check: c => /^icacls\b.*Direction/i.test(c.trim()) },
      ],
    },
    {
      id: 'panne',
      title: 'Diagnostic panne réseau',
      desc: 'Le serveur SRV-TSSR a perdu la connectivité réseau. Diagnostique et répare.',
      onStart: () => { cliState.networkFault = 'dhcp'; },
      onEnd:   () => { cliState.networkFault = null; },
      steps: [
        { instr: ' Signalement : les utilisateurs ne peuvent plus joindre le réseau. Commence par vérifier la configuration IP.', hint: 'ipconfig', check: c => /^ipconfig(\b|$)/i.test(c.trim()) },
        { instr: 'L\'IP est une adresse APIPA (169.254.x.x). Le service DHCP Client est peut-être arrêté. Vérifie-le.', hint: 'Get-Service dhcp', check: c => /^get-service\b.*dhcp/i.test(c.trim()) || /^gsv\b.*dhcp/i.test(c.trim()) },
        { instr: 'Le service est bien arrêté. Avant de le redémarrer, vérifie que la carte réseau elle-même fonctionne : teste le loopback.', hint: 'ping 127.0.0.1', check: c => /^ping\b.*127\.0\.0\.1/i.test(c.trim()) },
        { instr: 'Loopback OK  carte réseau fonctionnelle. Teste maintenant la passerelle 192.168.1.1.', hint: 'ping 192.168.1.1', check: c => /^ping\b.*192\.168\.1\.1/i.test(c.trim()) },
        { instr: 'Timeout confirmé — la passerelle est inaccessible. Cause identifiée : DHCP Client stoppé. Redémarre-le.', hint: 'Start-Service dhcp', check: c => /^start-service\b.*dhcp/i.test(c.trim()) || /^sasv\b.*dhcp/i.test(c.trim()) },
        { instr: 'Service redémarré. Renouvelle maintenant le bail DHCP pour obtenir une nouvelle adresse IP.', hint: 'ipconfig /renew', check: c => /^ipconfig\s+\/renew/i.test(c.trim()) },
        { instr: 'Bail obtenu ! Vérifie la nouvelle configuration IP.', hint: 'ipconfig', check: c => /^ipconfig(\b|$)/i.test(c.trim()) },
        { instr: 'Connectivité restaurée. Confirme en pingant la passerelle 192.168.1.1.', hint: 'ping 192.168.1.1', check: c => /^ping\b.*192\.168\.1/i.test(c.trim()) },
      ],
    },
    {
      id: 'route',
      title: 'Mauvaise passerelle par défaut',
      desc: 'Le réseau local répond mais Internet est inaccessible. Identifie et corrige la gateway erronée.',
      onStart: () => { cliState.networkFault = 'gateway'; },
      onEnd:   () => { cliState.networkFault = null; },
      steps: [
        { instr: ' Signalement : le serveur peut joindre les postes du réseau local mais plus Internet ni les autres sites. Vérifie la config IP.', hint: 'ipconfig', check: c => /^ipconfig(\b|$)/i.test(c.trim()) },
        { instr: 'Note la passerelle : 192.168.99.1 — elle n\'appartient pas au réseau 192.168.1.0/24. Confirme que le réseau local fonctionne.', hint: 'ping 192.168.1.1', check: c => /^ping\b.*192\.168\.1\.1/i.test(c.trim()) },
        { instr: 'Réseau local OK. Teste maintenant une IP externe.', hint: 'ping 8.8.8.8', check: c => /^ping\b.*8\.8\.8\.8/i.test(c.trim()) },
        { instr: 'Timeout confirmé. Trace la route pour localiser où ça bloque.', hint: 'tracert 8.8.8.8', check: c => /^tracert\b/i.test(c.trim()) },
        { instr: 'Le premier hop (192.168.99.1) ne répond pas : la gateway est injoignable. Vérifie la table de routage.', hint: 'route print', check: c => /^route\s+print/i.test(c.trim()) || /^get-netroute/i.test(c.trim()) },
        { instr: 'La route par défaut pointe vers 192.168.99.1 qui n\'existe pas. Corrige l\'adresse IP avec la bonne gateway (192.168.1.1).', hint: 'netsh interface ip set address "Ethernet" static 192.168.1.20 255.255.255.0 192.168.1.1', check: c => /^netsh\b/i.test(c.trim()) },
        { instr: 'Configuration appliquée. Vérifie la nouvelle config IP.', hint: 'ipconfig', check: c => /^ipconfig(\b|$)/i.test(c.trim()) },
        { instr: 'Gateway corrigée. Confirme la connectivité Internet.', hint: 'ping 8.8.8.8', check: c => /^ping\b.*8\.8\.8\.8/i.test(c.trim()) },
      ],
    },
    {
      id: 'conflit',
      title: 'Conflit d\'adresse IP',
      desc: 'Connectivité intermittente — une autre machine partage l\'IP 192.168.1.20. Identifie et résous le conflit.',
      onStart: () => { cliState.networkFault = 'conflict'; },
      onEnd:   () => { cliState.networkFault = null; },
      steps: [
        { instr: ' Signalement : connexions instables, coupures aléatoires. Commence par vérifier la configuration IP.', hint: 'ipconfig', check: c => /^ipconfig(\b|$)/i.test(c.trim()) },
        { instr: 'La config semble normale mais Windows mentionne un conflit. Consulte les événements système récents.', hint: 'Get-EventLog -LogName System -Newest 10', check: c => /^get-eventlog\b/i.test(c.trim()) || /^get-winevent\b/i.test(c.trim()) },
        { instr: 'Event ID 4199 confirmé : conflit d\'adresse IP. Vérifie la table ARP pour trouver l\'intrus.', hint: 'arp -a', check: c => /^arp\b/i.test(c.trim()) },
        { instr: 'Deux entrées MAC pour 192.168.1.20 ! Une MAC étrangère écrase la nôtre. Confirme l\'instabilité avec un ping.', hint: 'ping 192.168.1.1', check: c => /^ping\b.*192\.168\.1\.1/i.test(c.trim()) },
        { instr: '50% de perte  trafic capté aléatoirement par l\'autre machine. Solution : changer notre IP. Attribue 192.168.1.21.', hint: 'netsh interface ip set address "Ethernet" static 192.168.1.21 255.255.255.0 192.168.1.1', check: c => /^netsh\b/i.test(c.trim()) },
        { instr: 'Configuration appliquée. Vérifie la nouvelle IP.', hint: 'ipconfig', check: c => /^ipconfig(\b|$)/i.test(c.trim()) },
        { instr: 'IP changée en 192.168.1.21. Plus de conflit. Confirme la stabilité réseau.', hint: 'ping 192.168.1.1', check: c => /^ping\b.*192\.168\.1/i.test(c.trim()) },
      ],
    },
  ],
  linux: [
    {
      id: 'diagnostic',
      title: 'Diagnostic réseau complet',
      desc: 'Une machine Linux ne ping pas 8.8.8.8. Diagnostique méthodiquement : interface  gateway  DNS.',
      steps: [
        { instr: 'Commence par vérifier la configuration des interfaces réseau.', hint: 'ip addr', check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) || /^ifconfig\b/i.test(c.trim()) },
        { instr: 'eth0 est UP avec 192.168.1.10/24. Vérifie si une route par défaut est configurée.', hint: 'ip route', check: c => /^ip\s+(r|route)\b/i.test(c.trim()) },
        { instr: 'Route OK (via 192.168.1.1). Teste la connectivité vers la passerelle.', hint: 'ping -c 4 192.168.1.1', check: c => /^ping\b/i.test(c.trim()) && /192\.168\.1\.1/.test(c) },
        { instr: 'Passerelle répond. Teste internet via IP (sans DNS).', hint: 'ping -c 4 8.8.8.8', check: c => /^ping\b/i.test(c.trim()) && /8\.8\.8\.8/.test(c) },
        { instr: 'Internet OK en IP. Le problème vient du DNS. Vérifie le fichier resolv.conf.', hint: 'cat /etc/resolv.conf', check: c => /^cat\b/i.test(c.trim()) && /resolv/.test(c) },
        { instr: 'Teste la résolution DNS directement.', hint: 'nslookup google.com', check: c => /^(nslookup|dig)\b/i.test(c.trim()) },
        { instr: 'DNS fonctionne. Affiche les ports en écoute pour vérifier les services actifs.', hint: 'ss -tulnp', check: c => /^(ss|netstat)\b/i.test(c.trim()) },
      ],
    },
    {
      id: 'services',
      title: 'Services réseau systemd',
      desc: 'Audite et contrôle les services réseau SSH, Apache et leur état sur le serveur.',
      steps: [
        { instr: 'Liste tous les services systemd actifs.', hint: 'systemctl list-units', check: c => /^systemctl\s+list-units\b/i.test(c.trim()) },
        { instr: 'Vérifie l\'état détaillé du service SSH.', hint: 'systemctl status ssh', check: c => /^systemctl\s+status\s+ssh/i.test(c.trim()) },
        { instr: 'SSH actif. Vérifie sur quel port il écoute exactement.', hint: 'ss -tulnp', check: c => /^(ss|netstat)\b/i.test(c.trim()) },
        { instr: 'Port 22 confirmé. Redémarre le service Apache.', hint: 'systemctl restart apache2', check: c => /^(sudo\s+)?systemctl\s+restart\s+apache2/i.test(c.trim()) },
        { instr: 'Vérifie qu\'Apache écoute bien sur le port 80.', hint: 'ss -tulnp', check: c => /^(ss|netstat)\b/i.test(c.trim()) },
        { instr: 'Affiche l\'adresse IP et la table de routage complète.', hint: 'ip addr', check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) },
      ],
    },
    {
      id: 'analyse',
      title: 'Analyse ARP et traceroute',
      desc: 'Explore la table ARP, trace le chemin réseau et identifie les voisins sur le LAN.',
      steps: [
        { instr: 'Affiche la table ARP (correspondances IP/MAC sur le LAN).', hint: 'arp -n', check: c => /^arp\b/i.test(c.trim()) },
        { instr: 'Identifie les adresses MAC voisines. Maintenant trace le chemin vers 8.8.8.8.', hint: 'traceroute 8.8.8.8', check: c => /^(traceroute|tracepath)\b/i.test(c.trim()) },
        { instr: 'Hop 1 = passerelle 192.168.1.1. Résous le nom du serveur DNS de Google.', hint: 'nslookup 8.8.8.8', check: c => /^(nslookup|dig)\b/i.test(c.trim()) },
        { instr: 'Interroge le type MX du domaine tssr.local.', hint: 'dig tssr.local', check: c => /^dig\b/i.test(c.trim()) },
        { instr: 'Vérifie le fichier hosts local.', hint: 'cat /etc/hosts', check: c => /^cat\b/i.test(c.trim()) && /hosts/.test(c) },
        { instr: 'Affiche les infos couche 2 (MAC, état) des interfaces.', hint: 'ip link', check: c => /^ip\s+(l|link)\b/i.test(c.trim()) },
      ],
    },
    {
      id: 'panne_dhcp',
      title: 'Panne DHCP Linux',
      desc: 'La machine a une IP APIPA 169.254.x.x — le serveur DHCP ne répond plus. Diagnostique et restaure la connectivité.',
      onStart: () => { cliState.networkFault = 'dhcp'; },
      onEnd:   () => { cliState.networkFault = null; },
      steps: [
        { instr: ' Signalement : impossible d\'accéder au réseau. Commence par vérifier la configuration IP.', hint: 'ip addr', check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) || /^ifconfig\b/i.test(c.trim()) },
        { instr: 'APIPA 169.254.47.18 détectée — le DHCP n\'a pas répondu. Vérifie la table de routage.', hint: 'ip route', check: c => /^ip\s+(r|route)\b/i.test(c.trim()) },
        { instr: 'Pas de route par défaut. Consulte les logs pour confirmer le problème DHCP.', hint: 'journalctl', check: c => /^journalctl\b/i.test(c.trim()) },
        { instr: 'Logs confirmés : timeouts DHCP répétés. Teste la connectivité réseau de base.', hint: 'ping -c 4 192.168.1.1', check: c => /^ping\b/i.test(c.trim()) },
        { instr: 'Réseau inaccessible. Redémarre le service networking pour relancer le client DHCP.', hint: 'systemctl restart networking', check: c => /^(sudo\s+)?systemctl\s+restart\s+networking/i.test(c.trim()) },
        { instr: 'Service redémarré. Lance maintenant dhclient pour obtenir une adresse IP.', hint: 'dhclient eth0', check: c => /^dhclient\b/i.test(c.trim()) },
        { instr: 'DHCP négocié avec succès. Vérifie la nouvelle IP assignée.', hint: 'ip addr', check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) || /^ifconfig\b/i.test(c.trim()) },
        { instr: 'IP 192.168.1.10 restaurée. Confirme la connectivité internet.', hint: 'ping -c 4 8.8.8.8', check: c => /^ping\b/i.test(c.trim()) },
      ],
    },
    {
      id: 'panne_gateway',
      title: 'Mauvaise passerelle Linux',
      desc: 'Le réseau local fonctionne mais internet est inaccessible. La route par défaut pointe vers une IP fantôme.',
      onStart: () => { cliState.networkFault = 'gateway'; },
      onEnd:   () => { cliState.networkFault = null; },
      steps: [
        { instr: ' Signalement : accès LAN OK mais internet impossible. Vérifie la configuration IP.', hint: 'ip addr', check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) || /^ifconfig\b/i.test(c.trim()) },
        { instr: 'IP normale. Teste internet en IP directe (sans DNS).', hint: 'ping -c 4 8.8.8.8', check: c => /^ping\b/i.test(c.trim()) && /8\.8\.8\.8/.test(c) },
        { instr: '100% perte. Vérifie la table de routage pour trouver la cause.', hint: 'ip route', check: c => /^ip\s+(r|route)\b/i.test(c.trim()) },
        { instr: 'Passerelle 192.168.99.1 hors réseau ! Vérifie que la gateway est joignable via ARP.', hint: 'arp -n', check: c => /^arp\b/i.test(c.trim()) },
        { instr: 'Aucune entrée MAC pour 192.168.99.1. Confirme via traceroute.', hint: 'traceroute 8.8.8.8', check: c => /^(traceroute|tracepath)\b/i.test(c.trim()) },
        { instr: 'Bloqué au hop 1. Supprime la route par défaut incorrecte.', hint: 'ip route del default', check: c => /^(sudo\s+)?ip\s+route\s+del\s+default/i.test(c.trim()) },
        { instr: 'Route supprimée. Ajoute la bonne passerelle 192.168.1.1.', hint: 'ip route add default via 192.168.1.1 dev eth0', check: c => /^(sudo\s+)?ip\s+route\s+add\s+default\s+via\s+192\.168\.1\.1/i.test(c.trim()) },
        { instr: 'Route corrigée. Confirme la connectivité internet.', hint: 'ping -c 4 8.8.8.8', check: c => /^ping\b/i.test(c.trim()) && /8\.8\.8\.8/.test(c) },
      ],
    },
    {
      id: 'panne_conflit',
      title: 'Conflit d\'adresse IP Linux',
      desc: 'Connexions instables et coupures aléatoires — une autre machine partage 192.168.1.10. Identifie et résous.',
      onStart: () => { cliState.networkFault = 'conflict'; },
      onEnd:   () => { cliState.networkFault = null; },
      steps: [
        { instr: ' Signalement : connexions instables, coupures aléatoires. Vérifie la configuration IP.', hint: 'ip addr', check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) || /^ifconfig\b/i.test(c.trim()) },
        { instr: 'IP visible mais message de conflit. Consulte les logs kernel.', hint: 'journalctl', check: c => /^journalctl\b/i.test(c.trim()) },
        { instr: 'Conflit ARP confirmé dans les logs. Identifie l\'intrus dans la table ARP.', hint: 'arp -n', check: c => /^arp\b/i.test(c.trim()) },
        { instr: 'Double MAC pour 192.168.1.10 ! Confirme l\'instabilité avec un ping.', hint: 'ping -c 4 192.168.1.1', check: c => /^ping\b/i.test(c.trim()) },
        { instr: '50% perte — trafic volé aléatoirement. Attribue une nouvelle IP pour éviter le conflit.', hint: 'ip addr add 192.168.1.21/24 dev eth0', check: c => /^(sudo\s+)?ip\s+addr\s+add\s+192\.168\.1\.\d+/i.test(c.trim()) },
        { instr: 'Nouvelle IP appliquée. Vérifie la configuration finale.', hint: 'ip addr', check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) || /^ifconfig\b/i.test(c.trim()) },
        { instr: 'Conflit résolu. Confirme la stabilité réseau.', hint: 'ping -c 4 192.168.1.1', check: c => /^ping\b/i.test(c.trim()) },
      ],
    },
    {
      id: 'gameshell',
      title: 'GameShell — Missions Linux',
      icon: '',
      desc: 'Missions progressives inspirées du vrai GameShell — 30 étapes pour maîtriser le terminal Linux.',
      autosave: true,
      levels: [
        { at: 5,  label: 'Niveau 1 — Découverte',          emoji: '' },
        { at: 10, label: 'Niveau 2 — Fichiers',             emoji: '' },
        { at: 15, label: 'Niveau 3 — Exploration',          emoji: '' },
        { at: 20, label: 'Niveau 4 — Permissions',          emoji: '' },
        { at: 25, label: 'Niveau 5 — Processus & Services', emoji: '' },
      ],
      onStart: () => {
        const saved = store.get('gameshell_progress');
        if (saved && saved.step > 0 && saved.step < 30) {
          scenarioState.step = saved.step;
          cliPrint(`<span style="color:var(--accent)"> Reprise depuis la mission ${saved.step + 1}/30 — progression restaurée.</span>\n<span style="color:var(--text2)">Tape <strong>tp quit</strong> pour abandonner · <strong>tp gameshell</strong> + suppr local pour tout recommencer.</span>`);
        } else {
          cliPrint(`<div style="color:var(--accent);font-family:monospace;white-space:pre;line-height:1.5">

    G A M E S H E L L   T S S R                    
      30 missions pour maîtriser Linux                

  Niv.1 Découverte    · missions  1-5                 
  Niv.2 Fichiers      · missions  6-10                
  Niv.3 Exploration   · missions 11-15                
  Niv.4 Permissions   · missions 16-20                
  Niv.5 Processus     · missions 21-25                
  Niv.6 Maître        · missions 26-30                
</div>
<span style="color:var(--text2)">Bienvenue, technicien. Ton terminal est ton arme.
Suis les missions dans le panneau à droite.
Tape <strong>tp quit</strong> pour abandonner la partie.</span>`);
        }
      },
      onEnd: () => { store.set('gameshell_progress', null); },
      steps: [
        //  NIVEAU 1 — Découverte 
        {
          instr: ' Niv.1 Mission 1/30 — Affiche ton répertoire courant.',
          hint: 'pwd',
          check: c => /^pwd$/i.test(c.trim()),
          successMsg: 'pwd = Print Working Directory. Affiche le chemin absolu où tu te trouves.',
        },
        {
          instr: 'Mission 2/30 — Liste le contenu du répertoire courant.',
          hint: 'ls',
          check: c => /^ls(\s|$)/i.test(c.trim()),
          successMsg: 'ls liste les fichiers et dossiers. -l = détails, -a = fichiers cachés, -h = tailles lisibles.',
        },
        {
          instr: 'Mission 3/30 — Déplace-toi dans /etc.',
          hint: 'cd /etc',
          check: c => /^cd\s+\/etc(\/|$|\s|)$/.test(c.trim()),
          successMsg: '/etc contient les fichiers de configuration système. Le répertoire le plus important pour un admin.',
        },
        {
          instr: 'Mission 4/30 — Reviens dans ton home avec le raccourci ~.',
          hint: 'cd ~',
          check: c => /^cd\s*(~|\/home\/)/.test(c.trim()),
          successMsg: '~ est un alias vers /home/tssr. cd sans argument fait la même chose.',
        },
        {
          instr: 'Mission 5/30 — Liste TOUS les fichiers, y compris les cachés (commençant par .).',
          hint: 'ls -a',
          check: c => /^ls\b.*-[a-zA-Z]*a/.test(c.trim()),
          successMsg: 'Les fichiers cachés commencent par un point : .bashrc, .profile, .ssh — invisibles avec ls normal.',
        },
        //  NIVEAU 2 — Fichiers 
        {
          instr: ' Niv.2 Mission 6/30 — Crée un dossier nommé "mission".',
          hint: 'mkdir mission',
          check: c => /^mkdir\s+mission$/.test(c.trim()),
          successMsg: 'mkdir = Make Directory. mkdir -p a/b/c crée toute l\'arborescence d\'un coup.',
        },
        {
          instr: 'Mission 7/30 — Entre dans le dossier "mission".',
          hint: 'cd mission',
          check: c => /^cd\s+mission$/.test(c.trim()),
          successMsg: 'Tu es dans /home/tssr/mission. Tape pwd pour confirmer ta position.',
        },
        {
          instr: 'Mission 8/30 — Crée un fichier vide nommé "objectif.txt".',
          hint: 'touch objectif.txt',
          check: c => /^touch\s+objectif\.txt$/.test(c.trim()),
          successMsg: 'touch crée un fichier vide ou met à jour la date d\'un fichier existant.',
        },
        {
          instr: 'Mission 9/30 — Écris "GameShell" dans objectif.txt avec echo et la redirection >.',
          hint: 'echo "GameShell" > objectif.txt',
          check: c => /^echo\b/.test(c.trim()) && c.includes('>') && /objectif\.txt/.test(c),
          successMsg: '> redirige stdout vers un fichier (écrase le contenu). >> ajoute sans écraser.',
        },
        {
          instr: 'Mission 10/30 — Affiche le contenu de objectif.txt avec cat.',
          hint: 'cat objectif.txt',
          check: c => /^cat\s+objectif\.txt/.test(c.trim()),
          successMsg: 'cat = concatenate. Pour les gros fichiers, préfère less (pagination avec q pour quitter).',
        },
        //  NIVEAU 3 — Exploration 
        {
          instr: ' Niv.3 Mission 11/30 — Affiche le nom de cette machine via /etc/hostname.',
          hint: 'cat /etc/hostname',
          check: c => /^cat\b/.test(c.trim()) && /hostname/.test(c),
          successMsg: '/etc/hostname contient le nom court de la machine. Modifiable avec hostnamectl.',
        },
        {
          instr: 'Mission 12/30 — Cherche "tssr" dans /etc/passwd avec grep.',
          hint: 'grep "tssr" /etc/passwd',
          check: c => /^grep\b/.test(c.trim()) && /\/etc\/passwd/.test(c),
          successMsg: '/etc/passwd : login:x:UID:GID:gecos:home:shell. Pas de mot de passe en clair — ils sont dans /etc/shadow.',
        },
        {
          instr: 'Mission 13/30 — Compte les lignes de /etc/passwd avec wc -l.',
          hint: 'wc -l /etc/passwd',
          check: c => /^wc\b/.test(c.trim()) && c.includes('/etc/passwd'),
          successMsg: 'wc = word count. -l lignes, -w mots, -c octets. Chaque ligne = un compte utilisateur.',
        },
        {
          instr: 'Mission 14/30 — Affiche les 3 premières lignes de /etc/passwd avec head.',
          hint: 'head -3 /etc/passwd',
          check: c => /^head\b/.test(c.trim()) && c.includes('/etc/passwd'),
          successMsg: 'head affiche le début d\'un fichier. tail fait l\'inverse. tail -f suit un fichier en temps réel.',
        },
        {
          instr: 'Mission 15/30 — Copie objectif.txt en sauvegarde.txt avec cp.',
          hint: 'cp objectif.txt sauvegarde.txt',
          check: c => /^cp\s+objectif\.txt\s+sauvegarde\.txt/.test(c.trim()),
          successMsg: 'cp copie un fichier. cp -r pour les répertoires. L\'original est conservé.',
        },
        //  NIVEAU 4 — Permissions 
        {
          instr: ' Niv.4 Mission 16/30 — Affiche les permissions des fichiers avec ls -l.',
          hint: 'ls -l',
          check: c => /^ls\b.*-[a-zA-Z]*l/.test(c.trim()),
          successMsg: 'Format : -rw-r--r-- 1 user group size date nom. Les 3 triplets rwx = propriétaire, groupe, autres.',
        },
        {
          instr: 'Mission 17/30 — Rends objectif.txt exécutable avec chmod +x.',
          hint: 'chmod +x objectif.txt',
          check: c => /^chmod\b/.test(c.trim()) && /\+x/.test(c) && /objectif\.txt/.test(c),
          successMsg: '+x ajoute l\'exécution pour tous. u+x = propriétaire seulement. r=4, w=2, x=1.',
        },
        {
          instr: 'Mission 18/30 — Mets les permissions 644 (rw-r--r--) sur sauvegarde.txt.',
          hint: 'chmod 644 sauvegarde.txt',
          check: c => /^chmod\s+644\s+sauvegarde\.txt/.test(c.trim()),
          successMsg: '644 = rw-r--r-- : propriétaire lit+écrit, groupe et autres lisent. Standard pour un fichier de config.',
        },
        {
          instr: 'Mission 19/30 — Affiche permissions ET fichiers cachés avec ls -la.',
          hint: 'ls -la',
          check: c => /^ls\b/.test(c.trim()) && /-[a-zA-Z]*l/.test(c) && /-[a-zA-Z]*a/.test(c) || /^ls\s+-(la|al)$/.test(c.trim()),
          successMsg: '-l + -a ensemble : tout voir. Les fichiers . (répertoire courant) et .. (parent) sont toujours là.',
        },
        {
          instr: 'Mission 20/30 — Crée un lien symbolique "lien.txt" vers objectif.txt avec ln -s.',
          hint: 'ln -s objectif.txt lien.txt',
          check: c => /^ln\s+-s\b/.test(c.trim()) && /objectif\.txt/.test(c),
          successMsg: 'Un lien symbolique est un raccourci. ls -l affiche -> objectif.txt. Supprimer le lien ne touche pas la cible.',
        },
        //  NIVEAU 5 — Processus & Services 
        {
          instr: ' Niv.5 Mission 21/30 — Affiche tous les processus en cours avec ps aux.',
          hint: 'ps aux',
          check: c => /^ps\b/.test(c.trim()) && /aux/.test(c),
          successMsg: 'a = tous utilisateurs, u = format lisible, x = inclure sans terminal. PID = identifiant unique du processus.',
        },
        {
          instr: 'Mission 22/30 — Filtre les processus bash avec un pipe : ps aux | grep bash.',
          hint: 'ps aux | grep bash',
          check: c => /^ps\b/.test(c.trim()) && /\|\s*grep\b/.test(c) && /bash/.test(c),
          successMsg: 'Le pipe | enchaîne les commandes : stdout de gauche  stdin de droite. Fondement du shell Unix.',
        },
        {
          instr: 'Mission 23/30 — Vérifie l\'état du service SSH avec systemctl status.',
          hint: 'systemctl status ssh',
          check: c => /^(sudo\s+)?systemctl\s+status\s+(ssh|sshd)/i.test(c.trim()),
          successMsg: 'systemd gère les services. "Active: running" = opérationnel. "enabled" = démarrage auto au boot.',
        },
        {
          instr: 'Mission 24/30 — Affiche les ports ouverts avec netstat ou ss.',
          hint: 'netstat -tlnp',
          check: c => /^netstat\b/.test(c.trim()) || /^ss\b/.test(c.trim()),
          successMsg: '-t TCP, -l listening, -n numérique, -p processus. Port 22 = SSH, 80 = HTTP, 443 = HTTPS.',
        },
        {
          instr: 'Mission 25/30 — Affiche la configuration réseau avec ip a.',
          hint: 'ip a',
          check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) || /^ifconfig\b/i.test(c.trim()),
          successMsg: 'ip addr remplace l\'ancien ifconfig. lo = loopback 127.0.0.1, eth0 = carte réseau principale.',
        },
        //  NIVEAU 6 — Maître du terminal 
        {
          instr: ' Niv.6 Mission 26/30 — Lance "ls /root 2>/dev/null" pour supprimer silencieusement les erreurs.',
          hint: 'ls /root 2>/dev/null',
          check: c => /2>\s*\/dev\/null/.test(c),
          successMsg: '2>/dev/null envoie stderr dans le néant. Utile dans les scripts pour ignorer les erreurs non critiques.',
        },
        {
          instr: 'Mission 27/30 — Trouve tous les fichiers .txt avec find, en supprimant les erreurs de permission.',
          hint: 'find / -name "*.txt" 2>/dev/null',
          check: c => /^find\b/.test(c.trim()) && /-name\b/.test(c) && /\.txt/.test(c),
          successMsg: 'find parcourt l\'arborescence récursivement. -type f fichiers, -mtime +7 modifiés >7 jours, -size +1M >1 Mo.',
        },
        {
          instr: 'Mission 28/30 — Trie le contenu de /etc/passwd alphabétiquement avec sort.',
          hint: 'sort /etc/passwd',
          check: c => /^sort\b/.test(c.trim()),
          successMsg: 'sort trie les lignes. -r = ordre inverse, -n = numérique, -t: -k3 = tri sur le 3ème champ séparé par :.',
        },
        {
          instr: 'Mission 29/30 — Combine sort et uniq pour trier et supprimer les doublons.',
          hint: 'sort /etc/passwd | uniq',
          check: c => /^sort\b/.test(c.trim()) && /\|\s*uniq\b/.test(c),
          successMsg: 'uniq supprime les lignes consécutives identiques — toujours précédé de sort. uniq -c compte les occurrences.',
        },
        {
          instr: 'Mission 30/30  — Pipe ultime : extrait les users bash  cat /etc/passwd | grep bash | cut -d: -f1 | sort',
          hint: 'cat /etc/passwd | grep bash | cut -d: -f1 | sort',
          check: c => /grep\b/.test(c) && /cut\b/.test(c) && /sort\b/.test(c) && (c.match(/\|/g)||[]).length >= 2,
          successMsg: ' MISSION ACCOMPLIE ! grep filtre, cut extrait une colonne, sort trie. Ce pipe est utilisé quotidiennement par les admins sys.',
        },
      ],
    },
  ],
};

function handleTPCommand(args, type) {
  const out = (s) => cliPrint(s);
  const err = (s) => cliPrint(`<span class="cli-error">${escHtml(s)}</span>`);
  const scenarios = TP_SCENARIOS[type] || [];
  const sub = (args[0]||'').toLowerCase();

  if (!sub || sub === 'list') {
    out(`\n<span style="color:var(--${type==='windows'?'blue':'accent'})">TP disponibles :</span>`);
    scenarios.forEach((sc, i) => out(`  <strong>${i+1}. ${sc.id}</strong> — ${sc.title}\n     ${sc.desc}`));
    out(`\n<span style="color:var(--text3)">Démarre un TP : tp start &lt;id&gt;   ·   Quitte : tp quit</span>`);
    return;
  }
  if (sub === 'start' || sub === 'run') {
    const id = args[1];
    if (!id) { err('tp start <id> — précise l\'id du TP (tape tp pour la liste)'); return; }
    const sc = scenarios.find(s => s.id.toLowerCase() === id.toLowerCase());
    if (!sc) { err(`TP "${id}" introuvable. Tape tp pour la liste.`); return; }
    scenarioState = { scenario: sc, step: 0, done: false };
    scenarioCheck = (cmd) => tpValidate(cmd);
    if (sc.onStart) sc.onStart();
    renderScenarioPanel();
    out(`\n<span style="color:var(--${type==='windows'?'blue':'accent'})"> TP lancé : ${sc.title}</span>\nObjectif : ${sc.desc}\n\n Lis le panneau TP à droite. Complète chaque étape dans l\'ordre.\n`);
    return;
  }
  if (sub === 'quit' || sub === 'stop') {
    if (scenarioState?.scenario?.onEnd) scenarioState.scenario.onEnd();
    scenarioState = null;
    scenarioCheck = null;
    document.getElementById('scenario-panel').style.display = 'none';
    out('TP terminé.');
    return;
  }
  // raccourci : tp <id> = tp start <id>
  const directSc = scenarios.find(s => s.id.toLowerCase() === sub);
  if (directSc) {
    scenarioState = { scenario: directSc, step: 0, done: false };
    scenarioCheck = (cmd) => tpValidate(cmd);
    if (directSc.onStart) directSc.onStart();
    renderScenarioPanel();
    out(`\n<span style="color:var(--${type==='windows'?'blue':'accent'})"> TP lancé : ${directSc.title}</span>\nObjectif : ${directSc.desc}\n\n Lis le panneau TP à droite. Complète chaque étape dans l'ordre.\n`);
    return;
  }
  err(`tp : argument invalide. Options : list | start <id> | quit`);
}

function tpValidate(cmd) {
  if (!scenarioState || scenarioState.done) return;
  const { scenario, step } = scenarioState;
  const current = scenario.steps[step];
  if (!current.check(cmd)) return;

  // Étape validée
  scenarioState.step++;

  // Autosave
  if (scenario.autosave) {
    store.set(scenario.id + '_progress', { step: scenarioState.step });
  }
  // Badge de niveau
  if (scenario.levels) {
    const badge = scenario.levels.find(l => l.at === scenarioState.step);
    if (badge) {
      cliPrint(`<div style="border:1px solid var(--accent);padding:6px 16px;margin:8px 0;border-radius:4px;display:inline-block;color:var(--accent)">${badge.emoji} <strong>${badge.label}</strong> — NIVEAU COMPLÉTÉ !</div>`);
    }
  }

  if (scenarioState.step >= scenario.steps.length) {
    scenarioState.done = true;
    scenarioCheck = null;
    if (scenario.onEnd) scenario.onEnd();
    renderScenarioPanel();
    cliPrint(`<div class="cli-explain"> <strong>TP terminé !</strong> Tu as complété "${scenario.title}" en ${scenario.steps.length} étapes. Tape <strong>tp</strong> pour un nouveau TP.</div>`);
  } else {
    renderScenarioPanel();
    const next = scenario.steps[scenarioState.step];
    const explainHtml = current.successMsg
      ? `<div style="color:var(--text2);margin:4px 0 6px;font-size:13px"> ${current.successMsg}</div>`
      : '';
    cliPrint(`<div class="cli-explain"> Étape ${step + 1}/${scenario.steps.length} validée !${explainHtml ? '\n' + explainHtml : ''}\n Étape ${scenarioState.step + 1} : ${escHtml(next.instr)}</div>`);
  }
}

function renderScenarioPanel() {
  const panel = document.getElementById('scenario-panel');
  if (!panel) return;
  if (!scenarioState) { panel.style.display = 'none'; return; }
  const { scenario, step, done } = scenarioState;
  const total = scenario.steps.length;
  const pct = done ? 100 : Math.round(step / total * 100);

  let stepsHtml = scenario.steps.map((s, i) => {
    const cls = i < step ? 'sc-done' : i === step && !done ? 'sc-current' : 'sc-todo';
    return `<div class="sc-step ${cls}">
      <div class="sc-step-num">${i + 1}</div>
      <div class="sc-step-text">${escHtml(s.instr)}</div>
    </div>`;
  }).join('');

  let hintHtml = '';
  if (!done && step < total) {
    hintHtml = `<div class="sc-hint">
      <span class="sc-hint-label">Indice</span>
      <div class="sc-hint-content"><code>${escHtml(scenario.steps[step].hint)}</code></div>
    </div>`;
  }

  let doneBanner = done ? `<div class="sc-done-banner"> TP complété !</div>` : '';

  panel.style.display = 'flex';
  panel.innerHTML = `
    <div class="sc-header">
      <span class="sc-icon"></span>
      <span class="sc-title">${escHtml(scenario.title)}</span>
      <button class="sc-close" onclick="scenarioState=null;scenarioCheck=null;document.getElementById('scenario-panel').style.display='none'"></button>
    </div>
    <div class="sc-progress"><div class="sc-progress-bar" style="width:${pct}%"></div></div>
    <div class="sc-steps">${stepsHtml}</div>
    ${hintHtml}
    ${doneBanner}`;
}

// ===== COMMAND DISPATCHER =====
function cliExec(raw) {
  const isWin = cliState.type === 'windows';
  const trimmed = raw.trim();
  const parts = cliParseArgs(trimmed);
  const cmd = parts[0];
  const args = parts.slice(1);

  // Hook scenario validation avant exécution
  if (typeof scenarioCheck === 'function') {
    scenarioCheck(trimmed, cliState.fs, cliState.cwd);
  }

  if (cliState.diskpartMode) { cliExecDiskpart(trimmed); return; }

  if (isWin) cliExecWindows(cmd.toLowerCase(), args, trimmed);
  else cliExecLinux(cmd, args, trimmed);
}

function cliParseArgs(raw) {
  const parts = [];
  let cur = '';
  let inQ = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === ' ' && !inQ) { if (cur) { parts.push(cur); cur = ''; } continue; }
    cur += c;
  }
  if (cur) parts.push(cur);
  return parts;
}

// ============================================================
// ===== DISKPART =============================================
// ============================================================
function cliExecDiskpart(raw) {
  const out   = (s) => cliPrint(s);
  const err   = (s) => cliPrint(`<span class="cli-error">${escHtml(s)}</span>`);
  const explain = (s) => cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> ${s}</div>`);
  const errEx = (msg, why) => { err(msg); cliPrint(`<div class="cli-explain-err"> <strong>Pourquoi :</strong> ${escHtml(why)}</div>`); };

  const tokens = raw.trim().toLowerCase().replace(/\s+/g,' ').split(' ');
  const cmd    = tokens[0];
  const rest   = tokens.slice(1);

  const disks = cliState.disks;
  const sel   = cliState.dpSel;

  switch (cmd) {

    case 'list': {
      if (rest[0] === 'disk') {
        out(`\n  Disque ###  Statut         Taille  Disponible  Dyn  GPT`);
        out(`  ---------  -------------  ------  ----------  ---  ---`);
        disks.forEach(d => {
          const star = sel.disk === d.id ? '*' : ' ';
          out(`  ${star}Disque ${d.id}    ${d.status.padEnd(15)}${d.size.padEnd(8)}0 MB        ${d.type==='GPT'?'     *':''}`);
        });
        explain('list disk affiche les disques physiques détectés. L\'étoile (*) indique le disque actuellement sélectionné. Type RAW = pas encore initialisé/formaté.');
      } else if (rest[0] === 'partition') {
        if (sel.disk === null) { errEx('Aucun disque sélectionné.', 'Tu dois d\'abord cibler un disque avec : select disk N'); break; }
        const d = disks.find(x=>x.id===sel.disk);
        if (!d.partitions.length) { out('Aucune partition sur ce disque.'); break; }
        out(`\n  Partition ###  Type              Taille  Décalage`);
        out(`  -------------  ----------------  ------  --------`);
        d.partitions.forEach(p => {
          const star = sel.partition === p.id ? '*' : ' ';
          out(`  ${star}Partition ${p.id}    ${p.type.padEnd(18)}${p.size.padEnd(8)}1024 KB`);
        });
        explain('list partition liste les partitions du disque sélectionné. L\'étoile = partition active. Utilise select partition N pour en cibler une.');
      } else { err('list: argument invalide. Options : disk | partition'); }
      break;
    }

    case 'select': {
      if (rest[0] === 'disk') {
        const id = parseInt(rest[1]);
        const d  = disks.find(x=>x.id===id);
        if (!d) { errEx(`Le disque ${id} n'existe pas.`, 'Vérifie les indices avec list disk. Les numéros commencent à 0.'); break; }
        sel.disk = id; sel.partition = null;
        out(`Le disque ${id} est maintenant le disque sélectionné.`);
        explain(`select disk ${id} cible ce disque. Toutes les commandes suivantes (clean, convert, create partition…) s'appliqueront à ce disque jusqu'à un autre select.`);
      } else if (rest[0] === 'partition') {
        if (sel.disk === null) { errEx('Aucun disque sélectionné.', 'Utilise select disk N avant select partition N.'); break; }
        const id = parseInt(rest[1]);
        const d  = disks.find(x=>x.id===sel.disk);
        const p  = d.partitions.find(x=>x.id===id);
        if (!p) { errEx(`Partition ${id} introuvable.`, 'Vérifie avec list partition. Les partitions démarrent à 1.'); break; }
        sel.partition = id;
        out(`La partition ${id} est maintenant la partition sélectionnée.`);
        explain(`select partition ${id} cible la partition. Tu peux maintenant lui appliquer format, assign, extend...`);
      } else { err('select: argument invalide. Options : disk N | partition N'); }
      break;
    }

    case 'clean': {
      if (sel.disk === null) { errEx('Aucun disque sélectionné.', 'Cible d\'abord un disque avec select disk N.'); break; }
      const d = disks.find(x=>x.id===sel.disk);
      d.partitions = []; d.type = 'RAW';
      out('DiskPart a réussi à nettoyer le disque.');
      explain('<strong>clean</strong> efface la table de partition (MBR ou GPT) du disque sélectionné. Toutes les données deviennent inaccessibles. Étape obligatoire avant de réinitialiser un disque en GPT.');
      break;
    }

    case 'convert': {
      if (sel.disk === null) { errEx('Aucun disque sélectionné.', 'Sélectionne un disque avec select disk N.'); break; }
      const d = disks.find(x=>x.id===sel.disk);
      if (rest[0] === 'gpt') {
        if (d.partitions.length) { errEx('Le disque contient des partitions.', 'Exécute clean avant de convertir. Toutes les partitions doivent être supprimées pour changer le schéma.'); break; }
        d.type = 'GPT';
        out('DiskPart a converti le disque sélectionné au format GPT.');
        explain('<strong>convert gpt</strong> : GPT (GUID Partition Table) est requis pour les disques > 2 To et les systèmes UEFI. Il supporte jusqu\'à 128 partitions primaires vs 4 pour MBR.');
      } else if (rest[0] === 'mbr') {
        if (d.partitions.length) { errEx('Partitions présentes.', 'Supprime toutes les partitions avec clean avant de convertir.'); break; }
        d.type = 'MBR';
        out('DiskPart a converti le disque sélectionné au format MBR.');
        explain('<strong>convert mbr</strong> : MBR (Master Boot Record) est l\'ancien schéma. Limité à 2 To et 4 partitions primaires. Nécessaire pour les anciens BIOS/Legacy.');
      } else { err('convert: argument invalide. Options : gpt | mbr'); }
      break;
    }

    case 'create': {
      if (rest[0] !== 'partition' || rest[1] !== 'primary') { err('Syntaxe : create partition primary [size=N]'); break; }
      if (sel.disk === null) { errEx('Aucun disque sélectionné.', 'Sélectionne un disque avec select disk N.'); break; }
      const d    = disks.find(x=>x.id===sel.disk);
      if (d.type === 'RAW') { errEx('Disque non initialisé.', 'Initialise d\'abord le disque avec convert gpt ou convert mbr.'); break; }
      const sizeArg = rest.find(t=>t.startsWith('size='));
      const size    = sizeArg ? sizeArg.split('=')[1]+' MB' : d.size;
      const newId   = (d.partitions.length ? Math.max(...d.partitions.map(p=>p.id)) : 0) + 1;
      d.partitions.push({ id: newId, type: 'Primaire', size, letter: null, fs: null, label: null });
      sel.partition = newId;
      out(`DiskPart a créé la partition avec succès.`);
      explain(`<strong>create partition primary</strong> crée une partition de données. Sans <em>size=N</em> elle utilise tout l'espace disponible. Elle doit encore être formatée (format fs=ntfs) avant utilisation.`);
      break;
    }

    case 'format': {
      if (sel.disk === null || sel.partition === null) { errEx('Aucune partition sélectionnée.', 'Utilise select disk N puis select partition N, ou crée une partition avec create partition primary.'); break; }
      const d   = disks.find(x=>x.id===sel.disk);
      const p   = d.partitions.find(x=>x.id===sel.partition);
      const fsArg    = rest.find(t=>t.startsWith('fs='));
      const lblArg   = rest.find(t=>t.startsWith('label='));
      p.fs    = fsArg  ? fsArg.split('=')[1].toUpperCase()              : 'NTFS';
      p.label = lblArg ? lblArg.split('=')[1].replace(/"/g,'') : 'Nouveau volume';
      out(`  0 pour cent effectué\n100 pour cent effectué\nDiskPart a formaté le volume avec succès.`);
      explain(`<strong>format fs=${p.fs} quick</strong> : NTFS est le seul FS Windows supportant ACL, compression, chiffrement et fichiers > 4 Go. <strong>quick</strong> écrit uniquement les métadonnées (format complet recommandé pour un disque réutilisé afin d'écraser les données).`);
      break;
    }

    case 'assign': {
      if (sel.disk === null || sel.partition === null) { errEx('Aucune partition sélectionnée.', 'Sélectionne une partition avec select partition N.'); break; }
      const d   = disks.find(x=>x.id===sel.disk);
      const p   = d.partitions.find(x=>x.id===sel.partition);
      if (!p.fs) { errEx('Partition non formatée.', 'Formate d\'abord la partition avec format fs=ntfs quick.'); break; }
      const letArg = rest.find(t=>t.startsWith('letter='));
      const letter = letArg ? letArg.split('=')[1].toUpperCase() : 'E';
      p.letter = letter;
      out(`DiskPart a attribué la lettre de lecteur ou le nom de point de montage.`);
      explain(`<strong>assign letter=${letter}</strong> monte la partition sous ${letter}: dans l'explorateur Windows. Sans lettre, le volume est inaccessible aux utilisateurs. Les lettres A: et B: sont réservées aux disquettes.`);
      break;
    }

    case 'extend': {
      if (sel.disk === null || sel.partition === null) { errEx('Aucune partition sélectionnée.', 'Sélectionne la partition à étendre avec select partition N.'); break; }
      const d = disks.find(x=>x.id===sel.disk);
      const p = d.partitions.find(x=>x.id===sel.partition);
      if (!p.fs) { errEx('Partition non formatée.', 'extend ne peut étendre qu\'une partition NTFS formatée.'); break; }
      p.size = d.size;
      out('DiskPart a étendu le volume avec succès.');
      explain('<strong>extend</strong> agrandit la partition avec l\'espace libre contigu immédiatement à sa droite. Fonctionne uniquement sur NTFS et si l\'espace libre est adjacent.');
      break;
    }

    case 'exit': {
      cliState.diskpartMode = false;
      cliState.dpSel = { disk: null, partition: null };
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      out('\nDiskPart quitte...');
      explain('Tu as quitté diskpart et repris le contexte PowerShell normal. Les modifications de partition sont persistées dans l\'état de la simulation.');
      break;
    }

    default:
      if (!cmd) break;
      errEx(`${escHtml(cmd)} : commande inconnue.`, 'Commandes disponibles : list disk/partition · select disk/partition · clean · convert gpt/mbr · create partition primary [size=N] · format fs=ntfs quick [label=X] · assign letter=X · extend · exit');
  }
}

// ============================================================
// ===== LINUX COMMANDS =======================================
// ============================================================
function cliExecLinux(cmd, args, raw) {
  const fs = cliState.fs;
  const out = (s) => cliPrint(s);
  const err = (s) => cliPrint(`<span class="cli-err">${escHtml(s)}</span>`);

  // Pipe basique : cmd | grep pattern
  if (raw.includes(' | ')) {
    const [left, right] = raw.split(' | ');
    const m = right.trim().match(/^grep\s+(.+)/);
    if (m) {
      const lines = [];
      const mockOut = (s) => lines.push(s);
      const origOut = cliPrint;
      // Capture output: hack via array
      const captured = [];
      const captureFn = (s) => captured.push(s);
      // Just re-execute left and filter
      const parts2 = cliParseArgs(left.trim());
      _cliExecLinuxCapture(parts2[0], parts2.slice(1), left.trim(), captured);
      const pattern = m[1].replace(/"/g,'');
      const re = new RegExp(pattern, 'i');
      const result = captured.flatMap(s => s.replace(/<[^>]+>/g,'').split('\n'))
        .filter(l => re.test(l)).join('\n');
      out(result ? escHtml(result) : '');
      return;
    }
  }

  switch (cmd) {
    case 'ls': case 'dir': {
      const flags = args.filter(a => a.startsWith('-'));
      const pathArg = args.find(a => !a.startsWith('-'));
      const target = pathArg ? cliResolvePath(pathArg) : cliState.cwd;
      if (!cliExists(target)) { err(`ls: impossible d'accéder à '${pathArg}': Aucun fichier ou dossier de ce type`); break; }
      if (!cliIsDir(target)) { out(`<span class="cli-file">${escHtml(target.split('/').pop())}</span>`); break; }
      const entries = cliListDir(target);
      const long = flags.includes('-l') || flags.includes('-la') || flags.includes('-al');
      const all = flags.includes('-a') || flags.includes('-la') || flags.includes('-al');
      const names = entries.map(p => p.split('/').pop());
      if (long) {
        if (all) out(`<span class="cli-dir">.</span>  <span class="cli-dir">..</span>`);
        entries.forEach(p => {
          const name = p.split('/').pop();
          const isDir = cliIsDir(p);
          const perm = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          const size = isDir ? '4096' : String(fs[p]?.content?.length || 0).padStart(6);
          out(`${perm}  1 ${cliState.user} ${cliState.user} ${size} Jun  4 10:00 ${isDir?`<span class="cli-dir">${escHtml(name)}</span>`:`<span class="cli-file">${escHtml(name)}</span>`}`);
        });
      } else {
        const html = entries.map(p => {
          const name = p.split('/').pop();
          return cliIsDir(p) ? `<span class="cli-dir">${escHtml(name)}</span>` : `<span class="cli-file">${escHtml(name)}</span>`;
        }).join('  ');
        out(html || '');
      }
      break;
    }
    case 'pwd':
      out(escHtml(cliState.cwd));
      break;
    case 'cd': {
      const target = args[0] || '/home/tssr';
      const resolved = cliResolvePath(target);
      if (!cliExists(resolved)) { err(`bash: cd: ${target}: Aucun fichier ou dossier de ce type`); break; }
      if (!cliIsDir(resolved)) { err(`bash: cd: ${target}: N'est pas un dossier`); break; }
      cliState.cwd = resolved;
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      break;
    }
    case 'cat': {
      if (!args.length) { err('cat: opérande manquant'); break; }
      args.forEach(a => {
        const p = cliResolvePath(a);
        if (!cliExists(p)) { err(`cat: ${a}: Aucun fichier ou dossier de ce type`); }
        else if (cliIsDir(p)) { err(`cat: ${a}: Est un dossier`); }
        else out(`<span class="cli-output-text">${escHtml(fs[p].content||'')}</span>`);
      });
      break;
    }
    case 'mkdir': {
      if (!args.length) { err('mkdir: opérande manquant'); break; }
      const name = args[args.length-1];
      const p = cliResolvePath(name);
      if (cliExists(p)) { err(`mkdir: impossible de créer le répertoire '${name}': Le fichier existe`); break; }
      fs[p] = { type: 'dir' };
      break;
    }
    case 'touch': {
      if (!args.length) { err('touch: opérande manquant'); break; }
      args.forEach(a => {
        const p = cliResolvePath(a);
        if (!cliExists(p)) fs[p] = { type: 'file', content: '' };
      });
      break;
    }
    case 'rm': {
      if (!args.length) { err('rm: opérande manquant'); break; }
      const flags = args.filter(a => a.startsWith('-'));
      const files = args.filter(a => !a.startsWith('-'));
      files.forEach(a => {
        const p = cliResolvePath(a);
        if (!cliExists(p)) { err(`rm: impossible de supprimer '${a}': Aucun fichier ou dossier de ce type`); return; }
        if (cliIsDir(p) && !flags.includes('-r') && !flags.includes('-rf') && !flags.includes('-r')) {
          err(`rm: impossible de supprimer '${a}': Est un dossier (utiliser -r)`); return;
        }
        // Supprimer récursivement
        Object.keys(fs).filter(k => k === p || k.startsWith(p+'/')).forEach(k => delete fs[k]);
      });
      break;
    }
    case 'cp': {
      if (args.length < 2) { err('cp: opérande manquant'); break; }
      const src = cliResolvePath(args[args.length-2]);
      const dst = cliResolvePath(args[args.length-1]);
      if (!cliExists(src)) { err(`cp: ${args[args.length-2]}: Aucun fichier ou dossier de ce type`); break; }
      if (cliIsDir(src)) { err('cp: argument -r manquant pour copier un dossier'); break; }
      fs[dst] = { ...fs[src] };
      break;
    }
    case 'mv': {
      if (args.length < 2) { err('mv: opérande manquant'); break; }
      const src = cliResolvePath(args[0]);
      let dst = cliResolvePath(args[1]);
      if (!cliExists(src)) { err(`mv: ${args[0]}: Aucun fichier ou dossier de ce type`); break; }
      if (cliIsDir(dst)) dst = dst + '/' + src.split('/').pop();
      fs[dst] = { ...fs[src] };
      Object.keys(fs).filter(k => k === src || k.startsWith(src+'/')).forEach(k => delete fs[k]);
      break;
    }
    case 'echo': {
      // Détecter la redirection > ou >>
      const rawEcho = raw.slice(raw.indexOf('echo') + 4).trim();
      const appendMatch = rawEcho.match(/^(.+?)\s*>>\s*(.+)$/);
      const writeMatch = rawEcho.match(/^(.+?)\s*>\s*(.+)$/);
      const resolveText = (t) => t.replace(/^["']|["']$/g,'').replace(/\$(\w+)/g, (_, v) => cliState.env[v] || '');
      if (appendMatch) {
        const txt = resolveText(appendMatch[1]) + '\n';
        const p = cliResolvePath(appendMatch[2].trim());
        if (!cliIsDir(p)) {
          fs[p] = { type: 'file', content: (fs[p]?.content || '') + txt };
        }
      } else if (writeMatch) {
        const txt = resolveText(writeMatch[1]) + '\n';
        const p = cliResolvePath(writeMatch[2].trim());
        if (!cliIsDir(p)) {
          fs[p] = { type: 'file', content: txt };
        }
      } else {
        const text = args.join(' ').replace(/\$(\w+)/g, (_, v) => cliState.env[v] || '');
        out(escHtml(text));
      }
      break;
    }
    case 'grep': {
      if (args.length < 2) { err('usage: grep PATTERN FILE'); break; }
      const flags = args.filter(a => a.startsWith('-'));
      const nonFlags = args.filter(a => !a.startsWith('-'));
      const pattern = nonFlags[0];
      const fileArg = nonFlags[1];
      const p = cliResolvePath(fileArg);
      if (!cliExists(p)) { err(`grep: ${fileArg}: Aucun fichier ou dossier de ce type`); break; }
      if (cliIsDir(p)) { err(`grep: ${fileArg}: Est un dossier`); break; }
      const re = new RegExp(pattern, flags.includes('-i') ? 'i' : '');
      const lines = (fs[p].content||'').split('\n').filter(l => re.test(l));
      if (lines.length) out(escHtml(lines.join('\n')));
      break;
    }
    case 'ps': {
      out(`  PID TTY          TIME CMD
  1   ?        00:00:01 systemd
  2   ?        00:00:00 kthreadd
 420  ?        00:00:00 sshd
 842  pts/0    00:00:00 bash
 843  pts/0    00:00:00 ps`);
      break;
    }
    case 'ifconfig':
    case 'ip': {
      const exL = (s) => cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> ${s}</div>`);
      const fault = cliState.networkFault;
      // ip addr add  résout conflit IP
      if (cmd === 'ip' && args[0] === 'addr' && args[1] === 'add') {
        if (fault === 'conflict') {
          cliState.networkFault = null;
          out(`<span style="color:var(--accent)">Nouvelle adresse IP appliquée. Conflit résolu.</span>`);
        } else {
          out('');
        }
        break;
      }
      // ip route add default  résout mauvaise gateway
      if (cmd === 'ip' && args[0] === 'route' && args[1] === 'add' && args[2] === 'default') {
        if (fault === 'gateway') {
          cliState.networkFault = null;
          out(`<span style="color:var(--accent)">Route par défaut mise à jour. Passerelle correcte.</span>`);
        } else {
          out('');
        }
        break;
      }
      if (cmd === 'ifconfig' || args[0] === 'a' || args[0] === 'addr' || args[0] === 'address') {
        if (fault === 'dhcp' || fault === 'renew_needed') {
          out(`1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet <span style="color:var(--accent)">127.0.0.1/8</span> scope host lo
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc fq_codel state UP
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet <span style="color:var(--red)">169.254.47.18/16</span> brd 169.254.255.255 scope link dynamic eth0
       valid_lft 2591sec preferred_lft 2591sec`);
          cliPrint(`<div class="cli-explain-err"> <strong>169.254.x.x</strong> = adresse APIPA (Auto-IP RFC 3927). Le client DHCP n'a reçu aucune réponse. Causes : serveur DHCP éteint, câble débranché, mauvais VLAN. Corriger : <code>systemctl restart networking</code> puis <code>dhclient eth0</code>.</div>`);
        } else if (fault === 'conflict') {
          out(`1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet <span style="color:var(--accent)">127.0.0.1/8</span> scope host lo
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc fq_codel state UP
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet <span style="color:var(--accent)">192.168.1.10/24</span> brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86234sec preferred_lft 86234sec
    <span style="color:var(--red)">RTNETLINK answers: Duplicate address detected (192.168.1.10)</span>`);
          cliPrint(`<div class="cli-explain-err"> <strong>Duplicate address detected</strong> — Deux machines réclament 192.168.1.10. Vérifie <code>arp -n</code> pour identifier l'intrus. Solution : changer d'IP avec <code>ip addr add 192.168.1.21/24 dev eth0</code>.</div>`);
        } else {
          out(`1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet <span style="color:var(--accent)">127.0.0.1/8</span> scope host lo
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc fq_codel state UP
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet <span style="color:var(--accent)">192.168.1.10/24</span> brd 192.168.1.255 scope global dynamic eth0
       valid_lft 86234sec preferred_lft 86234sec`);
          exL('<strong>ip addr</strong> (ou <strong>ip a</strong>) liste toutes les interfaces réseau. <em>lo</em> = loopback 127.0.0.1 (trafic interne). <em>eth0</em> = carte Ethernet. Le /24 = masque 255.255.255.0 = réseau 192.168.1.0/24.');
        }
      } else if (args[0] === 'r' || args[0] === 'route') {
        if (fault === 'dhcp' || fault === 'renew_needed') {
          out(`192.168.1.0/24 dev eth0 proto kernel scope link src 169.254.47.18`);
          cliPrint(`<div class="cli-explain-err"> Pas de route <em>default</em> — sans passerelle par défaut, aucun trafic hors du LAN n'est possible. Le DHCP n'a pas fourni de route. Corriger : redémarrer le service réseau.</div>`);
        } else if (fault === 'gateway') {
          out(`<span style="color:var(--red)">default via 192.168.99.1</span> dev eth0 proto dhcp src 192.168.1.10 metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100`);
          cliPrint(`<div class="cli-explain-err"> <strong>Passerelle incorrecte : 192.168.99.1</strong> n'existe pas sur ce réseau (LAN = 192.168.1.0/24). Tout le trafic externe est blackholé. Corriger : <code>ip route del default && ip route add default via 192.168.1.1 dev eth0</code>.</div>`);
        } else {
          out(`default via 192.168.1.1 dev eth0 proto dhcp src 192.168.1.10 metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10 metric 100`);
          exL('<strong>ip route</strong> affiche la table de routage. <em>default via 192.168.1.1</em> = passerelle par défaut (trafic hors réseau local). <em>proto dhcp</em> = route obtenue automatiquement par DHCP.');
        }
      } else if (args[0] === 'link' || args[0] === 'l') {
        out(`1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 state UP
    link/ether <span style="color:var(--accent)">08:00:27:ab:cd:ef</span> brd ff:ff:ff:ff:ff:ff`);
        exL('<strong>ip link</strong> affiche les infos couche 2 (MAC, état). State UP = interface active. mtu 1500 = taille max d\'un paquet Ethernet. La MAC identifie physiquement la carte réseau.');
      } else if (args[0] === 'route' && args[1] === 'del') {
        out('');
      } else {
        out('ip : Utilisation : ip [a|addr] [r|route] [l|link]');
      }
      break;
    }
    case 'ping': {
      const host = args.find(a => !a.startsWith('-')) || 'localhost';
      const count = (() => { const i = args.indexOf('-c'); return i >= 0 ? parseInt(args[i+1])||4 : 4; })();
      const isLocal = host === 'localhost' || host === '127.0.0.1';
      const isLAN = /^192\.168\.1\./.test(host);
      const ip = isLocal ? '127.0.0.1' : host.match(/^\d/) ? host : '192.168.1.1';
      const fault = cliState.networkFault;
      if (!isLocal && (fault === 'dhcp' || fault === 'renew_needed')) {
        out(`ping: connect: Network is unreachable`);
        cliPrint(`<div class="cli-explain-err"> <strong>Network is unreachable</strong> — Pas d'adresse IP valide (APIPA active). Impossible d'envoyer des paquets. Corriger d'abord l'adresse IP via DHCP.</div>`);
        break;
      }
      if (!isLocal && fault === 'gateway' && !isLAN) {
        let lines = `PING ${host} (${ip}) 56(84) bytes of data.\n`;
        for (let i = 0; i < Math.min(count, 4); i++)
          lines += `From 192.168.1.10 icmp_seq=${i+1} Destination Net Unreachable\n`;
        lines += `\n--- ${host} ping statistics ---\n${Math.min(count,4)} packets transmitted, 0 received, +${Math.min(count,4)} errors, 100% packet loss`;
        out(escHtml(lines));
        cliPrint(`<div class="cli-explain-err"> <strong>100% packet loss</strong> — La passerelle 192.168.99.1 est injoignable (hors du réseau 192.168.1.0/24). Tout trafic externe échoue. Vérifie <code>ip route</code>.</div>`);
        break;
      }
      if (!isLocal && fault === 'conflict') {
        const n = Math.min(count, 4);
        let lines = `PING ${host} (${ip}) 56(84) bytes of data.`;
        let rx = 0;
        for (let i = 0; i < n; i++) {
          if (i % 2 === 0) { lines += `\n64 bytes from ${ip}: icmp_seq=${i+1} ttl=64 time=${(Math.random()*2+0.3).toFixed(3)} ms`; rx++; }
          else lines += `\nFrom ${ip} icmp_seq=${i+1} Destination Host Unreachable`;
        }
        lines += `\n\n--- ${host} ping statistics ---\n${n} packets transmitted, ${rx} received, ${Math.round((n-rx)/n*100)}% packet loss`;
        out(escHtml(lines));
        cliPrint(`<div class="cli-explain-err"> <strong>${Math.round((n-Math.ceil(n/2))/n*100)}% packet loss</strong> — Conflit d'adresse IP : trafic capté alternativement par deux machines. Vérifie <code>arp -n</code> pour identifier l'intrus.</div>`);
        break;
      }
      const ttl = isLocal ? 64 : host === '8.8.8.8' ? 118 : 64;
      let lines = `PING ${host} (${ip}) 56(84) bytes of data.`;
      for (let i = 0; i < Math.min(count, 4); i++)
        lines += `\n64 bytes from ${ip}: icmp_seq=${i+1} ttl=${ttl} time=${(Math.random()*2+0.3).toFixed(3)} ms`;
      lines += `\n\n--- ${host} ping statistics ---\n${Math.min(count,4)} packets transmitted, ${Math.min(count,4)} received, 0% packet loss`;
      out(escHtml(lines));
      cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> <strong>ping -c ${count}</strong> envoie des paquets ICMP Echo Request. Mesure la latence (RTT). TTL=${ttl} = sauts max avant rejet (décrémenté à chaque routeur). 0% packet loss = OK. Si perte  problème de liaison ou de routage.</div>`);
      break;
    }
    case 'netstat': {
      out(`Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:3306          0.0.0.0:*               LISTEN
tcp6       0      0 :::22                   :::*                    LISTEN
udp        0      0 0.0.0.0:68              0.0.0.0:*`);
      cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> <strong>netstat</strong> liste les connexions et ports en écoute. LISTEN = service attendant des connexions. 127.0.0.1:3306 = MySQL accessible en local uniquement (sécurité). Remplacé par <code>ss</code> sur les systèmes modernes.</div>`);
      break;
    }
    case 'ss': {
      out(`Netid  State   Recv-Q Send-Q  Local Address:Port    Peer Address:Port  Process
tcp    LISTEN  0      128     0.0.0.0:22           0.0.0.0:*      users:(("sshd",pid=712,fd=3))
tcp    LISTEN  0      128     0.0.0.0:80           0.0.0.0:*      users:(("apache2",pid=1021,fd=4))
tcp    LISTEN  0      70      127.0.0.1:3306       0.0.0.0:*      users:(("mysqld",pid=876,fd=22))
tcp    ESTAB   0      0       192.168.1.10:22      192.168.1.5:51234`);
      cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> <strong>ss -tulnp</strong> — -t=TCP, -u=UDP, -l=LISTEN, -n=numérique, -p=processus. Identifie quel programme occupe chaque port. ESTAB = session active en cours. Plus rapide que netstat.</div>`);
      break;
    }
    case 'nslookup': {
      const domain = args[0] || 'localhost';
      const ip = domain.includes('tssr') ? '192.168.1.10' : domain === 'localhost' ? '127.0.0.1' : '142.250.74.100';
      out(`Server:         192.168.1.10\nAddress:        192.168.1.10#53\n\nName:   ${domain}\nAddress: ${ip}`);
      cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> <strong>nslookup</strong> interroge le serveur DNS (192.168.1.10, port 53) pour résoudre un nom en IP. Si la résolution échoue  vérifie /etc/resolv.conf et que le service DNS répond sur port 53/UDP.</div>`);
      break;
    }
    case 'dig': {
      const domain = args[0] || 'localhost';
      const ip = domain.includes('tssr') ? '192.168.1.10' : '142.250.74.100';
      out(`; &lt;&lt;&gt;&gt; DiG 9.18.1 &lt;&lt;&gt;&gt; ${domain}
;; QUESTION SECTION:
;${domain}.                    IN      A
;; ANSWER SECTION:
${domain}.              300     IN      A       ${ip}
;; Query time: 2 msec
;; SERVER: 192.168.1.10#53(192.168.1.10)`);
      cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> <strong>dig</strong> est l\'outil DNS avancé. Affiche le type d\'enregistrement (A=IPv4, AAAA=IPv6, MX=mail, CNAME=alias), le TTL cache et le serveur ayant répondu. Indispensable pour déboguer DNS.</div>`);
      break;
    }
    case 'traceroute':
    case 'tracepath': {
      const dest = args[0] || '8.8.8.8';
      const faultTr = cliState.networkFault;
      if (faultTr === 'dhcp' || faultTr === 'renew_needed') {
        out(`traceroute: connect: Network is unreachable`);
        cliPrint(`<div class="cli-explain-err"> Pas d'adresse IP valide — traceroute ne peut pas envoyer de paquets. Corriger le DHCP d'abord.</div>`);
        break;
      }
      if (faultTr === 'gateway') {
        out(`traceroute to ${dest} (${dest}), 30 hops max, 60 byte packets
 1  <span style="color:var(--red)">192.168.99.1</span> (192.168.99.1)  * * *
 2  * * *
 3  * * *
 4  * * *`);
        cliPrint(`<div class="cli-explain-err"> Bloqué au <strong>hop 1</strong> sur 192.168.99.1 — la passerelle configurée n'est pas joignable. Tous les paquets sont blackholés dès la sortie du LAN. Corriger la route par défaut.</div>`);
        break;
      }
      out(`traceroute to ${dest} (${dest}), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)  0.456 ms  0.412 ms  0.389 ms
 2  10.0.0.1 (10.0.0.1)  3.201 ms  3.145 ms  3.092 ms
 3  72.14.192.45 (72.14.192.45)  8.734 ms  8.691 ms  8.612 ms
 4  ${dest} (${dest})  10.234 ms  10.187 ms  10.104 ms`);
      cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> <strong>traceroute</strong> affiche chaque routeur traversé (hop) avec sa latence. <em>* * *</em> = paquet bloqué par un pare-feu. Utile pour localiser où une connexion échoue sur le chemin réseau.</div>`);
      break;
    }
    case 'arp': {
      if (cliState.networkFault === 'conflict') {
        out(`Address                  HWtype  HWaddress           Flags Mask  Iface
192.168.1.1              ether   c8:d3:a3:2f:7e:01   C           eth0
192.168.1.5              ether   b8:27:eb:12:34:56   C           eth0
192.168.1.10             ether   08:00:27:ab:cd:ef   C           eth0
<span style="color:var(--red)">192.168.1.10             ether   b8:27:eb:99:88:77   C           eth0   MAC étrangère !</span>`);
        cliPrint(`<div class="cli-explain-err"> <strong>Double entrée MAC pour 192.168.1.10</strong> — une autre machine (b8:27:eb:99:88:77) revendique la même IP. Le trafic est capté alternativement par les deux hôtes. Solution : changer d'IP avec <code>ip addr add 192.168.1.21/24 dev eth0</code>.</div>`);
      } else if (cliState.networkFault === 'gateway') {
        out(`Address                  HWtype  HWaddress           Flags Mask  Iface
192.168.1.5              ether   b8:27:eb:12:34:56   C           eth0`);
        cliPrint(`<div class="cli-explain-err"> Pas d'entrée pour <strong>192.168.99.1</strong> — la passerelle configurée n'est pas sur ce LAN (192.168.1.0/24). ARP ne trouve aucune MAC correspondante  trafic impossible vers l'extérieur.</div>`);
      } else {
        out(`Address                  HWtype  HWaddress           Flags Mask  Iface
192.168.1.1              ether   c8:d3:a3:2f:7e:01   C           eth0
192.168.1.5              ether   b8:27:eb:12:34:56   C           eth0`);
        cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> <strong>arp -n</strong> affiche la table ARP : correspondances IPMAC sur le LAN. ARP (Couche 2/3) résout les adresses IP en adresses MAC pour la communication Ethernet. C = entrée dynamique apprise automatiquement.</div>`);
      }
      break;
    }
    case 'dhclient': {
      const iface = args.find(a => !a.startsWith('-')) || 'eth0';
      if (cliState.networkFault === 'renew_needed') {
        out(`DHCPDISCOVER on ${iface} to 255.255.255.255 port 67
DHCPOFFER from 192.168.1.1
DHCPREQUEST for 192.168.1.10 on ${iface} to 255.255.255.255 port 67
<span style="color:var(--accent)">DHCPACK from 192.168.1.1 — bound to 192.168.1.10 — renewal in 43200 seconds.</span>`);
        cliState.networkFault = null;
        cliPrint(`<div class="cli-explain"> <strong>dhclient</strong> force un échange DORA (DiscoverOfferRequestAck) pour obtenir/renouveler un bail DHCP. L'IP 192.168.1.10 a été réattribuée avec succès.</div>`);
      } else if (cliState.networkFault === 'dhcp') {
        out(`DHCPDISCOVER on ${iface} to 255.255.255.255 port 67
<span style="color:var(--red)">DHCPDISCOVER on ${iface} to 255.255.255.255 port 67 interval 4
DHCPDISCOVER on ${iface} to 255.255.255.255 port 67 interval 8
No DHCPOFFERS received — timeout.</span>`);
        cliPrint(`<div class="cli-explain-err"> Le serveur DHCP ne répond pas. Redémarre d'abord le service réseau : <code>systemctl restart networking</code>.</div>`);
      } else {
        out(`DHCPREQUEST for 192.168.1.10 on ${iface}
<span style="color:var(--accent)">DHCPACK from 192.168.1.1 — bail renouvelé (43200 sec).</span>`);
        cliPrint(`<div class="cli-explain"> <strong>dhclient</strong> a renouvelé le bail DHCP. Aucune modification d'IP nécessaire.</div>`);
      }
      break;
    }
    case 'journalctl': {
      const fault = cliState.networkFault;
      if (fault === 'dhcp' || fault === 'renew_needed') {
        out(`<span style="color:var(--red)">Jun 07 09:12:01 debian-srv dhclient[312]: DHCPDISCOVER on eth0 to 255.255.255.255 port 67
Jun 07 09:12:05 debian-srv dhclient[312]: No DHCPOFFERS received — timeout
Jun 07 09:12:09 debian-srv dhclient[312]: DHCPDISCOVER on eth0 to 255.255.255.255 port 67
Jun 07 09:12:13 debian-srv dhclient[312]: No DHCPOFFERS received — timeout
Jun 07 09:12:17 debian-srv dhclient[312]: No working leases in persistent database — sleeping</span>
Jun 07 09:12:17 debian-srv kernel: eth0: link-local IPv4 address 169.254.47.18 assigned`);
        cliPrint(`<div class="cli-explain-err"> Les logs confirment : <strong>aucun serveur DHCP ne répond</strong> (timeouts répétés). Adresse APIPA 169.254.47.18 assignée en dernier recours.</div>`);
      } else if (fault === 'conflict') {
        out(`<span style="color:var(--red)">Jun 07 09:45:32 debian-srv kernel: eth0: IPv4 duplicate address 192.168.1.10 detected!
Jun 07 09:45:32 debian-srv kernel: eth0: ARP reply from b8:27:eb:99:88:77 for 192.168.1.10
Jun 07 09:45:34 debian-srv kernel: eth0: duplicate address 192.168.1.10 conflicts with local</span>
Jun 07 09:45:35 debian-srv dhclient[312]: DHCPACK from 192.168.1.1 for 192.168.1.10
Jun 07 09:45:35 debian-srv kernel: eth0: ARP probe: conflict detected with b8:27:eb:99:88:77`);
        cliPrint(`<div class="cli-explain-err"> Le kernel a détecté un <strong>conflit ARP</strong> : la MAC b8:27:eb:99:88:77 répond aussi pour 192.168.1.10. Changer d'adresse IP est la solution immédiate.</div>`);
      } else if (fault === 'gateway') {
        out(`Jun 07 09:30:01 debian-srv dhclient[312]: DHCPACK from 192.168.1.1
Jun 07 09:30:01 debian-srv dhclient[312]: bound to 192.168.1.10
<span style="color:var(--red)">Jun 07 09:30:05 debian-srv kernel: eth0: default route via 192.168.99.1 — host unreachable
Jun 07 09:30:22 debian-srv dhclient[312]: route add default gw 192.168.99.1 failed: Network unreachable</span>`);
        cliPrint(`<div class="cli-explain-err"> Route par défaut vers <strong>192.168.99.1</strong> en échec — pas de réponse ARP pour cette adresse. Corriger manuellement avec <code>ip route add default via 192.168.1.1</code>.</div>`);
      } else {
        out(`Jun 07 10:00:01 debian-srv systemd[1]: Starting network service...
Jun 07 10:00:01 debian-srv dhclient[312]: DHCPACK from 192.168.1.1
Jun 07 10:00:01 debian-srv dhclient[312]: bound to 192.168.1.10 — renewal in 43200 seconds
Jun 07 10:00:02 debian-srv sshd[420]: Server listening on 0.0.0.0 port 22`);
        cliPrint(`<div class="cli-explain"> <strong>journalctl</strong> affiche les logs systemd. Flags utiles : <code>-u networking</code> (service spécifique), <code>-f</code> (suivi temps réel), <code>--since "1 hour ago"</code> (filtrage temporel).</div>`);
      }
      break;
    }
    case 'chmod': {
      if (args.length < 2) { err('chmod: opérande manquant'); break; }
      const p = cliResolvePath(args[args.length-1]);
      if (!cliExists(p)) { err(`chmod: ${args[args.length-1]}: Aucun fichier ou dossier de ce type`); break; }
      // Simule silencieusement
      break;
    }
    case 'chown': {
      if (args.length < 2) { err('chown: opérande manquant'); break; }
      const p = cliResolvePath(args[args.length-1]);
      if (!cliExists(p)) { err(`chown: ${args[args.length-1]}: Aucun fichier ou dossier de ce type`); break; }
      break;
    }
    case 'sudo': {
      if (!args.length) { err('usage: sudo commande'); break; }
      const subcmd = args[0];
      if (subcmd === 'su' || subcmd === '-s') {
        out(`[sudo] mot de passe de ${cliState.user} :`);
        cliState.user = 'root'; cliState.cwd = '/root';
        if (!cliState.fs['/root']) cliState.fs['/root'] = { type: 'dir' };
        document.getElementById('cli-prompt').innerHTML = cliPrompt();
        out('<span style="color:var(--red)">root@debian-srv:~#</span> — Mode root activé');
        break;
      }
      // Exécute la sous-commande avec privilèges simulés
      const prevUser = cliState.user;
      cliState.user = 'root';
      cliExecLinux(subcmd, args.slice(1), args.join(' '));
      cliState.user = prevUser;
      break;
    }
    case 'systemctl': {
      const action = args[0];
      const service = args[1] || '';
      if (!action) { err('systemctl : action manquante'); break; }
      const validServices = ['ssh','sshd','apache2','nginx','mysql','networking','cron','rsyslog'];
      if (['start','stop','restart','reload','enable','disable'].includes(action)) {
        if (!service) { err(`systemctl ${action}: nom de service manquant`); break; }
        if (!validServices.includes(service)) { err(`Échec de l'unité ${service}.service : non trouvée.`); break; }
        if (service === 'networking' && (action === 'start' || action === 'restart') && cliState.networkFault === 'dhcp') {
          cliState.networkFault = 'renew_needed';
          out(` networking.service — redémarré
<span style="color:var(--accent)">Service réseau relancé. Lance maintenant : dhclient eth0</span>`);
          break;
        }
        out(` ${service}.service — ${action === 'start' ? 'démarré' : action === 'stop' ? 'arrêté' : action}`);
      } else if (action === 'status') {
        const svc = service || 'ssh';
        if (svc === 'networking' && (cliState.networkFault === 'dhcp' || cliState.networkFault === 'renew_needed')) {
          out(` networking.service - Raise network interfaces
   Loaded: loaded (/lib/systemd/system/networking.service; enabled)
   Active: <span style="color:var(--red)">failed (Result: exit-code)</span> since Jun 07 09:12:17 CEST
  Process: ExecStart=/sbin/ifup -a (code=exited, status=1/FAILURE)
<span style="color:var(--red)">Jun 07 09:12:17 debian-srv ifup[312]: dhclient: No DHCPOFFERS received</span>`);
          cliPrint(`<div class="cli-explain-err"> Le service networking est en <strong>failed</strong> — le client DHCP n'a reçu aucune offre. Relancer : <code>systemctl restart networking</code>.</div>`);
        } else {
          out(` ${svc}.service - OpenBSD Secure Shell server
   Loaded: loaded (/lib/systemd/system/${svc}.service; enabled)
   Active: <span style="color:var(--accent)">active (running)</span> since Thu 2025-06-04 10:00:00 CEST
  Process: 420 ExecStart=/usr/sbin/sshd -D
 Main PID: 420 (sshd)
    Tasks: 1 (limit: 4915)
   Memory: 5.2M`);
        }
      } else if (action === 'list-units') {
        out(`UNIT                    LOAD   ACTIVE SUB     DESCRIPTION
ssh.service             loaded active running OpenBSD Secure Shell
apache2.service         loaded active running The Apache HTTP Server
cron.service            loaded active running Regular background daemon
networking.service      loaded active exited  Raise network interfaces`);
      } else {
        err(`systemctl: commande inconnue '${action}'`);
      }
      break;
    }
    case 'uname':
      if (args.includes('-a')) out('Linux debian-srv 5.10.0-19-amd64 #1 SMP Debian 5.10.149 x86_64 GNU/Linux');
      else if (args.includes('-r')) out('5.10.0-19-amd64');
      else out('Linux');
      break;
    case 'whoami':
      out(cliState.user);
      break;
    case 'hostname':
      out(cliState.host);
      break;
    case 'history': {
      const h = cliState.history.slice().reverse();
      if (!h.length) break;
      out(h.map((c,i) => `  ${String(i+1).padStart(3)}  ${escHtml(c)}`).join('\n'));
      break;
    }
    case 'man': {
      const pages = {
        ls: 'ls - lister le contenu d\'un répertoire\nSYNTAX: ls [-la] [chemin]',
        cd: 'cd - changer de répertoire\nSYNTAX: cd [chemin]',
        cat: 'cat - afficher le contenu d\'un fichier\nSYNTAX: cat fichier...',
        chmod: 'chmod - modifier les permissions\nSYNTAX: chmod [ugoa][+-=][rwx] fichier\nEx: chmod 755 script.sh',
        grep: 'grep - recherche dans du texte\nSYNTAX: grep [-i] PATTERN fichier',
        systemctl: 'systemctl - contrôle systemd\nSYNTAX: systemctl [start|stop|restart|status|enable|disable] service',
        ping: 'ping - tester la connectivité réseau\nSYNTAX: ping [-c count] hôte',
        ip: 'ip - afficher/modifier interfaces\nSYNTAX: ip [addr|route|link]',
      };
      const page = args[0];
      if (!page) { err('Quelle page de manuel souhaitez-vous ?'); break; }
      if (pages[page]) out(`<span style="color:var(--accent)">${escHtml(page.toUpperCase())}(1)</span>\n\n${escHtml(pages[page])}\n`);
      else err(`Aucune entrée de manuel pour ${page}`);
      break;
    }
    case 'vim': case 'vi': case 'nano': {
      const filename = args[0] || 'nouveau.txt';
      const filepath = cliResolvePath(filename);
      const existingContent = cliState.fs[filepath]?.content || '';
      const displayName = filename;
      // Scroll output
      const outEl = document.getElementById('cli-output');
      if (outEl) outEl.style.overflow = 'hidden';
      VIM.mount(displayName, existingContent,
        (name, newContent) => {
          // onSave
          cliState.fs[filepath] = { type: 'file', content: newContent };
          cliPrint(`<span style="color:var(--accent)">"${name}" sauvegardé (${newContent.split('\n').length} lignes)</span>`);
        },
        (saved) => {
          // onQuit
          if (outEl) outEl.style.overflow = '';
          if (!saved) cliPrint(`Retour au shell (${cmd === 'nano' ? 'nano' : 'vim'} fermé)`);
          const inp = document.getElementById('cli-input');
          if (inp) { inp.disabled = false; inp.focus(); }
        }
      );
      const inp = document.getElementById('cli-input');
      if (inp) inp.disabled = true;
      break;
    }
    case 'tp': {
      handleTPCommand(args, 'linux');
      break;
    }
    case 'clear':
      cliClear();
      break;
    case 'help':
      out(`<span style="color:var(--accent)">Commandes disponibles :</span>
<span style="color:var(--text2)">Navigation :</span>  ls [-la]  cd  pwd
<span style="color:var(--text2)">Fichiers :</span>    cat  mkdir  touch  rm [-r]  cp  mv  chmod  chown
<span style="color:var(--text2)">Texte :</span>       echo  grep [-i]  vim  nano
<span style="color:var(--text2)">Processus :</span>   ps  systemctl [start|stop|status|list-units]  sudo
<span style="color:var(--text2)">Réseau :</span>      <span style="color:var(--accent)">ip [a|r|l]</span>  <span style="color:var(--accent)">ping -c N host</span>  <span style="color:var(--accent)">netstat</span>  <span style="color:var(--accent)">ss -tulnp</span>
             <span style="color:var(--accent)">nslookup</span>  <span style="color:var(--accent)">dig</span>  <span style="color:var(--accent)">traceroute</span>  <span style="color:var(--accent)">arp -n</span>  <span style="color:var(--accent)">dhclient</span>  <span style="color:var(--accent)">journalctl</span>
<span style="color:var(--text2)">Système :</span>     whoami  hostname  uname [-a]
<span style="color:var(--text2)">Divers :</span>      history  clear  help  <span style="color:var(--accent)">tp</span> TP guidés
<span style="color:var(--text3)">/ historique · Tab autocomplétion · Ctrl+L effacer · Ctrl+C annuler</span>`);
      break;
    default:
      err(`bash: ${escHtml(cmd)}: commande introuvable`);
  }
}

// Capture pour pipe (version simplifiée sans effets de bord)
function _cliExecLinuxCapture(cmd, args, raw, captured) {
  const origPrint = window._cliCaptureBuf;
  window._cliCaptureBuf = captured;
  const prevPrint = HTMLElement.prototype; // noop
  // On détourne cliPrint temporairement
  const orig = window.cliPrint;
  window.cliPrint = (s) => captured.push(s.replace(/<[^>]+>/g,''));
  cliExecLinux(cmd, args, raw);
  window.cliPrint = orig;
}

// ============================================================
// ===== WINDOWS COMMANDS =====================================
// ============================================================
function cliExecWindows(cmd, args, raw) {
  const fs = cliState.fs;
  const out  = (s) => cliPrint(s);
  const err  = (s) => cliPrint(`<span class="cli-err">${escHtml(s)}</span>`);
  const explain  = (s) => cliPrint(`<div class="cli-explain"> <strong>Rôle :</strong> ${s}</div>`);
  const errEx = (msg, why) => { err(msg); cliPrint(`<div class="cli-explain-err"> <strong>Pourquoi :</strong> ${escHtml(why)}</div>`); };
  const sep = '\\';

  // Alias courants
  const aliases = { 'ls': 'get-childitem', 'dir': 'get-childitem', 'cd': 'set-location', 'pwd': 'get-location', 'cat': 'get-content', 'rm': 'remove-item', 'cp': 'copy-item', 'mv': 'move-item', 'mkdir': 'new-item', 'cls': 'clear-host', 'ps': 'get-process', 'kill': 'stop-process', 'echo': 'write-output' };
  const resolved = aliases[cmd] || cmd;

  switch (resolved) {
    case 'get-childitem': case 'gci': {
      const pathArg = args.find(a => !a.startsWith('-'));
      const target = pathArg ? cliResolvePath(pathArg) : cliState.cwd;
      if (!cliExists(target)) { err(`Get-ChildItem : Chemin introuvable '${pathArg||cliState.cwd}'.`); break; }
      const entries = cliListDir(target);
      if (!entries.length) { out(''); break; }
      out(`\n    Répertoire : ${escHtml(target)}\n`);
      out(`Mode                LastWriteTime         Length Name`);
      out(`----                -------------         ------ ----`);
      entries.forEach(p => {
        const name = p.split(sep).pop();
        const isDir = cliIsDir(p);
        const mode = isDir ? 'd----' : '-a---';
        const size = isDir ? '' : String(fs[p]?.content?.length||0).padStart(8);
        out(`${mode}        04/06/2025    10:00    ${size} ${isDir?`<span class="cli-dir">${escHtml(name)}</span>`:`<span class="cli-file">${escHtml(name)}</span>`}`);
      });
      break;
    }
    case 'set-location': case 'sl': {
      const target = args[0] || 'C:\\Users\\Administrateur';
      const resolved2 = cliResolvePath(target);
      if (!cliExists(resolved2)) { err(`Set-Location : Chemin introuvable '${target}'.`); break; }
      if (!cliIsDir(resolved2)) { err(`Set-Location : Chemin n'est pas un répertoire.`); break; }
      cliState.cwd = resolved2;
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      break;
    }
    case 'get-location': case 'gl':
      out(`\nPath\n----\n${escHtml(cliState.cwd)}\n`);
      break;
    case 'get-content': case 'gc': {
      const flags = args.filter(a => a.startsWith('-'));
      const files = args.filter(a => !a.startsWith('-'));
      if (!files.length) { err('Get-Content : Paramètre -Path requis.'); break; }
      files.forEach(a => {
        const p = cliResolvePath(a);
        if (!cliExists(p)) { err(`Get-Content : Chemin introuvable '${a}'.`); return; }
        if (cliIsDir(p)) { err(`Get-Content : Accès refusé à '${a}'.`); return; }
        out(`<span class="cli-output-text">${escHtml(fs[p].content||'')}</span>`);
      });
      break;
    }
    case 'new-item': case 'ni': {
      const nameFlag = args.indexOf('-name');
      const typeFlag = args.indexOf('-itemtype');
      const name = nameFlag >= 0 ? args[nameFlag+1] : args.find(a => !a.startsWith('-'));
      const type = typeFlag >= 0 ? args[typeFlag+1].toLowerCase() : 'file';
      if (!name) { err('New-Item : Paramètre -Name requis.'); break; }
      const p = cliResolvePath(name);
      if (cliExists(p)) { err(`New-Item : Un élément existe déjà à '${name}'.`); break; }
      fs[p] = type === 'directory' ? { type: 'dir' } : { type: 'file', content: '' };
      out(`\n    Répertoire : ${escHtml(cliState.cwd)}\n\nMode  Name\n----  ----\n${type==='directory'?'d----':'-----'} ${escHtml(name)}`);
      break;
    }
    case 'remove-item': case 'ri': {
      const files = args.filter(a => !a.startsWith('-'));
      if (!files.length) { err('Remove-Item : Paramètre -Path requis.'); break; }
      files.forEach(a => {
        const p = cliResolvePath(a);
        if (!cliExists(p)) { err(`Remove-Item : Chemin introuvable '${a}'.`); return; }
        Object.keys(fs).filter(k => k === p || k.startsWith(p+sep)).forEach(k => delete fs[k]);
      });
      break;
    }
    case 'copy-item': case 'ci': {
      if (args.length < 2) { err('Copy-Item : Paramètres -Path et -Destination requis.'); break; }
      const src = cliResolvePath(args[0]);
      const dst = cliResolvePath(args[1]);
      if (!cliExists(src)) { err(`Copy-Item : Chemin introuvable '${args[0]}'.`); break; }
      fs[dst] = { ...fs[src] };
      break;
    }
    case 'move-item': case 'mi': {
      if (args.length < 2) { err('Move-Item : Paramètres requis.'); break; }
      const src = cliResolvePath(args[0]);
      let dst = cliResolvePath(args[1]);
      if (!cliExists(src)) { err(`Move-Item : Chemin introuvable '${args[0]}'.`); break; }
      if (cliIsDir(dst)) dst = dst + sep + src.split(sep).pop();
      fs[dst] = { ...fs[src] };
      Object.keys(fs).filter(k => k === src || k.startsWith(src+sep)).forEach(k => delete fs[k]);
      break;
    }
    case 'write-output': case 'write-host': case 'echo': {
      const text = args.join(' ').replace(/\$env:(\w+)/g, (_,v) => cliState.env[v]||'').replace(/\$(\w+)/g, (_,v) => cliState.env[v]||v);
      out(escHtml(text));
      break;
    }
    case 'select-string': {
      const patternIdx = args.indexOf('-pattern');
      const pathIdx = args.indexOf('-path');
      if (patternIdx < 0 || pathIdx < 0) { err('Select-String : Paramètres -Pattern et -Path requis.'); break; }
      const pattern = args[patternIdx+1];
      const fileArg = args[pathIdx+1];
      const p = cliResolvePath(fileArg);
      if (!cliExists(p)) { err(`Select-String : Chemin introuvable '${fileArg}'.`); break; }
      const re = new RegExp(pattern, 'i');
      const lines = (fs[p].content||'').split('\n').filter(l=>re.test(l));
      lines.forEach((l,i) => out(`${escHtml(p)}:${i+1}:${escHtml(l)}`));
      break;
    }
    case 'get-process': case 'gps': {
      const filter = args.find(a => !a.startsWith('-'));
      const processes = [
        { name:'System', id:4, cpu:'0.00', mem:'256K' },
        { name:'svchost', id:824, cpu:'0.10', mem:'12MB' },
        { name:'lsass', id:700, cpu:'0.05', mem:'8MB' },
        { name:'explorer', id:1234, cpu:'0.20', mem:'45MB' },
        { name:'powershell', id:2048, cpu:'0.15', mem:'30MB' },
        { name:'sshd', id:1800, cpu:'0.00', mem:'4MB' },
      ];
      const filtered = filter ? processes.filter(p=>p.name.toLowerCase().includes(filter.toLowerCase())) : processes;
      out(`\nHandles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id  SI ProcessName`);
      out(`-------  ------    -----      -----     ------     --  -- -----------`);
      filtered.forEach(p => out(`    ---      --    ---        ---       ${p.cpu}   ${String(p.id).padStart(5)}   1 <span class="cli-file">${escHtml(p.name)}</span>`));
      break;
    }
    case 'stop-process': {
      const idFlag = args.indexOf('-id');
      const nameFlag = args.indexOf('-name');
      if (idFlag < 0 && nameFlag < 0) { err('Stop-Process : Paramètre -Id ou -Name requis.'); break; }
      out('');
      break;
    }
    case 'get-service': case 'gsv': {
      const dhcpStatus = cliState.networkFault === 'dhcp' ? 'Stopped' : 'Running';
      const services = [
        { status:'Running',     name:'sshd',   display:'OpenSSH Server' },
        { status:'Running',     name:'W32Time', display:'Windows Time' },
        { status:'Stopped',     name:'WinRM',   display:'Windows Remote Management' },
        { status:'Running',     name:'Spooler', display:'Print Spooler' },
        { status:'Running',     name:'ADWS',    display:'Active Directory Web Services' },
        { status:'Running',     name:'DNS',     display:'DNS Server' },
        { status:'Running',     name:'NTDS',    display:'Active Directory Domain Services' },
        { status:dhcpStatus,    name:'dhcp',    display:'DHCP Client' },
        { status:'Stopped',     name:'W3SVC',   display:'World Wide Web Publishing' },
      ];
      const filter = args.find(a=>!a.startsWith('-'));
      const filtered = filter ? services.filter(s=>s.name.toLowerCase().includes(filter.toLowerCase())||s.display.toLowerCase().includes(filter.toLowerCase())) : services;
      out(`\nStatus   Name               DisplayName`);
      out(`------   ----               -----------`);
      filtered.forEach(s => out(`<span style="color:${s.status==='Running'?'var(--accent)':'var(--red)'}">${s.status.padEnd(8)}</span> ${s.name.padEnd(18)} ${escHtml(s.display)}`));
      explain(`<strong>Get-Service</strong> liste l'état des services Windows. <em>Running</em> = actif, <em>Stopped</em> = arrêté. Le service <strong>dhcp</strong> (DHCP Client) gère l'obtention automatique d'adresse IP — s'il est arrêté, Windows bascule en APIPA (169.254.x.x).`);
      break;
    }
    case 'start-service': case 'sasv': {
      const name = args.find(a=>!a.startsWith('-'));
      if (!name) { err('Start-Service : Paramètre -Name requis.'); break; }
      if (name.toLowerCase() === 'dhcp' && cliState.networkFault === 'dhcp') {
        cliState.networkFault = 'renew_needed';
        out(`Service 'dhcp' démarré.`);
        explain('<strong>Start-Service dhcp</strong> redémarre le service DHCP Client. Le service est maintenant actif mais n\'a pas encore demandé d\'adresse IP. Il faut exécuter <strong>ipconfig /renew</strong> pour déclencher une nouvelle demande DHCP (DORA).');
        break;
      }
      out(`Service '${escHtml(name)}' démarré.`);
      explain(`<strong>Start-Service</strong> démarre un service Windows arrêté. Le Service Control Manager (SCM) envoie un signal START au service concerné.`);
      break;
    }
    case 'stop-service': case 'spsv': {
      const name = args.find(a=>!a.startsWith('-'));
      if (!name) { err('Stop-Service : Paramètre -Name requis.'); break; }
      out(`Service '${escHtml(name)}' arrêté.`);
      break;
    }
    case 'ipconfig': {
      const subOpt = (args[0]||'').toLowerCase();
      if (subOpt === '/renew') {
        if (cliState.networkFault === 'dhcp') {
          errEx('Impossible de contacter le serveur DHCP.', 'Le service DHCP Client est arrêté. Redémarre-le d\'abord avec Start-Service dhcp.');
          break;
        }
        if (cliState.networkFault === 'renew_needed') {
          cliState.networkFault = null;
          out(`\nCarte Ethernet Ethernet :
   Adresse IPv4. . . . . . . . . . . .: <span style="color:var(--blue)">192.168.1.20</span>
   Masque de sous-réseau . . . . . . .: 255.255.255.0
   Passerelle par défaut . . . . . . .: 192.168.1.1
   Serveur DHCP . . . . . . . . . . . : 192.168.1.1
   Bail obtenu le. . . . . . . . . . .: ${new Date().toLocaleString('fr-FR')}`);
          explain('<strong>ipconfig /renew</strong> demande un nouveau bail DHCP. Le client envoie un DHCPRENEW (ou DISCOVER si pas de bail) au serveur DHCP qui répond avec une adresse IP, masque, passerelle et serveurs DNS pour la durée du bail configurée.');
          break;
        }
        out(`\nCarte Ethernet Ethernet — bail renouvelé.`);
        explain('<strong>ipconfig /renew</strong> renouvelle le bail DHCP auprès du serveur DHCP.');
        break;
      }
      if (subOpt === '/release') {
        out(`\nCarte Ethernet Ethernet — adresse IP libérée.`);
        explain('<strong>ipconfig /release</strong> libère le bail DHCP actuel. L\'interface perd son IP immédiatement. Utilise /renew après pour en obtenir une nouvelle.');
        break;
      }
      if (subOpt === '/flushdns') {
        out('Cache de résolution DNS vidé avec succès.');
        explain('<strong>ipconfig /flushdns</strong> vide le cache DNS local. Utile quand un enregistrement DNS a changé mais que Windows renvoie encore l\'ancienne IP depuis son cache. Le TTL du cache peut aller jusqu\'à 24h par défaut.');
        break;
      }
      const all = subOpt === '/all';
      out(`\nConfiguration IP de Windows\n`);
      if (cliState.networkFault === 'dhcp') {
        if (all) out(`   Nom de l'hôte. . . . . . . . . . . : ${cliState.host}\n   Suffixe DNS principal  . . . . . . :\n   Routage IP activé. . . . . . . . . : Non`);
        out(`Carte Ethernet Ethernet :
   Adresse de configuration automatique IPv4 . : <span style="color:var(--red)">169.254.47.18</span>
   Masque de sous-réseau . . . . . . .: 255.255.0.0
   Passerelle par défaut . . . . . . .:`);
        explain(' Adresse <strong>APIPA</strong> (169.254.x.x) détectée. Windows s\'est auto-attribué cette adresse car il n\'a pas pu joindre le serveur DHCP. Cela signifie que le service <strong>DHCP Client</strong> est peut-être arrêté, ou que le serveur DHCP est inaccessible.');
        break;
      }
      if (cliState.networkFault === 'gateway') {
        if (all) out(`   Nom de l'hôte. . . . . . . . . . . : ${cliState.host}\n   Suffixe DNS principal  . . . . . . : tssr.local\n   Routage IP activé. . . . . . . . . : Non`);
        out(`Carte Ethernet Ethernet :
   Adresse IPv4. . . . . . . . . . . .: <span style="color:var(--blue)">192.168.1.20</span>
   Masque de sous-réseau . . . . . . .: 255.255.255.0
   Passerelle par défaut . . . . . . .: <span style="color:var(--red)">192.168.99.1</span>`);
        if (all) out(`   Serveur DHCP . . . . . . . . . . . : (statique)\n   Serveurs DNS. . . . . . . . . . . .: 192.168.1.20`);
        explain(' La <strong>passerelle par défaut 192.168.99.1</strong> n\'appartient pas au réseau local (192.168.1.0/24). Tout le trafic sortant (Internet, autres sous-réseaux) est envoyé vers une gateway inexistante et sera perdu. Le réseau local /24 reste accessible car il ne passe pas par la gateway.');
        break;
      }
      if (cliState.networkFault === 'conflict') {
        if (all) out(`   Nom de l'hôte. . . . . . . . . . . : ${cliState.host}\n   Suffixe DNS principal  . . . . . . : tssr.local\n   Routage IP activé. . . . . . . . . : Non`);
        out(`Carte Ethernet Ethernet :
   Adresse IPv4. . . . . . . . . . . .: <span style="color:var(--blue)">192.168.1.20</span>
   Masque de sous-réseau . . . . . . .: 255.255.255.0
   Passerelle par défaut . . . . . . .: 192.168.1.1`);
        if (all) out(`   Serveur DHCP . . . . . . . . . . . : 192.168.1.1\n   Serveurs DNS. . . . . . . . . . . .: 192.168.1.20`);
        out(`\n<span style="color:var(--red)">Windows a détecté un conflit d\'adresse IP avec un autre ordinateur du réseau et a désactivé l\'adresse IPv4 192.168.1.20 sur l\'adaptateur Ethernet.</span>`);
        explain(' <strong>Conflit d\'adresse IP</strong> : une autre machine du réseau utilise également 192.168.1.20. Windows a détecté un ARP Gratuit en provenance d\'une autre adresse MAC avec la même IP. La connectivité est intermittente car les trames Ethernet arrivent aléatoirement sur l\'une ou l\'autre machine.');
        break;
      }
      if (all) {
        out(`   Nom de l'hôte. . . . . . . . . . . : ${cliState.host}
   Suffixe DNS principal  . . . . . . : tssr.local
   Type de nÃÂud . . . . . . . . . . . : Hybride
   Routage IP activé. . . . . . . . . : Non`);
      }
      out(`Carte Ethernet Ethernet :
   Adresse IPv4. . . . . . . . . . . .: <span style="color:var(--blue)">192.168.1.20</span>
   Masque de sous-réseau . . . . . . .: 255.255.255.0
   Passerelle par défaut . . . . . . .: 192.168.1.1`);
      if (all) out(`   Serveur DHCP . . . . . . . . . . . : 192.168.1.1
   Serveurs DNS. . . . . . . . . . . .: 192.168.1.20
   Bail obtenu . . . . . . . . . . . .: ${new Date().toLocaleDateString('fr-FR', {weekday:'long', day:'numeric', month:'long', year:'numeric'})}`);
      explain(`<strong>ipconfig</strong> affiche la configuration IP. <strong>/all</strong> ajoute la MAC, DHCP, DNS et la date du bail. 169.254.x.x = APIPA (pas de DHCP). Équivalent de <code>ip addr</code> sur Linux.`);
      break;
    }
    case 'ping': {
      const host = args.find(a=>!a.startsWith('-')&&!a.startsWith('/')) || 'localhost';
      const isLoopback = host === 'localhost' || host === '127.0.0.1';
      const ip = isLoopback ? '127.0.0.1' : host.match(/^\d/) ? host : '192.168.1.1';
      const ttl = host === '8.8.8.8' ? 118 : 128;
      const isLocal = ip.startsWith('192.168.1.');
      if (cliState.networkFault === 'dhcp' && !isLoopback) {
        out(`\nPing de ${host} [${ip}] avec 32 octets de données :`);
        for (let i=0;i<4;i++) out(`Délai d\'attente de la demande dépassé.`);
        out(`\nStatistiques du Ping pour ${ip} :\n    Paquets : Envoyés = 4, Reçus = 0, Perdus = 4 (perte 100%)`);
        explain(`<strong>Délai d\'attente dépassé</strong> : pas d\'IP valide (APIPA), le trafic ne peut pas être routé. Résous d\'abord le problème DHCP.`);
        break;
      }
      if (cliState.networkFault === 'gateway' && !isLoopback && !isLocal) {
        out(`\nPing de ${host} [${ip}] avec 32 octets de données :`);
        for (let i=0;i<4;i++) out(`Délai d\'attente de la demande dépassé.`);
        out(`\nStatistiques du Ping pour ${ip} :\n    Paquets : Envoyés = 4, Reçus = 0, Perdus = 4 (perte 100%)`);
        explain(`<strong>Timeout vers ${host}</strong> : cette adresse est hors du réseau local, elle doit passer par la gateway (192.168.99.1). Comme cette gateway n\'existe pas sur le réseau 192.168.1.0/24, les paquets sont perdus. Le réseau local (192.168.1.x) fonctionne car il ne passe pas par la gateway.`);
        break;
      }
      if (cliState.networkFault === 'conflict' && !isLoopback) {
        out(`\nPing de ${host} [${ip}] avec 32 octets de données :`);
        out(`Réponse de ${ip} : octets=32 durée=1ms TTL=128`);
        out(`Délai d\'attente de la demande dépassé.`);
        out(`Réponse de ${ip} : octets=32 durée=47ms TTL=64`);
        out(`Délai d\'attente de la demande dépassé.`);
        out(`\nStatistiques du Ping pour ${ip} :\n    Paquets : Envoyés = 4, Reçus = 2, Perdus = 2 (perte 50%)`);
        explain(`<strong>50% de perte et TTL incohérents</strong> (TTL=128 puis TTL=64) : signature classique d\'un <strong>conflit d\'adresse IP</strong>. Les paquets arrivent alternativement sur notre machine (TTL=128, Windows) et sur la machine en conflit (TTL=64, probablement Linux). Les réponses perdues correspondent aux paquets capturés par l\'autre machine.`);
        break;
      }
      out(`\nPing de ${host} [${ip}] avec 32 octets de données :`);
      for (let i=0;i<4;i++) out(`Réponse de ${ip} : octets=32 durée=${Math.round(Math.random()*3+1)}ms TTL=${ttl}`);
      out(`\nStatistiques du Ping pour ${ip} :\n    Paquets : Envoyés = 4, Reçus = 4, Perdus = 0 (perte 0%)`);
      explain(`<strong>ping</strong> teste la connectivité ICMP. TTL=${ttl} décrémenté à chaque routeur (Windows part de 128, Linux de 64). 0% perte = liaison OK. Timeout = hôte inaccessible ou ICMP filtré par pare-feu.`);
      break;
    }
    case 'nslookup': {
      const domain = args[0] || 'tssr.local';
      const ip = domain.includes('tssr') || domain.includes('local') ? '192.168.1.20' : domain === '8.8.8.8' ? '8.8.8.8' : '142.250.74.100';
      if (cliState.networkFault) {
        out(`Serveur :  Inconnu\nAddress:  192.168.1.20\n\n*** SRV-TSSR ne peut pas trouver ${domain} : Server failed`);
        explain('Échec DNS : la carte réseau n\'a pas d\'IP valide (APIPA), les requêtes DNS ne peuvent pas atteindre le serveur. Résous d\'abord le problème réseau (DHCP).');
        break;
      }
      out(`Serveur :   ${cliState.host}\nAddress:    192.168.1.20\n\nNom :   ${domain}\nAddress: ${ip}`);
      explain(`<strong>nslookup</strong> interroge le serveur DNS (192.168.1.20) pour résoudre un nom en IP. Si le DNS échoue  vérifie /flushdns, le service DNS Server et l'enregistrement A dans le serveur DNS.`);
      break;
    }
    case 'tracert': {
      const dest = args[0] || '8.8.8.8';
      if (cliState.networkFault === 'gateway') {
        out(`\nDétermination de l\'itinéraire vers ${dest}\navec un maximum de 30 sauts :\n
  1     *        *        *     Délai d\'attente de la demande dépassé.
  2     *        *        *     Délai d\'attente de la demande dépassé.
  3     *        *        *     Délai d\'attente de la demande dépassé.

Itinéraire terminé.`);
        explain(`<strong>tracert bloqué dès le hop 1</strong> : le premier routeur devrait être la gateway (192.168.99.1) mais elle n\'existe pas sur ce réseau. Tous les paquets vers l\'extérieur sont envoyés vers une adresse ARP non résolue  perdus immédiatement. C\'est la signature d\'une <strong>mauvaise gateway</strong>.`);
        break;
      }
      out(`\nDétermination de l\'itinéraire vers ${dest}\navec un maximum de 30 sauts :\n
  1    &lt;1 ms    &lt;1 ms    &lt;1 ms  192.168.1.1
  2    3 ms    3 ms    3 ms  10.0.0.1
  3    8 ms    8 ms    8 ms  72.14.192.45
  4   10 ms   10 ms   10 ms  ${dest}

Itinéraire terminé.`);
      explain(`<strong>tracert</strong> affiche chaque routeur (hop) jusqu\'à la destination. <em>* * *</em> = routeur bloquant ICMP (pare-feu). Le hop 1 = ta gateway locale. Si le hop 1 est déjà en timeout  problème de gateway ou de couche réseau local.`);
      break;
    }
    case 'arp': {
      if (cliState.networkFault === 'gateway') {
        out(`\nInterface : 192.168.1.20 --- 0x2
  Adresse Internet      Adresse physique      Type
  192.168.1.1           c8-d3-a3-2f-7e-01     dynamique
  192.168.1.255         ff-ff-ff-ff-ff-ff     statique`);
        explain(`<strong>arp -a</strong> : 192.168.99.1 (la gateway configurée) est <strong>absente</strong> de la table ARP — la machine n\'a jamais pu la résoudre en MAC car elle n\'existe pas sur ce réseau. Preuve que la gateway est injoignable au niveau couche 2.`);
        break;
      }
      if (cliState.networkFault === 'conflict') {
        out(`\nInterface : 192.168.1.20 --- 0x2
  Adresse Internet      Adresse physique      Type
  192.168.1.1           c8-d3-a3-2f-7e-01     dynamique
  <span style="color:var(--red)">192.168.1.20          b8-27-eb-99-88-77     dynamique   &lt;-- MAC inconnue !</span>
  192.168.1.5           b8-27-eb-12-34-56     dynamique
  192.168.1.255         ff-ff-ff-ff-ff-ff     statique`);
        explain(` <strong>MAC étrangère sur 192.168.1.20</strong> : notre propre IP est associée à la MAC <em>b8-27-eb-99-88-77</em> (différente de notre carte 08-00-27-ab-cd-ef). Cela signifie qu\'une autre machine a répondu à un <strong>ARP Gratuit</strong> pour 192.168.1.20, écrasant notre entrée dans la table ARP des autres hôtes. C\'est la preuve irréfutable d\'un <strong>conflit d\'adresse IP</strong>.`);
        break;
      }
      out(`\nInterface : 192.168.1.20 --- 0x2
  Adresse Internet      Adresse physique      Type
  192.168.1.1           c8-d3-a3-2f-7e-01     dynamique
  192.168.1.5           b8-27-eb-12-34-56     dynamique
  192.168.1.255         ff-ff-ff-ff-ff-ff     statique`);
      explain(`<strong>arp -a</strong> affiche la table ARP : correspondances IPMAC connues. La gateway (192.168.1.1) doit toujours être présente. Une MAC inconnue sur une IP connue  conflit ou ARP spoofing.`);
      break;
    }
    case 'route': {
      const sub = (args[0]||'').toLowerCase();
      if (sub === 'print' || sub === '') {
        const gw = cliState.networkFault === 'gateway' ? '192.168.99.1' : '192.168.1.1';
        out(`\n===========================================================================
Interface List
 2...08 00 27 ab cd ef ......Ethernet
 1...........................Software Loopback Interface 1
===========================================================================

IPv4 Route Table
===========================================================================
Active Routes:
Network Destination        Netmask          Gateway       Interface  Metric
          0.0.0.0          0.0.0.0    <span style="color:${cliState.networkFault==='gateway'?'var(--red)':'inherit'}">${gw}</span>   192.168.1.20     25
        127.0.0.0        255.0.0.0        On-link         127.0.0.1    331
        127.0.0.1  255.255.255.255        On-link         127.0.0.1    331
      192.168.1.0    255.255.255.0        On-link    192.168.1.20     281
     192.168.1.20  255.255.255.255        On-link    192.168.1.20     281
===========================================================================`);
        explain(`<strong>route print</strong> affiche la table de routage complète. La ligne <em>0.0.0.0</em> = route par défaut (trafic vers tout ce qui ne correspond pas à une route spécifique). La <strong>gateway</strong> de cette route est le premier routeur que le système contacte pour sortir du réseau local.`);
      } else { err(`route ${escHtml(args[0]||'')} : sous-commande inconnue. Utilise : route print`); }
      break;
    }
    case 'get-netroute': {
      const gw = cliState.networkFault === 'gateway' ? '192.168.99.1' : '192.168.1.1';
      out(`\nifIndex DestinationPrefix          NextHop       RouteMetric ifMetric PolicyStore
------- -----------------          -------       ----------- -------- -----------
2       0.0.0.0/0                  ${gw}      0           25       ActiveStore
1       127.0.0.0/8                0.0.0.0       256         75       ActiveStore
2       192.168.1.0/24             0.0.0.0       0           25       ActiveStore`);
      explain(`<strong>Get-NetRoute</strong> (PowerShell) est l\'équivalent de <code>route print</code>. La route <em>0.0.0.0/0</em> = route par défaut. NextHop = gateway. Si la gateway est dans un sous-réseau différent du réseau local, les paquets ne pourront pas y être acheminés.`);
      break;
    }
    case 'netsh': {
      const subA = (args[0]||'').toLowerCase();
      const subB = (args[1]||'').toLowerCase();
      const subC = (args[2]||'').toLowerCase();
      if (subA === 'interface' && subB === 'ip' && subC === 'set') {
        if (cliState.networkFault) { cliState.networkFault = null; }
        const newGw = args.find(a => /^192\.\d+\.\d+\.\d+$/.test(a) && a !== '192.168.1.20' && a !== '192.168.1.21' && a !== '255.255.255.0') || '192.168.1.1';
        out(`\nOK.`);
        explain(`<strong>netsh interface ip set address</strong> configure une adresse IP statique sur une interface réseau. Paramètres : interface, adresse IP, masque, passerelle par défaut. La nouvelle gateway (${newGw}) appartient au réseau 192.168.1.0/24  accessible par ARP  le routage peut reprendre normalement.`);
      } else if (subA === 'interface' && subB === 'ip' && subC === 'set' && args[3] === 'dns') {
        out(`\nOK.`);
        explain(`<strong>netsh interface ip set dns</strong> configure le serveur DNS d\'une interface. Utile quand la résolution de noms échoue malgré une connectivité réseau normale.`);
      } else if (subA === 'wlan') {
        out(`Pas d\'adaptateur Wi-Fi détecté sur ce serveur.`);
      } else {
        out(`\nOK.`);
        explain(`<strong>netsh</strong> (Network Shell) est l\'outil CLI de configuration réseau Windows. Il permet de gérer les interfaces, routes, règles de pare-feu, et bien plus. Remplacé progressivement par les cmdlets PowerShell <code>Set-NetIPAddress</code>, <code>New-NetRoute</code>...`);
      }
      break;
    }
    case 'netstat': {
      out(`\nConnexions TCP actives\n
  Proto  Adresse locale         Adresse distante       État
  TCP    0.0.0.0:22             0.0.0.0:0              LISTENING
  TCP    0.0.0.0:80             0.0.0.0:0              LISTENING
  TCP    0.0.0.0:445            0.0.0.0:0              LISTENING
  TCP    0.0.0.0:3389           0.0.0.0:0              LISTENING
  TCP    192.168.1.20:50234     192.168.1.1:443        ESTABLISHED`);
      explain(`<strong>netstat -an</strong> liste les connexions TCP actives et les ports en écoute. LISTENING = service prêt à accepter des connexions. ESTABLISHED = session en cours. 3389 = RDP (Bureau à distance), 445 = SMB (partage fichiers).`);
      break;
    }
    case 'whoami':
      out(`${cliState.host}\\${cliState.user}`);
      break;
    case 'hostname':
      out(cliState.host);
      break;
    case 'get-computerinfo': case 'gcim': {
      out(`WindowsProductName  : Windows Server 2022 Standard
OsArchitecture      : 64 bits
CsName              : ${cliState.host}
WindowsVersion      : 10.0.20348
OsUptime            : 0 days 02:45:00
LogonServer         : \\\\${cliState.host}`);
      break;
    }
    case 'get-aduser': case 'get-adcomputer': case 'get-adgroup': {
      out(`<span style="color:var(--amber)">Avertissement : Module ActiveDirectory non chargé. Simulation.</span>\n`);
      if (args.includes('-filter') && args.includes('*')) {
        out(`DistinguishedName : CN=Administrateur,CN=Users,DC=tssr,DC=local
Enabled           : True
GivenName         : Administrateur
Name              : Administrateur
SamAccountName    : Administrateur
UserPrincipalName : admin@tssr.local\n
DistinguishedName : CN=Stagiaire1,CN=Users,DC=tssr,DC=local
Enabled           : True
GivenName         : Jean
Name              : Stagiaire1
SamAccountName    : Stagiaire1
UserPrincipalName : stagiaire1@tssr.local`);
      } else {
        out(`Aucun résultat ou filtre requis. Utiliser -Filter * pour tout afficher.`);
      }
      break;
    }
    case 'test-connection': {
      const host = args.find(a=>!a.startsWith('-'))||'localhost';
      out(`\nSource        Destination     IPV4Address      Bytes    Time(ms)
------        -----------     -----------      -----    --------
${cliState.host.padEnd(14)}${host.padEnd(16)}192.168.1.1      32       ${Math.round(Math.random()*3+1)}`);
      break;
    }
    case 'get-winevent':
    case 'get-eventlog': {
      out(`<span style="color:var(--amber)">Attention : Get-EventLog est obsolète. Utilisez Get-WinEvent.\n</span>`);
      if (cliState.networkFault === 'conflict') {
        out(`   Index Time          EntryType   Source                    InstanceID Message
   ----- ----          ---------   ------                    ---------- -------
<span style="color:var(--red)">    1027 Jun 07 14:32  Error       Tcpip                          4199 Windows a détecté un conflit d\'adresse IP avec l\'ordinateur disposant de l\'adresse MAC b8-27-eb-99-88-77. Adresse IPv4 192.168.1.20 désactivée temporairement.</span>
    1026 Jun 07 14:31  Warning     Tcpip                          4198 Windows a détecté que l\'adresse IP 192.168.1.20 est déjà utilisée sur le réseau.
    1025 Jun 07 14:00  Information Service Control Manager         7036 Le service sshd est entré dans l\'état En cours d\'exécution.
    1024 Jun 07 13:55  Information Security-Auditing               4624 Ouverture de session réussie.`);
        explain(`<strong>Event ID 4199</strong> (Tcpip) : conflit d\'adresse IP confirmé par le journal système. Windows logue l\'adresse MAC de la machine conflictuelle (<em>b8-27-eb-99-88-77</em>). Ce log est déclenché quand Windows reçoit un <strong>ARP Gratuit</strong> d\'une MAC différente pour sa propre IP.`);
      } else {
        out(`   Index Time          EntryType   Source                    InstanceID Message
   ----- ----          ---------   ------                    ---------- -------
    1024 Jun 07 10:00  Information Service Control Manager         7036 Le service sshd est entré...
    1023 Jun 07 09:55  Information Security-Auditing               4624 Ouverture de session réussie.`);
        explain(`<strong>Get-WinEvent / Get-EventLog</strong> consulte les journaux d\'événements Windows. Les Event ID importants en réseau : <strong>4199</strong> = conflit IP, <strong>4198</strong> = avertissement conflit, <strong>7036</strong> = changement d\'état d\'un service. Utilise <code>-LogName System</code> pour filtrer les événements système.`);
      }
      break;
    }
    //  DISKPART 
    case 'diskpart': {
      cliState.diskpartMode = true;
      cliState.dpSel = { disk: null, partition: null };
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      out(`\nMicrosoft DiskPart version 10.0.20348\n\nCopyright (C) Microsoft Corporation.\nSur l'ordinateur : ${cliState.host}\n`);
      explain('diskpart est l\'utilitaire CLI de gestion des disques. Il fonctionne en mode interactif : tu sélectionnes un objet (disk/partition) puis tu lui appliques des actions. Tape <strong>list disk</strong> pour commencer.');
      break;
    }

    //  NET USER / LOCALGROUP 
    case 'net': {
      const sub = (args[0]||'').toLowerCase();
      if (sub === 'user') {
        const users = cliState.localUsers;
        if (!args[1]) {
          out(`\nComptes d'utilisateurs de \\\\${cliState.host}\n\n` + users.map(u => u.name).join('  ') + `\n\nLa commande s'est terminée correctement.`);
          explain('net user sans argument liste tous les comptes locaux stockés dans la base SAM (Security Accounts Manager).');
          break;
        }
        const username = args[1];
        const delFlag  = args.includes('/delete');
        const addFlag  = args.includes('/add');
        const password = args[2] && !args[2].startsWith('/') ? args[2] : null;
        if (addFlag) {
          if (!password) { errEx('Erreur système 87 — Le paramètre est incorrect.', 'Un mot de passe est obligatoire lors de la création d\'un compte. Syntaxe : net user <nom> <mdp> /add'); break; }
          if (users.find(u => u.name.toLowerCase() === username.toLowerCase())) { errEx(`Erreur système 2224 — Le compte d'utilisateur existe déjà.`, `Le nom "${username}" est déjà utilisé dans la base SAM. Choisis un nom différent.`); break; }
          users.push({ name: username, active: true, groups: ['Utilisateurs'] });
          const expire  = args.includes('/expires:never')    ? 'Jamais'  : 'Non défini';
          const pwdchg  = args.includes('/passwordchg:no')   ? 'Non'     : 'Oui';
          out(`La commande s'est terminée correctement.`);
          explain(`<strong>net user ${escHtml(username)} ${escHtml(password)} /add</strong> crée un compte local dans la base SAM avec le mot de passe fourni. L'utilisateur peut ensuite se connecter localement. Expiration : ${expire} · Changement mdp : ${pwdchg}`);
        } else if (delFlag) {
          const idx = users.findIndex(u => u.name.toLowerCase() === username.toLowerCase());
          if (idx < 0) { errEx(`Erreur système 2221 — Le nom de compte d'utilisateur est introuvable.`, `L'utilisateur "${username}" n'existe pas dans la base SAM. Vérifie l'orthographe avec net user.`); break; }
          users.splice(idx, 1);
          out(`La commande s'est terminée correctement.`);
          explain(`<strong>net user ${escHtml(username)} /delete</strong> supprime définitivement le compte de la SAM. Ses données de profil restent sur disque dans C:\\Users\\${escHtml(username)} jusqu'à suppression manuelle.`);
        } else {
          const u = users.find(x => x.name.toLowerCase() === username.toLowerCase());
          if (!u) { errEx(`Erreur système 2221 — Compte introuvable.`, `"${username}" n'existe pas. Tape net user pour lister les comptes existants.`); break; }
          out(`Nom d'utilisateur             ${u.name}\nActif                         ${u.active?'Oui':'Non'}\nGroupes locaux membres         ${u.groups.join(', ')||'Aucun'}\n\nLa commande s'est terminée correctement.`);
        }
      } else if (sub === 'localgroup') {
        const groups = cliState.localGroups;
        const users  = cliState.localUsers;
        if (!args[1]) {
          out(`\nAliases pour \\\\${cliState.host}\n\n` + groups.map(g=>g.name).join('\n') + `\n\nLa commande s'est terminée correctement.`);
          explain('net localgroup liste les groupes locaux. Les groupes servent à attribuer des droits à plusieurs utilisateurs d\'un coup sans les gérer individuellement.');
          break;
        }
        const grpName = args[1];
        const addFlag  = args.includes('/add');
        const delFlag  = args.includes('/delete');
        const member   = args[2] && !args[2].startsWith('/') ? args[2] : null;
        if (member && addFlag) {
          const grp = groups.find(g=>g.name.toLowerCase()===grpName.toLowerCase());
          if (!grp) { errEx(`Erreur système 2220 — Le groupe local est introuvable.`, `"${grpName}" n'existe pas. Crée-le d'abord avec net localgroup ${grpName} /add`); break; }
          const usr = users.find(u=>u.name.toLowerCase()===member.toLowerCase());
          if (!usr) { errEx(`Erreur système 2221 — Compte introuvable.`, `L'utilisateur "${member}" n'existe pas. Crée-le avec net user ${member} <mdp> /add`); break; }
          if (!grp.members.includes(member)) { grp.members.push(member); usr.groups.push(grpName); }
          out(`La commande s'est terminée correctement.`);
          explain(`<strong>net localgroup ${escHtml(grpName)} ${escHtml(member)} /add</strong> place l'utilisateur dans le groupe. Il hérite immédiatement de tous les droits associés au groupe, sans redémarrage de session requis pour les droits locaux.`);
        } else if (member && delFlag) {
          const grp = groups.find(g=>g.name.toLowerCase()===grpName.toLowerCase());
          if (!grp) { errEx(`Groupe introuvable.`, `"${grpName}" n'existe pas dans la SAM.`); break; }
          grp.members = grp.members.filter(m=>m.toLowerCase()!==member.toLowerCase());
          out(`La commande s'est terminée correctement.`);
          explain(`<strong>net localgroup ${escHtml(grpName)} ${escHtml(member)} /delete</strong> retire l'utilisateur du groupe. Il perd immédiatement les droits accordés par ce groupe.`);
        } else if (addFlag) {
          if (groups.find(g=>g.name.toLowerCase()===grpName.toLowerCase())) { errEx(`Erreur système 2223 — Le groupe existe déjà.`, `Un groupe "${grpName}" est déjà présent. Utilise un autre nom.`); break; }
          groups.push({ name: grpName, members: [] });
          out(`La commande s'est terminée correctement.`);
          explain(`<strong>net localgroup ${escHtml(grpName)} /add</strong> crée un nouveau groupe local vide dans la SAM. Un groupe vide n'a aucun effet tant qu'on n'y affecte pas d'utilisateurs et de droits.`);
        } else {
          const grp = groups.find(g=>g.name.toLowerCase()===grpName.toLowerCase());
          if (!grp) { errEx(`Groupe introuvable.`, `"${grpName}" n'existe pas.`); break; }
          out(`Alias     ${grp.name}\nMembres\n\n${grp.members.join('\n')||'(aucun)'}\n\nLa commande s'est terminée correctement.`);
        }
      } else {
        errEx(`net ${escHtml(args[0]||'')} : sous-commande non reconnue.`, 'Les sous-commandes net disponibles ici sont : user, localgroup.');
      }
      break;
    }

    //  ICACLS 
    case 'icacls': {
      const path = args[0];
      if (!path) { errEx('icacls : argument manquant.', 'icacls attend un chemin en premier argument. Ex : icacls "C:\\Shares\\Direction"'); break; }
      const resolved = cliResolvePath(path);
      const inhIdx   = args.indexOf('/inheritance');
      const grantIdx = args.indexOf('/grant:r');
      const rmIdx    = args.indexOf('/remove');
      if (inhIdx >= 0) {
        const mode = args[inhIdx + 1];
        if (mode === 'd') {
          cliState.acls[resolved] = cliState.acls[resolved]?.replace('Héritage actif — ', '') || 'Héritage rompu — aucune ACE explicite';
          out(`1 fichier(s) traité(s) avec succès ; 0 fichier(s) non traité(s)`);
          explain(`<strong>icacls "${escHtml(path)}" /inheritance:d</strong> rompt l'héritage des ACL du dossier parent. Les ACE héritées sont converties en ACE explicites. Sans cette étape, toute modification de dossier parent écrase tes droits.`);
        } else if (mode === 'e') {
          out(`1 fichier(s) traité(s) avec succès ; 0 fichier(s) non traité(s)`);
          explain(`<strong>/inheritance:e</strong> réactive l'héritage — le dossier reçoit à nouveau automatiquement les droits du parent.`);
        } else {
          errEx(`icacls : option /inheritance invalide.`, 'Les valeurs valides sont :d (disable/rompre) et :e (enable/réactiver).');
        }
      } else if (grantIdx >= 0) {
        const rule = args[grantIdx + 1];
        if (!rule) { errEx('icacls : argument manquant après /grant:r.', 'Syntaxe : /grant:r "Groupe":(OI)(CI)(F|M|RX|R|W)'); break; }
        if (!cliExists(resolved)) { errEx(`icacls : chemin "${path}" introuvable.`, 'Vérifie que le dossier existe. Crée-le avec New-Item -ItemType Directory si nécessaire.'); break; }
        const prev = cliState.acls[resolved] || '';
        cliState.acls[resolved] = prev + (prev ? '\r\n' : '') + rule;
        const permMatch = rule.match(/\(([^)]+)\)(?:\([^)]+\))*$/);
        const permCode  = permMatch ? permMatch[1] : '?';
        const permNames = { F:'Contrôle total', M:'Modification', RX:'Lecture+Exécution', R:'Lecture seule', W:'Écriture' };
        out(`1 fichier(s) traité(s) avec succès ; 0 fichier(s) non traité(s)`);
        explain(`<strong>icacls /grant:r</strong> attribue une ACE (Access Control Entry) explicite. <strong>/grant:r</strong> remplace une ACE existante pour ce principal (contrairement à /grant qui cumule). Droit accordé : <strong>${permNames[permCode]||permCode}</strong>. (OI) = héritage aux fichiers enfants, (CI) = héritage aux sous-dossiers.`);
      } else if (rmIdx >= 0) {
        const user = args[rmIdx + 1];
        if (!user) { errEx('icacls : argument manquant après /remove.', 'Syntaxe : icacls <chemin> /remove <Utilisateur>'); break; }
        if (cliState.acls[resolved]) {
          cliState.acls[resolved] = cliState.acls[resolved].split('\r\n').filter(l=>!l.startsWith(user)).join('\r\n');
        }
        out(`1 fichier(s) traité(s) avec succès ; 0 fichier(s) non traité(s)`);
        explain(`<strong>/remove</strong> supprime toutes les ACE (accordées et refusées) pour l'utilisateur ou groupe spécifié. L'accès devient celui défini par les autres ACE ou par l'héritage.`);
      } else {
        const acl = cliState.acls[resolved];
        if (!cliExists(resolved)) { errEx(`icacls : "${path}" introuvable.`, 'Le chemin n\'existe pas dans le filesystem virtuel.'); break; }
        out(`${escHtml(resolved)}\n${acl ? escHtml(acl) : '(aucune ACE explicite — héritage actif)'}\n\n1 fichier(s) traité(s) avec succès ; 0 fichier(s) non traité(s)`);
        explain(`<strong>icacls sans option</strong> affiche les ACL (listes de contrôle d\'accès) actuelles du chemin. Chaque ligne est une ACE : Principal : (flags)(Droit). F=Full, M=Modify, RX=Read+Execute.`);
      }
      break;
    }

    //  MANAGE-BDE (BitLocker) 
    case 'manage-bde': {
      const bdeCmd = (args[0]||'').toLowerCase();
      const drive  = args[1] || 'C:';
      if (bdeCmd === '-on') {
        cliState.bitlocker[drive] = 'Chiffrement en cours';
        const hasRecovery = args.includes('-RecoveryPassword') || args.includes('-recoverypassword');
        if (hasRecovery) out(`\n${drive}: ACTIVÉ — Clé de récupération numérique :\n48DIGITS: 123456-789012-345678-901234-567890-123456-789012-345678`);
        else out(`\n${drive}: ACTIVÉ`);
        cliState.bitlocker[drive] = 'Protection activée (AES 128)';
        explain(`<strong>manage-bde -on ${escHtml(drive)}</strong> active BitLocker sur le volume. BitLocker chiffre intégralement le disque via AES. Si le disque est volé, les données sont illisibles sans la clé. <strong>-RecoveryPassword</strong> génère une clé de récupération de 48 chiffres à conserver en lieu sûr ou dans AD.`);
      } else if (bdeCmd === '-status') {
        const st = cliState.bitlocker[drive] || 'Protection désactivée';
        out(`\nVolume ${drive} [${cliState.host}]\nStatut BitLocker\n----------------\nTaille du volume :       119 Go\nVersion BitLocker :      2.0\nStatut chiffrement :     ${st}\nPourcentage chiffré :    ${st.includes('activée')?'100%':'0%'}\nMéthode chiffrement :    AES 128\n`);
        explain(`<strong>manage-bde -status</strong> interroge l\'état BitLocker du volume. Utile pour vérifier si le chiffrement est complet avant de déconnecter un disque ou de l\'envoyer en réparation.`);
      } else if (bdeCmd === '-off') {
        cliState.bitlocker[drive] = 'Protection désactivée';
        out(`\nDéchiffrement de ${drive} en cours...`);
        explain(`<strong>manage-bde -off</strong> désactive BitLocker et déchiffre le volume. L'opération est irréversible sans réactivation manuelle. Les données redeviennent lisibles sans authentification.`);
      } else {
        errEx(`manage-bde : option "${bdeCmd}" inconnue.`, 'Options disponibles : -on <lecteur> [-RecoveryPassword], -off <lecteur>, -status [lecteur]');
      }
      break;
    }

    //  FIREWALL 
    case 'new-netfirewallrule': {
      const nameIdx    = args.findIndex(a=>a.toLowerCase()==='-name');
      const displayIdx = args.findIndex(a=>a.toLowerCase()==='-displayname');
      const portIdx    = args.findIndex(a=>a.toLowerCase()==='-localport');
      const protoIdx   = args.findIndex(a=>a.toLowerCase()==='-protocol');
      const dirIdx     = args.findIndex(a=>a.toLowerCase()==='-direction');
      const actionIdx  = args.findIndex(a=>a.toLowerCase()==='-action');
      if (nameIdx < 0) { errEx('New-NetFirewallRule : -Name est requis.', 'Sans nom unique, la règle ne peut pas être identifiée ni supprimée plus tard. Ex : -Name "Allow_SSH"'); break; }
      const rule = {
        name:    args[nameIdx+1]    || 'Nouvelle_Regle',
        display: args[displayIdx+1] || args[nameIdx+1] || 'Nouvelle règle',
        dir:     args[dirIdx+1]     || 'Inbound',
        proto:   args[protoIdx+1]   || 'TCP',
        port:    args[portIdx+1]    || '*',
        action:  args[actionIdx+1]  || 'Allow',
        profile: 'Any',
      };
      cliState.fwRules.push(rule);
      out(`\nName                  : ${rule.name}\nDisplayName           : ${rule.display}\nDescription           :\nDirection             : ${rule.dir}\nAction                : ${rule.action}\nEnabled               : True\nProfile               : ${rule.profile}\nProtocol              : ${rule.proto}\nLocalPort             : ${rule.port}\n`);
      explain(`<strong>New-NetFirewallRule</strong> crée une règle dans le pare-feu Windows Defender. <strong>Inbound</strong> = trafic entrant (connexions reçues), <strong>Outbound</strong> = sortant. Le profil restreint la règle : <em>Domain</em> (réseau d'entreprise), <em>Private</em> (réseau domestique), <em>Public</em>. Sans profil correct, la règle peut ne pas s'appliquer selon l'emplacement réseau.`);
      break;
    }
    case 'get-netfirewallrule': {
      out(`\nName          Direction  Action  Proto  Port   DisplayName`);
      out(`----          ---------  ------  -----  ----   -----------`);
      cliState.fwRules.forEach(r => out(`${r.name.padEnd(14)}${r.dir.padEnd(11)}${r.action.padEnd(8)}${r.proto.padEnd(7)}${r.port.padEnd(7)}${r.display}`));
      explain(`<strong>Get-NetFirewallRule</strong> liste les règles de pare-feu actives. Permet d'auditer les ports ouverts et de vérifier qu'une règle a bien été créée.`);
      break;
    }
    case 'remove-netfirewallrule': {
      const nIdx = args.findIndex(a=>a.toLowerCase()==='-name');
      const rName = nIdx >= 0 ? args[nIdx+1] : args[0];
      if (!rName) { errEx('Remove-NetFirewallRule : -Name requis.','Spécifie le nom exact de la règle à supprimer (celui donné à -Name lors de la création).'); break; }
      const before = cliState.fwRules.length;
      cliState.fwRules = cliState.fwRules.filter(r=>r.name !== rName);
      if (cliState.fwRules.length === before) { errEx(`Règle "${rName}" introuvable.`, 'Le nom doit correspondre exactement à celui utilisé lors de la création. Vérifie avec Get-NetFirewallRule.'); break; }
      out(`Règle "${escHtml(rName)}" supprimée.`);
      explain(`<strong>Remove-NetFirewallRule</strong> supprime définitivement la règle. Le port redevient filtré selon la politique par défaut (généralement Bloquer pour Inbound).`);
      break;
    }

    //  ANTIVIRUS 
    case 'update-mpsignature': {
      out(`Mise à jour des signatures Windows Defender en cours...\nDernière version : 1.411.3.0 — Mise à jour réussie.`);
      explain(`<strong>Update-MpSignature</strong> force la mise à jour immédiate des définitions de virus de Windows Defender, sans attendre la planification automatique. Indispensable après un déploiement ou en cas de suspicion d'infection.`);
      break;
    }
    case 'start-mpscan': {
      const typeIdx = args.findIndex(a=>a.toLowerCase()==='-scantype');
      const type    = typeIdx >= 0 ? args[typeIdx+1] : 'QuickScan';
      out(`Analyse Windows Defender — ${type}\nFichiers analysés : 42 381\nMenaces détectées : 0\nAnalyse terminée.`);
      explain(`<strong>Start-MpScan -ScanType ${escHtml(type)}</strong> : QuickScan cible les zones sensibles (mémoire, démarrage, registre) en ~2 min. FullScan analyse tous les fichiers (peut prendre des heures). CustomScan permet de cibler un dossier précis.`);
      break;
    }

    case 'tp': {
      handleTPCommand(args, 'windows');
      break;
    }
    case 'clear-host': case 'cls':
      cliClear();
      break;
    case 'help':
      out(`<span style="color:var(--blue)">Commandes PowerShell disponibles :</span>
<span style="color:var(--text2)">Navigation :</span>   Get-ChildItem (ls/dir)  Set-Location (cd)  Get-Location (pwd)
<span style="color:var(--text2)">Fichiers :</span>     Get-Content (cat)  New-Item  Remove-Item  Copy-Item  Move-Item
<span style="color:var(--text2)">Processus :</span>    Get-Process  Stop-Process
<span style="color:var(--text2)">Services :</span>     Get-Service  Start-Service  Stop-Service
<span style="color:var(--text2)">Réseau :</span>       <span style="color:var(--blue)">ipconfig [/all|/renew|/release|/flushdns]</span>  ping  tracert  netstat
             <span style="color:var(--blue)">nslookup</span>  Test-Connection
<span style="color:var(--text2)">Sécurité :</span>     <span style="color:var(--blue)">net user</span>  <span style="color:var(--blue)">net localgroup</span>  <span style="color:var(--blue)">icacls</span>  <span style="color:var(--blue)">manage-bde</span>
             <span style="color:var(--blue)">New-NetFirewallRule</span>  Get-NetFirewallRule  Remove-NetFirewallRule
             <span style="color:var(--blue)">Update-MpSignature</span>  Start-MpScan
<span style="color:var(--text2)">Stockage :</span>     <span style="color:var(--blue)">diskpart</span> (mode interactif)
<span style="color:var(--text2)">Système :</span>      whoami  hostname  Get-ComputerInfo  Get-EventLog  Get-ADUser
<span style="color:var(--text2)">Divers :</span>       cls  help  <span style="color:var(--blue)">tp</span> [list | start diskpart|sam|ntfs|panne|route|conflit | quit]
<span style="color:var(--text3)">/ historique · Tab autocomplétion · Ctrl+L effacer · Ctrl+C annuler</span>`);
      break;
    default:
      err(`${escHtml(raw.split(' ')[0])} : Le terme '${escHtml(raw.split(' ')[0])}' n'est pas reconnu comme nom d'applet de commande, fonction, fichier de script ou programme exécutable.`);
  }
}

// ============================================================
// ===== PAGE TERMINAUX =======================================
// ============================================================

const CLI_CARDS = [
  {
    id: 'windows',
    label: 'PowerShell',
    sublabel: 'Windows Server 2022',
    icon: 'PS',
    color: '#3b82f6',
    colorDim: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.25)',
    prompt: 'PS C:\\Users\\Administrateur>',
    promptColor: '#60a5fa',
    desc: 'PowerShell interactif. Diskpart, SAM, droits NTFS, réseau, pare-feu, BitLocker.',
    cmds: ['ipconfig /all', 'tracert 8.8.8.8', 'diskpart', 'net user TechAdmin P@ssw0rd! /add', 'icacls "C:\\Shares\\Direction"', 'tp route'],
    tpCount: 6,
  },
];

const TERMINAL_META = {
  linux:     { icon: '>_', label: 'Terminal Linux',         sublabel: 'Debian GNU/Linux',           color: '#00e5a0', cls: 'tfs-linux' },
  windows:   { icon: 'PS', label: 'Terminal PowerShell',    sublabel: 'Windows Server 2022',         color: '#3b82f6', cls: 'tfs-windows' },
  cmd:       { icon: 'CMD', label: 'Terminal Windows (CMD)', sublabel: 'cmd.exe — Windows 10/Server', color: '#9ca3af', cls: 'tfs-cmd' },
  gameshell: { icon: '[>]', label: 'GameShell',              sublabel: '30 missions Linux',           color: '#00e5a0', cls: 'tfs-linux' },
  netrunner: { icon: 'NR', label: 'NetRunner',              sublabel: 'Jeu PowerShell/CMD',          color: '#0ea5e9', cls: 'tfs-netrunner' },
};

function openTerminalFullscreen(type) {
  const meta = TERMINAL_META[type];
  if (!meta) return;
  state.currentScreen = 'terminal-fs';
  state.currentTerminal = type;
  document.getElementById('mobile-module-name').textContent = meta.label;

  const header = document.getElementById('terminal-fs-header');
  header.className = 'terminal-fs-header ' + meta.cls;
  header.innerHTML = `
    <div class="tfs-inner">
      <button class="back-btn" id="tfs-back" aria-label="Retour à l'accueil">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3L5 9L11 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Accueil
      </button>
      <div class="tfs-title-block">
        <span class="tfs-os-icon">${meta.icon}</span>
        <div>
          <div class="tfs-title" style="color:${meta.color}">${meta.label}</div>
          <div class="tfs-sub">${meta.sublabel}</div>
        </div>
      </div>
      ${type !== 'gameshell' && type !== 'netrunner' ? `<div class="tfs-hints">
        <span class="tfs-hint" style="border-color:${meta.color}44;color:${meta.color}"> historique</span>
        <span class="tfs-hint" style="border-color:${meta.color}44;color:${meta.color}">Tab complétion</span>
        <span class="tfs-hint" style="border-color:${meta.color}44;color:${meta.color}"><code>tp</code> pour les TP</span>
        ${type === 'linux' ? `<span class="tfs-hint" style="border-color:${meta.color}44;color:${meta.color}"><code>vim fichier</code></span>` : `<span class="tfs-hint" style="border-color:${meta.color}44;color:${meta.color}"><code>help</code></span>`}
      </div>` : ''}
    </div>`;

  document.getElementById('tfs-back').addEventListener('click', () => {
    state.currentTerminal = null;
    renderHome();
  });

  const fsContent = document.getElementById('terminal-fs-content');
  fsContent.innerHTML = '';
  if (type === 'gameshell') {
    renderGameshell(fsContent);
  } else if (type === 'netrunner') {
    renderNetrunner(fsContent);
  } else {
    renderCLI(type, null, fsContent);
  }

  showScreen('terminal-fs-screen');
}

function openTerminals() {
  state.currentModule = null;
  state.currentScreen = 'terminals';
  document.getElementById('mobile-module-name').textContent = 'Terminaux';
  renderNav();

  const grid = document.getElementById('terminals-grid');
  grid.innerHTML = '';

  CLI_CARDS.forEach((card, i) => {
    const el = document.createElement('div');
    el.className = 'term-card';
    el.style.setProperty('--tc', card.color);
    el.style.setProperty('--tc-dim', card.colorDim);
    el.style.setProperty('--tc-border', card.colorBorder);
    el.style.animationDelay = i * 100 + 'ms';

    const cmdsHtml = card.cmds.map(c =>
      `<div class="term-preview-line"><span class="term-preview-prompt" style="color:${card.promptColor}">${card.id === 'linux' ? '$' : '>'}</span><span class="term-preview-cmd">${escHtml(c)}</span></div>`
    ).join('');

    el.innerHTML = `
      <div class="term-card-titlebar" style="background:${card.id === 'linux' ? '#0d1f0d' : '#012456'}">
        <div class="term-card-dots">
          <span class="tc-dot" style="background:#ff5f57"></span>
          <span class="tc-dot" style="background:#ffbd2e"></span>
          <span class="tc-dot" style="background:#28c840"></span>
        </div>
        <span class="term-card-wintitle">${card.sublabel}</span>
        <span class="term-card-icon-sm">${card.icon}</span>
      </div>
      <div class="term-card-preview" style="border-color:${card.colorBorder}">
        ${cmdsHtml}
        <div class="term-preview-cursor" style="border-color:${card.color}"></div>
      </div>
      <div class="term-card-info">
        <div class="term-card-name" style="color:${card.color}">${card.label}</div>
        <div class="term-card-desc">${card.desc}</div>
        <div class="term-card-badges">
          <span class="tcb" style="background:${card.colorDim};color:${card.color};border-color:${card.colorBorder}">${card.tpCount} TP guidés</span>
          <span class="tcb tcb-gray">vim / nano</span>
          <span class="tcb tcb-gray">offline PWA</span>
        </div>
      </div>
      <button class="term-card-btn" style="--btn-c:${card.color}" aria-label="Ouvrir ${card.label}">
        <span>Ouvrir le terminal</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>`;

    el.querySelector('.term-card-btn').addEventListener('click', () => openTerminalFS(card.id));
    grid.appendChild(el);
  });

  showScreen('terminals-screen');
  closeSidebar();
}

function openTerminalFS(type) {
  const card = CLI_CARDS.find(c => c.id === type);
  if (!card) return;
  state.currentScreen = 'terminal-fs';
  document.getElementById('mobile-module-name').textContent = card.label;

  const header = document.getElementById('terminal-fs-header');
  header.className = 'terminal-fs-header tfs-' + type;
  header.innerHTML = `
    <div class="tfs-inner">
      <button class="back-btn" id="tfs-back" aria-label="Retour aux terminaux">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 3L5 9L11 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Terminaux
      </button>
      <div class="tfs-title-block">
        <span class="tfs-os-icon">${card.icon}</span>
        <div>
          <div class="tfs-title" style="color:${card.color}">${card.label}</div>
          <div class="tfs-sub">${card.sublabel}</div>
        </div>
      </div>
      <div class="tfs-hints">
        <span class="tfs-hint" style="border-color:${card.colorBorder};color:${card.color}">
           historique
        </span>
        <span class="tfs-hint" style="border-color:${card.colorBorder};color:${card.color}">
          Tab complétion
        </span>
        <span class="tfs-hint" style="border-color:${card.colorBorder};color:${card.color}">
          <code>tp</code> pour les TP
        </span>
        <span class="tfs-hint" style="border-color:${card.colorBorder};color:${card.color}">
          ${type === 'linux' ? '<code>vim fichier</code>' : '<code>help</code>'}
        </span>
      </div>
    </div>`;

  document.getElementById('tfs-back').addEventListener('click', openTerminals);

  const fsContent = document.getElementById('terminal-fs-content');
  renderCLI(type, null, fsContent);
  showScreen('terminal-fs-screen');
  closeSidebar();
}

// ===== SCREENS =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('content').scrollTop = 0;
  state.currentScreen = id.replace('-screen','');
  renderNav();
  const screenName = id.replace('-screen', '');
  if (screenName === 'home') {
    history.replaceState({ screen: 'home' }, '', '#');
  } else if (screenName !== 'module') {
    history.pushState({ screen: screenName }, '', '#' + screenName);
  }
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
}

// ===== INIT =====
document.getElementById('back-btn').addEventListener('click', () => {
  const m = state.currentModule;
  if (state.currentCours !== null && m && m.cours.length > 1) {
    state.currentCours = null;
    renderNav();
    const el = document.getElementById('tab-content');
    renderCoursIndex(m, el);
    history.replaceState({ ...history.state, scroll: document.getElementById('content').scrollTop }, '', location.href);
    history.pushState(
      { screen: 'module', moduleId: m.id, tab: 'cours', coursId: null, scroll: 0 },
      '',
      '#module-' + m.id + '/cours'
    );
    document.getElementById('content').scrollTop = 0;
  } else {
    state.currentModule = null;
    state.currentCours = null;
    renderHome();
  }
});
document.getElementById('menu-toggle').addEventListener('click', () => {
  const open = document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('active', open);
});
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}

window.addEventListener('popstate', (e) => {
  const state_nav = e.state;
  if (!state_nav || state_nav.screen === 'home') {
    state.currentModule = null;
    state.currentCours = null;
    state.currentScreen = 'home';
    document.getElementById('mobile-module-name').textContent = '';
    renderNav();
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('home-screen').classList.add('active');
    document.getElementById('content').scrollTop = 0;
  } else if (state_nav.screen === 'module' && state_nav.moduleId) {
    if (state.currentModule?.id === state_nav.moduleId && state_nav.tab) {
      switchTab(state_nav.tab, true);
    } else {
      openModule(state_nav.moduleId, true);
      if (state_nav.tab) switchTab(state_nav.tab, true);
    }
    if (state_nav.tab === 'cours' && state_nav.coursId) {
      const _m = state.currentModule;
      const _idx = _m ? _m.cours.findIndex(c => c.id === state_nav.coursId) : -1;
      if (_idx !== -1) {
        state.currentCours = state_nav.coursId;
        renderCoursDetail(_m, _m.cours[_idx], _idx, document.getElementById('tab-content'));
      }
    }
    const scroll = state_nav.scroll || 0;
    requestAnimationFrame(() => { document.getElementById('content').scrollTop = scroll; });
  } else if (state_nav.screen === 'terminals' || state_nav.screen === 'terminal-fs') {
    openTerminals();
  } else {
    renderHome();
  }
});

state.openAccordion = store.get('sidebar_open') || null;
initSidebarSearch();
const _hash = location.hash.replace('#', '');
const _moduleMatch = _hash.match(/^module-([^/]+)(?:\/([^/]+)(?:\/(.+))?)?$/);
if (_moduleMatch) {
  history.replaceState({ screen: 'home' }, '', '#');
  renderHome();
  openModule(_moduleMatch[1]);
  if (_moduleMatch[2]) switchTab(_moduleMatch[2], true);
  if (_moduleMatch[2] === 'cours' && _moduleMatch[3]) {
    const _m = MODULES.find(x => x.id === _moduleMatch[1]);
    const _idx = _m ? _m.cours.findIndex(c => c.id === _moduleMatch[3]) : -1;
    if (_idx !== -1) {
      state.currentCours = _moduleMatch[3];
      renderCoursDetail(_m, _m.cours[_idx], _idx, document.getElementById('tab-content'));
    }
  }
} else {
  history.replaceState({ screen: 'home' }, '', '#');
  renderHome();
}
