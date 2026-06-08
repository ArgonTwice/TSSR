// scenarios.js — Moteur TP guidés avec validation automatique
// Chaque scénario = liste d'étapes avec validation de la commande tapée
// et/ou validation de l'état du filesystem après

const SCENARIOS = {
  // ===== LINUX =====
  linux_bases: {
    id: 'linux_bases',
    title: 'Prise en main Linux',
    icon: '🐧',
    desc: 'Navigation, fichiers, répertoires',
    type: 'linux',
    steps: [
      {
        id: 'pwd',
        instruction: 'Affiche ton répertoire courant.',
        hint: 'Utilise la commande <code>pwd</code>',
        validate: (cmd) => cmd.trim() === 'pwd',
        successMsg: '✓ pwd affiche le chemin absolu du répertoire courant.',
      },
      {
        id: 'ls',
        instruction: 'Liste le contenu du répertoire courant.',
        hint: 'Utilise <code>ls</code> ou <code>ls -l</code>',
        validate: (cmd) => /^ls(\s|$)/.test(cmd.trim()),
        successMsg: '✓ ls liste les fichiers. -l donne les détails, -a montre les fichiers cachés.',
      },
      {
        id: 'mkdir',
        instruction: 'Crée un répertoire nommé <code>tp_linux</code>.',
        hint: 'Utilise <code>mkdir tp_linux</code>',
        validate: (cmd, fs, cwd) => {
          const path = cwd + '/tp_linux';
          return cmd.includes('mkdir') && cmd.includes('tp_linux') && !!fs[path];
        },
        successMsg: '✓ mkdir crée un répertoire. Vérifie avec ls.',
      },
      {
        id: 'cd',
        instruction: 'Entre dans le répertoire <code>tp_linux</code>.',
        hint: 'Utilise <code>cd tp_linux</code>',
        validate: (cmd, fs, cwd) => /^cd\s+tp_linux/.test(cmd.trim()) && cwd.endsWith('tp_linux'),
        successMsg: '✓ cd (change directory) te déplace dans l\'arborescence.',
      },
      {
        id: 'touch',
        instruction: 'Crée un fichier vide <code>index.txt</code>.',
        hint: 'Utilise <code>touch index.txt</code>',
        validate: (cmd, fs, cwd) => cmd.includes('touch') && !!fs[cwd + '/index.txt'],
        successMsg: '✓ touch crée un fichier vide (ou met à jour sa date).',
      },
      {
        id: 'echo_write',
        instruction: 'Écris "Hello TSSR" dans <code>index.txt</code>.',
        hint: 'Utilise <code>echo "Hello TSSR" > index.txt</code>',
        validate: (cmd, fs, cwd) => {
          const f = fs[cwd + '/index.txt'];
          return cmd.includes('echo') && cmd.includes('>') && f && f.content && f.content.includes('Hello');
        },
        successMsg: '✓ > redirige la sortie dans un fichier (écrase). >> pour ajouter.',
      },
      {
        id: 'cat',
        instruction: 'Affiche le contenu de <code>index.txt</code>.',
        hint: 'Utilise <code>cat index.txt</code>',
        validate: (cmd) => /^cat\s+/.test(cmd.trim()) && cmd.includes('index.txt'),
        successMsg: '✓ cat (concatenate) affiche le contenu d\'un fichier.',
      },
      {
        id: 'cp',
        instruction: 'Copie <code>index.txt</code> en <code>backup.txt</code>.',
        hint: 'Utilise <code>cp index.txt backup.txt</code>',
        validate: (cmd, fs, cwd) => cmd.startsWith('cp') && !!fs[cwd + '/backup.txt'],
        successMsg: '✓ cp copie un fichier. cp -r pour les répertoires.',
      },
      {
        id: 'rm',
        instruction: 'Supprime <code>backup.txt</code>.',
        hint: 'Utilise <code>rm backup.txt</code>',
        validate: (cmd, fs, cwd) => cmd.startsWith('rm') && !fs[cwd + '/backup.txt'],
        successMsg: '✓ rm supprime définitivement. Pas de corbeille en ligne de commande !',
      },
    ],
  },

  linux_permissions: {
    id: 'linux_permissions',
    title: 'Permissions Linux',
    icon: '🔒',
    desc: 'chmod, chown, droits rwx',
    type: 'linux',
    steps: [
      {
        id: 'create_script',
        instruction: 'Crée un fichier <code>script.sh</code> dans ton home.',
        hint: '<code>touch script.sh</code>',
        validate: (cmd, fs, cwd) => cmd.includes('touch') && cmd.includes('script.sh') && !!fs['/home/tssr/script.sh'],
        successMsg: '✓ Fichier créé. Par défaut : -rw-r--r-- (644)',
      },
      {
        id: 'chmod_x',
        instruction: 'Rends <code>script.sh</code> exécutable pour l\'utilisateur.',
        hint: '<code>chmod u+x script.sh</code> ou <code>chmod 755 script.sh</code>',
        validate: (cmd) => cmd.startsWith('chmod') && (cmd.includes('+x') || cmd.includes('755') || cmd.includes('744')) && cmd.includes('script.sh'),
        successMsg: '✓ u+x ajoute l\'exécution pour l\'utilisateur. 755 = rwxr-xr-x',
      },
      {
        id: 'chmod_numeric',
        instruction: 'Mets les permissions <code>640</code> sur <code>script.sh</code>.',
        hint: '<code>chmod 640 script.sh</code> → rw-r-----',
        validate: (cmd) => cmd.startsWith('chmod') && cmd.includes('640'),
        successMsg: '✓ 640 = rw-r----- : propriétaire lit/écrit, groupe lit, autres rien.',
      },
      {
        id: 'chown',
        instruction: 'Essaie de changer le propriétaire avec <code>chown</code>.',
        hint: '<code>sudo chown root:root script.sh</code>',
        validate: (cmd) => cmd.includes('chown') && cmd.includes('root'),
        successMsg: '✓ chown change propriétaire:groupe. Nécessite sudo pour changer à root.',
      },
      {
        id: 'ls_perms',
        instruction: 'Vérifie les permissions avec <code>ls -l</code>.',
        hint: '<code>ls -l</code>',
        validate: (cmd) => /^ls\s+-l/.test(cmd) || cmd === 'ls -l' || cmd === 'ls -la',
        successMsg: '✓ ls -l affiche mode permissions liens propriétaire groupe taille date nom.',
      },
    ],
  },

  linux_reseau: {
    id: 'linux_reseau',
    title: 'Réseau Linux',
    icon: '🌐',
    desc: 'Interfaces, IP, connectivité',
    type: 'linux',
    steps: [
      {
        id: 'ifconfig',
        instruction: 'Affiche la configuration des interfaces réseau.',
        hint: '<code>ifconfig</code> ou <code>ip a</code>',
        validate: (cmd) => cmd === 'ifconfig' || cmd.startsWith('ip a') || cmd.startsWith('ip addr'),
        successMsg: '✓ ifconfig/ip addr affiche les adresses IP, masques et état des interfaces.',
      },
      {
        id: 'ping_lo',
        instruction: 'Teste la connectivité vers localhost.',
        hint: '<code>ping -c 4 127.0.0.1</code>',
        validate: (cmd) => cmd.startsWith('ping') && (cmd.includes('127.0.0.1') || cmd.includes('localhost')),
        successMsg: '✓ ping ICMP Echo Request/Reply. -c limite le nombre de paquets.',
      },
      {
        id: 'ping_gw',
        instruction: 'Teste la connectivité vers la passerelle <code>192.168.1.1</code>.',
        hint: '<code>ping -c 4 192.168.1.1</code>',
        validate: (cmd) => cmd.startsWith('ping') && cmd.includes('192.168.1'),
        successMsg: '✓ Si la passerelle répond, la couche 3 du LAN fonctionne.',
      },
      {
        id: 'route',
        instruction: 'Affiche la table de routage.',
        hint: '<code>ip r</code> ou <code>ip route</code>',
        validate: (cmd) => /^ip\s+r/.test(cmd) || cmd === 'netstat -r',
        successMsg: '✓ La route par défaut (0.0.0.0/0) pointe vers la passerelle.',
      },
      {
        id: 'netstat_ports',
        instruction: 'Affiche les ports en écoute.',
        hint: '<code>netstat -tlnp</code> ou <code>netstat</code>',
        validate: (cmd) => cmd.startsWith('netstat'),
        successMsg: '✓ -t TCP -u UDP -l listening -n numérique -p processus.',
      },
      {
        id: 'cat_interfaces',
        instruction: 'Affiche la config réseau dans <code>/etc/network/interfaces</code>.',
        hint: '<code>cat /etc/network/interfaces</code>',
        validate: (cmd) => cmd.startsWith('cat') && cmd.includes('interfaces'),
        successMsg: '✓ Ce fichier configure les interfaces réseau au démarrage sous Debian.',
      },
    ],
  },

  linux_services: {
    id: 'linux_services',
    title: 'Services systemd',
    icon: '⚙️',
    desc: 'systemctl, gestion des services',
    type: 'linux',
    steps: [
      {
        id: 'status',
        instruction: 'Vérifie le statut du service <code>ssh</code>.',
        hint: '<code>systemctl status ssh</code>',
        validate: (cmd) => cmd.startsWith('systemctl') && cmd.includes('status') && (cmd.includes('ssh') || cmd.includes('sshd')),
        successMsg: '✓ systemctl status affiche active/inactive, logs récents et PID.',
      },
      {
        id: 'list',
        instruction: 'Liste tous les services actifs.',
        hint: '<code>systemctl list-units</code>',
        validate: (cmd) => cmd.startsWith('systemctl') && cmd.includes('list'),
        successMsg: '✓ list-units affiche tous les services. --type=service pour filtrer.',
      },
      {
        id: 'stop',
        instruction: 'Arrête le service <code>cron</code>.',
        hint: '<code>sudo systemctl stop cron</code>',
        validate: (cmd) => cmd.includes('systemctl') && cmd.includes('stop') && cmd.includes('cron'),
        successMsg: '✓ stop arrête le service immédiatement (pas de persistance au redémarrage).',
      },
      {
        id: 'start',
        instruction: 'Démarre le service <code>cron</code>.',
        hint: '<code>sudo systemctl start cron</code>',
        validate: (cmd) => cmd.includes('systemctl') && cmd.includes('start') && cmd.includes('cron'),
        successMsg: '✓ start démarre. restart = stop + start. reload recharge la config sans couper.',
      },
      {
        id: 'enable',
        instruction: 'Active <code>cron</code> au démarrage.',
        hint: '<code>sudo systemctl enable cron</code>',
        validate: (cmd) => cmd.includes('systemctl') && cmd.includes('enable') && cmd.includes('cron'),
        successMsg: '✓ enable crée un symlink dans /etc/systemd/system. disable l\'inverse.',
      },
    ],
  },

  // ===== WINDOWS =====
  windows_bases: {
    id: 'windows_bases',
    title: 'Bases PowerShell',
    icon: '🪟',
    desc: 'Navigation et fichiers PowerShell',
    type: 'windows',
    steps: [
      {
        id: 'get-location',
        instruction: 'Affiche ton répertoire courant.',
        hint: '<code>Get-Location</code> ou alias <code>pwd</code>',
        validate: (cmd) => /^(get-location|gl|pwd)$/i.test(cmd.trim()),
        successMsg: '✓ Get-Location = pwd sous Unix. PowerShell suit la convention Verbe-Nom.',
      },
      {
        id: 'get-childitem',
        instruction: 'Liste le contenu du répertoire courant.',
        hint: '<code>Get-ChildItem</code> ou alias <code>ls</code> / <code>dir</code>',
        validate: (cmd) => /^(get-childitem|gci|ls|dir)(\s|$)/i.test(cmd.trim()),
        successMsg: '✓ Get-ChildItem affiche Mode, LastWriteTime, Length, Name.',
      },
      {
        id: 'new-item-dir',
        instruction: 'Crée un répertoire <code>TP_Windows</code>.',
        hint: '<code>New-Item -Name TP_Windows -ItemType Directory</code> ou <code>mkdir TP_Windows</code>',
        validate: (cmd, fs, cwd) => {
          const p1 = cwd + '\\TP_Windows';
          return (cmd.toLowerCase().includes('new-item') || cmd.toLowerCase().includes('mkdir')) &&
                 cmd.includes('TP_Windows') && !!fs[p1];
        },
        successMsg: '✓ New-Item crée fichiers et dossiers. -ItemType Directory ou File.',
      },
      {
        id: 'set-location',
        instruction: 'Entre dans <code>TP_Windows</code>.',
        hint: '<code>Set-Location TP_Windows</code> ou <code>cd TP_Windows</code>',
        validate: (cmd, fs, cwd) => /^(set-location|sl|cd)\s+TP_Windows/i.test(cmd.trim()) && cwd.includes('TP_Windows'),
        successMsg: '✓ Set-Location = cd. PowerShell gère aussi les chemins UNC (\\\\serveur\\partage).',
      },
      {
        id: 'new-item-file',
        instruction: 'Crée un fichier <code>notes.txt</code>.',
        hint: '<code>New-Item -Name notes.txt -ItemType File</code>',
        validate: (cmd, fs, cwd) => cmd.toLowerCase().includes('new-item') && cmd.includes('notes.txt') && !!fs[cwd + '\\notes.txt'],
        successMsg: '✓ New-Item -ItemType File crée un fichier vide.',
      },
      {
        id: 'get-content',
        instruction: 'Affiche le contenu de <code>C:\\Windows\\System32\\drivers\\etc\\hosts</code>.',
        hint: '<code>Get-Content C:\\Windows\\System32\\drivers\\etc\\hosts</code>',
        validate: (cmd) => /^(get-content|gc|cat)\s+/i.test(cmd) && cmd.toLowerCase().includes('hosts'),
        successMsg: '✓ Get-Content lit un fichier. Équivalent de cat. Supporte aussi -Tail N.',
      },
    ],
  },

  windows_reseau: {
    id: 'windows_reseau',
    title: 'Réseau Windows',
    icon: '🌐',
    desc: 'ipconfig, ping, netstat, services réseau',
    type: 'windows',
    steps: [
      {
        id: 'ipconfig',
        instruction: 'Affiche la configuration IP de base.',
        hint: '<code>ipconfig</code>',
        validate: (cmd) => /^ipconfig(\s|$)/i.test(cmd.trim()),
        successMsg: '✓ ipconfig affiche IPv4, masque, passerelle par adaptateur.',
      },
      {
        id: 'ipconfig_all',
        instruction: 'Affiche TOUTE la configuration réseau (DNS, DHCP...).',
        hint: '<code>ipconfig /all</code>',
        validate: (cmd) => /^ipconfig\s+\/all/i.test(cmd.trim()),
        successMsg: '✓ /all ajoute MAC, serveur DHCP, serveurs DNS, durée du bail.',
      },
      {
        id: 'ping',
        instruction: 'Teste la connectivité vers la passerelle.',
        hint: '<code>ping 192.168.1.1</code>',
        validate: (cmd) => /^ping\s+/i.test(cmd) && cmd.includes('192.168.1'),
        successMsg: '✓ Sous Windows, ping envoie 4 paquets par défaut. Temps en ms.',
      },
      {
        id: 'test-connection',
        instruction: 'Utilise <code>Test-Connection</code> pour tester une connectivité.',
        hint: '<code>Test-Connection 8.8.8.8</code>',
        validate: (cmd) => /^test-connection\s+/i.test(cmd.trim()),
        successMsg: '✓ Test-Connection = ping PowerShell. Retourne un objet avec latence, TTL...',
      },
      {
        id: 'netstat',
        instruction: 'Affiche les connexions TCP actives et ports en écoute.',
        hint: '<code>netstat -an</code>',
        validate: (cmd) => /^netstat(\s|$)/i.test(cmd.trim()),
        successMsg: '✓ netstat -an affiche toutes les connexions. -o ajoute le PID.',
      },
      {
        id: 'get-service-dns',
        instruction: 'Vérifie si le service DNS est actif.',
        hint: '<code>Get-Service DNS</code>',
        validate: (cmd) => /^(get-service|gsv)\s+dns/i.test(cmd.trim()),
        successMsg: '✓ Get-Service filtre par nom. Status Running/Stopped/Paused.',
      },
    ],
  },

  windows_ad: {
    id: 'windows_ad',
    title: 'Active Directory',
    icon: '🏢',
    desc: 'Gestion utilisateurs et groupes AD',
    type: 'windows',
    steps: [
      {
        id: 'get-aduser-all',
        instruction: 'Liste tous les utilisateurs Active Directory.',
        hint: '<code>Get-ADUser -Filter *</code>',
        validate: (cmd) => /^get-aduser\s+/i.test(cmd) && cmd.includes('-filter') && cmd.includes('*'),
        successMsg: '✓ Get-ADUser -Filter * liste tous les comptes. Ajouter -Properties * pour tout voir.',
      },
      {
        id: 'get-service-ntds',
        instruction: 'Vérifie que le service AD DS (NTDS) est actif.',
        hint: '<code>Get-Service NTDS</code>',
        validate: (cmd) => /^(get-service|gsv)\s+ntds/i.test(cmd.trim()),
        successMsg: '✓ NTDS = NT Directory Services. C\'est le cœur d\'Active Directory.',
      },
      {
        id: 'get-adcomputer',
        instruction: 'Liste les ordinateurs du domaine.',
        hint: '<code>Get-ADComputer -Filter *</code>',
        validate: (cmd) => /^get-adcomputer\s+/i.test(cmd) && cmd.includes('*'),
        successMsg: '✓ Get-ADComputer gère les objets ordinateurs. -SearchBase pour filtrer par OU.',
      },
      {
        id: 'get-adgroup',
        instruction: 'Liste les groupes Active Directory.',
        hint: '<code>Get-ADGroup -Filter *</code>',
        validate: (cmd) => /^get-adgroup\s+/i.test(cmd),
        successMsg: '✓ Groupes de sécurité vs distribution. Scope : local domaine, global, universel.',
      },
      {
        id: 'get-computerinfo',
        instruction: 'Affiche les informations système du serveur.',
        hint: '<code>Get-ComputerInfo</code>',
        validate: (cmd) => /^get-computerinfo/i.test(cmd.trim()),
        successMsg: '✓ Get-ComputerInfo donne OS, version, RAM, processeur. Utile pour l\'audit.',
      },
    ],
  },
};

