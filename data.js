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
        id: 'numerisation-complet',
        titre: 'Numération, Encodage & Logique Booléenne',
        sections: [

          // ══════════════════════════════════════════
          // PARTIE 1 — POURQUOI LES ORDINATEURS UTILISENT LE BINAIRE
          // ══════════════════════════════════════════
          { type: 'h2', content: '1. Pourquoi le binaire ?' },
          { type: 'p', content: 'Un ordinateur est une machine électronique. Un transistor ne connaît que deux états : <strong>courant passe (1)</strong> ou <strong>courant ne passe pas (0)</strong>. C\'est physiquement impossible d\'avoir "un peu de courant" de façon fiable. C\'est pourquoi TOUT dans un ordinateur est exprimé en binaire : textes, images, sons, vidéos, instructions CPU.' },
          { type: 'info', content: '<strong>Analogie :</strong> Un interrupteur électrique, c\'est du binaire. Allumé = 1, éteint = 0. Un processeur moderne contient des milliards de transistors — autant d\'interrupteurs microscopiques qui s\'allument et s\'éteignent des milliards de fois par seconde.' },
          { type: 'table', headers: ['Concept', 'Symbole', 'Tension électrique', 'Exemple'], rows: [
            ['Bit à 0', '0', '0V (pas de signal)', 'Transistor bloqué'],
            ['Bit à 1', '1', '3.3V ou 5V', 'Transistor passant'],
            ['Octet (8 bits)', '0b11001010', 'Combinaison de 8 transistors', 'Valeur 202 en décimal'],
          ]},
          { type: 'p', content: 'Un <strong>bit</strong> est l\'unité minimale d\'information. 8 bits forment un <strong>octet</strong> (byte en anglais). Avec 8 bits, on peut représenter 2⁸ = <strong>256 valeurs différentes</strong> (de 0 à 255).' },
          { type: 'table', headers: ['Unité', 'Équivalent', 'Exemple concret'], rows: [
            ['1 bit', '0 ou 1', 'Un interrupteur'],
            ['1 octet (8 bits)', '256 valeurs possibles', 'Un caractère ASCII'],
            ['1 Ko (kilooctet)', '1 024 octets', 'Un court email texte'],
            ['1 Mo (mégaoctet)', '1 024 Ko = 1 048 576 octets', 'Une photo basse résolution'],
            ['1 Go (gigaoctet)', '1 024 Mo', 'Un film HD compressé'],
            ['1 To (téraoctet)', '1 024 Go', 'Disque dur standard'],
            ['1 Po (pétaoctet)', '1 024 To', 'Données Facebook par jour'],
          ]},

          // ══════════════════════════════════════════
          // PARTIE 2 — NUMÉRATION BINAIRE
          // ══════════════════════════════════════════
          { type: 'h2', content: '2. Numération Binaire — Base 2' },
          { type: 'p', content: 'En base 10 (notre système), chaque position représente une puissance de 10. En base 2, chaque position représente une puissance de 2. La position la plus à droite vaut 2⁰ = 1, la suivante 2¹ = 2, puis 2² = 4, etc.' },

          { type: 'table', headers: ['Position', '7', '6', '5', '4', '3', '2', '1', '0'], rows: [
            ['Puissance de 2', '2⁷', '2⁶', '2⁵', '2⁴', '2³', '2²', '2¹', '2⁰'],
            ['Valeur décimale', '128', '64', '32', '16', '8', '4', '2', '1'],
          ]},
          { type: 'info', content: '<strong>Astuce mémorisation :</strong> Retiens la suite 1-2-4-8-16-32-64-128 de droite à gauche. Chaque valeur est le double de la précédente.' },

          { type: 'h3', content: '2.1 Binaire → Décimal : méthode des puissances' },
          { type: 'p', content: 'Pour convertir un nombre binaire en décimal, on additionne les puissances de 2 correspondant aux bits à <strong>1</strong>.' },
          { type: 'code', content: 'Exemple 1 : 10110011\n\nPosition :  7   6   5   4   3   2   1   0\nBit     :  1   0   1   1   0   0   1   1\nValeur  : 128   0  32  16   0   0   2   1\n\nRésultat : 128 + 32 + 16 + 2 + 1 = 179(10)\n\n──────────────────────────────────────────\n\nExemple 2 : 11111111 (valeur max d\'un octet)\n\nPosition :  7   6   5   4   3   2   1   0\nBit     :  1   1   1   1   1   1   1   1\nValeur  : 128  64  32  16   8   4   2   1\n\nRésultat : 128+64+32+16+8+4+2+1 = 255(10)\n→ C\'est pourquoi une IP ne peut pas dépasser 255 par octet !\n\n──────────────────────────────────────────\n\nExemple 3 : 00001010 (10 en décimal = LF dans ASCII)\n\nPosition :  7   6   5   4   3   2   1   0\nBit     :  0   0   0   0   1   0   1   0\nValeur  :  0   0   0   0   8   0   2   0\n\nRésultat : 8 + 2 = 10(10)' },

          { type: 'h3', content: '2.2 Décimal → Binaire : méthode des soustractions' },
          { type: 'p', content: 'On soustrait successivement les puissances de 2 décroissantes. Si la puissance "rentre", le bit vaut 1. Sinon, le bit vaut 0.' },
          { type: 'code', content: 'Exemple 1 : Convertir 156(10) en binaire\n\nPuissance  Rentre ?  Bit  Reste\n  128        Oui      1    156-128 = 28\n   64        Non      0    28\n   32        Non      0    28\n   16        Oui      1    28-16 = 12\n    8        Oui      1    12-8  = 4\n    4        Oui      1    4-4   = 0\n    2        Non      0    0\n    1        Non      0    0\n\nRésultat : 10011100(2)\nVérification : 128+16+8+4 = 156 ✓\n\n──────────────────────────────────────────\n\nExemple 2 : Convertir 255(10) en binaire\n\n128 → Oui → 1 → reste 127\n 64 → Oui → 1 → reste 63\n 32 → Oui → 1 → reste 31\n 16 → Oui → 1 → reste 15\n  8 → Oui → 1 → reste 7\n  4 → Oui → 1 → reste 3\n  2 → Oui → 1 → reste 1\n  1 → Oui → 1 → reste 0\n\nRésultat : 11111111(2) → tous les bits à 1\n\n──────────────────────────────────────────\n\nExemple 3 : Convertir 192(10) en binaire\n(192 = masque réseau courant en notation décimale)\n\n128 → Oui → 1 → reste 64\n 64 → Oui → 1 → reste 0\n 32 → Non → 0\n 16 → Non → 0\n  8 → Non → 0\n  4 → Non → 0\n  2 → Non → 0\n  1 → Non → 0\n\nRésultat : 11000000(2)\n→ 255.255.255.192 = /26 en notation CIDR' },

          { type: 'h3', content: '2.3 Méthode des divisions par 2' },
          { type: 'p', content: 'Méthode alternative : diviser successivement par 2 et lire les restes de bas en haut.' },
          { type: 'code', content: 'Exemple : 75(10) → binaire\n\n75 ÷ 2 = 37  reste 1  ← bit de poids faible (droite)\n37 ÷ 2 = 18  reste 1\n18 ÷ 2 = 9   reste 0\n 9 ÷ 2 = 4   reste 1\n 4 ÷ 2 = 2   reste 0\n 2 ÷ 2 = 1   reste 0\n 1 ÷ 2 = 0   reste 1  ← bit de poids fort (gauche)\n\nLire les restes de BAS en HAUT : 1001011(2)\nEn 8 bits : 01001011(2)\n\nVérification : 64+8+2+1 = 75 ✓' },

          { type: 'h3', content: '2.4 Application réseau — Les masques de sous-réseau' },
          { type: 'p', content: 'En réseau, les masques sont des octets dont les bits sont groupés : les bits à 1 représentent la partie réseau, les bits à 0 la partie hôte. C\'est pourquoi les masques sont toujours des valeurs précises.' },
          { type: 'table', headers: ['Masque décimal', 'Binaire', 'CIDR', 'Bits réseau', 'Bits hôte'], rows: [
            ['255.0.0.0', '11111111.00000000.00000000.00000000', '/8', '8', '24'],
            ['255.255.0.0', '11111111.11111111.00000000.00000000', '/16', '16', '16'],
            ['255.255.255.0', '11111111.11111111.11111111.00000000', '/24', '24', '8'],
            ['255.255.255.128', '11111111.11111111.11111111.10000000', '/25', '25', '7'],
            ['255.255.255.192', '11111111.11111111.11111111.11000000', '/26', '26', '6'],
            ['255.255.255.224', '11111111.11111111.11111111.11100000', '/27', '27', '5'],
            ['255.255.255.240', '11111111.11111111.11111111.11110000', '/28', '28', '4'],
            ['255.255.255.252', '11111111.11111111.11111111.11111100', '/30', '30', '2'],
          ]},
          { type: 'warn', content: '<strong>Règle d\'or :</strong> Un masque valide n\'a JAMAIS de 0 avant un 1. 11111100 est valide. 10101010 ne l\'est PAS. C\'est pourquoi 255.255.255.253 n\'est PAS un masque valide.' },

          // ══════════════════════════════════════════
          // PARTIE 3 — HEXADÉCIMAL
          // ══════════════════════════════════════════
          { type: 'h2', content: '3. Numération Hexadécimale — Base 16' },
          { type: 'p', content: 'L\'hexadécimal est la notation de prédilection des informaticiens car <strong>1 chiffre hex = exactement 4 bits</strong>, et <strong>2 chiffres hex = exactement 1 octet</strong>. C\'est beaucoup plus compact que le binaire.' },
          { type: 'p', content: 'La base 16 nécessite 16 symboles : on utilise les chiffres 0-9 puis les lettres A-F.' },
          { type: 'table', headers: ['Décimal', 'Hexadécimal', 'Binaire (4 bits)', 'Mémo'], rows: [
            ['0', '0', '0000', ''],
            ['1', '1', '0001', ''],
            ['2', '2', '0010', ''],
            ['3', '3', '0011', ''],
            ['4', '4', '0100', ''],
            ['5', '5', '0101', ''],
            ['6', '6', '0110', ''],
            ['7', '7', '0111', ''],
            ['8', '8', '1000', 'Premier bit à 1'],
            ['9', '9', '1001', ''],
            ['10', 'A', '1010', 'A = 10'],
            ['11', 'B', '1011', 'B = 11'],
            ['12', 'C', '1100', 'C = 12'],
            ['13', 'D', '1101', 'D = 13'],
            ['14', 'E', '1110', 'E = 14'],
            ['15', 'F', '1111', 'F = 15 = tous les bits à 1'],
          ]},
          { type: 'info', content: '<strong>Notation :</strong> On préfixe souvent l\'hex par <code>0x</code> (ex: 0xFF) ou <code>#</code> (couleurs web : #FF5733). En assembleur on utilise le suffixe <code>h</code> (FFh).' },

          { type: 'h3', content: '3.1 Hexadécimal → Décimal' },
          { type: 'p', content: 'Chaque position représente une puissance de 16. On multiplie chaque chiffre par sa puissance et on additionne.' },
          { type: 'code', content: 'Exemple 1 : 0xFF → décimal\n\nF = 15, F = 15\n(15 × 16¹) + (15 × 16⁰)\n= 240 + 15\n= 255(10)\n→ Valeur maximale d\'un octet, masque 255 en réseau\n\n──────────────────────────────────────────\n\nExemple 2 : 0x1A2B → décimal\n\n1 × 16³ = 1 × 4096 = 4096\nA × 16² = 10 × 256 = 2560\n2 × 16¹ = 2 × 16   =   32\nB × 16⁰ = 11 × 1   =   11\n\nRésultat : 4096 + 2560 + 32 + 11 = 6699(10)\n\n──────────────────────────────────────────\n\nExemple 3 : 0xC0A80101 → adresse IP !\n\nC0 = 192\nA8 = 168\n01 = 1\n01 = 1\n\nRésultat : 192.168.1.1\n→ Les IPs sont stockées en 32 bits = 4 octets = 8 chiffres hex' },

          { type: 'h3', content: '3.2 Décimal → Hexadécimal via binaire (méthode recommandée)' },
          { type: 'p', content: 'La méthode la plus simple en pratique : convertir en binaire, puis regrouper par quartets (4 bits).' },
          { type: 'code', content: 'Exemple 1 : 219(10) → hexadécimal\n\nÉtape 1 : 219 en binaire\n128 → Oui → 1 → reste 91\n 64 → Oui → 1 → reste 27\n 32 → Non → 0\n 16 → Oui → 1 → reste 11\n  8 → Oui → 1 → reste 3\n  4 → Non → 0\n  2 → Oui → 1 → reste 1\n  1 → Oui → 1 → reste 0\n→ 11011011(2)\n\nÉtape 2 : Grouper par 4 bits (de droite à gauche)\n1101 | 1011\n\nÉtape 3 : Convertir chaque quartet\n1101 = D (8+4+1 = 13)\n1011 = B (8+2+1 = 11)\n\nRésultat : 0xDB\nVérification : (13×16) + 11 = 208+11 = 219 ✓\n\n──────────────────────────────────────────\n\nExemple 2 : 172.16.0.1 → hex (adresse RFC 1918)\n\n172 = 10101100 → 1010|1100 → A C → 0xAC\n 16 = 00010000 → 0001|0000 → 1 0 → 0x10\n  0 = 00000000 → 0000|0000 → 0 0 → 0x00\n  1 = 00000001 → 0000|0001 → 0 1 → 0x01\n\nRésultat : 0xAC100001\n→ Utile pour analyser des traces réseau Wireshark' },

          { type: 'h3', content: '3.3 Binaire ↔ Hexadécimal direct' },
          { type: 'p', content: 'La conversion binaire ↔ hex est immédiate grâce à la correspondance 4 bits = 1 chiffre hex.' },
          { type: 'code', content: 'Binaire → Hex :\n11110000 10101010 → 1111|0000 1010|1010 → F0 AA\n\nHex → Binaire :\n0xB4 → B=1011, 4=0100 → 10110100\n0xFF → F=1111, F=1111 → 11111111\n0x00 → 0=0000, 0=0000 → 00000000\n\nApplications courantes :\n0xFF   = 255 = 11111111 = masque réseau\n0xC0   = 192 = 11000000 = début plage /26\n0x80   = 128 = 10000000 = début plage /25\n0xFE   = 254 = 11111110 = avant-dernier octet\n0x0A   =  10 = 00001010 = LF (saut de ligne ASCII)\n0x1B   =  27 = 00011011 = ESC (échappement ASCII)' },

          { type: 'h3', content: '3.4 Exercices pratiques — Adresses MAC' },
          { type: 'p', content: 'Les adresses MAC (Media Access Control) sont toujours écrites en hexadécimal. Elles font 6 octets = 48 bits = 12 chiffres hex.' },
          { type: 'code', content: 'Adresse MAC : 08:00:27:AB:CD:EF\n\nDécryptage :\n08:00:27 = OUI (Organizationally Unique Identifier) → fabricant\nAB:CD:EF = NIC (Network Interface Controller) → numéro unique\n\nDétail de 08:00:27 :\n08 = 00001000 → bit 1 (bit moins significatif de l\'octet 1)\n     → 0 = adresse unicast (pas de diffusion)\n     → bit 2 = 0 = adresse globale (non locale)\n00 = 00000000\n27 = 00100111\n\n08:00:27 est l\'OUI de CADMUS COMPUTER SYSTEMS\n(utilisé par VirtualBox pour ses VMs !)\n\n→ Sur Linux : ip link show | grep ether\n→ Sur Windows : ipconfig /all → Adresse physique' },

          // ══════════════════════════════════════════
          // PARTIE 4 — ASCII ET ENCODAGES
          // ══════════════════════════════════════════
          { type: 'h2', content: '4. Encodage des Caractères — ASCII, ISO-8859, UTF-8' },
          { type: 'p', content: 'Un ordinateur ne stocke que des nombres. Pour stocker du texte, il faut une <strong>table de correspondance</strong> entre un nombre et un caractère. C\'est ce qu\'on appelle un <strong>encodage</strong>.' },

          { type: 'h3', content: '4.1 ASCII — American Standard Code for Information Interchange' },
          { type: 'p', content: 'Créé en 1963, ASCII est le premier standard d\'encodage. Il utilise 7 bits, soit 128 valeurs (0 à 127). Il couvre l\'anglais américain uniquement.' },
          { type: 'table', headers: ['Plage', 'Type', 'Contenu', 'Exemples clés'], rows: [
            ['0 – 31', 'Contrôle non imprimables', 'Commandes pour terminaux et imprimantes', 'BS(8) TAB(9) LF(10) CR(13) ESC(27)'],
            ['32', 'Espace', 'Caractère espace', 'SP = 0x20'],
            ['33 – 47', 'Ponctuation', 'Symboles spéciaux', '! " # $ % & \\\' ( ) * + , - . /'],
            ['48 – 57', 'Chiffres', '0 à 9', '\'0\'=48 \'9\'=57'],
            ['58 – 64', 'Ponctuation', 'Symboles', ': ; < = > ? @'],
            ['65 – 90', 'Majuscules', 'A à Z', '\'A\'=65 \'Z\'=90'],
            ['91 – 96', 'Ponctuation', 'Symboles', '[ \\\\ ] ^ _ `'],
            ['97 – 122', 'Minuscules', 'a à z', '\'a\'=97 \'z\'=122'],
            ['123 – 127', 'Ponctuation', 'Symboles', '{ | } ~ DEL'],
          ]},
          { type: 'info', content: '<strong>Astuce :</strong> La différence entre une majuscule et sa minuscule est toujours de 32. A=65, a=97, différence=32. B=66, b=98. Il suffit d\'activer/désactiver le bit 5 (valeur 32) pour basculer de majuscule à minuscule.' },
          { type: 'code', content: 'Exemples de conversions texte ↔ ASCII :\n\n"TSSR" en ASCII décimal : 84 83 83 82\n"TSSR" en ASCII hex     : 54 53 53 52\n"TSSR" en binaire       : 01010100 01010011 01010011 01010010\n\nDécryptage de "OK\\n" :\nO = 79 = 0x4F = 01001111\nK = 75 = 0x4B = 01001011\n\\n= 10 = 0x0A = 00001010  ← LF (Line Feed)\n\nDécryptage d\'une trame réseau Wireshark :\n48 54 54 50 2F 31 2E 31 20 32 30 30 20 4F 4B\n H  T  T  P  /  1  .  1  SP  2  0  0  SP  O  K\n→ "HTTP/1.1 200 OK" !' },

          { type: 'h3', content: '4.2 Caractères de contrôle — Les plus importants' },
          { type: 'table', headers: ['Code déc', 'Code hex', 'Abrév', 'Nom', 'Usage'], rows: [
            ['8', '0x08', 'BS', 'Backspace', 'Effacer le caractère précédent'],
            ['9', '0x09', 'HT', 'Horizontal Tab', 'Tabulation — aligne les colonnes'],
            ['10', '0x0A', 'LF', 'Line Feed', 'Saut de ligne Unix/Linux (\\n)'],
            ['13', '0x0D', 'CR', 'Carriage Return', 'Retour chariot — Windows utilise CR+LF'],
            ['27', '0x1B', 'ESC', 'Escape', 'Séquences ANSI couleur terminal'],
            ['32', '0x20', 'SP', 'Space', 'Espace — premier caractère imprimable'],
            ['127', '0x7F', 'DEL', 'Delete', 'Supprimer'],
          ]},
          { type: 'warn', content: '<strong>Problème Windows vs Linux :</strong> Windows termine les lignes par CR+LF (0x0D 0x0A = "\\r\\n"). Linux utilise seulement LF (0x0A = "\\n"). C\'est pourquoi un fichier texte Windows ouvert sous Linux peut avoir des "^M" en fin de ligne. Correction : dos2unix fichier.txt' },

          { type: 'h3', content: '4.3 ISO-8859 — Extension 8 bits' },
          { type: 'p', content: 'Pour ajouter les caractères accentués, l\'ISO a créé la famille ISO-8859. Elle utilise 8 bits (256 valeurs) : les 128 premiers sont identiques à ASCII, les 128 suivants varient selon la région.' },
          { type: 'table', headers: ['Norme', 'Région', 'Caractères ajoutés'], rows: [
            ['ISO-8859-1 (Latin-1)', 'Europe occidentale', 'é è ê ë à â ù û ü ô î ï ç'],
            ['ISO-8859-2', 'Europe centrale', 'Polonais Tchèque Hongrois...'],
            ['ISO-8859-5', 'Cyrillique', 'Russe Serbe Bulgare...'],
            ['ISO-8859-7', 'Grec', 'Alphabet grec'],
            ['ISO-8859-9', 'Turc', 'Caractères turcs'],
            ['Windows-1252', 'Windows Europe Occ.', 'Proche Latin-1 + €, guillemets typographiques'],
          ]},
          { type: 'warn', content: '<strong>Le problème des encodages multiples :</strong> Si un fichier encodé en ISO-8859-1 est lu avec ISO-8859-5, les caractères accentués deviennent du cyrillique illisible. C\'est pourquoi UTF-8 a été créé.' },

          { type: 'h3', content: '4.4 UTF-8 — La solution universelle' },
          { type: 'p', content: 'UTF-8 encode l\'intégralité du standard Unicode (plus d\'un million de caractères) en utilisant de 1 à 4 octets par caractère. Il est rétrocompatible avec ASCII : les 128 premiers caractères ont le même code.' },
          { type: 'table', headers: ['Plage Unicode', 'Octets UTF-8', 'Exemples'], rows: [
            ['U+0000 à U+007F', '1 octet', 'Tous les caractères ASCII (A, 0, espace...)'],
            ['U+0080 à U+07FF', '2 octets', 'Latin étendu, Arabe, Hébreu (é=0xC3A9)'],
            ['U+0800 à U+FFFF', '3 octets', 'Japonais, Chinois, Coréen, Grec'],
            ['U+10000 à U+10FFFF', '4 octets', 'Emojis, symboles rares, cunéiforme'],
          ]},
          { type: 'code', content: 'Encodage UTF-8 du caractère "é" (U+00E9) :\n\nCode Unicode : U+00E9 = 233 en décimal\nEn binaire   : 11101001\n\nRègle UTF-8 pour plage U+0080-U+07FF (2 octets) :\nFormat : 110xxxxx 10xxxxxx\nBits   : 11 100011 = 110 00011 10 101001\nOctets : 11000011 10101001\nHex    : C3       A9\n\n→ Le caractère "é" occupe 2 octets en UTF-8 : 0xC3 0xA9\n\nComparaison :\nASCII   : "e" = 1 octet (0x65)\nISO-8859-1 : "é" = 1 octet (0xE9)\nUTF-8   : "é" = 2 octets (0xC3 0xA9)\n\nC\'est pourquoi les chaînes UTF-8 ont un len() différent\ndu nombre de caractères affichés !' },
          { type: 'info', content: '<strong>BOM (Byte Order Mark) :</strong> Certains éditeurs Windows ajoutent les octets 0xEF 0xBB 0xBF au début d\'un fichier UTF-8. C\'est le BOM. Il peut causer des problèmes sous Linux (bash ne reconnaît pas le shebang). Pour le supprimer : <code>sed -i \'1s/^\\xEF\\xBB\\xBF//\' fichier.sh</code>' },

          // ══════════════════════════════════════════
          // PARTIE 5 — ALGÈBRE DE BOOLE
          // ══════════════════════════════════════════
          { type: 'h2', content: '5. Algèbre de Boole & Portes Logiques' },
          { type: 'p', content: 'L\'algèbre de Boole (George Boole, 1854) est le fondement mathématique de toute l\'électronique numérique. Elle manipule des variables qui ne peuvent valoir que <strong>0 (FAUX)</strong> ou <strong>1 (VRAI)</strong>.' },

          { type: 'h3', content: '5.1 Les trois opérateurs fondamentaux' },
          { type: 'table', headers: ['Opérateur', 'Symbole', 'Langage', 'Règle simple'], rows: [
            ['AND (ET)', 'A & B ou A ∧ B', 'Python: and, C: &&, Cisco: &', '1 seulement si A=1 ET B=1'],
            ['OR (OU)', 'A | B ou A ∨ B', 'Python: or, C: ||, Cisco: |', '1 dès que A=1 OU B=1'],
            ['XOR (OU exclusif)', 'A ⊕ B', 'Python: ^, C: ^', '1 seulement si A≠B'],
            ['NOT (NON)', '¬A ou !A', 'Python: not, C: !', 'Inverse : 0→1 et 1→0'],
          ]},

          { type: 'h3', content: '5.2 Tables de vérité complètes' },
          { type: 'table', headers: ['A', 'B', 'AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'], rows: [
            ['0', '0', '0', '0', '0', '1', '1', '1'],
            ['0', '1', '0', '1', '1', '1', '0', '0'],
            ['1', '0', '0', '1', '1', '1', '0', '0'],
            ['1', '1', '1', '1', '0', '0', '0', '1'],
          ]},
          { type: 'info', content: '<strong>Mémo AND :</strong> "Mon boss ET moi devons signer" → les DEUX doivent être 1.<br><strong>Mémo OR :</strong> "Mon boss OU moi peut signer" → AU MOINS UN doit être 1.<br><strong>Mémo XOR :</strong> "Exactement l\'un OU l\'autre" → EXACTEMENT UN doit être 1 (pas les deux).' },

          { type: 'h3', content: '5.3 AND et le masquage réseau' },
          { type: 'p', content: 'L\'opération AND bit à bit est utilisée partout en réseau pour isoler la partie réseau d\'une adresse IP.' },
          { type: 'code', content: 'Exemple 1 : IP 192.168.1.81 avec masque /24 (255.255.255.0)\n\nIP     : 192.168.1.81\nMasque : 255.255.255.0\n\nOctet par octet :\n192 = 11000000\n255 = 11111111\nAND = 11000000 = 192  ✓\n\n168 = 10101000\n255 = 11111111\nAND = 10101000 = 168  ✓\n\n  1 = 00000001\n255 = 11111111\nAND = 00000001 = 1    ✓\n\n 81 = 01010001\n  0 = 00000000\nAND = 00000000 = 0    ✓\n\nAdresse réseau = 192.168.1.0\n\n──────────────────────────────────────────\n\nExemple 2 : IP 10.20.30.100 avec masque /26 (255.255.255.192)\n\n100 = 01100100\n192 = 11000000\nAND = 01000000 = 64\n\nAdresse réseau = 10.20.30.64\nPlage hôtes = 10.20.30.65 → 10.20.30.126\nBroadcast = 10.20.30.127\n\n──────────────────────────────────────────\n\nPourquoi AND ?\nLà où le masque a un 1, on GARDE le bit de l\'IP.\nLà où le masque a un 0, on FORCE le bit à 0.\n→ On efface la partie hôte et on garde la partie réseau.' },

          { type: 'h3', content: '5.4 OR et la construction du broadcast' },
          { type: 'p', content: 'L\'adresse de broadcast s\'obtient en faisant OR entre l\'adresse réseau et l\'inverse du masque (wildcard mask).' },
          { type: 'code', content: 'Exemple : Réseau 192.168.1.64/26\n\nMasque      = 255.255.255.192 = 11000000 (dernier octet)\nWildcard    = NOT(masque)     = 00111111 = 63\n\nAdresse réseau dernier octet : 01000000 = 64\nWildcard                     : 00111111\nOR                           : 01111111 = 127\n\nBroadcast = 192.168.1.127\n\nVérification :\nHôtes utilisables : 192.168.1.65 → 192.168.1.126\nNombre d\'hôtes : 2^6 - 2 = 62 hôtes' },

          { type: 'h3', content: '5.5 XOR et RAID 5 — Comment ça marche vraiment' },
          { type: 'p', content: 'XOR est réversible : si A ⊕ B = P (parité), alors P ⊕ B = A et P ⊕ A = B. C\'est cette propriété mathématique qui permet de reconstruire un disque perdu dans un RAID 5.' },
          { type: 'code', content: 'Scénario RAID 5 avec 3 disques actifs :\n\nDonnées originales :\nDisque 1 : 10110100\nDisque 2 : 01101011\nParité   : 10110100 XOR 01101011 = 11011111\n\nVérification de la parité XOR :\n  10110100\n⊕ 01101011\n─────────\n  11011111  ← chaque colonne : 1 si bits différents\n\n──────────────────────────────────────────\n\nScénario : Disque 1 tombe en panne\n\nOn a encore :\nDisque 2 : 01101011\nParité   : 11011111\n\nReconstruction de Disque 1 :\nParité XOR Disque2 = Disque1\n  11011111\n⊕ 01101011\n─────────\n  10110100  ← Disque 1 reconstruit identiquement ✓\n\n──────────────────────────────────────────\n\nRègle XOR de reconstruction :\nSi P = D1 ⊕ D2 ⊕ D3\nAlors D1 = P ⊕ D2 ⊕ D3\nAlors D2 = P ⊕ D1 ⊕ D3\nAlors D3 = P ⊕ D1 ⊕ D2\n\nRAID 6 utilise deux calculs de parité différents\n(Reed-Solomon) pour tolérer 2 pannes simultanées.' },

          { type: 'h3', content: '5.6 XOR et cryptographie basique' },
          { type: 'p', content: 'XOR est aussi utilisé dans le chiffrement. Un message XOR avec une clé donne un cryptogramme. Le même XOR avec la même clé redonne le message original.' },
          { type: 'code', content: 'Chiffrement XOR simple (one-time pad) :\n\nMessage   "A"  = 65  = 01000001\nClé       0x3F = 63  = 00111111\nChiffré        = XOR = 01111110 = 126 = "~"\n\nDéchiffrement :\nChiffré   "~"  = 126 = 01111110\nClé       0x3F = 63  = 00111111\nOriginal       = XOR = 01000001 = 65 = "A" ✓\n\n→ C\'est le principe de base de nombreux algorithmes\n  de chiffrement (AES, ChaCha20, RC4).' },

          // ══════════════════════════════════════════
          // PARTIE 6 — OCTAL
          // ══════════════════════════════════════════
          { type: 'h2', content: '6. Numération Octale — Base 8' },
          { type: 'p', content: 'La base 8 utilise les chiffres 0 à 7. Elle est moins courante que l\'hex mais apparaît dans les permissions Linux (chmod) et certaines architectures.' },
          { type: 'p', content: '<strong>1 chiffre octal = exactement 3 bits</strong>.' },
          { type: 'table', headers: ['Octal', 'Binaire (3 bits)', 'Décimal'], rows: [
            ['0', '000', '0'],
            ['1', '001', '1'],
            ['2', '010', '2'],
            ['3', '011', '3'],
            ['4', '100', '4'],
            ['5', '101', '5'],
            ['6', '110', '6'],
            ['7', '111', '7'],
          ]},
          { type: 'h3', content: '6.1 Permissions Linux en octal' },
          { type: 'p', content: 'Les permissions Unix (r=4, w=2, x=1) sont en réalité des bits dans un octet. chmod 755 manipule directement ces bits.' },
          { type: 'code', content: 'Permission rwxr-xr-x (chmod 755) :\n\nProprietaire : rwx = 4+2+1 = 7 = 111 (binaire)\nGroupe       : r-x = 4+0+1 = 5 = 101 (binaire)\nAutres       : r-x = 4+0+1 = 5 = 101 (binaire)\n\nEn binaire complet : 111 101 101\nEn octal           : 7   5   5  → chmod 755\n\n──────────────────────────────────────────\n\nPermission rw-r--r-- (chmod 644) :\n\nProprietaire : rw- = 4+2+0 = 6 = 110\nGroupe       : r-- = 4+0+0 = 4 = 100\nAutres       : r-- = 4+0+0 = 4 = 100\n\nEn binaire : 110 100 100\nEn octal   : 6   4   4  → chmod 644\n\n──────────────────────────────────────────\n\nTableau de référence rapide :\n0 = --- = aucun droit\n1 = --x = exécution seule\n2 = -w- = écriture seule\n3 = -wx = écriture + exécution\n4 = r-- = lecture seule\n5 = r-x = lecture + exécution\n6 = rw- = lecture + écriture\n7 = rwx = tous les droits\n\nConventions courantes :\nchmod 644 = fichier texte (rw-r--r--)\nchmod 755 = script/répertoire (rwxr-xr-x)\nchmod 600 = clé SSH privée (rw-------)\nchmod 700 = répertoire privé (rwx------)\nchmod 777 = DANGER (tous droits pour tout le monde)' },

          // ══════════════════════════════════════════
          // PARTIE 7 — BCD ET AUTRES CODES
          // ══════════════════════════════════════════
          { type: 'h2', content: '7. Codes Spéciaux — BCD, EBCDIC, Unicode' },

          { type: 'h3', content: '7.1 BCD — Binary Coded Decimal' },
          { type: 'p', content: 'Le BCD encode chaque chiffre décimal (0-9) sur 4 bits. Il est utilisé dans les afficheurs, les horloges temps réel (RTC) et les systèmes financiers où la précision décimale est cruciale.' },
          { type: 'code', content: 'Encodage BCD du nombre 2024 :\n\n2 → 0010\n0 → 0000\n2 → 0010\n4 → 0100\n\nBCD(2024) = 0010 0000 0010 0100\n           = 4 octets (2 chiffres par octet)\n\nComparaison :\n2024 en binaire pur = 11111101000 = 11 bits\n2024 en BCD         = 0010 0000 0010 0100 = 16 bits\n→ BCD est moins compact mais évite les erreurs\n  d\'arrondi float en comptabilité\n\nRTC (Real Time Clock) :\nLes puces RTC DS1307 stockent l\'heure en BCD\n10h30m45s → 0x10 0x30 0x45\nPas 0x0A 0x1E 0x2D (hex pur)' },

          { type: 'h3', content: '7.2 EBCDIC — IBM et les mainframes' },
          { type: 'p', content: 'L\'EBCDIC (Extended Binary Coded Decimal Interchange Code) est le standard d\'encodage IBM pour mainframes. Incompatible avec ASCII — la lettre A est 0xC1 en EBCDIC au lieu de 0x41 en ASCII.' },
          { type: 'warn', content: '<strong>Piège en production :</strong> Si tu transfères un fichier entre un mainframe IBM (AS/400, z/OS) et un serveur Linux, les caractères seront illisibles sans conversion. Outil : <code>iconv -f EBCDIC-US -t UTF-8 fichier_ibm.txt</code>' },

          { type: 'h3', content: '7.3 Unicode — L\'encodage universel' },
          { type: 'p', content: 'Unicode est un standard qui attribue un point de code unique à chaque caractère de toutes les langues humaines. Ce n\'est pas un encodage — c\'est un répertoire. UTF-8, UTF-16, UTF-32 sont des encodages de ce répertoire.' },
          { type: 'table', headers: ['Encodage', 'Taille', 'BOM', 'Usage'], rows: [
            ['UTF-8', '1 à 4 octets', 'Optionnel (EF BB BF)', 'Web Linux emails — LE STANDARD'],
            ['UTF-16 LE', '2 ou 4 octets', 'FF FE', 'Windows internes Java .NET'],
            ['UTF-16 BE', '2 ou 4 octets', 'FE FF', 'Réseau protocoles'],
            ['UTF-32', '4 octets fixes', '00 00 FE FF', 'Traitement interne (mémoire)'],
          ]},
          { type: 'code', content: 'Quelques points de code Unicode importants :\n\nU+0041 = A (Latin Capital Letter A)\nU+00E9 = é (Latin Small Letter E with Acute)\nU+20AC = € (Euro Sign)\nU+2603 = ☃ (Snowman)\nU+1F600 = 😀 (Grinning Face Emoji)\nU+1F4BB = 💻 (Personal Computer Emoji)\n\nDétection de l\'encodage d\'un fichier :\nfile fichier.txt\n→ UTF-8 Unicode text\n→ ISO-8859 text\n→ ASCII text\n\nConversion avec iconv :\niconv -f ISO-8859-1 -t UTF-8 ancien.txt > nouveau.txt\niconv -l    # lister tous les encodages supportés' },

          // ══════════════════════════════════════════
          // PARTIE 8 — CAS PRATIQUES RÉELS
          // ══════════════════════════════════════════
          { type: 'h2', content: '8. Cas Pratiques — Scénarios Réels d\'Administrateur' },

          { type: 'h3', content: '8.1 Analyser une trame réseau en hex' },
          { type: 'p', content: 'En administration, tu seras amené à analyser des captures Wireshark ou des logs en hexadécimal. Voici comment décoder une réponse HTTP.' },
          { type: 'code', content: 'Dump hexadécimal d\'une réponse HTTP :\n\n48 54 54 50 2F 31 2E 31 20 32 30 30 20 4F 4B 0D\n0A 43 6F 6E 74 65 6E 74 2D 54 79 70 65 3A 20 74\n65 78 74 2F 68 74 6D 6C 0D 0A 0D 0A\n\nDécodage octet par octet :\n48=H 54=T 54=T 50=P 2F=/ 31=1 2E=. 31=1\n20=SP 32=2 30=0 30=0 20=SP 4F=O 4B=K 0D=CR\n0A=LF 43=C 6F=o 6E=n 74=t 65=e 6E=n 74=t\n2D=- 54=T 79=y 70=p 65=e 3A=: 20=SP 74=t\n65=e 78=x 74=t 2F=/ 68=h 74=t 6D=m 6C=l\n0D=CR 0A=LF 0D=CR 0A=LF\n\nRésultat :\n"HTTP/1.1 200 OK\\r\\n"\n"Content-Type: text/html\\r\\n"\n"\\r\\n"   ← ligne vide = fin des headers\n\n→ Le corps HTML suit juste après' },

          { type: 'h3', content: '8.2 Calculer un plan d\'adressage IP' },
          { type: 'code', content: 'Scénario : Entreprise avec 4 services\nRéseau disponible : 172.16.0.0/16\n\nBesoins :\n- Production    : 500 machines\n- Développement : 200 machines\n- DMZ           : 30 machines\n- Management    : 10 machines\n\nCalcul :\nProduction (500) → besoin 9 bits hôtes (2⁹=512>500)\n→ /23 (255.255.254.0) → 510 hôtes\n→ 172.16.0.0/23\n   Réseau : 172.16.0.0\n   Premier hôte : 172.16.0.1\n   Dernier hôte : 172.16.1.254\n   Broadcast : 172.16.1.255\n\nDéveloppement (200) → besoin 8 bits (2⁸=256>200)\n→ /24 (255.255.255.0) → 254 hôtes\n→ 172.16.2.0/24\n   Réseau : 172.16.2.0\n   Hôtes : .1 → .254\n   Broadcast : 172.16.2.255\n\nDMZ (30) → besoin 6 bits (2⁶=64>30)\n→ /26 (255.255.255.192) → 62 hôtes\n→ 172.16.3.0/26\n   Réseau : 172.16.3.0\n   Hôtes : .1 → .62\n   Broadcast : 172.16.3.63\n\nManagement (10) → besoin 4 bits (2⁴=16>10)\n→ /28 (255.255.255.240) → 14 hôtes\n→ 172.16.3.64/28\n   Réseau : 172.16.3.64\n   Hôtes : .65 → .78\n   Broadcast : 172.16.3.79' },

          { type: 'h3', content: '8.3 Décoder une adresse MAC et identifier le fabricant' },
          { type: 'code', content: 'Adresse MAC capturée : AC:DE:48:00:11:22\n\nOUI (3 premiers octets) : AC:DE:48\n\nConversion hex → binaire du premier octet :\nAC = 10101100\n\nBit 0 (LSB) = 0 → Unicast (adresse individuelle)\nBit 1      = 0 → Global (assignée par IEEE)\n\nBit 1 = 1 → Locally Administered Address (LAA)\n→ Adresse modifiée logiciellement (VM, VPN, spoofing)\n\nRecherche OUI :\nAC:DE:48 → PRIVATE (privé, non enregistré)\n\nOUI connus :\n00:50:56 → VMware\n08:00:27 → VirtualBox\nFA:16:3E → OpenStack (interfaces neutron)\nFE:XX:XX → Souvent interfaces bridge Linux\n\nCommandes :\nip link show | grep ether      # Linux\nGet-NetAdapter | Select MacAddress   # Windows\narp -a | grep 192.168.1.1      # Trouver MAC d\'une IP' },

          { type: 'h3', content: '8.4 Vérifier l\'encodage d\'un fichier de configuration' },
          { type: 'code', content: '# Problème courant : script bash avec BOM UTF-8\n# Symptôme : "bash: ./script.sh: /usr/bin/bash^M: bad interpreter"\n\n# Diagnostic\nfile script.sh\n→ "UTF-8 Unicode (with BOM) text, with CRLF line terminators"\n\n# Deux problèmes :\n# 1. BOM (EF BB BF) avant le shebang\n# 2. Fins de ligne Windows (CRLF au lieu de LF)\n\n# Vérification en hex\nhexdump -C script.sh | head -3\n→ ef bb bf 23 21 2f 75 73 72 2f 62 69 6e 2f 62 61\n  ^BOM^  ^ #  !  /  u  s  r  /  b  i  n  /  b  a\n\n# Correction\ndos2unix script.sh              # Supprimer CR+LF → LF\nsed -i \'1s/^\\xEF\\xBB\\xBF//\' script.sh  # Supprimer BOM\n\n# Vérification finale\nfile script.sh\n→ "Bourne-Again shell script, ASCII text executable"' },

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
    topics: ['OSI', 'TCP/IP', 'VLAN', 'Routage', 'DNS', 'DHCP', 'WiFi', 'Wireshark'],
    cours: [
      {
        id: 'modele-osi',
        titre: 'Modèle OSI & TCP/IP — Les 7 Couches',
        sections: [

          { type: 'h2', content: '1. Pourquoi un modèle en couches ?' },
          { type: 'p', content: 'Avant les années 80, chaque constructeur (IBM, DEC, HP) avait son propre protocole réseau incompatible avec les autres. L\'ISO a créé le modèle OSI en 1984 pour standardiser les communications. L\'idée : découper la communication en 7 couches indépendantes, chaque couche ne parlant qu\'avec sa voisine directe.' },
          { type: 'info', content: '<strong>Analogie :</strong> Envoyer un colis par La Poste. Tu écris une lettre (couche 7), tu la mets dans une enveloppe avec l\'adresse (couche 3), le facteur la porte physiquement (couche 1). Chaque "service" fait son job sans connaître les autres.' },

          { type: 'h2', content: '2. Les 7 couches OSI' },
          { type: 'table', headers: ['#', 'Couche', 'Rôle', 'Protocoles / Exemples', 'Unité de données'], rows: [
            ['7', 'Application', 'Interface avec l\'utilisateur final', 'HTTP FTP DNS SMTP SSH SNMP', 'Message / Données'],
            ['6', 'Présentation', 'Chiffrement encodage compression', 'TLS/SSL JPEG MPEG ASCII UTF-8', 'Message'],
            ['5', 'Session', 'Ouverture/fermeture/reprise de sessions', 'NetBIOS RPC SMB SIP', 'Message'],
            ['4', 'Transport', 'Segmentation fiabilité ports', 'TCP UDP SCTP', 'Segment (TCP) / Datagramme (UDP)'],
            ['3', 'Réseau', 'Adressage IP routage inter-réseaux', 'IP ICMP ARP OSPF BGP', 'Paquet'],
            ['2', 'Liaison', 'Adresses MAC trames accès médium', 'Ethernet Wi-Fi PPP VLAN 802.1Q', 'Trame'],
            ['1', 'Physique', 'Bits sur le support physique', 'RJ45 Fibre Coaxial Hertzien DSL', 'Bit'],
          ]},
          { type: 'info', content: '<strong>Mnémotechniques :</strong><br>1→7 : <em>Philippe Laisse Rentrer Tous Ses Petits Amis</em> (Physique Liaison Réseau Transport Session Présentation Application)<br>7→1 : <em>Alex Pète Sa Tête Rarement Le Premier</em> (Application Présentation Session Transport Réseau Liaison Physique)' },

          { type: 'h2', content: '3. Détail de chaque couche' },

          { type: 'h3', content: 'Couche 1 — Physique' },
          { type: 'p', content: 'Transmet les bits bruts (0 et 1) sur un support physique. Ne comprend pas ce que transportent les bits — juste du signal électrique, lumineux ou hertzien.' },
          { type: 'table', headers: ['Support', 'Technologie', 'Débit max', 'Distance max'], rows: [
            ['Cuivre RJ45', 'Cat5e', '1 Gbps', '100m'],
            ['Cuivre RJ45', 'Cat6a', '10 Gbps', '100m'],
            ['Fibre monomode', 'LC/SC', '100 Gbps+', '40 km+'],
            ['Fibre multimode', 'LC/SC', '10 Gbps', '550m'],
            ['WiFi 5 (802.11ac)', 'Hertzien 5 GHz', '3.5 Gbps théorique', '35m intérieur'],
            ['WiFi 6 (802.11ax)', 'Hertzien 2.4/5/6 GHz', '9.6 Gbps théorique', '30m intérieur'],
          ]},
          { type: 'code', content: '# Diagnostic Linux couche 1 :\nip link show eth0\n# → state DOWN = câble débranché ou interface down\n# → state UP = lien physique établi\n\nethtool eth0\n# → Speed: 1000Mb/s\n# → Duplex: Full\n# → Link detected: yes\n\n# Diagnostic Windows :\nGet-NetAdapter | Select-Object Name, Status, LinkSpeed' },

          { type: 'h3', content: 'Couche 2 — Liaison de données' },
          { type: 'p', content: 'Organise les bits en <strong>trames</strong> et gère l\'accès au médium partagé. Utilise les adresses <strong>MAC</strong> (48 bits) pour identifier les équipements sur un réseau local.' },
          { type: 'code', content: '# Structure d\'une trame Ethernet II :\n┌─────────────┬──────────┬──────────┬──────┬─────────┬─────┐\n│ Préambule   │ MAC Dst  │ MAC Src  │ Type │ Données │ FCS │\n│ 8 octets    │ 6 octets │ 6 octets │ 2o   │ 46-1500 │ 4o  │\n└─────────────┴──────────┴──────────┴──────┴─────────┴─────┘\n\nChamp Type :\n0x0800 = IPv4\n0x0806 = ARP\n0x86DD = IPv6\n0x8100 = VLAN (802.1Q)\n\n# Taille max d\'une trame Ethernet : 1518 octets\n# MTU (Maximum Transmission Unit) = 1500 octets\n\n# Sur Linux (table ARP = couche 2+3) :\nip neigh show\narp -n' },

          { type: 'h3', content: 'Couche 3 — Réseau' },
          { type: 'p', content: 'Gère l\'adressage logique (IP) et le routage des paquets entre réseaux différents. Un routeur travaille à la couche 3.' },
          { type: 'code', content: 'Champ Protocol dans l\'en-tête IPv4 :\n6   = TCP\n17  = UDP\n1   = ICMP\n89  = OSPF\n\nTTL (Time To Live) :\n→ Décrémenté de 1 à chaque routeur\n→ Quand TTL=0 : paquet détruit + ICMP "Time Exceeded"\n→ TTL initial : 64 (Linux) 128 (Windows) 255 (Cisco)\n\n# Voir le TTL des paquets reçus :\nping -c 1 8.8.8.8 | grep ttl\n# → ttl=115 → 128-115 = 13 sauts (Windows source)' },

          { type: 'h3', content: 'Couche 4 — Transport' },
          { type: 'table', headers: ['Critère', 'TCP', 'UDP'], rows: [
            ['Connexion', 'Orienté connexion (3-way handshake)', 'Sans connexion (connectionless)'],
            ['Fiabilité', 'Garantit la livraison (ACK + retransmission)', 'Aucune garantie'],
            ['Ordre', 'Remet les données dans l\'ordre', 'Ordre non garanti'],
            ['Vitesse', 'Plus lent (overhead de contrôle)', 'Plus rapide (pas d\'overhead)'],
            ['Usage', 'HTTP HTTPS FTP SSH SMTP', 'DNS DHCP VoIP streaming jeux'],
            ['En-tête', '20 octets minimum', '8 octets'],
          ]},
          { type: 'code', content: '# TCP 3-Way Handshake :\nClient → SYN (seq=100)           → Serveur\nClient ← SYN-ACK (seq=200,ack=101) ← Serveur\nClient → ACK (ack=201)           → Serveur\n\n# Ports courants TCP :\n20/21 FTP  22 SSH  23 Telnet  25 SMTP\n80 HTTP  443 HTTPS  3389 RDP  445 SMB\n\n# Voir les connexions TCP établies :\nss -tn state established\nnetstat -tn | grep ESTABLISHED' },

          { type: 'h3', content: 'Couches 5, 6, 7 — Session, Présentation, Application' },
          { type: 'table', headers: ['Couche', 'Rôle concret', 'Exemple réel'], rows: [
            ['Session (5)', 'Maintenir les sessions, reprendre après coupure', 'Cookies HTTP, sessions FTP, RPC calls'],
            ['Présentation (6)', 'Chiffrement, compression, encodage', 'TLS (HTTPS), compression gzip, encodage UTF-8'],
            ['Application (7)', 'Interface utilisateur et services', 'Navigateur web, client mail, client FTP'],
          ]},

          { type: 'h2', content: '4. Modèle TCP/IP vs OSI' },
          { type: 'table', headers: ['Couche TCP/IP', 'Équivalent OSI', 'Protocoles'], rows: [
            ['Application', 'OSI 5+6+7', 'HTTP FTP DNS SMTP SSH SNMP'],
            ['Transport', 'OSI 4', 'TCP UDP'],
            ['Internet', 'OSI 3', 'IP ICMP ARP'],
            ['Accès réseau', 'OSI 1+2', 'Ethernet WiFi'],
          ]},

          { type: 'h2', content: '5. Encapsulation et décapsulation' },
          { type: 'code', content: 'Encapsulation d\'une requête HTTP GET :\n\nCouche 7 (App)     : "GET /index.html HTTP/1.1"\n                         ↓ + en-tête TCP\nCouche 4 (Transport): [TCP src:52341 dst:80 | données HTTP]\n                         ↓ + en-tête IP\nCouche 3 (Réseau)  : [IP src:192.168.1.10 dst:93.184.216.34 | TCP | HTTP]\n                         ↓ + en-tête Ethernet\nCouche 2 (Liaison) : [ETH dst:AA:BB | IP | TCP | HTTP | FCS]\n                         ↓ bits électriques\nCouche 1 (Physique): 010110101001110100...' },
        ],
      },

      {
        id: 'adressage-ip',
        titre: 'Adressage IP & Sous-réseaux',
        sections: [

          { type: 'h2', content: '1. Structure d\'une adresse IPv4' },
          { type: 'code', content: 'Adresse : 192.168.1.10\n\nEn binaire :\n192     .168     .1       .10\n11000000.10101000.00000001.00001010\n\nAvec masque /24 (255.255.255.0) :\n├── Réseau : 192.168.1   (les 24 premiers bits)\n└── Hôte   : .10         (les 8 derniers bits)\n\nAdresse réseau  : 192.168.1.0    (hôte = 00000000)\nBroadcast       : 192.168.1.255  (hôte = 11111111)\nPremier hôte    : 192.168.1.1\nDernier hôte    : 192.168.1.254\nNombre d\'hôtes  : 2^8 - 2 = 254' },

          { type: 'h2', content: '2. Classes d\'adresses IPv4' },
          { type: 'table', headers: ['Classe', 'Premier octet', 'Masque défaut', 'Nb réseaux', 'Nb hôtes/réseau', 'Usage'], rows: [
            ['A', '1 – 126', '/8 (255.0.0.0)', '126', '16 777 214', 'Très grands réseaux'],
            ['B', '128 – 191', '/16 (255.255.0.0)', '16 384', '65 534', 'Grandes entreprises'],
            ['C', '192 – 223', '/24 (255.255.255.0)', '2 097 152', '254', 'Petits réseaux'],
            ['D', '224 – 239', '—', '—', '—', 'Multicast'],
            ['E', '240 – 255', '—', '—', '—', 'Expérimental réservé'],
          ]},
          { type: 'warn', content: '<strong>127.x.x.x :</strong> Réservé au loopback (127.0.0.1 = localhost). Les paquets ne sortent jamais de la machine.' },

          { type: 'h2', content: '3. Adresses privées RFC 1918' },
          { type: 'table', headers: ['Plage', 'Masque', 'CIDR', 'Nb d\'adresses', 'Usage typique'], rows: [
            ['10.0.0.0 – 10.255.255.255', '255.0.0.0', '/8', '16 777 216', 'Grandes entreprises datacenters'],
            ['172.16.0.0 – 172.31.255.255', '255.240.0.0', '/12', '1 048 576', 'Moyennes entreprises'],
            ['192.168.0.0 – 192.168.255.255', '255.255.0.0', '/16', '65 536', 'Réseaux domestiques PME'],
          ]},
          { type: 'table', headers: ['Adresse spéciale', 'Usage', 'Exemple'], rows: [
            ['0.0.0.0/0', 'Route par défaut (tout le trafic)', 'ip route 0.0.0.0 0.0.0.0 192.168.1.1'],
            ['127.0.0.1', 'Loopback local', 'ping 127.0.0.1 (teste la pile TCP/IP)'],
            ['169.254.0.0/16', 'APIPA (auto-configuration sans DHCP)', 'Windows sans DHCP → 169.254.x.x'],
            ['255.255.255.255', 'Broadcast limité (tout le réseau local)', 'DHCP Discover utilise cette adresse'],
          ]},

          { type: 'h2', content: '4. CIDR et calcul de sous-réseaux' },
          { type: 'table', headers: ['CIDR', 'Masque', 'Hôtes utilisables', 'Taille bloc', 'Usage typique'], rows: [
            ['/30', '255.255.255.252', '2', '4', 'Lien point-à-point (routeurs)'],
            ['/29', '255.255.255.248', '6', '8', 'Petite salle serveurs'],
            ['/28', '255.255.255.240', '14', '16', 'Petit bureau'],
            ['/27', '255.255.255.224', '30', '32', 'Bureau moyen'],
            ['/26', '255.255.255.192', '62', '64', 'Grand bureau'],
            ['/25', '255.255.255.128', '126', '128', 'Département'],
            ['/24', '255.255.255.0', '254', '256', 'LAN classique'],
            ['/23', '255.255.254.0', '510', '512', 'Gros LAN'],
            ['/22', '255.255.252.0', '1022', '1024', 'Campus'],
            ['/16', '255.255.0.0', '65534', '65536', 'Très grand réseau'],
          ]},
          { type: 'code', content: '# VLSM — découper 10.0.0.0/24 pour 4 services\n\n# Marketing (60) → /26 = 62 hôtes\nRéseau  : 10.0.0.0/26   | Hôtes : .1 → .62    | BC : .63\n\n# Informatique (25) → /27 = 30 hôtes\nRéseau  : 10.0.0.64/27  | Hôtes : .65 → .94   | BC : .95\n\n# Direction (10) → /28 = 14 hôtes\nRéseau  : 10.0.0.96/28  | Hôtes : .97 → .110  | BC : .111\n\n# Serveurs (5) → /29 = 6 hôtes\nRéseau  : 10.0.0.112/29 | Hôtes : .113 → .118 | BC : .119\n\n# Vérification Linux :\nipcalc 10.0.0.0/26' },

          { type: 'h2', content: '5. NAT — Network Address Translation' },
          { type: 'code', content: '# Fonctionnement du NAT PAT (Port Address Translation)\n# Réseau interne : 192.168.1.0/24\n# IP publique    : 203.0.113.1\n\n# Table NAT du routeur :\n┌──────────────────┬──────────────────┬───────────────────┐\n│ IP privée:port   │ IP pub:port      │ IP dst:port       │\n├──────────────────┼──────────────────┼───────────────────┤\n│ 192.168.1.10:    │ 203.0.113.1:     │ 142.250.74.46:443 │\n│ 54231            │ 54231            │                   │\n└──────────────────┴──────────────────┴───────────────────┘\n\n# Configuration NAT sur Linux (iptables)\niptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\necho 1 > /proc/sys/net/ipv4/ip_forward' },
        ],
      },

      {
        id: 'protocoles-essentiels',
        titre: 'Protocoles Réseau Essentiels',
        sections: [

          { type: 'h2', content: '1. ARP — Address Resolution Protocol' },
          { type: 'code', content: '# Processus ARP complet :\n\n# PC-A (192.168.1.10) veut envoyer un paquet à PC-B (192.168.1.20)\n# → Broadcast : "Qui a 192.168.1.20 ? Répondez à AA:BB:CC:11:22:33"\n# → PC-B répond en unicast : "192.168.1.20 est à DD:EE:FF:44:55:66"\n# → PC-A met à jour son cache ARP (durée ~20 min Linux / ~2 min Win)\n\n# Si la destination est sur un autre réseau :\n# → PC-A fait ARP pour la PASSERELLE, pas pour la destination !\n\n# Commandes ARP :\nip neigh show                    # Linux : table ARP\narp -n                           # Linux (ancien)\nip neigh flush all               # Vider le cache\nGet-NetNeighbor                  # Windows PowerShell' },
          { type: 'warn', content: '<strong>ARP Spoofing :</strong> Un attaquant envoie de fausses réponses ARP pour se faire passer pour la passerelle → man-in-the-middle. Protection : ARP Inspection dynamique sur les switches managés.' },

          { type: 'h2', content: '2. ICMP — Internet Control Message Protocol' },
          { type: 'table', headers: ['Type ICMP', 'Code', 'Message', 'Cause courante'], rows: [
            ['0', '0', 'Echo Reply', 'Réponse à un ping'],
            ['3', '0', 'Destination Network Unreachable', 'Pas de route vers le réseau'],
            ['3', '1', 'Destination Host Unreachable', 'ARP sans réponse — hôte éteint'],
            ['3', '3', 'Destination Port Unreachable', 'Port fermé — service arrêté (UDP)'],
            ['8', '0', 'Echo Request', 'Ping envoyé'],
            ['11', '0', 'Time Exceeded (TTL=0)', 'Utilisé par traceroute'],
          ]},
          { type: 'code', content: '# Ping avancé :\nping -c 4 8.8.8.8              # 4 paquets\nping -s 1400 8.8.8.8           # Payload 1400 octets\nping -M do -s 1472 8.8.8.8     # Ne pas fragmenter (test MTU)\n\n# Traceroute — envoie TTL=1,2,3... chaque routeur répond "Time Exceeded"\ntraceroute 8.8.8.8             # Linux (UDP)\ntraceroute -I 8.8.8.8          # Linux (ICMP)\ntracert 8.8.8.8                # Windows\n\n# Exemple de sortie :\n1  192.168.1.1    1.2ms   # Box locale\n2  10.0.0.1       5.3ms   # Routeur FAI\n3  213.245.254.1  8.1ms   # Backbone FAI\n5  8.8.8.8       16.2ms   # Destination' },

          { type: 'h2', content: '3. DNS — Domain Name System' },
          { type: 'table', headers: ['Type', 'Rôle', 'Exemple'], rows: [
            ['A', 'Nom → IPv4', 'www.tssr.local → 192.168.1.10'],
            ['AAAA', 'Nom → IPv6', 'www.tssr.local → 2001:db8::1'],
            ['CNAME', 'Alias vers un autre nom', 'mail.tssr.local → srv-mail.tssr.local'],
            ['MX', 'Serveur de messagerie', 'tssr.local → 10 mail.tssr.local'],
            ['PTR', 'IP → Nom (DNS inversé)', '10.1.168.192.in-addr.arpa → srv01'],
            ['NS', 'Serveurs DNS du domaine', 'tssr.local NS → dns1.tssr.local'],
            ['TXT', 'Texte libre (SPF DKIM DMARC)', 'v=spf1 ip4:192.168.1.10 ~all'],
            ['SRV', 'Localisation de services', '_ldap._tcp.tssr.local 389'],
          ]},
          { type: 'code', content: '# Résolution DNS : cache hosts → résolveur OS → serveurs racines → TLD → autoritaire\n\ncat /etc/resolv.conf        # Serveur DNS utilisé\ncat /etc/hosts              # Fichier hosts local (priorité max)\n\n# Diagnostic DNS :\nnslookup www.google.com           # Simple\ndig www.google.com A              # Détaillé\ndig +short www.google.com         # IP uniquement\ndig +trace www.google.com         # Résolution pas à pas\ndig -x 8.8.8.8                   # DNS inversé\ndig @8.8.8.8 www.google.com       # Via DNS spécifique\n\n# Vider le cache DNS :\nsystemd-resolve --flush-caches    # Linux\nipconfig /flushdns                # Windows' },

          { type: 'h2', content: '4. DHCP — Dynamic Host Configuration Protocol' },
          { type: 'code', content: '# Les 4 étapes DORA :\n\nD — DISCOVER  : broadcast 255.255.255.255 "Y a-t-il un serveur DHCP ?"\nO — OFFER     : serveur propose IP + masque + GW + DNS + durée de bail\nR — REQUEST   : client accepte et demande officiellement (broadcast)\nA — ACKNOWLEDGE : serveur confirme le bail\n\n# Options DHCP importantes :\n# Option 1  : Masque de sous-réseau\n# Option 3  : Routeur (passerelle)\n# Option 6  : Serveurs DNS\n# Option 51 : Durée du bail (lease time)\n# Option 66 : Serveur TFTP (boot PXE)\n\n# Renouvellement DHCP :\ndhclient -r eth0 && dhclient eth0    # Linux\nipconfig /release && ipconfig /renew  # Windows' },

          { type: 'h2', content: '5. HTTP & HTTPS' },
          { type: 'table', headers: ['Code HTTP', 'Catégorie', 'Signification', 'Cause courante'], rows: [
            ['200', 'Succès', 'OK', 'Tout va bien'],
            ['301', 'Redirection', 'Moved Permanently', 'HTTP → HTTPS, changement URL permanent'],
            ['304', 'Redirection', 'Not Modified', 'Cache navigateur valide'],
            ['400', 'Erreur client', 'Bad Request', 'Requête mal formée'],
            ['401', 'Erreur client', 'Unauthorized', 'Authentification requise'],
            ['403', 'Erreur client', 'Forbidden', 'Authentifié mais pas autorisé'],
            ['404', 'Erreur client', 'Not Found', 'Page supprimée ou URL incorrecte'],
            ['429', 'Erreur client', 'Too Many Requests', 'Rate limiting'],
            ['500', 'Erreur serveur', 'Internal Server Error', 'Bug applicatif'],
            ['502', 'Erreur serveur', 'Bad Gateway', 'Reverse proxy ne joint pas le backend'],
            ['503', 'Erreur serveur', 'Service Unavailable', 'Serveur surchargé ou maintenance'],
            ['504', 'Erreur serveur', 'Gateway Timeout', 'Backend trop lent'],
          ]},
          { type: 'code', content: '# Analyser les headers HTTP avec curl :\ncurl -I https://www.google.com          # Headers seulement\ncurl -v https://www.google.com          # Tout le détail TLS+HTTP\ncurl -X POST -d \'{"user":"admin"}\' -H "Content-Type: application/json" https://api.exemple.com/login\n\n# Table des ports essentiels :\n20/21 FTP  22 SSH  25 SMTP  53 DNS  67/68 DHCP\n80 HTTP  110 POP3  143 IMAP  443 HTTPS  445 SMB\n161 SNMP  389 LDAP  3389 RDP  3306 MySQL  5432 PostgreSQL' },
        ],
      },

      {
        id: 'vlan-switching',
        titre: 'VLAN, Switching et Architecture LAN',
        sections: [

          { type: 'h2', content: '1. Domaines de collision et de broadcast' },
          { type: 'table', headers: ['Équipement', 'Domaine de collision', 'Domaine de broadcast', 'Couche OSI'], rows: [
            ['Hub', '1 pour tous les ports', '1 pour tous les ports', 'L1'],
            ['Switch', '1 par port', '1 pour tout le switch', 'L2'],
            ['Switch + VLAN', '1 par port', '1 par VLAN', 'L2'],
            ['Routeur', '1 par interface', '1 par interface', 'L3'],
          ]},

          { type: 'h2', content: '2. VLAN — Virtual Local Area Network' },
          { type: 'code', content: '# Pourquoi des VLANs ?\n# SÉCURITÉ : isoler les services\n#   VLAN 10 = Comptabilité  VLAN 20 = IT  VLAN 30 = Invités  VLAN 99 = Management\n# PERFORMANCE : réduire les broadcasts\n# FLEXIBILITÉ : logique ≠ physique\n\n# Configuration VLAN sur Cisco IOS :\nSwitch(config)# vlan 10\nSwitch(config-vlan)# name VLAN-Comptabilite\n\n# Assigner un port (mode access) :\nSwitch(config)# interface FastEthernet0/1\nSwitch(config-if)# switchport mode access\nSwitch(config-if)# switchport access vlan 10\n\n# Vérifier :\nSwitch# show vlan brief\nSwitch# show interfaces FastEthernet0/1 switchport' },

          { type: 'h2', content: '3. Trunk 802.1Q — Transport multi-VLAN' },
          { type: 'code', content: '# Structure d\'une trame 802.1Q :\n┌─────────┬──────────┬──────────┬────────┬──────────┬───────┐\n│Préambule│ MAC Dst  │ MAC Src  │ 0x8100 │ TCI/VLAN │ Type  │\n└─────────┴──────────┴──────────┴────────┴──────────┴───────┘\n# VLAN ID sur 12 bits = 4096 VLANs (0–4095)\n\n# Configuration trunk Cisco :\nSwitch(config)# interface GigabitEthernet0/1\nSwitch(config-if)# switchport mode trunk\nSwitch(config-if)# switchport trunk native vlan 99\nSwitch(config-if)# switchport trunk allowed vlan 10,20,30,99\n\nSwitch# show interfaces trunk' },

          { type: 'h2', content: '4. Routage inter-VLAN' },
          { type: 'code', content: '# Méthode 1 : Router-on-a-Stick\n# Sous-interfaces sur le routeur, une par VLAN\n\nRouter(config)# interface GigabitEthernet0/0.10\nRouter(config-subif)# encapsulation dot1Q 10\nRouter(config-subif)# ip address 192.168.10.1 255.255.255.0\n\nRouter(config)# interface GigabitEthernet0/0.20\nRouter(config-subif)# encapsulation dot1Q 20\nRouter(config-subif)# ip address 192.168.20.1 255.255.255.0\n\n# Méthode 2 : Switch Layer 3 (plus performant)\nSwitch-L3(config)# ip routing\nSwitch-L3(config)# interface vlan 10\nSwitch-L3(config-if)# ip address 192.168.10.1 255.255.255.0\nSwitch-L3(config-if)# no shutdown' },

          { type: 'h2', content: '5. Spanning Tree Protocol — STP' },
          { type: 'code', content: '# STP empêche les boucles en bloquant les liens redondants\n\n# Élection du Root Bridge : plus petit Bridge ID (Priorité + MAC)\n# Priorité par défaut = 32768\n# Coût selon débit : 10M=100 100M=19 1G=4 10G=2\n\n# États des ports STP :\n# Blocking → Listening (15s) → Learning (15s) → Forwarding\n# Convergence STP classique : ~30-50s\n# Convergence RSTP (802.1w) : ~1-2s\n\n# Config Cisco :\nSwitch(config)# spanning-tree vlan 10 root primary\nSwitch(config)# spanning-tree mode rapid-pvst    # RSTP (recommandé)\n\n# PortFast pour les ports PC (passe direct en Forwarding) :\nSwitch(config-if)# spanning-tree portfast\nSwitch(config-if)# spanning-tree bpduguard enable\n\nSwitch# show spanning-tree' },
        ],
      },

      {
        id: 'wifi-securite',
        titre: 'WiFi — Standards, Configuration et Sécurité',
        sections: [

          { type: 'h2', content: '1. Les standards WiFi' },
          { type: 'table', headers: ['Standard', 'Nom commercial', 'Fréquence(s)', 'Débit max théorique', 'Portée indoor', 'Année'], rows: [
            ['802.11b', 'WiFi 1', '2.4 GHz', '11 Mbps', '35m', '1999'],
            ['802.11g', 'WiFi 3', '2.4 GHz', '54 Mbps', '38m', '2003'],
            ['802.11n', 'WiFi 4', '2.4 / 5 GHz', '600 Mbps', '70m', '2009'],
            ['802.11ac', 'WiFi 5', '5 GHz', '3.5 Gbps', '35m', '2013'],
            ['802.11ax', 'WiFi 6', '2.4 / 5 / 6 GHz', '9.6 Gbps', '30m', '2019'],
            ['802.11be', 'WiFi 7', '2.4 / 5 / 6 GHz', '46 Gbps', '30m', '2024'],
          ]},
          { type: 'warn', content: '<strong>Débits théoriques vs réels :</strong> En pratique, divise par 3 à 10. WiFi 5 annoncé à 3.5 Gbps → réel ~400-600 Mbps dans de bonnes conditions.' },

          { type: 'h2', content: '2. Fréquences et canaux' },
          { type: 'code', content: '# Bande 2.4 GHz — 13 canaux en Europe\n# Seuls les canaux 1, 6, 11 ne se chevauchent PAS\n# Canal 1  : 2.412 GHz\n# Canal 6  : 2.437 GHz\n# Canal 11 : 2.462 GHz\n\n# Bande 5 GHz — beaucoup plus de canaux non-chevauchants\n# Canaux DFS partagés avec radars (scan jusqu\'à 60s)\n\n# Bande 6 GHz (WiFi 6E) — 59 canaux de 20 MHz, très peu d\'interférences\n\n# Scanner les réseaux WiFi :\nsudo iw dev wlan0 scan | grep -E "SSID|signal|freq|channel"\nnmcli device wifi list\niwconfig wlan0' },

          { type: 'h2', content: '3. Sécurité WiFi' },
          { type: 'table', headers: ['Protocole', 'Chiffrement', 'Authentification', 'Vulnérabilités', 'Statut'], rows: [
            ['WEP', 'RC4 40/104 bits', 'Clé partagée', 'Cracké en < 1 minute', 'INTERDIT'],
            ['WPA-TKIP', 'RC4 + TKIP', 'PSK', 'Attaque TKIP Michael', 'Obsolète'],
            ['WPA2-Personal', 'AES-CCMP 128 bits', 'PSK', 'Attaque dictionnaire sur le handshake', 'Acceptable si MDP fort'],
            ['WPA2-Enterprise', 'AES-CCMP 128 bits', '802.1X + RADIUS', 'Très sécurisé', 'Recommandé entreprise'],
            ['WPA3-Personal', 'AES-GCMP 128 bits', 'SAE', 'Résistant au brute force offline', 'Recommandé'],
            ['WPA3-Enterprise', 'AES-GCMP 256 bits', '802.1X + Suite B', 'Niveau gouvernemental', 'Haute sécurité'],
          ]},
          { type: 'code', content: '# WPA2-Enterprise avec RADIUS :\n# Chaque utilisateur a ses propres credentials AD\n# Révocation immédiate d\'un compte compromis\n# Logs d\'accès par utilisateur\n# Config client : SSID → WPA2-Enterprise → EAP-PEAP → identifiant AD\n\n# Désactiver WPS (vulnérable brute force PIN) !\n# Client Isolation sur le WiFi guest (clients ne se voient pas)' },

          { type: 'h2', content: '4. Architecture WiFi entreprise' },
          { type: 'code', content: '# 1. AP autonome (standalone) — OK pour 1-3 APs\n# 2. Contrôleur WiFi (WLC) — roaming transparent, gestion centralisée\n#    Exemples : Cisco WLC, Aruba Mobility Controller\n# 3. Cloud WiFi — Cisco Meraki, Ubiquiti UniFi, Aruba Central\n\n# Placement des APs :\n# Recouvrement recommandé : 15-20% entre cellules\n# Puissance TX basse = moins d\'interférences entre APs\n# 1 AP pour 20-30 utilisateurs actifs (bureaux)\n# 1 AP pour 100-200 utilisateurs passifs (amphi)' },
        ],
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
        id: 'linux-fondamentaux',
        titre: 'Linux — Fondamentaux et Philosophie',
        sections: [

          { type: 'h2', content: '1. Qu\'est-ce que Linux ?' },
          { type: 'p', content: 'Linux est un <strong>noyau</strong> (kernel) créé par Linus Torvalds en 1991. Ce que l\'on appelle communément "Linux" est en réalité un assemblage : <strong>Noyau Linux + Outils GNU + Environnement</strong>. C\'est pourquoi on devrait dire GNU/Linux.' },
          { type: 'table', headers: ['Composant', 'Rôle', 'Exemple'], rows: [
            ['Noyau (Kernel)', 'Gère le matériel, la mémoire, les processus', 'linux-6.1.0'],
            ['Shell', 'Interface entre l\'utilisateur et le noyau', 'bash zsh fish'],
            ['Outils GNU', 'Commandes de base (ls cp mv grep...)', 'coreutils binutils'],
            ['Gestionnaire de paquets', 'Installe/met à jour les logiciels', 'apt (Debian) yum (RHEL)'],
            ['Init système', 'Premier processus (PID 1), démarre les services', 'systemd (moderne)'],
            ['Bibliothèques système', 'Code partagé entre les programmes', 'glibc'],
          ]},

          { type: 'h2', content: '2. Les distributions Linux' },
          { type: 'table', headers: ['Distribution', 'Base', 'Gestionnaire paquets', 'Usage', 'Certifications'], rows: [
            ['Debian', 'Debian', 'apt/dpkg', 'Serveurs stables', 'LPIC'],
            ['Ubuntu Server', 'Debian', 'apt/dpkg', 'Serveurs cloud débutants', 'LPIC Ubuntu'],
            ['Red Hat Enterprise (RHEL)', 'RHEL', 'dnf/rpm', 'Entreprises support payant', 'RHCE RHCSA'],
            ['AlmaLinux / Rocky', 'RHEL compatible', 'dnf/rpm', 'Alternative RHEL gratuite', 'RHCSA'],
            ['CentOS Stream', 'RHEL upstream', 'dnf/rpm', 'Test avant RHEL', '—'],
            ['openSUSE', 'SUSE', 'zypper/rpm', 'Entreprises Europe', 'SUSE CLA'],
            ['Kali Linux', 'Debian', 'apt/dpkg', 'Tests de pénétration', 'OSCP'],
          ]},
          { type: 'info', content: '<strong>Pour le TSSR :</strong> Debian est la distribution de référence. Les commandes sont identiques sur Ubuntu. Les concepts sont transposables sur RHEL/CentOS avec quelques différences (dnf au lieu d\'apt, firewalld au lieu d\'ufw).' },

          { type: 'h2', content: '3. L\'arborescence Linux (FHS)' },
          { type: 'p', content: 'Le Filesystem Hierarchy Standard définit où chaque type de fichier doit être placé. Contrairement à Windows (C:\\, D:\\), Linux a une seule racine : <strong>/</strong>' },
          { type: 'table', headers: ['Répertoire', 'Contenu', 'Exemples de fichiers'], rows: [
            ['/', 'Racine — point de départ de tout', '—'],
            ['/etc', 'Fichiers de configuration système', '/etc/passwd /etc/ssh/sshd_config /etc/hosts'],
            ['/home', 'Répertoires personnels des utilisateurs', '/home/anthony /home/marie'],
            ['/root', 'Répertoire personnel de root', '~root'],
            ['/var', 'Données variables (logs, BDD, mails, web)', '/var/log /var/www /var/lib/mysql'],
            ['/tmp', 'Fichiers temporaires (vidé au démarrage)', 'Fichiers de session upload'],
            ['/usr', 'Programmes et données utilisateurs', '/usr/bin /usr/lib /usr/share'],
            ['/bin', 'Commandes essentielles', 'ls cp mv grep bash'],
            ['/sbin', 'Commandes système (root)', 'fdisk iptables reboot'],
            ['/lib', 'Bibliothèques partagées', 'glibc.so libc.so'],
            ['/dev', 'Fichiers de périphériques', '/dev/sda /dev/null /dev/random'],
            ['/proc', 'Système de fichiers virtuel (info noyau)', '/proc/cpuinfo /proc/meminfo /proc/net'],
            ['/sys', 'Système de fichiers virtuel (matériel)', '/sys/class/net /sys/block'],
            ['/mnt', 'Points de montage temporaires', 'Disques USB montés manuellement'],
            ['/media', 'Points de montage automatiques', 'CD-ROM clés USB'],
            ['/opt', 'Logiciels optionnels tiers', '/opt/google /opt/vmware'],
            ['/boot', 'Noyau et bootloader', '/boot/vmlinuz /boot/grub'],
          ]},
          { type: 'code', content: '# Tout est fichier sous Linux — même les périphériques !\nls /dev/\n# sda        → Premier disque dur SCSI/SATA\n# sda1       → Première partition de sda\n# sdb        → Deuxième disque\n# nvme0n1    → SSD NVMe\n# nvme0n1p1  → Première partition NVMe\n# tty0       → Terminal console\n# ttyS0      → Port série COM1\n# null       → Trou noir (jeter des données)\n# zero       → Source de zéros infinie\n# random     → Générateur de nombres aléatoires\n# urandom    → Générateur aléatoire non-bloquant\n\n# Exemples d\'utilisation des fichiers spéciaux :\ncat /dev/null                          # Fichier vide\ndd if=/dev/zero of=/tmp/test bs=1M count=100   # Créer un fichier de 100Mo\njournalctl > /dev/null 2>&1            # Jeter toute la sortie' },

          { type: 'h2', content: '4. Utilisateurs et permissions — Concepts fondamentaux' },
          { type: 'p', content: 'Linux est un système multi-utilisateurs. Chaque fichier appartient à un <strong>utilisateur</strong> et un <strong>groupe</strong>. Les permissions définissent qui peut faire quoi.' },
          { type: 'code', content: '# Structure des permissions :\n# -rwxr-xr-- 1 anthony admins 4096 Jan 4 10:00 script.sh\n#  │││││││││\n#  ││││││││└── Autres (others) : r-- = lecture seule\n#  │││││││\n#  ││││││└──── Groupe (group)  : r-x = lecture + exécution\n#  │││││\n#  ││││└────── Propriétaire    : rwx = tous droits\n#  │││\n#  ││└──────── Type (- fichier, d répertoire, l lien, b bloc, c caractère)\n#  │\n#  └────────── Premier caractère = type de fichier\n\n# Valeurs numériques :\n# r = 4 (lecture)\n# w = 2 (écriture)\n# x = 1 (exécution)\n\n# Calcul chmod :\n# rwx = 4+2+1 = 7\n# rw- = 4+2+0 = 6\n# r-x = 4+0+1 = 5\n# r-- = 4+0+0 = 4\n# --- = 0+0+0 = 0\n\n# Exemples communs :\n# chmod 755 script.sh   → rwxr-xr-x (script exécutable)\n# chmod 644 config.txt  → rw-r--r-- (fichier config)\n# chmod 600 ~/.ssh/id_rsa → rw------- (clé SSH privée)\n# chmod 700 ~/.ssh/     → rwx------ (répertoire SSH)\n# chmod 777 /tmp/test   → DANGER — tout le monde peut tout faire\n\n# Permissions spéciales :\n# SetUID (4000) : exécute avec les droits du propriétaire\n# chmod 4755 programme → rwsr-xr-x\n# Exemple : /usr/bin/passwd (modifie /etc/shadow en root)\n\n# SetGID (2000) : exécute avec les droits du groupe\n# chmod 2755 programme → rwxr-sr-x\n# Sur répertoire : les nouveaux fichiers héritent du groupe\n\n# Sticky bit (1000) : seul le proprio peut supprimer\n# chmod 1777 /tmp → drwxrwxrwt\n# Exemple : /tmp est world-writable mais chacun protège ses fichiers' },
        ],
      },

      {
        id: 'commandes-linux',
        titre: 'Commandes Linux Essentielles',
        sections: [

          { type: 'h2', content: '1. Navigation et exploration' },
          { type: 'code', content: '# pwd — Print Working Directory\npwd\n# /home/anthony\n\n# ls — List directory contents\nls                    # Fichiers et répertoires\nls -l                 # Format long (permissions taille date)\nls -la                # Long + fichiers cachés (commençant par .)\nls -lh                # Long + tailles lisibles (Ko Mo Go)\nls -lt                # Long + tri par date (plus récent en premier)\nls -lS                # Long + tri par taille (plus grand en premier)\nls -lR                # Récursif (affiche tous les sous-répertoires)\nls -d */              # Répertoires seulement\nls *.log              # Seulement les .log (glob)\n\n# cd — Change Directory\ncd /etc               # Chemin absolu\ncd Documents          # Chemin relatif\ncd ..                 # Remonter d\'un niveau\ncd ../..              # Remonter de deux niveaux\ncd ~                  # Aller dans le home\ncd -                  # Retourner au répertoire précédent\ncd /                  # Aller à la racine\n\n# find — Recherche de fichiers\nfind / -name "passwd"                    # Chercher par nom\nfind /etc -name "*.conf"                 # Tous les .conf dans /etc\nfind /var/log -name "*.log" -mtime -7    # Modifiés ces 7 derniers jours\nfind / -user anthony                     # Fichiers de l\'utilisateur anthony\nfind / -perm 777                         # Fichiers avec perms 777 (dangereux !)\nfind /tmp -size +100M                    # Fichiers > 100 Mo\nfind / -type l                           # Liens symboliques\nfind /var/log -name "*.log" -exec ls -lh {} \\;  # Exécuter ls sur chaque résultat\nfind / -name "*.sh" -exec chmod +x {} \\;        # Rendre tous les .sh exécutables\n\n# which / whereis — Trouver un exécutable\nwhich python3          # /usr/bin/python3\nwhereis ssh            # ssh: /usr/bin/ssh /etc/ssh /usr/share/man/man1/ssh.1.gz' },

          { type: 'h2', content: '2. Gestion des fichiers et répertoires' },
          { type: 'code', content: '# mkdir — Créer un répertoire\nmkdir projet                        # Simple\nmkdir -p projet/src/lib/utils       # Avec parents (-p)\nmkdir -m 750 confidentiel           # Avec permissions spécifiques\n\n# touch — Créer un fichier vide / mettre à jour la date\ntouch fichier.txt\ntouch -t 202401041200 fichier.txt   # Définir une date précise\n\n# cp — Copier\ncp source.txt dest.txt              # Copier un fichier\ncp -r dossier/ copie/               # Copier un répertoire (-r récursif)\ncp -p source.txt dest.txt           # Préserver les attributs (date perms)\ncp -a dossier/ copie/               # Archive = -r -p + liens symboliques\ncp -u source.txt dest.txt           # Copier seulement si source plus récente\n\n# mv — Déplacer / Renommer\nmv ancien.txt nouveau.txt           # Renommer\nmv fichier.txt /tmp/                # Déplacer\nmv -i source.txt dest.txt           # Demander confirmation si existe\n\n# rm — Supprimer\nrm fichier.txt                      # Supprimer un fichier\nrm -r dossier/                      # Supprimer un répertoire et son contenu\nrm -rf dossier/                     # Forcer (sans confirmation)\nrm -i fichier.txt                   # Demander confirmation\n\n# DANGER : ces commandes sont IRRÉVERSIBLES\n# rm -rf /        → Détruit tout le système !\n# Toujours vérifier avant rm -rf\n\n# ln — Liens\nln -s /etc/nginx/sites-available/tssr.conf /etc/nginx/sites-enabled/\n# Lien symbolique (soft link) = raccourci\n\nln /etc/hosts /tmp/hosts_backup\n# Lien physique (hard link) = même fichier, deux noms' },

          { type: 'h2', content: '3. Affichage et manipulation de fichiers texte' },
          { type: 'code', content: '# cat — Afficher le contenu\ncat /etc/passwd\ncat -n fichier.txt          # Avec numéros de lignes\n\n# less — Affichage paginé\nless /var/log/syslog        # q=quitter /motif=chercher n=suivant G=fin\n\n# head / tail — Début / fin de fichier\nhead /etc/passwd            # 10 premières lignes (défaut)\nhead -n 20 /var/log/syslog  # 20 premières lignes\ntail /var/log/syslog        # 10 dernières lignes\ntail -n 50 /var/log/syslog  # 50 dernières lignes\ntail -f /var/log/syslog     # Suivi en temps réel (Ctrl+C pour arrêter)\n\n# grep — Recherche dans du texte\ngrep "error" /var/log/syslog               # Lignes contenant "error"\ngrep -i "error" /var/log/syslog            # Insensible à la casse\ngrep -n "error" /var/log/syslog            # Avec numéros de ligne\ngrep -v "DEBUG" /var/log/app.log           # Lignes NE contenant PAS "DEBUG"\ngrep -r "password" /etc/                   # Récursif dans /etc\ngrep -c "error" /var/log/syslog            # Compter les occurrences\ngrep -A 3 "error" logfile                  # 3 lignes APRÈS la correspondance\ngrep -B 3 "error" logfile                  # 3 lignes AVANT\ngrep -E "error|warning|critical" logfile   # Regex étendue (OU)\ngrep "^root" /etc/passwd                   # Commence par "root"\ngrep "bash$" /etc/passwd                   # Finit par "bash"\n\n# Exemples pratiques grep :\ngrep "Failed password" /var/log/auth.log   # Tentatives SSH échouées\ngrep "Accepted password" /var/log/auth.log # Connexions SSH réussies\n\n# wc / sort / uniq / cut / sed / awk\nwc -l /etc/passwd                          # Nombre de lignes\nsort -t: -k 3 -n /etc/passwd              # Trier par UID\nsort fichier.txt | uniq -c | sort -rn     # Compter occurrences\ncut -d: -f1 /etc/passwd                   # Extraire colonne 1\nsed -i \'s/ancien/nouveau/g\' fichier.txt   # Remplacer en place\nawk -F: \'{print $1, $3}\' /etc/passwd       # Champs 1 et 3' },

          { type: 'h2', content: '4. Redirections et pipes' },
          { type: 'code', content: '# Les 3 flux standard :\n# stdin  (0) : entrée standard (clavier par défaut)\n# stdout (1) : sortie standard (terminal par défaut)\n# stderr (2) : sortie d\'erreur (terminal par défaut)\n\n# Redirections :\ncommande > fichier          # Redirige stdout vers fichier (écrase)\ncommande >> fichier         # Redirige stdout vers fichier (ajoute)\ncommande 2> erreur.txt      # Redirige stderr vers fichier\ncommande > fichier 2>&1     # Redirige stdout ET stderr vers fichier\ncommande 2>/dev/null        # Jeter les erreurs (trou noir)\ncommande > /dev/null 2>&1   # Jeter TOUT (stdout + stderr)\n\n# Pipes — chaîner les commandes\ncat /etc/passwd | grep -v "#" | cut -d: -f1 | sort\n# → Afficher tous les utilisateurs triés alphabétiquement\n\nps aux | grep apache | grep -v grep\n# → Trouver les processus apache sans afficher grep lui-même\n\ndf -h | grep -v tmpfs | sort -k5 -rn\n# → Espace disque trié par utilisation (% décroissant)\n\ndu -sh /var/log/* | sort -rh | head -10\n# → Les 10 plus gros fichiers/dossiers dans /var/log\n\ncat /var/log/auth.log | grep "Failed password" | awk \'{print $11}\' | sort | uniq -c | sort -rn | head -10\n# → Top 10 des IPs avec le plus de tentatives SSH échouées\n\n# tee — Afficher ET écrire dans un fichier\ncommande | tee fichier.txt              # Affiche ET écrit\ncommande | tee -a fichier.txt           # Affiche ET ajoute' },

          { type: 'h2', content: '5. Gestion des utilisateurs et groupes' },
          { type: 'code', content: '# /etc/passwd — Format : utilisateur:x:UID:GID:commentaire:home:shell\n# root:x:0:0:root:/root:/bin/bash\n# anthony:x:1000:1000:Anthony,,,:/home/anthony:/bin/bash\n# www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n\n# UID importants :\n# 0        = root\n# 1-999    = comptes système (services)\n# 1000+    = utilisateurs humains\n\n# /etc/shadow — Mots de passe hashés (sudo requis)\n# /etc/group  — Format : groupe:x:GID:membres\n\n# Créer un utilisateur\nuseradd -m -s /bin/bash -G sudo,docker anthony\n# -m : créer le home  -s : shell  -G : groupes supplémentaires\n\npasswd anthony                           # Définir le mot de passe\necho "anthony:TempP@ss!" | chpasswd      # Non interactif\n\n# Modifier un utilisateur\nusermod -aG docker anthony               # Ajouter au groupe (-a = append !)\nusermod -s /bin/zsh anthony              # Changer le shell\nusermod -L anthony                       # Verrouiller le compte\nusermod -U anthony                       # Déverrouiller\n\n# Supprimer un utilisateur\nuserdel anthony                          # Supprimer seulement le compte\nuserdel -r anthony                       # Supprimer compte + home + mail\n\n# Gestion des groupes\ngroupadd devops\ngpasswd -a anthony devops                # Ajouter un utilisateur\ngpasswd -d anthony devops                # Retirer un utilisateur\n\n# Voir les groupes d\'un utilisateur\ngroups anthony\nid anthony\n# uid=1000(anthony) gid=1000(anthony) groups=1000(anthony),27(sudo),999(docker)\n\n# Changer d\'utilisateur\nsu - marie                               # Devenir marie (avec son environnement)\nsudo commande                            # Exécuter en tant que root\nsudo -i                                  # Shell root interactif' },

          { type: 'h2', content: '6. Permissions avancées' },
          { type: 'code', content: '# chmod — Changer les permissions\nchmod 755 script.sh           # Notation octale\nchmod u+x script.sh           # Ajouter exécution au propriétaire\nchmod g-w fichier.txt         # Retirer écriture au groupe\nchmod o-rwx secret.txt        # Retirer tous droits aux autres\nchmod a+r public.txt          # Ajouter lecture à tous (all)\nchmod -R 755 /var/www/html/   # Récursif\n\n# Exemples concrets :\nchmod 600 ~/.ssh/id_rsa           # Clé SSH privée — OBLIGATOIRE\nchmod 644 ~/.ssh/id_rsa.pub       # Clé publique\nchmod 700 ~/.ssh/                 # Répertoire SSH\nchmod 755 /var/www/html/          # Répertoire web\nchmod 644 /var/www/html/*.html    # Fichiers web\n\n# chown — Changer le propriétaire\nchown anthony fichier.txt         # Changer propriétaire\nchown anthony:developers proj/    # Changer propriétaire ET groupe\nchown -R www-data:www-data /var/www/  # Récursif (Apache/Nginx)\n\n# umask — Masque de création par défaut\numask                  # 0022 (défaut)\n# Fichier = 0666 - 0022 = 0644 (rw-r--r--)\n# Répertoire = 0777 - 0022 = 0755 (rwxr-xr-x)\n\n# ACL — Access Control Lists (droits fins)\napt install acl\nsetfacl -m u:marie:r fichier.txt  # Donner lecture à marie\ngetfacl fichier.txt               # Voir les ACLs\nsetfacl -R -m u:marie:rx /home/anthony/projet/  # Récursif' },
        ],
      },

      {
        id: 'services-linux',
        titre: 'Services, Réseau et Administration Linux',
        sections: [

          { type: 'h2', content: '1. Systemd — Gestion des services' },
          { type: 'p', content: 'Systemd est le système d\'init moderne de Linux (remplace SysV init). Il démarre les services en parallèle, gère les dépendances et centralise les logs.' },
          { type: 'code', content: '# systemctl — Interface principale de systemd\n\nsystemctl start apache2         # Démarrer\nsystemctl stop apache2          # Arrêter\nsystemctl restart apache2       # Arrêter puis démarrer\nsystemctl reload apache2        # Recharger la config sans couper\nsystemctl enable apache2        # Activer au démarrage\nsystemctl disable apache2       # Désactiver au démarrage\nsystemctl enable --now apache2  # Activer ET démarrer immédiatement\nsystemctl status apache2        # Voir le statut détaillé\nsystemctl is-active apache2     # active / inactive\nsystemctl is-enabled apache2    # enabled / disabled\n\n# Lister les services\nsystemctl list-units --type=service                    # Services actifs\nsystemctl list-units --type=service --state=running    # Services en cours\nsystemctl list-units --type=service --state=failed     # Services en échec\nsystemctl list-unit-files --type=service               # Tous + état enabled\n\n# Créer un service personnalisé\ncat > /etc/systemd/system/mon-app.service << EOF\n[Unit]\nDescription=Mon Application TSSR\nAfter=network.target mysql.service\nRequires=mysql.service\n\n[Service]\nType=simple\nUser=www-data\nWorkingDirectory=/opt/mon-app\nExecStart=/opt/mon-app/start.sh\nRestart=on-failure\nRestartSec=5s\n\n[Install]\nWantedBy=multi-user.target\nEOF\n\nsystemctl daemon-reload    # Recharger la config systemd\nsystemctl enable --now mon-app' },

          { type: 'h2', content: '2. Journald — Logs centralisés' },
          { type: 'code', content: '# journalctl — Consulter les logs systemd\n\njournalctl                          # Tous les logs\njournalctl -b                       # Logs depuis le dernier boot\njournalctl -f                       # Suivi en temps réel\njournalctl -n 50                    # 50 dernières lignes\njournalctl --since "1 hour ago"     # Dernière heure\njournalctl --since "2024-01-04 09:00:00" --until "2024-01-04 10:00:00"\njournalctl -u apache2               # Logs d\'un service spécifique\njournalctl -p err                   # Seulement les erreurs\njournalctl -p warning..err          # Warning et erreurs\njournalctl --disk-usage             # Espace utilisé\njournalctl --vacuum-size=500M       # Réduire à 500M\n\n# Niveaux de sévérité :\n# 0 emerg  1 alert  2 crit  3 err  4 warning  5 notice  6 info  7 debug\n\n# Fichiers de logs classiques :\ntail -f /var/log/syslog             # Logs système généraux\ntail -f /var/log/auth.log           # Authentifications SSH sudo su\ntail -f /var/log/apache2/access.log # Requêtes HTTP\ntail -f /var/log/apache2/error.log  # Erreurs Apache\n\n# Analyser les tentatives d\'intrusion SSH :\ngrep "Failed password" /var/log/auth.log | \\\n  awk \'{print $11}\' | sort | uniq -c | sort -rn | head -20' },

          { type: 'h2', content: '3. Réseau Linux — Configuration et diagnostic' },
          { type: 'code', content: '# ip — Commande réseau moderne (remplace ifconfig)\n\nip link show                        # Toutes les interfaces\nip link set eth0 up                 # Activer une interface\nip addr show                        # Toutes les IPs\nip addr add 192.168.1.100/24 dev eth0     # Ajouter une IP (temporaire)\nip addr del 192.168.1.100/24 dev eth0     # Supprimer une IP\nip route show                       # Table de routage\nip route add default via 192.168.1.1      # Route par défaut\nip neigh show                       # Table ARP\n\n# Configuration permanente — Debian (/etc/network/interfaces)\nauto eth0\niface eth0 inet static\n  address 192.168.1.10\n  netmask 255.255.255.0\n  gateway 192.168.1.1\n  dns-nameservers 192.168.1.10 8.8.8.8\n\n# Netplan (Ubuntu Server 18+)\n# /etc/netplan/01-config.yaml\nnetwork:\n  version: 2\n  ethernets:\n    eth0:\n      addresses: [192.168.1.10/24]\n      routes:\n        - to: default\n          via: 192.168.1.1\n      nameservers:\n        addresses: [192.168.1.10, 8.8.8.8]\nnetplan apply\n\n# DNS\ncat /etc/resolv.conf                # Serveurs DNS utilisés\nresolvectl status                   # Via systemd-resolved\nresolvectl flush-caches             # Vider le cache DNS' },

          { type: 'h2', content: '4. Diagnostic réseau complet' },
          { type: 'code', content: '# Ping\nping -c 4 8.8.8.8                    # 4 paquets\nping -s 1400 -c 4 8.8.8.8            # Paquet de 1400 octets\nping -M do -s 1472 8.8.8.8           # Test MTU (ne pas fragmenter)\n\n# Traceroute\ntraceroute 8.8.8.8                   # UDP (défaut)\ntraceroute -I 8.8.8.8                # ICMP\ntraceroute -n 8.8.8.8                # Sans résolution DNS\nmtr 8.8.8.8                         # Traceroute continu\n\n# Ports ouverts\nss -tuln                             # Ports en écoute (TCP+UDP)\nss -tnp                              # Connexions TCP avec PID\nlsof -i :80                          # Qui utilise le port 80 ?\n\n# Analyse de trafic\ntcpdump -i eth0                      # Capturer tout le trafic\ntcpdump -i eth0 port 80              # Filtrer par port\ntcpdump -i eth0 host 192.168.1.20    # Filtrer par hôte\ntcpdump -i eth0 -w capture.pcap      # Sauvegarder pour Wireshark\n\n# Tests pratiques\ncurl -v http://192.168.1.20           # Test HTTP\nnc -zv 192.168.1.20 80               # Test port ouvert\ndig @192.168.1.10 google.com          # Via mon DNS\ndig @8.8.8.8 google.com              # Via DNS Google' },

          { type: 'h2', content: '5. Gestion des paquets Debian/Ubuntu' },
          { type: 'code', content: '# apt — Interface haut niveau\napt update                           # Mettre à jour la liste\napt upgrade                          # Mettre à jour les paquets\napt install nginx                    # Installer\napt install -y nginx                 # Installer sans confirmation\napt remove nginx                     # Désinstaller (garde les configs)\napt purge nginx                      # Désinstaller + supprimer configs\napt autoremove                       # Supprimer les dépendances orphelines\napt search nginx                     # Chercher un paquet\napt show nginx                       # Détails d\'un paquet\napt list --installed                 # Paquets installés\n\n# dpkg — Interface bas niveau\ndpkg -l nginx                        # Statut d\'un paquet\ndpkg -i paquet.deb                   # Installer un .deb\ndpkg -L nginx                        # Fichiers installés par un paquet\ndpkg -S /etc/nginx/nginx.conf        # Quel paquet a installé ce fichier ?\n\n# Mises à jour de sécurité automatiques\napt install unattended-upgrades\ndpkg-reconfigure -plow unattended-upgrades' },

          { type: 'h2', content: '6. Processus et performances système' },
          { type: 'code', content: '# ps — Lister les processus\nps aux                               # Tous les processus\nps aux | grep apache                 # Chercher un processus\nps --sort=-%mem | head -10           # Top 10 consommateurs RAM\nps --sort=-%cpu | head -10           # Top 10 consommateurs CPU\n\n# top / htop — Monitoring temps réel\ntop\nhtop    # Plus convivial (apt install htop)\n\n# kill — Envoyer des signaux\nkill 1234                            # SIGTERM (arrêt propre)\nkill -9 1234                         # SIGKILL (arrêt forcé)\nkill -HUP 1234                       # SIGHUP (rechargement config)\nkillall apache2                      # Tuer par nom\n\n# Performances système\nfree -h                              # Mémoire RAM\ndf -h                                # Espace disque\ndu -sh /var/log/*                    # Taille des dossiers\niostat -x 1                          # I/O disque\nuptime                               # Charge système (load average)\nlscpu                                # Infos CPU\ncat /proc/meminfo                    # Détails mémoire\n\n# Processus en arrière-plan\ncommande &                           # Lancer en arrière-plan\njobs                                 # Voir les jobs\nnohup commande &                     # Continuer après déconnexion\nscreen -S session_name               # Terminal persistant\ntmux new -s ma_session               # Multiplexeur terminal' },
        ],
      },

      {
        id: 'ssh-securite-linux',
        titre: 'SSH, Sécurité et Durcissement Linux',
        sections: [

          { type: 'h2', content: '1. SSH — Secure Shell' },
          { type: 'p', content: 'SSH est le protocole d\'administration à distance sécurisé. Il chiffre toutes les communications (remplace Telnet, rsh, rcp non chiffrés).' },
          { type: 'code', content: '# Connexion SSH\nssh anthony@192.168.1.10            # Connexion standard\nssh -p 2222 anthony@192.168.1.10    # Port personnalisé\nssh -i ~/.ssh/ma_cle anthony@srv    # Clé spécifique\nssh -J bastion anthony@srv-interne  # Via un bastion (jump host)\nssh -L 8080:192.168.1.20:80 srv     # Tunnel SSH (port forwarding)\n\n# Génération de clés SSH\nssh-keygen -t ed25519 -C "anthony@tssr.local"\n# → Crée ~/.ssh/id_ed25519 (privée) et ~/.ssh/id_ed25519.pub (publique)\n\n# RSA si ed25519 non supporté :\nssh-keygen -t rsa -b 4096 -C "anthony@tssr.local"\n\n# Copier la clé publique sur un serveur\nssh-copy-id -i ~/.ssh/id_ed25519.pub anthony@192.168.1.10\n# Ou manuellement :\ncat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys\nchmod 600 ~/.ssh/authorized_keys\nchmod 700 ~/.ssh\n\n# Fichier de config SSH client (~/.ssh/config)\ncat > ~/.ssh/config << EOF\nHost srv-prod\n  HostName 192.168.1.10\n  User anthony\n  Port 2222\n  IdentityFile ~/.ssh/id_ed25519\n  ServerAliveInterval 60\n\nHost srv-interne\n  HostName 10.0.0.50\n  User root\n  ProxyJump bastion\nEOF\nchmod 600 ~/.ssh/config\n# Maintenant : ssh srv-prod au lieu de ssh -p 2222 -i ~/.ssh/id_ed25519 anthony@192.168.1.10' },

          { type: 'h2', content: '2. Configuration sécurisée du serveur SSH' },
          { type: 'code', content: '# /etc/ssh/sshd_config — Configuration du serveur\n\nPort 2222                          # Changer le port\nPermitRootLogin no                 # JAMAIS de connexion root directe\nPasswordAuthentication no          # Clés SSH uniquement (recommandé)\nPubkeyAuthentication yes           # Authentification par clé\n\nMaxAuthTries 3                     # 3 tentatives max\nMaxSessions 5                      # 5 sessions simultanées max\nLoginGraceTime 30                  # 30s pour s\'authentifier\n\nAllowUsers anthony marie           # Whitelist utilisateurs\n# OU\nAllowGroups sshusers               # Whitelist groupe\n\nX11Forwarding no                   # Pas de forwarding graphique\nClientAliveInterval 300            # Déconnecter après 5min d\'inactivité\nClientAliveCountMax 2\n\n# Algorithmes cryptographiques sécurisés\nKexAlgorithms curve25519-sha256,diffie-hellman-group16-sha512\nCiphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com\n\n# Appliquer les changements :\nsshd -t                            # Vérifier la syntaxe\nsystemctl restart sshd' },

          { type: 'h2', content: '3. Fail2ban — Protection contre le brute force' },
          { type: 'code', content: '# Fail2ban surveille les logs et bannit les IPs\napt install fail2ban\n\n# /etc/fail2ban/jail.local\n[DEFAULT]\nbantime  = 3600          # 1h de ban\nfindtime  = 600          # Fenêtre de détection 10min\nmaxretry = 3             # 3 tentatives max\nignoreip = 127.0.0.1/8 192.168.1.0/24\n\n[sshd]\nenabled  = true\nport     = 2222\nfilter   = sshd\nlogpath  = /var/log/auth.log\nmaxretry = 3\n\nsystemctl enable --now fail2ban\n\n# Commandes fail2ban :\nfail2ban-client status                    # Vue d\'ensemble\nfail2ban-client status sshd               # IPs bannies pour SSH\nfail2ban-client set sshd unbanip 1.2.3.4  # Débannir une IP\nfail2ban-client reload                    # Recharger la config' },

          { type: 'h2', content: '4. UFW — Pare-feu simplifié' },
          { type: 'code', content: '# UFW (Uncomplicated Firewall) — Interface simplifiée pour iptables\n\nufw default deny incoming              # Tout bloquer par défaut\nufw default allow outgoing             # Autoriser le trafic sortant\n\n# ATTENTION : autoriser SSH AVANT d\'activer UFW !\nufw allow 2222/tcp                     # Notre port SSH\n\n# Activer UFW\nufw enable\n\n# Règles courantes :\nufw allow 80/tcp                       # HTTP\nufw allow 443/tcp                      # HTTPS\nufw allow from 192.168.1.0/24          # Tout depuis le LAN\nufw allow from 192.168.1.0/24 to any port 3306   # MySQL depuis LAN\nufw deny from 185.220.101.0/24         # Bloquer un range suspect\n\n# Règles numérotées :\nufw status numbered\nufw delete 3                           # Supprimer règle n°3\n\n# Vue d\'ensemble :\nufw status verbose\n\n# Désactiver (urgence) :\nufw disable' },

          { type: 'h2', content: '5. Sudo — Élévation de privilèges contrôlée' },
          { type: 'code', content: '# /etc/sudoers — TOUJOURS éditer avec visudo !\n# visudo vérifie la syntaxe avant de sauvegarder\nvisudo\n\n# Exemples de règles sudoers :\nanthony ALL=(ALL:ALL) ALL                                # Tous les droits\nanthony ALL=(ALL) NOPASSWD: ALL                         # Sans mot de passe (déconseillé)\nanthony ALL=(ALL) /bin/systemctl start apache2, /bin/systemctl stop apache2\nmarie   ALL=(ALL) /usr/bin/apt update, /usr/bin/apt upgrade\n%sysadmin ALL=(ALL:ALL) ALL                             # Groupe entier\n\n# Bonne pratique : fichier séparé\necho "anthony ALL=(ALL) /bin/systemctl" > /etc/sudoers.d/anthony\nchmod 440 /etc/sudoers.d/anthony\n\n# Voir ce qu\'on peut faire avec sudo :\nsudo -l                              # Droits de l\'utilisateur courant\nsudo -k                              # Invalider le cache sudo\n\n# Crontab — Planification des tâches\ncrontab -e                           # Éditer la crontab\ncrontab -l                           # Lister les tâches\ncrontab -u marie -l                  # Tâches d\'un autre utilisateur\n\n# Format : min heure jour mois jour_semaine commande\n0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1\n# → Sauvegarde tous les jours à 2h00\n\n*/5 * * * * /usr/local/bin/check.sh\n# → Toutes les 5 minutes\n\n0 0 * * 1 /usr/local/bin/weekly.sh\n# → Chaque lundi à minuit' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
    linux_cli: true,
    gameshell: true,
  },
  {
    id: 'linux-server',
    label: 'Serveur Linux',
    icon: '🐧',
    color: '#00e5a0',
    desc: 'Administration serveur Debian/Ubuntu, Apache, SSH, Samba, pare-feu...',
    topics: ['SSH', 'Apache', 'Samba', 'UFW', 'Cron', 'Logs'],
    linux_cli: true,
    cours: [
      {
        id: 'admin-linux-base',
        titre: 'Administration Serveur Linux — Les Fondamentaux',
        sections: [
          { type: 'h2', content: 'Gestion des utilisateurs' },
          { type: 'code', content: '# Créer un utilisateur avec home\nuseradd -m -s /bin/bash anthony\npasswd anthony\n\n# Ajouter au groupe sudo\nusermod -aG sudo anthony\n\n# Voir les groupes d\'un utilisateur\ngroups anthony\n\n# Supprimer un utilisateur\nuserdel -r anthony' },
          { type: 'h2', content: 'Gestion des services (systemd)' },
          { type: 'code', content: '# Démarrer / arrêter / redémarrer\nsystemctl start apache2\nsystemctl stop apache2\nsystemctl restart apache2\n\n# Activer au démarrage\nsystemctl enable apache2\n\n# Voir le statut détaillé\nsystemctl status apache2\n\n# Lister tous les services actifs\nsystemctl list-units --type=service --state=active' },
          { type: 'h2', content: 'Surveillance du système' },
          { type: 'code', content: '# Espace disque\ndf -h\n\n# Utilisation RAM\nfree -h\n\n# Charge CPU\ntop\nhtop  # plus lisible (apt install htop)\n\n# Processus d\'un service\nps aux | grep apache2\n\n# Logs système en temps réel\njournalctl -f\ntail -f /var/log/syslog' },
          { type: 'h2', content: 'Gestion des paquets (APT)' },
          { type: 'code', content: 'apt update && apt upgrade -y\napt install apache2 -y\napt remove apache2\napt autoremove\ndpkg -l | grep apache  # lister les paquets installés' },
          { type: 'h2', content: 'Planification des tâches (Cron)' },
          { type: 'code', content: '# Éditer la crontab de l\'utilisateur courant\ncrontab -e\n\n# Format : minute heure jour mois jour_semaine commande\n# Exemple : sauvegarde tous les jours à 2h00\n0 2 * * * /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1\n\n# Lister les tâches planifiées\ncrontab -l' },
        ],
      },
      {
        id: 'services-reseau-linux',
        titre: 'Services Réseau Linux — SSH, Apache, Samba',
        sections: [
          { type: 'h2', content: 'SSH — Accès distant sécurisé' },
          { type: 'p', content: 'SSH (Secure Shell) permet l\'administration distante sécurisée via chiffrement.' },
          { type: 'code', content: '# Installer le serveur SSH\napt install openssh-server\nsystemctl enable --now ssh\n\n# Se connecter depuis un client\nssh anthony@192.168.1.10\nssh -p 2222 anthony@192.168.1.10  # port personnalisé\n\n# Configurer SSH (/etc/ssh/sshd_config)\nPort 22\nPermitRootLogin no          # Désactiver connexion root directe\nPasswordAuthentication yes\nMaxAuthTries 3\n\n# Redémarrer après modification\nsystemctl restart ssh' },
          { type: 'warn', content: 'Toujours désactiver PermitRootLogin et changer le port par défaut en production.' },
          { type: 'h2', content: 'Apache2 — Serveur Web' },
          { type: 'code', content: 'apt install apache2\nsystemctl enable --now apache2\n\n# Tester localement\ncurl http://localhost\n\n# Fichiers de configuration\n# Site par défaut : /etc/apache2/sites-available/000-default.conf\n# Racine web : /var/www/html/\n\n# Activer/désactiver un site\na2ensite monsite.conf\na2dissite 000-default.conf\nsystemctl reload apache2\n\n# Logs Apache\ntail -f /var/log/apache2/access.log\ntail -f /var/log/apache2/error.log' },
          { type: 'h2', content: 'Samba — Partage de fichiers Windows/Linux' },
          { type: 'code', content: 'apt install samba\n\n# Configurer /etc/samba/smb.conf\n[partage]\npath = /srv/partage\nbrowseable = yes\nread only = no\nvalid users = anthony\n\n# Créer le dossier et les droits\nmkdir -p /srv/partage\nchown anthony:anthony /srv/partage\nchmod 770 /srv/partage\n\n# Créer un utilisateur Samba\nsmbpasswd -a anthony\nsystemctl restart smbd' },
          { type: 'h2', content: 'UFW — Pare-feu simplifié' },
          { type: 'code', content: '# Activer UFW\nufw enable\n\n# Autoriser SSH (AVANT d\'activer !)\nufw allow ssh\nufw allow 22/tcp\n\n# Autoriser HTTP et HTTPS\nufw allow 80/tcp\nufw allow 443/tcp\n\n# Voir les règles\nufw status verbose\n\n# Supprimer une règle\nufw delete allow 80/tcp' },
        ],
      },
      {
        id: 'securite-logs-linux',
        titre: 'Sécurité et Analyse des Logs Linux',
        sections: [
          { type: 'h2', content: 'Fichiers de logs essentiels' },
          { type: 'table', headers: ['Fichier', 'Contenu'], rows: [
            ['<code>/var/log/syslog</code>',             'Logs système généraux'],
            ['<code>/var/log/auth.log</code>',           'Authentifications et sudo'],
            ['<code>/var/log/apache2/access.log</code>', 'Requêtes HTTP reçues'],
            ['<code>/var/log/apache2/error.log</code>',  'Erreurs Apache'],
            ['<code>/var/log/dpkg.log</code>',           'Installations de paquets'],
          ]},
          { type: 'code', content: '# Rechercher les échecs de connexion SSH\ngrep "Failed password" /var/log/auth.log\n\n# Voir les connexions réussies\ngrep "Accepted" /var/log/auth.log\n\n# Analyser avec journalctl\njournalctl -u ssh --since "2024-01-01" --until "2024-12-31"\njournalctl -p err  # uniquement les erreurs' },
          { type: 'h2', content: 'Fail2ban — Protection contre les attaques brute force' },
          { type: 'code', content: 'apt install fail2ban\n\n# Configuration /etc/fail2ban/jail.local\n[sshd]\nenabled = true\nmaxretry = 3\nbantime = 3600\nfindtime = 600\n\nsystemctl enable --now fail2ban\n\n# Voir les IPs bannies\nfail2ban-client status sshd' },
          { type: 'h2', content: 'Sudo et élévation de privilèges' },
          { type: 'code', content: '# Éditer sudoers (toujours via visudo !)\nvisudo\n\n# Autoriser un utilisateur à tout faire\nanthony ALL=(ALL:ALL) ALL\n\n# Autoriser sans mot de passe (déconseillé)\nanthony ALL=(ALL) NOPASSWD: ALL\n\n# Autoriser seulement certaines commandes\nanthony ALL=(ALL) /bin/systemctl, /usr/bin/apt' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
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
        id: 'windows-server-bases',
        titre: 'Windows Server 2022 — Installation et Configuration',
        sections: [

          { type: 'h2', content: '1. Les éditions de Windows Server 2022' },
          { type: 'table', headers: ['Édition', 'VMs incluses', 'Usage', 'Particularités'], rows: [
            ['Essentials', '0', 'TPE < 25 users', 'Pas de virtualisation, interface simplifiée'],
            ['Standard', '2', 'Serveurs standard', 'Tous les rôles, 2 VMs Hyper-V incluses'],
            ['Datacenter', 'Illimitées', 'Datacenters', 'VMs illimitées, Storage Spaces Direct, SDN'],
            ['Azure Edition', 'Illimitées', 'Azure uniquement', 'Hotpatching — mises à jour sans redémarrage'],
          ]},
          { type: 'info', content: '<strong>Licencing Core :</strong> Windows Server 2022 est licencié par paire de cœurs physiques (minimum 8 paires = 16 cœurs par serveur). Un serveur 4 cœurs paie quand même pour 16 cœurs minimum.' },

          { type: 'h2', content: '2. Installation pas à pas' },
          { type: 'steps', items: [
            {
              num: '1',
              title: 'Prérequis matériels',
              content: 'CPU 64 bits 1.4 GHz minimum · RAM 512 Mo (2 Go avec GUI) · Disque 32 Go minimum · Réseau Ethernet',
              why: 'Pour un serveur de production : 16 Go RAM minimum, 2 CPUs, SSD NVMe, 2 cartes réseau (redondance). Les specs minimales sont pour un lab.'
            },
            {
              num: '2',
              title: 'Choix de l\'option d\'installation',
              content: '<strong>Server Core</strong> : pas d\'interface graphique, ligne de commande uniquement, surface d\'attaque réduite, recommandé en production.<br><strong>Server with Desktop Experience</strong> : interface graphique complète, recommandé pour apprendre.',
              why: 'Microsoft pousse vers Server Core depuis 2016. En production, moins de paquets installés = moins de vulnérabilités = moins de redémarrages pour les mises à jour.'
            },
            {
              num: '3',
              title: 'Partitionnement',
              content: 'Partition système : 100 Mo (EFI) + 128 Mo (MSR) + 60 Go minimum (OS). Laisser le reste pour les données sur un disque séparé.',
              why: 'Séparer OS et données : si le disque OS tombe en panne, les données sont préservées. Plus facile de réinstaller l\'OS sans toucher aux données.'
            },
            {
              num: '4',
              title: 'Configuration post-installation',
              content: 'Renommer le serveur · Configurer l\'IP fixe · Rejoindre le domaine · Configurer Windows Update · Activer le pare-feu · Installer les mises à jour',
              code: '# PowerShell — Configuration initiale complète\n# Renommer le serveur\nRename-Computer -NewName "SRV-PROD-01" -Restart\n\n# Après redémarrage — IP fixe\nNew-NetIPAddress -InterfaceAlias "Ethernet" `\n  -IPAddress 192.168.1.10 `\n  -PrefixLength 24 `\n  -DefaultGateway 192.168.1.1\n\nSet-DnsClientServerAddress -InterfaceAlias "Ethernet" `\n  -ServerAddresses ("192.168.1.10","192.168.1.11")\n\n# Vérifier\nGet-NetIPConfiguration\nipconfig /all\n\n# Rejoindre le domaine\nAdd-Computer -DomainName "tssr.local" `\n  -Credential (Get-Credential) `\n  -OUPath "OU=Serveurs,DC=tssr,DC=local" `\n  -Restart',
              why: 'Toujours IP fixe sur un serveur. Un serveur avec DHCP change d\'IP au redémarrage → les clients ne le trouvent plus. Les serveurs DNS AD en particulier DOIVENT avoir une IP fixe.'
            },
            {
              num: '5',
              title: 'Ajouter un rôle via Server Manager',
              content: 'Server Manager → Gérer → Ajouter des rôles et fonctionnalités → Suivant → Installation basée sur un rôle → Choisir le serveur → Cocher le rôle → Suivant → Installer',
              code: '# Équivalent PowerShell (plus rapide)\nInstall-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools\nInstall-WindowsFeature -Name DNS -IncludeManagementTools\nInstall-WindowsFeature -Name DHCP -IncludeManagementTools\nInstall-WindowsFeature -Name Web-Server -IncludeManagementTools\n\n# Lister tous les rôles disponibles\nGet-WindowsFeature | Where-Object {$_.InstallState -eq "Installed"}\n\n# Lister les rôles installés\nGet-WindowsFeature | Where-Object {$_.Installed -eq $true}',
            },
          ]},

          { type: 'h2', content: '3. Gestion des disques et stockage' },
          { type: 'code', content: '# Gestion des disques avec PowerShell\n\n# Voir tous les disques\nGet-Disk\n\n# Initialiser un nouveau disque (GPT recommandé)\nInitialize-Disk -Number 1 -PartitionStyle GPT\n\n# Créer une partition et formater\nNew-Partition -DiskNumber 1 -UseMaximumSize -AssignDriveLetter |\nFormat-Volume -FileSystem NTFS -NewFileSystemLabel "Donnees" -Confirm:$false\n\n# Voir les volumes\nGet-Volume\n\n# Diskpart (outil classique)\ndiskpart\nlist disk\nselect disk 1\nclean           # ATTENTION : efface tout !\ncreate partition primary\nformat fs=ntfs quick label="Donnees"\nassign letter=D\nexit\n\n# Storage Spaces (RAID logiciel Windows)\n# Voir les disques disponibles pour un pool\nGet-PhysicalDisk | Where-Object CanPool -eq $true\n\n# Créer un pool de stockage\n$disques = Get-PhysicalDisk | Where-Object CanPool -eq $true\nNew-StoragePool -FriendlyName "Pool-Data" `\n  -StorageSubSystemFriendlyName (Get-StorageSubSystem).FriendlyName `\n  -PhysicalDisks $disques\n\n# Créer un disque virtuel miroir (RAID 1)\nNew-VirtualDisk -StoragePoolFriendlyName "Pool-Data" `\n  -FriendlyName "VDisk-Mirror" `\n  -ResiliencySettingName "Mirror" `\n  -Size 100GB' },

          { type: 'h2', content: '4. Gestion des services Windows' },
          { type: 'code', content: '# Services Windows — commandes essentielles\n\n# Voir tous les services\nGet-Service | Sort-Object Status -Descending\nGet-Service | Where-Object Status -eq "Stopped"\n\n# Démarrer / Arrêter / Redémarrer\nStart-Service -Name "wuauserv"        # Windows Update\nStop-Service -Name "Spooler"          # Spouleur impression\nRestart-Service -Name "DNS"           # Serveur DNS\n\n# Activer/désactiver au démarrage\nSet-Service -Name "Spooler" -StartupType Automatic\nSet-Service -Name "Telnet" -StartupType Disabled\n\n# Voir les services qui dépendent d\'un autre\nGet-Service -Name "DNS" -DependentServices\nGet-Service -Name "DNS" -RequiredServices\n\n# Services critiques à connaître :\n# NTDS        : Active Directory Domain Services\n# DNS         : Serveur DNS\n# DHCP        : Serveur DHCP\n# Netlogon    : Authentification domaine\n# W32Time     : Synchronisation horaire (Kerberos en dépend !)\n# RpcSs       : Remote Procedure Call (fondation de beaucoup de services)\n# SamSs       : Security Accounts Manager\n# EventLog    : Journal des événements\n# WinRM       : Windows Remote Management (PowerShell distant)\n\n# Réparer un service qui ne démarre pas\nsc config DNS start= auto\nsc start DNS\n# Voir le code d\'erreur\nsc query DNS' },
        ],
      },

      {
        id: 'active-directory',
        titre: 'Active Directory — Installation, Structure et Administration',
        sections: [

          { type: 'h2', content: '1. Qu\'est-ce qu\'Active Directory ?' },
          { type: 'p', content: 'Active Directory est le service d\'annuaire de Microsoft. Il centralise l\'<strong>authentification</strong> (qui es-tu ?), l\'<strong>autorisation</strong> (qu\'as-tu le droit de faire ?) et la <strong>gestion des ressources</strong> (ordinateurs, utilisateurs, imprimantes, partages) d\'un réseau Windows.' },
          { type: 'table', headers: ['Concept', 'Description', 'Exemple concret'], rows: [
            ['Domaine', 'Périmètre administratif AD avec une base commune', 'tssr.local'],
            ['Forêt', 'Ensemble de domaines partageant schéma et catalogue global', 'tssr.local + filiale.tssr.local'],
            ['Arbre', 'Domaines liés partageant un namespace DNS contigu', 'tssr.local et rh.tssr.local'],
            ['DC (Domain Controller)', 'Serveur hébergeant AD DS — authentifie et réplique', 'SRV-DC-01.tssr.local'],
            ['FSMO', 'Rôles spéciaux sur certains DCs', 'PDC Emulator, RID Master, etc.'],
            ['Catalogue global', 'DC avec copie partielle de tous les objets de la forêt', 'Accélère les recherches cross-domain'],
            ['Schema', 'Définition de tous les types d\'objets et attributs AD', 'Étendu par Exchange, Skype, SCCM...'],
          ]},

          { type: 'h2', content: '2. Protocoles utilisés par Active Directory' },
          { type: 'table', headers: ['Protocole', 'Port', 'Rôle'], rows: [
            ['Kerberos', 'TCP/UDP 88', 'Authentification principale — tickets chiffrés'],
            ['LDAP', 'TCP 389', 'Interrogation de l\'annuaire'],
            ['LDAPS', 'TCP 636', 'LDAP chiffré (TLS)'],
            ['DNS', 'TCP/UDP 53', 'Résolution des noms DC et SRV records'],
            ['SMB', 'TCP 445', 'Accès à SYSVOL et NETLOGON (GPO scripts)'],
            ['RPC', 'TCP 135 + dynamiques', 'Réplication entre DCs communication AD'],
            ['NTP/W32Time', 'UDP 123', 'Synchronisation horaire — CRITIQUE pour Kerberos'],
            ['Global Catalog', 'TCP 3268 (3269 SSL)', 'Recherches multi-domaines'],
          ]},
          { type: 'warn', content: '<strong>Kerberos et l\'heure :</strong> Kerberos refuse les tickets avec plus de 5 minutes de décalage horaire. Si les horloges des clients et DCs se désynchronisent, PERSONNE ne peut se connecter au domaine. W32Time doit absolument fonctionner.' },

          { type: 'h2', content: '3. Installation d\'Active Directory DS' },
          { type: 'code', content: '# Étape 1 : Installer le rôle AD DS\nInstall-WindowsFeature AD-Domain-Services -IncludeManagementTools\n\n# Étape 2 : Promouvoir en contrôleur de domaine\n# Nouvelle forêt (premier DC) :\nInstall-ADDSForest `\n  -DomainName "tssr.local" `\n  -DomainNetbiosName "TSSR" `\n  -DomainMode "WinThreshold" `\n  -ForestMode "WinThreshold" `\n  -DatabasePath "C:\\Windows\\NTDS" `\n  -SysvolPath "C:\\Windows\\SYSVOL" `\n  -LogPath "C:\\Windows\\NTDS" `\n  -SafeModeAdministratorPassword (ConvertTo-SecureString "P@ssword2024!" -AsPlainText -Force) `\n  -InstallDns `\n  -Force\n\n# Le serveur redémarre automatiquement\n# Après redémarrage : connexion avec TSSR\\Administrateur\n\n# Ajouter un second DC (haute disponibilité)\nInstall-ADDSDomainController `\n  -DomainName "tssr.local" `\n  -SiteName "Default-First-Site-Name" `\n  -InstallDns `\n  -Credential (Get-Credential "TSSR\\Administrateur") `\n  -SafeModeAdministratorPassword (ConvertTo-SecureString "P@ssword2024!" -AsPlainText -Force) `\n  -Force\n\n# Vérifier l\'installation\nGet-ADDomain\nGet-ADForest\nGet-ADDomainController -Filter *\n\n# Vérifier les SRV records DNS (essentiels pour AD)\nnslookup -type=SRV _ldap._tcp.tssr.local\nnslookup -type=SRV _kerberos._tcp.tssr.local' },

          { type: 'h2', content: '4. Structure AD — OUs, Utilisateurs, Groupes, Ordinateurs' },
          { type: 'h3', content: '4.1 Unités d\'Organisation (OU)' },
          { type: 'p', content: 'Les OUs sont des conteneurs qui organisent les objets AD. Elles permettent d\'appliquer des GPO ciblées et de déléguer l\'administration.' },
          { type: 'code', content: '# Structure OU recommandée :\n# tssr.local\n# ├── _Admin          (comptes admins séparés des users normaux)\n# ├── Serveurs\n# │   ├── DC\n# │   ├── Applicatifs\n# │   └── Fichiers\n# ├── Utilisateurs\n# │   ├── Informatique\n# │   ├── Comptabilite\n# │   ├── Direction\n# │   └── Desactivés\n# ├── Ordinateurs\n# │   ├── Portables\n# │   ├── Fixes\n# │   └── Salles\n# └── Groupes\n\n# Créer la structure OU avec PowerShell :\nNew-ADOrganizationalUnit -Name "_Admin"       -Path "DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Utilisateurs" -Path "DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Informatique" -Path "OU=Utilisateurs,DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Comptabilite" -Path "OU=Utilisateurs,DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Serveurs"     -Path "DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Ordinateurs"  -Path "DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Groupes"      -Path "DC=tssr,DC=local"\n\n# Lister les OUs\nGet-ADOrganizationalUnit -Filter * | Select-Object Name, DistinguishedName' },

          { type: 'h3', content: '4.2 Gestion des utilisateurs' },
          { type: 'code', content: '# Créer un utilisateur complet\nNew-ADUser `\n  -Name "Jean Dupont" `\n  -GivenName "Jean" `\n  -Surname "Dupont" `\n  -SamAccountName "j.dupont" `\n  -UserPrincipalName "j.dupont@tssr.local" `\n  -Path "OU=Informatique,OU=Utilisateurs,DC=tssr,DC=local" `\n  -Department "Informatique" `\n  -Title "Technicien réseau" `\n  -Office "Bâtiment A - Bureau 201" `\n  -OfficePhone "+33 1 23 45 67 89" `\n  -EmailAddress "j.dupont@tssr.local" `\n  -Description "Technicien TSSR promo 2024" `\n  -AccountPassword (ConvertTo-SecureString "TempP@ss2024!" -AsPlainText -Force) `\n  -ChangePasswordAtLogon $true `\n  -Enabled $true\n\n# Lister les utilisateurs avec détails\nGet-ADUser -Filter * -Properties * | `\n  Select-Object Name, SamAccountName, Department, Enabled, `\n  LastLogonDate, PasswordLastSet, PasswordNeverExpires | `\n  Format-Table -AutoSize\n\n# Chercher un utilisateur spécifique\nGet-ADUser -Filter {Name -like "Jean*"}\nGet-ADUser -Identity "j.dupont" -Properties *\n\n# Modifier un utilisateur\nSet-ADUser -Identity "j.dupont" `\n  -Title "Administrateur Système" `\n  -Department "DSI"\n\n# Réinitialiser un mot de passe\nSet-ADAccountPassword -Identity "j.dupont" `\n  -Reset `\n  -NewPassword (ConvertTo-SecureString "NewP@ss2024!" -AsPlainText -Force)\nSet-ADUser -Identity "j.dupont" -ChangePasswordAtLogon $true\n\n# Désactiver/activer un compte\nDisable-ADAccount -Identity "j.dupont"\nEnable-ADAccount -Identity "j.dupont"\n\n# Supprimer un utilisateur\nRemove-ADUser -Identity "j.dupont" -Confirm:$false\n\n# Trouver les comptes inactifs depuis 30 jours\n$date = (Get-Date).AddDays(-30)\nGet-ADUser -Filter {LastLogonDate -lt $date -and Enabled -eq $true} `\n  -Properties LastLogonDate | `\n  Select-Object Name, SamAccountName, LastLogonDate | `\n  Sort-Object LastLogonDate' },

          { type: 'h3', content: '4.3 Gestion des groupes' },
          { type: 'table', headers: ['Type de groupe', 'Portée', 'Membres', 'Utilisation'], rows: [
            ['Sécurité Local Domaine', 'Domaine local', 'Utilisateurs de n\'importe quel domaine de la forêt', 'Assigner des droits sur ressources locales'],
            ['Sécurité Global', 'Forêt entière', 'Utilisateurs du même domaine seulement', 'Regrouper des utilisateurs par fonction'],
            ['Sécurité Universel', 'Forêt entière', 'N\'importe quel objet de la forêt', 'Accès multi-domaines (forêts)'],
            ['Distribution', 'Email seulement', 'N\'importe quel objet', 'Listes de diffusion Exchange'],
          ]},
          { type: 'info', content: '<strong>Bonne pratique AGDLP :</strong> Accounts → Global Groups → Domain Local Groups → Permissions.<br>Exemple : Utilisateurs (comptes) → GG-Comptables (groupe global) → DL-Lecture-Compta (groupe local domaine) → Droit lecture sur \\\\SRV-FICHIERS\\Comptabilite' },
          { type: 'code', content: '# Créer des groupes\nNew-ADGroup -Name "GG-Comptables" `\n  -GroupScope Global `\n  -GroupCategory Security `\n  -Path "OU=Groupes,DC=tssr,DC=local" `\n  -Description "Tous les utilisateurs de la comptabilité"\n\nNew-ADGroup -Name "DL-Lecture-Compta" `\n  -GroupScope DomainLocal `\n  -GroupCategory Security `\n  -Path "OU=Groupes,DC=tssr,DC=local"\n\n# Ajouter des membres\nAdd-ADGroupMember -Identity "GG-Comptables" -Members "j.dupont","m.martin"\nAdd-ADGroupMember -Identity "DL-Lecture-Compta" -Members "GG-Comptables"\n\n# Lister les membres\nGet-ADGroupMember -Identity "GG-Comptables" | Select-Object Name, SamAccountName\n\n# Voir les groupes d\'un utilisateur\n(Get-ADUser -Identity "j.dupont" -Properties MemberOf).MemberOf\n\n# Retirer un membre\nRemove-ADGroupMember -Identity "GG-Comptables" -Members "j.dupont" -Confirm:$false\n\n# Groupe imbriqué : ajouter GG-Comptables dans DL-Lecture-Compta\nAdd-ADGroupMember -Identity "DL-Lecture-Compta" -Members "GG-Comptables"' },

          { type: 'h2', content: '5. Les rôles FSMO' },
          { type: 'p', content: 'FSMO (Flexible Single Master Operations) sont 5 rôles spéciaux qui ne peuvent exister que sur UN seul DC à la fois dans leur périmètre.' },
          { type: 'table', headers: ['Rôle FSMO', 'Périmètre', 'Rôle', 'Impact si indisponible'], rows: [
            ['Schema Master', 'Forêt', 'Seul DC pouvant modifier le schéma AD', 'Extensions de schéma impossibles'],
            ['Domain Naming Master', 'Forêt', 'Gère l\'ajout/suppression de domaines', 'Impossible d\'ajouter un domaine'],
            ['PDC Emulator', 'Domaine', 'Synchro horaire, lockouts, GPO, changements MDP', 'Authentifications lentes, horloges désync'],
            ['RID Master', 'Domaine', 'Distribue des blocs de RIDs aux DCs', 'Impossible de créer des objets AD'],
            ['Infrastructure Master', 'Domaine', 'Met à jour les références cross-domain', 'Problèmes avec groupes universels'],
          ]},
          { type: 'code', content: '# Voir les rôles FSMO :\nnetdom query fsmo\n\n# Ou via PowerShell :\nGet-ADDomain | Select-Object PDCEmulator, RIDMaster, InfrastructureMaster\nGet-ADForest | Select-Object SchemaMaster, DomainNamingMaster\n\n# Transférer un rôle FSMO (DC source toujours disponible) :\nMove-ADDirectoryServerOperationMasterRole `\n  -Identity "SRV-DC-02" `\n  -OperationMasterRole PDCEmulator\n\n# Saisir un rôle FSMO (DC source en panne - IRRÉVERSIBLE) :\n# ntdsutil → "roles" → "connections" → "connect to server SRV-DC-02"\n# → "quit" → "seize PDC"' },
        ],
      },

      {
        id: 'gpo',
        titre: 'GPO — Stratégies de Groupe',
        sections: [

          { type: 'h2', content: '1. Qu\'est-ce qu\'une GPO ?' },
          { type: 'p', content: 'Une GPO (Group Policy Object) est un ensemble de paramètres de configuration appliqués automatiquement aux utilisateurs et ordinateurs d\'un domaine AD. Elle permet de <strong>standardiser</strong> les configurations, <strong>renforcer la sécurité</strong> et <strong>automatiser</strong> des tâches sur des milliers de machines.' },
          { type: 'table', headers: ['Ce qu\'une GPO peut faire', 'Exemples'], rows: [
            ['Sécurité système', 'Politique de mots de passe, verrouillage de compte, audit'],
            ['Interface utilisateur', 'Fond d\'écran imposé, désactiver le panneau de configuration'],
            ['Logiciels', 'Installer/désinstaller des applications automatiquement (MSI)'],
            ['Scripts', 'Exécuter des scripts au démarrage/arrêt/connexion/déconnexion'],
            ['Réseau', 'Mapper des lecteurs réseau, configurer les proxies'],
            ['Sécurité réseau', 'Règles pare-feu, IPSec, certificats'],
            ['Restrictions logicielles', 'AppLocker — bloquer certains exécutables'],
            ['Windows Update', 'Pointer vers WSUS, planifier les redémarrages'],
          ]},

          { type: 'h2', content: '2. Ordre d\'application LSDOU' },
          { type: 'p', content: 'Les GPO s\'appliquent dans un ordre précis. En cas de conflit, la dernière appliquée gagne (sauf exceptions).' },
          { type: 'table', headers: ['Ordre', 'Niveau', 'Portée', 'Exemple'], rows: [
            ['1 (1er appliqué)', 'Local (L)', 'La machine elle-même', 'gpedit.msc en local'],
            ['2', 'Site (S)', 'Machines du site AD physique', 'GPO appliquée au site Paris'],
            ['3', 'Domaine (D)', 'Tout le domaine', 'Politique de mots de passe domaine'],
            ['4 (dernier)', 'OU (OU)', 'L\'OU et ses sous-OUs', 'GPO spécifique à l\'OU Comptabilité'],
          ]},
          { type: 'info', content: '<strong>Résultat :</strong> L\'OU a la priorité la plus haute (écrase les niveaux précédents). Si une GPO de domaine dit "fond d\'écran bleu" et une GPO d\'OU dit "fond d\'écran rouge", les machines de l\'OU auront un fond rouge.' },

          { type: 'h2', content: '3. Créer et configurer une GPO' },
          { type: 'code', content: '# Via GPMC (Group Policy Management Console)\n# Ouvrir : gpmc.msc\n\n# Structure GPMC :\n# Forêt\n# └── Domaines\n#     └── tssr.local\n#         ├── Default Domain Policy (politique MDP domaine)\n#         ├── Objets de stratégie de groupe\n#         │   ├── GPO-Securite-Poste\n#         │   ├── GPO-Fond-Ecran\n#         │   └── GPO-Mappage-Lecteurs\n#         └── OUs\n#             ├── Informatique\n#             │   └── GPO-Admin-Outils (liée ici)\n#             └── Comptabilite\n#                 └── GPO-Restrictions (liée ici)\n\n# Créer une GPO via PowerShell :\nNew-GPO -Name "GPO-Securite-Postes" -Comment "Sécurité standard postes de travail"\n\n# Lier la GPO à une OU :\nNew-GPLink -Name "GPO-Securite-Postes" `\n  -Target "OU=Ordinateurs,DC=tssr,DC=local" `\n  -Enforced No `\n  -LinkEnabled Yes\n\n# Configurer un paramètre de la GPO (fond d\'écran) :\nSet-GPRegistryValue -Name "GPO-Fond-Ecran" `\n  -Key "HKCU\\Control Panel\\Desktop" `\n  -ValueName "Wallpaper" `\n  -Type String `\n  -Value "\\\\SRV-FICHIERS\\Commun\\wallpaper.jpg"\n\nSet-GPRegistryValue -Name "GPO-Fond-Ecran" `\n  -Key "HKCU\\Control Panel\\Desktop" `\n  -ValueName "WallpaperStyle" `\n  -Type String `\n  -Value "2"   # 2=Stretch 3=Tile 6=Fit 10=Fill 22=Span' },

          { type: 'h2', content: '4. GPO de sécurité essentielles' },
          { type: 'code', content: '# Politique de mots de passe (domaine entier)\n# Chemin : Config Ordi > Paramètres Windows > Paramètres de sécurité > Stratégies de compte\n\n# Configurer via PowerShell :\nSet-ADDefaultDomainPasswordPolicy -Identity "tssr.local" `\n  -MinPasswordLength 12 `\n  -ComplexityEnabled $true `\n  -MaxPasswordAge (New-TimeSpan -Days 90) `\n  -MinPasswordAge (New-TimeSpan -Days 1) `\n  -PasswordHistoryCount 12 `\n  -ReversibleEncryptionEnabled $false\n\n# Fine-Grained Password Policy (politiques différentes par groupe)\nNew-ADFineGrainedPasswordPolicy `\n  -Name "PSO-Admins" `\n  -Precedence 10 `\n  -MinPasswordLength 16 `\n  -PasswordHistoryCount 24 `\n  -MaxPasswordAge (New-TimeSpan -Days 60) `\n  -ComplexityEnabled $true `\n  -LockoutThreshold 3 `\n  -LockoutDuration (New-TimeSpan -Minutes 60) `\n  -LockoutObservationWindow (New-TimeSpan -Minutes 30)\n\n# Appliquer la PSO au groupe Admins\nAdd-ADFineGrainedPasswordPolicySubject `\n  -Identity "PSO-Admins" `\n  -Subjects "GG-Administrateurs"\n\n# Politique de verrouillage de compte\n# Seuil : 5 tentatives\n# Durée : 30 minutes\n# Remise à zéro : 30 minutes\n\n# Audit des connexions\n# Chemin : Config Ordi > Paramètres Windows > Paramètres sécu > Stratégies locales > Audit\n# Activer : Audit des connexions → Succès et Échecs\n# Activer : Audit des changements de stratégie de compte → Succès\n# Activer : Audit de la gestion des comptes → Succès et Échecs' },

          { type: 'h2', content: '5. Scripts via GPO' },
          { type: 'code', content: '# Mappage de lecteurs réseau au logon\n# Chemin : Config User > Paramètres Windows > Scripts > Ouverture de session\n# Ou : Config User > Préférences > Paramètres Windows > Mappages de lecteurs\n\n# Script PowerShell de logon (mappage_lecteurs.ps1) :\n$user = $env:USERNAME\n$dept = (Get-ADUser $user -Properties Department).Department\n\n# Lecteur commun pour tous\nNew-PSDrive -Name "Z" -PSProvider FileSystem `\n  -Root "\\\\SRV-FICHIERS\\Commun" -Persist\n\n# Lecteur selon le département\nswitch ($dept) {\n  "Informatique"  { New-PSDrive -Name "Y" -PSProvider FileSystem -Root "\\\\SRV-FICHIERS\\IT" -Persist }\n  "Comptabilite"  { New-PSDrive -Name "Y" -PSProvider FileSystem -Root "\\\\SRV-FICHIERS\\Compta" -Persist }\n  "Direction"     { New-PSDrive -Name "Y" -PSProvider FileSystem -Root "\\\\SRV-FICHIERS\\Direction" -Persist }\n}\n\n# Lecteur personnel\nNew-PSDrive -Name "H" -PSProvider FileSystem `\n  -Root "\\\\SRV-FICHIERS\\Home\\$user" -Persist\n\n# Script de démarrage machine (startup.ps1) :\n# À placer dans : Config Ordi > Paramètres Windows > Scripts > Démarrage\n\n# Vérifier et installer un certificat\nif (-not (Get-ChildItem Cert:\\LocalMachine\\Root | Where-Object Subject -like "*TSSR-CA*")) {\n  Import-Certificate -FilePath "\\\\SRV-PKI\\certs\\TSSR-RootCA.cer" `\n    -CertStoreLocation Cert:\\LocalMachine\\Root\n  Write-EventLog -LogName Application -Source "GPO-Script" `\n    -EventId 1001 -Message "Certificat TSSR-CA installé"\n}' },

          { type: 'h2', content: '6. Dépannage des GPO' },
          { type: 'code', content: '# Forcer l\'application des GPO\ngpupdate /force\ngpupdate /force /boot   # Forcer + redémarrer si nécessaire\ngpupdate /force /logoff # Forcer + déconnecter si nécessaire\n\n# Voir les GPO appliquées sur la machine locale\ngpresult /R              # Résumé texte dans le terminal\ngpresult /H C:\\gpo.html  # Rapport HTML détaillé\ngpresult /Scope Computer # Seulement ordinateur\ngpresult /Scope User     # Seulement utilisateur\ngpresult /User j.dupont /H C:\\gpo_jean.html\n\n# Exemple de sortie gpresult /R :\n# INFORMATIONS SUR L\'ORDINATEUR\n# Nom CN de l\'ordinateur : PC-JEAN.tssr.local\n# GPO appliquées :\n#   Default Domain Policy\n#   GPO-Securite-Postes\n#   GPO-Fond-Ecran\n# GPO refusées : aucune\n\n# INFORMATIONS SUR L\'UTILISATEUR\n# Nom CN : Jean Dupont\n# OU de l\'utilisateur : OU=Informatique...\n# GPO appliquées :\n#   Default Domain Policy\n#   GPO-Mappage-Lecteurs\n\n# Outil RSoP (Resultant Set of Policy)\nrsop.msc    # Interface graphique\n\n# Problèmes courants :\n# GPO non appliquée → vérifier :\n# 1. GPO bien liée à l\'OU correcte\n# 2. Filtrage de sécurité : groupe contient bien l\'objet\n# 3. gpupdate /force exécuté\n# 4. WMI filter ne bloque pas\n# 5. Héritage bloqué sur l\'OU ?' },
        ],
      },

      {
        id: 'dns-dhcp-windows',
        titre: 'DNS et DHCP sur Windows Server',
        sections: [

          { type: 'h2', content: '1. DNS Windows Server' },
          { type: 'p', content: 'Le DNS est INDISPENSABLE à Active Directory. Sans DNS fonctionnel, les clients ne trouvent pas les DCs, Kerberos ne fonctionne pas, les GPO ne s\'appliquent pas.' },
          { type: 'code', content: '# Installation du rôle DNS\nInstall-WindowsFeature DNS -IncludeManagementTools\n\n# Créer une zone DNS principale\nAdd-DnsServerPrimaryZone -Name "tssr.local" `\n  -ReplicationScope "Domain" `\n  -DynamicUpdate "Secure"\n\n# Créer une zone de recherche inversée\nAdd-DnsServerPrimaryZone -NetworkId "192.168.1.0/24" `\n  -ReplicationScope "Domain" `\n  -DynamicUpdate "Secure"\n\n# Enregistrements A\nAdd-DnsServerResourceRecordA -ZoneName "tssr.local" `\n  -Name "srv-web" `\n  -IPv4Address "192.168.1.20" `\n  -TimeToLive (New-TimeSpan -Seconds 3600)\n\n# Enregistrements CNAME\nAdd-DnsServerResourceRecordCName -ZoneName "tssr.local" `\n  -Name "www" `\n  -HostNameAlias "srv-web.tssr.local"\n\n# Enregistrements MX\nAdd-DnsServerResourceRecordMX -ZoneName "tssr.local" `\n  -Name "." `\n  -MailExchange "srv-mail.tssr.local" `\n  -Preference 10\n\n# Enregistrement PTR (DNS inversé)\nAdd-DnsServerResourceRecordPtr -ZoneName "1.168.192.in-addr.arpa" `\n  -Name "20" `\n  -PtrDomainName "srv-web.tssr.local"\n\n# Transfert conditionnel (resolver d\'autres domaines)\nAdd-DnsServerConditionalForwarderZone -Name "partenaire.fr" `\n  -MasterServers "203.0.113.1" `\n  -ReplicationScope "Domain"\n\n# Forwarders globaux (résolution Internet)\nSet-DnsServerForwarder -IPAddress "8.8.8.8","1.1.1.1"\n\n# Vérifier et diagnostiquer :\nGet-DnsServerResourceRecord -ZoneName "tssr.local" | Format-Table\nTest-DnsServer -IPAddress 192.168.1.10 -ComputerName SRV-DC-01\nnslookup srv-web.tssr.local 192.168.1.10\nnslookup -type=SRV _ldap._tcp.tssr.local' },

          { type: 'h2', content: '2. DHCP Windows Server' },
          { type: 'code', content: '# Installation\nInstall-WindowsFeature DHCP -IncludeManagementTools\n\n# Autoriser le serveur DHCP dans AD (obligatoire en domaine)\nAdd-DhcpServerInDC -DnsName "srv-dc-01.tssr.local" -IPAddress 192.168.1.10\n\n# Créer une étendue (scope)\nAdd-DhcpServerv4Scope `\n  -Name "LAN-Principal" `\n  -Description "Réseau principal 192.168.1.0/24" `\n  -StartRange 192.168.1.100 `\n  -EndRange 192.168.1.200 `\n  -SubnetMask 255.255.255.0 `\n  -State Active `\n  -LeaseDuration (New-TimeSpan -Hours 24)\n\n# Configurer les options DHCP\nSet-DhcpServerv4OptionValue -ScopeId 192.168.1.0 `\n  -Router 192.168.1.1 `\n  -DnsServer 192.168.1.10,192.168.1.11 `\n  -DnsDomain "tssr.local" `\n  -WinsServer 192.168.1.10\n\n# Exclusions (IPs déjà utilisées en statique)\nAdd-DhcpServerv4ExclusionRange `\n  -ScopeId 192.168.1.0 `\n  -StartRange 192.168.1.1 `\n  -EndRange 192.168.1.99\n\n# Réservation DHCP (IP fixe basée sur la MAC)\nAdd-DhcpServerv4Reservation `\n  -ScopeId 192.168.1.0 `\n  -IPAddress 192.168.1.150 `\n  -ClientId "00-1A-2B-3C-4D-5E" `\n  -Description "Imprimante HP LaserJet"\n\n# DHCP Failover (haute disponibilité entre 2 serveurs DHCP)\nAdd-DhcpServerv4Failover `\n  -Name "DHCP-Failover-LAN" `\n  -PartnerServer "SRV-DC-02" `\n  -ScopeId 192.168.1.0 `\n  -Mode HotStandby `\n  -MaxClientLeadTime (New-TimeSpan -Hours 1) `\n  -SharedSecret "S3cr3t!DHCP"\n\n# Voir les baux actifs\nGet-DhcpServerv4Lease -ScopeId 192.168.1.0 | `\n  Select-Object IPAddress, ClientId, HostName, LeaseExpiryTime | `\n  Sort-Object IPAddress\n\n# Voir les statistiques\nGet-DhcpServerv4ScopeStatistics\n\n# Compaction de la base DHCP\nInvoke-DhcpServerv4DatabaseBackup -Path "C:\\DHCP-Backup"\nInvoke-DhcpServerv4DatabaseRestore -Path "C:\\DHCP-Backup"' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
    windows_cli: true,
    netrunner: true,
  },
  {
    id: 'windows-server',
    label: 'Windows Server 2025',
    icon: '🖥️',
    color: '#0ea5e9',
    desc: 'Installation, configuration, Active Directory, GPO, DNS, DHCP...',
    topics: ['Installation', 'AD DS', 'GPO', 'DNS', 'DHCP', 'IIS', 'RDS'],
    windows_cli: true,
    cours: [
      {
        id: 'install-ws2025',
        titre: 'Installation Windows Server 2025',
        sections: [
          { type: 'h2', content: 'Prérequis matériels' },
          { type: 'table', headers: ['Composant', 'Minimum', 'Recommandé'], rows: [
            ['CPU',    '2 GHz 64 bits',  '2 GHz 64 bits (multicœur)'],
            ['RAM',    '2 Go',            '16 Go'],
            ['Disque', '32 Go',           '100 Go'],
            ['Réseau', 'Carte Ethernet',  'Carte Ethernet Gigabit'],
          ]},
          { type: 'h2', content: 'Éditions disponibles' },
          { type: 'table', headers: ['Édition', 'Description'], rows: [
            ['Standard',   'Virtualisation limitée : 2 VMs incluses'],
            ['Datacenter', 'VMs illimitées — environnements cloud et datacenter'],
            ['Essentials', '25 utilisateurs max — petites structures'],
          ]},
          { type: 'h2', content: 'Processus d\'installation pas à pas' },
          { type: 'steps', items: [
            { num: '1', title: 'Démarrer depuis l\'ISO',         content: 'Sélectionner la langue, le fuseau horaire et la disposition du clavier.' },
            { num: '2', title: 'Choisir l\'édition',             content: '<strong>Standard avec interface graphique</strong> (Desktop Experience) recommandé pour débuter.' },
            { num: '3', title: 'Type d\'installation',           content: '<strong>Personnalisée</strong> — nouvelle installation propre sur le disque cible.' },
            { num: '4', title: 'Partitionnement',                content: 'Créer une partition système de <strong>100 Go minimum</strong>.' },
            { num: '5', title: 'Mot de passe Administrateur',    content: 'Minimum 12 caractères — majuscule + chiffre + symbole obligatoire.' },
            { num: '6', title: 'Configuration post-installation', content: 'Renommer le serveur, configurer l\'IP fixe, activer Windows Update.' },
          ]},
          { type: 'h2', content: 'Configuration IP fixe (PowerShell)' },
          { type: 'code', content: 'New-NetIPAddress -InterfaceAlias "Ethernet" -IPAddress 192.168.1.10 -PrefixLength 24 -DefaultGateway 192.168.1.1\nSet-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses 192.168.1.10' },
          { type: 'h2', content: 'Renommer le serveur' },
          { type: 'code', content: 'Rename-Computer -NewName "SRV-TSSR-01" -Restart' },
          { type: 'warn', content: 'Toujours configurer une IP fixe avant de promouvoir en contrôleur de domaine.' },
          { type: 'h2', content: 'Gestionnaire de serveur (Server Manager)' },
          { type: 'p', content: 'Interface centrale de Windows Server. Permet d\'ajouter des rôles et fonctionnalités, surveiller les événements et gérer les services.' },
          { type: 'ul', items: [
            'Tableau de bord',
            'Serveur local',
            'Tous les serveurs',
            'Rôles installés',
          ]},
        ],
      },
      {
        id: 'active-directory',
        titre: 'Active Directory — Installation et Configuration',
        sections: [
          { type: 'h2', content: 'Qu\'est-ce qu\'Active Directory ?' },
          { type: 'p', content: 'Service d\'annuaire Microsoft qui centralise l\'authentification et la gestion des ressources réseau. Basé sur les protocoles LDAP et Kerberos.' },
          { type: 'table', headers: ['Objet', 'Description', 'Exemple'], rows: [
            ['Domaine',               'Unité administrative principale',         'tssr.local'],
            ['Forêt',                 'Ensemble de domaines liés',               'tssr.local + filiale.tssr.local'],
            ['OU (Unité d\'Org.)',    'Conteneur pour organiser les objets',     'OU=Informatique,DC=tssr,DC=local'],
            ['Utilisateur',           'Compte d\'accès',                         'anthony.agnolon@tssr.local'],
            ['Groupe',                'Collection d\'utilisateurs',               'GRP-Admins-IT'],
            ['GPO',                   'Stratégie de groupe',                      'Fond d\'écran imposé'],
          ]},
          { type: 'h2', content: 'Installer le rôle AD DS' },
          { type: 'steps', items: [
            { num: '1', title: 'Via Server Manager',                   content: 'Gérer → Ajouter des rôles → Active Directory Domain Services → Suivant jusqu\'à Installation.' },
            { num: '2', title: 'Via PowerShell',                       code: 'Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools' },
            { num: '3', title: 'Promouvoir en contrôleur de domaine',  content: 'Cliquer sur le drapeau jaune dans Server Manager → Promouvoir ce serveur.' },
            { num: '4', title: 'Nouvelle forêt',                       content: 'Nom de domaine racine : <code>tssr.local</code>' },
            { num: '5', title: 'Niveau fonctionnel',                   content: 'Windows Server 2016 minimum recommandé.' },
            { num: '6', title: 'Mot de passe DSRM',                   content: 'Mode restauration des services d\'annuaire — à conserver précieusement.' },
            { num: '7', title: 'Redémarrage automatique',              content: 'Le serveur redémarre et devient contrôleur de domaine.' },
          ]},
          { type: 'h2', content: 'Gestion des utilisateurs (PowerShell)' },
          { type: 'code', content: '# Créer un utilisateur\nNew-ADUser -Name "Jean Dupont" -GivenName "Jean" -Surname "Dupont" `\n  -SamAccountName "j.dupont" -UserPrincipalName "j.dupont@tssr.local" `\n  -Path "OU=Utilisateurs,DC=tssr,DC=local" `\n  -AccountPassword (ConvertTo-SecureString "P@ssword123" -AsPlainText -Force) `\n  -Enabled $true\n\n# Lister tous les utilisateurs\nGet-ADUser -Filter * | Select-Object Name, SamAccountName, Enabled\n\n# Désactiver un compte\nDisable-ADAccount -Identity "j.dupont"\n\n# Réinitialiser un mot de passe\nSet-ADAccountPassword -Identity "j.dupont" -Reset `\n  -NewPassword (ConvertTo-SecureString "NewP@ss123" -AsPlainText -Force)' },
          { type: 'h2', content: 'Gestion des groupes' },
          { type: 'code', content: '# Créer un groupe\nNew-ADGroup -Name "GRP-Informatique" -GroupScope Global -GroupCategory Security `\n  -Path "OU=Groupes,DC=tssr,DC=local"\n\n# Ajouter un membre\nAdd-ADGroupMember -Identity "GRP-Informatique" -Members "j.dupont"\n\n# Lister les membres\nGet-ADGroupMember -Identity "GRP-Informatique"' },
          { type: 'h2', content: 'Gestion des Unités d\'Organisation' },
          { type: 'code', content: '# Créer une OU\nNew-ADOrganizationalUnit -Name "Informatique" -Path "DC=tssr,DC=local"\n\n# Lister les OUs\nGet-ADOrganizationalUnit -Filter * | Select-Object Name, DistinguishedName' },
          { type: 'h2', content: 'GPO — Stratégies de Groupe' },
          { type: 'p', content: 'Les GPO permettent d\'imposer des paramètres sur les utilisateurs et ordinateurs du domaine.' },
          { type: 'steps', items: [
            { num: '1', title: 'Ouvrir GPMC',            content: '<code>gpmc.msc</code> dans Exécuter (Win+R).' },
            { num: '2', title: 'Créer une GPO',           content: 'Clic droit sur l\'OU cible → Créer un objet GPO dans ce domaine.' },
            { num: '3', title: 'Modifier la GPO',         content: 'Clic droit → Modifier → Configuration utilisateur ou Configuration ordinateur.' },
            { num: '4', title: 'Exemples utiles',         content: 'Fond d\'écran imposé, désactiver les ports USB, mapper un lecteur réseau.' },
            { num: '5', title: 'Forcer l\'application',   code: 'gpupdate /force' },
          ]},
          { type: 'code', content: '# Voir les GPO appliquées sur un poste client\ngpresult /R\ngpresult /H rapport.html' },
        ],
      },
      {
        id: 'dns-dhcp',
        titre: 'DNS &amp; DHCP sur Windows Server',
        sections: [
          { type: 'h2', content: 'DNS — Domain Name System' },
          { type: 'p', content: 'Traduit les noms de domaine en adresses IP. Essentiel au fonctionnement d\'Active Directory.' },
          { type: 'table', headers: ['Type', 'Rôle', 'Exemple'], rows: [
            ['A',     'Nom → IPv4',               'srv01.tssr.local → 192.168.1.10'],
            ['AAAA',  'Nom → IPv6',               'srv01.tssr.local → ::1'],
            ['PTR',   'IPv4 → Nom (DNS inversé)', '192.168.1.10 → srv01.tssr.local'],
            ['MX',    'Serveur mail',              'tssr.local → mail.tssr.local'],
            ['CNAME', 'Alias',                     'www.tssr.local → srv-web.tssr.local'],
          ]},
          { type: 'code', content: '# Installer le rôle DNS\nInstall-WindowsFeature -Name DNS -IncludeManagementTools\n\n# Créer un enregistrement A\nAdd-DnsServerResourceRecordA -ZoneName "tssr.local" -Name "srv-web" -IPv4Address "192.168.1.20"\n\n# Vérifier la résolution\nResolve-DnsName srv-web.tssr.local\n\n# Vider le cache DNS\nClear-DnsServerCache' },
          { type: 'h2', content: 'DHCP — Dynamic Host Configuration Protocol' },
          { type: 'p', content: 'Attribue automatiquement les paramètres réseau aux clients : adresse IP, masque, passerelle, serveur DNS.' },
          { type: 'steps', items: [
            { num: '1', title: 'Installer le rôle DHCP',       code: 'Install-WindowsFeature -Name DHCP -IncludeManagementTools' },
            { num: '2', title: 'Autoriser le serveur dans AD',  code: 'Add-DhcpServerInDC -DnsName "srv01.tssr.local"' },
            { num: '3', title: 'Créer une étendue',             content: 'Définir la plage d\'adresses IP à distribuer aux clients.' },
            { num: '4', title: 'Configurer les options',        content: 'Passerelle (option 3), DNS (option 6), Domaine (option 15).' },
            { num: '5', title: 'Activer l\'étendue',            content: 'Mettre l\'étendue en état Actif pour commencer la distribution des baux.' },
          ]},
          { type: 'code', content: '# Créer une étendue DHCP\nAdd-DhcpServerv4Scope -Name "LAN-Principal" `\n  -StartRange 192.168.1.100 -EndRange 192.168.1.200 `\n  -SubnetMask 255.255.255.0 -State Active\n\n# Configurer les options\nSet-DhcpServerv4OptionValue -ScopeId 192.168.1.0 `\n  -Router 192.168.1.1 `\n  -DnsServer 192.168.1.10 `\n  -DnsDomain "tssr.local"\n\n# Voir les baux actifs\nGet-DhcpServerv4Lease -ScopeId 192.168.1.0' },
        ],
      },
      {
        id: 'powershell-scripting',
        titre: 'PowerShell Scripting — Automatisation Windows',
        sections: [
          { type: 'h2', content: 'Variables et types' },
          { type: 'code', content: '# Variables\n$nom = "Anthony"\n$age = 25\n$pi = 3.14\n$vrai = $true\n\n# Afficher\nWrite-Host "Bonjour $nom, tu as $age ans"\nWrite-Output $nom\n\n# Types\n[string]$texte = "hello"\n[int]$nombre = 42\n[bool]$actif = $true\n[array]$liste = @("a", "b", "c")\n[hashtable]$dico = @{ nom="Jean"; age=30 }' },
          { type: 'h2', content: 'Conditions et boucles' },
          { type: 'code', content: '# If/ElseIf/Else\n$score = 85\nif ($score -ge 90) {\n    Write-Host "Excellent"\n} elseif ($score -ge 70) {\n    Write-Host "Bien"\n} else {\n    Write-Host "À améliorer"\n}\n\n# Opérateurs de comparaison PowerShell\n-eq    # égal\n-ne    # différent\n-gt    # supérieur\n-ge    # supérieur ou égal\n-lt    # inférieur\n-le    # inférieur ou égal\n-like  # correspondance avec wildcard (*)\n-match # correspondance regex\n\n# ForEach\n$serveurs = @("SRV-01", "SRV-02", "SRV-03")\nforeach ($srv in $serveurs) {\n    Write-Host "Vérification de $srv..."\n    Test-Connection $srv -Count 1 -Quiet\n}\n\n# While\n$i = 0\nwhile ($i -lt 5) {\n    Write-Host "Itération $i"\n    $i++\n}\n\n# For\nfor ($i = 1; $i -le 10; $i++) {\n    Write-Host "Ligne $i"\n}' },
          { type: 'h2', content: 'Fonctions' },
          { type: 'code', content: '# Définir une fonction\nfunction Get-InfoServeur {\n    param(\n        [string]$NomServeur,\n        [int]$Timeout = 100\n    )\n    $ping = Test-Connection -ComputerName $NomServeur -Count 1 -Quiet\n    $os = Get-WmiObject -ComputerName $NomServeur -Class Win32_OperatingSystem\n    return [PSCustomObject]@{\n        Serveur    = $NomServeur\n        Accessible = $ping\n        OS         = $os.Caption\n        RAM_Go     = [math]::Round($os.TotalVisibleMemorySize / 1MB, 2)\n    }\n}\n\n# Appel\nGet-InfoServeur -NomServeur "SRV-01"\nGet-InfoServeur -NomServeur "SRV-AD" -Timeout 200' },
          { type: 'h2', content: 'Gestion des fichiers et logs' },
          { type: 'code', content: '# Lire un fichier\nGet-Content C:\\\\logs\\\\app.log\nGet-Content C:\\\\logs\\\\app.log -Tail 50    # 50 dernières lignes\nGet-Content C:\\\\logs\\\\app.log -Wait       # En temps réel\n\n# Écrire dans un fichier\n"Ligne de log" | Out-File C:\\\\logs\\\\script.log -Append\nAdd-Content C:\\\\logs\\\\script.log "$(Get-Date) - Action effectuée"\n\n# Filtrer avec Select-String (équivalent grep)\nSelect-String -Path C:\\\\logs\\\\*.log -Pattern "ERROR"\nGet-Content app.log | Select-String "CRITICAL" | Out-File erreurs.txt' },
          { type: 'h2', content: 'Script de rapport AD automatique' },
          { type: 'code', content: '# rapport_ad.ps1 — Exemple complet\nparam([string]$OutputPath = "C:\\\\Rapports")\n\n$date = Get-Date -Format "yyyy-MM-dd"\n$fichier = "$OutputPath\\\\rapport_AD_$date.txt"\n\n# Utilisateurs inactifs depuis 30 jours\n$dateRef = (Get-Date).AddDays(-30)\n$inactifs = Get-ADUser -Filter {LastLogonDate -lt $dateRef -and Enabled -eq $true} `\n            -Properties LastLogonDate |\n            Select-Object Name, SamAccountName, LastLogonDate\n\n# Comptes expirés\n$expires = Search-ADAccount -AccountExpired | Select-Object Name, SamAccountName\n\n# Écriture du rapport\n"=== RAPPORT AD DU $date ===" | Out-File $fichier\n"`n--- Utilisateurs inactifs ($($inactifs.Count)) ---" | Out-File $fichier -Append\n$inactifs | Format-Table | Out-File $fichier -Append\n"`n--- Comptes expirés ($($expires.Count)) ---" | Out-File $fichier -Append\n$expires | Format-Table | Out-File $fichier -Append\n\nWrite-Host "Rapport généré : $fichier"' },
        ],
      },
      {
        id: 'gpo-avancees',
        titre: 'GPO Avancées — Scripts, Sécurité, Préférences',
        sections: [
          { type: 'h2', content: 'Architecture des GPO' },
          { type: 'p', content: 'Les GPO s\'appliquent dans l\'ordre LSDOU (Local → Site → Domain → OU). Une GPO appliquée en dernier écrase les précédentes.' },
          { type: 'table', headers: ['Niveau', 'Priorité', 'Exemple'], rows: [
            ['Local',     '1 (plus faible)', 'Gpedit.msc sur la machine'],
            ['Site',      '2',               'Règles pour un bâtiment'],
            ['Domaine',   '3',               'Règles pour tout le domaine'],
            ['OU Parent', '4',               'Règles pour le département'],
            ['OU Enfant', '5 (plus fort)',   'Règles pour le service'],
          ]},
          { type: 'h2', content: 'GPO de sécurité essentielles' },
          { type: 'code', content: '# Paramètres via GPMC :\n# Config ordinateur → Paramètres Windows → Paramètres de sécurité\n\n# Politique de mots de passe :\nLongueur minimale            : 12 caractères\nComplexité requise           : Activé\nDurée de vie maximale        : 90 jours\nHistorique des mots de passe : 10 derniers mémorisés\n\n# Verrouillage de compte :\nSeuil de verrouillage        : 5 tentatives\nDurée de verrouillage        : 30 minutes\nRéinitialisation compteur    : 30 minutes\n\n# Audit :\nAudit des connexions         : Succès et Échecs\nAudit des changements AD     : Activé\nAudit accès aux objets       : Activé' },
          { type: 'h2', content: 'Scripts de démarrage/connexion via GPO' },
          { type: 'code', content: '# Chemin : Config Ordinateur → Paramètres Windows → Scripts → Démarrage\n\n# mappage_lecteurs.ps1\nNew-PSDrive -Name "Z" -PSProvider FileSystem `\n            -Root "\\\\\\\\SRV-FILE\\\\Partages\\\\$env:USERNAME" -Persist\n\nNew-PSDrive -Name "Y" -PSProvider FileSystem `\n            -Root "\\\\\\\\SRV-FILE\\\\Commun" -Persist\n\n# Chemin : Config Utilisateur → Paramètres Windows → Scripts → Ouverture de session' },
          { type: 'h2', content: 'Filtrage et ciblage des GPO' },
          { type: 'code', content: '# Filtrage WMI — Appliquer GPO uniquement si condition vraie\n# Exemple : appliquer seulement sur Windows 11\nSELECT * FROM Win32_OperatingSystem WHERE Version LIKE "10.0.2%"\n\n# Filtrage de sécurité\n# Par défaut : Utilisateurs authentifiés (tous)\n# Personnalisé : Groupe spécifique (ex: GRP-Informatique)\n\n# Héritage bloqué : empêche les GPO parentes de s\'appliquer\n# Obligatoire (Enforced) : la GPO s\'applique même si héritage bloqué' },
          { type: 'h2', content: 'Vérification et dépannage GPO' },
          { type: 'code', content: '# Sur le client Windows\ngpupdate /force                      # Forcer la mise à jour\ngpresult /R                          # Résumé textuel\ngpresult /H C:\\\\rapport_gpo.html      # Rapport HTML détaillé\nrsop.msc                             # Résultant de stratégie (GUI)\n\n# Événements GPO dans l\'observateur d\'événements\n# Journal : Apps and Services Logs → Microsoft → Windows → GroupPolicy → Operational' },
        ],
      },
      {
        id: 'wsus-hyperv',
        titre: 'WSUS et Hyper-V — Mises à jour et Virtualisation',
        sections: [
          { type: 'h2', content: 'WSUS — Windows Server Update Services' },
          { type: 'p', content: 'WSUS centralise la gestion des mises à jour Windows pour tout le parc informatique.' },
          { type: 'steps', items: [
            { num: '1', title: 'Installation',           content: 'Server Manager → Ajouter rôles → Windows Server Update Services → Choisir le stockage (ex: D:\\WSUS).' },
            { num: '2', title: 'Configuration initiale', content: 'Sélectionner la source (Microsoft Update), choisir les langues et produits à synchroniser.' },
            { num: '3', title: 'Synchronisation',        content: 'Télécharger les mises à jour depuis Microsoft Update.' },
            { num: '4', title: 'Approbation',            content: 'Approuver manuellement ou automatiquement les mises à jour par groupe.' },
            { num: '5', title: 'GPO client',             content: 'Configurer les postes via GPO pour pointer vers le serveur WSUS (port 8530).' },
          ]},
          { type: 'code', content: '# GPO pour pointer les clients vers WSUS :\n# Config Ordinateur → Modèles d\'administration → Windows Update\n# Spécifier l\'emplacement intranet du service de mise à jour Microsoft\n# URL : http://SRV-WSUS:8530\n\n# PowerShell — Vérifier les mises à jour en attente\nGet-WindowsUpdate\nInstall-WindowsUpdate -AcceptAll -AutoReboot' },
          { type: 'h2', content: 'Hyper-V — Virtualisation Windows' },
          { type: 'code', content: '# Activer Hyper-V\nEnable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All\n\n# Ou via PowerShell Server\nInstall-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart\n\n# Créer un switch virtuel\nNew-VMSwitch -Name "Switch-LAN" -NetAdapterName "Ethernet" -AllowManagementOS $true\n\n# Créer une VM\nNew-VM -Name "VM-Debian" -MemoryStartupBytes 2GB -Generation 2 `\n       -NewVHDPath "D:\\\\VMs\\\\VM-Debian.vhdx" -NewVHDSizeBytes 50GB `\n       -SwitchName "Switch-LAN"\n\n# Configurer le démarrage sur ISO\nAdd-VMDvdDrive -VMName "VM-Debian"\nSet-VMDvdDrive -VMName "VM-Debian" -Path "D:\\\\ISO\\\\debian-12.iso"\n\n# Démarrer la VM\nStart-VM -Name "VM-Debian"\n\n# Gérer les snapshots\nCheckpoint-VM -Name "VM-Debian" -SnapshotName "Avant-config"\nRestore-VMCheckpoint -VMName "VM-Debian" -Name "Avant-config"\nRemove-VMCheckpoint -VMName "VM-Debian" -Name "Avant-config"' },
          { type: 'table', headers: ['Type switch Hyper-V', 'Description', 'Usage'], rows: [
            ['Externe', 'Connecté à la carte réseau physique', 'Accès réseau réel'],
            ['Interne', 'Entre VMs et hôte uniquement',        'Lab isolé avec accès hôte'],
            ['Privé',   'Entre VMs uniquement',                'Lab totalement isolé'],
          ]},
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },

  {
    id: 'virtualisation',
    label: 'Virtualisation',
    icon: '📦',
    color: '#8b5cf6',
    desc: 'Concepts, VMware Workstation, Hyper-V, VirtualBox — création et gestion de VMs',
    topics: ['Hyperviseur', 'VMware', 'Hyper-V', 'VirtualBox', 'Snapshots', 'Réseaux VM'],
    windows_cli: true,
    cours: [
      {
        id: 'vmware-vsphere',
        titre: 'VMware ESXi & vSphere — Virtualisation Entreprise',
        sections: [
          { type: 'h2', content: 'Architecture VMware vSphere' },
          { type: 'table', headers: ['Composant', 'Rôle'], rows: [
            ['ESXi (Hyperviseur)', 'Couche de virtualisation installée sur le serveur physique — Type 1 bare-metal'],
            ['vCenter Server', 'Gestion centralisée de plusieurs hôtes ESXi — moteur d\'automatisation'],
            ['vSphere Client', 'Interface web pour administrer ESXi et vCenter'],
            ['vMotion', 'Migration à chaud des VMs entre hôtes sans interruption'],
            ['HA (High Availability)', 'Redémarrage automatique des VMs si un hôte tombe'],
            ['DRS', 'Distributed Resource Scheduler — équilibrage automatique de charge'],
            ['vSAN', 'Stockage partagé via les disques locaux des hôtes ESXi'],
            ['NSX', 'Virtualisation réseau et micro-segmentation'],
          ]},
          { type: 'h2', content: 'Gestion ESXi via CLI (ESXCLI)' },
          { type: 'code', content: '# Connexion SSH à l\'hôte ESXi\nssh root@192.168.1.200\n\n# Informations système\nesxcli system version get\nesxcli hardware platform get\nesxcli storage core device list     # Disques physiques\n\n# Gestion des VMs\nvim-cmd vmsvc/getallvms             # Lister toutes les VMs\nvim-cmd vmsvc/power.on 1            # Démarrer VM ID 1\nvim-cmd vmsvc/power.off 1           # Éteindre VM ID 1\nvim-cmd vmsvc/snapshot.create 1 "avant-maj" "Avant mise à jour"\n\n# Réseau\nesxcli network nic list             # Interfaces physiques\nesxcli network vswitch standard list # vSwitches\nesxcli network ip interface list    # IPs configurées\n\n# Performances\nesxtop                              # Équivalent top pour ESXi\nvscsiStats -l                       # Stats stockage' },
          { type: 'h2', content: 'Types de stockage VMware' },
          { type: 'table', headers: ['Type', 'Description', 'Usage'], rows: [
            ['VMFS', 'Système de fichiers VMware sur LUN SAN/iSCSI', 'Datastore partagé entre hôtes'],
            ['NFS', 'Partage NFS depuis NAS', 'Datastore réseau'],
            ['vSAN', 'Stockage hyper-convergé via disques locaux', 'Cluster HCI'],
            ['RDM', 'Raw Device Mapping — disque physique passé à la VM', 'Bases de données'],
            ['vVols', 'Volumes virtuels sur baie de stockage intelligente', 'Stockage moderne'],
          ]},
          { type: 'h2', content: 'vMotion — Migration à chaud' },
          { type: 'code', content: '# Prérequis vMotion :\n# - Réseau dédié vMotion (10 Gbps recommandé)\n# - Stockage partagé (SAN/NAS/vSAN)\n# - CPU compatibles entre hôtes\n# - vCenter Server nécessaire\n\n# Via PowerCLI (PowerShell VMware)\nConnect-VIServer -Server vcenter.tssr.local\n\n# Migrer une VM vers un autre hôte\nMove-VM -VM "VM-WebServer" -Destination (Get-VMHost "ESXi-02")\n\n# Migrer avec changement de datastore\nMove-VM -VM "VM-WebServer" `\n        -Destination (Get-VMHost "ESXi-02") `\n        -Datastore (Get-Datastore "DS-SSD-02")' },
          { type: 'h2', content: 'Snapshots VMware' },
          { type: 'code', content: '# Via PowerCLI\nConnect-VIServer vcenter.tssr.local\n\n# Créer un snapshot\nNew-Snapshot -VM "VM-Prod" -Name "Avant-MAJ" -Description "Avant mise à jour KB5034441" -Memory -Quiesce\n\n# Lister les snapshots\nGet-Snapshot -VM "VM-Prod"\n\n# Revenir à un snapshot\nSet-VM -VM "VM-Prod" -Snapshot (Get-Snapshot -VM "VM-Prod" -Name "Avant-MAJ")\n\n# Supprimer un snapshot\nRemove-Snapshot -Snapshot (Get-Snapshot -VM "VM-Prod" -Name "Avant-MAJ") -Confirm:$false' },
          { type: 'warn', content: 'Les snapshots ne sont PAS des sauvegardes. Ils grossissent au fil du temps et dégradent les performances. À supprimer après utilisation.' },
        ],
      },
      {
        id: 'veeam-backup',
        titre: 'Veeam Backup & Replication — Sauvegarde des VMs',
        sections: [
          { type: 'h2', content: 'Architecture Veeam' },
          { type: 'table', headers: ['Composant', 'Rôle'], rows: [
            ['Veeam B&R Server', 'Orchestrateur — gère les jobs et la console'],
            ['Proxy de sauvegarde', 'Traite les données VM depuis l\'hyperviseur'],
            ['Repository', 'Destination des sauvegardes (disque NAS bande S3)'],
            ['Scale-out Repository', 'Pool de repositories pour auto-tiering'],
            ['Veeam ONE', 'Monitoring et reporting des infrastructures'],
          ]},
          { type: 'h2', content: 'Stratégie de sauvegarde 3-2-1' },
          { type: 'p', content: 'La règle d\'or de la sauvegarde pour garantir la récupérabilité des données.' },
          { type: 'table', headers: ['Règle', 'Description', 'Exemple'], rows: [
            ['3 copies', '3 copies des données', 'Original + 2 sauvegardes'],
            ['2 supports', 'Sur 2 types de supports différents', 'Disque local + NAS réseau'],
            ['1 hors site', '1 copie hors site ou cloud', 'Copie dans le cloud S3 ou datacenter distant'],
          ]},
          { type: 'h2', content: 'Types de sauvegarde' },
          { type: 'table', headers: ['Type', 'Description', 'Avantages', 'Inconvénients'], rows: [
            ['Complète', 'Copie intégrale de toutes les données', 'Simple à restaurer', 'Longue et volumineuse'],
            ['Incrémentale', 'Seulement les changements depuis la dernière sauvegarde', 'Rapide et légère', 'Restauration plus complexe'],
            ['Différentielle', 'Changements depuis la dernière sauvegarde complète', 'Compromis vitesse/simplicité', 'Plus volumineuse qu\'incrémentale'],
            ['Synthétique', 'Fusionne complète + incrémentiels sans re-lire les sources', 'Rapide sans impacter la prod', 'Nécessite Veeam ou équivalent'],
          ]},
          { type: 'h2', content: 'Configuration d\'un job Veeam' },
          { type: 'code', content: '# Via PowerShell Veeam\nAdd-PSSnapin VeeamPSSnapIn\n\n# Connecter au serveur Veeam\nConnect-VBRServer -Server "veeam-srv" -User "Administrator" -Password "P@ss"\n\n# Créer un job de sauvegarde\n$vm = Find-VBRViEntity -Name "VM-Prod"\n$repo = Get-VBRBackupRepository -Name "NAS-Backup"\n\nAdd-VBRViBackupJob -Name "Backup-VM-Prod" `\n    -Entity $vm `\n    -BackupRepository $repo `\n    -JobType Backup\n\n# Configurer la rétention (14 points de restauration)\n$job = Get-VBRJob -Name "Backup-VM-Prod"\nSet-VBRJobOptions -Job $job -MaxFullBackups 14\n\n# Lancer manuellement\nStart-VBRJob -Job (Get-VBRJob -Name "Backup-VM-Prod")\n\n# Voir les sessions de sauvegarde\nGet-VBRBackupSession | Select-Object JobName, CreationTime, Result' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'securite',
    label: 'Sécurité',
    icon: '🔐',
    color: '#ef4444',
    desc: 'PKI, certificats SSL/TLS, pare-feu, VPN, VLAN, CIA Triad...',
    topics: ['PKI', 'SSL/TLS', 'Pare-feu', 'iptables', 'VPN', 'VLAN'],
    linux_cli: true,
    windows_cli: true,
    cours: [
      {
        id: 'securite-fondamentaux',
        titre: 'Fondamentaux de la Sécurité Informatique',
        sections: [

          { type: 'h2', content: '1. La triade CIA — Piliers de la sécurité' },
          { type: 'p', content: 'Toute politique de sécurité repose sur trois piliers fondamentaux appelés la triade CIA (Confidentiality, Integrity, Availability). Compromettre l\'un d\'eux constitue un incident de sécurité.' },
          { type: 'table', headers: ['Pilier', 'Définition', 'Menaces', 'Contre-mesures'], rows: [
            ['Confidentialité', 'Les données ne sont accessibles qu\'aux personnes autorisées', 'Écoute réseau sniffing vol de données fuite', 'Chiffrement TLS VPN RBAC classification des données'],
            ['Intégrité', 'Les données ne peuvent pas être modifiées sans autorisation', 'Injection SQL Man-in-the-middle ransomware', 'Hash SHA-256 signatures numériques WORM'],
            ['Disponibilité', 'Les services sont accessibles quand les utilisateurs en ont besoin', 'DDoS panne matérielle ransomware', 'Redondance HA sauvegardes DRP CDN'],
          ]},
          { type: 'info', content: '<strong>Exemple concret :</strong> Un ransomware viole les trois piliers simultanément : il chiffre les données (confidentialité compromise car attaquant accède aux fichiers), les modifie (intégrité compromise) et les rend inaccessibles (disponibilité compromise).' },

          { type: 'h2', content: '2. Types d\'attaques et menaces' },
          { type: 'table', headers: ['Catégorie', 'Attaque', 'Description', 'Exemple réel'], rows: [
            ['Réseau', 'Man-in-the-Middle (MitM)', 'L\'attaquant s\'intercale entre deux parties qui communiquent', 'ARP Spoofing sur WiFi ouvert — vol de cookies de session'],
            ['Réseau', 'DDoS', 'Saturation d\'un service par des milliers de requêtes simultanées', 'Attaque DNS Amplification — serveur renvoie 70x la taille de la requête'],
            ['Réseau', 'Port Scanning', 'Découverte des services exposés', 'nmap -sV 192.168.1.10 avant une attaque ciblée'],
            ['Applicatif', 'SQL Injection', 'Injection de code SQL dans les entrées non filtrées', 'admin\' OR \'1\'=\'1 dans un formulaire de login'],
            ['Applicatif', 'XSS', 'Injection de code JavaScript dans une page web', 'Vol de cookies de session via script malveillant'],
            ['Social Engineering', 'Phishing', 'E-mails frauduleux imitant des entités légitimes', 'Faux mail Microsoft demandant les credentials AD'],
            ['Social Engineering', 'Spear Phishing', 'Phishing ciblé et personnalisé', 'Mail à Jean semblant venir de son DRH'],
            ['Logiciel', 'Ransomware', 'Chiffrement des données contre rançon', 'WannaCry (2017) — 300 000 machines en 4 jours'],
            ['Logiciel', 'Rootkit', 'Malware qui se cache dans l\'OS', 'Modification du kernel pour masquer sa présence'],
            ['Logiciel', 'Exploit 0-day', 'Vulnérabilité inconnue non corrigée', 'EternalBlue (NSA) utilisé par WannaCry'],
            ['Interne', 'Insider threat', 'Menace venant d\'un employé ou prestataire', 'Exfiltration de données par un employé mécontent'],
            ['Physique', 'Shoulder surfing', 'Observer quelqu\'un taper son mot de passe', 'Regarder par-dessus l\'épaule en open space'],
          ]},

          { type: 'h2', content: '3. Principe du moindre privilège' },
          { type: 'p', content: 'Chaque utilisateur, service ou processus ne doit avoir accès qu\'aux ressources strictement nécessaires à sa fonction. Ni plus, ni moins.' },
          { type: 'code', content: '# Exemples d\'application du moindre privilège :\n\n# Linux — Compte de service Apache\n# MAUVAIS : Apache qui tourne en root\nps aux | grep apache2 | grep root  # Ne devrait JAMAIS apparaître\n\n# BON : Apache en www-data (compte limité)\nps aux | grep apache2\n# www-data 1234 ... /usr/sbin/apache2\nls -la /var/www/html/\n# drwxr-xr-x 2 www-data www-data  # www-data possède ses fichiers\nls -la /etc/apache2/apache2.conf\n# -rw-r--r-- 1 root root  # Config : root propriétaire, www-data lit seulement\n\n# Windows — Compte de service SQL Server\n# MAUVAIS : service SQL en "Système Local" (droits admin)\n# BON : Compte de service dédié\nNew-LocalUser -Name "svc_sqlserver" `\n  -Password (ConvertTo-SecureString "Svc!SQL2024" -AsPlainText -Force) `\n  -AccountNeverExpires `\n  -PasswordNeverExpires\n# N\'ajouter que les droits minimum sur les dossiers SQL\n\n# Active Directory — Tiering model\n# Tier 0 : Domaine Controllers (comptes d\'admins domaine)\n# Tier 1 : Serveurs applicatifs (comptes d\'admins serveurs)\n# Tier 2 : Postes de travail (comptes d\'admins desktop)\n# Règle : un compte Tier 2 ne se connecte JAMAIS sur un Tier 0\n\n# Linux — sudo granulaire (pas sudo ALL)\n# MAUVAIS :\nanthony ALL=(ALL) NOPASSWD: ALL\n\n# BON : Seulement les commandes nécessaires\nanthony ALL=(ALL) /bin/systemctl start apache2, /bin/systemctl stop apache2\nmarie   ALL=(ALL) /usr/bin/apt update, /usr/bin/apt upgrade\nnagios  ALL=(ALL) NOPASSWD: /usr/lib/nagios/plugins/*' },

          { type: 'h2', content: '4. Défense en profondeur' },
          { type: 'p', content: 'La sécurité ne repose jamais sur un seul mécanisme. Plusieurs couches de protection indépendantes sont empilées pour qu\'un attaquant qui franchit l\'une soit bloqué par la suivante.' },
          { type: 'table', headers: ['Couche', 'Mécanisme', 'Exemple'], rows: [
            ['Physique', 'Accès contrôlé aux locaux', 'Badges, caméras, cage de Faraday pour serveurs'],
            ['Périmètre réseau', 'Firewall, IPS, DMZ', 'pfSense entre Internet et LAN'],
            ['Réseau interne', 'VLANs, ACL, NAC', 'VLAN séparé pour invités, 802.1X'],
            ['Hôte', 'Antivirus, EDR, pare-feu local', 'Windows Defender + CrowdStrike'],
            ['Application', 'WAF, validation entrées, auth', 'ModSecurity, OWASP, MFA'],
            ['Données', 'Chiffrement, DLP, backup', 'BitLocker, Azure Information Protection'],
            ['Identité', 'MFA, PAM, RBAC', 'Azure MFA, CyberArk, groupes AD'],
            ['Supervision', 'SIEM, logs centralisés', 'Splunk, ELK, alertes en temps réel'],
          ]},
        ],
      },

      {
        id: 'pare-feu',
        titre: 'Pare-feu — iptables, UFW et pfSense',
        sections: [

          { type: 'h2', content: '1. iptables — Le pare-feu Linux natif' },
          { type: 'p', content: 'iptables est le framework de filtrage de paquets du noyau Linux. UFW, firewalld et nftables sont des interfaces de plus haut niveau qui génèrent des règles iptables.' },
          { type: 'table', headers: ['Table', 'Chaînes', 'Usage'], rows: [
            ['filter (défaut)', 'INPUT FORWARD OUTPUT', 'Filtrage des paquets'],
            ['nat', 'PREROUTING POSTROUTING OUTPUT', 'Translation d\'adresses NAT/PAT'],
            ['mangle', 'PREROUTING INPUT FORWARD OUTPUT POSTROUTING', 'Modification des paquets (QoS TTL)'],
            ['raw', 'PREROUTING OUTPUT', 'Contrôle du suivi de connexion'],
          ]},
          { type: 'code', content: '# Voir les règles actuelles\niptables -L -v -n                    # Table filter\niptables -L -v -n --line-numbers     # Avec numéros de règles\niptables -t nat -L -v -n             # Table nat\niptables -t mangle -L -v -n          # Table mangle\n\n# Structure d\'une règle iptables :\n# iptables -[A/I/D] CHAINE [options] -j ACTION\n# -A = Append (ajouter en fin)\n# -I = Insert (insérer en début ou position)\n# -D = Delete (supprimer)\n\n# Actions disponibles :\n# ACCEPT  = Accepter le paquet\n# DROP    = Jeter silencieusement (timeout côté client)\n# REJECT  = Refuser avec message d\'erreur (ICMP port unreachable)\n# LOG     = Logger sans action\n# MASQUERADE = NAT dynamique\n# DNAT    = Destination NAT (port forwarding)\n# SNAT    = Source NAT\n\n# Configuration pare-feu serveur — Politique DROP par défaut\n\n# 1. Politique par défaut : tout bloquer\niptables -P INPUT DROP\niptables -P FORWARD DROP\niptables -P OUTPUT ACCEPT\n\n# 2. Autoriser le loopback (INDISPENSABLE)\niptables -A INPUT -i lo -j ACCEPT\niptables -A OUTPUT -o lo -j ACCEPT\n\n# 3. Autoriser les connexions établies et associées\niptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT\n# Sans cette règle, les réponses aux requêtes sortantes seraient bloquées !\n\n# 4. Autoriser SSH (depuis un IP spécifique uniquement)\niptables -A INPUT -p tcp --dport 22 -s 192.168.1.0/24 -j ACCEPT\n# Depuis n\'importe où (moins sécurisé) :\niptables -A INPUT -p tcp --dport 22 -j ACCEPT\n\n# 5. Autoriser les services\niptables -A INPUT -p tcp --dport 80 -j ACCEPT\niptables -A INPUT -p tcp --dport 443 -j ACCEPT\niptables -A INPUT -p tcp --dport 25 -j ACCEPT    # SMTP\niptables -A INPUT -p udp --dport 53 -j ACCEPT    # DNS\n\n# 6. Autoriser ICMP (ping) depuis le réseau local\niptables -A INPUT -p icmp --icmp-type echo-request -s 192.168.1.0/24 -j ACCEPT\n\n# 7. Logger et rejeter tout le reste\niptables -A INPUT -j LOG --log-prefix "IPTABLES-DROP: " --log-level 4\niptables -A INPUT -j DROP\n\n# Règles anti-scan et anti-flood\niptables -A INPUT -p tcp --tcp-flags ALL NONE -j DROP   # Paquets NULL scan\niptables -A INPUT -p tcp --tcp-flags ALL ALL -j DROP    # XMAS scan\niptables -A INPUT -p tcp ! --syn -m state --state NEW -j DROP  # SYN flood\n\n# Limiter les connexions SSH (anti brute force)\niptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set\niptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP\n# Max 3 nouvelles connexions SSH par minute par IP\n\n# NAT — Partager Internet depuis Linux\necho 1 > /proc/sys/net/ipv4/ip_forward\n# Persistant : dans /etc/sysctl.conf : net.ipv4.ip_forward=1\nsysctl -p\n\niptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\n# eth0 = interface connectée à Internet\n# Masquerade = remplace l\'IP source par l\'IP publique\n\n# Port forwarding (DNAT)\n# Rediriger le port 8080 externe vers le port 80 d\'un serveur interne\niptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to-destination 192.168.1.20:80\niptables -A FORWARD -p tcp -d 192.168.1.20 --dport 80 -j ACCEPT\n\n# Sauvegarder et restaurer les règles\niptables-save > /etc/iptables/rules.v4\nip6tables-save > /etc/iptables/rules.v6\n\n# Automatique au démarrage :\napt install iptables-persistent\n# Répond OUI aux deux questions\n\n# Restaurer manuellement\niptables-restore < /etc/iptables/rules.v4' },

          { type: 'h2', content: '2. pfSense — Pare-feu professionnel open-source' },
          { type: 'p', content: 'pfSense est un pare-feu/routeur open-source basé sur FreeBSD. Il est utilisé en entreprise comme alternative aux équipements Cisco/Fortinet/Palo Alto. Il s\'administre via une interface web complète.' },
          { type: 'table', headers: ['Fonctionnalité', 'Description', 'Équivalent commercial'], rows: [
            ['Firewall Stateful', 'Règles entrantes/sortantes par interface avec suivi d\'état', 'Cisco ASA FortiGate'],
            ['NAT/PAT', 'Translation d\'adresses 1:1 et many-to-1', 'Standard sur tous les FW'],
            ['VPN', 'OpenVPN IPSec WireGuard L2TP', 'Cisco AnyConnect FortiClient'],
            ['IDS/IPS Snort/Suricata', 'Détection et blocage d\'intrusions', 'Cisco FirePOWER'],
            ['pfBlockerNG', 'Blocage de domaines malveillants (DNS blackhole)', 'Cisco Umbrella'],
            ['HAProxy', 'Load balancer et reverse proxy SSL', 'F5 BIG-IP'],
            ['Traffic Shaper', 'QoS — priorisation du trafic', 'Cisco CBWFQ'],
            ['Captive Portal', 'Authentification WiFi invités', 'Cisco ISE'],
            ['DHCP/DNS', 'Serveurs DHCP et DNS intégrés', 'Infoblox'],
          ]},
          { type: 'code', content: '# Architecture pfSense typique pour PME :\n\n# Internet ─── pfSense ─── Switch Core\n#                │\n#           ┌────┴──────────────────┐\n#           │                      │\n#      LAN (em1)               DMZ (em2)\n#      192.168.1.0/24         192.168.100.0/24\n#      Utilisateurs            Serveurs exposés\n\n# Interfaces pfSense :\n# WAN (em0) : IP publique FAI\n# LAN (em1) : Réseau interne principal\n# DMZ (em2) : Zone démilitarisée\n# OPT1-N   : Interfaces supplémentaires (VLANs WiFi guest...)\n\n# Règles firewall pfSense — Principe :\n# Les règles sont évaluées de HAUT en BAS sur l\'interface ENTRANTE\n# (là où le paquet entre dans pfSense)\n\n# Règles LAN typiques :\n# Action  Proto   Source          Destination     Port    Description\n# BLOCK   *       LAN Net         192.168.100.X   22      Bloquer SSH vers DMZ depuis users\n# PASS    TCP     LAN Net         Any             80,443  HTTP/HTTPS vers Internet\n# PASS    *       LAN Net         192.168.100.20  80,443  Accès serveur web DMZ\n# BLOCK   *       LAN Net         DMZ Net         *       Bloquer reste DMZ\n# PASS    *       LAN Net         Any             *       Allow all autres\n\n# Règles DMZ typiques :\n# BLOCK   *       DMZ Net         LAN Net         *       DMZ ne peut pas accéder au LAN\n# PASS    TCP     192.168.100.20  Any             80,443  Serveur web accède Internet\n# PASS    UDP     192.168.100.20  192.168.1.10    53      Résolution DNS\n# BLOCK   *       DMZ Net         Any             *       Bloquer le reste\n\n# Règles WAN typiques :\n# BLOCK   *       Any             Any             *       Bloquer tout en entrée (défaut)\n# PASS    TCP     Any             WAN_IP          80,443  Accès site web public (+ NAT vers DMZ)\n\n# NAT Port Forward (pfSense) — Exposer un serveur web dans la DMZ :\n# Type : Port Forward\n# Interface : WAN\n# Proto : TCP\n# Dest port : 443\n# Redirect IP : 192.168.100.20\n# Redirect port : 443\n# pfSense crée automatiquement la règle firewall associée\n\n# VPN OpenVPN sur pfSense :\n# VPN → OpenVPN → Wizards → Remote Access (SSL/TLS)\n# 1. Choisir le CA\n# 2. Créer le certificat serveur\n# 3. Configurer le tunnel (10.0.8.0/24 pour les clients VPN)\n# 4. Firewall rules : permettre trafic depuis interface VPN\n# 5. Exporter le profil client (package openvpn-client-export)\n\n# Client Linux OpenVPN :\napt install openvpn\nopenvpn --config tssr-vpn.ovpn\n# Ou avec NetworkManager :\nnmcli connection import type openvpn file tssr-vpn.ovpn' },
        ],
      },

      {
        id: 'pki-tls',
        titre: 'PKI, Certificats SSL/TLS et Chiffrement',
        sections: [

          { type: 'h2', content: '1. Cryptographie — Bases essentielles' },
          { type: 'table', headers: ['Type', 'Fonctionnement', 'Avantages', 'Inconvénients', 'Usages'], rows: [
            ['Symétrique', '1 seule clé partagée pour chiffrer et déchiffrer', 'Très rapide (AES = quasi-instantané)', 'Problème d\'échange de clé sécurisé', 'Chiffrement des données en masse TLS (après handshake)'],
            ['Asymétrique', '2 clés : publique (chiffre) + privée (déchiffre)', 'Échange de clé sécurisé sans canal préalable', '1000x plus lent que symétrique', 'TLS handshake signatures numériques SSH'],
            ['Hash', 'Fonction à sens unique : données → empreinte fixe', 'Vérification d\'intégrité rapide', 'Irréversible (pas de déchiffrement)', 'Stockage MDP vérification fichiers signatures'],
          ]},
          { type: 'table', headers: ['Algorithme', 'Type', 'Longueur clé', 'Statut', 'Usage'], rows: [
            ['AES-128', 'Symétrique', '128 bits', 'Sécurisé', 'Chiffrement disque fichiers TLS'],
            ['AES-256', 'Symétrique', '256 bits', 'Très sécurisé', 'Gouvernemental haute sécurité'],
            ['ChaCha20', 'Symétrique', '256 bits', 'Très sécurisé', 'Mobile TLS 1.3'],
            ['RSA-2048', 'Asymétrique', '2048 bits', 'Acceptable', 'TLS handshake signatures'],
            ['RSA-4096', 'Asymétrique', '4096 bits', 'Sécurisé', 'CA root signatures longue durée'],
            ['ECDSA P-256', 'Asymétrique', '256 bits elliptique', 'Très sécurisé', 'Certificats web modernes'],
            ['Ed25519', 'Asymétrique', '256 bits Edwards', 'Excellent', 'SSH clés modernes'],
            ['SHA-256', 'Hash', '256 bits sortie', 'Sécurisé', 'Certificats TLS signatures'],
            ['SHA-512', 'Hash', '512 bits sortie', 'Très sécurisé', 'MDP Linux /etc/shadow'],
            ['MD5', 'Hash', '128 bits sortie', 'CASSÉ', 'NE PLUS UTILISER'],
            ['SHA-1', 'Hash', '160 bits sortie', 'DÉPRÉCIÉ', 'Ne plus utiliser pour les signatures'],
          ]},

          { type: 'h2', content: '2. PKI — Infrastructure à Clés Publiques' },
          { type: 'p', content: 'Une PKI gère le cycle de vie des certificats numériques : création, distribution, renouvellement et révocation. Elle permet de faire confiance à une clé publique en vérifiant qu\'elle appartient bien à la personne/serveur revendiqué.' },
          { type: 'code', content: '# Chaîne de confiance PKI :\n\n# Root CA (Autorité Racine)\n#   → Signe les CA intermédiaires\n#   → Clé privée stockée HORS LIGNE (HSM dans un coffre)\n#   → Certificat avec longue durée (20-30 ans)\n#\n# CA Intermédiaire (Issuing CA)\n#   → Signe les certificats finaux\n#   → Peut être révoquée sans impacter la Root CA\n#   → Certificat durée moyenne (5-10 ans)\n#\n# Certificat final (End Entity)\n#   → Serveur web, utilisateur, VPN...\n#   → Durée courte (1-2 ans pour les serveurs web)\n#   → Contient : nom du sujet, clé publique, période validité, signature CA\n\n# Créer une PKI avec OpenSSL (lab)\n\n# 1. Créer la Root CA\nmkdir -p /etc/ssl/TSSR-CA/{certs,crl,newcerts,private}\nchmod 700 /etc/ssl/TSSR-CA/private\ntouch /etc/ssl/TSSR-CA/index.txt\necho 1000 > /etc/ssl/TSSR-CA/serial\n\n# Générer la clé privée Root CA (protégée par passphrase)\nopenssl genrsa -aes256 -out /etc/ssl/TSSR-CA/private/ca.key 4096\nchmod 400 /etc/ssl/TSSR-CA/private/ca.key\n\n# Auto-signer le certificat Root CA\nopenssl req -config /etc/ssl/openssl.cnf \\\n  -key /etc/ssl/TSSR-CA/private/ca.key \\\n  -new -x509 -days 7300 -sha256 \\\n  -extensions v3_ca \\\n  -out /etc/ssl/TSSR-CA/certs/ca.cert.pem\n\n# Vérifier le certificat Root CA\nopenssl x509 -noout -text -in /etc/ssl/TSSR-CA/certs/ca.cert.pem\n# Subject: C=FR, ST=PACA, O=TSSR, CN=TSSR Root CA\n# Validity: Jan  4 2024 → Jan  1 2044\n# Key Usage: Certificate Sign, CRL Sign\n\n# 2. Créer un certificat serveur\n# Générer la clé privée du serveur (sans passphrase pour Apache/Nginx)\nopenssl genrsa -out /etc/ssl/private/tssr-srv.key 2048\n\n# Créer la CSR (Certificate Signing Request)\nopenssl req -new -key /etc/ssl/private/tssr-srv.key \\\n  -out /etc/ssl/tssr-srv.csr \\\n  -subj "/C=FR/ST=PACA/L=Marseille/O=TSSR/CN=www.tssr.local"\n\n# Signer avec la CA\nopenssl ca -config /etc/ssl/openssl.cnf \\\n  -extensions server_cert \\\n  -days 375 -notext -sha256 \\\n  -in /etc/ssl/tssr-srv.csr \\\n  -out /etc/ssl/certs/tssr-srv.crt\n\n# Vérifier le certificat signé\nopenssl x509 -noout -text -in /etc/ssl/certs/tssr-srv.crt\nopenssl verify -CAfile /etc/ssl/TSSR-CA/certs/ca.cert.pem /etc/ssl/certs/tssr-srv.crt\n# /etc/ssl/certs/tssr-srv.crt: OK' },

          { type: 'h2', content: '3. TLS — Transport Layer Security' },
          { type: 'code', content: '# Handshake TLS 1.3 simplifié :\n\n# Client ──────────────────────────────────→ Serveur\n#   ClientHello\n#   (versions TLS supportées, cipher suites, clé Diffie-Hellman)\n#\n# Client ←────────────────────────────────── Serveur\n#   ServerHello + Certificat + EncryptedExtensions + Finished\n#   (choisit cipher suite, envoie son certificat, preuve)\n#\n# Client ──────────────────────────────────→ Serveur\n#   Finished (chiffré)\n#   (vérifie le certificat, dérive la clé de session)\n#\n# Données chiffrées dans les deux sens\n\n# Tester TLS avec OpenSSL :\nopenssl s_client -connect google.com:443\nopenssl s_client -connect google.com:443 -tls1_3    # Forcer TLS 1.3\nopenssl s_client -connect mail.tssr.local:465 -starttls smtp  # SMTP TLS\n\n# Vérifier la chaîne de certificats :\nopenssl s_client -connect www.tssr.local:443 -showcerts\n# Affiche tous les certificats : serveur + intermédiaire(s)\n\n# Informations sur un certificat distant :\necho | openssl s_client -connect www.tssr.local:443 2>/dev/null | \\\n  openssl x509 -noout -text | grep -E "Subject|Issuer|Not Before|Not After|DNS"\n\n# Tester la validité et la chaîne :\ncurl -v https://www.tssr.local 2>&1 | grep -E "SSL|TLS|expire|issuer"\n\n# Configurer Apache avec TLS :\ncat > /etc/apache2/sites-available/tssr-ssl.conf << EOF\n<VirtualHost *:443>\n    ServerName www.tssr.local\n    DocumentRoot /var/www/html\n\n    SSLEngine on\n    SSLCertificateFile      /etc/ssl/certs/tssr-srv.crt\n    SSLCertificateKeyFile   /etc/ssl/private/tssr-srv.key\n    SSLCertificateChainFile /etc/ssl/TSSR-CA/certs/ca.cert.pem\n\n    # Sécurisation TLS\n    SSLProtocol             all -SSLv3 -TLSv1 -TLSv1.1\n    SSLCipherSuite          ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256\n    SSLHonorCipherOrder     off\n    SSLSessionTickets       off\n\n    # Headers de sécurité\n    Header always set Strict-Transport-Security "max-age=63072000"\n    Header always set X-Frame-Options "DENY"\n    Header always set X-Content-Type-Options "nosniff"\n</VirtualHost>\n\n# Redirection HTTP → HTTPS\n<VirtualHost *:80>\n    ServerName www.tssr.local\n    Redirect permanent / https://www.tssr.local/\n</VirtualHost>\nEOF\n\na2enmod ssl headers\na2ensite tssr-ssl\napache2ctl configtest\nsystemctl reload apache2\n\n# Let\'s Encrypt — Certificats gratuits :\napt install certbot python3-certbot-apache\ncertbot --apache -d www.monsite.com -d monsite.com\n# Renouvellement automatique (déjà configuré par certbot)\ncertbot renew --dry-run\n\n# Cron de renouvellement (si pas automatique)\necho "0 0 1 * * certbot renew --quiet" >> /etc/crontab' },

          { type: 'h2', content: '4. VPN — Tunnels sécurisés' },
          { type: 'code', content: '# WireGuard — VPN moderne et performant\napt install wireguard\n\n# Générer les clés serveur\nwg genkey | tee /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key\nchmod 600 /etc/wireguard/server_private.key\ncat /etc/wireguard/server_public.key  # Clé à partager avec les clients\n\n# Configuration serveur /etc/wireguard/wg0.conf :\ncat > /etc/wireguard/wg0.conf << EOF\n[Interface]\nAddress = 10.0.0.1/24\nListenPort = 51820\nPrivateKey = $(cat /etc/wireguard/server_private.key)\n\n# Activer le routage NAT (clients accèdent à Internet via VPN)\nPostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\nPostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE\n\n[Peer]\n# Client Anthony\nPublicKey = CLE_PUBLIQUE_CLIENT_ANTHONY\nAllowedIPs = 10.0.0.2/32\n\n[Peer]\n# Client Marie\nPublicKey = CLE_PUBLIQUE_CLIENT_MARIE\nAllowedIPs = 10.0.0.3/32\nEOF\n\n# Activer le forwarding IP\nsed -i \'s/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/\' /etc/sysctl.conf\nsysctl -p\n\n# Démarrer WireGuard\nwg-quick up wg0\nsystemctl enable wg-quick@wg0\n\n# Vérifier :\nwg show\n# interface: wg0\n#   public key: ...\n#   listening port: 51820\n#\n# peer: CLE_PUBLIQUE_CLIENT_ANTHONY\n#   allowed ips: 10.0.0.2/32\n#   latest handshake: 1 minute, 23 seconds ago\n#   transfer: 1.23 MiB received, 456 KiB sent\n\n# Configuration client WireGuard :\ncat > /etc/wireguard/wg0.conf << EOF\n[Interface]\nAddress = 10.0.0.2/24\nPrivateKey = CLE_PRIVEE_CLIENT\nDNS = 10.0.0.1         # Utiliser le DNS du serveur VPN\n\n[Peer]\nPublicKey = CLE_PUBLIQUE_SERVEUR\nEndpoint = 203.0.113.1:51820\nAllowedIPs = 0.0.0.0/0  # Tout le trafic passe par le VPN\n# OU pour VPN split-tunneling (seulement le réseau interne) :\n# AllowedIPs = 192.168.1.0/24, 192.168.2.0/24\nPersistentKeepalive = 25  # Maintenir le tunnel actif (NAT)\nEOF' },
        ],
      },

      {
        id: 'hardening',
        titre: 'Durcissement Système — Linux et Windows',
        sections: [

          { type: 'h2', content: '1. Durcissement Linux — Checklist complète' },
          { type: 'code', content: '# ============================================================\n# CHECKLIST HARDENING LINUX — DEBIAN/UBUNTU\n# ============================================================\n\n# 1. MISES À JOUR\n# ─────────────────────────────────────────────\napt update && apt upgrade -y\napt install unattended-upgrades\ndpkg-reconfigure -plow unattended-upgrades\n# Configurer /etc/apt/apt.conf.d/50unattended-upgrades\n# Uncomment : Unattended-Upgrade::Mail "admin@tssr.local";\n\n# 2. UTILISATEURS\n# ─────────────────────────────────────────────\n# Vérifier les comptes avec UID 0 (seul root doit l\'avoir)\nawk -F: \'($3 == "0") {print}\' /etc/passwd\n# root:x:0:0:root:/root:/bin/bash   → Normal\n# Si d\'autres comptes apparaissent → ALERTE\n\n# Verrouiller les comptes système inutilisés\npasswd -l daemon\npasswd -l bin\npasswd -l sys\n# Vérifier les comptes sans mot de passe :\nawk -F: \'($2 == "") {print $1}\' /etc/shadow\n\n# Configurer PAM pour la politique de mots de passe\napt install libpam-pwquality\n# /etc/security/pwquality.conf :\ncat >> /etc/security/pwquality.conf << EOF\nminlen = 12\ndcredit = -1\nucredit = -1\nlcredit = -1\nocredit = -1\nEOF\n# minlen=12: 12 caractères minimum\n# dcredit=-1: au moins 1 chiffre\n# ucredit=-1: au moins 1 majuscule\n# lcredit=-1: au moins 1 minuscule\n# ocredit=-1: au moins 1 caractère spécial\n\n# 3. SSH\n# ─────────────────────────────────────────────\ncat > /etc/ssh/sshd_config.d/hardening.conf << EOF\nPort 2222\nPermitRootLogin no\nPasswordAuthentication no\nPubkeyAuthentication yes\nMaxAuthTries 3\nMaxSessions 3\nLoginGraceTime 30\nX11Forwarding no\nClientAliveInterval 300\nClientAliveCountMax 2\nAllowGroups sshusers\nBanner /etc/ssh/banner.txt\nEOF\n\n# Créer le groupe SSH\ngroupadd sshusers\nusermod -aG sshusers anthony\n\n# Bannière légale\ncat > /etc/ssh/banner.txt << EOF\n*************************************************************\n*    ACCES AUTORISE AUX PERSONNES HABILITEES UNIQUEMENT    *\n*    Toute connexion est enregistree et tracee              *\n*    Propriete de TSSR - tssr.local                        *\n*************************************************************\nEOF\n\n# 4. PARE-FEU\n# ─────────────────────────────────────────────\nufw default deny incoming\nufw default allow outgoing\nufw allow from 192.168.1.0/24 to any port 2222 proto tcp\nufw enable\n\n# 5. SERVICES\n# ─────────────────────────────────────────────\n# Désactiver les services inutiles\nsystemctl disable avahi-daemon    # mDNS (inutile en entreprise)\nsystemctl disable cups            # Impression (si pas d\'imprimante)\nsystemctl disable bluetooth       # Bluetooth (si pas utilisé)\nsystemctl disable rpcbind         # NFS RPC (si NFS non utilisé)\n\n# Vérifier les services qui écoutent\nss -tuln\n# Ne garder que les ports nécessaires\n\n# 6. SYSCTL — Paramètres noyau\n# ─────────────────────────────────────────────\ncat >> /etc/sysctl.d/99-hardening.conf << EOF\n# Désactiver le forwarding IP (sauf si routeur)\nnet.ipv4.ip_forward = 0\n\n# Ignorer les pings broadcast (smurf attack)\nnet.ipv4.icmp_echo_ignore_broadcasts = 1\n\n# Ignorer les ICMP redirects (prévention MitM)\nnet.ipv4.conf.all.accept_redirects = 0\nnet.ipv4.conf.all.send_redirects = 0\n\n# Désactiver le source routing\nnet.ipv4.conf.all.accept_source_route = 0\n\n# SYN cookies (protection SYN flood)\nnet.ipv4.tcp_syncookies = 1\n\n# Protéger contre IP spoofing\nnet.ipv4.conf.all.rp_filter = 1\n\n# Limiter les logs ICMP\nnet.ipv4.icmp_ratelimit = 100\n\n# Protection contre les débordements de pile\nkernel.randomize_va_space = 2\nEOF\nsysctl -p /etc/sysctl.d/99-hardening.conf\n\n# 7. AUDIT — Auditd\n# ─────────────────────────────────────────────\napt install auditd\ncat >> /etc/audit/rules.d/hardening.rules << EOF\n# Surveiller les modifications /etc/passwd et /etc/shadow\n-w /etc/passwd -p wa -k identity\n-w /etc/shadow -p wa -k identity\n-w /etc/group -p wa -k identity\n\n# Surveiller les connexions SSH\n-w /var/log/auth.log -p wa -k auth\n\n# Surveiller les commandes sudo\n-w /etc/sudoers -p wa -k sudo\n-w /etc/sudoers.d/ -p wa -k sudo\n\n# Surveiller les modifications de fichiers système\n-w /etc/sysctl.conf -p wa -k sysctl\n-w /etc/iptables/ -p wa -k firewall\nEOF\nservice auditd restart\n\n# Consulter les logs d\'audit\nauditctl -l                         # Règles actives\nausearch -k identity                # Rechercher par clé\naureport --summary                  # Rapport résumé' },

          { type: 'h2', content: '2. Durcissement Windows Server' },
          { type: 'code', content: '# ============================================================\n# CHECKLIST HARDENING WINDOWS SERVER\n# ============================================================\n\n# 1. POLITIQUE DE MOTS DE PASSE\n# ─────────────────────────────────────────────\n# Via GPO : Computer Config > Windows Settings > Security Settings > Account Policies\n# Longueur minimale : 12 caractères\n# Complexité : Activée\n# Durée max : 90 jours\n# Historique : 12\n\n# Via PowerShell :\nSet-ADDefaultDomainPasswordPolicy -Identity "tssr.local" `\n  -MinPasswordLength 12 `\n  -ComplexityEnabled $true `\n  -MaxPasswordAge (New-TimeSpan -Days 90) `\n  -PasswordHistoryCount 12\n\n# 2. VERROUILLAGE DE COMPTE\n# ─────────────────────────────────────────────\n# Seuil : 5 tentatives\n# Durée : 30 minutes\n# Reset compteur : 30 minutes\nSet-ADDefaultDomainPasswordPolicy -Identity "tssr.local" `\n  -LockoutThreshold 5 `\n  -LockoutDuration (New-TimeSpan -Minutes 30) `\n  -LockoutObservationWindow (New-TimeSpan -Minutes 30)\n\n# 3. DÉSACTIVER LES SERVICES INUTILES\n# ─────────────────────────────────────────────\n$servicesToDisable = @(\n  "Fax",              # Télécopie\n  "XblGameSave",      # Xbox Live Game Save\n  "WSearch",          # Indexation Windows Search (si non nécessaire)\n  "RemoteRegistry",   # Registre distant (DANGER)\n  "Spooler",          # Spouleur impression (si pas d\'imprimante)\n  "TlntSvr",          # Telnet Server (JAMAIS)\n  "SNMP"              # SNMP v1/v2 (si non géré)\n)\nforeach ($svc in $servicesToDisable) {\n  if (Get-Service -Name $svc -ErrorAction SilentlyContinue) {\n    Set-Service -Name $svc -StartupType Disabled\n    Stop-Service -Name $svc -Force -ErrorAction SilentlyContinue\n    Write-Host "Service $svc désactivé"\n  }\n}\n\n# 4. PARE-FEU WINDOWS\n# ─────────────────────────────────────────────\n# Activer le pare-feu sur tous les profils\nSet-NetFirewallProfile -Profile Domain,Public,Private -Enabled True\n\n# Créer des règles spécifiques\nNew-NetFirewallRule -DisplayName "Autoriser SSH depuis Admin" `\n  -Direction Inbound `\n  -Protocol TCP `\n  -LocalPort 22 `\n  -RemoteAddress 192.168.1.0/24 `\n  -Action Allow\n\nNew-NetFirewallRule -DisplayName "Bloquer Telnet" `\n  -Direction Inbound `\n  -Protocol TCP `\n  -LocalPort 23 `\n  -Action Block\n\n# 5. AUDIT WINDOWS\n# ─────────────────────────────────────────────\n# Via GPO : Computer Config > Windows Settings > Security Settings > Advanced Audit\n\n# Via auditpol (PowerShell) :\nauditpol /set /subcategory:"Logon" /success:enable /failure:enable\nauditpol /set /subcategory:"Logoff" /success:enable\nauditpol /set /subcategory:"Account Lockout" /success:enable /failure:enable\nauditpol /set /subcategory:"User Account Management" /success:enable /failure:enable\nauditpol /set /subcategory:"Security Group Management" /success:enable /failure:enable\nauditpol /set /subcategory:"Audit Policy Change" /success:enable /failure:enable\nauditpol /set /subcategory:"Sensitive Privilege Use" /success:enable /failure:enable\n\n# Vérifier les paramètres d\'audit :\nauditpol /get /category:*\n\n# Surveiller les événements critiques :\n# 4625 : Échec d\'authentification (brute force ?)\n# 4648 : Connexion avec credentials explicites (pass-the-hash ?)\n# 4719 : Modification de la politique d\'audit (attaquant efface ses traces ?)\n# 4732 : Ajout au groupe Administrateurs (escalade de privilèges ?)\n# 7045 : Nouveau service installé (persistance malware ?)\n\nGet-WinEvent -LogName Security -MaxEvents 1000 | `\n  Where-Object { $_.Id -in @(4625, 4648, 4719, 4732, 7045) } | `\n  Select-Object TimeCreated, Id, Message | `\n  Format-Table -AutoSize\n\n# 6. LAPS — Mots de passe admin locaux\n# ─────────────────────────────────────────────\n# Installe le MSI LAPS sur tous les postes\n# Sur le DC :\nImport-Module AdmPwd.PS\nUpdate-AdmPwdADSchema\nSet-AdmPwdComputerSelfPermission -OrgUnit "OU=Ordinateurs,DC=tssr,DC=local"\nSet-AdmPwdReadPasswordPermission `\n  -OrgUnit "OU=Ordinateurs,DC=tssr,DC=local" `\n  -AllowedPrincipals "GRP-HelpDesk"\n\n# Lire le mot de passe LAPS :\nGet-AdmPwdPassword -ComputerName "PC-JEAN"\n# ComputerName  DistinguishedName               Password    ExpirationTimestamp\n# PC-JEAN       CN=PC-JEAN,OU=Ordinateurs,...   K#9mP!2024  01/04/2025 10:00:00' },

          { type: 'h2', content: '3. Analyse des logs de sécurité' },
          { type: 'code', content: '# ============================================================\n# ANALYSE DES TENTATIVES D\'INTRUSION SSH\n# ============================================================\n\n# Top 10 IPs qui tentent de se connecter en SSH\ngrep "Failed password" /var/log/auth.log | \\\n  awk \'{print $11}\' | \\\n  sort | uniq -c | sort -rn | head -10\n# 1523 185.220.101.45  ← IP suspecte russe\n#  892 45.33.32.156\n#  234 192.168.1.50   ← IP interne !\n\n# Comptes ciblés par les attaques brute force\ngrep "Failed password" /var/log/auth.log | \\\n  awk \'{print $9}\' | \\\n  sort | uniq -c | sort -rn | head -10\n# 2345 root    ← TOUJOURS ciblé\n#  456 admin\n#  123 user\n\n# Voir les connexions réussies\ngrep "Accepted" /var/log/auth.log | \\\n  awk \'{print $9, $11}\' | sort | uniq -c\n# 45 anthony 192.168.1.100  ← Normal\n#  2 anthony 185.220.101.45 ← SUSPECT !\n\n# Analyse temporelle des attaques\ngrep "Failed password" /var/log/auth.log | \\\n  awk \'{print $1, $2, $3}\' | \\\n  sort | uniq -c | sort -rn | head -20\n# Permet de voir à quelle heure les attaques se concentrent\n\n# Chercher les connexions depuis des pays suspects\ngeoiplookup 185.220.101.45\n# GeoIP Country Edition: RU, Russia\n# Si pas installé : apt install geoip-bin\n\n# Script de rapport de sécurité quotidien\ncat > /usr/local/bin/security-report.sh << \'EOF\'\n#!/bin/bash\nDATE=$(date +%Y-%m-%d)\nREPORT="/var/log/security-report-$DATE.txt"\n\necho "=== RAPPORT SÉCURITÉ $DATE ===" > $REPORT\necho "" >> $REPORT\n\necho "--- TENTATIVES SSH ÉCHOUÉES ---" >> $REPORT\ngrep "Failed password" /var/log/auth.log | wc -l >> $REPORT\ngrep "Failed password" /var/log/auth.log | awk \'{print $11}\' | sort | uniq -c | sort -rn | head -5 >> $REPORT\n\necho "" >> $REPORT\necho "--- CONNEXIONS RÉUSSIES ---" >> $REPORT\ngrep "Accepted" /var/log/auth.log | awk \'{print $9, $11}\' >> $REPORT\n\necho "" >> $REPORT\necho "--- TENTATIVES SUDO ---" >> $REPORT\ngrep "COMMAND" /var/log/auth.log | tail -20 >> $REPORT\n\necho "" >> $REPORT\necho "--- SERVICES EN ÉCOUTE ---" >> $REPORT\nss -tuln >> $REPORT\n\necho "" >> $REPORT\necho "--- ESPACE DISQUE ---" >> $REPORT\ndf -h >> $REPORT\n\nmail -s "Rapport sécurité $DATE" admin@tssr.local < $REPORT\nEOF\nchmod +x /usr/local/bin/security-report.sh\necho "0 7 * * * root /usr/local/bin/security-report.sh" >> /etc/crontab' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'cisco',
    label: 'Cisco / Réseaux',
    icon: '🔌',
    color: '#e84040',
    desc: 'IOS Cisco, routage, switching, VLAN, ACL, Packet Tracer...',
    topics: ['IOS', 'VLAN', 'Routage', 'ACL', 'STP', 'Packet Tracer'],
    linux_cli: true,
    cours: [
      {
        id: 'ios-fondamentaux',
        titre: 'Cisco IOS — Fondamentaux et Navigation',
        sections: [

          { type: 'h2', content: '1. Qu\'est-ce que Cisco IOS ?' },
          { type: 'p', content: 'IOS (Internetwork Operating System) est le système d\'exploitation des équipements Cisco (routeurs, switches, pare-feux). Il existe en plusieurs versions : IOS classique, IOS-XE (moderne), IOS-XR (opérateurs), NX-OS (datacenter Nexus).' },
          { type: 'table', headers: ['Plateforme', 'OS', 'Usage', 'Exemples'], rows: [
            ['Routeurs ISR', 'IOS / IOS-XE', 'Agences succursales', 'ISR 1100 2900 4000'],
            ['Switches Catalyst', 'IOS / IOS-XE', 'LAN entreprise', 'Catalyst 2960 3650 9200'],
            ['Switches Nexus', 'NX-OS', 'Datacenter', 'Nexus 3000 5000 9000'],
            ['ASA / Firepower', 'ASA-OS / FTD', 'Pare-feu', 'ASA 5506 5516'],
            ['Routeurs haut de gamme', 'IOS-XR', 'Opérateurs', 'ASR 9000 CRS'],
          ]},

          { type: 'h2', content: '2. Les modes IOS — Navigation essentielle' },
          { type: 'p', content: 'IOS utilise des modes hiérarchiques. Chaque mode a son propre prompt et ses propres commandes disponibles. Comprendre ces modes est fondamental.' },
          { type: 'table', headers: ['Mode', 'Prompt', 'Commande d\'accès', 'Commandes disponibles'], rows: [
            ['EXEC utilisateur', 'Router>', 'Connexion initiale', 'ping traceroute show (limité)'],
            ['EXEC privilégié', 'Router#', 'enable (+ mot de passe)', 'Toutes les show, debug, copy, reload'],
            ['Configuration globale', 'Router(config)#', 'configure terminal (conf t)', 'Modifier hostname, routes, ACL...'],
            ['Configuration interface', 'Router(config-if)#', 'interface GigabitEthernet0/0', 'IP adresse shutdown description'],
            ['Configuration ligne', 'Router(config-line)#', 'line console 0 / line vty 0 4', 'Mots de passe accès console/SSH'],
            ['Configuration routeur', 'Router(config-router)#', 'router ospf 1', 'Protocoles de routage'],
            ['Configuration VLAN', 'Switch(config-vlan)#', 'vlan 10', 'Nom du VLAN'],
          ]},
          { type: 'code', content: '# Navigation entre les modes :\nRouter> enable                    # Passer en EXEC privilégié\nRouter#\nRouter# configure terminal        # Passer en configuration globale\nRouter(config)#\nRouter(config)# interface GigabitEthernet0/0\nRouter(config-if)#\nRouter(config-if)# exit           # Remonter d\'un niveau\nRouter(config)#\nRouter(config)# end               # Retour direct en EXEC privilégié\nRouter#\n# OU Ctrl+Z = même effet que end\n\n# Raccourcis clavier IOS :\n# Tab           : Complétion automatique\n# ?             : Aide contextuelle\n# Ctrl+C        : Annuler une commande\n# Ctrl+Z        : Retour en mode privilégié\n# Ctrl+Shift+6  : Interrompre ping/traceroute\n# flèche haut   : Commande précédente\n\n# Aide contextuelle :\nRouter# sh?                        # Commandes commençant par "sh"\nRouter# show ?                     # Sous-commandes de show\nRouter# show ip ?                  # Sous-commandes de show ip' },

          { type: 'h2', content: '3. Configuration initiale d\'un équipement Cisco' },
          { type: 'code', content: '# 1. Nom de l\'équipement\nRouter(config)# hostname R1-Paris\n\n# 2. Bannière légale\nR1-Paris(config)# banner motd #\n  *** ACCES AUTORISE UNIQUEMENT ***\n  Propriete de TSSR Entreprise\n#\n\n# 3. Mot de passe mode privilégié (TOUJOURS enable secret, jamais enable password)\nR1-Paris(config)# enable secret P@ssword_Enable2024!\n\n# 4. Mot de passe console\nR1-Paris(config)# line console 0\nR1-Paris(config-line)# password P@ss_Console!\nR1-Paris(config-line)# login\nR1-Paris(config-line)# exec-timeout 5 0     # Déconnexion après 5 min\nR1-Paris(config-line)# exit\n\n# 5. Chiffrer tous les mots de passe\nR1-Paris(config)# service password-encryption\n\n# 6. SSH (désactiver Telnet)\nR1-Paris(config)# ip domain-name tssr.local\nR1-Paris(config)# crypto key generate rsa modulus 2048\nR1-Paris(config)# ip ssh version 2\nR1-Paris(config)# username admin privilege 15 secret P@ss_Admin!\nR1-Paris(config)# line vty 0 4\nR1-Paris(config-line)# transport input ssh   # SSH UNIQUEMENT\nR1-Paris(config-line)# login local\nR1-Paris(config-line)# exec-timeout 10 0\nR1-Paris(config-line)# exit\n\n# 7. NTP — Synchronisation horaire\nR1-Paris(config)# ntp server 192.168.1.10\nR1-Paris(config)# clock timezone CET 1\n\n# 8. Sauvegarder la configuration !\nR1-Paris# copy running-config startup-config\n# OU\nR1-Paris# write memory\n# OU abrégé\nR1-Paris# wr' },

          { type: 'h2', content: '4. Commandes show — Diagnostic et vérification' },
          { type: 'code', content: '# show running-config — Configuration active (en RAM)\nR1# show running-config\nR1# show running-config | begin interface    # Depuis "interface"\nR1# show running-config | section ospf      # Section OSPF\n\n# show ip interface brief — Vue synthétique\nR1# show ip interface brief\n# Interface              IP-Address      OK? Method Status    Protocol\n# GigabitEthernet0/0    192.168.1.1    YES NVRAM  up         up\n# GigabitEthernet0/2    unassigned     YES NVRAM  admin down down\n\n# Statuts :\n# up/up           = opérationnel\n# up/down         = câble OK (L1) mais problème L2\n# down/down       = pas de câble ou interface off\n# admin down/down = désactivée manuellement (shutdown)\n\n# show interfaces — Détails complets avec compteurs d\'erreurs\nR1# show interfaces GigabitEthernet0/0\n# Erreurs à surveiller : CRC input errors Giants Runts Drops\n# CRC = câble défectueux/interférences\n\n# show ip route — Table de routage\nR1# show ip route\n# Codes: L-local C-connected S-static O-OSPF B-BGP\n# C  192.168.1.0/24 is directly connected, Gi0/0\n# S  10.10.0.0/16 [1/0] via 192.168.1.254\n# O  172.16.0.0/16 [110/2] via 10.0.0.2\n# [110/2] = [distance administrative / métrique]\n# Distance : 0=directe 1=statique 90=EIGRP 110=OSPF 120=RIP\n\nR1# show arp                               # Table ARP\nR1# show cdp neighbors                     # Voisins Cisco\nR1# show version                           # Version IOS et matériel\nR1# show clock                             # Heure système' },
        ],
      },

      {
        id: 'routage-cisco',
        titre: 'Routage Cisco — Statique, OSPF et BGP',
        sections: [

          { type: 'h2', content: '1. Configuration des interfaces' },
          { type: 'code', content: '# Interface LAN\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# description "LAN-Principal-192.168.1.0/24"\nR1(config-if)# ip address 192.168.1.1 255.255.255.0\nR1(config-if)# no shutdown\nR1(config-if)# ip helper-address 192.168.1.10    # Relay DHCP\nR1(config-if)# exit\n\n# Interface WAN\nR1(config)# interface GigabitEthernet0/1\nR1(config-if)# description "WAN-FAI-203.0.113.0/30"\nR1(config-if)# ip address 203.0.113.2 255.255.255.252\nR1(config-if)# no shutdown\nR1(config-if)# exit\n\n# Interface loopback (IP stable pour management)\nR1(config)# interface Loopback0\nR1(config-if)# ip address 1.1.1.1 255.255.255.255\nR1(config-if)# exit\n\n# Sous-interfaces Router-on-a-Stick\nR1(config)# interface GigabitEthernet0/0.10\nR1(config-subif)# encapsulation dot1Q 10\nR1(config-subif)# ip address 192.168.10.1 255.255.255.0\nR1(config-subif)# exit\n\nR1(config)# interface GigabitEthernet0/0.20\nR1(config-subif)# encapsulation dot1Q 20\nR1(config-subif)# ip address 192.168.20.1 255.255.255.0\nR1(config-subif)# exit\n\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# no shutdown\nR1(config-if)# exit' },

          { type: 'h2', content: '2. Routage statique' },
          { type: 'code', content: '# Route statique simple\nR1(config)# ip route 10.10.0.0 255.255.0.0 192.168.1.254\n\n# Route par défaut\nR1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1\n\n# Route flottante (backup)\nR1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1 1   # Primaire AD=1\nR1(config)# ip route 0.0.0.0 0.0.0.0 203.0.114.1 5   # Backup AD=5\n\n# Vérifier :\nR1# show ip route static\nR1# show ip route 0.0.0.0\n\n# Supprimer :\nR1(config)# no ip route 10.10.0.0 255.255.0.0 192.168.1.254\n\n# Summarization — regrouper des routes\n# 192.168.0.0/24 + .1/24 + .2/24 + .3/24 → 192.168.0.0/22\nR-Paris(config)# ip route 192.168.0.0 255.255.252.0 10.0.0.2' },

          { type: 'h2', content: '3. OSPF — Open Shortest Path First' },
          { type: 'p', content: 'OSPF est un protocole de routage dynamique à état de lien (Link State). Il construit une carte complète du réseau et calcule le chemin le plus court (algorithme de Dijkstra).' },
          { type: 'table', headers: ['Concept OSPF', 'Description', 'Détail'], rows: [
            ['Area', 'Zone OSPF pour limiter les LSA', 'Area 0 = backbone obligatoire'],
            ['Router ID', 'Identifiant unique du routeur OSPF', 'Loopback0 ou plus haute IP'],
            ['Hello', 'Paquets pour découvrir/maintenir voisins', 'Toutes les 10s (point-à-point)'],
            ['Dead Interval', 'Délai avant de considérer un voisin mort', '40s = 4 × Hello interval'],
            ['LSA', 'Link State Advertisement — infos sur les liens', 'Partagé avec tous les routeurs de l\'area'],
            ['DR/BDR', 'Designated Router sur réseaux multi-accès', 'Réduit le nombre d\'adjacences'],
            ['Métrique', 'Coût = 100Mbps / bande passante', '10G=1 1G=1 100M=1 10M=10'],
          ]},
          { type: 'code', content: '# Configuration OSPF Single Area\nR1(config)# router ospf 1\nR1(config-router)# router-id 1.1.1.1\nR1(config-router)# network 192.168.1.0 0.0.0.255 area 0\nR1(config-router)# network 10.0.0.0 0.0.0.3 area 0\nR1(config-router)# passive-interface GigabitEthernet0/0  # Pas de Hello vers LAN\nR1(config-router)# default-information originate         # Redistribuer route par défaut\nR1(config-router)# exit\n\n# Wildcards OSPF :\n# 0.0.0.0   = hôte exact\n# 0.0.0.255 = /24\n# 255.255.255.255 = n\'importe quelle IP (any)\n\n# Tuning :\nR1(config-if)# ip ospf hello-interval 5\nR1(config-if)# ip ospf dead-interval 20\nR1(config-if)# ip ospf cost 10\nR1(config-if)# ip ospf priority 100    # 0 = jamais DR\n\n# Vérification :\nR1# show ip ospf neighbor\n# Neighbor ID  Pri  State    Dead Time  Address    Interface\n# 2.2.2.2      1   FULL/DR  00:00:32   10.0.0.2   Gi0/1\n\n# États voisins : Down→Init→2-Way→Exstart→Exchange→Loading→FULL\n# FULL = voisin pleinement fonctionnel\n\nR1# show ip ospf database              # Base LSDB\nR1# show ip route ospf                 # Routes OSPF\nR1# show ip ospf interface brief       # Coûts et états\nR1# no debug all                       # Désactiver tous les debugs !' },

          { type: 'h2', content: '4. ACL — Access Control Lists' },
          { type: 'p', content: 'Les ACL filtrent le trafic réseau. Elles sont traitées de haut en bas — la première règle qui correspond est appliquée. Une règle implicite <strong>deny any</strong> est toujours à la fin.' },
          { type: 'code', content: '# ACL Standard (1-99) — filtre sur IP SOURCE uniquement\n# → Placer AU PLUS PRÈS de la DESTINATION\n\nR1(config)# access-list 10 permit 192.168.1.0 0.0.0.255\nR1(config)# access-list 10 deny any log\n\nR1(config)# interface GigabitEthernet0/1\nR1(config-if)# ip access-group 10 out     # Trafic SORTANT\nR1(config-if)# exit\n\n# ACL Étendue (100-199) — filtre source+destination+protocole+port\n# → Placer AU PLUS PRÈS de la SOURCE\n\nR1(config)# ip access-list extended ACL-LAN-TO-WAN\nR1(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 80\nR1(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 443\nR1(config-ext-nacl)# permit tcp 192.168.1.0 0.0.0.255 any eq 53\nR1(config-ext-nacl)# permit udp 192.168.1.0 0.0.0.255 any eq 53\nR1(config-ext-nacl)# permit icmp 192.168.1.0 0.0.0.255 any\nR1(config-ext-nacl)# deny ip any any log\nR1(config-ext-nacl)# exit\n\nR1(config)# interface GigabitEthernet0/0\nR1(config-if)# ip access-group ACL-LAN-TO-WAN in\nR1(config-if)# exit\n\n# Mots-clés :\n# any = n\'importe qui | host = IP exacte\n# eq 80 = port 80 | gt/lt = supérieur/inférieur\n# established = connexions TCP déjà établies (ACK/RST)\n\n# Vérifier :\nR1# show access-lists                  # Compteurs de matches\nR1# show ip interface Gi0/0            # Quelle ACL appliquée\nR1# clear access-list counters         # Remettre compteurs à zéro' },
        ],
      },

      {
        id: 'vlan-cisco',
        titre: 'VLANs Cisco — Configuration Complète',
        sections: [

          { type: 'h2', content: '1. VLANs sur les switches Cisco' },
          { type: 'code', content: '# Créer les VLANs\nSW1(config)# vlan 10\nSW1(config-vlan)# name VLAN-RH\nSW1(config-vlan)# exit\nSW1(config)# vlan 20\nSW1(config-vlan)# name VLAN-IT\nSW1(config-vlan)# exit\nSW1(config)# vlan 99\nSW1(config-vlan)# name VLAN-MGMT-NATIF\nSW1(config-vlan)# exit\n\n# Ports ACCESS — Connexion aux postes\nSW1(config)# interface range FastEthernet0/1-10\nSW1(config-if-range)# switchport mode access\nSW1(config-if-range)# switchport access vlan 10\nSW1(config-if-range)# spanning-tree portfast\nSW1(config-if-range)# spanning-tree bpduguard enable\nSW1(config-if-range)# exit\n\n# Port TRUNK — Vers switch ou routeur\nSW1(config)# interface GigabitEthernet0/1\nSW1(config-if)# switchport mode trunk\nSW1(config-if)# switchport trunk native vlan 99\nSW1(config-if)# switchport trunk allowed vlan 10,20,30,40,99\nSW1(config-if)# switchport nonegotiate         # Désactiver DTP\nSW1(config-if)# exit\n\n# IP de management\nSW1(config)# interface vlan 99\nSW1(config-if)# ip address 192.168.99.10 255.255.255.0\nSW1(config-if)# no shutdown\nSW1(config-if)# exit\nSW1(config)# ip default-gateway 192.168.99.1\n\n# Vérifications :\nSW1# show vlan brief\nSW1# show interfaces trunk\nSW1# show interfaces FastEthernet0/1 switchport' },

          { type: 'h2', content: '2. STP — Spanning Tree Protocol' },
          { type: 'code', content: '# Configurer le Root Bridge\nSW-CORE(config)# spanning-tree vlan 10,20,30,40 root primary\n# OU manuellement :\nSW-CORE(config)# spanning-tree vlan 10 priority 4096\n\n# Root secondaire (failover)\nSW-BACKUP(config)# spanning-tree vlan 10,20,30,40 root secondary\n\n# Mode RSTP (rapide — recommandé)\nSW1(config)# spanning-tree mode rapid-pvst\n# Convergence ~1-2s au lieu de 30-50s\n\n# PortFast — skip Listening/Learning pour les ports PC\nSW1(config)# spanning-tree portfast default    # Global\nSW1(config-if)# spanning-tree portfast         # Interface\n\n# BPDU Guard — protection contre switches pirates\nSW1(config-if)# spanning-tree bpduguard enable\n# Si switch connecté → port err-disable\n# Auto-recovery :\nSW1(config)# errdisable recovery cause bpduguard\nSW1(config)# errdisable recovery interval 30\n\n# Root Guard\nSW1(config-if)# spanning-tree guard root\n\n# Vérifications :\nSW1# show spanning-tree\nSW1# show spanning-tree vlan 10\n# Rôles : Root(meilleur chemin) Desg(best sur segment) Altn(bloqué) Back(bloqué)\n# États : BLK(bloqué) LIS(15s) LRN(15s) FWD(forwarding normal) DIS(disabled)' },

          { type: 'h2', content: '3. EtherChannel — Agrégation de liens' },
          { type: 'code', content: '# EtherChannel = plusieurs liens physiques → 1 lien logique\n# Avantages : bande passante + redondance\n# Protocoles : LACP (802.3ad, standard) ou PAgP (Cisco, déprécié)\n\n# Sur SW1 :\nSW1(config)# interface range GigabitEthernet0/1-2\nSW1(config-if-range)# channel-group 1 mode active      # LACP actif\nSW1(config-if-range)# exit\n\nSW1(config)# interface Port-Channel1\nSW1(config-if)# switchport mode trunk\nSW1(config-if)# switchport trunk native vlan 99\nSW1(config-if)# switchport trunk allowed vlan 10,20,30,40,99\nSW1(config-if)# exit\n\n# Sur SW-CORE :\nSW-CORE(config)# interface range GigabitEthernet0/1-2\nSW-CORE(config-if-range)# channel-group 1 mode passive   # LACP passif\nSW-CORE(config-if-range)# exit\n\n# Vérifications :\nSW1# show etherchannel summary\n# 1  Po1(SU)  LACP  Gi0/1(P) Gi0/2(P)\n# SU = Layer2 Up  P = Bundled (en service)\n\nSW1# show lacp neighbor' },
        ],
      },

      {
        id: 'sauvegarde-ios',
        titre: 'Sauvegarde, Restauration et Gestion IOS',
        sections: [

          { type: 'h2', content: '1. Sauvegarde de la configuration' },
          { type: 'code', content: '# Copie vers TFTP\nR1# copy running-config tftp:\nAddress or name of remote host? 192.168.1.100\nDestination filename? R1-running-config-2024-01-04\n\n# Copie vers FTP\nR1(config)# ip ftp username admin\nR1(config)# ip ftp password P@ssword!\nR1# copy running-config ftp://192.168.1.100/R1-backup.cfg\n\n# Copie vers clé USB\nR1# copy running-config usbflash0:R1-backup.cfg\n\n# Restaurer (merge avec config existante) :\nR1# copy tftp: running-config\n\n# Remplacer complètement :\nR1# configure replace tftp://192.168.1.100/R1-clean.cfg\n\n# Réinitialiser aux paramètres usine :\nR1# write erase          # Supprimer la startup-config\nR1# reload\n\n# Gérer les fichiers IOS :\nR1# dir flash:\nR1# dir all-filesystems  # Voir tous les systèmes de fichiers' },

          { type: 'h2', content: '2. Mise à jour de l\'IOS' },
          { type: 'code', content: '# Vérifier la version\nR1# show version\n\n# Copier le nouvel IOS depuis TFTP\nR1# copy tftp flash:\nAddress or name of remote host? 192.168.1.100\nSource filename? isr4200-universalk9.17.09.01.SPA.bin\nDestination filename? isr4200-universalk9.17.09.01.SPA.bin\n\n# Vérifier le checksum MD5\nR1# verify md5 flash:isr4200-universalk9.17.09.01.SPA.bin\n\n# Configurer le boot sur le nouvel IOS\nR1(config)# boot system flash:isr4200-universalk9.17.09.01.SPA.bin\nR1(config)# end\nR1# write memory\nR1# reload\n\n# Après redémarrage, supprimer l\'ancien IOS :\nR1# delete flash:isr4200-universalk9.17.06.01a.SPA.bin\n\n# Configuration Register :\n# 0x2102 = boot normal\n# 0x2100 = boot ROMMON\n# 0x2142 = ignorer startup-config (récupération MDP)\nR1# show version | include Configuration register' },

          { type: 'h2', content: '3. Récupération de mot de passe IOS' },
          { type: 'code', content: '# Nécessite un accès physique au câble console\n\n# Étape 1 : Entrer en ROMMON\n# Appuyer sur Ctrl+Break pendant les 60 premières secondes du démarrage\n\n# Étape 2 : En ROMMON\nrommon 1> confreg 0x2142    # Ignorer la startup-config\nrommon 2> reset\n\n# Étape 3 : Au boot, pas de config chargée\nRouter> enable               # Pas de mot de passe !\nRouter# copy startup-config running-config\n\n# Étape 4 : Changer le mot de passe\nRouter(config)# enable secret NouveauP@ss!\n\n# Étape 5 : Rétablir le configuration register\nRouter(config)# config-register 0x2102\n\n# Étape 6 : Sauvegarder et redémarrer\nRouter# copy running-config startup-config\nRouter# reload' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'supervision',
    label: 'Supervision',
    icon: '📊',
    color: '#06b6d4',
    desc: 'Zabbix, SNMP, ITIL, tickets et syslog...',
    topics: ['Zabbix', 'SNMP', 'ITIL', 'GLPI', 'Syslog', 'SLA'],
    linux_cli: true,
    windows_cli: true,
    cours: [
      {
        id: 'zabbix',
        titre: 'Zabbix — Supervision Complète',
        sections: [
          { type: 'h2', content: 'Architecture Zabbix' },
          { type: 'table', headers: ['Composant', 'Rôle'], rows: [
            ['Zabbix Server', 'Collecte les métriques et génère les alertes'],
            ['Zabbix Agent', 'Installé sur les hôtes supervisés — remonte les métriques'],
            ['Zabbix Proxy', 'Relai pour les sites distants sans accès direct au serveur'],
            ['Base de données', 'MySQL/PostgreSQL — stocke toutes les métriques'],
            ['Frontend Web', 'Interface Nginx/Apache — tableau de bord et config'],
          ]},
          { type: 'h2', content: 'Installation Zabbix 6.x sur Debian' },
          { type: 'code', content: '# Télécharger le dépôt Zabbix\nwget https://repo.zabbix.com/zabbix/6.0/debian/pool/main/z/zabbix-release/zabbix-release_6.0-4%2Bdebian12_all.deb\ndpkg -i zabbix-release_6.0-4+debian12_all.deb\napt update\n\n# Installer le serveur, agent et frontend\napt install zabbix-server-mysql zabbix-frontend-php zabbix-apache-conf zabbix-sql-scripts zabbix-agent\n\n# Créer la base de données MySQL\nmysql -u root -p\nCREATE DATABASE zabbix CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;\nCREATE USER \'zabbix\'@\'localhost\' IDENTIFIED BY \'zabbix_pass\';\nGRANT ALL PRIVILEGES ON zabbix.* TO \'zabbix\'@\'localhost\';\nFLUSH PRIVILEGES;\n\n# Importer le schéma\nzcat /usr/share/zabbix-sql-scripts/mysql/server.sql.gz | mysql -u zabbix -p zabbix\n\n# Configurer /etc/zabbix/zabbix_server.conf\nDBHost=localhost\nDBName=zabbix\nDBUser=zabbix\nDBPassword=zabbix_pass\n\n# Démarrer les services\nsystemctl restart zabbix-server zabbix-agent apache2\nsystemctl enable zabbix-server zabbix-agent apache2\n\n# Accès : http://VOTRE_IP/zabbix (admin / zabbix)' },
          { type: 'h2', content: 'Configuration des hôtes' },
          { type: 'code', content: '# Installer l\'agent sur un hôte Linux\napt install zabbix-agent\n\n# Configurer /etc/zabbix/zabbix_agentd.conf\nServer=192.168.1.100          # IP du serveur Zabbix\nServerActive=192.168.1.100    # Mode actif\nHostname=SRV-WEB-01           # Nom de l\'hôte (doit correspondre dans Zabbix)\n\nsystemctl restart zabbix-agent\nsystemctl enable zabbix-agent\n\n# Installer l\'agent sur Windows (PowerShell)\n# Télécharger zabbix_agent2 depuis zabbix.com\n# Lancer l\'installateur MSI avec l\'IP du serveur' },
          { type: 'h2', content: 'Items, Triggers et Alertes' },
          { type: 'table', headers: ['Concept', 'Description', 'Exemple'], rows: [
            ['Item', 'Métrique collectée', 'CPU usage system.cpu.util'],
            ['Trigger', 'Seuil d\'alerte sur un item', 'CPU > 90% pendant 5min'],
            ['Action', 'Réaction à un trigger', 'Envoyer email + SMS'],
            ['Template', 'Ensemble d\'items et triggers réutilisable', 'Template Linux by Zabbix Agent'],
            ['Dashboard', 'Tableau de bord personnalisable', 'Graphes CPU RAM réseau'],
            ['Map', 'Carte réseau visuelle avec statut', 'Topologie du datacenter'],
          ]},
          { type: 'h2', content: 'SNMP — Simple Network Management Protocol' },
          { type: 'code', content: '# Activer SNMP sur un équipement réseau Cisco\nRouter(config)# snmp-server community public RO\nRouter(config)# snmp-server location "Salle Serveurs"\nRouter(config)# snmp-server contact "admin@tssr.local"\n\n# Activer SNMP sur Linux\napt install snmpd snmp\n# Configurer /etc/snmp/snmpd.conf\nrocommunity public 192.168.1.100    # Autoriser le serveur Zabbix\n\n# Tester SNMP depuis Zabbix\nsnmpwalk -v2c -c public 192.168.1.1 .1.3.6.1.2.1.1  # Infos système\nsnmpget -v2c -c public 192.168.1.1 sysDescr.0        # Description' },
        ],
      },
      {
        id: 'itil-tickets',
        titre: 'ITIL v4 et Gestion des Tickets (GLPI)',
        sections: [
          { type: 'h2', content: 'ITIL v4 — Les pratiques essentielles' },
          { type: 'table', headers: ['Pratique ITIL', 'Description', 'Exemple concret'], rows: [
            ['Gestion des incidents', 'Restaurer le service rapidement', 'Serveur web en panne → ticket P1'],
            ['Gestion des problèmes', 'Trouver la cause racine', 'Pourquoi le serveur tombe chaque lundi ?'],
            ['Gestion des changements', 'Contrôler les modifications', 'Procédure de mise à jour serveur'],
            ['Gestion des actifs', 'Inventaire du parc informatique', 'CMDB — base des CIs'],
            ['Service Desk', 'Point de contact unique utilisateurs', 'Helpdesk téléphone + tickets'],
            ['Gestion des niveaux de service', 'SLA — engagements de service', 'Résolution incident P1 en 4h'],
          ]},
          { type: 'h2', content: 'Niveaux de priorité des incidents' },
          { type: 'table', headers: ['Priorité', 'Nom', 'Délai résolution', 'Exemple'], rows: [
            ['P1', 'Critique', '1-4 heures', 'Serveur de production en panne totale'],
            ['P2', 'Majeur', '8 heures', 'Service dégradé affectant plusieurs utilisateurs'],
            ['P3', 'Modéré', '72 heures', 'Un utilisateur ne peut plus accéder à une app'],
            ['P4', 'Mineur', '1 semaine', 'Demande d\'installation d\'un logiciel'],
          ]},
          { type: 'h2', content: 'GLPI — Gestion Libre de Parc Informatique' },
          { type: 'code', content: '# Installation GLPI sur Debian\napt install apache2 php php-mysql php-curl php-gd php-xml php-mbstring\napt install mysql-server\n\n# Télécharger GLPI\nwget https://github.com/glpi-project/glpi/releases/download/10.0.12/glpi-10.0.12.tgz\ntar -xzf glpi-10.0.12.tgz -C /var/www/html/\n\n# Base de données\nmysql -u root -p\nCREATE DATABASE glpi;\nCREATE USER \'glpi\'@\'localhost\' IDENTIFIED BY \'glpi_pass\';\nGRANT ALL ON glpi.* TO \'glpi\'@\'localhost\';\n\n# Accès : http://VOTRE_IP/glpi\n# Compte par défaut : glpi / glpi (à changer immédiatement !)' },
          { type: 'h2', content: 'Syslog centralisé' },
          { type: 'code', content: '# Configurer rsyslog pour centraliser les logs\n# Sur le serveur de logs (/etc/rsyslog.conf)\n# Décommenter ces lignes :\nmodule(load="imudp")\ninput(type="imudp" port="514")\nmodule(load="imtcp")\ninput(type="imtcp" port="514")\n\n# Stocker les logs par hôte\n$template RemoteLogs,"/var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log"\n*.* ?RemoteLogs\n\n# Sur les clients Linux (/etc/rsyslog.conf)\n*.* @192.168.1.50:514    # UDP\n*.* @@192.168.1.50:514   # TCP\n\nsystemctl restart rsyslog' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'stockage',
    label: 'Stockage & Sauvegarde',
    icon: '💾',
    color: '#f59e0b',
    desc: 'RAID, SAN, NAS, iSCSI, stratégies de sauvegarde...',
    topics: ['RAID', 'SAN', 'NAS', 'iSCSI', 'Veeam', 'Sauvegarde'],
    cours: [
      {
        id: 'raid-complet',
        titre: 'RAID — Niveaux, Configuration et Gestion',
        sections: [

          { type: 'h2', content: '1. Qu\'est-ce que le RAID ?' },
          { type: 'p', content: 'RAID (Redundant Array of Independent Disks) combine plusieurs disques physiques pour améliorer les performances, la redondance ou les deux. Il en existe deux implémentations : le RAID <strong>matériel</strong> (contrôleur dédié) et le RAID <strong>logiciel</strong> (géré par l\'OS).' },
          { type: 'table', headers: ['Type', 'Avantages', 'Inconvénients', 'Exemples'], rows: [
            ['RAID Matériel', 'Transparent pour l\'OS, performances optimales, batterie de cache', 'Coût élevé, dépendance au contrôleur', 'Dell PERC HP SmartArray LSI MegaRAID'],
            ['RAID Logiciel', 'Gratuit, portable entre serveurs, flexible', 'Utilise CPU et RAM du serveur', 'Linux mdadm Windows Storage Spaces'],
            ['RAID Hybride', 'Contrôleur matériel avec cache logiciel', 'Complexité', 'ZFS avec HBA passthrough'],
          ]},
          { type: 'warn', content: '<strong>RAID ≠ SAUVEGARDE :</strong> Le RAID protège contre la panne d\'un disque physique. Il ne protège PAS contre la suppression accidentelle, un ransomware, une corruption logicielle, un incendie ou le vol. Une sauvegarde externe reste indispensable.' },

          { type: 'h2', content: '2. RAID 0 — Striping (Performance pure)' },
          { type: 'p', content: 'Les données sont découpées en blocs et réparties alternativement sur tous les disques. Les lectures/écritures se font en parallèle — performance maximale. Aucune redondance.' },
          { type: 'code', content: '# Fonctionnement RAID 0 avec 2 disques :\n\n# Données : A B C D E F G H\n# Disque 1 : A C E G  (blocs impairs)\n# Disque 2 : B D F H  (blocs pairs)\n\n# Lecture du fichier : lit en parallèle sur D1 et D2\n# → Débit = débit_D1 + débit_D2\n# Exemple : 2 × 500 Mo/s = 1 Go/s de débit séquentiel\n\n# Si un disque tombe en panne : TOUT est perdu\n# D1 panne → A, C, E, G perdus → fichier incomplet → irrécupérable\n\necho "=== RAID 0 en chiffres ===" \necho "2 disques de 1 To : capacité utile = 2 To (100%)"\necho "3 disques de 1 To : capacité utile = 3 To (100%)"\necho "Tolérance panne  : AUCUNE"\necho "Usage : cache, rendu vidéo, scratchpad"\n\n# Configuration RAID 0 avec mdadm :\napt install mdadm\n\n# Vérifier les disques disponibles\nlsblk\nfdisk -l\n\n# Créer le RAID 0\nmdadm --create /dev/md0 \\\n  --level=0 \\\n  --raid-devices=2 \\\n  /dev/sdb /dev/sdc\n\n# Formater et monter\nmkfs.ext4 /dev/md0\nmkdir /mnt/raid0\nmount /dev/md0 /mnt/raid0\n\n# Montage permanent /etc/fstab\necho "/dev/md0  /mnt/raid0  ext4  defaults  0  0" >> /etc/fstab\n\n# Sauvegarder la config mdadm\nmdadm --detail --scan >> /etc/mdadm/mdadm.conf\nupdate-initramfs -u' },

          { type: 'h2', content: '3. RAID 1 — Mirroring (Redondance)' },
          { type: 'p', content: 'Chaque octet écrit sur un disque est simultanément copié sur l\'autre. Si un disque tombe, l\'autre contient toutes les données intactes.' },
          { type: 'code', content: '# Fonctionnement RAID 1 avec 2 disques :\n\n# Données : A B C D\n# Disque 1 : A B C D  (original)\n# Disque 2 : A B C D  (miroir identique)\n\n# Écriture : doit écrire sur les DEUX disques → légèrement plus lent\n# Lecture  : peut lire sur D1 OU D2 → lectures parallèles possibles\n\n# Si D1 tombe : D2 a tout → pas de perte de données\n# Reconstruction après remplacement de D1 :\n# Copier tout D2 vers nouveau D1 → ~2h pour 1 To\n\necho "=== RAID 1 en chiffres ==="\necho "2 disques de 1 To : capacité utile = 1 To (50%)"\necho "3 disques de 1 To : capacité utile = 1 To (33%)"\necho "Tolérance panne   : 1 disque (tous sauf 1)"\necho "Usage : OS serveur données critiques"\n\n# Configuration RAID 1 avec mdadm :\nmdadm --create /dev/md1 \\\n  --level=1 \\\n  --raid-devices=2 \\\n  /dev/sdb /dev/sdc\n\n# Vérifier la synchronisation initiale (peut prendre du temps)\nwatch cat /proc/mdstat\n# md1 : active raid1 sdc[1] sdb[0]\n#       976630464 blocks super 1.2 [2/2] [UU]\n#       [=========>...........]  resync = 45.2% (440M/976M) finish=12.4min\n# UU = les 2 disques sont synchronisés (U=OK, _=KO)\n\n# Simuler une panne et reconstruction :\n# 1. Marquer sdb comme défaillant\nmdadm /dev/md1 --fail /dev/sdb\n\n# 2. Retirer le disque défaillant\nmdadm /dev/md1 --remove /dev/sdb\n\n# 3. Dans un vrai scénario : remplacer physiquement le disque\n# Avec l\'hot-swap : pas besoin d\'arrêter le serveur\n\n# 4. Ajouter le nouveau disque\nmdadm /dev/md1 --add /dev/sdb\n\n# 5. Vérifier la reconstruction\ncat /proc/mdstat\n# [==========>..........]  recovery = 52.1% finish=8.2min speed=124K/sec\n\n# Voir les détails du RAID\nmdadm --detail /dev/md1\n# State : clean\n# Active Devices : 2\n# Failed Devices : 0\n# Spare Devices  : 0\n# UUID : abc123...\n# Number  Major  Minor  RaidDevice State\n#    0    8      16      0      active sync   /dev/sdb\n#    1    8      32      1      active sync   /dev/sdc' },

          { type: 'h2', content: '4. RAID 5 — Striping avec parité distribuée' },
          { type: 'p', content: 'Les données ET la parité sont distribuées sur tous les disques. La parité permet de reconstruire les données d\'un disque perdu par opérations XOR.' },
          { type: 'code', content: '# Fonctionnement RAID 5 avec 3 disques :\n\n# Bande 1 : D1=A  D2=B  D3=P(A⊕B)   P=parité\n# Bande 2 : D1=C  D2=P(C⊕D) D3=D\n# Bande 3 : D1=P(E⊕F) D2=E  D3=F\n# La parité tourne sur les disques → "distribuée"\n\n# Si D2 tombe sur la bande 1 :\n# On a A (D1) et P=A⊕B (D3)\n# B = P ⊕ A = (A⊕B) ⊕ A = B  ← Reconstruction !\n\necho "=== RAID 5 en chiffres ==="\necho "3 disques de 1 To : capacité utile = 2 To (66%)"\necho "4 disques de 1 To : capacité utile = 3 To (75%)"\necho "5 disques de 1 To : capacité utile = 4 To (80%)"\necho "Tolérance panne   : 1 disque"\necho "Usage : NAS serveurs de fichiers stockage"\n\n# Configuration RAID 5 + spare :\nmdadm --create /dev/md5 \\\n  --level=5 \\\n  --raid-devices=3 \\\n  --spare-devices=1 \\\n  /dev/sdb /dev/sdc /dev/sdd /dev/sde\n# sde = spare (hot spare) : remplace automatiquement un disque défaillant\n\n# Avec chunk size optimisé (performances) :\nmdadm --create /dev/md5 \\\n  --level=5 \\\n  --raid-devices=3 \\\n  --chunk=512 \\\n  /dev/sdb /dev/sdc /dev/sdd\n\n# Performance RAID 5 :\n# Lecture séquentielle : (n-1) × débit_disque  = 2 × 500 = 1 Go/s\n# Écriture séquentielle : pénalité parité → 60-70% du RAID 0\n# RAID 5 Write Hole : risque de corruption si coupure pendant écriture\n# Solution : NVCache (cache avec batterie) ou RAID 6\n\n# Surveiller le RAID 5 :\ncat /proc/mdstat\nmdadm --detail /dev/md5\n\n# Configurer les alertes email :\ncat >> /etc/mdadm/mdadm.conf << EOF\nMAILADDR admin@tssr.local\nEOF\n# mdadm envoie un mail si un disque tombe' },

          { type: 'h2', content: '5. RAID 6 et RAID 10' },
          { type: 'code', content: '# RAID 6 — Double parité\n# Peut perdre 2 disques simultanément\n# Minimum 4 disques, capacité utile = (n-2) × taille\n\necho "=== RAID 6 en chiffres ==="\necho "4 disques de 1 To : capacité utile = 2 To (50%)"\necho "6 disques de 1 To : capacité utile = 4 To (66%)"\necho "Tolérance panne   : 2 disques simultanément"\necho "Usage : production critique stockage long terme"\n\nmdadm --create /dev/md6 \\\n  --level=6 \\\n  --raid-devices=4 \\\n  /dev/sdb /dev/sdc /dev/sdd /dev/sde\n\n# RAID 10 — Mirroring + Striping\n# Combine les avantages du RAID 1 (redondance) et RAID 0 (performance)\n# Minimum 4 disques en paires miroirs\n# Capacité utile = 50%\n\necho ""\necho "=== RAID 10 en chiffres ==="\necho "4 disques de 1 To : capacité utile = 2 To (50%)"\necho "6 disques de 1 To : capacité utile = 3 To (50%)"\necho "Tolérance panne   : 1 disque par paire miroir"\necho "Usage : bases de données haute performance"\n\nmdadm --create /dev/md10 \\\n  --level=10 \\\n  --raid-devices=4 \\\n  --layout=n2 \\\n  /dev/sdb /dev/sdc /dev/sdd /dev/sde\n# n2 = near layout (chaque bloc copié sur 2 disques contigus)\n\n# Tableau comparatif final :\n# RAID  Disques min  Panne tolérée  Capacité  Perfs lecture  Perfs écriture\n# 0     2            0              100%      Excellente     Excellente\n# 1     2            n-1            50%       Bonne          Normale\n# 5     3            1              (n-1)/n   Très bonne     Pénalité parité\n# 6     4            2              (n-2)/n   Bonne          Double pénalité\n# 10    4            1/paire        50%       Excellente     Bonne' },

          { type: 'h2', content: '6. Gestion RAID Windows — Storage Spaces' },
          { type: 'code', content: '# Storage Spaces = RAID logiciel Windows Server\n\n# Voir les disques disponibles pour le pool\nGet-PhysicalDisk | Where-Object CanPool -eq $true | `\n  Select-Object FriendlyName, Size, MediaType\n\n# Créer un Storage Pool\n$disques = Get-PhysicalDisk | Where-Object CanPool -eq $true\n$subsystem = Get-StorageSubSystem\n\nNew-StoragePool `\n  -FriendlyName "Pool-Production" `\n  -StorageSubSystemFriendlyName $subsystem.FriendlyName `\n  -PhysicalDisks $disques\n\n# Créer un disque virtuel RAID 1 (Mirror)\nNew-VirtualDisk `\n  -StoragePoolFriendlyName "Pool-Production" `\n  -FriendlyName "VDisk-OS-Mirror" `\n  -ResiliencySettingName "Mirror" `\n  -NumberOfDataCopies 2 `\n  -Size 100GB\n\n# Créer un disque virtuel RAID 5 (Parity)\nNew-VirtualDisk `\n  -StoragePoolFriendlyName "Pool-Production" `\n  -FriendlyName "VDisk-Data-Parity" `\n  -ResiliencySettingName "Parity" `\n  -UseMaximumSize\n\n# Initialiser, partitionner et formater\nGet-VirtualDisk -FriendlyName "VDisk-Data-Parity" | `\n  Get-Disk | `\n  Initialize-Disk -PartitionStyle GPT -PassThru | `\n  New-Partition -AssignDriveLetter -UseMaximumSize | `\n  Format-Volume -FileSystem NTFS -NewFileSystemLabel "Data-RAID5" -Confirm:$false\n\n# Vérifier l\'état\nGet-VirtualDisk | Select-Object FriendlyName, OperationalStatus, HealthStatus\nGet-StoragePool -FriendlyName "Pool-Production" | Get-PhysicalDisk | `\n  Select-Object FriendlyName, OperationalStatus, HealthStatus' },
        ],
      },

      {
        id: 'san-nas-iscsi',
        titre: 'SAN, NAS et iSCSI — Stockage Réseau',
        sections: [

          { type: 'h2', content: '1. NAS vs SAN — Différences fondamentales' },
          { type: 'table', headers: ['Critère', 'NAS (Network Attached Storage)', 'SAN (Storage Area Network)'], rows: [
            ['Niveau d\'accès', 'Fichier (niveau fichier)', 'Bloc (niveau bloc = disque brut)'],
            ['Protocoles', 'NFS (Linux) SMB/CIFS (Windows) FTP', 'iSCSI Fibre Channel FCoE'],
            ['Ce que voit le client', 'Un partage réseau (chemin UNC ou mount point)', 'Un disque dur local (sdb, E:\\)'],
            ['Système de fichiers', 'Géré par le NAS', 'Géré par le serveur client'],
            ['Performance', 'Bonne (dépend du réseau et du NAS)', 'Excellente (latence très faible)'],
            ['Coût', 'Accessible (Synology QNAP 500€-5000€)', 'Élevé (NetApp Pure Storage 10k€+)'],
            ['Usage typique', 'Partage de fichiers bureautique sauvegardes', 'VMs bases de données production critique'],
          ]},

          { type: 'h2', content: '2. NFS — Network File System (Linux)' },
          { type: 'code', content: '# NFS permet de partager des répertoires réseau entre machines Linux\n# Transparent pour les applications : /mnt/partage se comporte comme un disque local\n\n# Installation serveur NFS\napt install nfs-kernel-server\n\n# Configurer les exports /etc/exports\n# Syntaxe : chemin  client(options)\ncat > /etc/exports << EOF\n# Partage lecture/écriture pour tout le réseau\n/srv/partage    192.168.1.0/24(rw,sync,no_subtree_check)\n\n# Partage lecture seule pour un serveur spécifique\n/srv/backup     192.168.1.50(ro,sync,no_subtree_check)\n\n# Pour les VMs (no_root_squash = root VM = root NFS)\n/srv/vms        192.168.1.200(rw,sync,no_subtree_check,no_root_squash)\n\n# Partage public accessible depuis partout\n/srv/public     *(ro,sync,no_subtree_check)\nEOF\n\n# Options NFS importantes :\n# rw / ro           : lecture-écriture / lecture seule\n# sync              : écriture synchrone (safe mais plus lent)\n# async             : écriture asynchrone (rapide mais risque perte données)\n# no_subtree_check  : désactive la vérification de sous-arbre (perf + stabilité)\n# root_squash       : root client = nobody serveur (sécurité - défaut)\n# no_root_squash    : root client = root serveur (VMs containers)\n# all_squash        : tous les users = nobody (partages publics)\n# anonuid=1001      : UID anonyme spécifique\n\n# Appliquer les exports\nexportfs -ra                     # Recharger tous les exports\nexportfs -v                      # Voir les exports actifs\nexportfs -u 192.168.1.50:/srv/backup  # Unexport un partage\n\n# Démarrer NFS\nsystemctl enable --now nfs-kernel-server\n\n# Ouvrir le pare-feu\nufw allow from 192.168.1.0/24 to any port nfs\nufw allow from 192.168.1.0/24 to any port 111  # portmapper rpcbind\n\n# ──────────────────────────────────────────────\n# CLIENT NFS\n# ──────────────────────────────────────────────\napt install nfs-common\n\n# Découvrir les partages disponibles sur un serveur\nshowmount -e 192.168.1.10\n# Export list for 192.168.1.10:\n# /srv/partage 192.168.1.0/24\n# /srv/backup  192.168.1.50\n\n# Monter un partage NFS\nmount -t nfs 192.168.1.10:/srv/partage /mnt/partage\n\n# Monter avec options de performance\nmount -t nfs \\\n  -o rsize=65536,wsize=65536,hard,intr,timeo=14 \\\n  192.168.1.10:/srv/partage /mnt/partage\n\n# Options montage client :\n# rsize/wsize : taille des blocs lecture/écriture (max 65536 pour NFS v3)\n# hard        : réessayer indéfiniment si serveur indisponible\n# soft        : retourner erreur si timeout (risque corruption)\n# intr        : permettre l\'interruption des opérations\n# timeo=14    : timeout 1.4 secondes\n# nfsvers=4   : forcer NFS v4\n\n# Montage permanent /etc/fstab\necho "192.168.1.10:/srv/partage  /mnt/partage  nfs  defaults,_netdev  0  0" >> /etc/fstab\n# _netdev : attendre que le réseau soit disponible avant de monter\n\n# Vérifier les montages NFS actifs\nmount | grep nfs\ndf -hT | grep nfs' },

          { type: 'h2', content: '3. SMB/CIFS — Partage Windows (Samba)' },
          { type: 'code', content: '# Samba permet de partager des fichiers entre Linux et Windows\n# Les clients Windows voient les partages comme des partages réseau Windows\n\n# Installation\napt install samba samba-common-bin\n\n# Configuration /etc/samba/smb.conf\ncat > /etc/samba/smb.conf << EOF\n[global]\n   workgroup = TSSR\n   server string = Serveur Samba TSSR\n   security = user\n   map to guest = never\n   log level = 1\n   log file = /var/log/samba/log.%m\n   max log size = 1000\n\n# Partage public en lecture\n[Public]\n   path = /srv/public\n   comment = Partage public\n   browseable = yes\n   read only = yes\n   guest ok = yes\n\n# Partage privé pour le groupe admins\n[Admins]\n   path = /srv/admins\n   comment = Partage Administrateurs\n   browseable = yes\n   read only = no\n   valid users = @admins\n   create mask = 0660\n   directory mask = 0770\n   force group = admins\n\n# Partage personnel par utilisateur\n[Homes]\n   comment = Répertoires personnels\n   browseable = no\n   read only = no\n   create mask = 0700\n   valid users = %S\nEOF\n\n# Vérifier la syntaxe\ntestparm\n\n# Créer les répertoires et permissions\nmkdir -p /srv/public /srv/admins\nchown -R root:admins /srv/admins\nchmod 2770 /srv/admins    # SetGID : nouveaux fichiers héritent du groupe\n\n# Créer un utilisateur Samba\n# L\'utilisateur doit exister en Linux :\nuseradd -M -s /usr/sbin/nologin anthony\n# Créer son compte Samba :\nsmbpasswd -a anthony\n# Activer :\nsmbpasswd -e anthony\n\n# Redémarrer Samba\nsystemctl restart smbd nmbd\nsystemctl enable smbd nmbd\n\n# Pare-feu\nufw allow samba\n\n# Vérifier les partages\nsmbclient -L localhost -N\n# Sharename  Type  Comment\n# ---------  ----  -------\n# Public     Disk  Partage public\n# Admins     Disk  Partage Administrateurs\n\n# Tester la connexion\nsmbclient //192.168.1.10/Public -N\nsmbclient //192.168.1.10/Admins -U anthony\n\n# Monter un partage Samba depuis Linux\napt install cifs-utils\nmount -t cifs //192.168.1.10/Admins /mnt/admins \\\n  -o username=anthony,password=P@ss,domain=TSSR,uid=1000,gid=1000\n\n# Montage permanent avec fichier credentials\ncat > /root/.smbcredentials << EOF\nusername=anthony\npassword=P@ssword2024!\ndomain=TSSR\nEOF\nchmod 600 /root/.smbcredentials\n\necho "//192.168.1.10/Admins  /mnt/admins  cifs  credentials=/root/.smbcredentials,uid=1000,gid=1000,_netdev  0  0" >> /etc/fstab' },

          { type: 'h2', content: '4. iSCSI — Stockage en mode bloc sur réseau' },
          { type: 'p', content: 'iSCSI transporte les commandes SCSI sur TCP/IP. Le serveur (Target) expose des LUNs (disques logiques) que les clients (Initiators) voient comme des disques locaux.' },
          { type: 'code', content: '# ──────────────────────────────────────────────\n# SERVEUR iSCSI TARGET (Linux avec tgt)\n# ──────────────────────────────────────────────\napt install tgt\n\n# Créer les disques virtuels\nmkdir -p /srv/iscsi\n\n# Méthode 1 : Fichier image\ndd if=/dev/zero of=/srv/iscsi/lun0.img bs=1G count=50\n# Crée un fichier de 50 Go — plus flexible\n\n# Méthode 2 : Partition dédiée (meilleures performances)\n# Utiliser /dev/sdb directement comme LUN\n\n# Configuration /etc/tgt/conf.d/iscsi.conf\ncat > /etc/tgt/conf.d/iscsi.conf << EOF\n<target iqn.2024-01.local.tssr:stockage01>\n    # Fichier ou device qui sera la LUN\n    backing-store /srv/iscsi/lun0.img\n\n    # Autoriser uniquement les clients du LAN\n    initiator-address 192.168.1.0/24\n\n    # Authentification CHAP (optionnel mais recommandé)\n    incominguser iscsi-user MotDePasseISCSI2024!\n    outgoinguser iscsi-server MotDePasseServeur2024!\n\n    # Plusieurs LUNs dans le même target\n    # backing-store /srv/iscsi/lun1.img\n    # backing-store /dev/sdc\n</target>\nEOF\n\n# Nommage IQN (iSCSI Qualified Name) :\n# iqn.AAAA-MM.domaine-inverse:identifiant\n# iqn = préfixe obligatoire\n# 2024-01 = année-mois de création\n# local.tssr = domaine inversé\n# stockage01 = identifiant unique\n\n# Démarrer tgt\nsystemctl enable --now tgt\n\n# Vérifier les targets\ntgtadm --mode target --op show\n# Target 1: iqn.2024-01.local.tssr:stockage01\n#     System information:\n#         Driver: iscsi\n#         State: ready\n#     I_T nexus information:\n#     LUN information:\n#         LUN: 0\n#             Type: controller\n#         LUN: 1\n#             Type: disk\n#             Backing store type: rdwr\n#             Backing store path: /srv/iscsi/lun0.img\n\n# Ouvrir le pare-feu (port 3260)\nufw allow from 192.168.1.0/24 to any port 3260\n\n# ──────────────────────────────────────────────\n# CLIENT iSCSI INITIATOR (Linux)\n# ──────────────────────────────────────────────\napt install open-iscsi\n\n# Découvrir les targets disponibles\niscsiadm -m discovery -t sendtargets -p 192.168.1.10\n# 192.168.1.10:3260,1 iqn.2024-01.local.tssr:stockage01\n\n# Configurer l\'authentification CHAP\n# /etc/iscsi/iscsid.conf :\nsed -i \'s/#node.session.auth.authmethod = CHAP/node.session.auth.authmethod = CHAP/\' /etc/iscsi/iscsid.conf\nsed -i \'s/#node.session.auth.username = username/node.session.auth.username = iscsi-user/\' /etc/iscsi/iscsid.conf\nsed -i \'s/#node.session.auth.password = password/node.session.auth.password = MotDePasseISCSI2024!/\' /etc/iscsi/iscsid.conf\n\n# Se connecter au target\niscsiadm -m node \\\n  -T iqn.2024-01.local.tssr:stockage01 \\\n  -p 192.168.1.10 \\\n  --login\n\n# Vérifier que le disque est apparu\nlsblk\n# sdb    8:16   0  50G  0 disk   ← Nouveau disque iSCSI !\nfdisk -l /dev/sdb\n\n# Le disque se comporte comme un disque local\nmkfs.ext4 /dev/sdb\nmkdir /mnt/iscsi\nmount /dev/sdb /mnt/iscsi\ndf -h /mnt/iscsi\n# /dev/sdb  49G  52M  46G  1% /mnt/iscsi\n\n# Connexion automatique au démarrage\niscsiadm -m node \\\n  -T iqn.2024-01.local.tssr:stockage01 \\\n  -p 192.168.1.10 \\\n  --op update \\\n  --name node.startup \\\n  --value automatic\n\n# Déconnecter proprement\numount /mnt/iscsi\niscsiadm -m node \\\n  -T iqn.2024-01.local.tssr:stockage01 \\\n  -p 192.168.1.10 \\\n  --logout' },

          { type: 'h2', content: '5. LVM — Logical Volume Manager' },
          { type: 'p', content: 'LVM ajoute une couche d\'abstraction entre les disques physiques et les systèmes de fichiers. Il permet de redimensionner les volumes à chaud, créer des snapshots et agréger plusieurs disques.' },
          { type: 'code', content: '# Architecture LVM :\n# Disques physiques → Physical Volumes (PV)\n# PV regroupés → Volume Group (VG)\n# VG découpé en → Logical Volumes (LV)\n# LV formatés → Systèmes de fichiers\n\n# Exemple :\n# /dev/sdb + /dev/sdc (PV) → vg-data (VG, 2To)\n# vg-data → lv-web (400Go) + lv-mail (200Go) + lv-backup (1.4To)\n\n# 1. Créer les Physical Volumes\npvcreate /dev/sdb /dev/sdc\npvs\n# PV         VG  Fmt  Attr PSize   PFree\n# /dev/sdb   --- lvm2 ---  1.00t   1.00t\n# /dev/sdc   --- lvm2 ---  1.00t   1.00t\n\n# 2. Créer le Volume Group\nvgcreate vg-data /dev/sdb /dev/sdc\nvgs\n# VG       #PV #LV #SN Attr   VSize VFree\n# vg-data    2   0   0 wz--n- 2.00t 2.00t\n\n# 3. Créer les Logical Volumes\nlvcreate -L 400G -n lv-web vg-data\nlvcreate -L 200G -n lv-mail vg-data\nlvcreate -l 100%FREE -n lv-backup vg-data  # Reste de l\'espace\nlvs\n# LV         VG       Attr       LSize\n# lv-backup  vg-data  -wi-a----- 1.40t\n# lv-mail    vg-data  -wi-a----- 200.00g\n# lv-web     vg-data  -wi-a----- 400.00g\n\n# 4. Formater et monter\nmkfs.ext4 /dev/vg-data/lv-web\nmkfs.ext4 /dev/vg-data/lv-mail\nmkfs.xfs  /dev/vg-data/lv-backup  # XFS pour les gros volumes\n\nmkdir -p /var/www /var/mail /backup\nmount /dev/vg-data/lv-web  /var/www\nmount /dev/vg-data/lv-mail /var/mail\nmount /dev/vg-data/lv-backup /backup\n\n# /etc/fstab\ncat >> /etc/fstab << EOF\n/dev/vg-data/lv-web    /var/www  ext4  defaults  0  2\n/dev/vg-data/lv-mail   /var/mail ext4  defaults  0  2\n/dev/vg-data/lv-backup /backup   xfs   defaults  0  2\nEOF\n\n# ──────────────────────────────────────────────\n# EXTENSIONS LVM À CHAUD (sans interruption)\n# ──────────────────────────────────────────────\n\n# Étendre lv-web de 200 Go supplémentaires\nlvextend -L +200G /dev/vg-data/lv-web\n# Étendre le système de fichiers (à chaud !)\nresize2fs /dev/vg-data/lv-web          # ext4\n# xfs_growfs /var/www                  # XFS\n\n# Vérifier\ndf -h /var/www\n# /dev/mapper/vg--data-lv--web  600G  ...\n\n# Étendre à tout l\'espace libre\nlvextend -l +100%FREE /dev/vg-data/lv-backup\nxfs_growfs /backup\n\n# Ajouter un nouveau disque au VG\npvcreate /dev/sdd\nvgextend vg-data /dev/sdd\nvgs  # VFree a augmenté\n\n# Snapshot LVM (avant une mise à jour risquée)\nlvcreate -L 50G -s -n snap-web /dev/vg-data/lv-web\n# -s = snapshot, -n = nom, pointe sur lv-web\n# Le snapshot ne stocke que les blocs MODIFIÉS après sa création\n\n# Vérifier l\'utilisation du snapshot\nlvs\n# snap-web  vg-data  swi-aos--- 50.00g  lv-web 5.23%\n\n# Restaurer depuis le snapshot (si mise à jour échoue)\numount /var/www\nlvconvert --merge /dev/vg-data/snap-web\nmount /var/www\n\n# Supprimer le snapshot (si mise à jour réussit)\nlvremove /dev/vg-data/snap-web' },
        ],
      },

      {
        id: 'strategie-sauvegarde',
        titre: 'Stratégies de Sauvegarde — Théorie et Pratique',
        sections: [

          { type: 'h2', content: '1. Les types de sauvegarde' },
          { type: 'table', headers: ['Type', 'Quoi sauvegarder', 'Durée', 'Espace', 'Restauration'], rows: [
            ['Complète (Full)', 'Toutes les données', 'Longue', 'Important', 'Simple : un seul fichier'],
            ['Incrémentale', 'Changements depuis la DERNIÈRE sauvegarde (quelle qu\'elle soit)', 'Courte', 'Minimal', 'Complexe : Full + tous les incrémentiels dans l\'ordre'],
            ['Différentielle', 'Changements depuis la DERNIÈRE COMPLÈTE', 'Moyenne', 'Moyen (grossit dans le temps)', 'Moyenne : Full + dernier différentiel'],
            ['Synthétique', 'Fusion virtuelle Full + incrémentiels sans relire les sources', 'Courte', 'Moyen', 'Simple : comme une Full'],
            ['Continue (CDP)', 'Chaque modification en temps réel', 'Continue', 'Très important', 'Très simple : tout point dans le temps'],
          ]},
          { type: 'code', content: '# Stratégie GFS (Grand-père - Père - Fils)\n# La plus courante en entreprise :\n\n# Fils    : Sauvegarde incrémentale QUOTIDIENNE (lundi-vendredi)\n# Père    : Sauvegarde complète HEBDOMADAIRE (vendredi soir)\n# Grand-père : Sauvegarde complète MENSUELLE (fin de mois)\n\n# Rétention exemple :\n# Quotidiennes  : 7 jours\n# Hebdomadaires : 4 semaines\n# Mensuelles    : 12 mois\n# Annuelles     : 7 ans (légal en France pour données comptables)\n\n# Exemple de planning :\n# Lundi-Jeudi 22h : Incrémentale (15 min)\n# Vendredi   22h  : Complète     (3h)\n# 1er du mois 21h : Complète mensuelle (3h → NAS distant)\n# 1er janvier 21h : Complète annuelle  (→ bande hors site)\n\n# RPO et RTO :\n# RPO (Recovery Point Objective) = perte de données maximale acceptable\n# RTO (Recovery Time Objective)  = durée max d\'indisponibilité acceptable\n\n# Exemple bancaire : RPO = 0 (réplication synchrone), RTO = 30min\n# Exemple PME      : RPO = 24h (sauvegarde quotidienne), RTO = 4h\n# Exemple blog     : RPO = 1 semaine, RTO = 24h' },

          { type: 'h2', content: '2. Règle 3-2-1-1-0' },
          { type: 'code', content: '# Règle 3-2-1 (traditionnelle) :\n# 3 copies des données (original + 2 sauvegardes)\n# 2 supports différents (ex: disque + bande ou NAS)\n# 1 copie hors site (autre bâtiment, cloud, coffre)\n\n# Règle 3-2-1-1-0 (moderne - ransomware aware) :\n# 3 copies\n# 2 supports différents\n# 1 hors site\n# 1 copie air-gapped (déconnectée d\'Internet et du réseau)\n# 0 erreur (tester les restaurations régulièrement)\n\n# Implémentation concrète pour une PME :\n\n# Copie 1 : Données en production\n#   → Serveur de fichiers ou NAS local\n#   → RAID 5 ou 6 pour protection disque\n\n# Copie 2 : Sauvegarde locale (autre support)\n#   → NAS de sauvegarde dédié\n#   → Veeam ou rsync vers NAS2\n#   → Réseau de sauvegarde dédié (VLAN isolation)\n\n# Copie 3 : Hors site (distance physique)\n#   → Cloud (Backblaze B2, AWS S3, Azure Blob)\n#   → Site DR (Disaster Recovery)\n#   → Bande LTO envoyée dans un coffre externe\n\n# Copie air-gapped :\n#   → Bande LTO déconnectée physiquement\n#   → Disque externe déconnecté après la sauvegarde\n#   → Cloud avec Object Lock (immuable - WORM)\n\n# Exemple AWS S3 avec Object Lock (protection ransomware) :\naws s3api create-bucket --bucket tssr-backup-2024 --region eu-west-3\naws s3api put-object-lock-configuration \\\n  --bucket tssr-backup-2024 \\\n  --object-lock-configuration \\\n  \'{"ObjectLockEnabled": "Enabled", "Rule": {"DefaultRetention": {"Mode": "COMPLIANCE", "Days": 30}}}\'\n# COMPLIANCE = même l\'admin AWS ne peut pas supprimer pendant 30 jours\n# WORM = Write Once Read Many' },

          { type: 'h2', content: '3. Sauvegarde Linux avec rsync' },
          { type: 'code', content: '# rsync — Synchronisation incrémentale\n# Seuls les fichiers modifiés sont transférés\n\n# Syntaxe de base\nrsync -av source/ destination/\n# -a = archive (récursif + permissions + dates + liens)\n# -v = verbose\n# -z = compression (réseau lent)\n# -P = progress + partial (reprendre en cas d\'interruption)\n\n# Sauvegarde locale\nrsync -av --delete /var/www/ /backup/www/\n# --delete = supprimer les fichiers supprimés de la source\n\n# Sauvegarde distante via SSH\nrsync -avz -e "ssh -p 2222" \\\n  --delete \\\n  /var/www/ \\\n  anthony@192.168.1.50:/backup/www/\n\n# Sauvegarde avec exclusions\nrsync -av \\\n  --exclude=\'*.tmp\' \\\n  --exclude=\'*.log\' \\\n  --exclude=\'__pycache__/\' \\\n  --exclude=\'.git/\' \\\n  /var/www/ /backup/www/\n\n# Dry-run (simuler sans rien faire)\nrsync -avnc /var/www/ /backup/www/\n# -n = dry run\n# -c = checksum (comparer les fichiers par hash, pas par date)\n\n# Sauvegarde avec rotation (script complet)\ncat > /usr/local/bin/backup-web.sh << \'EOF\'\n#!/bin/bash\n\nSOURCE="/var/www/html"\nDEST="/backup/web"\nDATE=$(date +%Y-%m-%d_%H-%M)\nLOG="/var/log/backup/web-$DATE.log"\nRETENTION=30  # Jours\n\n# Créer le répertoire de log\nmkdir -p /var/log/backup\n\necho "=== Début sauvegarde $DATE ===" | tee $LOG\n\n# Sauvegarde avec lien physiques (hard links = économise de l\'espace)\n# Chaque sauvegarde semble complète mais les fichiers inchangés\n# sont des liens physiques vers la sauvegarde précédente\nif [ -d "$DEST/current" ]; then\n    rsync -av --link-dest="$DEST/current" \\\n        --delete \\\n        "$SOURCE/" \\\n        "$DEST/$DATE/" >> $LOG 2>&1\nelse\n    rsync -av "$SOURCE/" "$DEST/$DATE/" >> $LOG 2>&1\nfi\n\nif [ $? -eq 0 ]; then\n    # Mettre à jour le lien "current"\n    rm -f "$DEST/current"\n    ln -s "$DEST/$DATE" "$DEST/current"\n    echo "✓ Sauvegarde réussie : $DEST/$DATE" | tee -a $LOG\nelse\n    echo "✗ ERREUR lors de la sauvegarde !" | tee -a $LOG\n    echo "Erreur sauvegarde $DATE" | mail -s "ALERTE BACKUP ECHEC" admin@tssr.local\nfi\n\n# Purger les vieilles sauvegardes\nfind "$DEST" -maxdepth 1 -type d -mtime +$RETENTION | \\\n  grep -v "current" | \\\n  xargs rm -rf\n\necho "=== Fin sauvegarde ===" | tee -a $LOG\nEOF\n\nchmod +x /usr/local/bin/backup-web.sh\n\n# Planifier avec cron\necho "0 2 * * * root /usr/local/bin/backup-web.sh" > /etc/cron.d/backup-web' },

          { type: 'h2', content: '4. Veeam Backup — Sauvegarde des VMs' },
          { type: 'code', content: '# Veeam Backup & Replication — Architecture\n\n# Composants :\n# VBR Server     : Serveur principal (orchestre les jobs)\n# Backup Proxy   : Lit les données des VMs depuis l\'hyperviseur\n# Backup Repository : Stocke les fichiers de sauvegarde (.vbk)\n# Mount Server   : Monte les VMs pour restauration granulaire\n\n# Types de backup Veeam :\n# Backup Job     : Sauvegarde standard (VBK = full, VIB = incremental)\n# Replication Job : Réplique la VM vers un autre hôte (DR)\n# Backup Copy Job : Copie les sauvegardes vers un 2e site (3-2-1)\n# CDP Policy     : Continuous Data Protection (quasi-temps réel)\n\n# Modes de traitement des VMs :\n# Network mode   : Via le réseau de production (lent, universel)\n# Direct SAN     : Via le SAN directement (rapide, nécessite SAN)\n# Hot-Add (VMware) : Monter le disque VM sur le proxy (très rapide)\n# Backup from Storage Snapshots : Utilise les snapshots du stockage\n\n# Niveaux de restauration :\n# Full VM Restore        : Restaurer toute la VM\n# Instant VM Recovery    : Démarrer la VM directement depuis la sauvegarde\n# File Level Recovery    : Restaurer des fichiers spécifiques\n# Application Item Recovery : Restaurer des mails AD SQL Exchange\n\n# Configuration via PowerShell Veeam :\nAdd-PSSnapin VeeamPSSnapIn\nConnect-VBRServer -Server "veeam-srv" -User "TSSR\\Administrator" -Password "P@ss"\n\n# Créer un job de sauvegarde\n$vm = Find-VBRViEntity -Name "SRV-PROD-01"\n$repo = Get-VBRBackupRepository -Name "NAS-Backup"\n\n$job = Add-VBRViBackupJob `\n  -Name "Backup-SRV-PROD-01" `\n  -Entity $vm `\n  -BackupRepository $repo\n\n# Configurer la rétention\n$jobOptions = Get-VBRJobOptions -Job $job\n$jobOptions.BackupStorageOptions.RetainCycles = 14  # 14 points de restauration\nSet-VBRJobOptions -Job $job -Options $jobOptions\n\n# Configurer le schedule\nSet-VBRJobSchedule `\n  -Job $job `\n  -Daily `\n  -At "22:00" `\n  -DailyKind Everyday\n\nEnable-VBRJobSchedule -Job $job\n\n# Lancer une sauvegarde manuelle\nStart-VBRJob -Job $job\n\n# Voir les sessions de sauvegarde\nGet-VBRBackupSession | `\n  Select-Object JobName, CreationTime, EndTime, Result, Progress | `\n  Sort-Object CreationTime -Descending | `\n  Format-Table -AutoSize\n\n# Restauration instantanée\n$restore = Start-VBRRestoreVM `\n  -VmRestorePoint (Get-VBRRestorePoint | Where-Object {$_.Name -eq "SRV-PROD-01"} | Select-Object -First 1) `\n  -Reason "Test de restauration PRA" `\n  -PowerUp\n\n# Voir l\'état de la restauration\nGet-VBRRestoreSession' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'cloud',
    label: 'Cloud & Azure',
    icon: '☁️',
    color: '#0ea5e9',
    desc: 'Azure, AWS, IaaS PaaS SaaS, Azure AD, VMs réseau cloud...',
    topics: ['Azure', 'AWS', 'IaaS', 'PaaS', 'SaaS', 'Azure AD'],
    cours: [
      {
        id: 'concepts-cloud',
        titre: 'Concepts Cloud — IaaS, PaaS, SaaS et modèles de déploiement',
        sections: [
          { type: 'h2', content: 'Les 3 modèles de service Cloud' },
          { type: 'table', headers: ['Modèle', 'Tu gères', 'Le provider gère', 'Exemples'], rows: [
            ['IaaS (Infrastructure)', 'OS Applications Données', 'Serveurs Réseau Stockage Virtualisation', 'Azure VMs AWS EC2 GCP Compute'],
            ['PaaS (Platform)', 'Applications Données', 'Tout le reste + OS + Runtime', 'Azure App Service AWS Elastic Beanstalk Heroku'],
            ['SaaS (Software)', 'Configuration utilisateur uniquement', 'Tout', 'Microsoft 365 Salesforce Gmail Dropbox'],
          ]},
          { type: 'info', content: 'Analogie pizza : IaaS = livraison ingrédients (tu cuisines). PaaS = pizza livrée crue (tu cuisines). SaaS = pizza livrée prête à manger.' },
          { type: 'h2', content: 'Modèles de déploiement' },
          { type: 'table', headers: ['Modèle', 'Description', 'Avantages', 'Inconvénients'], rows: [
            ['Public', 'Infrastructure partagée chez le provider', 'Coût réduit scalabilité', 'Moins de contrôle souveraineté données'],
            ['Privé', 'Infrastructure dédiée on-premise ou hébergée', 'Contrôle total sécurité', 'Coût élevé maintenance'],
            ['Hybride', 'Mix public + privé interconnectés', 'Flexibilité continuité', 'Complexité gestion'],
            ['Multi-cloud', 'Plusieurs providers simultanément', 'Pas de vendor lock-in', 'Complexité maximale'],
          ]},
          { type: 'h2', content: 'Modèle de responsabilité partagée' },
          { type: 'p', content: 'La sécurité dans le cloud est une responsabilité partagée entre le provider et le client. Ce que tu gères dépend du modèle de service.' },
          { type: 'table', headers: ['Responsabilité', 'On-Premise', 'IaaS', 'PaaS', 'SaaS'], rows: [
            ['Données', 'Client', 'Client', 'Client', 'Client'],
            ['Identités et accès', 'Client', 'Client', 'Client', 'Client'],
            ['Applications', 'Client', 'Client', 'Client', 'Provider'],
            ['OS', 'Client', 'Client', 'Provider', 'Provider'],
            ['Virtualisation', 'Client', 'Provider', 'Provider', 'Provider'],
            ['Matériel physique', 'Client', 'Provider', 'Provider', 'Provider'],
          ]},
          { type: 'h2', content: 'Principaux providers Cloud' },
          { type: 'table', headers: ['Provider', 'Part de marché', 'Services phares', 'Spécialité'], rows: [
            ['Microsoft Azure', '23%', 'Azure VMs AD Office 365 Teams', 'Intégration Microsoft excellente'],
            ['Amazon AWS', '32%', 'EC2 S3 Lambda RDS', 'Leader historique plus grand catalogue'],
            ['Google Cloud', '11%', 'GKE BigQuery Vertex AI', 'IA et data analytics'],
            ['OVHcloud', '<5%', 'VPS baremetal', 'Souveraineté données européenne RGPD'],
          ]},
        ],
      },
      {
        id: 'azure-fondamentaux',
        titre: 'Microsoft Azure — Fondamentaux et Services Essentiels',
        sections: [
          { type: 'h2', content: 'Structure Azure' },
          { type: 'table', headers: ['Niveau', 'Description', 'Exemple'], rows: [
            ['Tenant (annuaire)', 'Instance Azure AD de l\'organisation', 'tssr.onmicrosoft.com'],
            ['Abonnement (subscription)', 'Unité de facturation et de contrôle d\'accès', 'Prod Dev Test'],
            ['Groupe de ressources', 'Conteneur logique pour regrouper les ressources', 'RG-Production RG-Dev'],
            ['Ressource', 'Service Azure individuel', 'VM réseau virtuel base de données'],
          ]},
          { type: 'h2', content: 'Régions et zones de disponibilité' },
          { type: 'p', content: 'Azure dispose de plus de 60 régions dans le monde. Chaque région est composée de zones de disponibilité (datacenters indépendants avec alimentation et réseau séparés).' },
          { type: 'table', headers: ['Région Azure', 'Localisation', 'Souveraineté'], rows: [
            ['France Central', 'Paris', 'Données en France'],
            ['France South', 'Marseille', 'Données en France'],
            ['West Europe', 'Amsterdam', 'UE'],
            ['North Europe', 'Dublin', 'UE'],
            ['East US', 'Virginie', 'USA'],
          ]},
          { type: 'h2', content: 'Azure CLI — Administration en ligne de commande' },
          { type: 'code', content: '# Installation Azure CLI sur Linux\ncurl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash\n\n# Installation sur Windows\nwinget install Microsoft.AzureCLI\n\n# Connexion\naz login\naz account show\naz account list --output table\n\n# Sélectionner un abonnement\naz account set --subscription "Nom-ou-ID-Abonnement"\n\n# Créer un groupe de ressources\naz group create --name "RG-TSSR-Prod" --location "francecentral"\n\n# Lister les groupes de ressources\naz group list --output table' },
          { type: 'h2', content: 'Azure Virtual Machines' },
          { type: 'code', content: '# Créer une VM Linux via Azure CLI\naz vm create \\\n  --resource-group "RG-TSSR-Prod" \\\n  --name "VM-Debian-01" \\\n  --image "Debian:debian-11:11:latest" \\\n  --size "Standard_B2s" \\\n  --admin-username "adminuser" \\\n  --generate-ssh-keys \\\n  --public-ip-sku Standard \\\n  --location "francecentral"\n\n# Créer une VM Windows Server\naz vm create \\\n  --resource-group "RG-TSSR-Prod" \\\n  --name "VM-WinSrv-01" \\\n  --image "Win2022Datacenter" \\\n  --size "Standard_D2s_v3" \\\n  --admin-username "Administrateur" \\\n  --admin-password "P@ssword2024!" \\\n  --location "francecentral"\n\n# Démarrer / Arrêter / Supprimer\naz vm start --resource-group "RG-TSSR-Prod" --name "VM-Debian-01"\naz vm stop --resource-group "RG-TSSR-Prod" --name "VM-Debian-01"\naz vm deallocate --resource-group "RG-TSSR-Prod" --name "VM-Debian-01"\naz vm delete --resource-group "RG-TSSR-Prod" --name "VM-Debian-01"\n\n# Lister les VMs\naz vm list --output table\naz vm show --resource-group "RG-TSSR-Prod" --name "VM-Debian-01"' },
          { type: 'table', headers: ['Taille Azure', 'vCPU', 'RAM', 'Usage'], rows: [
            ['Standard_B1s', '1', '1 Go', 'Tests et dev'],
            ['Standard_B2s', '2', '4 Go', 'Serveurs légers'],
            ['Standard_D2s_v3', '2', '8 Go', 'Serveurs production'],
            ['Standard_D4s_v3', '4', '16 Go', 'Serveurs moyens'],
            ['Standard_F8s_v2', '8', '16 Go', 'Calcul intensif'],
          ]},
          { type: 'h2', content: 'Réseau Azure — VNet et sous-réseaux' },
          { type: 'code', content: '# Créer un réseau virtuel\naz network vnet create \\\n  --resource-group "RG-TSSR-Prod" \\\n  --name "VNet-Prod" \\\n  --address-prefix "10.0.0.0/16" \\\n  --subnet-name "Subnet-Web" \\\n  --subnet-prefix "10.0.1.0/24"\n\n# Ajouter des sous-réseaux\naz network vnet subnet create \\\n  --resource-group "RG-TSSR-Prod" \\\n  --vnet-name "VNet-Prod" \\\n  --name "Subnet-DB" \\\n  --address-prefix "10.0.2.0/24"\n\naz network vnet subnet create \\\n  --resource-group "RG-TSSR-Prod" \\\n  --vnet-name "VNet-Prod" \\\n  --name "Subnet-Mgmt" \\\n  --address-prefix "10.0.3.0/24"\n\n# NSG — Network Security Group (pare-feu Azure)\naz network nsg create \\\n  --resource-group "RG-TSSR-Prod" \\\n  --name "NSG-Web"\n\n# Règle autorisant SSH depuis une IP spécifique\naz network nsg rule create \\\n  --resource-group "RG-TSSR-Prod" \\\n  --nsg-name "NSG-Web" \\\n  --name "Allow-SSH" \\\n  --priority 100 \\\n  --direction Inbound \\\n  --protocol Tcp \\\n  --destination-port-range 22 \\\n  --source-address-prefix "82.64.0.0/16" \\\n  --access Allow' },
          { type: 'h2', content: 'Azure Storage' },
          { type: 'code', content: '# Créer un compte de stockage\naz storage account create \\\n  --name "stgtssr2024" \\\n  --resource-group "RG-TSSR-Prod" \\\n  --location "francecentral" \\\n  --sku "Standard_LRS" \\\n  --kind "StorageV2"\n\n# Créer un conteneur blob\naz storage container create \\\n  --name "sauvegardes" \\\n  --account-name "stgtssr2024" \\\n  --public-access off\n\n# Uploader un fichier\naz storage blob upload \\\n  --account-name "stgtssr2024" \\\n  --container-name "sauvegardes" \\\n  --name "backup-2024.tar.gz" \\\n  --file "/tmp/backup-2024.tar.gz"\n\n# Lister les blobs\naz storage blob list \\\n  --account-name "stgtssr2024" \\\n  --container-name "sauvegardes" \\\n  --output table' },
          { type: 'table', headers: ['Type stockage Azure', 'Description', 'Usage'], rows: [
            ['Blob Storage', 'Objets non structurés', 'Sauvegardes images vidéos logs'],
            ['File Storage', 'Partages SMB dans le cloud', 'Remplacement partage réseau on-premise'],
            ['Queue Storage', 'File de messages', 'Communication entre apps'],
            ['Table Storage', 'Données NoSQL clé-valeur', 'Données structurées simples'],
            ['Disk Storage', 'Disques pour VMs', 'Disques OS et données des VMs'],
          ]},
        ],
      },
      {
        id: 'azure-ad-securite',
        titre: 'Azure Active Directory et Sécurité Cloud',
        sections: [
          { type: 'h2', content: 'Azure AD vs Active Directory on-premise' },
          { type: 'table', headers: ['Critère', 'AD On-Premise', 'Azure AD'], rows: [
            ['Protocole auth', 'Kerberos NTLM', 'OAuth 2.0 OpenID Connect SAML'],
            ['Jointure machines', 'Domaine AD', 'Azure AD Join ou Hybrid Join'],
            ['Structure', 'OU GPO Sites', 'Groupes Conditional Access Intune'],
            ['MFA', 'Optionnel via RADIUS', 'Natif et recommandé'],
            ['Fédération', 'ADFS complexe', 'Simple via Azure AD Connect'],
            ['Usage', 'On-premise uniquement', 'Cloud SaaS Office 365'],
          ]},
          { type: 'h2', content: 'Azure AD Connect — Synchronisation hybride' },
          { type: 'code', content: '# Azure AD Connect synchronise l\'AD on-premise vers Azure AD\n# Installation sur Windows Server membre du domaine\n\n# Télécharger depuis : microsoft.com/download/details.aspx?id=47594\n\n# Configuration via l\'assistant :\n# 1. Connexion Azure AD (compte Global Admin)\n# 2. Connexion AD on-premise (compte Entreprise Admin)\n# 3. Méthode de connexion : Password Hash Sync (recommandé)\n# 4. Filtrage OU (optionnel)\n# 5. Fonctionnalités optionnelles\n\n# Vérifier la synchronisation (PowerShell)\nImport-Module ADSync\nGet-ADSyncScheduler                    # État du scheduler\nStart-ADSyncSyncCycle -PolicyType Delta    # Sync delta (changements)\nStart-ADSyncSyncCycle -PolicyType Initial  # Sync complète' },
          { type: 'h2', content: 'Conditional Access — Accès conditionnel' },
          { type: 'p', content: 'L\'accès conditionnel Azure AD permet de définir des politiques d\'accès basées sur des conditions (lieu, appareil, risque).' },
          { type: 'table', headers: ['Signal', 'Condition', 'Action'], rows: [
            ['Utilisateur', 'Appartient au groupe Admins', 'Exiger MFA'],
            ['Localisation', 'Connexion hors France', 'Bloquer l\'accès'],
            ['Appareil', 'Appareil non géré par Intune', 'Accès limité aux apps web uniquement'],
            ['Application', 'Accès à Azure Portal', 'MFA obligatoire'],
            ['Risque connexion', 'Connexion depuis IP anonyme', 'Exiger changement MDP'],
          ]},
          { type: 'h2', content: 'PowerShell Azure AD' },
          { type: 'code', content: '# Installer le module\nInstall-Module -Name AzureAD -Force\nInstall-Module -Name Az -Force       # Module Az (plus récent)\n\n# Connexion\nConnect-AzureAD\nConnect-AzAccount                    # Module Az\n\n# Gestion utilisateurs Azure AD\n# Lister les utilisateurs\nGet-AzureADUser -All $true | Select-Object DisplayName, UserPrincipalName, AccountEnabled\n\n# Créer un utilisateur\n$passwordProfile = New-Object -TypeName Microsoft.Open.AzureAD.Model.PasswordProfile\n$passwordProfile.Password = "TempP@ss2024!"\n$passwordProfile.ForceChangePasswordNextLogin = $true\n\nNew-AzureADUser `\n  -DisplayName "Jean Dupont" `\n  -UserPrincipalName "j.dupont@tssr.onmicrosoft.com" `\n  -PasswordProfile $passwordProfile `\n  -AccountEnabled $true `\n  -MailNickName "j.dupont" `\n  -UsageLocation "FR"\n\n# Assigner une licence Microsoft 365\n$licence = New-Object -TypeName Microsoft.Open.AzureAD.Model.AssignedLicense\n$licence.SkuId = (Get-AzureADSubscribedSku | Where-Object {$_.SkuPartNumber -eq "ENTERPRISEPACK"}).SkuId\n$licences = New-Object -TypeName Microsoft.Open.AzureAD.Model.AssignedLicenses\n$licences.AddLicenses = $licence\nSet-AzureADUserLicense -ObjectId "j.dupont@tssr.onmicrosoft.com" -AssignedLicenses $licences\n\n# Groupes Azure AD\nNew-AzureADGroup -DisplayName "GRP-Informatique" -MailEnabled $false `\n  -SecurityEnabled $true -MailNickName "GRP-Informatique"\nAdd-AzureADGroupMember -ObjectId (Get-AzureADGroup -SearchString "GRP-Informatique").ObjectId `\n  -RefObjectId (Get-AzureADUser -SearchString "Jean Dupont").ObjectId' },
          { type: 'h2', content: 'AWS — Notions de base' },
          { type: 'table', headers: ['Service AWS', 'Équivalent Azure', 'Description'], rows: [
            ['EC2', 'Azure VM', 'Machines virtuelles'],
            ['S3', 'Azure Blob Storage', 'Stockage objet'],
            ['RDS', 'Azure SQL Database', 'Bases de données managées'],
            ['VPC', 'Azure VNet', 'Réseau virtuel privé'],
            ['IAM', 'Azure AD + RBAC', 'Gestion identités et accès'],
            ['Lambda', 'Azure Functions', 'Fonctions serverless'],
            ['CloudWatch', 'Azure Monitor', 'Monitoring et alertes'],
            ['Route 53', 'Azure DNS', 'Service DNS'],
            ['EKS', 'AKS', 'Kubernetes managé'],
            ['CloudFormation', 'ARM Templates', 'Infrastructure as Code'],
          ]},
          { type: 'code', content: '# AWS CLI — Installation et utilisation de base\n# Installation\npip install awscli\naws configure\n# → AWS Access Key ID\n# → AWS Secret Access Key\n# → Region (ex: eu-west-3 pour Paris)\n# → Output format (json/table/text)\n\n# Commandes essentielles\naws iam get-user                              # Identité actuelle\naws ec2 describe-instances --output table    # Lister les VMs\naws s3 ls                                     # Lister les buckets S3\naws s3 cp fichier.txt s3://mon-bucket/       # Uploader vers S3\naws ec2 start-instances --instance-ids i-1234567890abcdef0\naws ec2 stop-instances --instance-ids i-1234567890abcdef0' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'messagerie',
    label: 'Messagerie',
    icon: '📧',
    color: '#6366f1',
    desc: 'Exchange Server, Postfix, protocoles SMTP IMAP POP3, antispam...',
    topics: ['Exchange', 'Postfix', 'SMTP', 'IMAP', 'Antispam', 'DKIM'],
    cours: [
      {
        id: 'protocoles-messagerie',
        titre: 'Protocoles de Messagerie — SMTP, IMAP, POP3',
        sections: [
          { type: 'h2', content: 'Architecture d\'un système de messagerie' },
          { type: 'p', content: 'Un email passe par plusieurs composants avant d\'arriver à destination.' },
          { type: 'table', headers: ['Composant', 'Rôle', 'Exemple'], rows: [
            ['MUA (Mail User Agent)', 'Client mail de l\'utilisateur', 'Outlook Thunderbird Gmail'],
            ['MTA (Mail Transfer Agent)', 'Serveur qui achemine les emails', 'Postfix Exchange Sendmail'],
            ['MDA (Mail Delivery Agent)', 'Dépose le mail dans la boîte', 'Dovecot Procmail'],
            ['MX Record', 'Enregistrement DNS pointant vers le MTA', 'mail.tssr.local'],
          ]},
          { type: 'h2', content: 'Flux d\'un email — Étape par étape' },
          { type: 'code', content: '# Envoi de jean@tssr.local vers marie@afpa.fr\n\n1. Jean compose son mail dans Outlook (MUA)\n2. Outlook se connecte au serveur SMTP de tssr.local (port 587 avec auth)\n3. Le serveur SMTP de tssr.local consulte le DNS\n   → nslookup -type=MX afpa.fr\n   → Réponse : mail.afpa.fr (priorité 10)\n4. tssr.local envoie le mail à mail.afpa.fr (port 25)\n5. mail.afpa.fr vérifie les enregistrements SPF/DKIM de tssr.local\n6. Si OK → dépôt dans la boîte de Marie via Dovecot (MDA)\n7. Marie se connecte via IMAP (port 993) pour lire son mail' },
          { type: 'h2', content: 'Ports et protocoles' },
          { type: 'table', headers: ['Protocole', 'Port', 'Chiffrement', 'Usage'], rows: [
            ['SMTP', '25', 'Non (STARTTLS optionnel)', 'Relai entre serveurs MTA'],
            ['SMTP Submission', '587', 'STARTTLS obligatoire', 'Envoi depuis client vers serveur'],
            ['SMTPS', '465', 'SSL/TLS dès connexion', 'Envoi sécurisé (ancien mais encore utilisé)'],
            ['IMAP', '143', 'STARTTLS optionnel', 'Lecture mail synchronisée'],
            ['IMAPS', '993', 'SSL/TLS', 'Lecture mail sécurisée (recommandé)'],
            ['POP3', '110', 'Non', 'Téléchargement mail (supprime du serveur)'],
            ['POP3S', '995', 'SSL/TLS', 'Téléchargement sécurisé'],
          ]},
          { type: 'h2', content: 'Enregistrements DNS pour la messagerie' },
          { type: 'code', content: '# SPF — Sender Policy Framework\n# Déclare les serveurs autorisés à envoyer pour votre domaine\n# Enregistrement TXT sur le domaine\ntssr.local. IN TXT "v=spf1 ip4:192.168.1.10 mx include:sendgrid.net ~all"\n\n# Signification :\n# v=spf1    → version SPF\n# ip4:...   → cette IP est autorisée\n# mx        → les serveurs MX sont autorisés\n# include:  → déléguer à un autre domaine\n# ~all      → softfail (mettre en spam si pas dans la liste)\n# -all      → hardfail (rejeter si pas dans la liste)\n\n# DKIM — DomainKeys Identified Mail\n# Signature cryptographique des emails\n# Enregistrement TXT : selector._domainkey.tssr.local\nmail._domainkey.tssr.local. IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBg..."\n\n# DMARC — Domain-based Message Authentication\n# Politique de traitement des mails échouant SPF/DKIM\n_dmarc.tssr.local. IN TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@tssr.local; pct=100"\n\n# Vérifier les enregistrements DNS d\'un domaine\nnslookup -type=MX google.com\nnslookup -type=TXT google.com\ndig TXT google.com\ndig MX google.com' },
        ],
      },
      {
        id: 'postfix-dovecot',
        titre: 'Postfix & Dovecot — Serveur Mail Linux',
        sections: [
          { type: 'h2', content: 'Installation de la stack mail Linux' },
          { type: 'code', content: '# Installer Postfix (MTA) et Dovecot (MDA/IMAP)\napt install postfix dovecot-core dovecot-imapd dovecot-pop3d\n\n# Pendant l\'installation Postfix :\n# Type : Site Internet\n# Nom du domaine mail : tssr.local' },
          { type: 'h2', content: 'Configuration Postfix' },
          { type: 'code', content: '# /etc/postfix/main.cf — Configuration principale\n\n# Identité du serveur\nmyhostname = mail.tssr.local\nmydomain = tssr.local\nmyorigin = $mydomain\n\n# Interfaces d\'écoute\ninet_interfaces = all\ninet_protocols = ipv4\n\n# Domaines locaux\nmydestination = $myhostname, localhost.$mydomain, localhost, $mydomain\n\n# Réseau local autorisé à relayer\nmynetworks = 127.0.0.0/8 192.168.1.0/24\n\n# Stockage des mails\nhome_mailbox = Maildir/\n\n# Taille maximale des messages (10 Mo)\nmessage_size_limit = 10240000\n\n# TLS/SSL\nsmtpd_tls_cert_file = /etc/ssl/certs/mail.crt\nsmtpd_tls_key_file = /etc/ssl/private/mail.key\nsmtpd_use_tls = yes\nsmtpd_tls_security_level = may\n\n# Authentification SASL (pour les clients)\nsmtpd_sasl_auth_enable = yes\nsmtpd_sasl_type = dovecot\nsmtpd_sasl_path = private/auth\nsmtpd_recipient_restrictions =\n    permit_sasl_authenticated,\n    permit_mynetworks,\n    reject_unauth_destination\n\n# Appliquer\npostfix check\nsystemctl restart postfix' },
          { type: 'h2', content: 'Configuration Dovecot' },
          { type: 'code', content: '# /etc/dovecot/dovecot.conf\nprotocols = imap pop3 lmtp\n\n# /etc/dovecot/conf.d/10-mail.conf\nmail_location = maildir:~/Maildir\n\n# /etc/dovecot/conf.d/10-auth.conf\nauth_mechanisms = plain login\n\n# /etc/dovecot/conf.d/10-ssl.conf\nssl = yes\nssl_cert = </etc/ssl/certs/mail.crt\nssl_key = </etc/ssl/private/mail.key\n\n# /etc/dovecot/conf.d/10-master.conf\n# Service d\'authentification pour Postfix\nservice auth {\n  unix_listener /var/spool/postfix/private/auth {\n    mode = 0660\n    user = postfix\n    group = postfix\n  }\n}\n\nsystemctl restart dovecot' },
          { type: 'h2', content: 'Test et dépannage' },
          { type: 'code', content: '# Tester l\'envoi SMTP en telnet\ntelnet mail.tssr.local 25\nEHLO test.local\nMAIL FROM:<test@tssr.local>\nRCPT TO:<admin@tssr.local>\nDATA\nSubject: Test Postfix\n\nCeci est un message de test.\n.\nQUIT\n\n# Tester avec swaks (outil dédié)\napt install swaks\nswaks --to admin@tssr.local --from test@tssr.local --server mail.tssr.local\n\n# Logs Postfix\ntail -f /var/log/mail.log\ngrep "status=bounced" /var/log/mail.log    # Emails rejetés\ngrep "status=sent" /var/log/mail.log        # Emails envoyés\n\n# Voir la file d\'attente\nmailq\npostqueue -p\npostqueue -f    # Tenter de renvoyer tous les mails en attente' },
        ],
      },
      {
        id: 'exchange-server',
        titre: 'Exchange Server — Messagerie Windows',
        sections: [
          { type: 'h2', content: 'Architecture Exchange Server 2019' },
          { type: 'table', headers: ['Rôle', 'Description'], rows: [
            ['Mailbox Server', 'Stocke les boîtes mail base de données (seul rôle dans Exchange 2019)'],
            ['Edge Transport', 'Serveur DMZ pour filtrage antispam avant entrée dans l\'organisation'],
            ['DAG (Database Availability Group)', 'Haute disponibilité — réplication entre plusieurs serveurs Mailbox'],
          ]},
          { type: 'h2', content: 'Installation Exchange 2019' },
          { type: 'code', content: '# Prérequis Windows Server 2019\n# - .NET Framework 4.8\n# - Visual C++ Redistributable\n# - IIS\n# - Active Directory (Exchange doit être dans un domaine)\n\n# Préparer Active Directory\nSetup.exe /PrepareSchema /IAcceptExchangeServerLicenseTerms\nSetup.exe /PrepareAD /OrganizationName:"TSSR-Mail" /IAcceptExchangeServerLicenseTerms\nSetup.exe /PrepareDomain /IAcceptExchangeServerLicenseTerms\n\n# Installation\nSetup.exe /Mode:Install /Roles:Mailbox /IAcceptExchangeServerLicenseTerms\n\n# Post-installation — vérification\nGet-ExchangeDiagnosticInfo -Server SRV-MAIL -Process EdgeTransport -Component Transport' },
          { type: 'h2', content: 'Administration Exchange via PowerShell (EMS)' },
          { type: 'code', content: '# Ouvrir l\'Exchange Management Shell\n# Ou charger le module\nAdd-PSSnapin Microsoft.Exchange.Management.PowerShell.SnapIn\n\n# Gestion des boîtes aux lettres\n# Créer une boîte aux lettres\nNew-Mailbox -Name "Jean Dupont" `\n  -UserPrincipalName "j.dupont@tssr.local" `\n  -Password (ConvertTo-SecureString "P@ss2024" -AsPlainText -Force) `\n  -FirstName "Jean" -LastName "Dupont" `\n  -Database "Mailbox Database 01"\n\n# Lister toutes les boîtes\nGet-Mailbox | Select-Object Name, PrimarySmtpAddress, Database\n\n# Taille d\'une boîte\nGet-MailboxStatistics -Identity "j.dupont" |\n  Select-Object DisplayName, TotalItemSize, ItemCount\n\n# Ajouter une adresse email supplémentaire\nSet-Mailbox -Identity "j.dupont" `\n  -EmailAddresses @{Add="jean.dupont@tssr.local"}\n\n# Boîte partagée (shared mailbox)\nNew-Mailbox -Name "Contact" -Shared\nAdd-MailboxPermission -Identity "Contact" `\n  -User "j.dupont" -AccessRights FullAccess\n\n# Groupe de distribution\nNew-DistributionGroup -Name "Equipe-IT" `\n  -PrimarySmtpAddress "it@tssr.local"\nAdd-DistributionGroupMember -Identity "Equipe-IT" -Member "j.dupont"' },
          { type: 'h2', content: 'Antispam et hygène des messages' },
          { type: 'code', content: '# Configurer le filtrage antispam Exchange\n# Niveau de confiance spam (SCL)\n# SCL 0-4 : probablement pas du spam\n# SCL 5-6 : possible spam\n# SCL 7-9 : spam confirmé\n\n# Activer les agents antispam\n& $env:ExchangeInstallPath\\Scripts\\Install-AntiSpamAgents.ps1\nRestart-Service MSExchangeTransport\n\n# Configurer le filtrage de contenu\nSet-ContentFilterConfig `\n  -SCLDeleteEnabled $true -SCLDeleteThreshold 9 `\n  -SCLRejectEnabled $true -SCLRejectThreshold 7 `\n  -SCLJunkEnabled $true -SCLJunkThreshold 5\n\n# Listes blanches/noires d\'IPs\nAdd-IPAllowListEntry -IPRange 192.168.1.0/24\nAdd-IPBlockListEntry -IPRange 198.51.100.0/24\n\n# Voir les logs de transport\nGet-TransportService | Get-MessageTrackingLog -Sender "j.dupont@tssr.local" `\n  -Start (Get-Date).AddHours(-24) |\n  Select-Object Timestamp, EventId, Recipients, MessageSubject' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'scripting-avance',
    label: 'Scripting & BDD',
    icon: '🐍',
    color: '#10b981',
    desc: 'Python administration, Regex, SQL, MySQL, PowerShell avancé...',
    topics: ['Python', 'Regex', 'SQL', 'MySQL', 'PowerShell', 'API REST'],
    cours: [
      {
        id: 'python-admin',
        titre: 'Python pour l\'Administration Système',
        sections: [
          { type: 'h2', content: 'Pourquoi Python pour les admins ?' },
          { type: 'table', headers: ['Avantage', 'Description'], rows: [
            ['Lisibilité', 'Syntaxe claire — scripts maintenables par toute l\'équipe'],
            ['Bibliothèques', 'Modules pour tout : SSH Ansible API REST Excel PDF...'],
            ['Multiplateforme', 'Même script sur Linux Windows macOS'],
            ['Intégration', 'S\'interface avec Ansible Terraform APIs Cloud'],
            ['Communauté', 'Énorme — solution pour chaque problème admin'],
          ]},
          { type: 'h2', content: 'Bases Python pour l\'administration' },
          { type: 'code', content: '#!/usr/bin/env python3\n# Variables et types\nserveur = "SRV-WEB-01"\nport = 443\nactif = True\nip_list = ["192.168.1.10", "192.168.1.20", "192.168.1.30"]\n\n# Conditions\nif port == 443:\n    print(f"HTTPS actif sur {serveur}")\nelif port == 80:\n    print("HTTP non sécurisé")\nelse:\n    print(f"Port inhabituel : {port}")\n\n# Boucles\nfor ip in ip_list:\n    print(f"Vérification de {ip}...")\n\n# Dictionnaire (équivalent hashtable PS)\nserveurs = {\n    "web": {"ip": "192.168.1.10", "port": 80},\n    "db":  {"ip": "192.168.1.20", "port": 3306},\n}\n\nfor nom, config in serveurs.items():\n    print(f"{nom}: {config[\'ip\']}:{config[\'port\']}")' },
          { type: 'h2', content: 'Gestion des fichiers et système' },
          { type: 'code', content: 'import os\nimport shutil\nimport subprocess\nfrom pathlib import Path\n\n# Opérations fichiers\nchemin = Path("/var/log")\n\n# Lister les fichiers .log\nfor fichier in chemin.glob("*.log"):\n    taille = fichier.stat().st_size\n    print(f"{fichier.name}: {taille/1024:.1f} Ko")\n\n# Lire et écrire\nwith open("/etc/hostname", "r") as f:\n    hostname = f.read().strip()\n\nwith open("/tmp/rapport.txt", "w") as f:\n    f.write(f"Hostname: {hostname}\\n")\n    f.write(f"Date: {os.popen(\'date\').read()}")\n\n# Exécuter des commandes système\nresult = subprocess.run(\n    ["df", "-h"],\n    capture_output=True,\n    text=True\n)\nprint(result.stdout)\n\n# Avec gestion d\'erreur\ntry:\n    result = subprocess.run(\n        ["systemctl", "status", "apache2"],\n        capture_output=True, text=True, check=True\n    )\n    print("Apache est actif")\nexcept subprocess.CalledProcessError:\n    print("Apache est INACTIF")' },
          { type: 'h2', content: 'SSH et administration distante avec Paramiko' },
          { type: 'code', content: '# pip install paramiko\nimport paramiko\n\ndef executer_commande(hote, utilisateur, cle_ssh, commande):\n    """Exécute une commande SSH sur un serveur distant"""\n    client = paramiko.SSHClient()\n    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())\n\n    try:\n        client.connect(\n            hostname=hote,\n            username=utilisateur,\n            key_filename=cle_ssh\n        )\n\n        stdin, stdout, stderr = client.exec_command(commande)\n        sortie = stdout.read().decode()\n        erreur = stderr.read().decode()\n\n        return sortie, erreur\n    finally:\n        client.close()\n\n# Utilisation\nserveurs = ["192.168.1.10", "192.168.1.20", "192.168.1.30"]\nfor srv in serveurs:\n    sortie, err = executer_commande(srv, "admin", "~/.ssh/id_rsa", "df -h")\n    print(f"\\n=== {srv} ===")\n    print(sortie)' },
          { type: 'h2', content: 'Rapport système automatique avec Python' },
          { type: 'code', content: 'import psutil\nimport socket\nimport datetime\nimport json\n\n# pip install psutil\n\ndef rapport_systeme():\n    return {\n        "hostname": socket.gethostname(),\n        "timestamp": datetime.datetime.now().isoformat(),\n        "cpu": {\n            "pourcentage": psutil.cpu_percent(interval=1),\n            "coeurs": psutil.cpu_count()\n        },\n        "memoire": {\n            "total_go": round(psutil.virtual_memory().total / 1e9, 2),\n            "utilisee_pct": psutil.virtual_memory().percent\n        },\n        "disques": [\n            {\n                "point_montage": p.mountpoint,\n                "total_go": round(psutil.disk_usage(p.mountpoint).total / 1e9, 2),\n                "utilise_pct": psutil.disk_usage(p.mountpoint).percent\n            }\n            for p in psutil.disk_partitions()\n            if p.fstype\n        ],\n        "alertes": []\n    }\n\nrapport = rapport_systeme()\n\n# Générer des alertes\nif rapport["cpu"]["pourcentage"] > 90:\n    rapport["alertes"].append("CRITIQUE: CPU > 90%")\nif rapport["memoire"]["utilisee_pct"] > 85:\n    rapport["alertes"].append("ALERTE: RAM > 85%")\nfor disque in rapport["disques"]:\n    if disque["utilise_pct"] > 90:\n        rapport["alertes"].append(f"ALERTE: Disque {disque[\'point_montage\']} > 90%")\n\nprint(json.dumps(rapport, indent=2, ensure_ascii=False))' },
        ],
      },
      {
        id: 'regex-essentiel',
        titre: 'Expressions Régulières (Regex) — Manipulation de texte',
        sections: [
          { type: 'h2', content: 'Syntaxe de base' },
          { type: 'table', headers: ['Motif', 'Signification', 'Exemple'], rows: [
            ['.', 'N\'importe quel caractère', 'a.c → abc aXc'],
            ['*', '0 ou plusieurs fois', 'ab* → a ab abb'],
            ['+', '1 ou plusieurs fois', 'ab+ → ab abb (pas a)'],
            ['?', '0 ou 1 fois', 'colou?r → color colour'],
            ['^', 'Début de ligne', '^admin → ligne commençant par admin'],
            ['$', 'Fin de ligne', '.log$ → finit par .log'],
            ['\\d', 'Chiffre (0-9)', '\\d+ → 192 168 1 1'],
            ['\\w', 'Alphanumérique + _', '\\w+ → mot123'],
            ['\\s', 'Espace tabulation', '\\s+ → espaces'],
            ['{n}', 'Exactement n fois', '\\d{3} → 192'],
            ['{n,m}', 'Entre n et m fois', '\\d{1,3} → 1 à 192'],
            ['(ab)', 'Groupe', '(error|warn) → error ou warn'],
            ['[abc]', 'Classe de caractères', '[aeiou] → voyelles'],
          ]},
          { type: 'h2', content: 'Regex en pratique — Administration système' },
          { type: 'code', content: 'import re\n\n# Valider une adresse IP\ndef valider_ip(ip):\n    pattern = r\'^(\\d{1,3}\\.){3}\\d{1,3}$\'\n    if re.match(pattern, ip):\n        parties = ip.split(\'.\')\n        return all(0 <= int(p) <= 255 for p in parties)\n    return False\n\nprint(valider_ip("192.168.1.1"))   # True\nprint(valider_ip("300.0.0.1"))     # False\n\n# Extraire les IPs d\'un fichier log\nwith open("/var/log/auth.log") as f:\n    contenu = f.read()\n\nip_pattern = r\'\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b\'\nips = re.findall(ip_pattern, contenu)\nprint(f"IPs trouvées : {set(ips)}")\n\n# Extraire les emails d\'un texte\nemail_pattern = r\'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\'\nemails = re.findall(email_pattern, "Contact: admin@tssr.local, support@afpa.fr")\nprint(emails)  # [\'admin@tssr.local\', \'support@afpa.fr\']\n\n# Analyser un log Apache\nlog_line = \'192.168.1.50 - - [04/Jan/2024:10:00:00 +0100] "GET /index.html HTTP/1.1" 200 1234\'\npattern = r\'(\\d+\\.\\d+\\.\\d+\\.\\d+).*"(\\w+)\\s+(\\S+)\\s+HTTP/\\d\\.\\d"\\s+(\\d+)\'\nmatch = re.match(pattern, log_line)\nif match:\n    ip, methode, url, code = match.groups()\n    print(f"IP:{ip} | {methode} {url} → {code}")' },
          { type: 'h2', content: 'Regex en Bash et PowerShell' },
          { type: 'code', content: '# Bash — grep avec regex\ngrep -E "^[0-9]{1,3}(\\.[0-9]{1,3}){3}" /var/log/auth.log  # IPs\ngrep -E "Failed password.*from ([0-9.]+)" /var/log/auth.log\ngrep -oE "[0-9]+\\.[0-9]+\\.[0-9]+\\.[0-9]+" /var/log/syslog | sort | uniq -c | sort -rn\n\n# sed avec regex\nsed -E \'s/password=[^ ]*/password=REDACTED/g\' fichier.log\nsed -E \'/^#|^$/d\' /etc/ssh/sshd_config   # Supprimer commentaires et lignes vides\n\n# PowerShell\n"192.168.1.1" -match "^\\d{1,3}(\\.\\d{1,3}){3}$"   # True\n$log | Select-String -Pattern "Failed password" | ForEach-Object {\n    if ($_ -match "from (\\d+\\.\\d+\\.\\d+\\.\\d+)") { $Matches[1] }\n}' },
        ],
      },
      {
        id: 'sql-bdd',
        titre: 'Bases de Données — SQL, MySQL, SQL Server',
        sections: [
          { type: 'h2', content: 'Concepts fondamentaux' },
          { type: 'table', headers: ['Concept', 'Description', 'Exemple'], rows: [
            ['SGBD', 'Système de Gestion de Base de Données', 'MySQL MariaDB PostgreSQL SQL Server'],
            ['Base de données', 'Ensemble de tables liées', 'tssr_db'],
            ['Table', 'Données structurées en lignes/colonnes', 'users serveurs tickets'],
            ['Colonne', 'Attribut d\'une table avec type', 'id (INT) nom (VARCHAR) actif (BOOL)'],
            ['Clé primaire (PK)', 'Identifiant unique d\'une ligne', 'id INT AUTO_INCREMENT'],
            ['Clé étrangère (FK)', 'Référence vers une autre table', 'user_id → users.id'],
            ['Index', 'Accélère les requêtes de recherche', 'INDEX sur colonne email'],
          ]},
          { type: 'h2', content: 'Installation MySQL sur Linux' },
          { type: 'code', content: '# Debian/Ubuntu\napt install mysql-server\nsystemctl enable --now mysql\n\n# Sécuriser l\'installation\nmysql_secure_installation\n# → Définir mot de passe root\n# → Supprimer utilisateurs anonymes\n# → Désactiver connexion root distante\n# → Supprimer la base test\n\n# Connexion\nmysql -u root -p\nmysql -u admin -p -h 192.168.1.20 tssr_db' },
          { type: 'h2', content: 'SQL — Commandes essentielles' },
          { type: 'code', content: '-- Gestion des bases et tables\nCREATE DATABASE tssr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\nUSE tssr_db;\nSHOW DATABASES;\nSHOW TABLES;\nDESCRIBE users;\n\n-- Créer une table\nCREATE TABLE users (\n    id          INT AUTO_INCREMENT PRIMARY KEY,\n    nom         VARCHAR(100) NOT NULL,\n    email       VARCHAR(255) UNIQUE NOT NULL,\n    actif       BOOLEAN DEFAULT TRUE,\n    cree_le     TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE tickets (\n    id          INT AUTO_INCREMENT PRIMARY KEY,\n    titre       VARCHAR(255) NOT NULL,\n    priorite    ENUM(\'P1\',\'P2\',\'P3\',\'P4\') DEFAULT \'P3\',\n    user_id     INT,\n    cree_le     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n    FOREIGN KEY (user_id) REFERENCES users(id)\n);\n\n-- INSERT\nINSERT INTO users (nom, email) VALUES (\'Jean Dupont\', \'j.dupont@tssr.local\');\nINSERT INTO users (nom, email) VALUES\n    (\'Marie Martin\', \'m.martin@tssr.local\'),\n    (\'Pierre Admin\', \'p.admin@tssr.local\');\n\n-- SELECT\nSELECT * FROM users;\nSELECT nom, email FROM users WHERE actif = TRUE;\nSELECT * FROM users ORDER BY nom ASC;\nSELECT * FROM users LIMIT 10 OFFSET 20;\nSELECT COUNT(*) FROM users WHERE actif = TRUE;\n\n-- UPDATE\nUPDATE users SET actif = FALSE WHERE email = \'j.dupont@tssr.local\';\nUPDATE users SET nom = \'Jean-Pierre Dupont\' WHERE id = 1;\n\n-- DELETE\nDELETE FROM users WHERE id = 5;\nDELETE FROM users WHERE actif = FALSE AND cree_le < \'2023-01-01\';\n\n-- JOINTURE\nSELECT u.nom, t.titre, t.priorite\nFROM tickets t\nINNER JOIN users u ON t.user_id = u.id\nWHERE t.priorite IN (\'P1\', \'P2\')\nORDER BY t.cree_le DESC;' },
          { type: 'h2', content: 'Gestion des utilisateurs MySQL' },
          { type: 'code', content: '-- Créer un utilisateur avec droits limités\nCREATE USER \'app_user\'@\'192.168.1.%\' IDENTIFIED BY \'AppP@ss2024!\';\nGRANT SELECT, INSERT, UPDATE ON tssr_db.* TO \'app_user\'@\'192.168.1.%\';\n\n-- Utilisateur lecture seule\nCREATE USER \'monitoring\'@\'localhost\' IDENTIFIED BY \'MonP@ss!\';\nGRANT SELECT ON *.* TO \'monitoring\'@\'localhost\';\n\n-- Appliquer les droits\nFLUSH PRIVILEGES;\n\n-- Voir les droits\nSHOW GRANTS FOR \'app_user\'@\'192.168.1.%\';\n\n-- Révoquer des droits\nREVOKE INSERT ON tssr_db.* FROM \'app_user\'@\'192.168.1.%\';' },
          { type: 'h2', content: 'Sauvegarde et restauration MySQL' },
          { type: 'code', content: '# Sauvegarder une base\nmysqldump -u root -p tssr_db > /backup/tssr_db_$(date +%Y%m%d).sql\n\n# Sauvegarder toutes les bases\nmysqldump -u root -p --all-databases > /backup/all_databases.sql\n\n# Sauvegarder avec compression\nmysqldump -u root -p tssr_db | gzip > /backup/tssr_db_$(date +%Y%m%d).sql.gz\n\n# Restaurer\nmysql -u root -p tssr_db < /backup/tssr_db_20240104.sql\n\n# Automatiser via cron\n# 0 3 * * * mysqldump -u root -pMOTPASSE tssr_db | gzip > /backup/tssr_$(date +\\%Y\\%m\\%d).sql.gz' },
          { type: 'h2', content: 'SQL Server via PowerShell' },
          { type: 'code', content: '# Module SqlServer\nInstall-Module -Name SqlServer -Force\n\n# Connexion\n$connexion = "Server=SRV-SQL;Database=TSSR_DB;Integrated Security=True;"\n\n# Exécuter une requête\nInvoke-Sqlcmd -ConnectionString $connexion -Query "SELECT * FROM users WHERE actif = 1"\n\n# Requête dans un fichier\nInvoke-Sqlcmd -ConnectionString $connexion -InputFile "C:\\Scripts\\rapport.sql"\n\n# Sauvegarde SQL Server via PowerShell\nBackup-SqlDatabase -ServerInstance "SRV-SQL" `\n    -Database "TSSR_DB" `\n    -BackupFile "\\\\SRV-BACKUP\\SQL\\TSSR_DB_$(Get-Date -Format \'yyyyMMdd\').bak"\n\n# Restauration\nRestore-SqlDatabase -ServerInstance "SRV-SQL" `\n    -Database "TSSR_DB" `\n    -BackupFile "\\\\SRV-BACKUP\\SQL\\TSSR_DB_20240104.bak"' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'ad-avance',
    label: 'AD Avancé',
    icon: '🏛️',
    color: '#8b5cf6',
    desc: 'Délégation, approbations, sites AD, réplication, ADFS, tiering...',
    topics: ['Délégation', 'Trusts', 'Sites AD', 'Réplication', 'ADFS', 'Tiering'],
    cours: [
      {
        id: 'delegation-ad',
        titre: 'Délégation et Administration Fine AD',
        sections: [
          { type: 'h2', content: 'Délégation de contrôle' },
          { type: 'p', content: 'La délégation permet d\'accorder des droits granulaires sur des OUs spécifiques sans donner les droits d\'Administrateur de domaine.' },
          { type: 'code', content: '# Via PowerShell — Déléguer la gestion des comptes utilisateurs d\'une OU\nImport-Module ActiveDirectory\n\n# Accorder le droit de réinitialiser les mots de passe sur l\'OU Support\n$ou = "OU=Support,DC=tssr,DC=local"\n$groupe = (Get-ADGroup "GRP-HelpDesk").SID\n\n# Droit de réinitialiser les mots de passe\n$acl = Get-Acl "AD:\\$ou"\n$resetPwd = [GUID]"00299570-246d-11d0-a768-00aa006e0529"  # GUID Reset Password\n$userClass = [GUID]"bf967aba-0de6-11d0-a285-00aa003049e2" # GUID User Class\n$rule = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(\n    $groupe,\n    "ExtendedRight",\n    "Allow",\n    $resetPwd,\n    "Descendents",\n    $userClass\n)\n$acl.AddAccessRule($rule)\nSet-Acl "AD:\\$ou" $acl\n\n# Via l\'assistant graphique (plus simple)\n# ADUC → Clic droit sur l\'OU → Déléguer le contrôle\n# Choisir le groupe → Choisir les tâches à déléguer' },
          { type: 'h2', content: 'Sites et services Active Directory' },
          { type: 'p', content: 'Les sites AD définissent la topologie physique du réseau pour optimiser la réplication et l\'authentification Kerberos.' },
          { type: 'code', content: '# Créer un site AD\nNew-ADReplicationSite -Name "Site-Paris"\nNew-ADReplicationSite -Name "Site-Marseille"\nNew-ADReplicationSite -Name "Site-Lyon"\n\n# Créer des sous-réseaux\nNew-ADReplicationSubnet -Name "192.168.1.0/24" -Site "Site-Paris"\nNew-ADReplicationSubnet -Name "192.168.2.0/24" -Site "Site-Marseille"\nNew-ADReplicationSubnet -Name "192.168.3.0/24" -Site "Site-Lyon"\n\n# Créer un lien de site\nNew-ADReplicationSiteLink -Name "Paris-Marseille" `\n    -SitesIncluded "Site-Paris","Site-Marseille" `\n    -Cost 100 `\n    -ReplicationFrequencyInMinutes 180\n\n# Voir l\'état de réplication\nrepadmin /showrepl\nrepadmin /replsummary\nrepadmin /syncall /AdeP   # Forcer la réplication entre tous les DCs' },
          { type: 'h2', content: 'Approbations (Trusts) entre domaines' },
          { type: 'table', headers: ['Type d\'approbation', 'Direction', 'Description', 'Usage'], rows: [
            ['Externe', 'Unidirectionnelle ou bidirectionnelle', 'Entre deux domaines sans relation de forêt', 'Partenariat entreprise'],
            ['Forêt', 'Bidirectionnelle', 'Entre deux forêts AD', 'Fusion acquisition'],
            ['Raccourci', 'Bidirectionnelle', 'Optimise l\'auth dans une forêt complexe', 'Forêt avec nombreux domaines'],
            ['Realm', 'Unidirectionnelle', 'Vers un domaine Kerberos non-Windows', 'Linux Kerberos'],
          ]},
          { type: 'code', content: '# Créer une approbation externe\n# Sur le domaine source\nnetdom trust tssr.local /domain:partenaire.fr /add /twoway /userD:Admin@partenaire.fr /passwordD:P@ss\n\n# Vérifier l\'approbation\nnetdom query trust\nGet-ADTrust -Filter * | Select-Object Name, TrustType, TrustDirection' },
          { type: 'h2', content: 'Réplication AD et dépannage' },
          { type: 'code', content: '# Vérifier l\'état de réplication\nrepadmin /showrepl              # Réplication de tous les DCs\nrepadmin /replsummary           # Résumé avec erreurs\nrepadmin /showrepl DC01         # DC spécifique\nrepadmin /showchanges DC01 DC=tssr,DC=local /statistics  # Statistiques\n\n# Forcer la réplication\nrepadmin /syncall /AdeP\nrepadmin /replicate DC02 DC01 DC=tssr,DC=local  # Répliquer de DC01 vers DC02\n\n# DCDiag — diagnostic complet du contrôleur de domaine\ndcdiag /test:replications\ndcdiag /test:netlogons\ndcdiag /test:advertising\ndcdiag /test:dns\ndcdiag /v    # Mode verbose — tous les tests\n\n# Netlogon — service d\'authentification\nnltest /dsgetdc:tssr.local         # Trouver un DC\nnltest /sc_verify:tssr.local       # Vérifier le canal sécurisé' },
        ],
      },
      {
        id: 'adfs-sso',
        titre: 'ADFS et Single Sign-On (SSO)',
        sections: [
          { type: 'h2', content: 'Qu\'est-ce qu\'ADFS ?' },
          { type: 'p', content: 'ADFS (Active Directory Federation Services) permet l\'authentification unique (SSO) vers des applications externes et cloud en utilisant l\'identité AD on-premise.' },
          { type: 'table', headers: ['Terme', 'Description'], rows: [
            ['Identity Provider (IdP)', 'Authentifie l\'utilisateur (AD + ADFS)'],
            ['Service Provider (SP)', 'Application qui fait confiance à l\'IdP (Salesforce Office 365)'],
            ['Claims', 'Assertions sur l\'utilisateur transmises au SP (nom email groupes)'],
            ['Trust', 'Relation de confiance établie entre IdP et SP via métadonnées'],
            ['SAML 2.0', 'Protocole de fédération XML — standard entreprise'],
            ['OAuth 2.0', 'Protocole d\'autorisation — standard moderne API'],
            ['OpenID Connect', 'Couche d\'identité sur OAuth 2.0 — tokens JWT'],
          ]},
          { type: 'h2', content: 'Installation ADFS' },
          { type: 'code', content: '# Prérequis :\n# - Windows Server 2019\n# - Certificat SSL valide pour adfs.tssr.local\n# - Compte de service dédié\n\n# Installer le rôle ADFS\nInstall-WindowsFeature ADFS-Federation -IncludeManagementTools\n\n# Configurer ADFS (premier serveur de la ferme)\nImport-Module ADFS\nInstall-AdfsFarm `\n    -CertificateThumbprint "THUMBPRINT_CERT_SSL" `\n    -FederationServiceDisplayName "TSSR Federation Service" `\n    -FederationServiceName "adfs.tssr.local" `\n    -ServiceAccountCredential (Get-Credential "TSSR\\svc_adfs")\n\n# Vérifier le service\nGet-AdfsSslCertificate\nGet-AdfsProperties | Select-Object HostName, HttpPort, HttpsPort' },
          { type: 'h2', content: 'Configurer une Relying Party Trust (SP)' },
          { type: 'code', content: '# Ajouter une application tierce (Salesforce example)\nAdd-AdfsRelyingPartyTrust `\n    -Name "Salesforce" `\n    -MetadataUrl "https://login.salesforce.com/saml/metadata" `\n    -AccessControlPolicyName "Permit everyone" `\n    -AutoUpdateEnabled $true `\n    -Enabled $true\n\n# Configurer les claims transmis\n$rules = @"\n@RuleTemplate = "LdapClaims"\n@RuleName = "AD Attributes"\nc:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname"]\n=> issue(store = "Active Directory", types = (\n    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",\n    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",\n    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"\n), query = ";mail,givenName,sn;{0}", param = c.Value);\n"@\n\nSet-AdfsRelyingPartyTrust -TargetName "Salesforce" -IssuanceTransformRulesFile $rules' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
  {
    id: 'documentation',
    label: 'Projet & Documentation',
    icon: '📋',
    color: '#64748b',
    desc: 'Schémas réseau, PRA/PCA, procédures exploitation, gestion de projet...',
    topics: ['Visio', 'PRA', 'PCA', 'ITIL', 'Agile', 'Documentation'],
    cours: [
      {
        id: 'schemas-documentation',
        titre: 'Schémas Réseau et Documentation Technique',
        sections: [
          { type: 'h2', content: 'Normes de schématisation réseau' },
          { type: 'table', headers: ['Outil', 'Type', 'Avantages', 'Usage'], rows: [
            ['Microsoft Visio', 'Commercial', 'Intégration Office nombreux stencils', 'Standard entreprise'],
            ['Draw.io / diagrams.net', 'Gratuit web', 'Gratuit intégration Confluence GitHub', 'Projets open-source startups'],
            ['Lucidchart', 'SaaS', 'Collaboration temps réel', 'Équipes distantes'],
            ['NetBox', 'Open-source', 'DCIM + schémas automatiques', 'Documentation datacenter'],
            ['GNS3', 'Open-source', 'Simulation réseau intégrée', 'Formation et tests'],
          ]},
          { type: 'h2', content: 'Éléments d\'un bon schéma réseau' },
          { type: 'p', content: 'Un schéma réseau professionnel doit être lisible, maintenu et documenté. Voici les éléments indispensables.' },
          { type: 'table', headers: ['Élément', 'Description', 'Exemple'], rows: [
            ['Titre et version', 'Identifie le document', 'Schéma LAN v2.3 - 04/01/2024'],
            ['Auteur et date', 'Traçabilité', 'Jean Dupont - 04/01/2024'],
            ['Légende', 'Explique les symboles utilisés', 'Routeur Switch Firewall Cloud'],
            ['Adressage IP', 'IPs et masques visibles', '192.168.1.0/24'],
            ['VLAN', 'Identification des VLANs', 'VLAN 10 - RH'],
            ['Liens et débits', 'Type et bande passante', '10 Gbps Fibre entre switches'],
            ['Équipements nommés', 'Hostname de chaque équipement', 'SW-CORE-01'],
          ]},
          { type: 'h2', content: 'Niveaux de documentation' },
          { type: 'table', headers: ['Niveau', 'Document', 'Contenu', 'Audience'], rows: [
            ['L1 - Architecture', 'Schéma logique', 'Vue d\'ensemble VLAN routage zones', 'Direction DSI'],
            ['L2 - Infrastructure', 'Schéma physique', 'Baies câbles équipements emplacements', 'Techniciens'],
            ['L3 - Configuration', 'Fiches techniques', 'Config détaillée de chaque équipement', 'Admins'],
            ['L4 - Procédures', 'Runbooks', 'Étapes pour chaque opération courante', 'Helpdesk'],
            ['L5 - Incidents', 'Post-mortem', 'Analyse des incidents et corrections', 'Équipe'],
          ]},
          { type: 'h2', content: 'Template de fiche technique équipement' },
          { type: 'code', content: '# Modèle de fiche technique (format Markdown)\n\n# Fiche Technique — SRV-AD-01\n\n## Informations générales\n| Champ | Valeur |\n|-------|--------|\n| Hostname | SRV-AD-01 |\n| Rôle | Contrôleur de domaine principal |\n| OS | Windows Server 2022 Standard |\n| Emplacement | Baie A, U12 |\n\n## Configuration réseau\n| Interface | IP | Masque | VLAN |\n|-----------|-----|--------|------|\n| Ethernet0 | 192.168.1.10 | /24 | VLAN 10 - Serveurs |\n\n## Services hébergés\n- Active Directory Domain Services (AD DS)\n- DNS Server\n- DHCP Server\n\n## Comptes de service\n- svc_backup (sauvegarde Veeam)\n- svc_monitoring (Zabbix)\n\n## Sauvegardes\n- Quotidienne 02h00 → \\\\SRV-BACKUP\\AD\n- Rétention 30 jours\n- Test de restauration : mensuel\n\n## Historique des changements\n| Date | Changement | Auteur |\n|------|-----------|--------|\n| 2024-01-04 | Installation initiale | J.Dupont |' },
        ],
      },
      {
        id: 'pra-pca',
        titre: 'PRA, PCA et Gestion de Crise',
        sections: [
          { type: 'h2', content: 'PRA vs PCA' },
          { type: 'table', headers: ['Critère', 'PRA (Plan de Reprise d\'Activité)', 'PCA (Plan de Continuité d\'Activité)'], rows: [
            ['Objectif', 'Reprendre après sinistre', 'Continuer malgré sinistre'],
            ['RTO', 'Heures à jours', 'Minutes à heures'],
            ['RPO', 'Heures', 'Quelques minutes voire zéro'],
            ['Coût', 'Moyen', 'Élevé'],
            ['Infrastructure', 'Peut être reconstruite', 'Redondante en permanence'],
            ['Déclenchement', 'Après un sinistre majeur', 'Transparent pour les utilisateurs'],
          ]},
          { type: 'h2', content: 'Composants d\'un PRA informatique' },
          { type: 'table', headers: ['Composant', 'Description', 'Exemple'], rows: [
            ['Inventaire des actifs critiques', 'Liste des systèmes indispensables par ordre de priorité', 'AD DNS Exchange'],
            ['RTO et RPO par système', 'Objectifs de récupération par criticité', 'AD RTO=4h RPO=1h'],
            ['Procédures de restauration', 'Étapes détaillées testées', 'Restauration AD depuis sauvegarde Veeam'],
            ['Contacts d\'urgence', 'Qui contacter et dans quel ordre', 'DRH DSI Hébergeur'],
            ['Déclaration de sinistre', 'Critères pour déclencher le PRA', 'Panne datacenter > 2h'],
            ['Tests et exercices', 'Fréquence des tests', 'Test annuel complet exercice trimestriel'],
          ]},
          { type: 'h2', content: 'Runbook — Procédure de restauration AD' },
          { type: 'code', content: '# RUNBOOK : Restauration Contrôleur de Domaine\n# Version : 1.2 | Auteur : J.Dupont | Date : 2024-01-04\n# Durée estimée : 2-4 heures | Niveau requis : Admin Domaine\n\n# PRÉREQUIS :\n# - Accès physique ou iDRAC/iLO au serveur\n# - ISO Windows Server 2022\n# - Dernière sauvegarde Veeam valide\n# - Accès au serveur Veeam Backup & Replication\n\n# ÉTAPE 1 : Évaluation de la situation (15 min)\n# 1.1 Vérifier si d\'autres DCs sont opérationnels\n#     nltest /dsgetdc:tssr.local\n# 1.2 Identifier la cause de la panne\n# 1.3 Si 1 DC encore actif → restauration urgente non requise\n\n# ÉTAPE 2 : Restauration VM depuis Veeam (30-60 min)\n# 2.1 Ouvrir Veeam B&R Console\n# 2.2 Home → Backups → trouver SRV-AD-01\n# 2.3 Clic droit → Restore → Entire VM Restore\n# 2.4 Choisir le dernier point de restauration valide\n# 2.5 Sélectionner l\'hôte ESXi de destination\n# 2.6 Lancer la restauration et surveiller\n\n# ÉTAPE 3 : Post-restauration (30 min)\n# 3.1 Démarrer la VM restaurée\n# 3.2 Vérifier les services AD\n#     Get-Service ADWS,DNS,KDC,Netlogon | Select-Object Name,Status\n# 3.3 Forcer la réplication\n#     repadmin /syncall /AdeP\n# 3.4 Vérifier la réplication\n#     repadmin /replsummary\n# 3.5 Tester l\'authentification depuis un poste client\n#     nltest /sc_verify:tssr.local\n\n# CONTACTS :\n# Responsable SI : +33 6 XX XX XX XX\n# Astreinte hébergeur : 0800 XXX XXX' },
        ],
      },
      {
        id: 'gestion-projet',
        titre: 'Gestion de Projet IT — ITIL et Agile',
        sections: [
          { type: 'h2', content: 'Cycle de vie ITIL v4' },
          { type: 'table', headers: ['Pratique ITIL', 'Description', 'Livrables'], rows: [
            ['Gestion des demandes', 'Traiter les demandes utilisateurs', 'Catalogue de services SLAs'],
            ['Gestion des incidents', 'Restaurer le service rapidement', 'Tickets priorités RCA'],
            ['Gestion des problèmes', 'Éliminer les causes racines', 'Known Error Database solutions'],
            ['Gestion des changements', 'Contrôler les modifications', 'CAB RFC Calendrier des changements'],
            ['Gestion des actifs', 'Inventorier les ressources IT', 'CMDB registre des actifs'],
            ['Amélioration continue', 'Optimiser les services', 'KPIs tableaux de bord'],
          ]},
          { type: 'h2', content: 'Méthode Agile / Scrum adaptée à l\'IT' },
          { type: 'table', headers: ['Concept', 'Description', 'Durée'], rows: [
            ['Sprint', 'Cycle de travail court avec objectif défini', '1 à 4 semaines'],
            ['Backlog produit', 'Liste priorisée de toutes les tâches', 'Continu'],
            ['Sprint planning', 'Planifier le sprint en équipe', '4h pour sprint de 2 semaines'],
            ['Daily standup', 'Réunion quotidienne courte', '15 minutes max'],
            ['Sprint review', 'Démonstration du travail réalisé', '1-2h'],
            ['Rétrospective', 'Amélioration de l\'équipe', '1h'],
          ]},
          { type: 'h2', content: 'Template de cahier des charges technique' },
          { type: 'code', content: '# Cahier des Charges Technique — Projet Infra\n# [TITRE DU PROJET]\n\n## 1. Contexte et objectifs\nDécrire le contexte métier et les objectifs techniques.\nEx: Remplacement du serveur de fichiers vieillissant par une solution NAS HA.\n\n## 2. Périmètre\n- Ce qui est INCLUS dans le projet\n- Ce qui est EXCLU (hors périmètre)\n\n## 3. Contraintes\n- Budget : XX XXX €\n- Délai : Livraison avant le JJ/MM/AAAA\n- Technique : Compatible avec Windows Server 2022\n- Réglementaire : Données RGPD stockées en France\n\n## 4. Architecture cible\n[Schéma Draw.io ou Visio]\nDescription des composants et interactions.\n\n## 5. Exigences non-fonctionnelles\n| Critère | Exigence |\n|---------|----------|\n| Disponibilité | 99.9% (8h45 d\'indispo/an max) |\n| RTO | < 4 heures |\n| RPO | < 1 heure |\n| Performances | 1 Gbps en lecture |\n\n## 6. Plan de migration\n- Phase 1 : Installation et configuration (S1-S2)\n- Phase 2 : Tests et validation (S3)\n- Phase 3 : Migration des données (S4 - weekend)\n- Phase 4 : Décommissionnement ancien système (S5)\n\n## 7. Plan de test\n| Test | Critère de succès | Responsable |\n|------|------------------|-------------|\n| Connexion utilisateurs | 100% des users connectés | J.Dupont |\n| Performance | > 500 Mo/s en lecture | J.Dupont |\n| PRA | Restauration en < 4h | DSI |\n\n## 8. Documentation livrée\n- Schéma réseau mis à jour\n- Fiches techniques équipements\n- Procédures d\'exploitation\n- PRA mis à jour' },
        ],
      },
    ],
    flashcards: [],
    qcm: [],
  },
];
