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
];
