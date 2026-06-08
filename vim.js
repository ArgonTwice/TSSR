// vim.js — Simulateur vim modal complet
// Modes : normal, insert, visual, command
// Commandes : navigation hjkl, i/a/o/A/I/O, dd/yy/p/P, u, /search, :w :q :wq :q! :set :s

const VIM = (() => {
  let _state = null;
  let _onSave = null;  // callback(filename, content)
  let _onQuit = null;  // callback(saved)

  const COLORS = {
    normal:  { bar: '#1a2a1a', label: 'NORMAL',  accent: '#00e5a0' },
    insert:  { bar: '#1a1a2e', label: 'INSERTION', accent: '#3b82f6' },
    visual:  { bar: '#2a1a2a', label: 'VISUEL',   accent: '#a78bfa' },
    command: { bar: '#2a2a0a', label: 'COMMANDE',  accent: '#f59e0b' },
  };

  function init(filename, content, onSave, onQuit) {
    _onSave = onSave;
    _onQuit = onQuit;
    const lines = content ? content.split('\n') : [''];
    _state = {
      filename,
      lines,
      cursor: { row: 0, col: 0 },
      mode: 'normal',
      modified: false,
      cmdBuf: '',      // buffer commande normale (dd, yy...)
      searchPat: '',
      searchMatches: [],
      searchIdx: -1,
      yanked: [],
      statusMsg: '',
      statusErr: false,
      scroll: 0,       // première ligne visible
      viewH: 20,       // lignes visibles (dynamique)
    };
    render();
  }

  // ===== RENDER =====
  function render() {
    const overlay = document.getElementById('vim-overlay');
    if (!overlay) return;
    const s = _state;
    const m = COLORS[s.mode];
    const visibleLines = s.lines.slice(s.scroll, s.scroll + s.viewH);
    const totalLines = s.lines.length;

    // Construire le contenu ligne par ligne
    let linesHtml = '';
    visibleLines.forEach((line, vi) => {
      const absRow = vi + s.scroll;
      const lineNum = String(absRow + 1).padStart(4, ' ');
      const isCurrentLine = absRow === s.cursor.row;

      let content = escV(line) || ' ';
      if (isCurrentLine && s.mode !== 'insert') {
        const col = Math.min(s.cursor.col, line.length > 0 ? line.length - 1 : 0);
        const before = escV(line.slice(0, col));
        const cur = escV(line[col] || ' ');
        const after = escV(line.slice(col + 1));
        content = `${before}<span class="vim-cursor">${cur}</span>${after}`;
      } else if (isCurrentLine && s.mode === 'insert') {
        const col = s.cursor.col;
        const before = escV(line.slice(0, col));
        const after = escV(line.slice(col));
        content = `${before}<span class="vim-cursor vim-cursor-insert">|</span>${after}`;
      }

      // Highlight search
      if (s.searchPat && !isCurrentLine) {
        try {
          const re = new RegExp(`(${s.searchPat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'g');
          content = escV(line).replace(re, '<span class="vim-search-hl">$1</span>');
        } catch {}
      }

      linesHtml += `<div class="vim-line ${isCurrentLine ? 'vim-line-current' : ''}">
        <span class="vim-linenum">${lineNum}</span>
        <span class="vim-linecontent">${content || ' '}</span>
      </div>`;
    });

    // Lignes vides (~)
    const emptyCount = Math.max(0, s.viewH - visibleLines.length);
    for (let i = 0; i < emptyCount; i++) {
      linesHtml += `<div class="vim-line"><span class="vim-linenum vim-tilde">   ~</span><span class="vim-linecontent"> </span></div>`;
    }

    const pct = totalLines > 1 ? Math.round((s.cursor.row / (totalLines - 1)) * 100) : 100;
    const pos = `${s.cursor.row + 1},${s.cursor.col + 1}`;
    const statusRight = `${pos.padEnd(12)}${pct}%`;
    const modifiedMark = s.modified ? '[+]' : '';
    const statusLeft = `${s.mode === 'command' ? '' : `${m.label.padEnd(10)}`} ${s.filename} ${modifiedMark}`;

    const cmdLine = s.mode === 'command'
      ? `<span style="color:${m.accent}">:${escV(s.cmdBuf)}<span class="vim-cursor">_</span></span>`
      : s.statusMsg
        ? `<span style="${s.statusErr ? 'color:#ff6b6b' : 'color:#9dbd8a'}">${escV(s.statusMsg)}</span>`
        : `<span style="color:var(--text3)">  ${s.searchPat ? `/${s.searchPat}` : ''}</span>`;

    overlay.querySelector('.vim-lines').innerHTML = linesHtml;
    overlay.querySelector('.vim-statusbar-left').innerHTML = `<span class="vim-mode-label" style="background:${m.accent};color:#0a0e1a">&nbsp;${m.label}&nbsp;</span>&nbsp;${escV(s.filename)}&nbsp;${modifiedMark}`;
    overlay.querySelector('.vim-statusbar-right').textContent = statusRight;
    overlay.querySelector('.vim-cmdline').innerHTML = cmdLine;
  }

  function escV(s) {
    return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ===== CURSOR =====
  function clampCursor() {
    const s = _state;
    s.cursor.row = Math.max(0, Math.min(s.cursor.row, s.lines.length - 1));
    const lineLen = s.lines[s.cursor.row]?.length || 0;
    const maxCol = s.mode === 'insert' ? lineLen : Math.max(0, lineLen - 1);
    s.cursor.col = Math.max(0, Math.min(s.cursor.col, maxCol));
    // Scroll
    if (s.cursor.row < s.scroll) s.scroll = s.cursor.row;
    if (s.cursor.row >= s.scroll + s.viewH) s.scroll = s.cursor.row - s.viewH + 1;
  }

  function currentLine() { return _state.lines[_state.cursor.row] || ''; }

  // ===== KEYDOWN HANDLER =====
  function onKey(e) {
    if (!_state) return;
    const s = _state;
    e.stopPropagation();

    if (s.mode === 'insert') {
      handleInsert(e);
    } else if (s.mode === 'command') {
      handleCommand(e);
    } else if (s.mode === 'normal') {
      handleNormal(e);
    }
    clampCursor();
    render();
  }

  // ===== INSERT MODE =====
  function handleInsert(e) {
    const s = _state;
    if (e.key === 'Escape') {
      s.mode = 'normal';
      if (s.cursor.col > 0) s.cursor.col--;
      s.statusMsg = '';
      return;
    }
    e.preventDefault();
    if (e.key === 'Enter') {
      const line = s.lines[s.cursor.row];
      const before = line.slice(0, s.cursor.col);
      const after = line.slice(s.cursor.col);
      s.lines[s.cursor.row] = before;
      s.lines.splice(s.cursor.row + 1, 0, after);
      s.cursor.row++;
      s.cursor.col = 0;
    } else if (e.key === 'Backspace') {
      const line = s.lines[s.cursor.row];
      if (s.cursor.col > 0) {
        s.lines[s.cursor.row] = line.slice(0, s.cursor.col - 1) + line.slice(s.cursor.col);
        s.cursor.col--;
      } else if (s.cursor.row > 0) {
        const prevLen = s.lines[s.cursor.row - 1].length;
        s.lines[s.cursor.row - 1] += line;
        s.lines.splice(s.cursor.row, 1);
        s.cursor.row--;
        s.cursor.col = prevLen;
      }
    } else if (e.key === 'Delete') {
      const line = s.lines[s.cursor.row];
      if (s.cursor.col < line.length) {
        s.lines[s.cursor.row] = line.slice(0, s.cursor.col) + line.slice(s.cursor.col + 1);
      }
    } else if (e.key === 'ArrowLeft')  { s.cursor.col = Math.max(0, s.cursor.col - 1); }
    else if (e.key === 'ArrowRight') { s.cursor.col++; }
    else if (e.key === 'ArrowUp')    { s.cursor.row = Math.max(0, s.cursor.row - 1); }
    else if (e.key === 'ArrowDown')  { s.cursor.row = Math.min(s.lines.length - 1, s.cursor.row + 1); }
    else if (e.key === 'Tab') {
      const line = s.lines[s.cursor.row];
      s.lines[s.cursor.row] = line.slice(0, s.cursor.col) + '    ' + line.slice(s.cursor.col);
      s.cursor.col += 4;
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const line = s.lines[s.cursor.row];
      s.lines[s.cursor.row] = line.slice(0, s.cursor.col) + e.key + line.slice(s.cursor.col);
      s.cursor.col++;
    }
    s.modified = true;
  }

  // ===== COMMAND MODE (:...) =====
  function handleCommand(e) {
    const s = _state;
    if (e.key === 'Escape') { s.mode = 'normal'; s.cmdBuf = ''; return; }
    e.preventDefault();
    if (e.key === 'Backspace') {
      if (s.cmdBuf.length === 0) { s.mode = 'normal'; return; }
      s.cmdBuf = s.cmdBuf.slice(0, -1);
      return;
    }
    if (e.key === 'Enter') {
      execExCommand(s.cmdBuf.trim());
      s.mode = 'normal';
      s.cmdBuf = '';
      return;
    }
    if (e.key.length === 1) s.cmdBuf += e.key;
  }

  function execExCommand(cmd) {
    const s = _state;
    s.statusMsg = ''; s.statusErr = false;

    if (cmd === 'w' || cmd === 'write') {
      if (_onSave) _onSave(s.filename, s.lines.join('\n'));
      s.modified = false;
      s.statusMsg = `"${s.filename}" ${s.lines.length}L, ${s.lines.join('\n').length}C écrit`;
      return;
    }
    if (cmd === 'q') {
      if (s.modified) { s.statusMsg = 'Modifications non sauvegardées (utiliser :q! pour forcer)'; s.statusErr = true; return; }
      destroyVim(); if (_onQuit) _onQuit(false); return;
    }
    if (cmd === 'q!') { destroyVim(); if (_onQuit) _onQuit(false); return; }
    if (cmd === 'wq' || cmd === 'x') {
      if (_onSave) _onSave(s.filename, s.lines.join('\n'));
      destroyVim(); if (_onQuit) _onQuit(true); return;
    }
    if (cmd === 'wq!') {
      if (_onSave) _onSave(s.filename, s.lines.join('\n'));
      destroyVim(); if (_onQuit) _onQuit(true); return;
    }
    // :numero (aller à la ligne)
    if (/^\d+$/.test(cmd)) {
      s.cursor.row = Math.min(parseInt(cmd) - 1, s.lines.length - 1);
      return;
    }
    // :s/pattern/replacement/[g]
    const subMatch = cmd.match(/^s\/(.+?)\/(.*)\/?(g?)$/);
    if (subMatch) {
      const [, pat, rep, flags] = subMatch;
      const line = s.lines[s.cursor.row];
      try {
        const re = new RegExp(pat, flags === 'g' ? 'g' : '');
        s.lines[s.cursor.row] = line.replace(re, rep);
        s.modified = true;
        s.statusMsg = 'Substitution effectuée';
      } catch { s.statusMsg = 'Pattern invalide'; s.statusErr = true; }
      return;
    }
    // :%s/pattern/replacement/g
    const globSubMatch = cmd.match(/^%s\/(.+?)\/(.*)\/?(g?)$/);
    if (globSubMatch) {
      const [, pat, rep, flags] = globSubMatch;
      try {
        const re = new RegExp(pat, 'g');
        s.lines = s.lines.map(l => l.replace(re, rep));
        s.modified = true;
        s.statusMsg = 'Substitution globale effectuée';
      } catch { s.statusMsg = 'Pattern invalide'; s.statusErr = true; }
      return;
    }
    if (cmd === 'set number' || cmd === 'set nu') { s.statusMsg = 'Numéros de ligne activés (toujours actifs)'; return; }
    if (cmd === 'set nonumber' || cmd === 'set nonu') { s.statusMsg = 'Option ignorée'; return; }
    if (cmd === '$') { s.cursor.row = s.lines.length - 1; return; }
    if (cmd.startsWith('e ') || cmd.startsWith('edit ')) {
      s.statusMsg = 'Édition de fichier externe non supportée dans la simulation'; s.statusErr = true; return;
    }
    s.statusMsg = `Commande inconnue : ${cmd}`; s.statusErr = true;
  }

  // ===== NORMAL MODE =====
  let _normBuf = '';
  let _normCount = '';

  function handleNormal(e) {
    const s = _state;
    if (e.key === 'Escape') { _normBuf = ''; _normCount = ''; s.statusMsg = ''; return; }
    e.preventDefault();

    const key = e.key;

    // Count prefix
    if (/^[1-9]$/.test(key) && _normBuf === '') { _normCount += key; return; }
    if (key === '0' && _normCount !== '') { _normCount += key; return; }

    const count = parseInt(_normCount) || 1;
    _normBuf += key;

    // Mode switches
    if (_normBuf === 'i') { s.mode = 'insert'; _normBuf = ''; _normCount = ''; return; }
    if (_normBuf === 'I') { s.mode = 'insert'; s.cursor.col = 0; _normBuf = ''; _normCount = ''; return; }
    if (_normBuf === 'a') { s.mode = 'insert'; s.cursor.col = Math.min(s.cursor.col + 1, currentLine().length); _normBuf = ''; _normCount = ''; return; }
    if (_normBuf === 'A') { s.mode = 'insert'; s.cursor.col = currentLine().length; _normBuf = ''; _normCount = ''; return; }
    if (_normBuf === 'o') {
      s.lines.splice(s.cursor.row + 1, 0, '');
      s.cursor.row++; s.cursor.col = 0;
      s.mode = 'insert'; s.modified = true; _normBuf = ''; _normCount = ''; return;
    }
    if (_normBuf === 'O') {
      s.lines.splice(s.cursor.row, 0, '');
      s.cursor.col = 0;
      s.mode = 'insert'; s.modified = true; _normBuf = ''; _normCount = ''; return;
    }
    if (_normBuf === 'R') { s.mode = 'insert'; _normBuf = ''; _normCount = ''; s.statusMsg = '-- REPLACE --'; return; }
    if (_normBuf === ':') { s.mode = 'command'; _normBuf = ''; _normCount = ''; return; }
    if (_normBuf === '/') {
      s.mode = 'command'; s.cmdBuf = '/'; _normBuf = ''; _normCount = '';
      // override: intercept / in command
      _state._searchMode = true;
      return;
    }

    // Navigation
    if (key === 'h' || key === 'ArrowLeft')  { for (let i=0;i<count;i++) s.cursor.col = Math.max(0, s.cursor.col - 1); _normBuf=''; _normCount=''; return; }
    if (key === 'l' || key === 'ArrowRight') { for (let i=0;i<count;i++) s.cursor.col++; _normBuf=''; _normCount=''; return; }
    if (key === 'j' || key === 'ArrowDown')  { for (let i=0;i<count;i++) s.cursor.row = Math.min(s.lines.length-1, s.cursor.row+1); _normBuf=''; _normCount=''; return; }
    if (key === 'k' || key === 'ArrowUp')    { for (let i=0;i<count;i++) s.cursor.row = Math.max(0, s.cursor.row-1); _normBuf=''; _normCount=''; return; }
    if (key === '0') { s.cursor.col = 0; _normBuf=''; _normCount=''; return; }
    if (key === '$') { s.cursor.col = Math.max(0, currentLine().length - 1); _normBuf=''; _normCount=''; return; }
    if (key === 'g' && _normBuf === 'gg') { s.cursor.row = 0; s.cursor.col = 0; _normBuf=''; _normCount=''; return; }
    if (key === 'G') { s.cursor.row = s.lines.length-1; _normBuf=''; _normCount=''; return; }
    if (key === 'w') {
      // Next word
      let col = s.cursor.col; const line = currentLine();
      while (col < line.length && /\w/.test(line[col])) col++;
      while (col < line.length && !/\w/.test(line[col])) col++;
      s.cursor.col = col; _normBuf=''; _normCount=''; return;
    }
    if (key === 'b') {
      let col = s.cursor.col - 1; const line = currentLine();
      while (col > 0 && !/\w/.test(line[col])) col--;
      while (col > 0 && /\w/.test(line[col-1])) col--;
      s.cursor.col = Math.max(0, col); _normBuf=''; _normCount=''; return;
    }

    // Page up/down
    if (e.ctrlKey && key === 'f') { s.cursor.row = Math.min(s.lines.length-1, s.cursor.row + s.viewH); _normBuf=''; _normCount=''; return; }
    if (e.ctrlKey && key === 'b') { s.cursor.row = Math.max(0, s.cursor.row - s.viewH); _normBuf=''; _normCount=''; return; }
    if (e.ctrlKey && key === 'd') { s.cursor.row = Math.min(s.lines.length-1, s.cursor.row + Math.floor(s.viewH/2)); _normBuf=''; _normCount=''; return; }
    if (e.ctrlKey && key === 'u') { s.cursor.row = Math.max(0, s.cursor.row - Math.floor(s.viewH/2)); _normBuf=''; _normCount=''; return; }

    // Edit ops
    if (_normBuf === 'dd') {
      s.yanked = s.lines.splice(s.cursor.row, count);
      if (s.cursor.row >= s.lines.length) s.cursor.row = Math.max(0, s.lines.length-1);
      if (s.lines.length === 0) s.lines = [''];
      s.modified = true; s.statusMsg = `${count} ligne${count>1?'s':''} supprimée${count>1?'s':''}`; _normBuf=''; _normCount=''; return;
    }
    if (_normBuf === 'yy') {
      s.yanked = s.lines.slice(s.cursor.row, s.cursor.row + count);
      s.statusMsg = `${count} ligne${count>1?'s':''} copiée${count>1?'s':''}`; _normBuf=''; _normCount=''; return;
    }
    if (key === 'p') {
      if (s.yanked.length) {
        s.lines.splice(s.cursor.row + 1, 0, ...s.yanked);
        s.cursor.row += s.yanked.length;
        s.modified = true;
      }
      _normBuf=''; _normCount=''; return;
    }
    if (key === 'P') {
      if (s.yanked.length) {
        s.lines.splice(s.cursor.row, 0, ...s.yanked);
        s.modified = true;
      }
      _normBuf=''; _normCount=''; return;
    }
    if (_normBuf === 'x' || key === 'Delete') {
      const line = s.lines[s.cursor.row];
      if (s.cursor.col < line.length) {
        s.lines[s.cursor.row] = line.slice(0, s.cursor.col) + line.slice(s.cursor.col + 1);
        s.modified = true;
      }
      _normBuf=''; _normCount=''; return;
    }
    if (_normBuf === 'D') {
      s.lines[s.cursor.row] = currentLine().slice(0, s.cursor.col);
      s.modified = true; _normBuf=''; _normCount=''; return;
    }
    if (_normBuf === 'cc' || _normBuf === 'S') {
      s.yanked = [currentLine()];
      s.lines[s.cursor.row] = '';
      s.cursor.col = 0; s.mode = 'insert'; s.modified = true; _normBuf=''; _normCount=''; return;
    }
    if (_normBuf === 'J') {
      if (s.cursor.row < s.lines.length - 1) {
        s.lines[s.cursor.row] += ' ' + s.lines[s.cursor.row + 1];
        s.lines.splice(s.cursor.row + 1, 1);
        s.modified = true;
      }
      _normBuf=''; _normCount=''; return;
    }
    if (key === 'u') {
      s.statusMsg = 'undo non disponible dans cette simulation'; _normBuf=''; _normCount=''; return;
    }
    if (key === 'n') {
      // next search
      doSearch(1); _normBuf=''; _normCount=''; return;
    }
    if (key === 'N') {
      doSearch(-1); _normBuf=''; _normCount=''; return;
    }

    // Buffer trop long sans match → reset
    if (_normBuf.length > 3) { _normBuf = key; }
  }

  function doSearch(dir) {
    const s = _state;
    if (!s.searchPat) return;
    try {
      const re = new RegExp(s.searchPat, 'i');
      const start = s.cursor.row;
      let found = false;
      const range = dir > 0
        ? [...Array(s.lines.length).keys()].map(i => (start + 1 + i) % s.lines.length)
        : [...Array(s.lines.length).keys()].map(i => (start - 1 - i + s.lines.length) % s.lines.length);
      for (const row of range) {
        if (re.test(s.lines[row])) {
          s.cursor.row = row;
          s.cursor.col = s.lines[row].search(re);
          s.statusMsg = `/${s.searchPat}`;
          found = true; break;
        }
      }
      if (!found) { s.statusMsg = `Pattern introuvable: ${s.searchPat}`; s.statusErr = true; }
    } catch {}
  }

  // Override command mode pour la recherche /
  const _origHandleCommand = handleCommand;

  function handleCommandWithSearch(e) {
    const s = _state;
    if (s._searchMode) {
      if (e.key === 'Escape') { s.mode = 'normal'; s.cmdBuf = ''; s._searchMode = false; return; }
      e.preventDefault();
      if (e.key === 'Enter') {
        s.searchPat = s.cmdBuf.slice(1); // enlever le /
        s._searchMode = false;
        doSearch(1);
        s.mode = 'normal'; s.cmdBuf = ''; return;
      }
      if (e.key === 'Backspace') {
        s.cmdBuf = s.cmdBuf.slice(0, -1);
        if (s.cmdBuf === '') { s._searchMode = false; s.mode = 'normal'; }
        return;
      }
      if (e.key.length === 1) { s.cmdBuf += e.key; }
      return;
    }
    _origHandleCommand(e);
  }

  // ===== DOM SETUP =====
  function mount(filename, content, onSave, onQuit) {
    // Créer l'overlay
    let overlay = document.getElementById('vim-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'vim-overlay';
      overlay.className = 'vim-overlay';
      overlay.innerHTML = `
        <div class="vim-editor">
          <div class="vim-lines"></div>
          <div class="vim-statusbar">
            <span class="vim-statusbar-left"></span>
            <span class="vim-statusbar-right"></span>
          </div>
          <div class="vim-cmdline"></div>
        </div>`;
      document.getElementById('tab-content').appendChild(overlay);
    }
    overlay.style.display = 'flex';

    // Calculer hauteur
    const editorHeight = overlay.offsetHeight || 500;
    const lineHeight = 20; // px
    _state = null;
    init(filename, content, onSave, onQuit);
    _state.viewH = Math.max(10, Math.floor((editorHeight - 60) / lineHeight));

    overlay.addEventListener('keydown', (e) => {
      if (_state.mode === 'command') handleCommandWithSearch(e);
      else onKey(e);
      clampCursor();
      render();
    }, true);

    overlay.setAttribute('tabindex', '0');
    overlay.focus();
    render();
  }

  function destroyVim() {
    const overlay = document.getElementById('vim-overlay');
    if (overlay) overlay.style.display = 'none';
    // Refocus le terminal
    const input = document.getElementById('cli-input');
    if (input) { input.focus(); }
    _state = null;
  }

  return { mount, destroy: destroyVim };
})();
