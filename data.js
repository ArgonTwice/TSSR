// data.js — Structure des modules TSSR

const MODULES = [
  {
    id: 'numerisation',
    label: 'Numération',
    icon: '🔢',
    color: '#00ff88',
    desc: 'Systèmes de numération : binaire, octal, hexadécimal, conversions...',
    topics: [],
    cours: [
      {
        id: 'outils-conversion',
        titre: 'Outils interactifs — Convertisseur, Réseau, Portes Logiques',
        sections: [
          { type: 'html-file', src: 'modules/numerisation/outils.html' },
        ],
      },
      {
        id: 'cours_optimise_claude',
        titre: 'Architecture des Données : Encodage, Systèmes de Numération et Logique Booléenne',
        sections: [
          { type: 'html-file', src: 'modules/numerisation/cours_optimise_claude.html' },
        ],
      },
    ],
    flashcards: [
      // ── Concepts fondamentaux ──
      { id: 'fc-bit', recto: 'Combien de valeurs peut représenter 1 bit ?', verso: '<strong>2</strong> valeurs : 0 ou 1<br><br>N bits → 2<sup>N</sup> valeurs possibles' },
      { id: 'fc-octet', recto: 'Combien de valeurs peut stocker un octet (8 bits) ?', verso: '<strong>256</strong> valeurs (2<sup>8</sup>)<br>De 0 à 255' },
      { id: 'fc-lsb-msb', recto: 'Définir LSB et MSB', verso: '<strong>LSB</strong> (Least Significant Bit) = bit de poids faible, position 0, valeur 1<br><br><strong>MSB</strong> (Most Significant Bit) = bit de poids fort, position 7, valeur 128' },
      { id: 'fc-quartet', recto: 'Qu\'est-ce qu\'un quartet (nybble) ?', verso: 'Groupe de <strong>4 bits</strong><br>Représente exactement <strong>1 chiffre hexadécimal</strong><br>16 combinaisons possibles (0000 → 1111)' },
      // ── Binaire ↔ Décimal ──
      { id: 'fc-bin-dec-1', recto: 'Convertir <code>1010001</code> (binaire) en décimal', verso: '64 + 16 + 1 = <strong>81</strong><br><small>Poids : 64·1 + 32·0 + 16·1 + 8·0 + 4·0 + 2·0 + 1·1</small>' },
      { id: 'fc-bin-dec-2', recto: 'Convertir <code>10110101</code> (binaire) en décimal', verso: '128 + 32 + 16 + 4 + 1 = <strong>181</strong>' },
      { id: 'fc-bin-dec-3', recto: 'Quelle est la valeur décimale de <code>11111111</code> ?', verso: '<strong>255</strong> — valeur maximale d\'un octet (2<sup>8</sup> − 1)' },
      { id: 'fc-dec-bin-1', recto: 'Convertir <code>43</code> (décimal) en binaire', verso: '<strong>101011</strong><br><small>32+0+8+0+2+1 → bits 32·1, 16·0, 8·1, 4·0, 2·1, 1·1</small>' },
      { id: 'fc-dec-bin-2', recto: 'Convertir <code>128</code> (décimal) en binaire', verso: '<strong>10000000</strong> — seul le bit de poids fort (2<sup>7</sup>) est à 1' },
      { id: 'fc-dec-bin-3', recto: 'Convertir <code>15</code> (décimal) en binaire', verso: '<strong>1111</strong> — les 4 bits à 1 valent 8+4+2+1 = 15<br>C\'est aussi la valeur du chiffre hex <code>F</code>' },
      // ── Hex ↔ Décimal ──
      { id: 'fc-hex-dec-1', recto: 'Convertir <code>2A9</code> (hex) en décimal', verso: '2×256 + 10×16 + 9×1 = 512 + 160 + 9 = <strong>681</strong>' },
      { id: 'fc-dec-hex-1', recto: 'Convertir <code>759</code> (décimal) en hexadécimal', verso: '<strong>2F7</strong><br><small>759÷256=2 reste 247 → F (15×16=240) reste 7</small>' },
      { id: 'fc-hex-dec-ff', recto: 'Quelle est la valeur décimale de <code>FF</code> (hex) ?', verso: '<strong>255</strong><br>15×16 + 15 = 240 + 15 = 255' },
      { id: 'fc-hex-dec-0a', recto: 'Quelle valeur et quel caractère correspond à <code>0A</code> (hex) ?', verso: 'Décimal <strong>10</strong> = caractère de contrôle <strong>LF</strong> (Line Feed / saut de ligne, <code>\\n</code>)' },
      // ── Hex ↔ Binaire ──
      { id: 'fc-hex-bin-f', recto: 'Convertir le chiffre hex <code>F</code> en binaire (4 bits)', verso: '<strong>1111</strong> — 8+4+2+1 = 15' },
      { id: 'fc-hex-bin-a', recto: 'Convertir le chiffre hex <code>A</code> en binaire (4 bits)', verso: '<strong>1010</strong> — 8+0+2+0 = 10' },
      { id: 'fc-bin-hex', recto: 'Convertir <code>0010 1111 0111</code> (binaire) en hex', verso: '<strong>2F7</strong><br>0010→2 / 1111→F / 0111→7<br><small>Méthode réseau : regrouper par 4 bits depuis la droite</small>' },
      // ── ASCII & Encodage ──
      { id: 'fc-ascii-bits', recto: 'Sur combien de bits repose le standard ASCII ? Combien de caractères ?', verso: '<strong>7 bits</strong> → 128 caractères (index 0 à 127)<br>Créé en 1961 pour les télétypes' },
      { id: 'fc-ascii-hex', recto: 'Quel caractère correspond à <code>0x53</code> en ASCII ?', verso: 'Décimal 83 = lettre <strong>\'S\'</strong><br><small>Rappel : 4×16 + 3 = 67… non : 5×16 + 3 = 83</small>' },
      { id: 'fc-ascii-ok', recto: 'Décoder le flux hex : <code>4F 4B 0A</code>', verso: '<strong>"OK" + saut de ligne</strong><br>4F=79=\'O\' · 4B=75=\'K\' · 0A=10=LF' },
      { id: 'fc-utf8-1', recto: 'Combien d\'octets UTF-8 pour un caractère ASCII (U+0000–U+007F) ?', verso: '<strong>1 octet</strong> — format : <code>0xxxxxxx</code><br>Compatibilité totale avec ASCII 7 bits' },
      { id: 'fc-utf8-2', recto: 'Combien d\'octets UTF-8 pour un caractère accentué (é, à, ñ...) ?', verso: '<strong>2 octets</strong> — format : <code>110xxxxx 10xxxxxx</code><br>Plage U+0080 à U+07FF' },
      { id: 'fc-mojibake', recto: 'Qu\'est-ce que le Mojibake ? Donner un exemple.', verso: 'Corruption d\'affichage quand un fichier <strong>UTF-8</strong> est lu en <strong>ISO-8859-1</strong><br>Exemple : "Café" enregistré en UTF-8 → affiché <strong>"CafÃ©"</strong> sur un terminal legacy' },
      // ── Algèbre booléenne ──
      { id: 'fc-and', recto: 'Table de vérité AND — quand vaut-il 1 ?', verso: '<strong>Seulement si A=1 ET B=1</strong><br>0&0=0 · 0&1=0 · 1&0=0 · <strong>1&1=1</strong>' },
      { id: 'fc-or', recto: 'Table de vérité OR — quand vaut-il 0 ?', verso: '<strong>Seulement si A=0 ET B=0</strong><br><strong>0|0=0</strong> · 0|1=1 · 1|0=1 · 1|1=1' },
      { id: 'fc-xor', recto: 'Table de vérité XOR — quand vaut-il 1 ?', verso: '<strong>Quand les entrées sont différentes</strong><br>0⊕0=0 · <strong>0⊕1=1</strong> · <strong>1⊕0=1</strong> · 1⊕1=0' },
      { id: 'fc-and-net', recto: 'À quoi sert l\'opération AND en réseau IP ?', verso: '<strong>Masquage de sous-réseau</strong><br>IP AND masque = adresse réseau<br>Ex: <code>...81 AND ...0 = ...0</code> (dernier octet isolé)' },
      { id: 'fc-xor-raid', recto: 'Quelle propriété de XOR est utilisée dans RAID 5 ?', verso: 'XOR est <strong>réversible</strong> : si A⊕B=C alors C⊕B=A<br>→ Si un disque tombe, la parité + le disque restant reconstituent la donnée' },
    ],
    qcm: [],
  },
];