// ===== MOTEUR SCENARIO =====
let scenarioState = null;

function scenarioStart(scenarioId) {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) return;
  scenarioState = {
    scenario,
    stepIdx: 0,
    completed: [],
    startTime: Date.now(),
  };
  renderScenarioPanel();
}

function scenarioCheck(cmd, fs, cwd) {
  if (!scenarioState) return;
  const s = scenarioState;
  if (s.stepIdx >= s.scenario.steps.length) return;
  const step = s.scenario.steps[s.stepIdx];
  const ok = step.validate(cmd, fs, cwd);
  if (ok) {
    s.completed.push(s.stepIdx);
    s.stepIdx++;
    // Afficher le message de succès dans le terminal
    cliPrint(`<span class="cli-scenario-ok">✓ ${step.successMsg}</span>`);
    if (s.stepIdx >= s.scenario.steps.length) {
      scenarioComplete();
    } else {
      renderScenarioPanel();
    }
  }
}

function scenarioComplete() {
  const s = scenarioState;
  const elapsed = Math.round((Date.now() - s.startTime) / 1000);
  const mm = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const ss = (elapsed % 60).toString().padStart(2, '0');
  cliPrint(`
<span style="color:var(--accent);font-weight:600">
╔════════════════════════════════════╗
║  TP terminé : ${s.scenario.title.padEnd(20)} ║
║  ${s.scenario.steps.length} étapes · ${mm}:${ss}                   ║
╚════════════════════════════════════╝</span>`);
  renderScenarioPanel();
  // Persister progression
  const key = `scenario_${s.scenario.id}`;
  const best = store.get(key) || {};
  store.set(key, { ...best, completed: true, time: elapsed, date: new Date().toISOString() });
}

