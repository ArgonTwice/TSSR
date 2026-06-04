// data.js — Structure des modules TSSR

const MODULES = [
  {
    id: 'reseaux',
    label: 'Réseaux',
    icon: '🌐',
    color: '#3b82f6',
    desc: 'Modèle OSI, TCP/IP, VLAN, routage, protocoles...',
    topics: ['OSI', 'TCP/IP', 'VLAN', 'Routage', 'DNS', 'DHCP'],
    cours: [],
    flashcards: [],
    qcm: [],
    linux_cli: true,
  },
  {
    id: 'windows',
    label: 'Windows Server',
    icon: '🪟',
    color: '#0ea5e9',
    desc: 'Active Directory, GPO, DNS, DHCP, IIS...',
    topics: ['AD DS', 'GPO', 'DNS', 'DHCP', 'IIS', 'RDS'],
    cours: [],
    flashcards: [],
    qcm: [],
    windows_cli: true,
  },
  {
    id: 'linux',
    label: 'Linux',
    icon: '🐧',
    color: '#00e5a0',
    desc: 'Commandes, services systemd, droits, scripting bash...',
    topics: ['Commandes', 'Droits', 'Systemd', 'Bash', 'RAID', 'LVM'],
    cours: [
      // ============================================================
      // TP Debian — RAID & LVM
      // ============================================================
      {
        id: 'tp-raid-lvm',
        titre: 'TP Debian — RAID & LVM',
        badge: 'TP complet',
        sections: [

          // ── Introduction ──
          { type: 'h2', content: 'Introduction' },
          { type: 'p', content: 'Objectif : mettre en place un serveur Debian avec une architecture de stockage robuste combinant <strong>RAID 1</strong> (miroir) sur les partitions système, <strong>RAID 5</strong> (parité distribuée) avec disque spare sur les données, et <strong>LVM</strong> (Logical Volume Manager) sur le RAID 5 pour la flexibilité.' },
          { type: 'info', content: '<strong>Pourquoi combiner RAID et LVM ?</strong><br>Le RAID protège contre la perte physique d\'un disque. Le LVM permet de gérer l\'espace disque de façon flexible (agrandir, réduire, snapshots). Ensemble ils offrent sécurité et souplesse.' },
          { type: 'p', content: 'Le serveur hébergera trois services : serveur web Apache (<code>/srv</code>), serveur de messagerie (<code>/var/mail</code>) et serveur de fichiers (<code>/partage</code>).' },

          // ── VirtualBox ──
          { type: 'h2', content: 'Création de la VM — VirtualBox' },
          { type: 'h3', content: 'Créer la machine virtuelle' },
          { type: 'steps', items: [
            { num: '1', title: 'Nouvelle VM', content: 'Cliquer sur <strong>Nouvelle</strong>. Renseigner : Nom au choix (ex: <code>debian-srv</code>), Type : <strong>Linux</strong>, Version : <strong>Debian (64-bit)</strong>, RAM : <strong>2048 Mo</strong>.', why: '<strong>Pourquoi 2048 Mo ?</strong> Le minimum confortable pour un serveur Debian avec RAID logiciel actif. Le RAID logiciel consomme du CPU et de la RAM pour calculer la parité.' },
            { num: '2', title: 'Premier disque dur', content: 'Choisir <strong>Créer un disque dur virtuel maintenant</strong> → Format : <strong>VDI</strong> → Allocation : <strong>Dynamiquement alloué</strong> → Taille : <strong>10 Go</strong>.', why: '<strong>Pourquoi dynamique ?</strong> Le fichier VDI n\'occupe que l\'espace réellement utilisé. Un disque de 10 Go alloué dynamiquement commence à ~1 Mo et grossit au fur et à mesure.' },
            { num: '3', title: 'Ajouter 5 disques supplémentaires', content: 'Aller dans <strong>Configuration → Stockage</strong> et ajouter 5 nouveaux disques VDI de 10 Go chacun. Au total : <strong>6 disques de 10 Go</strong>.', why: '<strong>Pourquoi 6 disques ?</strong> sda + sdb pour le RAID 1 système, sdc + sdd + sde pour le RAID 5 données, sdf comme spare.' },
            { num: '4', title: 'Monter l\'ISO Debian', content: 'Dans <strong>Configuration → Stockage</strong>, cliquer sur le lecteur CD → icône disquette → <strong>Choisir un fichier</strong> → sélectionner l\'ISO Debian netinstall.', why: '<strong>Pourquoi netinstall ?</strong> L\'ISO netinstall est très légère (~400 Mo). Les paquets sont téléchargés depuis un miroir, garantissant les versions les plus récentes.' },
            { num: '5', title: 'Configurer le réseau en pont', content: 'Aller dans <strong>Configuration → Réseau → Carte 1</strong> → Mode d\'accès réseau : <strong>Accès par pont</strong> → sélectionner la carte réseau physique active.', why: '<strong>Pourquoi le mode pont ?</strong> La VM obtient une IP directement depuis le routeur/DHCP du réseau local, comme une vraie machine physique.' },
          ]},

          // ── VMware ──
          { type: 'h2', content: 'Création de la VM — VMware Workstation Pro' },
          { type: 'info', content: '<strong>Différence avec VirtualBox :</strong> VMware utilise le format VMDK et offre de meilleures performances. La procédure est similaire mais les menus diffèrent.' },
          { type: 'steps', items: [
            { num: '1', title: 'Nouvelle VM en mode Custom', content: '<strong>Create a New Virtual Machine → Custom (advanced)</strong> → ISO Debian netinstall → Guest OS : <strong>Linux / Debian 12.x 64-bit</strong> → RAM : <strong>2048 Mo</strong> → Network : <strong>Bridged</strong> → Disk type : <strong>SCSI</strong> → 10 Go / Store as single file.' },
            { num: '2', title: 'Ajouter 5 disques supplémentaires', content: 'Dans <strong>VM → Settings → Add → Hard Disk</strong>, répéter 5 fois : Type SCSI → Create a new virtual disk → 10 Go / Single file / pas d\'allocation complète.' },
            { num: '3', title: 'Réseau en pont', content: 'Dans <strong>VM → Settings → Network Adapter</strong> → <strong>Bridged</strong> → cocher <strong>Replicate physical network connection state</strong>.', why: '<strong>Attention VMware :</strong> Le mode "Pont (Automatique)" peut ne pas sélectionner la bonne carte. Si le DHCP échoue, vérifier dans <strong>Edit → Virtual Network Editor → VMnet0</strong>.' },
          ]},

          // ── Installation de base ──
          { type: 'h2', content: 'Installation de base — Debian' },
          { type: 'steps', items: [
            { num: '1', title: 'Démarrage', content: 'Au menu de boot Debian, sélectionner <strong>Install</strong> (mode texte, pas Graphical Install).', why: '<strong>Pourquoi le mode texte ?</strong> Plus léger, fonctionne sur n\'importe quelle configuration.' },
            { num: '2', title: 'Langue, pays, clavier', content: 'Langue : <strong>French</strong> · Pays : <strong>France</strong> · Clavier : <strong>Français</strong>' },
            { num: '3', title: 'Nom de machine et domaine', content: 'Nom de machine : au choix (ex: <code>srvdeb</code>). Domaine : laisser <strong>vide</strong>.', why: '<strong>Pourquoi laisser le domaine vide ?</strong> Sans DNS d\'entreprise configuré, un domaine vide évite des erreurs de résolution de noms.' },
            { num: '4', title: 'Mots de passe', content: 'Choisir et <strong>noter impérativement</strong> le mot de passe <strong>root</strong> et le nom/mot de passe du <strong>compte utilisateur</strong>.', why: '<strong>Pourquoi deux comptes ?</strong> Root a tous les droits — dangereux au quotidien. Le compte utilisateur est limité. On utilise <code>su -</code> pour passer root ponctuellement.' },
          ]},

          // ── Partitionnement ──
          { type: 'h2', content: 'Partitionnement — Manuel' },
          { type: 'p', content: 'Sélectionner le mode <strong>Manuel</strong> dans l\'écran de partitionnement.' },
          { type: 'warn', content: '<strong>Attention :</strong> Les points de montage (<code>/</code>, <code>/var</code>, <code>/home</code>) ne sont PAS assignés maintenant — ils le seront après la création des périphériques RAID.' },
          { type: 'h3', content: 'Partitions de sda' },
          { type: 'table', headers: ['Partition', 'Taille', 'Type', 'Utiliser comme', 'Usage futur'], rows: [
            ['<code>sda1</code>', '512 Mo', 'Primaire', 'Espace d\'échange (swap)', 'Swap'],
            ['<code>sda2</code>', '4 Go',   'Primaire', 'Volume physique pour RAID', 'Futur /'],
            ['<code>sda3</code>', '2 Go',   'Primaire', 'Volume physique pour RAID', 'Futur /var'],
            ['<code>sda4</code>', '4 Go',   'Primaire', 'Volume physique pour RAID', 'Futur /home'],
          ]},
          { type: 'info', content: '<strong>Pourquoi "Début" comme emplacement ?</strong> Les partitions au début du disque bénéficient des meilleures performances sur les disques mécaniques.' },
          { type: 'h3', content: 'Partitions de sdb' },
          { type: 'p', content: 'Reproduire exactement les mêmes 4 partitions sur <strong>sdb</strong> : sdb1 (512 Mo swap), sdb2 (4 Go RAID), sdb3 (2 Go RAID), sdb4 (4 Go RAID).' },
          { type: 'info', content: '<strong>Pourquoi identique à sda ?</strong> Le RAID 1 fonctionne en miroir : il copie bit pour bit les données de sda vers sdb. Les partitions doivent être de tailles identiques pour être appairées.' },
          { type: 'h3', content: 'Partitions de sdc, sdd, sde, sdf' },
          { type: 'p', content: 'Sur chacun de ces 4 disques, créer <strong>une seule partition</strong> : 10 Go — Primaire — Début — <strong>Volume physique pour RAID</strong>.' },

          // ── RAID ──
          { type: 'h2', content: 'Configuration RAID — Logiciel' },
          { type: 'p', content: 'Une fois tous les disques partitionnés, cliquer sur <strong>Configurer le RAID logiciel</strong> en haut de la liste. Accepter l\'écriture des changements.' },
          { type: 'steps', items: [
            { num: 'md0', title: 'Futur / — RAID 1', content: 'Type : <strong>RAID 1</strong> · Disques actifs : <strong>2</strong> · Spare : <strong>0</strong> · Partitions : <strong>sda2 + sdb2</strong>', why: '<strong>RAID 1 pour / :</strong> La partition racine contient l\'OS. Si sda tombe en panne, sdb prend le relais immédiatement sans interruption de service.' },
            { num: 'md1', title: 'Futur /var — RAID 1', content: 'Type : <strong>RAID 1</strong> · Disques actifs : <strong>2</strong> · Spare : <strong>0</strong> · Partitions : <strong>sda3 + sdb3</strong>', why: '<strong>/var contient les logs, bases de données, fichiers temporaires des services.</strong> Sa perte provoquerait des dysfonctionnements majeurs.' },
            { num: 'md2', title: 'Futur /home — RAID 1', content: 'Type : <strong>RAID 1</strong> · Disques actifs : <strong>2</strong> · Spare : <strong>0</strong> · Partitions : <strong>sda4 + sdb4</strong>' },
            { num: 'md3', title: 'RAID 5 pour LVM', content: 'Type : <strong>RAID 5</strong> · Disques actifs : <strong>3</strong> · Spare : <strong>1</strong> · Actifs : <strong>sdc1 + sdd1 + sde1</strong> · Spare : <strong>sdf1</strong>', why: '<strong>Pourquoi RAID 5 ?</strong> Distribue données ET parité sur 3 disques. Si un disque tombe, reconstruction via la parité. Capacité = (3-1) × 10 Go = 20 Go.<br><strong>Le spare (sdf)</strong> : disque de rechange en veille. Dès qu\'un disque actif tombe, reconstruction automatique sans intervention.' },
          ]},
          { type: 'warn', content: '<strong>Important :</strong> Le RAID ne remplace pas les sauvegardes ! Il protège contre la panne matérielle d\'un disque, pas contre la suppression accidentelle, un ransomware ou un incendie.' },
          { type: 'h3', content: 'Assigner les points de montage' },
          { type: 'table', headers: ['Périphérique', 'Format', 'Point de montage'], rows: [
            ['<code>md0</code> (4 Go)', 'ext4', '/'],
            ['<code>md1</code> (2 Go)', 'ext4', '/var'],
            ['<code>md2</code> (4 Go)', 'ext4', '/home'],
            ['<code>md3</code> (~20 Go)', '—', 'Ne pas formater — sera utilisé par LVM'],
          ]},
          { type: 'info', content: '<strong>Pourquoi ext4 ?</strong> Système de fichiers Linux le plus courant. Supporte les grandes partitions, gros fichiers, inclut un journal qui protège contre la corruption en cas de coupure.' },

          // ── LVM ──
          { type: 'h2', content: 'Configuration LVM — Volumes logiques' },
          { type: 'p', content: 'Cliquer sur <strong>Configurer le gestionnaire de volumes logiques (LVM)</strong> puis accepter.' },
          { type: 'steps', items: [
            { num: '1', title: 'Créer le groupe de volumes', content: 'Nom : <code>vg0</code> · Périphérique physique : sélectionner <strong>md3</strong>', why: '<strong>Le groupe de volumes (VG)</strong> est un "pool" d\'espace disque. On y découpe des volumes logiques de la taille souhaitée. Comme un disque virtuel qu\'on peut partitionner librement.' },
            { num: '2', title: 'lv_mail — serveur de messagerie', content: 'Groupe : <code>vg0</code> · Nom : <code>lv_mail</code> · Taille : <strong>2 Go</strong>' },
            { num: '3', title: 'lv_web — serveur web Apache', content: 'Groupe : <code>vg0</code> · Nom : <code>lv_web</code> · Taille : <strong>4 Go</strong>' },
            { num: '4', title: 'lv_partage — serveur de fichiers', content: 'Groupe : <code>vg0</code> · Nom : <code>lv_partage</code> · Taille : <strong>reste de l\'espace (~14 Go)</strong>', why: '<strong>Pourquoi LVM sur RAID 5 ?</strong> Si /partage manque d\'espace, on agrandit lv_partage à chaud (sans redémarrer) avec <code>lvextend</code> puis <code>resize2fs</code>. Impossible avec des partitions classiques.' },
          ]},
          { type: 'h3', content: 'Assigner les points de montage LVM' },
          { type: 'table', headers: ['Volume logique', 'Format', 'Point de montage', 'Usage'], rows: [
            ['<code>vg0-lv_mail</code>',    'ext4', '/var/mail', 'Boîtes mail des utilisateurs'],
            ['<code>vg0-lv_web</code>',     'ext4', '/srv',      'Arborescence Apache'],
            ['<code>vg0-lv_partage</code>', 'ext4', '/partage',  'Partages de fichiers réseau'],
          ]},
          { type: 'info', content: '<strong>/var/mail :</strong> Ce point de montage n\'apparaît pas dans la liste déroulante. Sélectionner <strong>"Entrer manuellement"</strong> et taper <code>/var/mail</code>. Idem pour <code>/partage</code>.' },

          // ── Finalisation ──
          { type: 'h2', content: 'Finalisation — Installation' },
          { type: 'steps', items: [
            { num: '1', title: 'Appliquer le partitionnement', content: 'Cliquer sur <strong>Terminer le partitionnement et appliquer les changements</strong> → confirmer avec <strong>Oui</strong>. Le formatage et l\'installation de base commencent.' },
            { num: '2', title: 'Serveur de paquets', content: '<strong>À domicile :</strong> France → <code>deb.debian.org</code>, mandataire vide.<br><strong>À l\'AFPA :</strong> saisie manuelle → hôte <code>192.168.233.8</code> → répertoire <code>/debian/</code> → mandataire vide.', why: '<strong>Pourquoi un serveur local à l\'AFPA ?</strong> Télécharger depuis un miroir local est beaucoup plus rapide qu\'depuis Internet.' },
            { num: '3', title: 'Sélection des logiciels', content: 'Décocher tout et ne garder que : <strong>Utilitaires usuels du système</strong> + <strong>Serveur SSH</strong>.', why: '<strong>Pourquoi seulement ces deux ?</strong> C\'est un serveur — pas besoin d\'interface graphique. SSH = administration à distance. Moins de paquets = moins de surface d\'attaque.' },
            { num: '4', title: 'Installation de GRUB', content: 'Choisir <strong>Oui</strong> pour installer GRUB, puis sélectionner <strong>/dev/sda</strong>.', why: '<strong>Pourquoi sda et pas sdb ?</strong> GRUB démarre avant le RAID. Si sda tombe, il faudra réinstaller GRUB sur sdb, mais les données restent intactes grâce au RAID 1.' },
            { num: '5', title: 'Redémarrage', content: 'Retirer l\'ISO (<strong>VM → Settings → CD/DVD → décocher Connected</strong>) et redémarrer. Se connecter avec le compte utilisateur.' },
          ]},
          { type: 'h3', content: 'Vérification avec lsblk' },
          { type: 'code', content: 'lsblk' },
          { type: 'schema', content: `sda                    10G  disk
├─sda1                 487M  part  [SWAP]
├─sda2                 3.7G  part
│ └─md0                3.7G  raid1  /
├─sda3                 1.9G  part
│ └─md1                1.9G  raid1  /var
└─sda4                 3.9G  part
  └─md2                3.9G  raid1  /home
sdb                    10G  disk  (miroir de sda)
sdc/sdd/sde            10G  disk  → md3 (RAID5)
  └─vg0-lv_mail        1.9G  lvm   /var/mail
  └─vg0-lv_web         3.7G  lvm   /srv
  └─vg0-lv_partage     14.4G lvm   /partage
sdf                    10G  disk  (spare md3)` },

          // ── APT ──
          { type: 'h2', content: 'Gestion des paquets — aptitude' },
          { type: 'h3', content: 'Les dépôts Debian' },
          { type: 'table', headers: ['Dépôt', 'Contenu', 'Serveur AFPA'], rows: [
            ['<strong>main</strong>',     'Logiciels 100% libres (DFSG)',            '<code>192.168.233.8/debian/</code>'],
            ['<strong>contrib</strong>',  'Libres mais dépendances non-libres',       '<code>192.168.233.8/debian/</code>'],
            ['<strong>non-free</strong>', 'Logiciels propriétaires',                  '<code>192.168.233.8/debian/</code>'],
            ['<strong>security</strong>', 'Correctifs de sécurité urgents',           '<code>192.168.233.8/debian_security/</code>'],
            ['<strong>updates</strong>',  'Mises à jour fréquentes',                  '<code>192.168.233.8/debian_updates/</code>'],
            ['<strong>backport</strong>', 'Paquets récents pour stable',              'Pas de miroir local'],
          ]},
          { type: 'h3', content: 'Modifier /etc/apt/sources.list' },
          { type: 'code', content: 'su -\nnano /etc/apt/sources.list' },
          { type: 'p', content: 'Ajouter à la fin du fichier :' },
          { type: 'code', content: '# Dépôt updates (mises à jour fréquentes)\ndeb http://192.168.233.8/debian_updates/ bookworm-updates main contrib non-free' },
          { type: 'info', content: '<strong>Syntaxe sources.list :</strong><br><code>deb|deb-src  URI  Distribution  Catégories</code><br><code>deb</code> = paquets binaires · <code>deb-src</code> = code source · <code>bookworm</code> = nom de code Debian 12' },
          { type: 'h3', content: 'Commandes aptitude essentielles' },
          { type: 'code', content: '# Recharger la liste des paquets\naptitude update\n\n# Rechercher un paquet\naptitude search vim\n\n# Installer un paquet\naptitude install vim\n\n# Mettre à jour tous les paquets\naptitude upgrade' },
          { type: 'warn', content: '<strong>Toujours faire update avant upgrade !</strong> Sans update, aptitude compare avec une liste obsolète et peut manquer des mises à jour importantes.' },

          // ── Mode Rescue ──
          { type: 'h2', content: 'Mode Rescue — Récupération' },
          { type: 'p', content: 'Le mode Rescue permet de reprendre le contrôle d\'un système inaccessible (mot de passe root perdu, bootloader corrompu) en démarrant depuis l\'ISO d\'installation.' },
          { type: 'info', content: '<strong>chroot (CHange ROOT) :</strong> Le mode Rescue effectue un chroot vers la partition sélectionnée. Le système considère cette partition comme sa racine <code>/</code>. Toutes les commandes agissent sur le système "planté". C\'est comme si on avait booté normalement.' },
          { type: 'steps', items: [
            { num: '1', title: 'Monter l\'ISO et booter dessus', content: 'Dans <strong>VM → Settings → CD/DVD</strong>, sélectionner l\'ISO Debian et cocher <strong>Connected at power on</strong>. Redémarrer et démarrer sur le CD.' },
            { num: '2', title: 'Choisir le mode Rescue', content: 'Dans le menu de boot Debian : <strong>Advanced options → Rescue mode</strong>. Renseigner langue, pays, clavier normalement.' },
            { num: '3', title: 'Assembler le RAID', content: 'À l\'écran "Périphérique à monter", sélectionner <strong>Construire l\'ensemble RAID → Automatique → Continuer</strong>.', why: '<strong>Pourquoi assembler le RAID d\'abord ?</strong> Notre partition racine (<code>/</code>) est sur md0. L\'installateur doit activer les volumes RAID pour y accéder.' },
            { num: '4', title: 'Exécuter un shell dans /dev/md0', content: 'Sélectionner <strong>Exécuter un shell dans /dev/md0</strong>. Le chroot est effectué automatiquement.' },
            { num: '5', title: 'Vérifier et changer le mot de passe root', content: '', code: '# Vérifier qu\'on est dans le bon système\ncat /etc/hostname\n# Doit afficher le nom de votre Debian (ex: srvdeb)\n\n# Changer le mot de passe root\npasswd\n\n# Quitter le shell\nexit' },
            { num: '6', title: 'Redémarrer et vérifier', content: 'Sélectionner <strong>Redémarrer le système</strong>. Retirer l\'ISO avant le redémarrage.', code: 'su -\n# Saisir le nouveau mot de passe' },
          ]},

          // ── Schéma final ──
          { type: 'h2', content: 'Schéma final — Architecture' },
          { type: 'schema', content: `┌──────────────────────────────────────────────────────────┐
│                   ARCHITECTURE DISQUES                    │
├──────────────────────────┬───────────────────────────────┤
│   RAID 1 — Système       │   RAID 5 + LVM — Données      │
│   (sda + sdb)            │   (sdc+sdd+sde) spare: sdf    │
├──────────────────────────┼───────────────────────────────┤
│  sda1+sdb1 → SWAP 1Go   │  md3 (RAID5) 20Go             │
│  sda2+sdb2 → md0 → /    │   └── vg0 (LVM group)         │
│  sda3+sdb3 → md1 → /var │        ├── lv_mail → /var/mail │
│  sda4+sdb4 → md2 → /home│        ├── lv_web  → /srv      │
│                          │        └── lv_partage → /part  │
└──────────────────────────┴───────────────────────────────┘` },

          // ── Commandes utiles ──
          { type: 'h2', content: 'Commandes utiles — Référence' },
          { type: 'h3', content: 'Documentation système' },
          { type: 'code', content: 'man date             # Manuel d\'une commande\nman -k cp            # Chercher toutes les commandes contenant "cp"\napropos cp           # Équivalent de man -k\ninfo date            # Documentation détaillée\nwc --help            # Aide rapide\nls /usr/share/doc    # HOWTO et docs locales' },
          { type: 'h3', content: 'Vérification du RAID' },
          { type: 'code', content: 'cat /proc/mdstat              # État de tous les volumes RAID\nmdadm --detail /dev/md0      # Détail d\'un volume RAID spécifique\nlsblk                         # Vue arborescente des disques' },
          { type: 'h3', content: 'Gestion LVM' },
          { type: 'code', content: 'pvs    # Volumes physiques\nvgs    # Groupes de volumes\nlvs    # Volumes logiques\ndf -h  # Espace disque utilisé par point de montage' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
    linux_cli: true,
  },
  {
    id: 'securite',
    label: 'Sécurité',
    icon: '🔐',
    color: '#f59e0b',
    desc: 'Firewall, PKI, VPN, chiffrement, audit...',
    topics: ['Firewall', 'PKI', 'VPN', 'SSL/TLS', 'Audit', 'RBAC'],
    cours: [],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'virtualisation',
    label: 'Virtualisation',
    icon: '📦',
    color: '#a78bfa',
    desc: 'VMware vSphere, Hyper-V, conteneurs Docker...',
    topics: ['VMware', 'Hyper-V', 'Docker', 'Snapshots', 'VMs', 'Clusters'],
    cours: [],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'supervision',
    label: 'Supervision',
    icon: '📊',
    color: '#f472b6',
    desc: 'SNMP, Zabbix, Nagios, métriques, alertes...',
    topics: ['SNMP', 'Zabbix', 'Nagios', 'Syslog', 'ITIL', 'Tickets'],
    cours: [],
    flashcards: [],
    qcm: [],
  },
];
