// app.js — TSSR Study App

// Force SW cache refresh for data.js fix (BOM parasites)
if ('caches' in window) {
  caches.keys().then(keys => {
    keys.filter(k => k !== 'tssr-v24').forEach(k => {
      caches.delete(k);
      console.log('Old cache deleted:', k);
    });
  });
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.update());
  });
}

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage?.addListener(() => true);
}
// Global error capture
let _errorHandling = false;
window.addEventListener('error', function(e) {
  if (_errorHandling) return;
  _errorHandling = true;
  console.error('GLOBAL ERROR:', e.message, 'at', e.filename, 'line', e.lineno);
  try { document.getElementById('content').innerHTML = '<div style="padding:20px;color:red;font-family:monospace;font-size:13px"><h2>ERREUR</h2><pre>' + (e.message||'') + '</pre><p style="color:#94a3b8;font-size:12px">' + (e.filename||'') + ':' + (e.lineno||'') + '</p><button onclick="renderHome()" style="margin-top:12px;padding:8px 16px">Accueil</button></div>'; } catch(_) {}
  _errorHandling = false;
});
window.addEventListener('unhandledrejection', function(e) {
  console.error('UNHANDLED PROMISE:', e.reason);
});

// ===== STORAGE =====
const store = {
  get: k => { try { return JSON.parse(localStorage.getItem('tssr_' + k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem('tssr_' + k, JSON.stringify(v)),
};
// ===== LEADERBOARD =====
function getLB() { return store.get('leaderboard') || []; }
function addLB(entry) {
  const lb = getLB();
  lb.unshift({ ...entry, date: Date.now() });
  if (lb.length > 100) lb.length = 100;
  store.set('leaderboard', lb);
}
function renderLeaderboard(el) {
  const lb = getLB();
  if (!lb.length) { el.innerHTML = '<div class="empty-state"><span class="empty-state-icon">\u{1F3C6}</span><h3>Classement vide</h3><p>Fais un examen ou des missions pour apparaître ici.</p></div>'; return; }
  const grouped = {};
  lb.forEach(e => { const k = e.type || 'autre'; if (!grouped[k]) grouped[k] = []; grouped[k].push(e); });
  let html = '<div style="max-height:400px;overflow-y:auto">';
  Object.keys(grouped).forEach(type => {
    html += `<div style="margin-bottom:16px"><h4 style="margin-bottom:8px;color:var(--accent)">${escHtml(type)}</h4>`;
    grouped[type].slice(0,10).forEach(e => {
      const d = new Date(e.date);
      html += `<div class="lb-entry"><span class="lb-score">${e.score}</span><span class="lb-detail">${escHtml(e.detail||'')}</span><span class="lb-date">${d.toLocaleDateString()}</span></div>`;
    });
    html += '</div>';
  });
  html += '</div><button class="btn-secondary" onclick="if(confirm('+"'Effacer le leaderboard ?')){store.set('leaderboard',[]);renderLeaderboard(document.getElementById('lb-content'));}"+`">Effacer l'historique</button>`;
  el.innerHTML = html;
}
// ===== STATS MODULE =====
function getModStats(id) { return store.get('modstats_' + id) || { qcm_best: 0, qcm_total: 0, qcm_correct: 0, fc_mastered: 0, sessions: 0 }; }
function setModStats(id, upd) {
  const s = getModStats(id); Object.assign(s, upd); s.sessions = (s.sessions||0) + 1;
  store.set('modstats_' + id, s);
}
function getQCMWeak(m) {
  const wrongs = store.get('qcm_wrong') || {};
  const modWrongs = wrongs[m.id] || {};
  return (m.qcm||[]).filter(q => modWrongs[q.id] && modWrongs[q.id] >= 2).sort((a,b) => (modWrongs[b.id]||0) - (modWrongs[a.id]||0));
}
function trackQCMAnswer(m, q, correct) {
  if (!m || !q) return;
  const key = 'qcm_wrong';
  const wrongs = store.get(key) || {};
  if (!wrongs[m.id]) wrongs[m.id] = {};
  if (!correct) { wrongs[m.id][q.id] = (wrongs[m.id][q.id]||0) + 1; }
  else { wrongs[m.id][q.id] = Math.max(0, (wrongs[m.id][q.id]||0) - 1); }
  store.set(key, wrongs);
}
// ===== KEYBOARD SHORTCUTS =====
const SHORTCUTS = [
  { key: '?', desc: 'Aide raccourcis' },
  { key: 'h', desc: 'Accueil' },
  { key: 'Escape', desc: 'Fermer sidebar / retour' },
  { key: '→ / ←', desc: 'Navigation QCM' },
  { key: 'j / k', desc: 'Défiler modules' },
  { key: 'Ctrl+P', desc: 'Rechercher module (sidebar)' },
  { key: 'Ctrl+K', desc: 'Recherche globale (tout le contenu)' },
  { key: 'Ctrl+G', desc: 'Glossaire technique TSSR' },
  { key: 'r', desc: 'Révision du jour' },
  { key: 'e', desc: 'Examen blanc' },
];
let sidebarSearchFocused = false;

// ===== GLOSSAIRE TSSR =====
const GLOSSAIRE = [
  { t: 'LAN', d: 'Local Area Network — réseau local, zone géographique limitée (bureau, bâtiment)' },
  { t: 'VLAN', d: 'Virtual LAN — découpage logique d\'un réseau physique en plusieurs réseaux isolés' },
  { t: 'WAN', d: 'Wide Area Network — réseau étendu, interconnecte plusieurs sites distants' },
  { t: 'OSI', d: 'Open Systems Interconnection — modèle à 7 couches standardisant les communications réseau' },
  { t: 'TCP/IP', d: 'Transmission Control Protocol / Internet Protocol — protocole principal d\'Internet, 4 couches' },
  { t: 'DHCP', d: 'Dynamic Host Configuration Protocol — attribution automatique d\'adresses IP' },
  { t: 'DNS', d: 'Domain Name System — résolution noms de domaine ↔ adresses IP' },
  { t: 'NAT', d: 'Network Address Translation — traduction d\'adresses IP privées en IP publique' },
  { t: 'ACL', d: 'Access Control List — liste de règles de filtrage du trafic réseau' },
  { t: 'GPO', d: 'Group Policy Object — stratégie de groupe Windows pour centraliser les configurations' },
  { t: 'AD', d: 'Active Directory — service d\'annuaire Microsoft pour gestion centralisée des utilisateurs/ressources' },
  { t: 'PKI', d: 'Public Key Infrastructure — infrastructure à clé publique, gestion des certificats numériques' },
  { t: 'VPN', d: 'Virtual Private Network — tunnel chiffré entre deux réseaux via Internet' },
  { t: 'RAID', d: 'Redundant Array of Independent Disks — regroupement de disques pour performance ou redondance' },
  { t: 'NAS', d: 'Network Attached Storage — stockage accessible via le réseau' },
  { t: 'SAN', d: 'Storage Area Network — réseau dédié au stockage, haut débit' },
  { t: 'VM', d: 'Machine Virtuelle — émulation d\'un ordinateur dans un environnement isolé' },
  { t: 'Hyperviseur', d: 'Logiciel de virtualisation gérant les machines virtuelles (ESXi, Hyper-V, KVM)' },
  { t: 'SLA', d: 'Service Level Agreement — contrat définissant les niveaux de service attendus' },
  { t: 'MTU', d: 'Maximum Transmission Unit — taille maximale d\'un paquet transmissible sur une interface' },
  { t: 'ARP', d: 'Address Resolution Protocol — résolution adresse IP ↔ adresse MAC' },
  { t: 'STP', d: 'Spanning Tree Protocol — protocole évitant les boucles dans un réseau commuté' },
  { t: 'VLAN Trunk', d: 'Lien réseau transportant plusieurs VLANs, utilise le tagging 802.1Q' },
  { t: 'LDAP', d: 'Lightweight Directory Access Protocol — protocole d\'accès aux annuaires (utilisé par AD)' },
  { t: 'RDP', d: 'Remote Desktop Protocol — protocole Microsoft pour bureau à distance' },
  { t: 'SSH', d: 'Secure Shell — accès à distance sécurisé à un serveur via terminal chiffré' },
  { t: 'SSL/TLS', d: 'Secure Sockets Layer / Transport Layer Security — protocole de chiffrement des communications web' },
  { t: 'RAID 5', d: 'Striping + parité distribuée — tolérance 1 disque, N-1 disques utiles' },
  { t: 'RAID 10', d: 'Mirroring + Striping — performance + redondance, nécessite min 4 disques' },
  { t: 'Proxy', d: 'Serveur intermédiaire filtrant/redirigeant les requêtes entre clients et Internet' },
  { t: 'Firewall', d: 'Pare-feu — dispositif filtrant le trafic réseau selon des règles de sécurité' },
  { t: 'DMZ', d: 'Demilitarized Zone — zone réseau isolée hébergeant des services accessibles depuis l\'extérieur' },
  { t: 'QoS', d: 'Quality of Service — mécanisme priorisant certains types de trafic réseau' },
  { t: 'SNMP', d: 'Simple Network Management Protocol — protocole de supervision et gestion d\'équipements réseau' },
  { t: 'Syslog', d: 'Système de journalisation centralisé des événements (serveurs, routeurs, switchs)' },
  { t: 'PXE', d: 'Preboot eXecution Environment — démarrage réseau sans disque dur local' },
  { t: 'UEFI', d: 'Unified Extensible Firmware Interface — successeur moderne du BIOS, interface de démarrage' },
  { t: 'GPT', d: 'GUID Partition Table — table de partitionnement moderne, remplace MBR pour disques >2To' },
  { t: 'SMB', d: 'Server Message Block — protocole de partage de fichiers/réseau (Windows)' },
  { t: 'NFS', d: 'Network File System — protocole de partage de fichiers (Linux/Unix)' },
];
function openGlossaire() {
  const exist = document.getElementById('glossaire-overlay');
  if (exist) { exist.remove(); return; }
  const overlay = document.createElement('div');
  overlay.id = 'glossaire-overlay';
  overlay.className = 'gs-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="gs-modal" style="max-width:520px">
      <div class="gs-header">
        <input class="gs-input" id="glossaire-input" type="text" placeholder="Chercher un terme TSSR…" autofocus>
        <button class="gs-close" onclick="this.closest('#glossaire-overlay').remove()">✕</button>
      </div>
      <div class="gs-results" id="glossaire-results" style="padding:8px">
        ${GLOSSAIRE.map(g => `<div class="glossaire-card"><strong style="color:var(--accent);font-family:var(--font-mono)">${g.t}</strong><span style="color:var(--text2);font-size:13px;margin-top:4px;display:block">${g.d}</span></div>`).join('')}
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const input = document.getElementById('glossaire-input');
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    const el = document.getElementById('glossaire-results');
    if (q.length < 1) {
      el.innerHTML = GLOSSAIRE.map(g => `<div class="glossaire-card"><strong style="color:var(--accent);font-family:var(--font-mono)">${g.t}</strong><span style="color:var(--text2);font-size:13px;margin-top:4px;display:block">${g.d}</span></div>`).join('');
      return;
    }
    const filtered = GLOSSAIRE.filter(g => g.t.toLowerCase().includes(q) || g.d.toLowerCase().includes(q));
    if (!filtered.length) { el.innerHTML = '<div class="gs-hint">Aucun terme trouvé.</div>'; return; }
    el.innerHTML = filtered.map(g => `<div class="glossaire-card"><strong style="color:var(--accent);font-family:var(--font-mono)">${g.t}</strong><span style="color:var(--text2);font-size:13px;margin-top:4px;display:block">${g.d}</span></div>`).join('');
  });
  input.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.remove(); });
  setTimeout(() => input.focus(), 50);
}

// ===== STATE =====
let state = {
  currentModule: null,
  currentCours: null,
  currentTab: null,
  currentScreen: 'home',  // 'home' | 'module' | 'terminal-fs'
  currentTerminal: null,  // 'linux' | 'windows' | 'cmd' | 'gameshell' | 'netrunner'
  openAccordion: null,
  qcm: { questions: [], idx: 0, answers: [], locked: false, done: false },
  qcmDifficulty: 'all',
  qcmTimed: false,
  qcmTimerInterval: null,
  qcmTimeLimit: 0,
  fc: { cards: [], idx: 0, flipped: false, session: { easy: 0, medium: 0, hard: 0 } },
  rev: { cards: [], idx: 0, flipped: false, session: { easy: 0, medium: 0, hard: 0 } },
  examen: { questions: [], idx: 0, answers: [], locked: false, startTime: 0 },
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
    .replace(/\u00B2/g, '^2').replace(/\u00B3/g, '^3').replace(/\u00B9/g, '^1')
    .replace(/\u2070/g, '^0').replace(/\u2074/g, '^4').replace(/\u2075/g, '^5')
    .replace(/\u2076/g, '^6').replace(/\u2077/g, '^7').replace(/\u2078/g, '^8').replace(/\u2079/g, '^9')
    .replace(/\u2713/g, '[OK]').replace(/\u2717/g, '[X]').replace(/\u2718/g, '[X]')
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
  { label: 'Fondamentaux',    ids: ['numerisation', 'reseaux', 'securite'] },
  { label: 'Linux',            ids: ['linux', 'linux-server'] },
  { label: 'Windows',          ids: ['windows', 'windows-server'] },
  { label: 'Infrastructure',   ids: ['virtualisation', 'cisco', 'supervision', 'stockage', 'cloud', 'telephonie-voip', 'iot'] },
];

