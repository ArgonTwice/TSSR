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

  linux_admin_base: {
    id: 'linux_admin_base',
    title: 'Administration Serveur Linux',
    icon: '🐧',
    desc: 'Utilisateurs, services, surveillance système',
    type: 'linux',
    steps: [
      {
        id: 'whoami',
        instruction: 'Affiche l\'utilisateur courant.',
        hint: '<code>whoami</code>',
        validate: (cmd) => cmd.trim() === 'whoami',
        successMsg: '✓ whoami affiche le nom de l\'utilisateur courant. id donne l\'UID, GID et les groupes.',
      },
      {
        id: 'groups',
        instruction: 'Affiche les groupes de l\'utilisateur courant.',
        hint: '<code>groups</code>',
        validate: (cmd) => /^groups(\s|$)/.test(cmd.trim()),
        successMsg: '✓ groups liste tous les groupes. sudo dans la liste = droits d\'administration.',
      },
      {
        id: 'service-status',
        instruction: 'Vérifie le statut du service <code>ssh</code>.',
        hint: '<code>systemctl status ssh</code>',
        validate: (cmd) => /^systemctl\s+status\s+(ssh|sshd)/.test(cmd.trim()),
        successMsg: '✓ systemctl status montre Active, PID et logs récents. Active: (running) = service en marche.',
      },
      {
        id: 'disk-space',
        instruction: 'Affiche l\'espace disque disponible.',
        hint: '<code>df -h</code>',
        validate: (cmd) => /^df(\s|$)/.test(cmd.trim()),
        successMsg: '✓ df -h (human-readable) affiche l\'espace par partition. / est la partition principale.',
      },
      {
        id: 'ram-usage',
        instruction: 'Affiche l\'utilisation de la RAM.',
        hint: '<code>free -h</code>',
        validate: (cmd) => /^free(\s|$)/.test(cmd.trim()),
        successMsg: '✓ free -h affiche total, utilisé, libre et buffers/cache. available = RAM réellement disponible.',
      },
      {
        id: 'recent-logs',
        instruction: 'Affiche les 20 dernières lignes du journal système.',
        hint: '<code>journalctl -n 20</code>',
        validate: (cmd) => /^journalctl(\s|$)/.test(cmd.trim()),
        successMsg: '✓ journalctl interroge le journal systemd. -n 20 = 20 dernières lignes. -f = temps réel.',
      },
    ],
  },

  linux_securite: {
    id: 'linux_securite',
    title: 'Sécurisation SSH et Pare-feu',
    icon: '🔒',
    desc: 'Config SSH, UFW, analyse des logs auth',
    type: 'linux',
    steps: [
      {
        id: 'read-sshd-config',
        instruction: 'Affiche le fichier de configuration du serveur SSH.',
        hint: '<code>cat /etc/ssh/sshd_config</code>',
        validate: (cmd) => cmd.includes('cat') && cmd.includes('sshd_config'),
        successMsg: '✓ /etc/ssh/sshd_config contient toute la config du serveur SSH. Toujours redémarrer ssh après modif.',
      },
      {
        id: 'check-permitroot',
        instruction: 'Vérifie si la connexion root SSH est désactivée.',
        hint: '<code>grep PermitRootLogin /etc/ssh/sshd_config</code>',
        validate: (cmd) => cmd.includes('grep') && /permitrootlogin/i.test(cmd),
        successMsg: '✓ PermitRootLogin no = connexion root refusée. Bonne pratique de sécurité obligatoire.',
      },
      {
        id: 'ssh-service-status',
        instruction: 'Vérifie que le service SSH est actif.',
        hint: '<code>systemctl status ssh</code>',
        validate: (cmd) => /^systemctl\s+status\s+(ssh|sshd)/.test(cmd.trim()),
        successMsg: '✓ SSH doit être Active: (running). Si inactif : systemctl start ssh.',
      },
      {
        id: 'open-ports',
        instruction: 'Affiche les ports TCP en écoute sur le serveur.',
        hint: '<code>netstat -tlnp</code> ou <code>ss -tlnp</code>',
        validate: (cmd) => /^(netstat|ss)(\s|$)/.test(cmd.trim()),
        successMsg: '✓ Port 22 = SSH actif. ss est le remplaçant moderne de netstat. -l listening, -n numérique.',
      },
      {
        id: 'auth-log',
        instruction: 'Affiche le log d\'authentification pour détecter les tentatives SSH.',
        hint: '<code>tail /var/log/auth.log</code>',
        validate: (cmd) => cmd.includes('auth.log'),
        successMsg: '✓ /var/log/auth.log trace toutes les connexions SSH et sudo. Surveiller "Failed password".',
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

  windows_ad_setup: {
    id: 'windows_ad_setup',
    title: 'Configurer Active Directory',
    icon: '🏢',
    desc: 'Utilisateurs, OUs, groupes, GPO',
    type: 'windows',
    steps: [
      {
        id: 'list-users',
        instruction: 'Liste tous les utilisateurs Active Directory.',
        hint: '<code>Get-ADUser -Filter *</code>',
        validate: (cmd) => /^get-aduser\s+/i.test(cmd) && cmd.includes('*'),
        successMsg: '✓ Get-ADUser -Filter * liste tous les comptes du domaine. Ajoute -Properties * pour tout afficher.',
      },
      {
        id: 'new-user',
        instruction: 'Crée un utilisateur AD avec le login <code>j.dupont</code>.',
        hint: '<code>New-ADUser -Name "Jean Dupont" -SamAccountName "j.dupont" -Enabled $true</code>',
        validate: (cmd) => /^new-aduser\s+/i.test(cmd) && /j\.dupont/i.test(cmd),
        successMsg: '✓ New-ADUser crée le compte. Sans -Enabled $true le compte est désactivé par défaut.',
      },
      {
        id: 'new-ou',
        instruction: 'Crée une Unité d\'Organisation nommée <code>Informatique</code>.',
        hint: '<code>New-ADOrganizationalUnit -Name "Informatique" -Path "DC=tssr,DC=local"</code>',
        validate: (cmd) => /^new-adorganizationalunit\s+/i.test(cmd) && /informatique/i.test(cmd),
        successMsg: '✓ Les OUs structurent l\'annuaire et permettent d\'appliquer des GPO ciblées.',
      },
      {
        id: 'new-group',
        instruction: 'Crée un groupe de sécurité global <code>GRP-Informatique</code>.',
        hint: '<code>New-ADGroup -Name "GRP-Informatique" -GroupScope Global -GroupCategory Security</code>',
        validate: (cmd) => /^new-adgroup\s+/i.test(cmd) && /grp-informatique/i.test(cmd),
        successMsg: '✓ GroupScope Global = membres du même domaine. Universel = toute la forêt.',
      },
      {
        id: 'add-member',
        instruction: 'Ajoute <code>j.dupont</code> au groupe <code>GRP-Informatique</code>.',
        hint: '<code>Add-ADGroupMember -Identity "GRP-Informatique" -Members "j.dupont"</code>',
        validate: (cmd) => /^add-adgroupmember\s+/i.test(cmd) && /j\.dupont/i.test(cmd),
        successMsg: '✓ Add-ADGroupMember accepte un tableau de membres. Get-ADGroupMember pour vérifier.',
      },
      {
        id: 'gpo-update',
        instruction: 'Force l\'application des stratégies de groupe sur ce poste.',
        hint: '<code>gpupdate /force</code>',
        validate: (cmd) => /^gpupdate\s+\/force/i.test(cmd.trim()),
        successMsg: '✓ gpupdate /force applique immédiatement toutes les GPO. gpresult /R pour vérifier.',
      },
    ],
  },

  windows_dns_dhcp: {
    id: 'windows_dns_dhcp',
    title: 'Configurer DNS et DHCP',
    icon: '🌐',
    desc: 'Résolution DNS, étendues DHCP, baux',
    type: 'windows',
    steps: [
      {
        id: 'ipconfig-all',
        instruction: 'Affiche la configuration réseau complète (DNS, DHCP, MAC...).',
        hint: '<code>ipconfig /all</code>',
        validate: (cmd) => /^ipconfig\s+\/all/i.test(cmd.trim()),
        successMsg: '✓ ipconfig /all affiche le serveur DHCP, les DNS configurés et la durée du bail.',
      },
      {
        id: 'resolve-dns',
        instruction: 'Vérifie la résolution DNS de <code>srv01.tssr.local</code>.',
        hint: '<code>Resolve-DnsName srv01.tssr.local</code>',
        validate: (cmd) => /^resolve-dnsname\s+/i.test(cmd.trim()),
        successMsg: '✓ Resolve-DnsName = nslookup PowerShell. Retourne Type, TTL et IP résolue.',
      },
      {
        id: 'dhcp-scope',
        instruction: 'Crée une étendue DHCP pour la plage 192.168.1.100–200.',
        hint: '<code>Add-DhcpServerv4Scope -Name "LAN" -StartRange 192.168.1.100 -EndRange 192.168.1.200 -SubnetMask 255.255.255.0</code>',
        validate: (cmd) => /^add-dhcpserverv4scope\s+/i.test(cmd.trim()),
        successMsg: '✓ L\'étendue définit la plage de distribution. Configurer ensuite les options (routeur, DNS).',
      },
      {
        id: 'dhcp-leases',
        instruction: 'Affiche les baux DHCP actifs sur l\'étendue 192.168.1.0.',
        hint: '<code>Get-DhcpServerv4Lease -ScopeId 192.168.1.0</code>',
        validate: (cmd) => /^get-dhcpserverv4lease\s+/i.test(cmd.trim()),
        successMsg: '✓ Chaque bail contient : IP attribuée, adresse MAC, hostname, date d\'expiration.',
      },
      {
        id: 'check-dhcp-service',
        instruction: 'Vérifie que le service DHCP Server est actif.',
        hint: '<code>Get-Service DHCPServer</code>',
        validate: (cmd) => /^(get-service|gsv)\s+dhcp/i.test(cmd.trim()),
        successMsg: '✓ DHCPServer doit être Running. Restart-Service DHCPServer pour relancer si besoin.',
      },
    ],
  },

  windows_hyperv: {
    id: 'windows_hyperv',
    title: 'Gérer Hyper-V via PowerShell',
    icon: '📦',
    desc: 'Créer et administrer des VMs Hyper-V',
    type: 'windows',
    steps: [
      {
        id: 'get-vm',
        instruction: 'Liste toutes les VMs Hyper-V présentes sur ce serveur.',
        hint: '<code>Get-VM</code>',
        validate: (cmd) => /^get-vm(\s|$)/i.test(cmd.trim()),
        successMsg: '✓ Get-VM affiche toutes les VMs avec leur état (Running/Off/Paused).',
      },
      {
        id: 'new-vm',
        instruction: 'Crée une VM nommée <code>VM-Test</code> avec 2 Go de RAM.',
        hint: '<code>New-VM -Name "VM-Test" -MemoryStartupBytes 2GB -NewVHDPath "C:\\VMs\\test.vhdx" -NewVHDSizeBytes 20GB</code>',
        validate: (cmd) => /^new-vm\s+/i.test(cmd) && /vm-test/i.test(cmd),
        successMsg: '✓ New-VM crée la VM avec le disque virtuel VHDX. -Generation 2 pour les OS modernes.',
      },
      {
        id: 'start-vm',
        instruction: 'Démarre la VM <code>VM-Test</code>.',
        hint: '<code>Start-VM -Name "VM-Test"</code>',
        validate: (cmd) => /^start-vm\s+/i.test(cmd) && /vm-test/i.test(cmd),
        successMsg: '✓ Start-VM démarre la VM. Stop-VM -Force pour l\'arrêt forcé. Suspend-VM pour la suspendre.',
      },
      {
        id: 'checkpoint-vm',
        instruction: 'Crée un checkpoint nommé <code>avant-config</code> sur <code>VM-Test</code>.',
        hint: '<code>Checkpoint-VM -Name "VM-Test" -SnapshotName "avant-config"</code>',
        validate: (cmd) => /^checkpoint-vm\s+/i.test(cmd) && /avant-config/i.test(cmd),
        successMsg: '✓ Checkpoint-VM capture l\'état complet. Toujours nommer avec la date ou l\'action prévue.',
      },
      {
        id: 'get-checkpoint',
        instruction: 'Liste les checkpoints de la VM <code>VM-Test</code>.',
        hint: '<code>Get-VMCheckpoint -VMName "VM-Test"</code>',
        validate: (cmd) => /^get-vmcheckpoint\s+/i.test(cmd),
        successMsg: '✓ Get-VMCheckpoint liste tous les snapshots. Restore-VMCheckpoint pour restaurer.',
      },
      {
        id: 'stop-vm',
        instruction: 'Arrête la VM <code>VM-Test</code> proprement.',
        hint: '<code>Stop-VM -Name "VM-Test"</code>',
        validate: (cmd) => /^stop-vm\s+/i.test(cmd) && /vm-test/i.test(cmd),
        successMsg: '✓ Stop-VM envoie un signal d\'arrêt à l\'OS. -Force coupe l\'alimentation immédiatement.',
      },
    ],
  },

  windows_vm_reseau: {
    id: 'windows_vm_reseau',
    title: 'Réseaux virtuels Hyper-V',
    icon: '🌐',
    desc: 'Commutateurs virtuels, adaptateurs réseau VM',
    type: 'windows',
    steps: [
      {
        id: 'get-vmswitch',
        instruction: 'Liste les commutateurs virtuels Hyper-V existants.',
        hint: '<code>Get-VMSwitch</code>',
        validate: (cmd) => /^get-vmswitch(\s|$)/i.test(cmd.trim()),
        successMsg: '✓ Get-VMSwitch affiche le type (External/Internal/Private) et l\'adaptateur lié.',
      },
      {
        id: 'new-vmswitch',
        instruction: 'Crée un commutateur interne nommé <code>vSwitch-Lab</code>.',
        hint: '<code>New-VMSwitch -Name "vSwitch-Lab" -SwitchType Internal</code>',
        validate: (cmd) => /^new-vmswitch\s+/i.test(cmd) && /vswitch-lab/i.test(cmd),
        successMsg: '✓ Internal = VM↔hôte sans accès réseau externe. Private = VM↔VM uniquement.',
      },
      {
        id: 'add-network-adapter',
        instruction: 'Connecte <code>VM-Test</code> au commutateur <code>vSwitch-Lab</code>.',
        hint: '<code>Add-VMNetworkAdapter -VMName "VM-Test" -SwitchName "vSwitch-Lab"</code>',
        validate: (cmd) => /^add-vmnetworkadapter\s+/i.test(cmd),
        successMsg: '✓ Add-VMNetworkAdapter ajoute une carte réseau virtuelle. Connect-VMNetworkAdapter pour connecter une existante.',
      },
      {
        id: 'get-vm-state',
        instruction: 'Affiche l\'état et les ressources de <code>VM-Test</code>.',
        hint: '<code>Get-VM -Name "VM-Test"</code>',
        validate: (cmd) => /^get-vm\s+/i.test(cmd) && /vm-test/i.test(cmd),
        successMsg: '✓ State, CPUUsage, MemoryAssigned, Uptime — toutes les infos d\'une VM en un coup.',
      },
      {
        id: 'get-network-adapter',
        instruction: 'Liste les adaptateurs réseau de <code>VM-Test</code>.',
        hint: '<code>Get-VMNetworkAdapter -VMName "VM-Test"</code>',
        validate: (cmd) => /^get-vmnetworkadapter\s+/i.test(cmd),
        successMsg: '✓ Affiche le switch connecté, l\'adresse MAC et l\'IP si Hyper-V Integration Services est actif.',
      },
      {
        id: 'test-connection',
        instruction: 'Teste la connectivité vers l\'hôte Hyper-V depuis ce poste.',
        hint: '<code>Test-Connection 192.168.1.1</code>',
        validate: (cmd) => /^test-connection\s+/i.test(cmd.trim()),
        successMsg: '✓ Test-Connection = ping PowerShell. Retourne un objet avec latence, TTL et adresse source.',
      },
    ],
  },

  linux_firewall: {
    id: 'linux_firewall',
    title: 'Pare-feu Linux (iptables/UFW)',
    icon: '🔐',
    desc: 'Règles iptables, UFW, filtrage réseau',
    type: 'linux',
    steps: [
      {
        id: 'iptables-list',
        instruction: 'Affiche les règles iptables actives avec les compteurs.',
        hint: '<code>iptables -L -v -n</code>',
        validate: (cmd) => /^iptables\s+/.test(cmd) && cmd.includes('-L'),
        successMsg: '✓ -L liste les règles, -v ajoute les compteurs paquets/octets, -n évite la résolution DNS.',
      },
      {
        id: 'ufw-status',
        instruction: 'Vérifie le statut de UFW.',
        hint: '<code>ufw status verbose</code>',
        validate: (cmd) => /^ufw\s+status/.test(cmd.trim()),
        successMsg: '✓ ufw status verbose montre les règles actives. "inactive" = UFW désactivé.',
      },
      {
        id: 'ufw-allow-ssh',
        instruction: 'Autorise SSH dans UFW.',
        hint: '<code>ufw allow ssh</code> ou <code>ufw allow 22/tcp</code>',
        validate: (cmd) => /^ufw\s+allow\s+(ssh|22)/.test(cmd.trim()),
        successMsg: '✓ Toujours autoriser SSH AVANT d\'activer UFW pour ne pas se couper du serveur distant.',
      },
      {
        id: 'ufw-allow-http',
        instruction: 'Autorise HTTP (port 80) dans UFW.',
        hint: '<code>ufw allow 80/tcp</code>',
        validate: (cmd) => /^ufw\s+allow\s+(80|http)/.test(cmd.trim()),
        successMsg: '✓ ufw allow 443/tcp pour HTTPS. ufw allow from 192.168.1.0/24 pour limiter à un réseau.',
      },
      {
        id: 'ufw-enable',
        instruction: 'Active le pare-feu UFW.',
        hint: '<code>ufw enable</code>',
        validate: (cmd) => cmd.trim() === 'ufw enable',
        successMsg: '✓ UFW est maintenant actif. Le trafic non autorisé sera bloqué.',
      },
      {
        id: 'iptables-block',
        instruction: 'Bloque une IP suspecte : <code>192.168.1.200</code>.',
        hint: '<code>iptables -A INPUT -s 192.168.1.200 -j DROP</code>',
        validate: (cmd) => /^iptables\s+/.test(cmd) && cmd.includes('192.168.1.200') && cmd.includes('DROP'),
        successMsg: '✓ DROP rejette silencieusement. REJECT envoie un message d\'erreur (plus verbeux, moins furtif).',
      },
    ],
  },

  windows_firewall: {
    id: 'windows_firewall',
    title: 'Pare-feu Windows (PowerShell)',
    icon: '🔐',
    desc: 'Règles Windows Firewall via PowerShell',
    type: 'windows',
    steps: [
      {
        id: 'get-profile',
        instruction: 'Affiche les profils du pare-feu Windows (Domain, Private, Public).',
        hint: '<code>Get-NetFirewallProfile</code>',
        validate: (cmd) => /^get-netfirewallprofile(\s|$)/i.test(cmd.trim()),
        successMsg: '✓ 3 profils : Domain (domaine AD), Private (réseau maison/bureau), Public (Wi-Fi public).',
      },
      {
        id: 'list-rules',
        instruction: 'Liste les règles de pare-feu actives.',
        hint: '<code>Get-NetFirewallRule | Where-Object {$_.Enabled -eq "True"}</code>',
        validate: (cmd) => /^get-netfirewallrule(\s|$)/i.test(cmd.trim()),
        successMsg: '✓ Get-NetFirewallRule liste toutes les règles. Direction Inbound/Outbound, Action Allow/Block.',
      },
      {
        id: 'new-rule',
        instruction: 'Crée une règle autorisant le port <code>8080</code> en entrée.',
        hint: '<code>New-NetFirewallRule -DisplayName "HTTP Alt" -Direction Inbound -Protocol TCP -LocalPort 8080 -Action Allow</code>',
        validate: (cmd) => /^new-netfirewallrule\s+/i.test(cmd) && /8080/.test(cmd),
        successMsg: '✓ New-NetFirewallRule crée une règle persistante. -Profile pour cibler un profil spécifique.',
      },
      {
        id: 'disable-rule',
        instruction: 'Désactive la règle "HTTP Alt" créée précédemment.',
        hint: '<code>Disable-NetFirewallRule -DisplayName "HTTP Alt"</code>',
        validate: (cmd) => /^disable-netfirewallrule\s+/i.test(cmd),
        successMsg: '✓ Disable conserve la règle sans l\'appliquer. Enable-NetFirewallRule pour la réactiver.',
      },
      {
        id: 'check-ports',
        instruction: 'Affiche les ports TCP en écoute et les processus associés.',
        hint: '<code>netstat -ano</code>',
        validate: (cmd) => /^netstat(\s|$)/i.test(cmd.trim()),
        successMsg: '✓ -a toutes connexions, -n numérique, -o PID. Croiser avec Get-Process -Id <PID> pour identifier.',
      },
      {
        id: 'test-port',
        instruction: 'Teste si le port 80 est ouvert sur <code>192.168.1.10</code>.',
        hint: '<code>Test-NetConnection -ComputerName 192.168.1.10 -Port 80</code>',
        validate: (cmd) => /^test-netconnection\s+/i.test(cmd.trim()),
        successMsg: '✓ Test-NetConnection teste TCP (TcpTestSucceeded) et ICMP. Équivalent de telnet en PowerShell.',
      },
    ],
  },
  linux_cisco_reseau: {
    id: 'linux_cisco_reseau',
    title: 'Diagnostic réseau Cisco depuis Linux',
    icon: '🔌',
    desc: 'Analyser l\'environnement réseau local (interfaces, routes, ARP, connectivité) dans un contexte Cisco.',
    type: 'linux',
    steps: [
      {
        id: 'show-interfaces',
        instruction: 'Affiche toutes les interfaces réseau et leur état.',
        hint: '<code>ip addr show</code>',
        validate: (cmd) => /^ip\s+addr(\s+show)?$/.test(cmd.trim()),
        successMsg: '✓ ip addr show affiche l\'IP, le masque et l\'état (UP/DOWN) de chaque interface.',
      },
      {
        id: 'show-routes',
        instruction: 'Affiche la table de routage du système Linux.',
        hint: '<code>ip route show</code>',
        validate: (cmd) => /^ip\s+route(\s+show)?$/.test(cmd.trim()),
        successMsg: '✓ ip route show équivaut à show ip route sur Cisco. La passerelle par défaut est la ligne "default via".',
      },
      {
        id: 'show-arp',
        instruction: 'Affiche la table ARP (correspondances IP ↔ MAC).',
        hint: '<code>arp -n</code>',
        validate: (cmd) => /^arp(\s|$)/.test(cmd.trim()),
        successMsg: '✓ arp -n = show arp sur Cisco. -n affiche les adresses numériques sans résolution DNS.',
      },
      {
        id: 'ping-gateway',
        instruction: 'Teste la connectivité vers la passerelle 192.168.1.1.',
        hint: '<code>ping 192.168.1.1</code> (Ctrl+C pour arrêter)',
        validate: (cmd) => /^ping\s+192\.168\.1\.1/.test(cmd.trim()),
        successMsg: '✓ ping vérifie la couche 3 (ICMP). Aucune réponse = pare-feu, route absente ou VLAN incorrect.',
      },
      {
        id: 'show-ports',
        instruction: 'Liste les ports TCP/UDP en écoute sur la machine.',
        hint: '<code>netstat -tuln</code>',
        validate: (cmd) => /^netstat(\s|$)/i.test(cmd.trim()) || /^ss(\s|$)/.test(cmd.trim()),
        successMsg: '✓ netstat -tuln : -t TCP, -u UDP, -l écoute, -n numérique. Équivalent de show tcp brief sur IOS.',
      },
      {
        id: 'traceroute',
        instruction: 'Trace le chemin réseau vers 8.8.8.8.',
        hint: '<code>traceroute 8.8.8.8</code>',
        validate: (cmd) => /^traceroute\s+/.test(cmd.trim()),
        successMsg: '✓ traceroute = traceroute sur Cisco. Chaque saut affiché correspond à un routeur intermédiaire.',
      },
    ],
  },
  linux_vlan_reseau: {
    id: 'linux_vlan_reseau',
    title: 'Inspection réseau VLAN sous Linux',
    icon: '🔌',
    desc: 'Inspecter la configuration réseau Linux dans un environnement segmenté en VLANs.',
    type: 'linux',
    steps: [
      {
        id: 'list-links',
        instruction: 'Affiche tous les liens réseau (couche 2) disponibles.',
        hint: '<code>ip link show</code>',
        validate: (cmd) => /^ip\s+link(\s+show)?$/.test(cmd.trim()),
        successMsg: '✓ ip link show liste les interfaces avec état (UP/DOWN), adresse MAC et MTU.',
      },
      {
        id: 'show-eth0',
        instruction: 'Affiche uniquement les infos IP de l\'interface eth0.',
        hint: '<code>ip addr show eth0</code>',
        validate: (cmd) => /^ip\s+addr\s+show\s+eth0/.test(cmd.trim()),
        successMsg: '✓ Préciser l\'interface filtre la sortie. L\'adresse IP et le masque CIDR sont visibles (ex: 192.168.10.1/24).',
      },
      {
        id: 'route-table',
        instruction: 'Affiche la table de routage complète.',
        hint: '<code>ip route</code>',
        validate: (cmd) => /^ip\s+route(\s+show)?$/.test(cmd.trim()),
        successMsg: '✓ Chaque VLAN routé aura une ligne "proto kernel scope link". La default via = passerelle inter-VLAN.',
      },
      {
        id: 'read-interfaces',
        instruction: 'Consulte le fichier de configuration des interfaces réseau Debian/Ubuntu.',
        hint: '<code>cat /etc/network/interfaces</code>',
        validate: (cmd) => /cat\s+\/etc\/network\/interfaces/.test(cmd.trim()),
        successMsg: '✓ /etc/network/interfaces définit les interfaces statiques (iface, address, netmask, gateway, vlan-raw-device).',
      },
      {
        id: 'ping-exit',
        instruction: 'Vérifie la connectivité Internet vers 8.8.8.8.',
        hint: '<code>ping 8.8.8.8</code> (Ctrl+C pour arrêter)',
        validate: (cmd) => /^ping\s+8\.8\.8\.8/.test(cmd.trim()),
        successMsg: '✓ Si ping 8.8.8.8 fonctionne mais pas un nom DNS → problème DNS. Si les deux échouent → routage ou VLAN incorrect.',
      },
    ],
  },
  linux_adressage: {
    id: 'linux_adressage',
    title: 'Adressage IP et Diagnostic',
    icon: '🔍',
    desc: 'Diagnostiquer la configuration IP et les services réseau sous Linux.',
    type: 'linux',
    steps: [
      {
        id: 'ip-addr',
        instruction: 'Affiche les interfaces réseau et leurs adresses IP.',
        hint: '<code>ip addr</code>',
        validate: (cmd) => /^ip\s+addr(\s+show)?$/.test(cmd.trim()),
        successMsg: '✓ ip addr show liste toutes les interfaces avec leurs adresses IP en notation CIDR.',
      },
      {
        id: 'ip-route',
        instruction: 'Affiche la table de routage.',
        hint: '<code>ip route</code>',
        validate: (cmd) => /^ip\s+route(\s+show)?$/.test(cmd.trim()),
        successMsg: '✓ La ligne "default via" indique la passerelle par défaut.',
      },
      {
        id: 'ping-gw',
        instruction: 'Teste la connectivité vers la passerelle (4 paquets).',
        hint: '<code>ping -c 4 192.168.1.1</code>',
        validate: (cmd) => /^ping\s+-c\s+4\s+192\.168\.1\.1/.test(cmd.trim()),
        successMsg: '✓ Si la passerelle répond, la couche 3 locale fonctionne.',
      },
      {
        id: 'traceroute',
        instruction: 'Trace le chemin réseau vers 8.8.8.8.',
        hint: '<code>traceroute 8.8.8.8</code>',
        validate: (cmd) => /^traceroute\s+8\.8\.8\.8/.test(cmd.trim()),
        successMsg: '✓ Chaque ligne représente un saut (routeur). * * * = saut qui ne répond pas (ICMP filtré).',
      },
      {
        id: 'arp-table',
        instruction: 'Affiche la table ARP (correspondances IP → MAC).',
        hint: '<code>arp -n</code>',
        validate: (cmd) => /^arp\s+-n$/.test(cmd.trim()),
        successMsg: '✓ La table ARP contient les voisins récemment contactés sur le réseau local.',
      },
      {
        id: 'ss-ports',
        instruction: 'Liste les ports TCP et UDP en écoute.',
        hint: '<code>ss -tuln</code>',
        validate: (cmd) => /^ss\s+-[tuln]+$/.test(cmd.trim()),
        successMsg: '✓ ss -tuln remplace netstat. Ports en LISTEN = services actifs.',
      },
      {
        id: 'nslookup',
        instruction: 'Résout le nom DNS de google.com.',
        hint: '<code>nslookup google.com</code>',
        validate: (cmd) => /^nslookup\s+google\.com/.test(cmd.trim()),
        successMsg: '✓ nslookup interroge le serveur DNS configuré (/etc/resolv.conf).',
      },
      {
        id: 'dig',
        instruction: 'Interroge le DNS de google.com avec dig.',
        hint: '<code>dig google.com</code>',
        validate: (cmd) => /^dig\s+google\.com/.test(cmd.trim()),
        successMsg: '✓ dig est plus détaillé que nslookup : il affiche le serveur interrogé, le TTL et le type d\'enregistrement.',
      },
    ],
  },
  linux_protocoles: {
    id: 'linux_protocoles',
    title: 'Analyse des Protocoles Réseau',
    icon: '📡',
    desc: 'Explorer les protocoles réseau actifs et la configuration DNS sous Linux.',
    type: 'linux',
    steps: [
      {
        id: 'netstat',
        instruction: 'Liste les connexions réseau et ports en écoute.',
        hint: '<code>netstat -tuln</code>',
        validate: (cmd) => /^netstat\s+-[tuln]+$/.test(cmd.trim()),
        successMsg: '✓ netstat -tuln affiche les ports TCP/UDP en écoute sans résolution de noms.',
      },
      {
        id: 'resolv-conf',
        instruction: 'Consulte la configuration des serveurs DNS.',
        hint: '<code>cat /etc/resolv.conf</code>',
        validate: (cmd) => /cat\s+\/etc\/resolv\.conf/.test(cmd.trim()),
        successMsg: '✓ /etc/resolv.conf contient les serveurs DNS utilisés (nameserver) et le domaine de recherche.',
      },
      {
        id: 'hosts-file',
        instruction: 'Consulte le fichier hosts local.',
        hint: '<code>cat /etc/hosts</code>',
        validate: (cmd) => /cat\s+\/etc\/hosts/.test(cmd.trim()),
        successMsg: '✓ /etc/hosts est consulté avant le DNS. Utile pour forcer des résolutions locales.',
      },
      {
        id: 'ping-dns',
        instruction: 'Teste la connectivité Internet (2 paquets vers 8.8.8.8).',
        hint: '<code>ping -c 2 8.8.8.8</code>',
        validate: (cmd) => /^ping\s+-c\s+2\s+8\.8\.8\.8/.test(cmd.trim()),
        successMsg: '✓ ping -c 2 envoie 2 paquets ICMP et s\'arrête automatiquement.',
      },
      {
        id: 'curl-head',
        instruction: 'Teste une requête HTTP en ne récupérant que les en-têtes.',
        hint: '<code>curl -I http://localhost</code>',
        validate: (cmd) => /^curl\s+-I\s+http:\/\/localhost/.test(cmd.trim()),
        successMsg: '✓ curl -I envoie une requête HEAD. Les en-têtes révèlent le serveur web et le code HTTP.',
      },
      {
        id: 'ss-summary',
        instruction: 'Affiche un résumé statistique des connexions réseau.',
        hint: '<code>ss -s</code>',
        validate: (cmd) => /^ss\s+-s$/.test(cmd.trim()),
        successMsg: '✓ ss -s donne un résumé : nombre total de sockets, TCP établis, en attente, fermés.',
      },
    ],
  },
  linux_wifi: {
    id: 'linux_wifi',
    title: 'Diagnostic WiFi Linux',
    icon: '📶',
    desc: 'Diagnostiquer et inspecter la connectivité WiFi sous Linux.',
    type: 'linux',
    steps: [
      {
        id: 'ip-link',
        instruction: 'Affiche tous les liens réseau disponibles (couche 2).',
        hint: '<code>ip link show</code>',
        validate: (cmd) => /^ip\s+link(\s+show)?$/.test(cmd.trim()),
        successMsg: '✓ ip link show liste les interfaces avec leur état (UP/DOWN) et adresse MAC.',
      },
      {
        id: 'iwconfig',
        instruction: 'Affiche la configuration WiFi des interfaces sans fil.',
        hint: '<code>iwconfig</code>',
        validate: (cmd) => /^iwconfig$/.test(cmd.trim()),
        successMsg: '✓ iwconfig affiche le SSID, la fréquence, le signal et le mode de l\'interface WiFi.',
      },
      {
        id: 'nmcli-wifi',
        instruction: 'Liste les réseaux WiFi disponibles via NetworkManager.',
        hint: '<code>nmcli dev wifi</code>',
        validate: (cmd) => /^nmcli\s+dev(ice)?\s+wifi$/.test(cmd.trim()),
        successMsg: '✓ nmcli dev wifi scanne et liste les réseaux avec SSID, signal, sécurité et canal.',
      },
      {
        id: 'ping-gw',
        instruction: 'Teste la connectivité vers la passerelle WiFi (4 paquets).',
        hint: '<code>ping -c 4 192.168.1.1</code>',
        validate: (cmd) => /^ping\s+-c\s+4\s+192\.168\.1\.1/.test(cmd.trim()),
        successMsg: '✓ Si la passerelle répond, l\'association WiFi et la couche IP fonctionnent.',
      },
      {
        id: 'arp-neigh',
        instruction: 'Affiche la table des voisins ARP (réseau local).',
        hint: '<code>ip neigh show</code>',
        validate: (cmd) => /^ip\s+neigh(bour)?(\s+show)?$/.test(cmd.trim()),
        successMsg: '✓ ip neigh show remplace arp -n. Chaque entrée montre l\'IP, l\'interface et le MAC des voisins.',
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