function renderScenarioPanel() {
  const panel = document.getElementById('scenario-panel');
  if (!panel) return;
  if (!scenarioState) { panel.style.display = 'none'; return; }
  panel.style.display = 'block';
  const s = scenarioState;
  const step = s.scenario.steps[s.stepIdx];
  const done = s.stepIdx >= s.scenario.steps.length;

  const stepsHtml = s.scenario.steps.map((st, i) => {
    const isDone = i < s.stepIdx;
    const isCurrent = i === s.stepIdx;
    return `<div class="sc-step ${isDone ? 'sc-done' : isCurrent ? 'sc-current' : 'sc-todo'}">
      <span class="sc-step-num">${isDone ? '✓' : String(i + 1)}</span>
      <span class="sc-step-text">${st.instruction}</span>
    </div>`;
  }).join('');

  panel.innerHTML = `
    <div class="sc-header">
      <span class="sc-icon">${s.scenario.icon}</span>
      <span class="sc-title">${s.scenario.title}</span>
      <button class="sc-close" onclick="scenarioStop()" aria-label="Fermer le TP">✕</button>
    </div>
    <div class="sc-progress">
      <div class="sc-progress-bar" style="width:${Math.round((s.stepIdx / s.scenario.steps.length) * 100)}%"></div>
    </div>
    <div class="sc-steps">${stepsHtml}</div>
    ${!done && step ? `<div class="sc-hint" id="sc-hint-area">
      <span class="sc-hint-label">💡 Indice</span>
      <div class="sc-hint-content" id="sc-hint-content" style="display:none">${step.hint}</div>
      <button class="sc-hint-btn" onclick="toggleHint()">Afficher l'indice</button>
    </div>` : ''}
    ${done ? `<div class="sc-done-banner">🎉 TP complété ! Tape <code>tp</code> pour choisir un autre TP.</div>` : ''}`;
}