function renderNav() {
  if (state._navDepth > 5) { console.error('renderNav STACK OVERFLOW'); return; }
  state._navDepth = (state._navDepth||0) + 1;
  const nav = document.getElementById('module-nav');
  nav.innerHTML = '';

  const GROUPES = [
    { label: 'Réseaux',             modules: ['reseaux', 'cisco'] },
    { label: 'Systèmes Windows',    modules: ['windows', 'windows-server', 'ad-avance', 'messagerie'] },
    { label: 'Systèmes Linux',      modules: ['linux', 'linux-server'] },
    { label: 'Développement & BDD', modules: ['scripting-avance', 'git'] },
    { label: 'Fondamentaux',        modules: ['numerisation', 'securite', 'anglais-technique'] },
    { label: 'Infrastructure',      modules: ['stockage', 'virtualisation', 'supervision', 'cloud', 'telephonie-voip', 'iot'] },
    { label: 'Support & Projet',    modules: ['support', 'support-avance', 'documentation'] },
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

  if (!MODULES || !Array.isArray(MODULES)) { console.error('MODULES not loaded'); return; }
  GROUPES.forEach(groupe => {
    const modulesGroupe = groupe.modules
      .map(id => MODULES.find(m => m && m.id === id))
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
          const _titreClean = sanitizeText(c.titre);
          cBtn.textContent = _titreClean.length > 48
            ? _titreClean.slice(0, 45).trimEnd() + '...'
            : _titreClean;
          cBtn.title = _titreClean;
          cBtn.setAttribute('aria-label', _titreClean);
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
  state._navDepth = (state._navDepth||1) - 1;
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
  const actionsEl = document.getElementById('home-actions');
  if (actionsEl) {
    const dueCards = getDueCards();
    const totalQcm = MODULES.reduce((s, m) => s + (m.qcm && m.qcm.length || 0), 0);
    actionsEl.innerHTML = `
      ${dueCards.length ? `<button class="home-action-btn home-action-rev" onclick="openRevisionDuJour()">
        <span class="home-action-icon">🔁</span>
        <span class="home-action-label">Révision du jour</span>
        <span class="home-action-badge">${dueCards.length} carte${dueCards.length > 1 ? 's' : ''}</span>
      </button>` : ''}
      <button class="home-action-btn home-action-exam" onclick="openExamenBlanc()">
        <span class="home-action-icon">📝</span>
        <span class="home-action-label">Examen blanc</span>
        <span class="home-action-badge">${totalQcm} questions</span>
      </button>
      <button class="home-action-btn" onclick="startQuickQuiz()">
        <span class="home-action-icon">⚡</span>
        <span class="home-action-label">Révision éclair</span>
        <span class="home-action-badge">5 en 2min</span>
      </button>
      <div style="display:flex;gap:4px;align-items:center;margin-left:auto">
        <button class="font-size-btn" data-size="small" onclick="setFontSize('small')" title="Petite police">A</button>
        <button class="font-size-btn" data-size="normal" onclick="setFontSize('normal')" title="Police normale">A</button>
        <button class="font-size-btn" data-size="large" onclick="setFontSize('large')" title="Grande police">A</button>
      </div>
      <button class="home-action-btn home-action-lb" onclick="openLeaderboard()">
        <span class="home-action-icon">🏆</span>
        <span class="home-action-label">Leaderboard</span>
        <span class="home-action-badge">${getLB().length} entrées</span>
      </button>
      <button class="home-action-btn" onclick="renderDashboard()">
        <span class="home-action-icon">📊</span>
        <span class="home-action-label">Dashboard</span>
      </button>
      <button class="home-action-btn" onclick="openExamHistory()">
        <span class="home-action-icon">📁</span>
        <span class="home-action-label">Mes examens</span>
        <span class="home-action-badge">${getExamHistory().length}</span>
      </button>
      <button class="home-action-btn" onclick="exportProgression()">
        <span class="home-action-icon">💾</span>
        <span class="home-action-label">Exporter données</span>
      </button>
      <button class="home-action-btn" onclick="importProgression()">
        <span class="home-action-icon">📂</span>
        <span class="home-action-label">Importer données</span>
      </button>`;
  }
  grid.innerHTML = '';
  const favs = getFavorites();
  const sorted = [...MODULES].sort((a, b) => {
    const af = favs.includes(a.id) ? 0 : 1;
    const bf = favs.includes(b.id) ? 0 : 1;
    return af - bf;
  });
  sorted.forEach((m, i) => {
    const card = document.createElement('div');
    card.className = 'module-card';
    card.style = `--card-color:${m.color};animation-delay:${i*40}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Module ${m.label}`);
    card.innerHTML = `
      ${!m.cours.length ? '<span class="module-empty-badge">À venir</span>' : ''}
      <span class="module-star ${favs.includes(m.id)?'active':''}" data-module-id="${m.id}" onclick="event.stopPropagation();toggleFavorite('${m.id}')">★</span>
      <div class="module-card-icon-box"><span class="module-card-icon"></span></div>
      <div class="module-card-title"></div>
      <div class="module-card-desc"></div>
      <div class="module-card-tags"></div>`;
    card.querySelector('.module-card-icon').textContent = m.icon;
    card.querySelector('.module-card-title').textContent = m.label;
    card.querySelector('.module-card-desc').textContent = m.desc || '';
    const tagsEl = card.querySelector('.module-card-tags');
    const tagSpan = document.createElement('span');
    tagSpan.className = m.cours.length ? 'tag has-content' : 'tag';
    tagSpan.textContent = m.cours.length ? `cours (${m.cours.length})` : 'À venir';
    tagsEl.appendChild(tagSpan);
    card.addEventListener('click', () => { try { openModule(m.id); } catch(e) { console.error('CARD CLICK:',e); alert('Erreur: '+e.message); } });
    card.addEventListener('keydown', e => e.key === 'Enter' && openModule(m.id));
    grid.appendChild(card);
  });
  showScreen('home-screen');
}

// ===== OPEN MODULE =====
function openModule(moduleId, skipHistory = false, directCours = null) {
  const m = MODULES.find(x => x && x.id === moduleId);
  if (!m) return;
  if (readingModeActive) toggleReadingMode();
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
  _mBadge.textContent = (m.topics||[]).slice(0,3).join(' · ');
  meta.appendChild(_mIcon);
  meta.appendChild(_mTitle);
  meta.appendChild(_mBadge);
  // Module stats
  const ms = getModStats(m.id);
  const statsEl = document.createElement('div');
  statsEl.className = 'module-meta-stats';
  const fcStats = m.flashcards?.length ? Math.round((ms.fc_mastered||0)/m.flashcards.length*100) : 0;
  statsEl.innerHTML = `
    <span title="Meilleur score QCM">📊 ${ms.qcm_best||0}%</span>
    <span title="Flashcards maîtrisées">🃏 ${Math.min(ms.fc_mastered||0, m.flashcards?.length||0)}/${m.flashcards?.length||0}</span>
    <span title="Sessions effectuées">🔄 ${ms.sessions||0}</span>
  `;
  meta.appendChild(statsEl);

  // Diagrams button (show if MODULE_DIAGRAMS has entries for this module)
  if (window.MODULE_DIAGRAMS && MODULE_DIAGRAMS[m.id]) {
    var _diagBtn = document.createElement('button');
    _diagBtn.className = 'btn-secondary';
    _diagBtn.innerHTML = '&#x1F5DC; Schemas';
    _diagBtn.style.cssText = 'margin-left:8px;font-size:12px;padding:4px 10px;background:transparent;border:1px solid var(--accint);color:var(--accint);border-radius:6px;cursor:pointer;white-space:nowrap';
    _diagBtn.onclick = function() { showDiagram(m.id); };
    meta.appendChild(_diagBtn);
  }

  const TABS_ICONS = {
    cours:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><line x1="3.5" y1="4.5" x2="10.5" y2="4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="7" x2="10.5" y2="7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="3.5" y1="9.5" x2="7.5" y2="9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    outils:      '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M8.5 2.5L11.5 5.5L5.5 11.5L2 12L2.5 8.5L8.5 2.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M7 4L10 7" stroke="currentColor" stroke-width="1.3"/></svg>',
    notes:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2h10v10H2z" stroke="currentColor" stroke-width="1.3"/><line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="4" y1="7.5" x2="10" y2="7.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="4" y1="10" x2="7" y2="10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    linux_cli:   '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 5L6 7L3.5 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="7" y1="9" x2="10.5" y2="9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    windows_cli: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3 5.5L5.5 7.5L3 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="6.5" y1="9.5" x2="11" y2="9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    gameshell:   '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3.5 5L6 7L3.5 9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="7" y1="9" x2="10.5" y2="9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    netrunner:   '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/><path d="M3 5.5L5.5 7.5L3 9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><line x1="6.5" y1="9.5" x2="11" y2="9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    cisco_cli:   '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/><circle cx="3.5" cy="7" r=".8" fill="currentColor"/><circle cx="6" cy="7" r=".8" fill="currentColor"/><circle cx="8.5" cy="7" r=".8" fill="currentColor"/><circle cx="11" cy="7" r=".8" fill="currentColor"/></svg>',
    flashcards:  '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3"/><rect x="3" y="4" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.3" fill="var(--bg)"/><line x1="5" y1="7" x2="13" y2="7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><line x1="5" y1="9.5" x2="11" y2="9.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
    qcm:         '<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" stroke-width="1.3"/><path d="M5.5 5.5C5.5 4.7 6.1 4 7 4s1.5.7 1.5 1.5c0 .7-.4 1.1-1 1.4C7 7.2 7 7.5 7 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/><circle cx="7" cy="10" r=".6" fill="currentColor"/></svg>',
  };
  const tabs = [];
  if (m.cours.length)       tabs.push({ id: 'cours',       label: 'Cours',          cli: false });
  if (m.linux_cli)          tabs.push({ id: 'linux_cli',   label: 'Terminal',       cli: true,  color: '#00e5a0' });
  if (m.windows_cli)        tabs.push({ id: 'windows_cli', label: 'PowerShell',     cli: true,  color: '#3b82f6' });
  if (m.cisco_cli)          tabs.push({ id: 'cisco_cli',   label: 'IOS CLI',        cli: true,  color: '#e84040' });
  if (m.id === 'linux' && m.gameshell)   tabs.push({ id: 'gameshell',  label: 'Pratique',       cli: true, color: '#00e5a0' });
  if (m.id === 'windows' && m.netrunner) tabs.push({ id: 'netrunner',  label: 'Jeu PowerShell', cli: true, color: '#0ea5e9' });
  if (m.flashcards && m.flashcards.length) tabs.push({ id: 'flashcards', label: 'Cartes',   cli: false });
  if (m.qcm && m.qcm.length)              tabs.push({ id: 'qcm',        label: 'QCM',      cli: false });
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
  else if (tabId === 'cisco_cli')   renderCLI('cisco', m, el);
  else if (tabId === 'gameshell')    renderGameshell(el);
  else if (tabId === 'netrunner')    renderNetrunner(el);
  else if (tabId === 'flashcards')  renderFlashcards(m, el);
  else if (tabId === 'qcm')         renderQCM(m, el);
  else if (tabId === 'outils')      renderOutils(m, el);
  else if (tabId === 'notes')       renderNotes(m, el);
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
    <div class="info-box" style="margin-bottom:16px">NetRunner — infiltration PowerShell/CMD en 3 missions à débloquer. Gagne des étoiles (rapidité + zéro indice), le chrono compte. Choisis ta mission ci-dessous.</div>
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
  if (cours.content) {
    content.innerHTML = cours.content;
  } else {
    (cours.sections || []).forEach(s => content.appendChild(renderSection(s)));
  }
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

  const printBtn = document.createElement('button');
  printBtn.className = 'btn-print';
  printBtn.innerHTML = '🖨️ Imprimer / PDF';
  printBtn.onclick = () => { window.print(); };

  const readBtn = document.createElement('button');
  readBtn.id = 'toggle-reading-btn';
  readBtn.className = 'btn-print';
  readBtn.innerHTML = '📖 Plein écran';
  readBtn.onclick = () => toggleReadingMode();

  const wrap = document.createElement('div');
  wrap.className = 'cours-container';
  wrap.appendChild(breadcrumb);
  wrap.appendChild(article);
  const actions = document.createElement('div');
  actions.className = 'cours-actions';
  actions.appendChild(aiBtn);
  actions.appendChild(readBtn);
  actions.appendChild(printBtn);
  wrap.appendChild(actions);
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
// ===== GLOBAL SEARCH =====
function openGlobalSearch() {
  const exist = document.getElementById('global-search-overlay');
  if (exist) { exist.remove(); return; }
  const overlay = document.createElement('div');
  overlay.id = 'global-search-overlay';
  overlay.className = 'gs-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div class="gs-modal">
      <div class="gs-header">
        <input class="gs-input" id="gs-input" type="text" placeholder="Recherche dans tout le contenu…" autofocus>
        <button class="gs-close" onclick="this.closest('#global-search-overlay').remove()">✕</button>
      </div>
      <div class="gs-results" id="gs-results">
        <div class="gs-hint">Tape au moins 2 caractères. Recherche dans cours, QCM et flashcards.</div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  const input = document.getElementById('gs-input');
  let timer = null;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => doGlobalSearch(input.value.trim()), 200);
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { overlay.remove(); }
    if (e.key === 'Enter') {
      const first = document.querySelector('.gs-result');
      if (first) first.click();
    }
  });
  setTimeout(() => input.focus(), 50);
}
function doGlobalSearch(q) {
  const el = document.getElementById('gs-results');
  if (!el) return;
  if (q.length < 2) { el.innerHTML = '<div class="gs-hint">Tape au moins 2 caractères.</div>'; return; }
  const ql = q.toLowerCase();
  const results = [];
  const modules = window.MODULES || window.modulesData;
  if (!modules) { el.innerHTML = '<div class="gs-hint">Données modules non chargées.</div>'; return; }
  for (const m of modules) {
    // Search cours
    if (m.cours) {
      for (const c of m.cours) {
        if (c.titre && c.titre.toLowerCase().includes(ql)) {
          results.push({ module: m, type: '📖', label: c.titre, sub: m.label, action: () => openModule(m.id, false, c.id) });
        }
        if (c.sections) {
          for (const s of c.sections) {
            if (s.content && s.content.toLowerCase().includes(ql)) {
              const snippet = s.content.length > 80 ? s.content.substring(0, 80) + '…' : s.content;
              results.push({ module: m, type: '📄', label: snippet, sub: c.titre + ' — ' + m.label, action: () => openModule(m.id, false, c.id) });
              break; // 1 result per section max
            }
          }
        }
      }
    }
    // Search QCM
    if (m.qcm) {
      for (const qcm of m.qcm) {
        if (qcm.question && qcm.question.toLowerCase().includes(ql)) {
          results.push({ module: m, type: '❓', label: qcm.question.length > 80 ? qcm.question.substring(0,80)+'…' : qcm.question, sub: m.label, action: () => { openModule(m.id); switchTab('qcm'); } });
          break;
        }
      }
    }
    // Search flashcards
    if (m.fc) {
      for (const fc of m.fc) {
        if ((fc.front && fc.front.toLowerCase().includes(ql)) || (fc.back && fc.back.toLowerCase().includes(ql))) {
          results.push({ module: m, type: '🃏', label: (fc.front||'…') + ' → ' + (fc.back||'…'), sub: m.label, action: () => { openModule(m.id); switchTab('flashcards'); } });
          break;
        }
      }
    }
  }
  if (!results.length) { el.innerHTML = '<div class="gs-hint">Aucun résultat pour <strong>'+escHtml(q)+'</strong></div>'; return; }
  el.innerHTML = '';
  results.slice(0, 30).forEach(r => {
    const div = document.createElement('div');
    div.className = 'gs-result';
    div.innerHTML = '<span class="gs-type">'+r.type+'</span><div class="gs-body"><span class="gs-label">'+escHtml(r.label)+'</span><span class="gs-sub">'+escHtml(r.sub)+'</span></div>';
    div.addEventListener('click', () => {
      const ov = document.getElementById('global-search-overlay');
      if (ov) ov.remove();
      r.action();
    });
    el.appendChild(div);
  });
}
// ===== READING MODE =====
let readingModeActive = false;
function toggleReadingMode() {
  readingModeActive = !readingModeActive;
  document.body.classList.toggle('reading-mode', readingModeActive);
  const btn = document.getElementById('toggle-reading-btn');
  if (btn) btn.innerHTML = readingModeActive ? '✕ Quitter' : '📖 Plein écran';
}
// ===== FAVORIS MODULES =====
function getFavorites() {
  try { return JSON.parse(localStorage.getItem('tssr_favorites')) || []; }
  catch(e) { return []; }
}
function toggleFavorite(id) {
  let fav = getFavorites();
  const idx = fav.indexOf(id);
  if (idx > -1) { fav.splice(idx, 1); } else { fav.push(id); }
  localStorage.setItem('tssr_favorites', JSON.stringify(fav));
  document.querySelectorAll('.module-star').forEach(el => {
    const mid = el.dataset.moduleId;
    if (mid) el.classList.toggle('active', fav.includes(mid));
  });
  if (state.currentScreen === 'home') renderHome();
}
// ===== DASHBOARD PROGRESSION =====
function renderDashboard() {
  const overlay = document.createElement('div');
  overlay.className = 'gs-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  const totalQcm = MODULES.reduce((s, m) => s + (m.qcm?.length || 0), 0);
  const totalFc = MODULES.reduce((s, m) => s + (m.fc?.length || 0), 0);
  // Compute stats from localStorage
  let qcmDone = 0, qcmCorrect = 0, sessions = 0;
  const lb = getLB();
  lb.forEach(e => {
    if (e.type && e.type.startsWith('QCM')) {
      qcmDone++;
      const match = e.score?.match(/(\d+)\/(\d+)/);
      if (match) qcmCorrect += parseInt(match[1]);
    }
    if (e.type === 'session') sessions++;
  });
  const qcmPct = qcmDone ? Math.round(qcmCorrect / (qcmDone * 10) * 100) : 0;
  // Flashcards mastered
  let fcMastered = 0, fcTotal = 0;
  MODULES.forEach(m => {
    if (!m.fc) return;
    m.fc.forEach((fc, fi) => {
      fcTotal++;
      const key = 'tssr_fc_' + m.id + '_' + (fc.id || fi);
      try {
        const d = JSON.parse(localStorage.getItem(key));
        if (d && d.ease && d.ease >= 200) fcMastered++;
      } catch(e) {}
    });
  });
  // Streak from SM-2 cards
  let streakBest = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k.startsWith('tssr_fc_')) {
      try {
        const d = JSON.parse(localStorage.getItem(k));
        if (d && d.streak && d.streak > streakBest) streakBest = d.streak;
      } catch(e) {}
    }
  }
  overlay.innerHTML = `
    <div class="gs-modal" style="max-width:500px">
      <div class="gs-header">
        <span style="flex:1;font-weight:700;color:var(--text)">📊 Dashboard progression</span>
        <button class="gs-close" onclick="this.closest('.gs-overlay').remove()">✕</button>
      </div>
      <div class="gs-results" style="padding:16px">
        <div class="dash-grid">
          <div class="dash-card"><div class="dash-num">${qcmDone}</div><div class="dash-label">QCM complétés</div></div>
          <div class="dash-card"><div class="dash-num">${qcmPct}%</div><div class="dash-label">Réussite QCM</div></div>
          <div class="dash-card"><div class="dash-num">${fcMastered}/${fcTotal}</div><div class="dash-label">FC maîtrisées</div></div>
          <div class="dash-card"><div class="dash-num">${streakBest}</div><div class="dash-label">Meilleure série</div></div>
          <div class="dash-card"><div class="dash-num">${lb.length}</div><div class="dash-label">Entrées leaderboard</div></div>
          <div class="dash-card"><div class="dash-num">${sessions}</div><div class="dash-label">Sessions d'étude</div></div>
        </div>
        <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn-primary" onclick="this.closest('.gs-overlay').remove();openExamenBlanc()" style="flex:1">📝 Nouvel examen</button>
          <button class="btn-secondary" onclick="this.closest('.gs-overlay').remove();openRevisionDuJour()" style="flex:1">🔁 Révision du jour</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}
// ===== EXPORT / BACKUP =====
function exportProgression() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('tssr_')) {
      try { data[key] = JSON.parse(localStorage.getItem(key)); }
      catch(e) { data[key] = localStorage.getItem(key); }
    }
  }
  data._exportedAt = new Date().toISOString();
  data._version = '1.0';
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tssr-backup-' + new Date().toISOString().slice(0,10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}
function importProgression() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        let count = 0;
        for (const key in data) {
          if (key === '_exportedAt' || key === '_version') continue;
          localStorage.setItem(key, JSON.stringify(data[key]));
          count++;
        }
        alert('✅ ' + count + ' données restaurées avec succès !');
      } catch(err) {
        alert('❌ Erreur : fichier invalide.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
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
    if (s.type === 'diagram') {
      const uid = 'diag-' + Math.random().toString(36).slice(2, 9);
      setTimeout(() => {
        const el = document.getElementById(uid);
        if (!el || typeof MODULE_DIAGRAMS === 'undefined') return;
        const arr = MODULE_DIAGRAMS[s.module];
        if (!arr) return;
        const d = arr[s.index || 0];
        if (d && d.build) el.appendChild(d.build());
      }, 0);
      return `<div class="diagram-wrap" id="${uid}"></div>`;
    }
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
    case 'diagram': {
      const div = document.createElement('div');
      div.className = 'diagram-wrap';
      if (typeof MODULE_DIAGRAMS !== 'undefined') {
        const arr = MODULE_DIAGRAMS[section.module];
        if (arr) {
          const d = arr[section.index || 0];
          if (d && d.build) div.appendChild(d.build());
        }
      }
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

function renderNotes(m, el) {
  if (window._noteUnsub) { window._noteUnsub(); window._noteUnsub = null; }

  const identityKey = 'notes_identity';
  let myId = store.get(identityKey) || KNOWN_MEMBERS[0];
  let cur  = store.get('notes_last_' + m.id) || myId;
  let membersData = {};
  let myFiles = [];

  function makeFileCard(f, onDelete) {
    const div = document.createElement('div');
    div.className = 'file-item';
    const icon = f.kind === 'pdf' || f.kind === 'pdf-idb' ? '[PDF]'
               : f.kind === 'html' ? '[HTML]' : '[TXT]';
    div.innerHTML = `
      <div class="file-item-header">
        <span class="file-icon">${icon}</span>
        <span class="file-name">${escHtml(f.filename)}</span>
        ${onDelete ? '<button class="file-remove-btn" aria-label="Supprimer ce fichier">✕</button>' : ''}
      </div>
      <div class="file-item-preview" style="display:none"></div>
      <div class="file-actions" style="display:none;gap:8px;flex-wrap:wrap;margin-top:6px;"></div>`;
    const previewEl = div.querySelector('.file-item-preview');
    const actionsEl = div.querySelector('.file-actions');
    if (onDelete) {
      div.querySelector('.file-remove-btn').addEventListener('click', () => onDelete(f, div));
    }
    if (f.content && f.kind === 'html') {
      previewEl.className = 'file-item-preview file-item-preview--render';
      previewEl.style.display = 'block';
      const ifr = document.createElement('iframe');
      ifr.className = 'file-preview-iframe';
      ifr.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox');
      ifr.srcdoc = makeLinksClickable(f.content);
      previewEl.appendChild(ifr);
    } else if (f.content && f.kind === 'pdf') {
      previewEl.className = 'file-item-preview file-item-preview--render';
      previewEl.style.display = 'block';
      const ifr = document.createElement('iframe');
      ifr.className = 'file-preview-iframe';
      ifr.src = _pdfB64ToUrl(f.content);
      previewEl.appendChild(ifr);
    } else if (f.content && f.kind === 'pdf-idb') {
      previewEl.className = 'file-item-preview file-item-preview--render';
      previewEl.style.display = 'block';
      const ifr = document.createElement('iframe');
      ifr.className = 'file-preview-iframe';
      PdfStore.get(f.content).then(blob => {
        if (blob) ifr.src = URL.createObjectURL(blob);
        else previewEl.textContent = '(PDF non disponible sur cet appareil — re-uploadez-le)';
      });
      previewEl.appendChild(ifr);
    } else if (f.content && f.kind === 'text') {
      previewEl.className = 'file-item-preview';
      previewEl.style.display = 'block';
      previewEl.textContent = f.content.substring(0, 300) + (f.content.length > 300 ? '…' : '');
    } else {
      previewEl.className = 'file-item-preview';
      previewEl.style.display = 'block';
      previewEl.textContent = '(Fichier local uniquement — trop volumineux pour Firestore)';
    }
    if (f.content && (f.kind === 'html' || f.kind === 'pdf' || f.kind === 'pdf-idb')) {
      actionsEl.style.display = 'flex';
      const fsBtn = document.createElement('button');
      fsBtn.className = 'file-fullscreen-btn';
      fsBtn.textContent = '⛶ Plein écran';
      fsBtn.addEventListener('click', () => openFileFullscreen({ filename: f.filename, kind: f.kind, content: f.content }));
      actionsEl.appendChild(fsBtn);
    }
    return div;
  }

  async function saveMyData(text) {
    try {
      const { FirebaseNotes } = await import('./firebase-notes.js');
      return await FirebaseNotes.saveMemberData(m.id, 'notes', myId, text, myFiles);
    } catch (e) { return { success: false, error: e.message }; }
  }

  function showPerson(person) {
    cur = person;
    store.set('notes_last_' + m.id, person);
    el.querySelectorAll('.np-btn').forEach(b => b.classList.toggle('active', b.dataset.p === person));
    const area = el.querySelector('.notes-area');
    if (!area) return;

    if (person === 'Résumé') {
      const entries = KNOWN_MEMBERS.map(p => {
        const data = membersData[p];
        const txt  = data?.text || store.get(`notes_${m.id}_${p}`) || '';
        const nf   = (data?.files || []).length;
        if (!txt.trim() && !nf) return '';
        return `<div class="notes-entry">
          <div class="notes-entry-name">${p}</div>
          <div class="notes-entry-text">${escHtml(txt)}</div>
          ${nf ? `<div style="font-size:11px;color:var(--text3);margin-top:4px">${nf} fichier(s) partagé(s)</div>` : ''}
        </div>`;
      }).filter(Boolean).join('');
      area.innerHTML = entries || `<div class="empty-state" style="padding:60px 0"><span class="empty-state-icon">📝</span><h3>Aucune note pour l'instant</h3><p>Les notes de chaque membre apparaîtront ici.</p></div>`;
      return;
    }

    if (person === myId) {
      const myData    = membersData[myId];
      const savedText = myData?.text ?? store.get(`notes_${m.id}_${myId}`) ?? '';
      myFiles = myData?.files ?? myFiles;
      area.innerHTML = `
        <div class="notes-editor">
          <div class="notes-editor-header">
            <span class="notes-editor-who">${myId}</span>
            <span class="notes-save-status" id="ns-status">✓ Synchronisé</span>
          </div>
          <textarea id="notes-ta" class="notes-textarea" placeholder="Mes notes pour ce module…" spellcheck="true">${escHtml(savedText)}</textarea>
          <div class="file-upload-section">
            <div id="file-upload-zone" class="file-upload-zone">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-bottom:8px;color:var(--accent)">
                <path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              <div>Glisser ici ou <button id="upload-btn-trigger" class="upload-trigger-btn">Choisir un fichier</button></div>
              <div class="upload-hint">HTML, PDF, TXT, MD</div>
              <input type="file" id="file-input" accept=".html,.htm,.pdf,.txt,.md,.docx" multiple style="display:none">
            </div>
            <div id="files-list" class="files-list"></div>
          </div>
        </div>`;
      const ta = area.querySelector('#notes-ta');
      const statusEl = area.querySelector('#ns-status');
      let t;
      const flushSave = async () => {
        clearTimeout(t);
        store.set(`notes_${m.id}_${myId}`, ta.value);
        const res = await saveMyData(ta.value);
        statusEl.textContent = res.success ? '✓ Synchronisé' : '⚠ Local seulement';
      };
      ta.addEventListener('input', () => {
        statusEl.textContent = '…';
        clearTimeout(t);
        t = setTimeout(flushSave, 800);
      });
      // Sauvegarde immediate si on quitte le champ ou l'onglet avant la fin du debounce (evite de perdre les dernieres frappes)
      ta.addEventListener('blur', flushSave);
      if (window._noteUnloadHandler) window.removeEventListener('beforeunload', window._noteUnloadHandler);
      window._noteUnloadHandler = () => { store.set(`notes_${m.id}_${myId}`, ta.value); saveMyData(ta.value); };
      window.addEventListener('beforeunload', window._noteUnloadHandler);
      const filesList = area.querySelector('#files-list');

      const deleteMyFile = async (f, cardEl) => {
        if (!confirm(`Supprimer « ${f.filename} » de tes notes ?`)) return;
        myFiles = myFiles.filter(x => x !== f);
        cardEl.remove();
        if (f.kind === 'pdf-idb' && f.content) { try { await PdfStore.remove(f.content); } catch {} }
        const res = await saveMyData(ta.value);
        statusEl.textContent = res.success ? '✓ Synchronisé' : '⚠ Local seulement';
      };

      setupFileUpload(m.id, 'notes', async fileEntry => {
        myFiles = [...myFiles, fileEntry];
        const res = await saveMyData(ta.value);
        statusEl.textContent = res.success ? '✓ Synchronisé' : '⚠ Fichier trop volumineux pour Firestore';
      });
      myFiles.forEach(f => filesList.appendChild(makeFileCard(f, deleteMyFile)));
    } else {
      const data  = membersData[person];
      const txt   = data?.text || '';
      const files = data?.files || [];
      area.innerHTML = `
        <div class="notes-editor">
          <div class="notes-editor-header">
            <span class="notes-editor-who">${person}</span>
            <span class="notes-save-status" style="color:${data ? 'var(--accent)' : 'var(--text3)'}">
              ${data ? 'Firestore ✓' : 'Aucune note partagée'}
            </span>
          </div>
          ${txt ? `<div class="notes-readonly-text">${escHtml(txt)}</div>` : ''}
        </div>`;
      if (files.length) {
        const section = document.createElement('div');
        section.className = 'file-upload-section';
        section.style.marginTop = '12px';
        files.forEach(f => section.appendChild(makeFileCard(f)));
        area.querySelector('.notes-editor').appendChild(section);
      }
    }
  }

  const identityOptions = KNOWN_MEMBERS.map(p =>
    `<option value="${p}"${p === myId ? ' selected' : ''}>${p}</option>`
  ).join('');
  const btns = KNOWN_MEMBERS.map(p =>
    `<button class="np-btn${p === cur ? ' active' : ''}" data-p="${p}">${p}</button>`
  ).join('') + `<button class="np-btn np-btn-resume${cur === 'Résumé' ? ' active' : ''}" data-p="Résumé">📋 Résumé</button>`;

  el.innerHTML = `
    <div class="notes-wrap">
      <div class="notes-identity-bar">
        <label class="notes-identity-label">Je suis :</label>
        <select class="notes-identity-select">${identityOptions}</select>
      </div>
      <div class="notes-people">${btns}</div>
      <div class="notes-area"></div>
    </div>`;

  el.querySelector('.notes-identity-select').addEventListener('change', e => {
    myId = e.target.value;
    store.set(identityKey, myId);
    showPerson(cur);
  });
  el.querySelectorAll('.np-btn').forEach(b =>
    b.addEventListener('click', () => showPerson(b.dataset.p))
  );

  showPerson(cur);

  let firstSnapshot = true;
  import('./firebase-notes.js').then(({ FirebaseNotes }) => {
    window._noteUnsub = FirebaseNotes.listenToAllMembers(m.id, 'notes', members => {
      membersData = members;
      if (cur !== myId || firstSnapshot) {
        showPerson(cur);
      } else {
        myFiles = members[myId]?.files || myFiles;
      }
      firstSnapshot = false;
    });
  }).catch(() => {});
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

