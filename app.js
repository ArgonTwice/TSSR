// app.js — TSSR Study App

// ===== STORAGE =====
const store = {
  get: k => { try { return JSON.parse(localStorage.getItem('tssr_' + k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem('tssr_' + k, JSON.stringify(v)),
};

// ===== STATE =====
let state = {
  currentModule: null,
  currentTab: null,
  currentScreen: 'home',  // 'home' | 'module' | 'terminals' | 'terminal-fs'
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
function getProgress(moduleId) {
  return store.get('progress_' + moduleId) || { pct: 0, qcm_best: 0, fc_mastered: 0 };
}
function setProgress(moduleId, data) {
  const prev = getProgress(moduleId);
  store.set('progress_' + moduleId, { ...prev, ...data });
  renderNav();
  renderGlobalProgress();
}
function globalProgress() {
  const totals = MODULES.map(m => getProgress(m.id).pct || 0);
  return totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
}

// ===== RENDER NAV =====
function renderNav() {
  const nav = document.getElementById('module-nav');
  nav.innerHTML = '<p class="nav-section-label">Modules</p>';
  // Entrée Terminaux
  const termBtn = document.createElement('button');
  termBtn.className = 'nav-item nav-item-terminals' + (state.currentScreen === 'terminals' ? ' active' : '');
  termBtn.setAttribute('aria-label', 'Terminaux');
  termBtn.innerHTML = `
    <span class="nav-item-icon" style="background:rgba(0,229,160,0.1);color:var(--accent)">💻</span>
    <span>Terminaux</span>
    <span class="nav-item-right"><span class="nav-badge" style="background:var(--accent-dim);color:var(--accent)">2</span></span>`;
  termBtn.addEventListener('click', () => openTerminals());
  nav.appendChild(termBtn);
  MODULES.forEach(m => {
    const prog = getProgress(m.id);
    const btn = document.createElement('button');
    btn.className = 'nav-item' + (state.currentModule?.id === m.id ? ' active' : '');
    btn.setAttribute('aria-label', m.label);
    btn.innerHTML = `
      <span class="nav-item-icon" style="background:${m.color}22;color:${m.color}">${m.icon}</span>
      <span>${m.label}</span>
      <span class="nav-item-right">
        <span class="nav-progress-mini"><span class="nav-progress-mini-fill" style="width:${prog.pct||0}%"></span></span>
      </span>`;
    btn.addEventListener('click', () => openModule(m.id));
    nav.appendChild(btn);
  });
}
function renderGlobalProgress() {
  const pct = globalProgress();
  document.getElementById('global-progress-bar').style.width = pct + '%';
  document.getElementById('global-progress-pct').textContent = pct + '%';
}

// ===== HOME =====
function renderHome() {
  state.currentModule = null;
  state.currentScreen = 'home';
  document.getElementById('mobile-module-name').textContent = '';
  renderNav();
  const stats = document.getElementById('home-stats');
  const totalFC = MODULES.reduce((a, m) => a + m.flashcards.length, 0);
  const totalQCM = MODULES.reduce((a, m) => a + m.qcm.length, 0);
  stats.innerHTML = `
    <div class="stat-card"><span class="stat-num">${MODULES.length}</span><span class="stat-lbl">Modules</span></div>
    <div class="stat-card"><span class="stat-num">${totalFC}</span><span class="stat-lbl">Flashcards</span></div>
    <div class="stat-card"><span class="stat-num">${totalQCM}</span><span class="stat-lbl">Questions</span></div>
    <div class="stat-card"><span class="stat-num">${globalProgress()}%</span><span class="stat-lbl">Progression</span></div>`;
  const grid = document.getElementById('module-grid');
  grid.innerHTML = '';
  MODULES.forEach((m, i) => {
    const prog = getProgress(m.id);
    const hasContent = m.cours.length || m.flashcards.length || m.qcm.length;
    const card = document.createElement('div');
    card.className = 'module-card';
    card.style = `--card-color:${m.color};animation-delay:${i*40}ms`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Module ${m.label}`);
    const tags = ['cours','flashcards','qcm'].map(t => {
      const cnt = m[t].length;
      return `<span class="tag ${cnt?'has-content':''}">${t==='qcm'?'QCM':t}${cnt?` (${cnt})`:''}</span>`;
    });
    const hasCli = m.linux_cli || m.windows_cli;
    if (hasCli) {
      if (m.linux_cli) tags.push('<span class="tag has-content cli-tag">CLI Linux</span>');
      if (m.windows_cli) tags.push('<span class="tag has-content cli-tag-win">CLI Windows</span>');
    }
    card.innerHTML = `
      ${!hasContent && !hasCli ? '<span class="module-empty-badge">À venir</span>' : ''}
      <span class="module-card-icon">${m.icon}</span>
      <div class="module-card-title">${m.label}</div>
      <div class="module-card-desc">${m.desc}</div>
      <div class="module-card-tags">${tags.join('')}</div>
      <div class="module-card-progress">
        <div class="progress-bar-wrap" style="flex:1"><div class="progress-bar-fill" style="width:${prog.pct||0}%;background:${m.color}"></div></div>
        <span class="module-card-progress-pct">${prog.pct||0}%</span>
      </div>`;
    card.addEventListener('click', () => openModule(m.id));
    card.addEventListener('keydown', e => e.key === 'Enter' && openModule(m.id));
    grid.appendChild(card);
  });
  showScreen('home-screen');
}

// ===== OPEN MODULE =====
function openModule(moduleId) {
  const m = MODULES.find(x => x.id === moduleId);
  if (!m) return;
  state.currentModule = m;
  document.getElementById('mobile-module-name').textContent = m.label;
  renderNav();
  const meta = document.getElementById('module-meta');
  meta.innerHTML = `
    <span class="module-meta-icon">${m.icon}</span>
    <span class="module-meta-title">${m.label}</span>
    <span class="module-meta-badge" style="background:${m.color}22;color:${m.color}">${m.topics.slice(0,3).join(' · ')}</span>`;

  const tabs = [];
  if (m.cours.length)       tabs.push({ id: 'cours',       label: 'Cours',        icon: '📖', cli: false });
  if (m.flashcards.length)  tabs.push({ id: 'flashcards',  label: 'Flashcards',   icon: '🃏', cli: false });
  if (m.qcm.length)         tabs.push({ id: 'qcm',         label: 'QCM',          icon: '✅', cli: false });
  if (m.linux_cli)          tabs.push({ id: 'linux_cli',   label: 'Terminal',     icon: '🐧', cli: true,  color: '#00e5a0' });
  if (m.windows_cli)        tabs.push({ id: 'windows_cli', label: 'PowerShell',   icon: '🪟', cli: true,  color: '#3b82f6' });

  const tabBar = document.getElementById('tab-bar');
  tabBar.innerHTML = '';
  if (tabs.length === 0) {
    renderTabContent('empty');
    showScreen('module-screen');
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
    btn.innerHTML = t.cli
      ? `<span class="tab-btn-cli-icon">${t.icon}</span><span>${t.label}</span><span class="tab-btn-cli-dot"></span>`
      : `<span class="tab-btn-icon">${t.icon}</span>${t.label}`;
    btn.addEventListener('click', () => switchTab(t.id));
    tabBar.appendChild(btn);
  });
  switchTab(tabs[0].id);
  showScreen('module-screen');
  closeSidebar();
}

// ===== TABS =====
function switchTab(tabId) {
  state.currentTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.tab === tabId);
    b.setAttribute('aria-selected', b.dataset.tab === tabId ? 'true' : 'false');
  });
  renderTabContent(tabId);
}
function renderTabContent(tabId) {
  const el = document.getElementById('tab-content');
  const m = state.currentModule;
  if (tabId === 'empty' || !m) {
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🚧</span><h3>Contenu à venir</h3><p>Ce module sera alimenté prochainement.</p></div>`;
    return;
  }
  if (tabId === 'cours')       renderCours(m, el);
  else if (tabId === 'flashcards') renderFlashcards(m, el);
  else if (tabId === 'qcm')    renderQCM(m, el);
  else if (tabId === 'linux_cli')   renderCLI('linux', m, el);
  else if (tabId === 'windows_cli') renderCLI('windows', m, el);
}

// ===== COURS =====
function renderCours(m, el) {
  if (!m.cours.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">📖</span><h3>Cours à venir</h3><p>Les cours seront ajoutés prochainement.</p></div>`;
    return;
  }
  const wrap = document.createElement('div');
  wrap.className = 'cours-container';
  m.cours.forEach(cours => {
    const sec = document.createElement('article');
    sec.innerHTML = `<div class="cours-section"><h2>${cours.titre}</h2>${renderCoursContent(cours.sections)}</div>`;
    wrap.appendChild(sec);
  });
  el.innerHTML = '';
  el.appendChild(wrap);
  setProgress(m.id, { pct: Math.max(getProgress(m.id).pct||0, 33) });
}
function renderCoursContent(sections) {
  if (!sections) return '';
  return sections.map(s => {
    if (typeof s === 'string') return `<p>${s}</p>`;
    if (s.type === 'p')     return `<p>${s.content}</p>`;
    if (s.type === 'code')  return `<pre class="code-block">${escHtml(s.content)}</pre>`;
    if (s.type === 'info')  return `<div class="info-box">${s.content}</div>`;
    if (s.type === 'warn')  return `<div class="warn-box">${s.content}</div>`;
    if (s.type === 'ul')    return `<ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
    if (s.type === 'ol')    return `<ol>${s.items.map(i=>`<li>${i}</li>`).join('')}</ol>`;
    if (s.type === 'table') return renderTable(s);
    if (s.type === 'h2')    return `<h2>${s.content}</h2>`;
    if (s.type === 'h3')    return `<h3 style="font-size:15px;font-weight:700;color:var(--text);margin:20px 0 10px">${s.content}</h3>`;
    if (s.type === 'schema') return renderSchema(s.content);
    if (s.type === 'steps')  return renderSteps(s.items);
    if (s.type === 'html-file') return `<div class="html-file-wrap"><iframe src="${s.src}" class="cours-iframe" title="Cours" loading="lazy"></iframe></div>`;
    return '';
  }).join('');
}
function renderSchema(txt) {
  return `<pre class="schema-block">${escHtml(txt)}</pre>`;
}
function renderSteps(items) {
  return items.map(step => {
    const codeBlock = step.code ? `<pre class="code-block" style="margin-top:10px">${escHtml(step.code)}</pre>` : '';
    const whyBlock = step.why ? `<div class="step-why-block">${step.why}</div>` : '';
    return `<div class="cours-step">
      <div class="cours-step-num">${escHtml(step.num)}</div>
      <div class="cours-step-body">
        <div class="cours-step-title">${step.title}</div>
        ${step.content ? `<div class="cours-step-content">${step.content}</div>` : ''}
        ${codeBlock}
        ${whyBlock}
      </div>
    </div>`;
  }).join('');
}
function renderTable(s) {
  const thead = s.headers.map(h=>`<th>${h}</th>`).join('');
  const tbody = s.rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('');
  return `<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>`;
}

// ===== FLASHCARDS =====
function renderFlashcards(m, el) {
  if (!m.flashcards.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">🃏</span><h3>Flashcards à venir</h3><p>Les flashcards seront ajoutées prochainement.</p></div>`;
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
          <div style="font-size:48px;margin-bottom:16px">🎯</div>
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
            <span class="flashcard-hint">← cliquer pour révéler →</span>
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
    el.innerHTML = `<div class="empty-state"><span class="empty-state-icon">✅</span><h3>QCM à venir</h3><p>Les questions seront ajoutées prochainement.</p></div>`;
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
          ${idx+1<total?'Question suivante →':'Voir les résultats →'}
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
  const emoji = pct>=80?'🎉':pct>=60?'👍':'📚';
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
    };
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
        'C:\\Program Files': { type: 'dir' },
        'C:\\Program Files\\WindowsPowerShell': { type: 'dir' },
      },
    };
  }
}

let cliState = null;

function renderCLI(type, m, el) {
  cliState = makeCLIState(type);
  scenarioState = null;

  const isWin = type === 'windows';
  const title = isWin ? '⚡ Windows PowerShell' : '🐧 Bash — ' + cliState.host;
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
            <button class="cli-clear-btn" onclick="cliClear()" aria-label="Effacer le terminal">✕ clear</button>
          </div>
          <div class="cli-help-bar">
            ${isWin
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

  cliPrint(isWin
    ? `<span style="color:var(--blue)">Windows PowerShell</span>\nCopyright (C) Microsoft Corporation.\n\nTape <span style="color:var(--blue)">help</span> · <span style="color:var(--blue)">tp</span> pour les TP guidés\n`
    : `<span style="color:var(--accent)">Bienvenue sur ${cliState.host}</span> — Debian GNU/Linux\nConnecté : <span style="color:var(--accent)">${cliState.user}</span>\nTape <span style="color:var(--accent)">help</span> · <span style="color:var(--accent)">tp</span> pour les TP guidés\n`
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
    case 'ifconfig': {
      out(`eth0: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500
        inet <span style="color:var(--accent)">192.168.1.10</span>  netmask 255.255.255.0  broadcast 192.168.1.255
        ether 08:00:27:ab:cd:ef  txqueuelen 1000  (Ethernet)
        RX packets 1234  bytes 987654 (964.5 KiB)
        TX packets 567   bytes 123456 (120.5 KiB)

lo: flags=73&lt;UP,LOOPBACK,RUNNING&gt;  mtu 65536
        inet <span style="color:var(--accent)">127.0.0.1</span>  netmask 255.0.0.0
        loop  (Local Loopback)`);
      break;
    }
    case 'ip': {
      if (args[0] === 'a' || args[0] === 'addr' || args[0] === 'address') {
        out(`1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet <span style="color:var(--accent)">127.0.0.1/8</span> scope host lo
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc fq_codel state UP
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet <span style="color:var(--accent)">192.168.1.10/24</span> brd 192.168.1.255 scope global eth0`);
      } else if (args[0] === 'r' || args[0] === 'route') {
        out(`default via 192.168.1.1 dev eth0 proto dhcp metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.10`);
      } else {
        out('ip : Utilisation : ip [a|r|link]');
      }
      break;
    }
    case 'ping': {
      const host = args.find(a => !a.startsWith('-')) || 'localhost';
      const count = (() => { const i = args.indexOf('-c'); return i >= 0 ? parseInt(args[i+1])||4 : 4; })();
      const ip = host === 'localhost' || host === '127.0.0.1' ? '127.0.0.1' : '192.168.1.1';
      let lines = `PING ${host} (${ip}) 56(84) bytes of data.`;
      for (let i = 0; i < Math.min(count,4); i++) {
        lines += `\n64 bytes from ${ip}: icmp_seq=${i+1} ttl=64 time=${(Math.random()*2+0.3).toFixed(3)} ms`;
      }
      lines += `\n--- ${host} ping statistics ---\n${count} packets transmitted, ${count} received, 0% packet loss`;
      out(escHtml(lines));
      break;
    }
    case 'netstat': {
      out(`Active Internet connections (only servers)
Proto  Local Address          Foreign Address        State
tcp    0.0.0.0:22             0.0.0.0:*              LISTEN
tcp    0.0.0.0:80             0.0.0.0:*              LISTEN
tcp    127.0.0.1:3306         0.0.0.0:*              LISTEN
tcp6   :::22                  :::*                   LISTEN`);
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
        out(`● ${service}.service — ${action === 'start' ? 'démarré' : action === 'stop' ? 'arrêté' : action}`);
      } else if (action === 'status') {
        const svc = service || 'ssh';
        out(`● ${svc}.service - OpenBSD Secure Shell server
   Loaded: loaded (/lib/systemd/system/${svc}.service; enabled)
   Active: <span style="color:var(--accent)">active (running)</span> since Thu 2025-06-04 10:00:00 CEST
  Process: 420 ExecStart=/usr/sbin/sshd -D
 Main PID: 420 (sshd)
    Tasks: 1 (limit: 4915)
   Memory: 5.2M`);
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
<span style="color:var(--text2)">Fichiers :</span>    cat  mkdir  touch  rm [-r]  cp  mv
<span style="color:var(--text2)">Texte :</span>       echo  grep [-i]
<span style="color:var(--text2)">Processus :</span>   ps  systemctl [start|stop|status]
<span style="color:var(--text2)">Réseau :</span>      ifconfig  ip [a|r]  ping [-c]  netstat
<span style="color:var(--text2)">Système :</span>     whoami  hostname  uname [-a]  chmod  chown  sudo
<span style="color:var(--text2)">Divers :</span>      history  man  clear  help
<span style="color:var(--text3)">↑/↓ historique · Tab autocomplétion · Ctrl+L effacer · Ctrl+C annuler</span>`);
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
  const out = (s) => cliPrint(s);
  const err = (s) => cliPrint(`<span class="cli-err">${escHtml(s)}</span>`);
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
      const services = [
        { status:'Running', name:'sshd',        display:'OpenSSH Server' },
        { status:'Running', name:'W32Time',      display:'Windows Time' },
        { status:'Stopped', name:'WinRM',        display:'Windows Remote Management' },
        { status:'Running', name:'Spooler',      display:'Print Spooler' },
        { status:'Running', name:'ADWS',         display:'Active Directory Web Services' },
        { status:'Running', name:'DNS',          display:'DNS Server' },
        { status:'Running', name:'NTDS',         display:'Active Directory Domain Services' },
        { status:'Stopped', name:'W3SVC',        display:'World Wide Web Publishing' },
      ];
      const filter = args.find(a=>!a.startsWith('-'));
      const filtered = filter ? services.filter(s=>s.name.toLowerCase().includes(filter.toLowerCase())||s.display.toLowerCase().includes(filter.toLowerCase())) : services;
      out(`\nStatus   Name               DisplayName`);
      out(`------   ----               -----------`);
      filtered.forEach(s => out(`<span style="color:${s.status==='Running'?'var(--accent)':'var(--red)'}">${s.status.padEnd(8)}</span> ${s.name.padEnd(18)} ${escHtml(s.display)}`));
      break;
    }
    case 'start-service': case 'sasv': {
      const name = args.find(a=>!a.startsWith('-'));
      if (!name) { err('Start-Service : Paramètre -Name requis.'); break; }
      out(`Service '${escHtml(name)}' démarré.`);
      break;
    }
    case 'stop-service': case 'spsv': {
      const name = args.find(a=>!a.startsWith('-'));
      if (!name) { err('Stop-Service : Paramètre -Name requis.'); break; }
      out(`Service '${escHtml(name)}' arrêté.`);
      break;
    }
    case 'ipconfig': {
      const all = args.includes('/all') || args.includes('-all');
      out(`\nConfiguration IP de Windows\n`);
      if (all) {
        out(`   Nom de l'hôte. . . . . . . . . . . : ${cliState.host}
   Suffixe DNS principal  . . . . . . : tssr.local
   Type de nœud . . . . . . . . . . . : Hybride
   Routage IP activé. . . . . . . . . : Non
   Proxy WINS activé. . . . . . . . . : Non`);
      }
      out(`Carte Ethernet Ethernet :
   Suffixe DNS propre à la connexion  :
   Adresse IPv4. . . . . . . . . . . .: <span style="color:var(--blue)">192.168.1.20</span>
   Masque de sous-réseau . . . . . . .: 255.255.255.0
   Passerelle par défaut . . . . . . .: 192.168.1.1`);
      if (all) out(`   Serveur DHCP . . . . . . . . . . . : 192.168.1.1
   Serveurs DNS. . . . . . . . . . . .: 192.168.1.20
   Bail obtenu . . . . . . . . . . . .: mercredi 4 juin 2025`);
      break;
    }
    case 'ping': {
      const host = args.find(a=>!a.startsWith('-')&&!a.startsWith('/')) || 'localhost';
      const ip = host==='localhost'||host==='127.0.0.1' ? '127.0.0.1' : '192.168.1.1';
      out(`\nPing de ${host} [${ip}] avec 32 octets de données :`);
      for (let i=0;i<4;i++) out(`Réponse de ${ip} : octets=32 durée=${Math.round(Math.random()*3+1)}ms TTL=128`);
      out(`\nStatistiques du Ping pour ${ip} :\n    Paquets : Envoyés = 4, Reçus = 4, Perdus = 0 (perte 0%)`);
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
    case 'get-eventlog': {
      out(`<span style="color:var(--amber)">Attention : Get-EventLog est obsolète. Utilisez Get-WinEvent.\n</span>
   Index Time          EntryType   Source                    InstanceID Message
   ----- ----          ---------   ------                    ---------- -------
    1024 Jun 04 10:00  Information Service Control Manager         7036 Le service sshd est entré...
    1023 Jun 04 09:55  Information Security-Auditing               4624 Ouverture de session réussie.`);
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
<span style="color:var(--text2)">Fichiers :</span>     Get-Content (cat)  New-Item (mkdir/touch)  Remove-Item (rm)
              Copy-Item (cp)  Move-Item (mv)
<span style="color:var(--text2)">Texte :</span>        Write-Output (echo)  Select-String
<span style="color:var(--text2)">Processus :</span>    Get-Process (ps)  Stop-Process
<span style="color:var(--text2)">Services :</span>     Get-Service  Start-Service  Stop-Service
<span style="color:var(--text2)">Réseau :</span>       ipconfig [/all]  ping  netstat  Test-Connection
<span style="color:var(--text2)">Système :</span>      whoami  hostname  Get-ComputerInfo  Get-EventLog
<span style="color:var(--text2)">AD :</span>           Get-ADUser  Get-ADComputer  Get-ADGroup
<span style="color:var(--text2)">Divers :</span>       cls (clear)  help
<span style="color:var(--text3)">↑/↓ historique · Tab autocomplétion · Ctrl+L effacer · Ctrl+C annuler</span>`);
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
    id: 'linux',
    label: 'Terminal Linux',
    sublabel: 'Bash — Debian GNU/Linux',
    icon: '🐧',
    color: '#00e5a0',
    colorDim: 'rgba(0,229,160,0.08)',
    colorBorder: 'rgba(0,229,160,0.25)',
    prompt: 'tssr@debian-srv:~$',
    promptColor: '#00e5a0',
    desc: 'Shell Bash interactif. Filesystem virtuel, réseau, systemd, vim, pipe, redirection.',
    cmds: ['ls -la /etc', 'systemctl status ssh', 'ip addr show', 'ping -c 4 8.8.8.8', 'vim config.sh', 'tp bases'],
    tpCount: 4,
  },
  {
    id: 'windows',
    label: 'PowerShell',
    sublabel: 'Windows Server 2022',
    icon: '🪟',
    color: '#3b82f6',
    colorDim: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.25)',
    prompt: 'PS C:\\Users\\Administrateur>',
    promptColor: '#60a5fa',
    desc: 'PowerShell interactif. Active Directory, services, réseau, filesystem Windows.',
    cmds: ['Get-ChildItem C:\\', 'ipconfig /all', 'Get-Service DNS', 'Get-ADUser -Filter *', 'Test-Connection 8.8.8.8', 'tp bases'],
    tpCount: 3,
  },
];

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
          ↑↓ historique
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
  showScreen('terminal-fullscreen');
  closeSidebar();
}

// ===== SCREENS =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.getElementById('content').scrollTop = 0;
  state.currentScreen = id.replace('-screen','');
  renderNav();
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').classList.remove('active');
}

// ===== INIT =====
document.getElementById('back-btn').addEventListener('click', () => {
  state.currentModule = null;
  renderHome();
});
document.getElementById('menu-toggle').addEventListener('click', () => {
  const open = document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebar-overlay').classList.toggle('active', open);
});
document.getElementById('sidebar-overlay').addEventListener('click', closeSidebar);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}

renderGlobalProgress();
renderHome();