function toggleHint() {
  const hint = document.getElementById('sc-hint-content');
  const btn = document.querySelector('.sc-hint-btn');
  if (!hint || !btn) return;
  const visible = hint.style.display !== 'none';
  hint.style.display = visible ? 'none' : 'block';
  btn.textContent = visible ? 'Afficher l\'indice' : 'Masquer l\'indice';
}

function scenarioStop() {
  scenarioState = null;
  const panel = document.getElementById('scenario-panel');
  if (panel) panel.style.display = 'none';
}

function renderTPMenu(type) {
  // Affiche le menu des TP dans le terminal
  const available = Object.values(SCENARIOS).filter(s => s.type === type);
  let html = `<span style="color:var(--accent)">Travaux Pratiques disponibles :</span>\n`;
  available.forEach(s => {
    const saved = store.get(`scenario_${s.id}`);
    const badge = saved?.completed ? ` <span style="color:var(--accent)">✓ terminé</span>` : '';
    html += `  <span style="color:var(--text2)">tp ${s.id.replace(type+'_','')}</span> — ${s.icon} ${s.title} · ${s.desc}${badge}\n`;
  });
  html += `\nEx: <span style="color:var(--accent)">tp bases</span>`;
  cliPrint(html);
}

function handleTPCommand(args, type) {
  if (!args.length || args[0] === 'list' || args[0] === '') {
    renderTPMenu(type);
    return true;
  }
  const id = type + '_' + args[0];
  if (SCENARIOS[id]) {
    scenarioStart(id);
    cliPrint(`<span style="color:var(--accent)">TP démarré : ${SCENARIOS[id].title}</span>\nSuis les étapes dans le panneau à droite.\n`);
    return true;
  }
  cliPrint(`<span class="cli-err">TP inconnu : ${args[0]}. Tape <strong>tp</strong> pour lister les TP disponibles.</span>`);
  return true;
}
