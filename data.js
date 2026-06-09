// data.js — Structure des modules TSSR

const MODULES = [
  {
    id: 'numerisation',
    label: 'Numération',
    icon: '🔢',
    color: '#00ff88',
    desc: 'Systèmes de numération : binaire, octal, hexadécimal, conversions...',
    topics: [],
    outils: 'modules/numerisation/outils.html',
    cours: [
      {
        id: 'cours_optimise_claude',
        titre: 'Architecture des Données : Encodage, Systèmes de Numération et Logique Booléenne',
        sections: [
          { type: 'html-file', src: 'modules/numerisation/cours_optimise_claude.html' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'reseaux',
    label: 'Réseaux',
    icon: '🌐',
    color: '#3b82f6',
    desc: 'Modèle OSI, TCP/IP, adressage IP, sous-réseaux, services réseau...',
    topics: ['OSI', 'TCP/IP', 'Adressage IP', 'VLAN', 'DNS', 'DHCP', 'Routage'],
    cours: [
      {
        id: 'modele-osi',
        titre: 'Modèle OSI — 7 Couches',
        sections: [],
      },
      {
        id: 'cours_reseaux',
        titre: 'Réseaux : OSI, TCP/IP, Adressage et Services',
        sections: [{ type: 'html-file', src: 'modules/reseaux/cours_reseaux.html' }],
      },
    ],
    flashcards: [],
    qcm: [],
    linux_cli: true,
    windows_cli: true,
  },
  {
    id: 'linux',
    label: 'Linux',
    icon: '🐧',
    color: '#00ff88',
    desc: 'Commandes, droits, services, filtrage, gestion de paquets...',
    topics: ['Système de fichiers', 'VIM', 'Droits', 'Processus', 'APT', 'Redirections'],
    cours: [
      {
        id: 'encyclopedie-linux',
        titre: 'Encyclopédie Linux — Formation TSSR',
        sections: [

          // 1. Installation & Philosophie
          { type: 'h2', content: '1. Installation &amp; Philosophie' },
          { type: 'p', content: 'Linux est un noyau open-source utilisé dans la majorité des serveurs, équipements réseau et systèmes embarqués. En formation TSSR, on travaille généralement sous Debian/Ubuntu dans une machine virtuelle (VirtualBox ou VMware).' },
          { type: 'info', content: '<strong>Virtualisation :</strong> une VM Linux s\'installe depuis une image ISO. On choisit la langue, le partitionnement (ext4 recommandé) et un utilisateur non-root dès l\'installation.' },
          { type: 'table', headers: ['Compte', 'Rôle', 'Invite de commande'], rows: [
            ['root', 'Super-administrateur, droits illimités', '<code>#</code>'],
            ['utilisateur', 'Compte courant, droits limités', '<code>$</code>'],
          ]},
          { type: 'warn', content: '<strong>Ne jamais travailler en root au quotidien.</strong> Utiliser <code>sudo</code> pour élever les privilèges ponctuellement.' },
          { type: 'code', content: 'sudo apt update          # exécute apt en tant que root\nsudo -i                  # ouvre un shell root (quitter avec exit)\nwhoami                   # affiche l\'utilisateur courant\nid                       # UID, GID et groupes' },

          // 2. Navigation & Système de fichiers
          { type: 'h2', content: '2. Navigation &amp; Système de fichiers' },
          { type: 'p', content: 'Linux utilise une arborescence unique enracinée en <code>/</code>. Pas de lettres de lecteur comme sous Windows : tout est monté sous la racine.' },
          { type: 'table', headers: ['Répertoire', 'Contenu'], rows: [
            ['<code>/</code>',     'Racine du système'],
            ['<code>/etc</code>',  'Fichiers de configuration système'],
            ['<code>/home</code>', 'Répertoires personnels des utilisateurs'],
            ['<code>/var</code>',  'Données variables (logs, bases, cache)'],
            ['<code>/bin</code>',  'Binaires essentiels (ls, cp, mv…)'],
            ['<code>/usr</code>',  'Applications installées'],
            ['<code>/tmp</code>',  'Fichiers temporaires (vidés au reboot)'],
            ['<code>/proc</code>', 'Pseudo-FS : infos noyau/processus en temps réel'],
          ]},
          { type: 'code', content: 'pwd                      # affiche le répertoire courant\nls                       # liste les fichiers\nls -l                    # format long (droits, taille, date)\nls -la                   # idem + fichiers cachés (commençant par .)\nls -lh                   # tailles lisibles (Ko, Mo)\ncd /etc                  # aller dans /etc\ncd ~                     # aller dans son home\ncd ..                    # remonter d\'un niveau\ncd -                     # revenir au répertoire précédent\ntree                     # arborescence graphique (si installé)' },
          { type: 'info', content: '<strong>Chemin absolu vs relatif :</strong> <code>/home/user/docs</code> est absolu (part de /). <code>../docs</code> est relatif (part du répertoire courant).' },

          // 3. Manipulation de fichiers
          { type: 'h2', content: '3. Manipulation de fichiers' },
          { type: 'code', content: 'mkdir dossier            # créer un répertoire\nmkdir -p a/b/c           # créer l\'arborescence complète\ntouch fichier.txt        # créer un fichier vide (ou mettre à jour la date)\ncp source dest           # copier un fichier\ncp -r src/ dest/         # copier un dossier (récursif)\nmv ancien nouveau        # déplacer ou renommer\nrm fichier               # supprimer un fichier\nrm -r dossier/           # supprimer un dossier et son contenu\nrm -rf dossier/          # idem, sans confirmation (dangereux)' },
          { type: 'warn', content: '<strong>rm -rf</strong> est irréversible. Il n\'y a pas de corbeille en ligne de commande. Vérifier deux fois avant d\'exécuter.' },
          { type: 'code', content: 'cat fichier.txt          # afficher le contenu\nless fichier.txt         # affichage page par page (q pour quitter)\nhead -n 5 fichier.txt    # 5 premières lignes\ntail -n 5 fichier.txt    # 5 dernières lignes\ntail -f /var/log/syslog  # suivre un fichier en temps réel\nwc -l fichier.txt        # compter les lignes\nfile fichier             # type du fichier' },

          // 4. Édition VIM
          { type: 'h2', content: '4. Édition VIM' },
          { type: 'p', content: 'VIM est l\'éditeur de texte en ligne de commande incontournable. Il fonctionne par modes : on ne tape pas directement comme dans un éditeur graphique.' },
          { type: 'table', headers: ['Mode', 'Description', 'Accès'], rows: [
            ['Normal',    'Navigation, copier/coller, suppression', 'Touche <code>Échap</code>'],
            ['Insertion', 'Saisie de texte',                        '<code>i</code> (avant curseur), <code>a</code> (après), <code>o</code> (nouvelle ligne)'],
            ['Commande',  'Sauvegarder, quitter, rechercher',       '<code>:</code> depuis le mode Normal'],
          ]},
          { type: 'steps', items: [
            { num: '1', title: 'Ouvrir un fichier',         code: 'vim fichier.txt' },
            { num: '2', title: 'Passer en mode insertion',  content: 'Appuyer sur <kbd>i</kbd>' },
            { num: '3', title: 'Écrire du texte',           content: 'Saisir normalement' },
            { num: '4', title: 'Revenir en mode normal',    content: 'Appuyer sur <kbd>Échap</kbd>' },
            { num: '5', title: 'Sauvegarder et quitter',    code: ':wq' },
          ]},
          { type: 'table', headers: ['Commande', 'Action'], rows: [
            ['<code>:w</code>',    'Sauvegarder'],
            ['<code>:q</code>',    'Quitter (si pas de modification)'],
            ['<code>:wq</code>',   'Sauvegarder et quitter'],
            ['<code>:q!</code>',   'Quitter sans sauvegarder (forcer)'],
            ['<code>/mot</code>',  'Rechercher "mot" (n = occurrence suivante)'],
            ['<code>dd</code>',    'Supprimer la ligne courante (mode normal)'],
            ['<code>yy</code>',    'Copier la ligne (yank)'],
            ['<code>p</code>',     'Coller après le curseur'],
            ['<code>u</code>',     'Annuler (undo)'],
            ['<code>Ctrl+r</code>','Rétablir (redo)'],
          ]},

          // 5. Droits Linux
          { type: 'h2', content: '5. Droits Linux' },
          { type: 'p', content: 'Chaque fichier a des droits pour 3 entités : le propriétaire (u), le groupe (g), et les autres (o). Les droits sont r (lecture), w (écriture), x (exécution).' },
          { type: 'table', headers: ['Droit', 'Lettre', 'Valeur octale'], rows: [
            ['Lecture',    'r', '4'],
            ['Écriture',   'w', '2'],
            ['Exécution',  'x', '1'],
            ['Aucun droit','—', '0'],
          ]},
          { type: 'info', content: '<strong>Lecture rapide de chmod :</strong> <code>755</code> = rwxr-xr-x (propriétaire : tout ; groupe et autres : lecture + exécution). <code>644</code> = rw-r--r-- (fichier de config type).' },
          { type: 'code', content: 'ls -l fichier.txt\n# -rw-r--r-- 1 alice staff 1024 juin  9 10:00 fichier.txt\n#  ^^^       ^\n#  droits    |— nb liens\n#  u=rw g=r o=r\n\nchmod 755 script.sh      # rwxr-xr-x\nchmod +x  script.sh      # ajouter exécution à tous\nchmod u+w fichier.txt    # ajouter écriture au propriétaire\nchmod o-r fichier.txt    # retirer lecture aux autres\n\nchown alice fichier.txt         # changer propriétaire\nchown alice:staff fichier.txt   # changer propriétaire et groupe\nchgrp staff fichier.txt         # changer groupe uniquement' },

          // 6. Redirections & Flux
          { type: 'h2', content: '6. Redirections &amp; Flux' },
          { type: 'table', headers: ['Flux', 'Numéro', 'Description'], rows: [
            ['stdin',  '0', 'Entrée standard (clavier par défaut)'],
            ['stdout', '1', 'Sortie standard (terminal par défaut)'],
            ['stderr', '2', 'Sortie d\'erreur (terminal par défaut)'],
          ]},
          { type: 'code', content: 'ls > liste.txt           # redirige stdout vers fichier (écrase)\nls >> liste.txt          # redirige stdout (ajoute)\nls 2> erreurs.txt        # redirige stderr vers fichier\nls > tout.txt 2>&1       # redirige stdout ET stderr\nls 2>/dev/null           # jeter les erreurs\ncat < fichier.txt        # stdin depuis fichier\ncommande1 | commande2    # pipe : stdout1 → stdin2\necho "texte" | wc -c    # compter les caractères via pipe' },
          { type: 'info', content: '<strong>Chaîner avec pipes :</strong> <code>cat /etc/passwd | grep bash | cut -d: -f1</code> — affiche les utilisateurs avec bash comme shell.' },

          // 7. Gestion processus & services
          { type: 'h2', content: '7. Gestion des processus &amp; services' },
          { type: 'h3', content: 'Processus' },
          { type: 'code', content: 'ps aux                   # liste tous les processus\nps aux | grep nginx      # filtrer par nom\ntop                      # moniteur interactif (q pour quitter)\nhtop                     # version améliorée (si installé)\nkill 1234                # envoyer SIGTERM au PID 1234\nkill -9 1234             # forcer la fin (SIGKILL)\npkill nginx              # tuer par nom\nkillall nginx            # tuer toutes les instances\nnohup cmd &              # lancer en arrière-plan, immunisé au logout' },
          { type: 'code', content: 'commande &               # lancer en arrière-plan\njobs                     # lister les tâches en arrière-plan\nfg %1                    # ramener la tâche 1 au premier plan\nbg %1                    # reprendre la tâche 1 en arrière-plan\nCtrl+Z                   # suspendre la commande en cours\nCtrl+C                   # interrompre la commande en cours' },
          { type: 'h3', content: 'Services (systemd)' },
          { type: 'code', content: 'systemctl status ssh              # état du service ssh\nsystemctl start  ssh             # démarrer\nsystemctl stop   ssh             # arrêter\nsystemctl restart ssh            # redémarrer\nsystemctl enable  ssh            # activer au démarrage\nsystemctl disable ssh            # désactiver au démarrage\nsystemctl list-units --type=service   # lister les services\njournalctl -u ssh                # logs du service ssh\njournalctl -f                    # suivre les logs en temps réel' },

          // 8. Filtrage & Traitement
          { type: 'h2', content: '8. Filtrage &amp; Traitement de texte' },
          { type: 'h3', content: 'grep — rechercher des lignes' },
          { type: 'code', content: 'grep "motif" fichier.txt         # lignes contenant "motif"\ngrep -i "motif" fichier.txt      # insensible à la casse\ngrep -r "motif" /etc/            # récursif dans un dossier\ngrep -v "motif" fichier.txt      # lignes NE contenant PAS "motif"\ngrep -n "motif" fichier.txt      # afficher les numéros de ligne\ngrep -c "motif" fichier.txt      # compter les occurrences\ngrep -E "^root|^alice" /etc/passwd  # regex étendue' },
          { type: 'h3', content: 'cut — extraire des colonnes' },
          { type: 'code', content: 'cut -d: -f1 /etc/passwd          # 1er champ, délimiteur :\ncut -d: -f1,3 /etc/passwd        # champs 1 et 3\ncut -c1-10 fichier.txt           # caractères 1 à 10 de chaque ligne' },
          { type: 'h3', content: 'sed — remplacer du texte' },
          { type: 'code', content: 'sed "s/ancien/nouveau/" fichier.txt    # remplace 1ère occurrence par ligne\nsed "s/ancien/nouveau/g" fichier.txt   # remplace toutes les occurrences\nsed -i "s/foo/bar/g" fichier.txt       # modifie le fichier en place\nsed "/^#/d" fichier.txt                # supprime les lignes commençant par #' },
          { type: 'h3', content: 'awk — traitement structuré' },
          { type: 'code', content: 'awk "{print $1}" fichier.txt      # affiche le 1er champ (séparateur espace)\nawk -F: "{print $1,$3}" /etc/passwd   # séparateur :, champs 1 et 3\nawk "$3 > 1000" /etc/passwd      # lignes où le champ 3 > 1000\nawk "END{print NR}" fichier.txt  # compter le nombre de lignes' },

          // 9. Gestion des paquets APT
          { type: 'h2', content: '9. Gestion des paquets — APT' },
          { type: 'p', content: 'APT (Advanced Package Tool) est le gestionnaire de paquets de Debian/Ubuntu. Il télécharge et installe les logiciels depuis des dépôts officiels.' },
          { type: 'steps', items: [
            { num: '1', title: 'Mettre à jour la liste des paquets', code: 'sudo apt update', why: 'Synchronise la liste locale avec les dépôts — à faire avant toute installation.' },
            { num: '2', title: 'Mettre à jour les paquets installés', code: 'sudo apt upgrade', why: 'Installe les nouvelles versions de tous les paquets existants.' },
            { num: '3', title: 'Installer un paquet',                code: 'sudo apt install vim',  why: 'Télécharge et installe vim et ses dépendances.' },
            { num: '4', title: 'Désinstaller un paquet',             code: 'sudo apt remove vim',   why: 'Supprime le paquet mais garde les fichiers de configuration.' },
            { num: '5', title: 'Désinstaller + config',              code: 'sudo apt purge vim',    why: 'Supprime le paquet ET ses fichiers de configuration.' },
            { num: '6', title: 'Nettoyer les paquets orphelins',     code: 'sudo apt autoremove',   why: 'Supprime les dépendances devenues inutiles.' },
          ]},
          { type: 'code', content: 'apt search nginx                 # rechercher un paquet\napt show nginx                   # informations sur un paquet\ndpkg -l | grep nginx             # vérifier si installé\ndpkg -L nginx                    # lister les fichiers du paquet\napt list --installed             # tous les paquets installés\napt-cache policy nginx           # version installée vs disponible' },
          { type: 'info', content: '<strong>Rappel :</strong> toujours faire <code>sudo apt update</code> avant <code>apt install</code>, sinon APT peut proposer une version obsolète.' },

        ],
      },
    ],
    flashcards: [],
    qcm: [],
    linux_cli: true,
    gameshell: true,
  },
  {
    id: 'windows',
    label: 'Windows',
    icon: '🪟',
    color: '#0ea5e9',
    desc: 'Gestion des disques, SAM, droits NTFS, pare-feu, BitLocker...',
    topics: ['Diskpart', 'SAM', 'NTFS', 'icacls', 'BitLocker', 'Pare-feu'],
    cours: [
      {
        id: 'cours_windows_objectifs',
        titre: 'Administration Windows : Disques, SAM, NTFS et Sécurisation',
        sections: [
          { type: 'html-file', src: 'modules/windows/cours_windows_objectifs.html' },
        ],
      },
      {
        id: 'admin-windows-test',
        titre: 'Administration Windows — CMD & PowerShell',
        badge: 'test',
        sections: [
          { type: 'h2', content: '1. Gestion des Utilisateurs et Groupes (CMD - Net)' },
          { type: 'warn', content: 'L\'invite de commande doit être lancée en mode Administrateur.' },
          { type: 'ul', items: [
            '<code>net user Anthony P@ssword123 /add</code> : Crée un compte utilisateur.',
            '<code>net localgroup Support /add</code> : Crée un groupe local nommé "Support".',
            '<code>net localgroup Support Anthony /add</code> : Ajoute l\'utilisateur au groupe.',
            '<code>net user Anthony</code> : Affiche les informations complètes du compte.',
          ]},
          { type: 'h2', content: '2. Gestion des Disques (Diskpart)' },
          { type: 'warn', content: '<strong>ATTENTION :</strong> La commande <code>clean</code> supprime toutes les données du disque sélectionné.' },
          { type: 'code', content: 'diskpart               # Lance l\'outil\nlist disk              # Liste les disques physiques\nselect disk 0          # Sélectionne le disque 0\nclean                  # Efface toute la structure\ncreate partition primary size=50000  # Partition de 50Go\nformat fs=ntfs quick   # Formatage rapide\nassign letter=E        # Monte le disque en E:' },
          { type: 'h2', content: '3. Administration Domaine (Active Directory)' },
          { type: 'ul', items: [
            '<code>wmic computersystem get domain</code> : Vérifie à quel domaine appartient la machine.',
            '<code>Add-Computer -DomainName "carrefour.local" -Credential (Get-Credential)</code> : Joint la machine au domaine (PowerShell).',
          ]},
          { type: 'h2', content: '4. PowerShell — Cmdlets essentielles' },
          { type: 'info', content: 'Syntaxe basée sur <strong>Verbe-Nom</strong>. Les résultats sont des objets manipulables.' },
          { type: 'ul', items: [
            '<code>Get-Process</code> : Liste les processus.',
            '<code>Stop-Process -Name "chrome" -Force</code> : Tue un processus par son nom.',
            '<code>Get-Service</code> : Liste les services Windows.',
            '<code>Restart-Service -Name "wuauserv"</code> : Redémarre Windows Update.',
            '<strong>Pipe :</strong> <code>Get-Process | Where-Object {$_.CPU -gt 100}</code> : Filtre les processus gourmands en CPU.',
          ]},
          { type: 'h2', content: '5. Diagnostic Réseau' },
          { type: 'table', headers: ['Problème', 'Commande'], rows: [
            ['Info IP/DNS/DHCP', '<code>ipconfig /all</code>'],
            ['Vérifier connectivité', '<code>ping 8.8.8.8</code>'],
            ['Vérifier résolution DNS', '<code>nslookup google.com</code>'],
            ['Vider cache DNS', '<code>ipconfig /flushdns</code>'],
            ['Chemin réseau', '<code>route print</code>'],
          ]},
          { type: 'h2', content: '6. Quiz rapide' },
          { type: 'ul', items: [
            'Redémarrer le service DNS ? → <code>Restart-Service Dnscache</code>',
            'Lister les disques via diskpart ? → <code>list disk</code>',
            'Tuer un processus par son nom ? → <code>taskkill /F /IM nom.exe</code>',
          ]},
        ],
      },
      {
        id: 'netrunner',
        titre: 'NetRunner — Missions Windows',
        sections: [
          { type: 'info', content: 'Jeu d\'entraînement PowerShell/CMD. Ouvre <a href="netrunner.html" target="_blank" style="color:inherit;font-weight:bold">NetRunner</a> pour jouer.' },
          { type: 'table', headers: ['Mission', 'Objectif', 'Commandes clés'], rows: [
            ['1 — Infiltration Initiale', 'Tuer un processus et récupérer un flag',    '<code>taskkill</code> · <code>dir</code> · <code>type</code>'],
            ['2 — Extraction de Données', 'Localiser des credentials cachés',          '<code>tasklist</code> · <code>taskkill</code> · <code>dir</code> · <code>type</code>'],
            ['3 — Nettoyage des Traces',  'Effacer les logs avant détection IDS',      '<code>wevtutil el</code> · <code>wevtutil cl</code> · <code>wevtutil qe</code>'],
          ]},
          { type: 'p', content: 'Tape <code>help</code> dans le terminal du jeu pour obtenir des indices sur la commande à utiliser.' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
    windows_cli: true,
    netrunner: true,
  },
];
