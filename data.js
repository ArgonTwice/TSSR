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
    ],
    flashcards: [],
    qcm: [],
    windows_cli: true,
  },
];