function setupFileUpload(moduleId, coursId, onFileReady) {
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
        const result = await extractFileContent(file);
        const { kind, raw } = result;

        // Text for "Ajouter aux notes" / IA summary
        let textContent;
        if (kind === 'text') {
          textContent = raw;
        } else if (kind === 'html') {
          textContent = new DOMParser().parseFromString(raw, 'text/html').body.innerText || '';
        } else {
          textContent = `[${kind.toUpperCase()}: ${file.name}]`;
        }

        if (onFileReady) onFileReady({ filename: file.name, kind, content: raw });

        if (kind === 'html') {
          statusEl.style.color = 'var(--accent)';
          statusEl.textContent = 'HTML — rendu ci-dessous';
          previewEl.className = 'file-item-preview file-item-preview--render';
          const ifr = document.createElement('iframe');
          ifr.className = 'file-preview-iframe';
          ifr.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox');
          ifr.srcdoc = makeLinksClickable(raw);
          previewEl.appendChild(ifr);
          previewEl.style.display = 'block';
        } else if (kind === 'pdf' || kind === 'pdf-idb') {
          statusEl.style.color = 'var(--accent)';
          statusEl.textContent = 'PDF — rendu ci-dessous';
          previewEl.className = 'file-item-preview file-item-preview--render';
          const ifr = document.createElement('iframe');
          ifr.className = 'file-preview-iframe';
          if (kind === 'pdf') {
            ifr.src = _pdfB64ToUrl(raw);
          } else {
            PdfStore.get(raw).then(blob => { if (blob) ifr.src = URL.createObjectURL(blob); });
          }
          previewEl.appendChild(ifr);
          previewEl.style.display = 'block';
        } else {
          statusEl.style.color = 'var(--accent)';
          statusEl.textContent = `Extrait — ${textContent.length} caractères`;
          previewEl.textContent = textContent.substring(0, 300) + (textContent.length > 300 ? '…' : '');
          previewEl.style.display = 'block';
        }

        const addBtn = document.createElement('button');
        addBtn.className = 'file-add-btn';
        addBtn.textContent = '+ Ajouter aux notes';
        addBtn.addEventListener('click', () => {
          const ta = document.getElementById('notes-ta');
          if (!ta) { alert('Selectionnez d\'abord un membre dans les notes.'); return; }
          const stamp = new Date().toLocaleString('fr-FR');
          ta.value += (ta.value ? '\n\n' : '') + `--- ${file.name} (${stamp}) ---\n${textContent}`;
          ta.dispatchEvent(new Event('input'));
          statusEl.textContent = 'Ajouté aux notes ✓';
        });

        const sumBtn = document.createElement('button');
        sumBtn.className = 'file-summarize-btn';
        sumBtn.textContent = 'Résumer avec IA';
        sumBtn.addEventListener('click', () => generateSummaryFromFile(textContent, file.name));

        if (kind === 'html' || kind === 'pdf' || kind === 'pdf-idb') {
          const fsBtn = document.createElement('button');
          fsBtn.className = 'file-fullscreen-btn';
          fsBtn.textContent = '⛶ Plein écran';
          fsBtn.addEventListener('click', () => openFileFullscreen({ filename: file.name, kind, content: raw }));
          actionsEl.append(addBtn, sumBtn, fsBtn);
        } else {
          actionsEl.append(addBtn, sumBtn);
        }
        actionsEl.style.display = 'flex';
      } catch (err) {
        statusEl.style.color = 'var(--red)';
        statusEl.textContent = 'Erreur : ' + err.message;
      }
    }
  }
}

function openFileFullscreen(file) {
  const overlay = document.createElement('div');
  overlay.className = 'file-fullscreen-overlay';
  overlay.innerHTML = `
    <div class="file-fullscreen-modal">
      <div class="file-fullscreen-header">
        <span class="file-fullscreen-title">${escHtml(file.filename)}</span>
        <button class="file-fullscreen-close">Fermer</button>
      </div>
      <iframe class="file-fullscreen-iframe"></iframe>
    </div>
  `;
  document.body.appendChild(overlay);

  const iframe = overlay.querySelector('.file-fullscreen-iframe');
  if (file.kind === 'pdf' || file.kind === 'pdf-idb') {
    (async () => {
      let url;
      if (file.kind === 'pdf') {
        url = _pdfB64ToUrl(file.content);
      } else {
        const blob = await PdfStore.get(file.content);
        if (!blob) { iframe.srcdoc = '<p style="color:red;padding:1rem">PDF non disponible sur cet appareil.</p>'; return; }
        url = URL.createObjectURL(blob);
      }
      iframe.src = url;
    })();
  } else {
    iframe.setAttribute('sandbox', 'allow-scripts allow-popups allow-popups-to-escape-sandbox');
    iframe.srcdoc = makeLinksClickable(file.content);
  }

  const close = () => overlay.remove();
  overlay.querySelector('.file-fullscreen-close').addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', function escClose(e) {
    if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escClose); }
  });
}

const PdfStore = {
  _db: null,
  async _open() {
    if (this._db) return this._db;
    return new Promise((res, rej) => {
      const r = indexedDB.open('tssr_pdfs', 1);
      r.onupgradeneeded = e => e.target.result.createObjectStore('pdfs');
      r.onsuccess = e => { this._db = e.target.result; res(this._db); };
      r.onerror   = () => rej(r.error);
    });
  },
  async save(key, blob) {
    const db = await this._open();
    return new Promise((res, rej) => {
      const tx = db.transaction('pdfs', 'readwrite');
      tx.objectStore('pdfs').put(blob, key);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  },
  async get(key) {
    const db = await this._open();
    return new Promise((res, rej) => {
      const r = db.transaction('pdfs', 'readonly').objectStore('pdfs').get(key);
      r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
    });
  },
  async remove(key) {
    const db = await this._open();
    return new Promise((res, rej) => {
      const tx = db.transaction('pdfs', 'readwrite');
      tx.objectStore('pdfs').delete(key);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  },
};

async function renderPdfViewer(container, f) {
  let url;
  if (f.kind === 'pdf') {
    url = _pdfB64ToUrl(f.content);
  } else if (f.kind === 'pdf-idb') {
    const blob = await PdfStore.get(f.content);
    if (!blob) {
      container.innerHTML = `<div class="pdf-unavailable">⚠️ PDF stocké localement — non disponible sur cet appareil. Re-uploadez-le.</div>`;
      return;
    }
    url = URL.createObjectURL(blob);
  } else { return; }

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.className = 'member-file-pdf';
  container.innerHTML = '';
  container.appendChild(iframe);
}

function _pdfB64ToUrl(b64) {
  const bytes = atob(b64);
  const buf = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) buf[i] = bytes.charCodeAt(i);
  return URL.createObjectURL(new Blob([buf], { type: 'application/pdf' }));
}

async function extractFileContent(file) {
  const type = file.type;

  if (type === 'text/plain' || type === 'text/markdown' || !type || file.name.endsWith('.md')) {
    const text = await file.text();
    return { kind: 'text', raw: text };
  }

  if (type === 'text/html') {
    const html = await file.text();
    const sanitized = sanitizeHtmlContent(html);
    return { kind: 'html', raw: sanitized };
  }

  if (type === 'application/pdf') {
    const buf = await file.arrayBuffer();
    if (file.size > 500000) {
      const key = `pdf_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      await PdfStore.save(key, new Blob([buf], { type: 'application/pdf' }));
      return { kind: 'pdf-idb', raw: key };
    }
    const bytes = new Uint8Array(buf);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return { kind: 'pdf', raw: btoa(bin) };
  }

  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const text = await extractDOCX(file);
    return { kind: 'text', raw: text };
  }

  try {
    const text = await file.text();
    return { kind: 'text', raw: text };
  } catch (_) {
    throw new Error('Format non supporte: ' + (type || file.name));
  }
}

function makeLinksClickable(html) {
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      // Pattern menu JS classique : href="#" + onclick="show('section')" sans preventDefault.
      // Le clic execute bien le JS puis le navigateur suit quand meme le "#", ce qui remonte
      // en haut du document (= retour visuel au menu). On neutralise la navigation par defaut.
      if (href === '#' && a.hasAttribute('onclick')) {
        const onclick = a.getAttribute('onclick') || '';
        if (!/preventDefault/.test(onclick)) {
          a.setAttribute('onclick', 'event.preventDefault();' + onclick);
        }
        return;
      }
      // Ancres internes (#section) : laisser le defilement se faire dans le document,
      // ne pas forcer un nouvel onglet a chaque clic.
      if (href.startsWith('#') || href.startsWith('javascript:')) return;
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
    return doc.documentElement.outerHTML;
  } catch (_) { return html; }
}

function sanitizeHtmlContent(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Supprimer uniquement les balises a risque de sortie de sandbox
  doc.querySelectorAll('iframe, object, embed, link[rel="import"], meta[http-equiv="refresh"]')
    .forEach(el => el.remove());

  // Retourner le document COMPLET (scripts + styles + body) tel quel
  return doc.documentElement.outerHTML;
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

// ===== RÉVISION DU JOUR =====
function getDueCards() {
  const today = new Date().toISOString().slice(0, 10);
  const due = [];
  MODULES.forEach(m => {
    if (!m.flashcards || !m.flashcards.length) return;
    m.flashcards.forEach(card => {
      const saved = store.get(`fc_${m.id}_${card.id}`);
      if (!saved || saved.nextReview.slice(0, 10) <= today) {
        due.push({ ...card, _moduleId: m.id, _moduleLabel: m.label });
      }
    });
  });
  return due;
}

function openRevisionDuJour() {
  const due = getDueCards();
  if (!due.length) return;
  document.getElementById('examen-meta').textContent = 'Révision du jour';
  showScreen('examen-screen');
  state.rev = { cards: shuffle(due), idx: 0, flipped: false, session: { easy: 0, medium: 0, hard: 0 } };
  renderRevisionView(document.getElementById('examen-content'));
}

function renderRevisionView(el) {
  const { cards, idx, session } = state.rev;
  const total = cards.length;
  if (idx >= total) {
    el.innerHTML = `
      <div class="flashcard-arena">
        <div class="flashcard-done">
          <div style="margin-bottom:16px;font-family:var(--font-mono);color:var(--accent);font-size:28px;font-weight:700">[OK]</div>
          <h3>Révision terminée !</h3>
          <p>Facile : <strong>${session.easy}</strong> · Moyen : <strong>${session.medium}</strong> · Difficile : <strong>${session.hard}</strong></p>
          <div style="display:flex;gap:12px;justify-content:center">
            <button class="btn-primary" onclick="openRevisionDuJour()">Recommencer</button>
            <button class="btn-secondary" onclick="renderHome()">Accueil</button>
          </div>
        </div>
      </div>`;
    return;
  }
  const card = cards[idx];
  state.rev.flipped = false;
  el.innerHTML = `
    <div class="flashcard-arena">
      <div class="flashcard-progress-bar">
        <div class="progress-bar-wrap" style="flex:1"><div class="progress-bar-fill" style="width:${Math.round((idx/total)*100)}%"></div></div>
        <span class="flashcard-counter">${idx+1} / ${total}</span>
      </div>
      <div class="rev-module-label">${card._moduleLabel || ''}</div>
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
        <button class="fc-btn hard"   onclick="revRate('hard')"   aria-label="Difficile">Difficile<span class="fc-btn-sub">revoir maintenant</span></button>
        <button class="fc-btn medium" onclick="revRate('medium')" aria-label="Moyen">Moyen<span class="fc-btn-sub">+1 jour</span></button>
        <button class="fc-btn easy"   onclick="revRate('easy')"   aria-label="Facile">Facile<span class="fc-btn-sub">+4 jours</span></button>
      </div>
      <div style="display:flex;gap:16px;font-size:12px;color:var(--text3)">
        <span>✓ ${session.easy}</span><span>~ ${session.medium}</span><span>✗ ${session.hard}</span>
      </div>
    </div>`;
  const scene = document.getElementById('fc-scene');
  scene.addEventListener('click', flipRevCard);
  scene.addEventListener('keydown', e => (e.key === 'Enter' || e.key === ' ') && flipRevCard());
}

function flipRevCard() {
  if (state.rev.flipped) return;
  state.rev.flipped = true;
  document.getElementById('fc-inner').classList.add('flipped');
  const a = document.getElementById('fc-actions');
  a.style.opacity = '1'; a.style.pointerEvents = 'auto';
}

function revRate(rating) {
  state.rev.session[rating]++;
  if (rating === 'hard') state.rev.cards.push(state.rev.cards[state.rev.idx]);
  const card = state.rev.cards[state.rev.idx];
  const saved = store.get(`fc_${card._moduleId}_${card.id}`);
  const prevEase = saved?.ease || 250;
  const prevStreak = saved?.streak || 0;
  let ease = prevEase, streak = 0, days;
  if (rating === 'easy') {
    ease = Math.min(350, prevEase + 15);
    streak = prevStreak + 1;
    days = streak <= 1 ? 1 : streak <= 2 ? 3 : streak <= 3 ? 7 : streak <= 5 ? 14 : 30;
  } else if (rating === 'medium') {
    ease = Math.max(130, prevEase - 5);
    streak = Math.max(0, prevStreak - 1);
    days = 1;
  } else {
    ease = Math.max(130, prevEase - 20);
    streak = 0;
    days = 0;
  }
  days = Math.round(days * (ease / 250));
  const next = new Date(); next.setDate(next.getDate() + days);
  store.set(`fc_${card._moduleId}_${card.id}`, { rating, ease, streak, nextReview: next.toISOString() });
  state.rev.idx++;
  renderRevisionView(document.getElementById('examen-content'));
}

// ===== EXAMEN BLANC =====
function openExamenBlanc() {
  document.getElementById('examen-meta').textContent = 'Examen blanc';
  showScreen('examen-screen');
  const el = document.getElementById('examen-content');
  const totalQcm = MODULES.reduce((s, m) => s + (m.qcm && m.qcm.length || 0), 0);
  const nbModules = MODULES.filter(m => m.qcm && m.qcm.length).length;
  el.innerHTML = `
    <div class="examen-setup">
      <div class="examen-setup-icon">📝</div>
      <h2>Examen blanc</h2>
      <p>${totalQcm} questions · ${nbModules} modules</p>
      <div class="examen-count-btns">
        <button class="examen-count-btn examen-count-daily" onclick="startDailyChallenge()">🎯 Défi du jour (10)</button>
        <button class="examen-count-btn" onclick="startExamen(20)">20 questions</button>
        <button class="examen-count-btn" onclick="startExamen(40)">40 questions</button>
        <button class="examen-count-btn examen-count-all" onclick="startExamen(${totalQcm})">Tout (${totalQcm})</button>
        <button class="examen-count-btn" onclick="openCustomExam()">🎯 Personnalisé</button>
      </div>
    </div>`;
}

// ===== EXAMEN PERSONNALISÉ =====
function openCustomExam() {
  const overlay = document.createElement('div');
  overlay.className = 'gs-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  const modsWithQcm = MODULES.filter(m => m.qcm?.length);
  const diffOptions = ['all','facile','normal','difficile','troubleshooter'];
  overlay.innerHTML = `
    <div class="gs-modal" style="max-width:480px">
      <div class="gs-header"><span style="flex:1;font-weight:700">🎯 Examen personnalisé</span><button class="gs-close" onclick="this.closest('.gs-overlay').remove()">✕</button></div>
      <div class="gs-results" style="padding:16px">
        <label style="color:var(--text2);font-size:13px;display:block;margin-bottom:6px">Nombre de questions</label>
        <div style="display:flex;gap:6px;margin-bottom:14px">
          ${[5,10,20,50].map(n => `<button class="examen-count-btn" onclick="this.parentElement.querySelectorAll('.examen-count-btn').forEach(b=>b.classList.remove('active'));this.classList.add('active');this._cq=${n}" style="flex:1">${n}</button>`).join('')}
        </div>
        <label style="color:var(--text2);font-size:13px;display:block;margin-bottom:6px">Modules (défaut = tous)</label>
        <div style="max-height:160px;overflow-y:auto;margin-bottom:14px;display:flex;flex-direction:column;gap:4px" id="custom-exam-modules">
          ${modsWithQcm.map(m => `<label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2);cursor:pointer"><input type="checkbox" value="${m.id}" checked> ${m.icon} ${m.label}</label>`).join('')}
        </div>
        <label style="color:var(--text2);font-size:13px;display:block;margin-bottom:6px">Difficulté</label>
        <select id="custom-exam-diff" style="width:100%;background:var(--bg4);color:var(--text);border:1px solid var(--border2);padding:8px;border-radius:8px;margin-bottom:16px">
          ${diffOptions.map(d => `<option value="${d}">${d==='all'?'Toutes':{facile:'Facile',normal:'Normal',difficile:'Difficile',troubleshooter:'Troubleshooter'}[d]||d}</option>`).join('')}
        </select>
        <button class="btn-primary" style="width:100%" id="custom-exam-start">Lancer l'examen</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
  document.getElementById('custom-exam-start').addEventListener('click', () => {
    const activeBtn = overlay.querySelector('.examen-count-btn.active');
    const count = activeBtn ? (parseInt(activeBtn._cq) || 10) : 10;
    const checked = [...overlay.querySelectorAll('#custom-exam-modules input:checked')].map(c => c.value);
    const diff = document.getElementById('custom-exam-diff').value;
    overlay.remove();
    startCustomExam(count, checked, diff);
  });
}
function startCustomExam(count, moduleIds, diff) {
  let pool = MODULES.flatMap(m => (moduleIds.includes(m.id) && m.qcm ? m.qcm.map(q => ({ ...q, _moduleLabel: m.label })) : []));
  if (diff !== 'all') pool = pool.filter(q => q.difficulty === diff);
  const questions = shuffle(pool).slice(0, count).map(q => ({ ...q, options: shuffle(q.options) }));
  if (!questions.length) { alert('Aucune question avec ces critères.'); return; }
  state.examen = { questions, idx: 0, answers: [], locked: false, startTime: Date.now() };
  if (examenTimerInterval) clearInterval(examenTimerInterval);
  examenTimerInterval = setInterval(() => {
    const el = document.getElementById('examen-timer');
    if (!el || state.examen.idx >= state.examen.questions.length) { clearInterval(examenTimerInterval); return; }
    const elapsed = Math.round((Date.now() - state.examen.startTime) / 1000);
    el.textContent = '⏱ ' + String(Math.floor(elapsed/60)).padStart(2,'0') + ':' + String(elapsed%60).padStart(2,'0');
  }, 1000);
  document.getElementById('examen-meta').textContent = 'Examen personnalisé';
  showScreen('examen-screen');
  renderExamenQuestion(document.getElementById('examen-content'));
}
// ===== RÉVISION ÉCLAIR =====
function startQuickQuiz() {
  const allQcm = MODULES.flatMap(m => (m.qcm || []).map(q => ({ ...q, _moduleLabel: m.label })));
  if (!allQcm.length) { alert('Aucune question disponible.'); return; }
  const questions = shuffle(allQcm).slice(0, 5).map(q => ({ ...q, options: shuffle(q.options) }));
  state.examen = { questions, idx: 0, answers: [], locked: false, startTime: Date.now() };
  if (examenTimerInterval) clearInterval(examenTimerInterval);
  const endTime = Date.now() + 120000;
  examenTimerInterval = setInterval(() => {
    const el = document.getElementById('examen-timer');
    if (!el || state.examen.idx >= state.examen.questions.length) { clearInterval(examenTimerInterval); return; }
    const left = Math.max(0, Math.round((endTime - Date.now()) / 1000));
    el.textContent = '⚡ ' + String(Math.floor(left/60)).padStart(2,'0') + ':' + String(left%60).padStart(2,'0');
    if (left <= 10) el.style.color = 'var(--red)';
    if (left <= 0) {
      clearInterval(examenTimerInterval);
      state.examen.idx = state.examen.questions.length;
      renderExamenResults(document.getElementById('examen-content'));
    }
  }, 1000);
  document.getElementById('examen-meta').textContent = '⚡ Révision éclair (2 min)';
  showScreen('examen-screen');
  renderExamenQuestion(document.getElementById('examen-content'));
}
// ===== TAILLE POLICE =====
function setFontSize(level) {
  const sizes = { small: '14px', normal: '16px', large: '20px' };
  document.documentElement.style.setProperty('--content-font-size', sizes[level] || '16px');
  localStorage.setItem('tssr_font_size', level);
  document.querySelectorAll('.font-size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === level));
}
function initFontSize() {
  const saved = localStorage.getItem('tssr_font_size') || 'normal';
  setFontSize(saved);
}

// ===== EXAMENS PASSÉS =====
function getExamHistory() {
  try { return JSON.parse(localStorage.getItem('tssr_exam_history')) || []; }
  catch(e) { return []; }
}
function saveExamenAttempt(data) {
  const history = getExamHistory();
  history.unshift({ ...data, date: new Date().toISOString(), id: Date.now() });
  if (history.length > 50) history.length = 50; // keep last 50
  localStorage.setItem('tssr_exam_history', JSON.stringify(history));
}
function openExamHistory() {
  const overlay = document.createElement('div');
  overlay.className = 'gs-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  const history = getExamHistory();
  overlay.innerHTML = `
    <div class="gs-modal" style="max-width:520px">
      <div class="gs-header">
        <span style="flex:1;font-weight:700">📁 Mes examens passés</span>
        <button class="gs-close" onclick="this.closest('.gs-overlay').remove()">✕</button>
      </div>
      <div class="gs-results" style="padding:12px">
        ${!history.length ? '<div class="gs-hint">Aucun examen passé pour le moment.</div>' :
          history.map(h => {
            const d = new Date(h.date);
            const color = h.pct >= 80 ? 'var(--accent)' : h.pct >= 60 ? 'var(--amber)' : 'var(--red)';
            return `<div class="exam-history-card" onclick="this.closest('.gs-overlay').remove();openExamenDetail(${h.id})">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <div>
                  <div style="font-weight:600;color:var(--text);font-size:14px">${h.meta || 'Examen'}</div>
                  <div style="font-size:12px;color:var(--text3)">${d.toLocaleDateString()} à ${d.toLocaleTimeString().slice(0,5)} · ${h.total} questions · ${h.mm}:${h.ss}</div>
                </div>
                <div style="text-align:right">
                  <div style="font-size:22px;font-weight:800;color:${color}">${h.pct}%</div>
                  <div style="font-size:11px;color:var(--text3)">${h.score}/${h.total}</div>
                </div>
              </div>
              ${h.errors ? `<div style="margin-top:6px;font-size:12px;color:var(--red)">${h.errors} erreur${h.errors>1?'s':''}</div>` : ''}
            </div>`;
          }).join('')
        }
        ${history.length ? '<button class="btn-secondary" style="width:100%;margin-top:12px" onclick="if(confirm(\'Effacer tout l\'historique ?\')){localStorage.removeItem(\'tssr_exam_history\');this.closest(\'.gs-overlay\').remove();}">🗑 Effacer l\'historique</button>' : ''}
      </div>
    </div>`;
  document.body.appendChild(overlay);
}
function openExamenDetail(id) {
  const history = getExamHistory();
  const h = history.find(x => x.id === id);
  if (!h) return;
  const overlay = document.createElement('div');
  overlay.className = 'gs-overlay';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  const d = new Date(h.date);
  const color = h.pct >= 80 ? 'var(--accent)' : h.pct >= 60 ? 'var(--amber)' : 'var(--red)';
  overlay.innerHTML = `
    <div class="gs-modal" style="max-width:440px">
      <div class="gs-header">
        <span style="flex:1;font-weight:700">📄 ${h.meta || 'Examen'}</span>
        <button class="gs-close" onclick="this.closest('.gs-overlay').remove()">✕</button>
      </div>
      <div class="gs-results" style="padding:16px;text-align:center">
        <div style="font-size:48px;font-weight:800;color:${color}">${h.pct}%</div>
        <div style="font-size:16px;color:var(--text2);margin:4px 0 12px">${h.score}/${h.total} bonnes réponses</div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px">
          <div class="dash-card"><div class="dash-num">${h.total}</div><div class="dash-label">Questions</div></div>
          <div class="dash-card"><div class="dash-num" style="color:var(--red)">${h.errors||0}</div><div class="dash-label">Erreurs</div></div>
          <div class="dash-card"><div class="dash-num">${h.mm}:${h.ss}</div><div class="dash-label">Temps</div></div>
        </div>
        <div style="font-size:12px;color:var(--text3)">${d.toLocaleDateString()} à ${d.toLocaleTimeString().slice(0,5)}</div>
        <button class="btn-primary" style="margin-top:16px;width:100%" onclick="this.closest('.gs-overlay').remove();openExamenBlanc()">📝 Nouvel examen</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

let examenTimerInterval = null;
function startExamen(count) {
  const allQcm = MODULES.flatMap(m => (m.qcm || []).map(q => ({ ...q, _moduleLabel: m.label })));
  const questions = shuffle(allQcm).slice(0, count).map(q => ({ ...q, options: shuffle(q.options) }));
  state.examen = { questions, idx: 0, answers: [], locked: false, startTime: Date.now() };
  if (examenTimerInterval) clearInterval(examenTimerInterval);
  examenTimerInterval = setInterval(() => {
    const el = document.getElementById('examen-timer');
    if (!el || state.examen.idx >= state.examen.questions.length) { clearInterval(examenTimerInterval); return; }
    const elapsed = Math.round((Date.now() - state.examen.startTime) / 1000);
    const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const ss = (elapsed % 60).toString().padStart(2, '0');
    el.textContent = '⏱ ' + mm + ':' + ss;
  }, 1000);
  renderExamenQuestion(document.getElementById('examen-content'));
}

function renderExamenQuestion(el) {
  const { questions, idx } = state.examen;
  if (idx >= questions.length) { renderExamenResults(el); return; }
  const q = questions[idx];
  const total = questions.length;
  const elapsed = Math.max(0, Math.round((Date.now() - state.examen.startTime) / 1000));
  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');
  el.innerHTML = `
    <div class="qcm-container">
      <div class="qcm-progress">
        <div class="progress-bar-wrap" style="flex:1"><div class="progress-bar-fill" style="width:${Math.round((idx/total)*100)}%"></div></div>
        <span class="qcm-counter">${idx+1} / ${total}</span>
        <span class="examen-timer" id="examen-timer">⏱ ${mm}:${ss}</span>
      </div>
      <div class="examen-module-tag">${q._moduleLabel || ''}</div>
      <div class="qcm-question-block">
        <div class="qcm-question-num">Question ${idx+1}</div>
        <div class="qcm-question-text">${q.question}</div>
        <div class="qcm-options" role="radiogroup" id="qcm-opts">
          ${q.options.map((opt, i) => `
            <div class="qcm-option" data-idx="${i}" role="radio" aria-checked="false" tabindex="0">
              <span class="qcm-option-letter">${String.fromCharCode(65 + i)}</span>
              <span>${opt.text}</span>
            </div>`).join('')}
        </div>
        <div class="qcm-feedback" id="qcm-feedback" role="alert"></div>
      </div>
      <div class="qcm-nav">
        <button class="btn-primary" id="qcm-next-btn" style="display:none" onclick="examenNext()">
          ${idx + 1 < total ? 'Question suivante ' : 'Voir les résultats '}
        </button>
      </div>
    </div>`;
  document.querySelectorAll('.qcm-option').forEach(opt => {
    opt.addEventListener('click', () => examenSelect(parseInt(opt.dataset.idx), q));
    opt.addEventListener('keydown', e => e.key === 'Enter' && examenSelect(parseInt(opt.dataset.idx), q));
  });
}

function examenSelect(optIdx, q) {
  if (state.examen.locked) return;
  state.examen.locked = true;
  const opts = document.querySelectorAll('.qcm-option');
  opts.forEach(o => o.classList.add('locked'));
  const correct = q.options[optIdx].correct;
  opts[optIdx].classList.add(correct ? 'correct' : 'wrong');
  if (!correct) {
    const ci = q.options.findIndex(o => o.correct);
    if (ci >= 0) opts[ci].classList.add('correct');
  }
  state.examen.answers.push({ q, selectedIdx: optIdx, correct });
  const fb = document.getElementById('qcm-feedback');
  fb.className = 'qcm-feedback show ' + (correct ? 'good' : 'bad');
  fb.innerHTML = correct
    ? `✓ ${q.explication || 'Bonne réponse !'}`
    : `✗ ${q.explication || 'Mauvaise réponse. Bonne réponse : ' + q.options.find(o => o.correct)?.text}`;
  document.getElementById('qcm-next-btn').style.display = 'inline-flex';
}

function examenNext() {
  state.examen.idx++; state.examen.locked = false;
  renderExamenQuestion(document.getElementById('examen-content'));
}

function openLeaderboard() {
  showScreen('examen-screen');
  const el = document.getElementById('examen-content');
  document.getElementById('examen-meta').textContent = '🏆 Leaderboard';
  el.innerHTML = `<div class="examen-setup"><div style="font-size:48px;margin-bottom:12px">🏆</div><h2>Leaderboard</h2><div id="lb-content"></div></div>`;
  renderLeaderboard(document.getElementById('lb-content'));
}
function copyExamenResults() {
  const { answers, startTime } = state.examen;
  const total = answers.length;
  const score = answers.filter(a => a.correct).length;
  const pct = Math.round((score / total) * 100);
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const mm = Math.floor(elapsed / 60);
  const ss = elapsed % 60;
  const wrongs = answers.filter(a => !a.correct).map(a => `✗ ${a.q.question}\n  Réponse: ${a.q.options[a.selectedIdx]?.text}\n  Correct: ${a.q.options.find(o => o.correct)?.text}`).join('\n\n');
  const text = `📊 TSSR — Examen blanc\nScore: ${score}/${total} (${pct}%)\nTemps: ${mm}min ${ss}s\n\nErreurs:\n${wrongs || 'Aucune erreur !'}`;
  navigator.clipboard?.writeText(text).then(() => { const btn = document.querySelector('.copy-btn'); if (btn) { btn.textContent = '✓ Copié !'; setTimeout(() => btn.textContent = '📋 Copier résultats', 2000); } }).catch(() => {});
}
function startDailyChallenge() {
  const count = 10;
  const allQcm = MODULES.flatMap(m => (m.qcm || []).map(q => ({ ...q, _moduleLabel: m.label })));
  const questions = shuffle(allQcm).slice(0, count).map(q => ({ ...q, options: shuffle(q.options) }));
  state.examen = { questions, idx: 0, answers: [], locked: false, startTime: Date.now() };
  if (examenTimerInterval) clearInterval(examenTimerInterval);
  examenTimerInterval = setInterval(() => {
    const el = document.getElementById('examen-timer');
    if (!el || state.examen.idx >= state.examen.questions.length) { clearInterval(examenTimerInterval); return; }
    const elapsed = Math.round((Date.now() - state.examen.startTime) / 1000);
    const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const ss = (elapsed % 60).toString().padStart(2, '0');
    el.textContent = '⏱ ' + mm + ':' + ss;
  }, 1000);
  renderExamenQuestion(document.getElementById('examen-content'));
}
// ===== RÉVISION GLOBALE PAR ERREURS =====
function startGlobalWeakRevision() {
  const wrongs = store.get('qcm_wrong') || {};
  const weakQs = [];
  MODULES.forEach(m => {
    const modWrongs = wrongs[m.id] || {};
    (m.qcm || []).forEach(q => {
      if (modWrongs[q.id] && modWrongs[q.id] >= 1) {
        weakQs.push({ ...q, _moduleLabel: m.label, _moduleId: m.id });
      }
    });
  });
  if (!weakQs.length) { alert('✅ Aucune erreur enregistrée ! Continue comme ça.'); return; }
  const questions = shuffle(weakQs).slice(0, Math.min(weakQs.length, 30)).map(q => ({ ...q, options: shuffle(q.options) }));
  state.examen = { questions, idx: 0, answers: [], locked: false, startTime: Date.now() };
  if (examenTimerInterval) clearInterval(examenTimerInterval);
  examenTimerInterval = setInterval(() => {
    const el = document.getElementById('examen-timer');
    if (!el || state.examen.idx >= state.examen.questions.length) { clearInterval(examenTimerInterval); return; }
    const elapsed = Math.round((Date.now() - state.examen.startTime) / 1000);
    el.textContent = '⏱ ' + String(Math.floor(elapsed/60)).padStart(2,'0') + ':' + String(elapsed%60).padStart(2,'0');
  }, 1000);
  document.getElementById('examen-meta').textContent = '🌍 Révision globale erreurs';
  showScreen('examen-screen');
  renderExamenQuestion(document.getElementById('examen-content'));
}

function renderExamenResults(el) {
  const { answers, startTime } = state.examen;
  const total = answers.length;
  const score = answers.filter(a => a.correct).length;
  const pct = Math.round((score / total) * 100);
  addLB({ type: 'Examen blanc', score: `${score}/${total} (${pct}%)`, detail: `${total} questions · ${Math.floor((Date.now()-startTime)/60000)}min` });
  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');
  const emoji = pct >= 80 ? '[+]' : pct >= 60 ? '[~]' : '[-]';
  const msg = pct >= 80 ? 'Excellent !' : pct >= 60 ? 'Pas mal, continue !' : 'À retravailler...';
  const byModule = {};
  answers.forEach(a => {
    const ml = a.q._moduleLabel || 'Autre';
    if (!byModule[ml]) byModule[ml] = { total: 0, correct: 0 };
    byModule[ml].total++;
    if (a.correct) byModule[ml].correct++;
  });
  const moduleRows = Object.entries(byModule).sort((a,b) => {
    const pa = Math.round((a[1].correct/a[1].total)*100);
    const pb = Math.round((b[1].correct/b[1].total)*100);
    return pa - pb;
  }).map(([label, s]) => {
    const mpct = Math.round((s.correct / s.total) * 100);
    const color = mpct >= 80 ? 'var(--accent)' : mpct >= 60 ? '#f59e0b' : '#ef4444';
    return `<tr><td>${label}</td><td>${s.correct}/${s.total}</td><td style="color:${color};font-weight:700">${mpct}%</td></tr>`;
  }).join('');
  const errorsHtml = answers.filter(a => !a.correct).map(a => `
    <div class="qcm-error-item">
      <div class="examen-module-tag" style="margin-bottom:6px">${a.q._moduleLabel || ''}</div>
      <div class="qcm-error-q">${a.q.question}</div>
      <div class="qcm-error-your">✗ ${a.q.options[a.selectedIdx]?.text}</div>
      <div class="qcm-error-correct">✓ ${a.q.options.find(o => o.correct)?.text}</div>
      ${a.q.explication ? `<div style="font-size:12px;color:var(--text3);margin-top:6px">${a.q.explication}</div>` : ''}
    </div>`).join('');
  // Save attempt automatically
  saveExamenAttempt({ score, total, pct, elapsed, mm, ss, msg, errors: answers.filter(a => !a.correct).length, meta: document.getElementById('examen-meta')?.textContent || '' });
  el.innerHTML = `
    <div class="qcm-container">
      <div class="qcm-results">
        <div class="qcm-score-circle">
          <span class="qcm-score-num">${score}</span>
          <span class="qcm-score-denom">/ ${total}</span>
        </div>
        <h3>${emoji} ${msg}</h3>
        <p>${pct}% · ${mm}:${ss}</p>
        <div style="display:flex;gap:12px;justify-content:center;margin-bottom:32px;flex-wrap:wrap">
          <button class="btn-primary" onclick="openExamenBlanc()">Nouvel examen</button>
          <button class="btn-secondary copy-btn" onclick="copyExamenResults()">📋 Copier résultats</button>
          <button class="btn-secondary" onclick="openExamHistory()">📁 Mes examens</button>
          <button class="btn-secondary" onclick="renderHome()">Accueil</button>
        </div>
        ${moduleRows ? `
        <div class="examen-breakdown">
          <h4>Résultats par module</h4>
          <table class="examen-table">
            <thead><tr><th>Module</th><th>Score</th><th>%</th></tr></thead>
            <tbody>${moduleRows}</tbody>
          </table>
        </div>` : ''}
        ${errorsHtml ? `<div class="qcm-errors" style="margin-top:32px"><h4 style="margin-bottom:16px">À retravailler</h4>${errorsHtml}</div>` : ''}
      </div>
    </div>`;
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
  const diff = state.qcmDifficulty || 'all';
  let pool = m.qcm;
  if (diff === 'priorite') {
    pool = getQCMWeak(m);
    if (!pool.length) { pool = m.qcm; }
  } else if (diff !== 'all') {
    pool = pool.filter(q => q.difficulty === diff);
  }
  if (!pool.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">\u{2699}\u{FE0F}</span><h3>Aucune question ${diff}</h3><p>Ce module n'a pas de questions de difficulté "${diff}". Essaie un autre mode.</p><button class="btn-primary" style="margin-top:16px" onclick="state.qcmDifficulty='all';renderQCM(state.currentModule,document.getElementById('tab-content'))">Toutes les questions</button></div>`;
    return;
  }
  state.qcm = {
    questions: shuffle(pool).map(q => ({ ...q, options: shuffle(q.options) })),
    idx: 0, answers: [], locked: false, done: false, startTime: Date.now(),
  };
  if (state.qcmTimed) {
    const secs = state.qcmTimeLimit || 30;
    state.qcm.timeLeft = secs * state.qcm.questions.length;
    if (state.qcmTimerInterval) clearInterval(state.qcmTimerInterval);
    state.qcmTimerInterval = setInterval(() => {
      if (!state.qcm || state.qcm.done) { clearInterval(state.qcmTimerInterval); return; }
      state.qcm.timeLeft--;
      const el = document.getElementById('qcm-timer');
      if (el) {
        const m = Math.floor(state.qcm.timeLeft / 60);
        const s = state.qcm.timeLeft % 60;
        el.textContent = '⏱ ' + m.toString().padStart(2,'0') + ':' + s.toString().padStart(2,'0');
        if (state.qcm.timeLeft <= 10) el.style.color = 'var(--red)';
      }
      if (state.qcm.timeLeft <= 0) {
        clearInterval(state.qcmTimerInterval);
        state.qcm.done = true;
        renderQCMResults(document.getElementById('tab-content'), state.currentModule);
      }
    }, 1000);
  } else {
    if (state.qcmTimerInterval) { clearInterval(state.qcmTimerInterval); state.qcmTimerInterval = null; }
  }
  renderQCMQuestion(el, m);
}
function renderQCMQuestion(el, m) {
  const { questions, idx } = state.qcm;
  if (idx >= questions.length) { renderQCMResults(el, m); return; }
  const q = questions[idx];
  const total = questions.length;
  const diffBadges = { facile:'Facile', normal:'Normal', difficile:'Difficile', troubleshooter:'Troubleshooter', priorite:'Priorité' };
  const diffLabel = diffBadges[q.difficulty] || 'Normal';
  el.innerHTML = `
    <div class="qcm-container">
      <div class="qcm-diff-bar">
        <div class="qcm-diff-select">
          ${['all','facile','normal','difficile','troubleshooter','priorite'].map(d=>`
            <button class="qcm-diff-btn${(state.qcmDifficulty||'all')===d?' active':''}" onclick="state.qcmDifficulty='${d}';renderQCM(state.currentModule,document.getElementById('tab-content'))">${d==='all'?'Tout':diffBadges[d]||d}</button>
          `).join('')}
        </div>
        <button class="qcm-timer-toggle ${state.qcmTimed?'active':''}" onclick="state.qcmTimed=!state.qcmTimed;renderQCM(state.currentModule,document.getElementById('tab-content'))" title="Mode chronométré">⏱</button>
        <button class="qcm-diff-btn" onclick="startGlobalWeakRevision()" title="Révision globale de TOUTES mes erreurs" style="border-color:var(--red-dim);color:var(--red);font-size:12px">🌍 Erreurs globales</button>
      </div>
      <div class="qcm-progress">
        <div class="progress-bar-wrap" style="flex:1"><div class="progress-bar-fill" style="width:${Math.round((idx/total)*100)}%"></div></div>
        <span class="qcm-counter">${idx+1} / ${total}</span>
        ${state.qcmTimed ? `<span class="qcm-timer" id="qcm-timer">⏱ ${String(Math.floor((state.qcm.timeLeft||0)/60)).padStart(2,'0')}:${String((state.qcm.timeLeft||0)%60).padStart(2,'0')}</span>` : ''}
      </div>
      <div class="qcm-question-block">
        <div class="qcm-question-num">Question ${idx+1} <span class="qcm-diff-badge diff-${q.difficulty||'normal'}">${diffLabel}</span></div>
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
        <button class="btn-secondary" id="qcm-skip-btn" onclick="qcmSkip()" title="Passer la question, à revoir plus tard">🤷 Je ne sais pas</button>
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
function qcmSkip() {
  if (state.qcm.locked) return;
  state.qcm.locked = true;
  const { questions, idx } = state.qcm;
  const q = questions[idx];
  state.qcm.answers.push({ q, selectedIdx: -1, correct: false, skipped: true });
  document.getElementById('qcm-skip-btn').style.display = 'none';
  const fb = document.getElementById('qcm-feedback');
  fb.className = 'qcm-feedback show';
  fb.innerHTML = '🤷 Passée — revue prioritaire dans tes erreurs';
  document.getElementById('qcm-next-btn').style.display = 'inline-flex';
  const modId = q._moduleId || state.currentModule?.id;
  if (modId) trackQCMAnswer({ id: modId }, q, false);
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
  answers.forEach(a => trackQCMAnswer(m, a.q, a.correct));
  const wrongCount = answers.filter(a=>!a.correct).length;
  addLB({ type: `QCM: ${m.label}`, score: `${score}/${total} (${pct}%)`, detail: `${state.qcmDifficulty==='all'?'Tous niveaux':state.qcmDifficulty} · ${mm}:${ss}` });
  const emoji = pct>=80?'[+]':pct>=60?'[~]':'[-]';
  const msg = pct>=80?'Excellent !':pct>=60?'Pas mal, continue !':'À retravailler...';
  const diffLabel = state.qcmDifficulty==='all'?'Toutes difficultés':{facile:'Facile',normal:'Normal',difficile:'Difficile',troubleshooter:'Troubleshooter',priorite:'Priorité'}[state.qcmDifficulty]||'Toutes';
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
        <p>${pct}% · ${mm}:${ss} · Mode : ${diffLabel}</p>
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
  } else if (type === 'cisco') {
    return {
      type: 'cisco',
      ciscoMode: 'user',
      ciscoCtx: null,
      hostname: 'R1',
      history: [],
      histIdx: -1,
      tabBuf: '',
      enableSecret: 'cisco',
      configChanged: false,
      savedConfig: false,
      servicePasswordEncryption: false,
      interfaces: {
        'GigabitEthernet0/0': { desc: 'LAN', ip: '192.168.1.1', mask: '255.255.255.0',  adminDown: false, mac: 'fa16.3e00.0001' },
        'GigabitEthernet0/1': { desc: 'WAN', ip: '10.0.0.1',    mask: '255.255.255.252', adminDown: false, mac: 'fa16.3e00.0002' },
        'GigabitEthernet0/2': { desc: '',    ip: null,           mask: null,             adminDown: true,  mac: 'fa16.3e00.0003' },
        'Loopback0':           { desc: 'Router-ID', ip: '1.1.1.1', mask: '255.255.255.255', adminDown: false, mac: null },
      },
      vlans: {
        1:  { name: 'default',    status: 'active' },
        10: { name: 'Management', status: 'active' },
        20: { name: 'Serveurs',   status: 'active' },
        99: { name: 'Native',     status: 'active' },
      },
      routes: [
        { proto: 'C', network: '1.1.1.1',     mask: '255.255.255.255', nh: null, iface: 'Loopback0',           ad: 0, metric: 0 },
        { proto: 'C', network: '10.0.0.0',    mask: '255.255.255.252', nh: null, iface: 'GigabitEthernet0/1',  ad: 0, metric: 0 },
        { proto: 'C', network: '192.168.1.0', mask: '255.255.255.0',   nh: null, iface: 'GigabitEthernet0/0',  ad: 0, metric: 0 },
        { proto: 'S*', network: '0.0.0.0',   mask: '0.0.0.0',          nh: '10.0.0.2', iface: 'GigabitEthernet0/1', ad: 1, metric: 0 },
        { proto: 'O', network: '172.16.0.0', mask: '255.255.0.0',       nh: '10.0.0.2', iface: 'GigabitEthernet0/1', ad: 110, metric: 2 },
      ],
      ospfNeighbors: [
        { id: '2.2.2.2', pri: 1, state: 'FULL/DR',  addr: '10.0.0.2', iface: 'GigabitEthernet0/1', uptime: '00:12:34' },
      ],
      acls: {},
      linePasswords: {},
      motd: null,
      ospfProcess: 1,
      nat: {
        translations: [],
        overload: false,
        pat: false,
        pool: null,
        sourceList: null,
        statics: [],
        insideIfs: [],
        outsideIfs: [],
      },
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

  const isCisco = type === 'cisco';
  const isWin = type === 'windows' || type === 'cmd';
  const isCmd = type === 'cmd';
  const title = isCisco ? ` Cisco IOS — ${cliState.hostname}` : isCmd ? ' Invite de commandes — cmd.exe' : (isWin ? ' Windows PowerShell' : ' Bash — ' + cliState.host);
  const headerClass = isCisco ? 'cli-header-cisco' : isWin ? 'cli-header-win' : 'cli-header-linux';
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
            ${isCisco
              ? `<span>Modes :</span>
                 <code>enable</code><code>conf t</code><code>end</code><code>exit</code>
                 &nbsp;·&nbsp;<span>Show :</span>
                 <code>sh run</code><code>sh ip int br</code><code>sh ip route</code><code>sh vlan br</code><code>sh ip ospf nei</code>
                 &nbsp;·&nbsp;<span>Config :</span>
                 <code>hostname</code><code>interface</code><code>ip address</code><code>no shutdown</code><code>ip route</code><code>vlan</code>
                 &nbsp;·&nbsp;<code style="color:#e84040">tp</code> TPs guidés &nbsp;·&nbsp;<code style="color:#e84040">device switch</code> Switch L2
                 &nbsp;·&nbsp;<code>?</code> aide`
              : isCmd
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

  cliPrint(isCisco
    ? `<span style="color:#e84040;font-weight:700">Cisco IOS Simulator — ${cliState.hostname}</span>
Router R1 — IOS Version 15.4(3)M2
Processeur : Cisco 3925 Series · RAM : 512 MB

<span style="color:#e84040">tp</span>             → TPs guidés (config-base / ospf / vlan / acl)
<span style="color:#e84040">device switch</span>  → Passe en switch Catalyst 2960 (L2)
<span style="color:#e84040">?</span>              → Aide commandes
<span style="color:#e84040">enable</span>         → Mode privilégié (mdp: cisco)

<span style="color:#888">Routeur configuré : 4 interfaces · OSPF actif · route statique par défaut</span>`
    : isCmd
    ? `Microsoft Windows [Version 10.0.19045]\n(c) Microsoft Corporation. Tous droits réservés.\n\nTape <span style="color:#aaa">help</span> · <span style="color:var(--blue)">tp</span> pour les TP guidés\n`
    : isWin
    ? `<span style="color:var(--blue)">Windows PowerShell</span>\nCopyright (C) Microsoft Corporation.\n\nTape <span style="color:var(--blue)">help</span> · <span style="color:var(--blue)">tp</span> pour les TP guidés\n<span style="color:var(--accent)">NetRunner 2.0</span> — 20 missions PowerShell. Tape <strong>tp netrunner</strong> pour commencer.\n`
    : `<span style="color:var(--accent)">Bienvenue sur ${cliState.host}</span> — Debian GNU/Linux\nConnecté : <span style="color:var(--accent)">${cliState.user}</span>\nTape <span style="color:var(--accent)">help</span> · <span style="color:var(--accent)">tp</span> pour les TP guidés\n <span style="color:var(--accent)">GameShell TSSR</span> — 40 missions pour maîtriser Linux. Tape <strong>tp gameshell</strong> pour commencer.\n`
  );

  const input = document.getElementById('cli-input');
  input.addEventListener('keydown', cliKeydown);
  input.focus();
}

function cliPrompt() {
  if (!cliState) return '';
  if (cliState.type === 'cisco') {
    const h = cliState.hostname;
    const mode = cliState.ciscoMode;
    const ctx = cliState.ciscoCtx;
    if (mode === 'user')          return `<span class="cli-ps-cisco-host">${h}</span><span class="cli-ps-cisco-gt">&gt;</span>`;
    if (mode === 'priv')          return `<span class="cli-ps-cisco-host">${h}</span><span class="cli-ps-cisco-hash">#</span>`;
    if (mode === 'config')        return `<span class="cli-ps-cisco-host">${h}</span><span class="cli-ps-cisco-cfg">(config)</span><span class="cli-ps-cisco-hash">#</span>`;
    if (mode === 'config-if')     return `<span class="cli-ps-cisco-host">${h}</span><span class="cli-ps-cisco-cfg">(config-if)</span><span class="cli-ps-cisco-hash">#</span>`;
    if (mode === 'config-vlan')   return `<span class="cli-ps-cisco-host">${h}</span><span class="cli-ps-cisco-cfg">(config-vlan)</span><span class="cli-ps-cisco-hash">#</span>`;
    if (mode === 'config-router') return `<span class="cli-ps-cisco-host">${h}</span><span class="cli-ps-cisco-cfg">(config-router)</span><span class="cli-ps-cisco-hash">#</span>`;
    if (mode === 'config-line')   return `<span class="cli-ps-cisco-host">${h}</span><span class="cli-ps-cisco-cfg">(config-line)</span><span class="cli-ps-cisco-hash">#</span>`;
    return `<span class="cli-ps-cisco-host">${h}</span><span class="cli-ps-cisco-hash">#</span>`;
  } else if (cliState.type === 'linux') {
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
    // ===== NETRUNNER 2.0 — 20 missions PowerShell =====
    {
      id: 'netrunner',
      title: 'NetRunner 2.0 — 20 missions PowerShell',
      icon: '[N]',
      desc: '20 missions PowerShell progressives : fichiers, processus, services, AD, logs, pare-feu.',
      autosave: true,
      levels: [
        { at: 4,  label: 'Niveau 1 — Découverte',   emoji: '' },
        { at: 8,  label: 'Niveau 2 — Fichiers',      emoji: '' },
        { at: 12, label: 'Niveau 3 — Services',      emoji: '' },
        { at: 16, label: 'Niveau 4 — Sécurité',      emoji: '' },
      ],
      onStart: () => {
        const saved = store.get('netrunner_progress');
        if (saved && saved.step > 0 && saved.step < 20) {
          scenarioState.step = saved.step;
          cliPrint(`<span style="color:var(--blue)"> Reprise NetRunner depuis la mission ${saved.step + 1}/20.</span>`);
        } else {
          cliPrint(`<div style="color:var(--blue);font-family:monospace;white-space:pre;line-height:1.5">
  N E T R U N N E R   2 . 0
  20 missions PowerShell

  Niv.1 Découverte   · missions  1-4
  Niv.2 Fichiers     · missions  5-8
  Niv.3 Services     · missions  9-12
  Niv.4 Sécurité     · missions 13-16
  Niv.5 Expert       · missions 17-20
</div>
Bienvenue. Tape tp quit pour abandonner.</span>`);
        }
      },
      onEnd: () => {
        store.set('netrunner_progress', null);
        addLB({ type: 'NetRunner', score: '20/20', detail: '20 missions PowerShell complétées' });
      },
      steps: [
        // Niveau 1 — Découverte
        { instr: ' Niv.1 Mission 1/20 — Affiche ton répertoire courant.', hint: 'Get-Location', check: c => /^get-location$/i.test(c.trim()) || /^gl$/i.test(c.trim()) || /^pwd$/i.test(c.trim()) },
        { instr: 'Mission 2/20 — Liste les fichiers du répertoire courant.', hint: 'Get-ChildItem', check: c => /^get-childitem/i.test(c.trim()) || /^gci$/i.test(c.trim()) || /^ls$/i.test(c.trim()) || /^dir$/i.test(c.trim()) },
        { instr: 'Mission 3/20 — Crée un dossier nommé "Mission".', hint: 'New-Item -ItemType Directory -Name Mission', check: c => /^new-item\b.*Directory.*Mission/i.test(c.trim()) || /^ni\b.*Mission/i.test(c.trim()) || /^mkdir\s+Mission$/i.test(c.trim()) },
        { instr: 'Mission 4/20 — Crée un fichier "note.txt" avec le texte "NetRunner".', hint: 'Set-Content -Path note.txt -Value "NetRunner"', check: c => /set-content.*note\.txt/i.test(c.trim()) || /echo.*>.*note\.txt/i.test(c.trim()) },
        // Niveau 2 — Fichiers
        { instr: ' Niv.2 Mission 5/20 — Affiche le contenu de note.txt.', hint: 'Get-Content note.txt', check: c => /^get-content\b.*note\.txt/i.test(c.trim()) || /^gc\b.*note\.txt/i.test(c.trim()) || /^cat\b.*note\.txt/i.test(c.trim()) || /^type\b.*note\.txt/i.test(c.trim()) },
        { instr: 'Mission 6/20 — Copie note.txt dans Mission/.', hint: 'Copy-Item note.txt Mission/', check: c => /^copy-item\b.*note\.txt.*Mission/i.test(c.trim()) || /^cp\b.*note\.txt.*Mission/i.test(c.trim()) || /^copy\b.*note\.txt.*Mission/i.test(c.trim()) },
        { instr: 'Mission 7/20 — Liste les processus en cours (tous).', hint: 'Get-Process', check: c => /^get-process/i.test(c.trim()) || /^gps$/i.test(c.trim()) || /^ps$/i.test(c.trim()) },
        { instr: 'Mission 8/20 — Trouve le processus "notepad" et arrête-le.', hint: 'Stop-Process -Name notepad', check: c => /^stop-process\b.*notepad/i.test(c.trim()) || /^spsv\b.*notepad/i.test(c.trim()) || /^kill\b.*notepad/i.test(c.trim()) || /^taskkill\b.*notepad/i.test(c.trim()) },
        // Niveau 3 — Services
        { instr: ' Niv.3 Mission 9/20 — Liste tous les services système.', hint: 'Get-Service', check: c => /^get-service/i.test(c.trim()) || /^gsv$/i.test(c.trim()) },
        { instr: 'Mission 10/20 — Récupère le statut du service "Spooler".', hint: 'Get-Service spooler', check: c => /^get-service\b.*spooler/i.test(c.trim()) || /^gsv\b.*spooler/i.test(c.trim()) },
        { instr: 'Mission 11/20 — Redémarre le service "Spooler".', hint: 'Restart-Service spooler', check: c => /^restart-service\b.*spooler/i.test(c.trim()) || /^start-service\b.*spooler/i.test(c.trim()) },
        { instr: 'Mission 12/20 — Vérifie les 5 dernières entrées du journal système.', hint: 'Get-EventLog -LogName System -Newest 5', check: c => /^get-eventlog\b.*System/i.test(c.trim()) || /^get-winevent\b.*System/i.test(c.trim()) },
        // Niveau 4 — Sécurité
        { instr: ' Niv.4 Mission 13/20 — Affiche la config IP de la carte réseau.', hint: 'Get-NetIPConfiguration', check: c => /^get-netip/i.test(c.trim()) || /^ipconfig(\b|$)/i.test(c.trim()) },
        { instr: 'Mission 14/20 — Affiche la table de routage.', hint: 'Get-NetRoute', check: c => /^get-netroute/i.test(c.trim()) || /^route\s+print/i.test(c.trim()) },
        { instr: 'Mission 15/20 — Liste les règles du pare-feu Windows.', hint: 'Get-NetFirewallRule', check: c => /^get-netfirewallrule/i.test(c.trim()) },
        { instr: 'Mission 16/20 — Crée une règle pour ouvrir le port 8080 (TCP).', hint: 'New-NetFirewallRule -DisplayName "WebApp" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow', check: c => /^new-netfirewallrule\b.*8080/i.test(c.trim()) },
        // Niveau 5 — Expert
        { instr: ' Niv.5 Mission 17/20 — Affiche les partages SMB du serveur.', hint: 'Get-SmbShare', check: c => /^get-smbshare/i.test(c.trim()) || /^net\s+share/i.test(c.trim()) },
        { instr: 'Mission 18/20 — Affiche les informations du BIOS.', hint: 'Get-ComputerInfo', check: c => /^get-computerinfo/i.test(c.trim()) || /^gcim\b.*computersystem/i.test(c.trim()) || /^gcim\b.*bios/i.test(c.trim()) },
        { instr: 'Mission 19/20 — Vérifie l état des mises à jour Windows.', hint: 'Get-WindowsUpdateLog', check: c => /^get-windows/i.test(c.trim()) || /^get-hotfix/i.test(c.trim()) || /^usoclient\b/i.test(c.trim()) },
        { instr: 'Mission 20/20 — Final : exécute ipconfig /all et vérifie la configuration complète.', hint: 'ipconfig /all', check: c => /^ipconfig\s+\/all/i.test(c.trim()) || /^get-netipconfiguration\s+-detailed/i.test(c.trim()) },
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
      icon: '[G]',
      desc: 'Missions progressives — 40 étapes pour maîtriser le terminal Linux.',
      autosave: true,
      levels: [
        { at: 5,  label: 'Niveau 1 — Découverte',          emoji: '' },
        { at: 10, label: 'Niveau 2 — Fichiers',             emoji: '' },
        { at: 15, label: 'Niveau 3 — Exploration',          emoji: '' },
        { at: 20, label: 'Niveau 4 — Permissions',          emoji: '' },
        { at: 25, label: 'Niveau 5 — Processus & Services', emoji: '' },
        { at: 30, label: 'Niveau 6 — Maitre Linux',         emoji: '' },
        { at: 35, label: 'Niveau 7 — Expert',               emoji: '' },
      ],
      onStart: () => {
        const saved = store.get('gameshell_progress');
        if (saved && saved.step > 0 && saved.step < 40) {
          scenarioState.step = saved.step;
          cliPrint(`<span style="color:var(--accent)"> Reprise depuis la mission ${saved.step + 1}/40 — progression restaurée.</span>\n<span style="color:var(--text2)">Tape <strong>tp quit</strong> pour abandonner · <strong>tp gameshell</strong> + suppr local pour tout recommencer.</span>`);
        } else {
          cliPrint(`<div style="color:var(--accent);font-family:monospace;white-space:pre;line-height:1.5">

    G A M E S H E L L   T S S R                    
       40 missions pour maîtriser Linux                

  Niv.1 Découverte    · missions  1-5                 
  Niv.2 Fichiers      · missions  6-10                
  Niv.3 Exploration   · missions 11-15                
  Niv.4 Permissions   · missions 16-20                
  Niv.5 Processus     · missions 21-25                
  Niv.6 Maître        · missions 26-30                
  Niv.7 Expert        · missions 31-40                
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
          instr: ' Niv.1 Mission 1/40 — Affiche ton répertoire courant.',
          hint: 'pwd',
          check: c => /^pwd$/i.test(c.trim()),
          successMsg: 'pwd = Print Working Directory. Affiche le chemin absolu où tu te trouves.',
        },
        {
          instr: 'Mission 2/40 — Liste le contenu du répertoire courant.',
          hint: 'ls',
          check: c => /^ls(\s|$)/i.test(c.trim()),
          successMsg: 'ls liste les fichiers et dossiers. -l = détails, -a = fichiers cachés, -h = tailles lisibles.',
        },
        {
          instr: 'Mission 3/40 — Déplace-toi dans /etc.',
          hint: 'cd /etc',
          check: c => /^cd\s+\/etc(\/|$|\s|)$/.test(c.trim()),
          successMsg: '/etc contient les fichiers de configuration système. Le répertoire le plus important pour un admin.',
        },
        {
          instr: 'Mission 4/40 — Reviens dans ton home avec le raccourci ~.',
          hint: 'cd ~',
          check: c => /^cd\s*(~|\/home\/)/.test(c.trim()),
          successMsg: '~ est un alias vers /home/tssr. cd sans argument fait la même chose.',
        },
        {
          instr: 'Mission 5/40 — Liste TOUS les fichiers, y compris les cachés (commençant par .).',
          hint: 'ls -a',
          check: c => /^ls\b.*-[a-zA-Z]*a/.test(c.trim()),
          successMsg: 'Les fichiers cachés commencent par un point : .bashrc, .profile, .ssh — invisibles avec ls normal.',
        },
        //  NIVEAU 2 — Fichiers 
        {
          instr: ' Niv.2 Mission 6/40 — Crée un dossier nommé "mission".',
          hint: 'mkdir mission',
          check: c => /^mkdir\s+mission$/.test(c.trim()),
          successMsg: 'mkdir = Make Directory. mkdir -p a/b/c crée toute l\'arborescence d\'un coup.',
        },
        {
          instr: 'Mission 7/40 — Entre dans le dossier "mission".',
          hint: 'cd mission',
          check: c => /^cd\s+mission$/.test(c.trim()),
          successMsg: 'Tu es dans /home/tssr/mission. Tape pwd pour confirmer ta position.',
        },
        {
          instr: 'Mission 8/40 — Crée un fichier vide nommé "objectif.txt".',
          hint: 'touch objectif.txt',
          check: c => /^touch\s+objectif\.txt$/.test(c.trim()),
          successMsg: 'touch crée un fichier vide ou met à jour la date d\'un fichier existant.',
        },
        {
          instr: 'Mission 9/40 — Écris "GameShell" dans objectif.txt avec echo et la redirection >.',
          hint: 'echo "GameShell" > objectif.txt',
          check: c => /^echo\b/.test(c.trim()) && c.includes('>') && /objectif\.txt/.test(c),
          successMsg: '> redirige stdout vers un fichier (écrase le contenu). >> ajoute sans écraser.',
        },
        {
          instr: 'Mission 10/40 — Affiche le contenu de objectif.txt avec cat.',
          hint: 'cat objectif.txt',
          check: c => /^cat\s+objectif\.txt/.test(c.trim()),
          successMsg: 'cat = concatenate. Pour les gros fichiers, préfère less (pagination avec q pour quitter).',
        },
        //  NIVEAU 3 — Exploration 
        {
          instr: ' Niv.3 Mission 11/40 — Affiche le nom de cette machine via /etc/hostname.',
          hint: 'cat /etc/hostname',
          check: c => /^cat\b/.test(c.trim()) && /hostname/.test(c),
          successMsg: '/etc/hostname contient le nom court de la machine. Modifiable avec hostnamectl.',
        },
        {
          instr: 'Mission 12/40 — Cherche "tssr" dans /etc/passwd avec grep.',
          hint: 'grep "tssr" /etc/passwd',
          check: c => /^grep\b/.test(c.trim()) && /\/etc\/passwd/.test(c),
          successMsg: '/etc/passwd : login:x:UID:GID:gecos:home:shell. Pas de mot de passe en clair — ils sont dans /etc/shadow.',
        },
        {
          instr: 'Mission 13/40 — Compte les lignes de /etc/passwd avec wc -l.',
          hint: 'wc -l /etc/passwd',
          check: c => /^wc\b/.test(c.trim()) && c.includes('/etc/passwd'),
          successMsg: 'wc = word count. -l lignes, -w mots, -c octets. Chaque ligne = un compte utilisateur.',
        },
        {
          instr: 'Mission 14/40 — Affiche les 3 premières lignes de /etc/passwd avec head.',
          hint: 'head -3 /etc/passwd',
          check: c => /^head\b/.test(c.trim()) && c.includes('/etc/passwd'),
          successMsg: 'head affiche le début d\'un fichier. tail fait l\'inverse. tail -f suit un fichier en temps réel.',
        },
        {
          instr: 'Mission 15/40 — Copie objectif.txt en sauvegarde.txt avec cp.',
          hint: 'cp objectif.txt sauvegarde.txt',
          check: c => /^cp\s+objectif\.txt\s+sauvegarde\.txt/.test(c.trim()),
          successMsg: 'cp copie un fichier. cp -r pour les répertoires. L\'original est conservé.',
        },
        //  NIVEAU 4 — Permissions 
        {
          instr: ' Niv.4 Mission 16/40 — Affiche les permissions des fichiers avec ls -l.',
          hint: 'ls -l',
          check: c => /^ls\b.*-[a-zA-Z]*l/.test(c.trim()),
          successMsg: 'Format : -rw-r--r-- 1 user group size date nom. Les 3 triplets rwx = propriétaire, groupe, autres.',
        },
        {
          instr: 'Mission 17/40 — Rends objectif.txt exécutable avec chmod +x.',
          hint: 'chmod +x objectif.txt',
          check: c => /^chmod\b/.test(c.trim()) && /\+x/.test(c) && /objectif\.txt/.test(c),
          successMsg: '+x ajoute l\'exécution pour tous. u+x = propriétaire seulement. r=4, w=2, x=1.',
        },
        {
          instr: 'Mission 18/40 — Mets les permissions 644 (rw-r--r--) sur sauvegarde.txt.',
          hint: 'chmod 644 sauvegarde.txt',
          check: c => /^chmod\s+644\s+sauvegarde\.txt/.test(c.trim()),
          successMsg: '644 = rw-r--r-- : propriétaire lit+écrit, groupe et autres lisent. Standard pour un fichier de config.',
        },
        {
          instr: 'Mission 19/40 — Affiche permissions ET fichiers cachés avec ls -la.',
          hint: 'ls -la',
          check: c => /^ls\b/.test(c.trim()) && /-[a-zA-Z]*l/.test(c) && /-[a-zA-Z]*a/.test(c) || /^ls\s+-(la|al)$/.test(c.trim()),
          successMsg: '-l + -a ensemble : tout voir. Les fichiers . (répertoire courant) et .. (parent) sont toujours là.',
        },
        {
          instr: 'Mission 20/40 — Crée un lien symbolique "lien.txt" vers objectif.txt avec ln -s.',
          hint: 'ln -s objectif.txt lien.txt',
          check: c => /^ln\s+-s\b/.test(c.trim()) && /objectif\.txt/.test(c),
          successMsg: 'Un lien symbolique est un raccourci. ls -l affiche -> objectif.txt. Supprimer le lien ne touche pas la cible.',
        },
        //  NIVEAU 5 — Processus & Services 
        {
          instr: ' Niv.5 Mission 21/40 — Affiche tous les processus en cours avec ps aux.',
          hint: 'ps aux',
          check: c => /^ps\b/.test(c.trim()) && /aux/.test(c),
          successMsg: 'a = tous utilisateurs, u = format lisible, x = inclure sans terminal. PID = identifiant unique du processus.',
        },
        {
          instr: 'Mission 22/40 — Filtre les processus bash avec un pipe : ps aux | grep bash.',
          hint: 'ps aux | grep bash',
          check: c => /^ps\b/.test(c.trim()) && /\|\s*grep\b/.test(c) && /bash/.test(c),
          successMsg: 'Le pipe | enchaîne les commandes : stdout de gauche  stdin de droite. Fondement du shell Unix.',
        },
        {
          instr: 'Mission 23/40 — Vérifie l\'état du service SSH avec systemctl status.',
          hint: 'systemctl status ssh',
          check: c => /^(sudo\s+)?systemctl\s+status\s+(ssh|sshd)/i.test(c.trim()),
          successMsg: 'systemd gère les services. "Active: running" = opérationnel. "enabled" = démarrage auto au boot.',
        },
        {
          instr: 'Mission 24/40 — Affiche les ports ouverts avec netstat ou ss.',
          hint: 'netstat -tlnp',
          check: c => /^netstat\b/.test(c.trim()) || /^ss\b/.test(c.trim()),
          successMsg: '-t TCP, -l listening, -n numérique, -p processus. Port 22 = SSH, 80 = HTTP, 443 = HTTPS.',
        },
        {
          instr: 'Mission 25/40 — Affiche la configuration réseau avec ip a.',
          hint: 'ip a',
          check: c => /^ip\s+(a|addr)\b/i.test(c.trim()) || /^ifconfig\b/i.test(c.trim()),
          successMsg: 'ip addr remplace l\'ancien ifconfig. lo = loopback 127.0.0.1, eth0 = carte réseau principale.',
        },
        //  NIVEAU 6 — Maître du terminal 
        {
          instr: ' Niv.6 Mission 26/40 — Lance "ls /root 2>/dev/null" pour supprimer silencieusement les erreurs.',
          hint: 'ls /root 2>/dev/null',
          check: c => /2>\s*\/dev\/null/.test(c),
          successMsg: '2>/dev/null envoie stderr dans le néant. Utile dans les scripts pour ignorer les erreurs non critiques.',
        },
        {
          instr: 'Mission 27/40 — Trouve tous les fichiers .txt avec find, en supprimant les erreurs de permission.',
          hint: 'find / -name "*.txt" 2>/dev/null',
          check: c => /^find\b/.test(c.trim()) && /-name\b/.test(c) && /\.txt/.test(c),
          successMsg: 'find parcourt l\'arborescence récursivement. -type f fichiers, -mtime +7 modifiés >7 jours, -size +1M >1 Mo.',
        },
        {
          instr: 'Mission 28/40 — Trie le contenu de /etc/passwd alphabétiquement avec sort.',
          hint: 'sort /etc/passwd',
          check: c => /^sort\b/.test(c.trim()),
          successMsg: 'sort trie les lignes. -r = ordre inverse, -n = numérique, -t: -k3 = tri sur le 3ème champ séparé par :.',
        },
        {
          instr: 'Mission 29/40 — Combine sort et uniq pour trier et supprimer les doublons.',
          hint: 'sort /etc/passwd | uniq',
          check: c => /^sort\b/.test(c.trim()) && /\|\s*uniq\b/.test(c),
          successMsg: 'uniq supprime les lignes consécutives identiques — toujours précédé de sort. uniq -c compte les occurrences.',
        },
        {
          instr: 'Mission 30/40  — Pipe ultime : extrait les users bash  cat /etc/passwd | grep bash | cut -d: -f1 | sort',
          hint: 'cat /etc/passwd | grep bash | cut -d: -f1 | sort',
          check: c => /grep\b/.test(c) && /cut\b/.test(c) && /sort\b/.test(c) && (c.match(/\|/g)||[]).length >= 2,
          successMsg: ' MISSION ACCOMPLIE ! grep filtre, cut extrait une colonne, sort trie.',
        },
        // Niveau 7 — Expert
        { instr: ' Niv.7 Mission 31/40 — Affiche la quantité de RAM libre avec free -h.', hint: 'free -h', check: c => /^free\b/.test(c.trim()), successMsg: 'free -h = RAM totale/used/free. free -m en Mo. watch -n1 free surveille en continu.' },
        { instr: 'Mission 32/40 — Affiche l\'espace disque de toutes les partitions.', hint: 'df -h', check: c => /^df\b/.test(c.trim()), successMsg: 'df -h = disque lisible. df -i = inodes. du -sh dossier/ = taille dossier.' },
        { instr: 'Mission 33/40 — Affiche la table de routage IP complète.', hint: 'ip route', check: c => /^ip\s+(r|route)\b/.test(c.trim()), successMsg: 'ip route = table de routage. route -n aussi. defaut via 192.168.1.1 = passerelle.' },
        { instr: 'Mission 34/40 — Vérifie la connectivité à 8.8.8.8 avec ping (4 paquets).', hint: 'ping -c 4 8.8.8.8', check: c => /^ping\b.*-c\s*\d/.test(c.trim()), successMsg: 'ping -c 4 = 4 echo-requests. ping -c 1 = 1 paquet. ping -s 1472 = MTU test.' },
        { instr: 'Mission 35/40 — Trouve les 5 plus gros fichiers dans /var/log avec du et sort.', hint: 'du -sh /var/log/* | sort -rh | head -5', check: c => /du\b.*sort\b.*head\b/.test(c), successMsg: 'du -sh taille, sort -rh tri reverse humain, head -5 top 5. find + du = audit disque.' },
        { instr: 'Mission 36/40 — Cherche les lignes contenant "error" dans syslog avec grep -i (insensible casse).', hint: 'grep -i "error" /var/log/syslog 2>/dev/null', check: c => /^grep\b.*-i/.test(c.trim()), successMsg: 'grep -i = ignore casse. grep -v = inverse. grep -c = compte. grep -r = recursif.' },
        { instr: 'Mission 37/40 — Surveille les processus en temps réel avec les options de ps.', hint: 'ps aux | head -10', check: c => /ps\s+aux\b/.test(c.trim()), successMsg: 'ps aux = tous processus. ps -ef = format standard. top/htop interactif.' },
        { instr: 'Mission 38/40 — Affiche les connexions réseau actives TCP avec ss.', hint: 'ss -t', check: c => /^ss\b/.test(c.trim()), successMsg: 'ss -t = TCP. ss -u = UDP. ss -l = listening. ss -tuln = tout. netstat -tan aussi.' },
        { instr: 'Mission 39/40 — Trouve combien de coeurs CPU avec nproc et l\'utilisation CPU avec mpstat.', hint: 'nproc', check: c => /^nproc$/i.test(c.trim()), successMsg: 'nproc = nb coeurs. lscpu = détails. mpstat -P ALL = par coeur. uptime = load avg.' },
        { instr: 'Mission 40/40  — FINAL : exécute un diagnostic réseau complet : ping + ip route + ss -t + free -h + df -h en une commande composée.', hint: 'ping -c 1 8.8.8.8; ip route; ss -t; free -h; df -h', check: c => (c.match(/ping|ip route|ss|free|df/g)||[]).length >= 3, successMsg: ' MISSION ACCOMPLIE ! 40/40 — Tu maîtrises le terminal Linux. Tu as les compétences d\'un admin système.' },
      ],
    },
  ],
  cisco: [
    {
      id: 'config-base',
      title: 'Configuration de base IOS',
      desc: 'Sécurise un routeur vierge : hostname, enable secret, banner, sauvegarde.',
      steps: [
        { instr: 'Entre en mode privilégié.',                                      hint: 'enable',                           check: c => /^en(able)?$/i.test(c.trim()) },
        { instr: 'Entre en mode de configuration globale.',                        hint: 'configure terminal',               check: c => /^(conf(igure)?\s+t(erminal)?|conf\s*t)$/i.test(c.trim()) },
        { instr: 'Change le hostname en "R-TSSR".',                                hint: 'hostname R-TSSR',                  check: c => /^hostname\s+\S+/i.test(c.trim()) },
        { instr: 'Configure un enable secret "Admin123".',                         hint: 'enable secret Admin123',           check: c => /^enable\s+secret\s+\S+/i.test(c.trim()) },
        { instr: 'Active le chiffrement des mots de passe.',                       hint: 'service password-encryption',      check: c => /^service\s+password-encryption/i.test(c.trim()) },
        { instr: 'Configure une bannière MOTD (délimiteur #).',                    hint: 'banner motd # Acces autorise uniquement #', check: c => /^banner\s+motd\b/i.test(c.trim()) },
        { instr: 'Quitte le mode de configuration (retour au mode privilégié).',   hint: 'end',                              check: c => /^end$/i.test(c.trim()) },
        { instr: 'Sauvegarde la configuration en NVRAM.',                          hint: 'write memory',                     check: c => /^(write(\s+memory)?|wr|copy\s+run\S*\s+start\S*)$/i.test(c.trim()) },
      ],
    },
    {
      id: 'ospf',
      title: 'Configuration OSPF',
      desc: 'Active OSPF sur R1 : processus 1, router-id 1.1.1.1, annonce les réseaux LAN et WAN.',
      steps: [
        { instr: 'Entre en mode privilégié.',                                      hint: 'enable',                           check: c => /^en(able)?$/i.test(c.trim()) },
        { instr: 'Entre en mode de configuration globale.',                        hint: 'configure terminal',               check: c => /^(conf(igure)?\s+t(erminal)?|conf\s*t)$/i.test(c.trim()) },
        { instr: 'Lance le processus OSPF 1.',                                     hint: 'router ospf 1',                    check: c => /^router\s+ospf\s+\d+/i.test(c.trim()) },
        { instr: 'Définis le router-id 1.1.1.1.',                                  hint: 'router-id 1.1.1.1',                check: c => /^router-id\s+[\d.]+/i.test(c.trim()) },
        { instr: 'Annonce le réseau LAN 192.168.1.0/24 en area 0.',                hint: 'network 192.168.1.0 0.0.0.255 area 0', check: c => /^network\s+192\.168\.1\.\d\s+\S+\s+area\s+0/i.test(c.trim()) },
        { instr: 'Annonce le réseau WAN 10.0.0.0/30 en area 0.',                   hint: 'network 10.0.0.0 0.0.0.3 area 0', check: c => /^network\s+10\.\d+\.\d+\.\d\s+\S+\s+area\s+0/i.test(c.trim()) },
        { instr: 'Annonce le Loopback0 (1.1.1.1/32) en area 0.',                   hint: 'network 1.1.1.1 0.0.0.0 area 0',  check: c => /^network\s+1\.1\.1\.1\s+\S+\s+area\s+0/i.test(c.trim()) },
        { instr: 'Quitte le mode router OSPF.',                                    hint: 'exit',                             check: c => /^exit$/i.test(c.trim()) },
        { instr: 'Vérifie les voisins OSPF.',                                      hint: 'show ip ospf neighbor',            check: c => /^sh(ow)?\s+ip\s+ospf\s+(nei|neighbor)/i.test(c.trim()) },
        { instr: 'Sauvegarde la configuration.',                                   hint: 'write memory',                     check: c => /^(wr(ite)?(\s+memory)?|copy\s+run\S*\s+start\S*)$/i.test(c.trim()) },
      ],
    },
    {
      id: 'vlan',
      title: 'Configuration VLAN',
      desc: 'Crée VLAN 10 (Informatique) et VLAN 20 (Direction), configure un port en access et un port en trunk.',
      steps: [
        { instr: 'Entre en mode privilégié.',                                      hint: 'enable',                           check: c => /^en(able)?$/i.test(c.trim()) },
        { instr: 'Entre en mode de configuration globale.',                        hint: 'configure terminal',               check: c => /^(conf(igure)?\s+t(erminal)?|conf\s*t)$/i.test(c.trim()) },
        { instr: 'Crée le VLAN 10.',                                               hint: 'vlan 10',                          check: c => /^vlan\s+10$/i.test(c.trim()) },
        { instr: 'Nomme-le "Informatique".',                                       hint: 'name Informatique',                check: c => /^name\s+\S+/i.test(c.trim()) },
        { instr: 'Crée le VLAN 20.',                                               hint: 'vlan 20',                          check: c => /^vlan\s+20$/i.test(c.trim()) },
        { instr: 'Nomme-le "Direction".',                                          hint: 'name Direction',                   check: c => /^name\s+\S+/i.test(c.trim()) },
        { instr: 'Quitte et va sur l\'interface GigabitEthernet0/0.',              hint: 'interface GigabitEthernet0/0',     check: c => /^(interface|int)\s+(gi|g)?[a-z]*0?[\/.]?0/i.test(c.trim()) },
        { instr: 'Passe le port en mode access.',                                  hint: 'switchport mode access',           check: c => /^switchport\s+mode\s+access/i.test(c.trim()) },
        { instr: 'Affecte ce port au VLAN 10.',                                    hint: 'switchport access vlan 10',        check: c => /^switchport\s+access\s+vlan\s+10/i.test(c.trim()) },
        { instr: 'Va sur l\'interface GigabitEthernet0/1.',                        hint: 'interface GigabitEthernet0/1',     check: c => /^(interface|int)\s+(gi|g)?[a-z]*0?[\/.]?1/i.test(c.trim()) },
        { instr: 'Passe le port en mode trunk.',                                   hint: 'switchport mode trunk',            check: c => /^switchport\s+mode\s+trunk/i.test(c.trim()) },
        { instr: 'Quitte et vérifie les VLANs.',                                   hint: 'show vlan brief',                  check: c => /^sh(ow)?\s+vlan\s+(br|brief)/i.test(c.trim()) },
      ],
    },
    {
      id: 'acl',
      title: 'ACL Standard — Filtrage réseau',
      desc: 'Crée une ACL standard 10 : autorise le LAN 192.168.1.0/24, refuse tout le reste. Applique-la sur Gi0/1 sortant.',
      steps: [
        { instr: 'Entre en mode privilégié.',                                      hint: 'enable',                           check: c => /^en(able)?$/i.test(c.trim()) },
        { instr: 'Entre en mode de configuration globale.',                        hint: 'configure terminal',               check: c => /^(conf(igure)?\s+t(erminal)?|conf\s*t)$/i.test(c.trim()) },
        { instr: 'Permets le réseau 192.168.1.0/24 dans la liste 10 (wildcard 0.0.0.255).',  hint: 'access-list 10 permit 192.168.1.0 0.0.0.255', check: c => /^access-list\s+10\s+permit\s+192\.168\.1/i.test(c.trim()) },
        { instr: 'Refuse explicitement tout le reste.',                             hint: 'access-list 10 deny any',          check: c => /^access-list\s+10\s+deny\s+any/i.test(c.trim()) },
        { instr: 'Va sur l\'interface WAN GigabitEthernet0/1.',                    hint: 'interface GigabitEthernet0/1',     check: c => /^(interface|int)\s+(gi|g)?[a-z]*0?[\/.]?1/i.test(c.trim()) },
        { instr: 'Applique l\'ACL 10 en sortie (out).',                            hint: 'ip access-group 10 out',           check: c => /^ip\s+access-group\s+10\s+out/i.test(c.trim()) },
        { instr: 'Retourne au mode privilégié.',                                   hint: 'end',                              check: c => /^end$/i.test(c.trim()) },
        { instr: 'Vérifie les access-lists configurées.',                          hint: 'show access-lists',                check: c => /^sh(ow)?\s+(ip\s+)?access-list/i.test(c.trim()) },
        { instr: 'Sauvegarde la configuration.',                                   hint: 'write memory',                     check: c => /^(wr(ite)?(\s+memory)?|copy\s+run\S*\s+start\S*)$/i.test(c.trim()) },
      ],
    },
    {
      id: 'nat-pat',
      title: 'NAT PAT — Partage d\'adresse IP publique',
      desc: 'Configure un NAT PAT (overload) : pool, ACL, interfaces inside/outside, vérification et clear.',
      steps: [
        { instr: 'Entre en mode privilégié.',                                            hint: 'enable',                                            check: c => /^en(able)?$/i.test(c.trim()) },
        { instr: 'Entre en mode de configuration globale.',                              hint: 'configure terminal',                                check: c => /^(conf(igure)?\s+t(erminal)?|conf\s*t)$/i.test(c.trim()) },
        { instr: 'Crée un pool NAT "INET" : 203.0.113.1 à 203.0.113.10 /24.',          hint: 'ip nat pool INET 203.0.113.1 203.0.113.10 netmask 255.255.255.0', check: c => /^ip\s+nat\s+pool\s+\S+\s+\S+\s+\S+\s+netmask/i.test(c.trim()) },
        { instr: 'Crée l\'ACL 1 qui autorise le LAN 192.168.1.0/24.',                  hint: 'access-list 1 permit 192.168.1.0 0.0.0.255',        check: c => /^access-list\s+1\s+permit\s+192\.168/i.test(c.trim()) },
        { instr: 'Configure le NAT PAT : liste 1, pool INET, overload.',                hint: 'ip nat inside source list 1 pool INET overload',    check: c => /^ip\s+nat\s+inside\s+source\s+list\s+1.+overload/i.test(c.trim()) },
        { instr: 'Va sur l\'interface LAN GigabitEthernet0/0.',                         hint: 'interface GigabitEthernet0/0',                      check: c => /^(interface|int)\s+(gi|g)?[a-z]*0[\/.]?0/i.test(c.trim()) },
        { instr: 'Marque l\'interface comme "inside" pour le NAT.',                     hint: 'ip nat inside',                                     check: c => /^ip\s+nat\s+inside$/i.test(c.trim()) },
        { instr: 'Va sur l\'interface WAN GigabitEthernet0/1.',                         hint: 'interface GigabitEthernet0/1',                      check: c => /^(interface|int)\s+(gi|g)?[a-z]*0[\/.]?1/i.test(c.trim()) },
        { instr: 'Marque l\'interface comme "outside" pour le NAT.',                    hint: 'ip nat outside',                                    check: c => /^ip\s+nat\s+outside$/i.test(c.trim()) },
        { instr: 'Retourne au mode privilégié.',                                        hint: 'end',                                               check: c => /^end$/i.test(c.trim()) },
        { instr: 'Affiche les traductions NAT actives.',                                hint: 'show ip nat translations',                          check: c => /^sh(ow)?\s+ip\s+nat\s+tr/i.test(c.trim()) },
        { instr: 'Effectue un ping vers 8.8.8.8 pour générer du trafic NAT.',           hint: 'ping 8.8.8.8',                                      check: c => /^ping\s+8\.8\.8\.8/i.test(c.trim()) },
        { instr: 'Vérifie la table NAT — elle doit contenir une entrée dynamique.',     hint: 'show ip nat translations',                          check: c => /^sh(ow)?\s+ip\s+nat/i.test(c.trim()) },
        { instr: 'Sauvegarde la configuration.',                                        hint: 'write memory',                                      check: c => /^(wr(ite)?(\s+memory)?|copy\s+run\S*\s+start\S*)$/i.test(c.trim()) },
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

// ===== CISCO IOS CLI =====
// _ios : true si inp est un préfixe valide de kw (style IOS — n'importe quelle abréviation non ambiguë)
function _ios(inp, kw) {
  if (!inp || !kw) return false;
  return kw.toLowerCase().startsWith(inp.toLowerCase());
}

function cliExecCisco(raw) {
  const cs = cliState;
  const out = html => cliPrint(html);
  const err = msg  => cliPrint(`<span style="color:#ef4444">% ${msg}</span>`);
  const ok  = msg  => cliPrint(`<span style="color:#22c55e">${msg}</span>`);

  const trimmed = raw.trim();
  if (!trimmed) return;

  const parts = trimmed.split(/\s+/);
  const c0 = parts[0].toLowerCase();
  const c1 = (parts[1] || '').toLowerCase();
  const rest = parts.slice(1).join(' ');
  const mode = cs.ciscoMode;

  // -------- TP / device --------
  if (c0 === 'tp') { handleTPCommand(parts.slice(1), 'cisco'); return; }

  if (c0 === 'device') {
    if (_ios(c1, 'switch')) {
      cs.hostname = 'SW1'; cs.ciscoMode = 'user'; cs.ciscoCtx = null; cs.deviceType = 'switch';
      cs.interfaces = {};
      for (let i = 1; i <= 24; i++)
        cs.interfaces[`FastEthernet0/${i}`] = { desc: '', ip: null, mask: null, adminDown: false, mac: `fa16.3e01.${String(i).padStart(4,'0')}`, swMode: 'access', accessVlan: 1 };
      cs.interfaces['GigabitEthernet0/1'] = { desc: 'Uplink vers R1',  ip: null, mask: null, adminDown: false, mac: 'fa16.3e01.0101', swMode: 'trunk' };
      cs.interfaces['GigabitEthernet0/2'] = { desc: 'Uplink vers SW2', ip: null, mask: null, adminDown: false, mac: 'fa16.3e01.0102', swMode: 'trunk' };
      cs.interfaces['Vlan1'] = { desc: 'Management', ip: '192.168.1.100', mask: '255.255.255.0', adminDown: false, mac: null };
      cs.routes = [{ proto: 'S*', network: '0.0.0.0', mask: '0.0.0.0', nh: '192.168.1.1', iface: 'Vlan1', ad: 1, metric: 0 }];
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      out(`<span style="color:#e84040;font-weight:700">Cisco Catalyst 2960 — SW1</span>\nSwitch L2 — IOS 12.2(55)SE10 — 24×Fa + 2×Gi uplinks\n<span style="color:#888">device router</span> pour revenir sur R1`);
    } else if (_ios(c1, 'router')) {
      Object.assign(cs, makeCLIState('cisco')); cs.ciscoMode = 'user';
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      out(`<span style="color:#e84040;font-weight:700">Cisco 3925 — R1</span>\nRouteur restauré — IOS 15.4(3)M2`);
    } else {
      out(`device <span style="color:#e84040">switch</span>  — Catalyst 2960 L2\ndevice <span style="color:#e84040">router</span>  — Routeur R1`);
    }
    return;
  }

  // -------- ? --------
  if (c0 === '?') {
    const help = {
      user:          ['enable','ping','traceroute','show','exit','?'],
      priv:          ['configure terminal','show','copy','write','reload','erase','debug','undebug','clear','ping','traceroute','disable','exit','?'],
      config:        ['hostname','interface','ip route','no','router ospf','vlan','enable secret','service password-encryption','banner motd','line','access-list','spanning-tree','ip routing','ip default-gateway','end','exit','?'],
      'config-if':   ['ip address','no ip address','shutdown','no shutdown','description','duplex','speed','switchport mode','switchport access vlan','switchport trunk','ip ospf','ip access-group','encapsulation','do','end','exit','?'],
      'config-vlan': ['name','state','no','do','end','exit','?'],
      'config-router':['network','router-id','passive-interface','default-information originate','no','do','end','exit','?'],
      'config-line': ['password','login','exec-timeout','logging synchronous','transport input','no','do','end','exit','?'],
    };
    out((help[mode]||[]).map(c=>`  <span style="color:#e84040">${c}</span>`).join('\n'));
    return;
  }

  // -------- terminal / cls --------
  if (_ios(c0,'terminal')) { return; }
  if (c0 === 'cls') { cliClear(); return; }

  // -------- PING --------
  if (_ios(c0,'ping')) {
    const target = parts[1];
    if (!target) { out(`Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ?, timeout is 2 seconds:\n.....`); return; }
    if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(target)) { err(`Translating "${target}"...domain server (255.255.255.255)\n% Unknown host or address`); return; }
    const known = { '192.168.1.254':true,'192.168.1.1':true,'10.0.0.2':true,'8.8.8.8':true,'1.1.1.1':true,'127.0.0.1':true };
    const success = known[target] || Math.random() > 0.25;
    const rtt = success ? `${Math.floor(Math.random()*3)+1}/${Math.floor(Math.random()*3)+2}/${Math.floor(Math.random()*5)+3}` : '—';
    out(`Type escape sequence to abort.\nSending 5, 100-byte ICMP Echos to ${target}, timeout is 2 seconds:\n<span style="color:${success?'#22c55e':'#ef4444'}">${success?'!!!!!':'.....'}
</span>Success rate is ${success?100:0} percent (${success?5:0}/5), round-trip min/avg/max = ${rtt} ms`);
    if (success) {
      // Compteurs ACL
      Object.values(cs.interfaces).forEach(iface => {
        if (iface.acl && iface.aclDir === 'out' && cs.acls[iface.acl]) {
          cs.acls[iface.acl].forEach(e => { if (!e.hits) e.hits = 0; e.hits += 5; });
        }
      });
      // NAT PAT : ajouter une entrée dynamique
      if (cs.nat && cs.nat.overload && cs.nat.insideIfs.length && cs.nat.outsideIfs.length) {
        const outsideIf = cs.interfaces[cs.nat.outsideIfs[0]];
        const globalIp  = outsideIf?.ip || '203.0.113.1';
        const port       = Math.floor(Math.random() * 40000) + 1024;
        cs.nat.translations.push({
          proto: 'icmp',
          insideLocal:  `192.168.1.10`,
          insideGlobal: `${globalIp}:${port}`,
          outsideLocal: target,
          outsideGlobal:target,
          static: false,
          ts: Date.now(),
        });
      }
    }
    return;
  }

  // -------- TRACEROUTE --------
  if (_ios(c0,'traceroute') || c0 === 'trace') {
    const target = parts[1] || '8.8.8.8';
    out(`Tracing the route to ${target}\n  1  10.0.0.2   <span style="color:#22c55e"> 2 msec  1 msec  1 msec</span>\n  2  172.16.0.1 <span style="color:#22c55e"> 5 msec  4 msec  5 msec</span>\n  3  ${target} <span style="color:#22c55e">10 msec  9 msec 11 msec</span>`);
    return;
  }

  // -------- do (exec depuis config mode) --------
  if (c0 === 'do') {
    const sub = (parts[1] || '').toLowerCase();
    if (_ios(sub,'show')) { _ciscoShow(cs, parts.slice(2), out, err); }
    else if (_ios(sub,'ping')) { cliExecCisco(parts.slice(1).join(' ')); }
    else if (_ios(sub,'write') || sub === 'wr') { cs.savedConfig = true; cs.configChanged = false; ok(`Building configuration...\n[OK]`); }
    else { err(`do: commande non supportée en mode config`); }
    return;
  }

  // -------- USER EXEC MODE --------
  if (mode === 'user') {
    if (_ios(c0,'enable')) {
      if (cs.enableSecret) {
        const pwd = prompt('Password:');
        if (pwd !== cs.enableSecret) { err('% Access denied'); return; }
      }
      cs.ciscoMode = 'priv';
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
    } else if (_ios(c0,'show')) {
      if (_ios(c1,'version')) { _ciscoShowVersion(out); }
      else { err(`% Command authorization failed — tapez enable`); }
    } else if (_ios(c0,'exit') || _ios(c0,'quit') || _ios(c0,'logout')) {
      out(`[Session terminée — Cisco IOS Simulator]`);
    } else { err(`% Invalid input detected — tapez ? pour l'aide`); }
    return;
  }

  // -------- PRIVILEGED EXEC MODE --------
  if (mode === 'priv') {
    if (_ios(c0,'disable'))    { cs.ciscoMode = 'user'; document.getElementById('cli-prompt').innerHTML = cliPrompt(); return; }
    if (_ios(c0,'exit') || _ios(c0,'logout')) { cs.ciscoMode = 'user'; document.getElementById('cli-prompt').innerHTML = cliPrompt(); return; }
    if (c0 === 'end')          { cs.ciscoMode = 'user'; document.getElementById('cli-prompt').innerHTML = cliPrompt(); return; }

    if (_ios(c0,'configure')) {
      if (!c1 || _ios(c1,'terminal')) {
        cs.ciscoMode = 'config';
        document.getElementById('cli-prompt').innerHTML = cliPrompt();
        out(`Enter configuration commands, one per line.  End with CNTL/Z.`);
      } else { err(`% Invalid input at: "${rest}"`); }
      return;
    }

    if (_ios(c0,'write') || c0 === 'wr' ||
        (_ios(c0,'copy') && (_ios(c1,'running-config') || _ios(c1,'run')) )) {
      cs.savedConfig = true; cs.configChanged = false;
      ok(`Building configuration...\n[OK]`);
      return;
    }

    if (_ios(c0,'erase')) {
      out(`Erasing the nvram filesystem will remove all configuration files! Continue? [confirm]`);
      cs.savedConfig = false; ok(`Erase of nvram: complete`);
      return;
    }

    if (_ios(c0,'reload')) {
      out(`Proceed with reload? [confirm]\nReloading...\n[Simulateur redémarré]`);
      const saved = makeCLIState('cisco');
      Object.assign(cliState, saved);
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      return;
    }

    if (_ios(c0,'debug')) {
      out(`*Debug activé — ${rest}`);
      setTimeout(() => {
        cliPrint(`*Jun 30 10:12:03.001: IP: s=192.168.1.10 (GigabitEthernet0/0) d=8.8.8.8, len=60, sending`);
        cliPrint(`*Jun 30 10:12:03.003: IP: s=8.8.8.8 (GigabitEthernet0/1) d=192.168.1.10, len=60, rcvd`);
        cliPrint(`*Jun 30 10:12:03.005: OSPF: Rcv hello from 2.2.2.2 area 0 from GigabitEthernet0/1`);
      }, 800);
      return;
    }
    if (_ios(c0,'undebug') || (c0 === 'no' && _ios(c1,'debug'))) { ok(`All possible debugging has been turned off`); return; }

    if (_ios(c0,'clear')) {
      if (_ios(c1,'counters'))    { ok(`Clear "show interface" counters on all interfaces [confirm]\n[OK]`); }
      else if (c1==='ip' && _ios((parts[2]||''),'nat')) {
        if (cs.nat) { cs.nat.translations = (cs.nat.translations||[]).filter(e=>e.static); }
        ok(`[NAT dynamic translations cleared]`);
      }
      else if (_ios(c1,'ip'))     { ok(`[Cleared]`); }
      else if (_ios(c1,'arp'))    { ok(`[ARP cache cleared]`); }
      else if (_ios(c1,'line'))   { ok(`[Line cleared]`); }
      else if (_ios(c1,'terminal') || !c1) { cliClear(); }
      else { err(`% Invalid input: clear ${rest}`); }
      return;
    }

    if (_ios(c0,'show') || c0 === 'sh') { _ciscoShow(cs, parts.slice(1), out, err); return; }

    err(`% Invalid input detected: "${trimmed}"\nTapez ? pour l'aide ou sh run pour la config`);
    return;
  }

  // -------- CONFIG MODES (end / exit / do partagés) --------
  if (mode.startsWith('config')) {
    if (c0 === 'end') {
      cs.ciscoMode = 'priv'; cs.ciscoCtx = null; cs.configChanged = true;
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      return;
    }
    if (_ios(c0,'exit')) {
      if (mode === 'config') cs.ciscoMode = 'priv';
      else cs.ciscoMode = 'config';
      cs.ciscoCtx = (mode === 'config') ? null : cs.ciscoCtx;
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      return;
    }
  }

  // -------- GLOBAL CONFIG MODE --------
  if (mode === 'config') {
    if (_ios(c0,'hostname')) {
      if (!parts[1]) { err('hostname NAME'); return; }
      cs.hostname = parts[1]; cs.configChanged = true;
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      return;
    }
    if (_ios(c0,'interface')) {
      const ifName = _ciscoNormalizeIf(parts.slice(1).join(' '));
      if (!ifName) { err(`% Interface introuvable: ${rest}`); return; }
      if (!cs.interfaces[ifName]) cs.interfaces[ifName] = { desc:'', ip:null, mask:null, adminDown:true, mac:null };
      cs.ciscoCtx = ifName; cs.ciscoMode = 'config-if';
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      return;
    }
    if (_ios(c0,'vlan')) {
      const vid = parseInt(parts[1]);
      if (isNaN(vid)||vid<1||vid>4094) { err('% VLAN ID invalide (1-4094)'); return; }
      if (!cs.vlans[vid]) cs.vlans[vid] = { name:`VLAN${vid}`, status:'active' };
      cs.ciscoCtx = vid; cs.ciscoMode = 'config-vlan'; cs.configChanged = true;
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      return;
    }
    if (_ios(c0,'router') && _ios(c1,'ospf')) {
      cs.ospfProcess = parseInt(parts[2])||1; cs.ciscoCtx = cs.ospfProcess;
      cs.ciscoMode = 'config-router';
      document.getElementById('cli-prompt').innerHTML = cliPrompt();
      return;
    }
    if (c0 === 'ip' && _ios(c1,'route')) {
      const [,,net,mask,nh] = parts;
      if (!net||!mask||!nh) { err('ip route NETWORK MASK NEXTHOP [AD]'); return; }
      cs.routes = cs.routes.filter(r=>!(r.network===net&&r.mask===mask&&r.proto.startsWith('S')));
      cs.routes.push({ proto:'S', network:net, mask, nh, iface:null, ad:parseInt(parts[5])||1, metric:0 });
      cs.configChanged = true;
      ok(`Route statique ${net}/${_maskToCidr(mask)} via ${nh} configurée`);
      return;
    }
    if (c0 === 'no' && c1 === 'ip' && _ios((parts[2]||''),'route')) {
      const [,,,net,mask] = parts;
      const before = cs.routes.length;
      cs.routes = cs.routes.filter(r=>!(r.network===net&&r.mask===mask&&r.proto.startsWith('S')));
      if (cs.routes.length<before) { ok(`Route ${net} supprimée`); cs.configChanged=true; }
      else err(`% Route introuvable`);
      return;
    }
    if (c0 === 'ip' && _ios(c1,'default-gateway')) {
      cs.defaultGw = parts[2]; cs.configChanged = true;
      ok(`Default gateway: ${parts[2]}`);
      return;
    }
    if (c0 === 'ip' && _ios(c1,'routing')) { cs.ipRouting=true; cs.configChanged=true; ok(`IP routing enabled`); return; }
    if (c0 === 'no' && c1 === 'ip' && _ios((parts[2]||''),'routing')) { cs.ipRouting=false; cs.configChanged=true; ok(`IP routing disabled`); return; }
    // NAT
    if (c0 === 'ip' && _ios(c1,'nat')) {
      const s2=(parts[2]||'').toLowerCase(), s3=(parts[3]||'').toLowerCase(), s4=(parts[4]||'').toLowerCase();
      if (_ios(s2,'pool')) {
        const [,,,name,start,end] = parts;
        cs.nat.poolDef = { name, start, end:end||start, mask:parts[7]||'255.255.255.0' };
        cs.configChanged=true; ok(`NAT pool "${name}": ${start}–${end||start}`); return;
      }
      if (_ios(s2,'inside') && _ios(s3,'source')) {
        if (_ios(s4,'static')) {
          const localIp=parts[5], globalIp=parts[6];
          if (!localIp||!globalIp) { err('ip nat inside source static LOCAL GLOBAL'); return; }
          if (!cs.nat) cs.nat = { translations:[], statics:[], insideIfs:[], outsideIfs:[], overload:false };
          cs.nat.statics.push({ local:localIp, global:globalIp });
          cs.nat.translations.push({ proto:'---', insideLocal:localIp, insideGlobal:globalIp, outsideLocal:'---', outsideGlobal:'---', static:true });
          cs.configChanged=true; ok(`NAT statique: ${localIp} → ${globalIp}`); return;
        }
        if (_ios(s4,'list')) {
          if (!cs.nat) cs.nat = { translations:[], statics:[], insideIfs:[], outsideIfs:[], overload:false };
          cs.nat.sourceList = parts[5]||'1';
          cs.nat.overload   = parts.some(p=>p.toLowerCase()==='overload');
          cs.nat.pat        = cs.nat.overload;
          cs.nat.pool       = parts[7]||null;
          cs.configChanged=true;
          ok(`NAT${cs.nat.overload?' PAT/overload':''}: liste ACL ${cs.nat.sourceList}${cs.nat.pool?' pool '+cs.nat.pool:''}`); return;
        }
      }
      err('ip nat {inside source {static|list}|pool}'); return;
    }
    if (c0==='no' && c1==='ip' && _ios((parts[2]||''),'nat')) {
      cs.nat = { translations:[], overload:false, pat:false, pool:null, sourceList:null, statics:[], insideIfs:[], outsideIfs:[] };
      cs.configChanged=true; ok('NAT supprimé'); return;
    }
    if (_ios(c0,'enable') && (_ios(c1,'secret')||_ios(c1,'password'))) {
      cs.enableSecret=parts[2]||''; cs.configChanged=true; ok(`Enable ${c1} configured`); return;
    }
    if (c0==='no' && _ios(c1,'enable')) { cs.enableSecret=null; cs.configChanged=true; ok(`Enable secret removed`); return; }
    if (_ios(c0,'service') && _ios(c1,'password-encryption')) { cs.servicePasswordEncryption=true; cs.configChanged=true; return; }
    if (c0==='no' && _ios(c1,'service')) { cs.servicePasswordEncryption=false; cs.configChanged=true; return; }
    if (_ios(c0,'banner') && _ios(c1,'motd')) {
      cs.motd = parts.slice(2).join(' ').replace(/^[^a-zA-Z0-9\s]+|[^a-zA-Z0-9\s]+$/g,'');
      cs.configChanged=true; ok(`MOTD banner configured`); return;
    }
    if (_ios(c0,'line')) { cs.ciscoCtx=rest; cs.ciscoMode='config-line'; cs.configChanged=true; document.getElementById('cli-prompt').innerHTML=cliPrompt(); return; }
    if (_ios(c0,'access-list')) {
      const num=parts[1], action=(parts[2]||'').toLowerCase(), src=parts[3]||'any', wildcard=parts[4]||'';
      if (!num||!action) { err('access-list NUMBER {permit|deny} {host IP | NETWORK WILDCARD | any}'); return; }
      if (!cs.acls[num]) cs.acls[num]=[];
      cs.acls[num].push({ action, src, wildcard, hits:0 });
      cs.configChanged=true;
      ok(`ACL ${num}: ${action} ${src}${wildcard?' '+wildcard:''}`);
      return;
    }
    if (c0==='no' && _ios(c1,'access-list')) { delete cs.acls[parts[2]]; cs.configChanged=true; ok(`ACL ${parts[2]} supprimée`); return; }
    if (_ios(c0,'spanning-tree')) { cs.stpMode=rest; cs.configChanged=true; ok(`Spanning-tree: ${rest}`); return; }
    if (_ios(c0,'username')) {
      if (!cs.localUsers) cs.localUsers={};
      cs.localUsers[parts[1]]={ priv:parseInt(parts[3])||1, secret:parts[5]||'' };
      cs.configChanged=true; ok(`User ${parts[1]} created`); return;
    }
    if (c0==='no' && _ios(c1,'username')) { if(cs.localUsers) delete cs.localUsers[parts[2]]; cs.configChanged=true; return; }
    if (_ios(c0,'crypto') && _ios(c1,'key') && _ios((parts[2]||''),'generate')) {
      ok(`% Generating 2048 bit RSA keys, keys will be non-exportable...\n[OK] (elapsed time was 1 seconds)`); return;
    }
    if (_ios(c0,'ip') && _ios(c1,'ssh')) { ok(`SSH version configured`); cs.configChanged=true; return; }
    if (_ios(c0,'aaa')) { ok(`AAA: ${rest}`); cs.configChanged=true; return; }
    if (_ios(c0,'ntp')) { ok(`NTP: ${rest}`); cs.configChanged=true; return; }
    if (_ios(c0,'logging')) { ok(`Logging: ${rest}`); cs.configChanged=true; return; }
    if (_ios(c0,'snmp-server')) { ok(`SNMP: ${rest}`); cs.configChanged=true; return; }
    if (c0==='no') { ok(`[Supprimé]`); cs.configChanged=true; return; }
    err(`% Invalid input detected at "^"\n  ${trimmed}\n  ${'~'.repeat(trimmed.length)}`);
    return;
  }

  // -------- INTERFACE CONFIG --------
  if (mode === 'config-if') {
    const iface = cs.interfaces[cs.ciscoCtx] || {};
    if (c0 === 'ip' && _ios(c1,'address')) {
      const [,,ip,mask] = parts;
      if (!ip||!mask) { err('ip address IP MASK'); return; }
      iface.ip=ip; iface.mask=mask; cs.configChanged=true;
      const net=ip.split('.').slice(0,3).join('.')+'.0';
      cs.routes=cs.routes.filter(r=>!(r.iface===cs.ciscoCtx&&r.proto==='C'));
      cs.routes.push({ proto:'C', network:net, mask, nh:null, iface:cs.ciscoCtx, ad:0, metric:0 });
      ok(`IP ${ip} ${mask} configurée sur ${cs.ciscoCtx}`);
      return;
    }
    if (c0==='no'&&c1==='ip'&&_ios((parts[2]||''),'address')) {
      iface.ip=null; iface.mask=null; cs.configChanged=true;
      cs.routes=cs.routes.filter(r=>!(r.iface===cs.ciscoCtx&&r.proto==='C'));
      ok(`IP supprimée de ${cs.ciscoCtx}`); return;
    }
    if (c0==='no'&&_ios(c1,'shutdown')) {
      iface.adminDown=false; cs.configChanged=true;
      ok(`%LINK-5-CHANGED: Interface ${cs.ciscoCtx}, changed state to up\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${cs.ciscoCtx}, changed state to up`); return;
    }
    if (_ios(c0,'shutdown')) {
      iface.adminDown=true; cs.configChanged=true;
      out(`%LINK-5-CHANGED: Interface ${cs.ciscoCtx}, changed state to administratively down\n%LINEPROTO-5-UPDOWN: Line protocol on Interface ${cs.ciscoCtx}, changed state to down`); return;
    }
    if (_ios(c0,'description')) { iface.desc=rest; cs.configChanged=true; return; }
    if (_ios(c0,'duplex'))      { iface.duplex=parts[1]||'auto'; cs.configChanged=true; return; }
    if (_ios(c0,'speed'))       { iface.speed=parts[1]||'auto';  cs.configChanged=true; return; }
    if (_ios(c0,'switchport')) {
      if (_ios(c1,'mode'))   { iface.swMode=parts[2]; cs.configChanged=true; ok(`Switchport mode ${parts[2]}`); return; }
      if (_ios(c1,'access')&&_ios((parts[2]||''),'vlan')) { iface.accessVlan=parseInt(parts[3]); cs.configChanged=true; ok(`Access VLAN ${parts[3]}`); return; }
      if (_ios(c1,'trunk')) {
        if (_ios((parts[2]||''),'allowed')) { iface.trunkVlans=parts.slice(4).join(''); cs.configChanged=true; ok(`Trunk VLANs: ${iface.trunkVlans}`); return; }
        if (_ios((parts[2]||''),'native'))  { iface.nativeVlan=parseInt(parts[4]); cs.configChanged=true; ok(`Native VLAN: ${parts[4]}`); return; }
        if (_ios((parts[2]||''),'encapsulation')) { iface.encap=parts[3]; cs.configChanged=true; return; }
      }
      if (_ios(c1,'nonegotiate')) { cs.configChanged=true; return; }
    }
    if (c0==='ip'&&_ios(c1,'ospf'))         { iface.ospfProcess=parseInt(parts[2]); iface.ospfArea=parseInt(parts[4]||'0'); cs.configChanged=true; return; }
    if (c0==='ip'&&_ios(c1,'access-group')) { iface.acl=parts[2]; iface.aclDir=parts[3]||'in'; cs.configChanged=true; ok(`ACL ${parts[2]} appliquée ${parts[3]||'in'} sur ${cs.ciscoCtx}`); return; }
    if (c0==='no'&&c1==='ip'&&_ios((parts[2]||''),'access-group')) { iface.acl=null; iface.aclDir=null; cs.configChanged=true; return; }
    if (c0==='ip'&&_ios(c1,'nat')) {
      if (!cs.nat) cs.nat = { translations:[], statics:[], insideIfs:[], outsideIfs:[], overload:false };
      const dir = (parts[2]||'').toLowerCase();
      if (_ios(dir,'inside'))  { iface.natInside=true;  if (!cs.nat.insideIfs.includes(cs.ciscoCtx))  cs.nat.insideIfs.push(cs.ciscoCtx);  cs.configChanged=true; ok(`${cs.ciscoCtx}: ip nat inside`);  return; }
      if (_ios(dir,'outside')) { iface.natOutside=true; if (!cs.nat.outsideIfs.includes(cs.ciscoCtx)) cs.nat.outsideIfs.push(cs.ciscoCtx); cs.configChanged=true; ok(`${cs.ciscoCtx}: ip nat outside`); return; }
    }
    if (c0==='no'&&c1==='ip'&&_ios((parts[2]||''),'nat')) {
      iface.natInside=false; iface.natOutside=false;
      if (cs.nat) { cs.nat.insideIfs=cs.nat.insideIfs.filter(x=>x!==cs.ciscoCtx); cs.nat.outsideIfs=cs.nat.outsideIfs.filter(x=>x!==cs.ciscoCtx); }
      cs.configChanged=true; return;
    }
    if (_ios(c0,'encapsulation'))  { iface.encap=parts[1]; iface.encapVlan=parseInt(parts[2]); cs.configChanged=true; return; }
    if (_ios(c0,'bandwidth'))      { iface.bw=parts[1]; cs.configChanged=true; return; }
    if (_ios(c0,'clock') && _ios(c1,'rate'))  { iface.clockRate=parts[2]; cs.configChanged=true; return; }
    if (_ios(c0,'channel-group'))  { iface.channelGroup=parts[1]; cs.configChanged=true; ok(`Port-channel ${parts[1]} mode ${parts[3]||'on'}`); return; }
    if (_ios(c0,'spanning-tree'))  { cs.configChanged=true; return; }
    if (_ios(c0,'storm-control'))  { cs.configChanged=true; return; }
    if (c0==='no')                 { cs.configChanged=true; return; }
    err(`% Invalid input at "^": ${trimmed}`);
    return;
  }

  // -------- VLAN CONFIG --------
  if (mode === 'config-vlan') {
    if (_ios(c0,'name'))  { cs.vlans[cs.ciscoCtx].name=rest; cs.configChanged=true; return; }
    if (_ios(c0,'state')) { cs.vlans[cs.ciscoCtx].status=parts[1]||'active'; cs.configChanged=true; return; }
    if (c0==='no')        { cs.configChanged=true; return; }
    err(`% Invalid input: ${trimmed}`);
    return;
  }

  // -------- ROUTER (OSPF) CONFIG --------
  if (mode === 'config-router') {
    if (_ios(c0,'network')) {
      const [,net,wildcard,,area] = parts;
      ok(`OSPF: réseau ${net} ${wildcard||'0.0.0.0'} area ${area||'0'}`);
      cs.configChanged=true; return;
    }
    if (_ios(c0,'router-id'))  { cs.ospfRouterId=parts[1]; cs.configChanged=true; ok(`Router-id: ${parts[1]}`); return; }
    if (_ios(c0,'passive-interface'))       { ok(`Interface ${parts[1]||'default'} passive`); cs.configChanged=true; return; }
    if (c0==='no'&&_ios(c1,'passive-interface')) { ok(`Interface ${parts[2]} active`); cs.configChanged=true; return; }
    if (_ios(c0,'default-information'))     { ok(`Default information originate activé`); cs.configChanged=true; return; }
    if (_ios(c0,'area'))                    { ok(`OSPF area ${rest} configuré`); cs.configChanged=true; return; }
    if (_ios(c0,'redistribute'))            { ok(`Redistribution: ${rest}`); cs.configChanged=true; return; }
    if (_ios(c0,'auto-cost'))               { ok(`Auto-cost reference bandwidth: ${parts[2]||'100'} Mbps`); cs.configChanged=true; return; }
    if (_ios(c0,'timers'))                  { ok(`Timers: ${rest}`); cs.configChanged=true; return; }
    if (c0==='no')                          { ok(`[Supprimé]`); cs.configChanged=true; return; }
    err(`% Invalid input: ${trimmed}`);
    return;
  }

  // -------- LINE CONFIG --------
  if (mode === 'config-line') {
    if (_ios(c0,'password'))             { cs.linePasswords[cs.ciscoCtx]=parts[1]; cs.configChanged=true; return; }
    if (_ios(c0,'login'))                { ok(`Login activé sur ${cs.ciscoCtx}`); cs.configChanged=true; return; }
    if (c0==='no'&&_ios(c1,'login'))     { ok(`Login désactivé`); cs.configChanged=true; return; }
    if (_ios(c0,'exec-timeout'))         { ok(`Exec timeout: ${parts[1]||0}m ${parts[2]||0}s`); cs.configChanged=true; return; }
    if (_ios(c0,'logging')&&_ios(c1,'synchronous')) { ok(`Logging synchronous activé`); return; }
    if (_ios(c0,'transport')&&_ios(c1,'input'))      { ok(`Transport input: ${parts[2]||'all'}`); cs.configChanged=true; return; }
    if (_ios(c0,'length'))               { return; }
    if (_ios(c0,'privilege'))            { ok(`Privilege level: ${rest}`); cs.configChanged=true; return; }
    if (c0==='no')                       { ok(`[Supprimé]`); cs.configChanged=true; return; }
    err(`% Invalid input: ${trimmed}`);
    return;
  }
}

function _ciscoNormalizeIf(input) {
  const s = input.toLowerCase().trim();
  const map = [
    [/^g[ie]?\s*(\d+\/\d+)$/, 'GigabitEthernet'],
    [/^gi?gabit[^\s]*\s*(\d+\/\d+)$/, 'GigabitEthernet'],
    [/^f[ae]?\s*(\d+\/\d+)$/, 'FastEthernet'],
    [/^fa?st[^\s]*\s*(\d+\/\d+)$/, 'FastEthernet'],
    [/^se?\s*(\d+\/\d+\/?\d*)$/, 'Serial'],
    [/^se?rial[^\s]*\s*(\d+\/\d+\/?\d*)$/, 'Serial'],
    [/^lo\s*(\d+)$/, 'Loopback'],
    [/^loopback\s*(\d+)$/, 'Loopback'],
    [/^vl\s*(\d+)$/, 'Vlan'],
    [/^vlan\s*(\d+)$/, 'Vlan'],
  ];
  for (const [re, prefix] of map) {
    const m = s.match(re);
    if (m) return `${prefix}${m[1]}`;
  }
  // Also accept full names already normalized
  if (/^(GigabitEthernet|FastEthernet|Serial|Loopback|Vlan)\d/.test(input)) return input;
  return null;
}

function _ciscoShowVersion(out) {
  out(`Cisco IOS Software, Version 15.4(3)M2, RELEASE SOFTWARE (fc1)
Technical Support: http://www.cisco.com/techsupport
Copyright (c) 1986-2015 by Cisco Systems, Inc.

ROM: System Bootstrap, Version 15.4(3r)M2
BOOTLDR: Cisco IOS Software, C3900 Software

<span style="color:#e84040">${cliState.hostname}</span> uptime is 2 hours, 34 minutes
System image file is "flash:c3900-universalk9-mz.SPA.154-3.M2.bin"

cisco CISCO3925-CHASSIS (revision 1.0) with <span style="color:#e84040">512 MB</span> of memory
Processor board ID FTX1512ABCD
4 Gigabit Ethernet interfaces
DRAM configuration is 64 bits wide
Configuration register is 0x2102`);
}

function _ciscoShow(cs, args, out, err) {
  const s0 = (args[0] || '').toLowerCase();
  const s1 = (args[1] || '').toLowerCase();
  const s2 = (args[2] || '').toLowerCase();

  if (_ios(s0,'version'))  { _ciscoShowVersion(out); return; }

  if (_ios(s0,'clock')) {
    const now = new Date();
    out(`${now.toTimeString().slice(0,8)} UTC ${now.toDateString()}`); return;
  }

  if (_ios(s0,'running-config') || (s0 === 'run' && !s1)) {
    _ciscoShowRunningConfig(cs, out); return;
  }
  if (_ios(s0,'startup-config')) {
    if (!cs.savedConfig) out(`startup-config is not present`);
    else _ciscoShowRunningConfig(cs, out);
    return;
  }

  // show ip ...
  if (s0 === 'ip') {
    // show ip interface brief
    if (_ios(s1,'interface') && _ios(s2,'brief')) {
      out(`Interface              IP-Address      OK? Method Status                Protocol
${Object.entries(cs.interfaces).map(([name, iface]) => {
  const ip = iface.ip ? iface.ip.padEnd(15) : 'unassigned     ';
  const status = iface.adminDown ? 'administratively down' : 'up                   ';
  const proto  = iface.adminDown ? 'down    ' : 'up      ';
  return `<span style="color:#e0e0e0">${name.padEnd(23)}</span>${ip} YES manual ${status} ${proto}`;
}).join('\n')}`);
      return;
    }
    // show ip interface [NAME]
    if (_ios(s1,'interface')) {
      const ifName = _ciscoNormalizeIf(args.slice(2).join(' ')) || args[2];
      if (!ifName) { err('show ip interface INTERFACE'); return; }
      const iface = cs.interfaces[ifName];
      if (!iface) { err(`Interface ${ifName} introuvable`); return; }
      const up = !iface.adminDown;
      out(`${ifName} is ${up?'<span style="color:#22c55e">up</span>':'<span style="color:#ef4444">administratively down</span>'}, line protocol is ${up?'<span style="color:#22c55e">up</span>':'<span style="color:#ef4444">down</span>'}
  Description: ${iface.desc||'(non définie)'}
  Internet address is ${iface.ip?`${iface.ip}/${_maskToCidr(iface.mask)}`:'not set'}
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec
  Encapsulation ARPA, loopback not set
  Full-duplex, 1000Mb/s, media type is RJ45
  ${iface.mac?`Hardware is iGbE, address is ${iface.mac}`:''}`);
      return;
    }
    // show ip route
    if (_ios(s1,'route')) {
      const codes = `Codes: L - local, C - connected, S - static, R - RIP, B - BGP
       O - OSPF, IA - OSPF inter area, E1/E2 - OSPF external
       i - IS-IS, * - candidate default

Gateway of last resort is ${cs.routes.find(r=>r.network==='0.0.0.0')?.nh||'not set'} to network 0.0.0.0`;
      const routeLines = cs.routes.map(r => {
        const proto = r.proto.padEnd(4);
        const net = !r.mask||r.mask==='0.0.0.0' ? `${r.network}/0` :
                    r.mask==='255.255.255.255' ? `${r.network}/32` :
                    `${r.network}/${_maskToCidr(r.mask)}`;
        const via = r.nh ? ` [${r.ad}/${r.metric}] via ${r.nh},` : '';
        const iface = r.iface ? ` ${r.iface}` : '';
        return `<span style="color:#f59e0b">${proto}</span>  ${net.padEnd(22)}${via}${iface}`;
      }).join('\n');
      out(codes + '\n\n' + routeLines);
      return;
    }
    // show ip ospf
    if (_ios(s1,'ospf')) {
      if (_ios(s2,'neighbor')) {
        out(`Neighbor ID     Pri   State           Dead Time   Address         Interface
${(cs.ospfNeighbors||[]).map(n=>
  `${n.id.padEnd(16)}${String(n.pri).padEnd(6)}${n.state.padEnd(16)}00:00:35    ${n.addr.padEnd(16)}${n.iface}`
).join('\n')||'  (aucun voisin OSPF)'}`);
      } else {
        out(` Routing Process "ospf ${cs.ospfProcess}" with ID ${cs.ospfRouterId||'1.1.1.1'}
 Start time: 00:00:01.123, Time elapsed: 02:34:56.789
 Supports opaque LSA · LLS · Incremental SPF
 Number of areas: 1 normal · 0 stub · 0 nssa
 Number of interfaces in this router: ${Object.keys(cs.interfaces).length}`);
      }
      return;
    }
    // show ip access-lists
    if (_ios(s1,'access-lists') || _ios(s1,'access-list')) {
      if (Object.keys(cs.acls).length === 0) { out(`No access lists defined`); return; }
      Object.entries(cs.acls).forEach(([num, entries]) => {
        const isExt = parseInt(num) >= 100 || isNaN(parseInt(num));
        out(`${isExt?'Extended':'Standard'} IP access list ${num}`);
        entries.forEach((e, i) => {
          const hits = e.hits || 0;
          const matchStr = hits > 0 ? ` <span style="color:#f59e0b">(${hits} match${hits>1?'es':''})</span>` : '';
          const extra = e.wildcard ? ` ${e.wildcard}` : '';
          out(`    ${10*(i+1)} ${e.action==='permit'?`<span style="color:#22c55e">permit</span>`:`<span style="color:#ef4444">deny</span>`} ${e.src||'any'}${extra}${matchStr}`);
        });
      });
      return;
    }
    // show ip ssh
    if (_ios(s1,'ssh')) {
      out(`SSH Enabled - version 2.0\nAuthentication timeout: 60 secs; Authentication retries: 3`); return;
    }
    // show ip dhcp
    if (_ios(s1,'dhcp')) {
      out(`IP DHCP pool: non configuré dans ce simulateur`); return;
    }
    // show ip nat translations / statistics
    if (_ios(s1,'nat')) {
      const nat = cs.nat || {};
      if (_ios(s2,'statistics') || _ios(s2,'stat')) {
        out(`Total active translations: ${(nat.translations||[]).length} (${(nat.statics||[]).length} static, ${Math.max(0,(nat.translations||[]).length-(nat.statics||[]).length)} dynamic)
Outside interfaces: ${(nat.outsideIfs||[]).join(', ')||'aucune'}
Inside interfaces:  ${(nat.insideIfs||[]).join(', ')||'aucune'}
Hits: ${(nat.translations||[]).reduce((a,e)=>a+(e.hits||1),0)}   Misses: 0
CEF Translated packets: ${Math.floor(Math.random()*1000)+100}, CEF Punted packets: 0`);
        return;
      }
      // show ip nat translations (défaut)
      if (!(nat.translations||[]).length) { out(`Pro Inside global      Inside local       Outside local      Outside global\n  (aucune traduction active)`); return; }
      const header = `Pro  Inside global         Inside local         Outside local        Outside global`;
      const rows = nat.translations.map(e => {
        const proto = (e.proto||'---').padEnd(5);
        const ig = (e.insideGlobal||'---').padEnd(21);
        const il = (e.insideLocal||'---').padEnd(21);
        const ol = (e.outsideLocal||'---').padEnd(21);
        const og = (e.outsideGlobal||'---');
        return `${proto}${ig}${il}${ol}${og}`;
      }).join('\n');
      out(header + '\n' + rows);
      return;
    }
    // show ip protocols
    if (_ios(s1,'protocols')) {
      out(`Routing Protocol is "ospf ${cs.ospfProcess}"\n  Router ID: ${cs.ospfRouterId||'1.1.1.1'}\n  Number of areas: 1 normal`); return;
    }
    err(`Unknown show ip subcommand: "${s1}"`); return;
  }

  // show interfaces [NAME]
  if (_ios(s0,'interfaces') || _ios(s0,'interface')) {
    const ifArg = args.slice(1).join(' ');
    const ifName = ifArg ? _ciscoNormalizeIf(ifArg)||ifArg : null;
    const entries = ifName
      ? [[ifName, cs.interfaces[ifName]]].filter(([,v])=>v)
      : Object.entries(cs.interfaces);
    if (!entries.length) { err(`Interface introuvable: ${ifArg}`); return; }
    entries.forEach(([name, iface]) => {
      const up = !iface.adminDown;
      out(`${name} is ${up?'<span style="color:#22c55e">up</span>':'<span style="color:#ef4444">administratively down</span>'}, line protocol is ${up?'<span style="color:#22c55e">up</span>':'<span style="color:#ef4444">down</span>'}
  Description: ${iface.desc||'—'}
  Internet address: ${iface.ip?`${iface.ip}/${_maskToCidr(iface.mask)}`:'not set'}
  MTU 1500 bytes, BW 1000000 Kbit/sec, DLY 10 usec
  5 minute input rate: ${Math.floor(Math.random()*50000)} bits/sec, ${Math.floor(Math.random()*20)} packets/sec
  5 minute output rate: ${Math.floor(Math.random()*30000)} bits/sec, ${Math.floor(Math.random()*15)} packets/sec
     ${Math.floor(Math.random()*9999)} packets input, ${Math.floor(Math.random()*999999)} bytes
     ${Math.floor(Math.random()*9999)} packets output, ${Math.floor(Math.random()*999999)} bytes`);
    });
    return;
  }

  // show vlan
  if (_ios(s0,'vlan')) {
    out(`VLAN Name                             Status    Ports
---- --------------------------------- --------- -------------------------------
${Object.entries(cs.vlans).map(([id,v])=>
  `<span style="color:#e84040">${String(id).padEnd(5)}</span>${v.name.padEnd(34)} ${v.status.padEnd(10)}`
).join('\n')}`);
    return;
  }

  // show access-lists (sans 'ip')
  if (_ios(s0,'access-lists') || _ios(s0,'access-list')) {
    if (Object.keys(cs.acls).length === 0) { out(`No access lists defined`); return; }
    Object.entries(cs.acls).forEach(([num, entries]) => {
      const isExt = parseInt(num) >= 100 || isNaN(parseInt(num));
      out(`${isExt?'Extended':'Standard'} IP access list ${num}`);
      entries.forEach((e, i) => {
        const hits = e.hits || 0;
        const matchStr = hits > 0 ? ` <span style="color:#f59e0b">(${hits} match${hits>1?'es':''})</span>` : '';
        out(`    ${10*(i+1)} ${e.action==='permit'?`<span style="color:#22c55e">permit</span>`:`<span style="color:#ef4444">deny</span>`} ${e.src||'any'}${e.wildcard?' '+e.wildcard:''}${matchStr}`);
      });
    });
    return;
  }

  // show cdp
  if (_ios(s0,'cdp')) {
    if (_ios(s1,'neighbors')) {
      out(`Device ID        Local Intrfce     Holdtme    Capability  Platform  Port ID
SW1              Gig 0/0           122           S I      WS-C2960  Gig 0/1
R2               Gig 0/1           165           R        C3925     Gig 0/0`);
    } else {
      out(`Global CDP information:\n  Sending CDP packets every 60 seconds\n  Sending a holdtime value of 180 seconds`);
    }
    return;
  }

  // show mac address-table
  if (_ios(s0,'mac-address-table') || (s0==='mac'&&_ios(s1,'address-table'))) {
    out(`          Mac Address Table\n-------------------------------------------
Vlan    Mac Address       Type        Ports
----    -----------       --------    -----
  1     fa16.3e00.0001    DYNAMIC     Gi0/0
  1     fa16.3e00.0002    DYNAMIC     Gi0/1
 10     fa16.3e10.0001    DYNAMIC     Gi0/0
 20     fa16.3e20.0001    DYNAMIC     Gi0/1`);
    return;
  }

  // show protocols
  if (_ios(s0,'protocols')) {
    out(`Global values:\n  Internet Protocol routing is enabled\n  OSPF routing protocol is enabled`); return;
  }

  // show spanning-tree
  if (_ios(s0,'spanning-tree')) {
    out(`VLAN0001\n  Spanning tree enabled protocol ieee\n  Root ID    Priority    32769\n             Address     fa16.3e00.0001\n             This bridge is the root`); return;
  }

  // show arp
  if (_ios(s0,'arp')) {
    out(`Protocol  Address          Age (min)  Hardware Addr   Type   Interface
Internet  192.168.1.1              -   fa16.3e00.0001  ARPA   GigabitEthernet0/0
Internet  192.168.1.254           42   fa16.3e00.00ff  ARPA   GigabitEthernet0/0
Internet  10.0.0.2                15   fa16.3e00.0002  ARPA   GigabitEthernet0/1`); return;
  }

  // show processes cpu / memory
  if (_ios(s0,'processes')) {
    out(`CPU utilization for five seconds: 2%/1%; one minute: 3%; five minutes: 2%\n PID Runtime(ms)   Invoked      uSecs   5Sec   1Min   5Min TTY Process\n   1       12345    456789         27  0.00%  0.00%  0.00%   0 Chunk Manager`); return;
  }
  if (_ios(s0,'memory')) {
    out(`             Head    Total(b)     Used(b)     Free(b)   Lowest(b)  Largest(b)\nProcessor  ...    268435456   134217728   134217728   100000000    67000000`); return;
  }

  // show users / history
  if (_ios(s0,'users'))   { out(`    Line       User       Host(s)              Idle       Location\n*  0 con 0               idle                 00:00:00`); return; }
  if (_ios(s0,'history')) { out(`  sh run\n  sh ip int br\n  conf t\n  sh ip route`); return; }

  // show line
  if (_ios(s0,'line')) { out(`   Tty Line Typ     Tx/Rx    A Modem  Roty AccO AccI   Uses  Noise  Overruns   Int\n*    0    0 CTY              -    -    -    -    -      0      0     0/0       -`); return; }

  // show logging
  if (_ios(s0,'logging')) { out(`Syslog logging: enabled (0 messages dropped, 0 flushes, 0 overruns)\n  Console logging: level debugging, 42 messages logged`); return; }

  // show environment / platform
  if (_ios(s0,'environment') || _ios(s0,'platform')) { out(`[Environment/Platform data not available in simulator]`); return; }

  err(`Unknown show subcommand: "show ${args.join(' ')}" — tapez show ? pour l'aide`);
}

function _ciscoShowRunningConfig(cs, out) {
  const ifaces = Object.entries(cs.interfaces).map(([name, iface]) => {
    const lines = [`interface ${name}`];
    if (iface.desc) lines.push(` description ${iface.desc}`);
    if (iface.ip) lines.push(` ip address ${iface.ip} ${iface.mask}`);
    if (iface.adminDown) lines.push(` shutdown`);
    if (iface.swMode) lines.push(` switchport mode ${iface.swMode}`);
    if (iface.accessVlan) lines.push(` switchport access vlan ${iface.accessVlan}`);
    if (iface.acl) lines.push(` ip access-group ${iface.acl} ${iface.aclDir || 'in'}`);
    lines.push('!');
    return lines.join('\n');
  }).join('\n');

  const routes = cs.routes.filter(r => r.proto === 'S' || r.proto === 'S*').map(r =>
    `ip route ${r.network} ${r.mask} ${r.nh}`
  ).join('\n');

  const vlans = Object.entries(cs.vlans).filter(([id]) => parseInt(id) !== 1).map(([id, v]) =>
    `vlan ${id}\n name ${v.name}`
  ).join('\n!\n');

  const acls = Object.entries(cs.acls).flatMap(([num, entries]) =>
    entries.map(e => `access-list ${num} ${e.action} ${e.src}`)
  ).join('\n');

  out(`Building configuration...

Current configuration : 1842 bytes
!
version 15.4
service timestamps debug datetime msec
service timestamps log datetime msec
${cs.servicePasswordEncryption ? 'service password-encryption' : 'no service password-encryption'}
!
hostname <span style="color:#e84040">${cs.hostname}</span>
!
${cs.enableSecret ? `enable secret ${cs.servicePasswordEncryption ? '5 $1$mERr$Xyj/JNZH7pRkxLtZRWxR.' : cs.enableSecret}` : 'no enable secret'}
!
${cs.motd ? `banner motd ^${cs.motd}^` : '! no banner'}
!
${ifaces}
${routes ? routes + '\n!' : '! no static routes'}
${vlans ? vlans + '\n!' : ''}
${acls ? acls + '\n!' : '! no ACLs'}
router ospf ${cs.ospfProcess}
 router-id ${cs.ospfRouterId || '1.1.1.1'}
 network 1.1.1.1 0.0.0.0 area 0
 network 10.0.0.0 0.0.0.3 area 0
 network 192.168.1.0 0.0.0.255 area 0
!
line con 0
 logging synchronous
line vty 0 4
 ${cs.linePasswords['vty 0 4'] ? 'password ' + cs.linePasswords['vty 0 4'] + '\n login' : 'login local'}
!
end`);
}

function _maskToCidr(mask) {
  return mask.split('.').reduce((acc, o) => acc + parseInt(o).toString(2).split('1').length - 1, 0);
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

  if (cliState.type === 'cisco') { cliExecCisco(trimmed); return; }
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
   Type de nœud . . . . . . . . . . . : Hybride
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
  gameshell: { icon: '[>]', label: 'GameShell',              sublabel: '40 missions Linux',           color: '#00e5a0', cls: 'tfs-linux' },
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
  if (state._screenDepth > 5) { console.error('showScreen STACK OVERFLOW'); return; }
  state._screenDepth = (state._screenDepth||0) + 1;
  const leavingTerminal = state.currentScreen === 'terminal-fs' && id !== 'terminal-fs-screen';

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('content').scrollTop = 0;
  state.currentScreen = id.replace('-screen','');

  if (leavingTerminal) {
    const fsContent = document.getElementById('terminal-fs-content');
    if (fsContent) fsContent.innerHTML = '';
    const fsHeader = document.getElementById('terminal-fs-header');
    if (fsHeader) fsHeader.innerHTML = '';
    state.currentTerminal = null;
    state.cli = { type: null, history: [], histIdx: -1, cwd: '/', env: {} };
  }

  renderNav();
  const screenName = id.replace('-screen', '');
  if (screenName === 'home') {
    history.replaceState({ screen: 'home' }, '', '#');
  } else if (screenName !== 'module') {
    history.pushState({ screen: screenName }, '', '#' + screenName);
  }
  state._screenDepth = (state._screenDepth||1) - 1;
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
    document.getElementById('mobile-module-name').textContent = '';
    showScreen('home-screen');
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

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  const t = e.target;
  const isInput = t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable;
  if (e.ctrlKey && e.key === 'p') { e.preventDefault(); document.getElementById('sidebar-search-input')?.focus(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openGlobalSearch(); return; }
  if ((e.ctrlKey || e.metaKey) && e.key === 'g') { e.preventDefault(); openGlossaire(); return; }
  if (isInput && e.key !== 'Escape' && e.key !== 'Enter') return;
  const screen = state.currentScreen;
  const s = state;
  
  if (e.key === '?' && !isInput) {
    e.preventDefault();
    const exist = document.getElementById('kb-help');
    if (exist) { exist.remove(); return; }
    const div = document.createElement('div');
    div.id = 'kb-help';
    div.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center';
    div.onclick = e => e.target===div && div.remove();
    div.innerHTML = `<div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:24px;max-width:400px;width:90%;max-height:80vh;overflow-y:auto">
      <h3 style="margin-bottom:16px;color:var(--accent)">Raccourcis clavier</h3>
      ${SHORTCUTS.map(s=>`<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border)"><kbd style="background:var(--bg4);padding:2px 8px;border-radius:4px;font-family:var(--font-mono);font-size:13px">${s.key}</kbd><span style="color:var(--text2)">${s.desc}</span></div>`).join('')}
      <button class="btn-primary" style="margin-top:16px;width:100%" onclick="this.closest('#kb-help').remove()">Fermer</button>
    </div>`;
    document.body.appendChild(div);
  }
  if (e.key === 'Escape') {
    if (readingModeActive) { toggleReadingMode(); e.preventDefault(); return; }
    if (document.getElementById('kb-help')) { document.getElementById('kb-help').remove(); e.preventDefault(); return; }
    if (document.getElementById('sidebar')?.classList.contains('open')) { closeSidebar(); e.preventDefault(); return; }
    if (screen === 'module' && s.currentCours !== null) { document.getElementById('back-btn')?.click(); e.preventDefault(); return; }
    if (screen === 'module' || screen === 'examen') { renderHome(); e.preventDefault(); return; }
  }
  if (e.key === 'h' && !isInput && !e.ctrlKey && !e.metaKey) { e.preventDefault(); renderHome(); }
  if (e.key === 'r' && !isInput && !e.ctrlKey) { e.preventDefault(); openRevisionDuJour(); }
  if (e.key === 'e' && !isInput && !e.ctrlKey) { e.preventDefault(); openExamenBlanc(); }
  if ((e.key === 'ArrowRight' || e.key === 'ArrowLeft') && screen === 'module' && !state.qcm.locked) {
    const btn = document.getElementById('qcm-next-btn');
    if (btn && btn.style.display !== 'none') { e.preventDefault(); qcmNext(); }
  }
  if (e.key === 'j' && !isInput) { e.preventDefault(); const el = document.querySelector('.module-card:not(.filtered)'); el?.focus(); }
  if (e.key === 'k' && !isInput && screen === 'home') { e.preventDefault(); document.querySelector('#sidebar-search-input')?.focus(); }
});
const _hash = location.hash.replace('#', '');
const _moduleMatch = _hash.match(/^module-([^/]+)(?:\/([^/]+)(?:\/(.+))?)?$/);
if (_moduleMatch) {
  history.replaceState({ screen: 'home' }, '', '#');
  renderHome();
  openModule(_moduleMatch[1]);
  if (_moduleMatch[2]) switchTab(_moduleMatch[2], true);
  if (_moduleMatch[2] === 'cours' && _moduleMatch[3]) {
    const _m = MODULES.find(x => x && x.id === _moduleMatch[1]);
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

// ===== DIAGRAMS VIEWER =====
function showDiagram(moduleId) {
  var md = window.MODULE_DIAGRAMS && MODULE_DIAGRAMS[moduleId];
  if (!md || !md.length) { alert("Aucun schema disponible pour ce module."); return; }
  var ov = document.createElement("div");
  ov.className = "gs-overlay";
  ov.onclick = function(e) { if (e.target === ov) ov.remove(); };
  ov.innerHTML = '<div class="gs-modal" style="max-width:650px"><div class="gs-header"><span style="flex:1;font-weight:700;color:var(--text)"> Schemas</span><button class="gs-close" onclick="this.closest(\'.gs-overlay\').remove()">X</button></div><div class="gs-results" id="diagram-container" style="padding:12px;text-align:center"></div></div>';
  document.body.appendChild(ov);
  var c = document.getElementById("diagram-container");
  for (var i = 0; i < md.length; i++) {
    var t = document.createElement("h3");
    t.style.cssText = "color:var(--accint);margin:0 0 8px;font-size:15px";
    t.textContent = md[i].title;
    c.appendChild(t);
    try { c.appendChild(md[i].build()); } catch(e) { c.appendChild(Object.assign(document.createElement("p"), {style:"color:var(--red);font-size:13px",textContent:"Erreur de generation du schema"})); }
    if (i < md.length - 1) { var s = document.createElement("hr"); s.style.cssText = "border:none;border-top:1px solid var(--border);margin:16px 0"; c.appendChild(s); }
  }
}
initFontSize();
