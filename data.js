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
        id: 'services-web-linux',
        titre: 'Services Web Linux — Apache, Nginx et PHP',
        sections: [

          { type: 'h2', content: '1. Apache2 — Serveur Web de référence' },
          { type: 'p', content: 'Apache HTTP Server est le serveur web le plus utilisé au monde. Sa modularité (modules chargés dynamiquement) et sa flexibilité en font un choix universel pour héberger des applications web.' },
          { type: 'code', content: '# ============================================================\n# INSTALLATION ET CONFIGURATION APACHE2\n# ============================================================\n\napt install apache2\nsystemctl enable --now apache2\n\n# Structure des fichiers Apache :\n# /etc/apache2/\n# ├── apache2.conf          ← Configuration principale\n# ├── ports.conf            ← Ports d\'écoute\n# ├── mods-available/       ← Modules disponibles (.conf + .load)\n# ├── mods-enabled/         ← Modules activés (liens symboliques)\n# ├── sites-available/      ← VirtualHosts disponibles\n# ├── sites-enabled/        ← VirtualHosts activés (liens symboliques)\n# └── conf-available/       ← Configurations additionnelles\n\n# Commandes de gestion des modules et sites\na2enmod rewrite ssl headers proxy proxy_http  # Activer modules\na2dismod status                               # Désactiver un module\na2ensite mon-site.conf                        # Activer un VirtualHost\na2dissite 000-default.conf                    # Désactiver un VirtualHost\napache2ctl configtest                         # Vérifier la syntaxe\nsystemctl reload apache2                      # Recharger sans coupure\n\n# ============================================================\n# VIRTUALHOST — HÉBERGER PLUSIEURS SITES\n# ============================================================\n\n# Créer un VirtualHost pour tssr.local\ncat > /etc/apache2/sites-available/tssr.local.conf << EOF\n<VirtualHost *:80>\n    ServerName tssr.local\n    ServerAlias www.tssr.local\n    DocumentRoot /var/www/tssr.local/public\n    ServerAdmin webmaster@tssr.local\n\n    # Logs spécifiques au site\n    ErrorLog  \\${APACHE_LOG_DIR}/tssr.local-error.log\n    CustomLog \\${APACHE_LOG_DIR}/tssr.local-access.log combined\n\n    # Configuration du répertoire\n    <Directory /var/www/tssr.local/public>\n        Options -Indexes +FollowSymLinks\n        AllowOverride All          # Autoriser .htaccess\n        Require all granted\n    </Directory>\n\n    # Redirection HTTP → HTTPS\n    Redirect permanent / https://tssr.local/\n</VirtualHost>\n\n<VirtualHost *:443>\n    ServerName tssr.local\n    ServerAlias www.tssr.local\n    DocumentRoot /var/www/tssr.local/public\n\n    SSLEngine on\n    SSLCertificateFile    /etc/ssl/certs/tssr.local.crt\n    SSLCertificateKeyFile /etc/ssl/private/tssr.local.key\n\n    # TLS moderne\n    SSLProtocol           all -SSLv3 -TLSv1 -TLSv1.1\n    SSLCipherSuite        ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256\n    SSLHonorCipherOrder   off\n    SSLSessionTickets     off\n\n    # Headers de sécurité\n    Header always set Strict-Transport-Security \"max-age=31536000; includeSubDomains\"\n    Header always set X-Frame-Options \"SAMEORIGIN\"\n    Header always set X-Content-Type-Options \"nosniff\"\n    Header always set Referrer-Policy \"strict-origin-when-cross-origin\"\n    Header always set Permissions-Policy \"geolocation=(), microphone=()\"\n\n    # PHP-FPM\n    <FilesMatch \\.php$>\n        SetHandler \"proxy:unix:/run/php/php8.2-fpm.sock|fcgi://localhost\"\n    </FilesMatch>\n\n    <Directory /var/www/tssr.local/public>\n        Options -Indexes +FollowSymLinks\n        AllowOverride All\n        Require all granted\n    </Directory>\n\n    ErrorLog  \\${APACHE_LOG_DIR}/tssr.local-ssl-error.log\n    CustomLog \\${APACHE_LOG_DIR}/tssr.local-ssl-access.log combined\n</VirtualHost>\nEOF\n\n# Créer la structure du site\nmkdir -p /var/www/tssr.local/{public,logs,backup}\nchown -R www-data:www-data /var/www/tssr.local\nchmod -R 755 /var/www/tssr.local\n\n# Activer le site et les modules nécessaires\na2ensite tssr.local.conf\na2enmod ssl headers proxy_fcgi setenvif\napache2ctl configtest && systemctl reload apache2\n\n# ============================================================\n# .HTACCESS — CONFIGURATION PAR RÉPERTOIRE\n# ============================================================\n\n# Réécriture d\'URL (framework MVC)\ncat > /var/www/tssr.local/public/.htaccess << EOF\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n\n# Rediriger tout vers index.php (framework)\nRewriteCond %{REQUEST_FILENAME} !-f\nRewriteCond %{REQUEST_FILENAME} !-d\nRewriteRule ^(.*)$ index.php/$1 [L]\n\n# Protéger les fichiers sensibles\n<Files .env>\n    Order allow,deny\n    Deny from all\n</Files>\n\n<Files composer.lock>\n    Order allow,deny\n    Deny from all\n</Files>\n\n# Désactiver le listing des répertoires\nOptions -Indexes\n\n# Cache navigateur\n<IfModule mod_expires.c>\n    ExpiresActive On\n    ExpiresByType image/jpg \"access plus 1 year\"\n    ExpiresByType image/css \"access plus 1 month\"\n    ExpiresByType text/css \"access plus 1 month\"\n    ExpiresByType application/javascript \"access plus 1 month\"\n</IfModule>\nEOF\n\n# ============================================================\n# PHP-FPM — GESTIONNAIRE DE PROCESSUS PHP\n# ============================================================\n\napt install php8.2 php8.2-fpm php8.2-mysql php8.2-curl \\\n            php8.2-gd php8.2-xml php8.2-mbstring php8.2-zip \\\n            php8.2-intl php8.2-redis\n\n# Configuration PHP pour production\ncat > /etc/php/8.2/fpm/conf.d/99-tssr.ini << EOF\n; Sécurité\nexpose_php = Off\nallow_url_fopen = Off\nallow_url_include = Off\ndisplay_errors = Off\nlog_errors = On\nerror_log = /var/log/php/error.log\n\n; Performance\nmemory_limit = 256M\nmax_execution_time = 30\nmax_input_time = 60\npost_max_size = 64M\nupload_max_filesize = 32M\n\n; Sessions sécurisées\nsession.cookie_httponly = 1\nsession.cookie_secure = 1\nsession.use_strict_mode = 1\nEOF\n\n# Configuration du pool FPM\ncat > /etc/php/8.2/fpm/pool.d/tssr.conf << EOF\n[tssr]\nuser = www-data\ngroup = www-data\nlisten = /run/php/php8.2-fpm-tssr.sock\nlisten.owner = www-data\nlisten.group = www-data\n\npm = dynamic\npm.max_children = 50\npm.start_servers = 5\npm.min_spare_servers = 5\npm.max_spare_servers = 35\npm.max_requests = 500\nEOF\n\nsystemctl restart php8.2-fpm' },

          { type: 'h2', content: '2. Nginx — Reverse Proxy et Load Balancer' },
          { type: 'code', content: '# ============================================================\n# NGINX EN REVERSE PROXY\n# ============================================================\n# Architecture typique :\n# Internet → Nginx (reverse proxy) → Apache/Node.js/Python (backends)\n# Nginx gère le SSL, la compression, le cache, le load balancing\n\napt install nginx\nsystemctl enable --now nginx\n\n# Structure Nginx :\n# /etc/nginx/\n# ├── nginx.conf           ← Configuration principale\n# ├── conf.d/              ← Configurations additionnelles\n# └── sites-available/     ← VirtualHosts\n\n# Configuration principale optimisée\ncat > /etc/nginx/nginx.conf << EOF\nuser www-data;\nworker_processes auto;          # Autod-détection du nombre de CPU\npid /run/nginx.pid;\n\nevents {\n    worker_connections 1024;\n    use epoll;                  # Mode I/O le plus efficace (Linux)\n    multi_accept on;\n}\n\nhttp {\n    # Types MIME\n    include /etc/nginx/mime.types;\n    default_type application/octet-stream;\n\n    # Performances\n    sendfile on;\n    tcp_nopush on;\n    tcp_nodelay on;\n    keepalive_timeout 65;\n    types_hash_max_size 2048;\n    server_tokens off;          # Masquer la version Nginx\n\n    # Tailles\n    client_max_body_size 64M;\n    client_body_timeout 30;\n    client_header_timeout 30;\n\n    # Compression gzip\n    gzip on;\n    gzip_disable \"msie6\";\n    gzip_vary on;\n    gzip_proxied any;\n    gzip_comp_level 6;\n    gzip_types text/plain text/css application/json application/javascript text/xml;\n\n    # Logs\n    log_format main \'$remote_addr - $remote_user [$time_local] \"$request\" \'\n                    \'$status $body_bytes_sent \"$http_referer\" \"$http_user_agent\"\';\n    access_log /var/log/nginx/access.log main;\n    error_log /var/log/nginx/error.log warn;\n\n    # Rate limiting (anti-DDoS)\n    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;\n    limit_req_zone $binary_remote_addr zone=login:10m rate=3r/m;\n\n    include /etc/nginx/conf.d/*.conf;\n    include /etc/nginx/sites-enabled/*;\n}\nEOF\n\n# Reverse Proxy vers une application backend\ncat > /etc/nginx/sites-available/app.tssr.local << EOF\n# Upstream backend (load balancing)\nupstream backend {\n    least_conn;                 # Algorithme : serveur avec moins de connexions\n    server 192.168.1.10:8080 weight=3;   # 3× plus de trafic\n    server 192.168.1.11:8080 weight=1;\n    server 192.168.1.12:8080 backup;     # Utilisé seulement si les autres tombent\n    keepalive 32;\n}\n\nserver {\n    listen 80;\n    server_name app.tssr.local;\n    return 301 https://$host$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name app.tssr.local;\n\n    ssl_certificate     /etc/ssl/certs/app.tssr.local.crt;\n    ssl_certificate_key /etc/ssl/private/app.tssr.local.key;\n    ssl_protocols       TLSv1.2 TLSv1.3;\n    ssl_ciphers         ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;\n    ssl_session_cache   shared:SSL:10m;\n    ssl_session_timeout 1d;\n\n    # Headers sécurité\n    add_header Strict-Transport-Security \"max-age=31536000\" always;\n    add_header X-Frame-Options DENY;\n    add_header X-Content-Type-Options nosniff;\n\n    # Fichiers statiques servis directement par Nginx (plus rapide)\n    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|pdf|zip)$ {\n        root /var/www/app/public;\n        expires 30d;\n        add_header Cache-Control \"public, immutable\";\n        access_log off;\n    }\n\n    # Rate limiting sur l\'API\n    location /api/ {\n        limit_req zone=api burst=20 nodelay;\n        proxy_pass http://backend;\n        include /etc/nginx/proxy_params;\n    }\n\n    # Rate limiting sur le login\n    location /api/auth/login {\n        limit_req zone=login burst=5;\n        proxy_pass http://backend;\n        include /etc/nginx/proxy_params;\n    }\n\n    # Proxy principal\n    location / {\n        proxy_pass http://backend;\n        include /etc/nginx/proxy_params;\n    }\n\n    # Bloquer les fichiers sensibles\n    location ~ /\\. { deny all; }\n    location ~ /(.env|composer\\.json|package\\.json)$ { deny all; }\n}\nEOF\n\n# Paramètres proxy réutilisables\ncat > /etc/nginx/proxy_params << EOF\nproxy_set_header Host              $host;\nproxy_set_header X-Real-IP         $remote_addr;\nproxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\nproxy_set_header X-Forwarded-Proto $scheme;\nproxy_http_version                 1.1;\nproxy_set_header Connection        \"\";\nproxy_connect_timeout              60s;\nproxy_send_timeout                 60s;\nproxy_read_timeout                 60s;\nEOF\n\nln -s /etc/nginx/sites-available/app.tssr.local /etc/nginx/sites-enabled/\nnginx -t && systemctl reload nginx' },
        ],
      },

      {
        id: 'stockage-linux-serveur',
        titre: 'Stockage Avancé Linux — LVM, NFS et Samba',
        sections: [

          { type: 'h2', content: '1. LVM en production' },
          { type: 'code', content: '# ============================================================\n# LVM — GESTION AVANCÉE EN PRODUCTION\n# ============================================================\n\n# Situation initiale : serveur avec /dev/sdb /dev/sdc /dev/sdd\n\n# Créer les PVs\npvcreate /dev/sdb /dev/sdc /dev/sdd\npvs\n# PV         VG  Fmt  Attr PSize    PFree\n# /dev/sdb       lvm2 ---  1000.00g 1000.00g\n# /dev/sdc       lvm2 ---  1000.00g 1000.00g\n# /dev/sdd       lvm2 ---  1000.00g 1000.00g\n\n# Créer un VG avec stripe (RAID 0 logiciel LVM)\nvgcreate -s 4M vg-prod /dev/sdb /dev/sdc /dev/sdd\nvgs\n# VG       #PV #LV #SN Attr   VSize  VFree\n# vg-prod    3   0   0 wz--n- 2.99t  2.99t\n\n# LV avec striping (données réparties sur 3 PVs = meilleures performances)\nlvcreate -L 500G -i 3 -I 64 -n lv-web vg-prod\n# -i 3 = 3 stripes (un par disque)\n# -I 64 = chunk size 64Ko\n\nlvcreate -L 200G -n lv-db vg-prod\nlvcreate -L 100G -n lv-backup vg-prod\nlvcreate -l 100%FREE -n lv-archivage vg-prod\n\n# Formater\nmkfs.xfs /dev/vg-prod/lv-web       # XFS pour gros fichiers\nmkfs.ext4 /dev/vg-prod/lv-db       # ext4 pour bases de données\nmkfs.ext4 /dev/vg-prod/lv-backup\nmkfs.xfs /dev/vg-prod/lv-archivage\n\n# Monter\nmkdir -p /var/www /var/lib/mysql /backup /archivage\nmount /dev/vg-prod/lv-web /var/www\nmount /dev/vg-prod/lv-db /var/lib/mysql\nmount /dev/vg-prod/lv-backup /backup\nmount /dev/vg-prod/lv-archivage /archivage\n\n# /etc/fstab\ncat >> /etc/fstab << EOF\n/dev/vg-prod/lv-web       /var/www          xfs   defaults,noatime  0  2\n/dev/vg-prod/lv-db        /var/lib/mysql    ext4  defaults,noatime  0  2\n/dev/vg-prod/lv-backup    /backup           ext4  defaults          0  2\n/dev/vg-prod/lv-archivage /archivage        xfs   defaults,noatime  0  2\nEOF\n\n# ── EXTENSION À CHAUD ──\n# Le web server grandit, il faut plus d\'espace sur lv-web\n\n# Option 1 : Étendre avec l\'espace libre dans le VG\nlvextend -L +200G /dev/vg-prod/lv-web\nxfs_growfs /var/www          # Étendre XFS à chaud (sans umount)\n# resize2fs /dev/vg-prod/lv-web  # Pour ext4\n\n# Option 2 : Ajouter un nouveau disque au VG\npvcreate /dev/sde\nvgextend vg-prod /dev/sde\nlvextend -L +500G /dev/vg-prod/lv-web\nxfs_growfs /var/www\n\n# Vérifier\ndf -h /var/www\nlvs vg-prod\n\n# ── SNAPSHOT AVANT MISE À JOUR ──\n# Snapshot LVM = copie instantanée (COW - Copy on Write)\n# Seules les modifications sont copiées, pas tout le volume\n\nlvcreate -L 50G -s -n snap-web-avant-maj /dev/vg-prod/lv-web\n# -s = snapshot\n# 50G = taille max des modifications (si dépassé : snapshot invalidé)\n\nlvs\n# snap-web-avant-maj vg-prod swi-aos--- 50.00g  lv-web 0.00%\n\n# Monter le snapshot en lecture seule (vérification)\nmount -o ro /dev/vg-prod/snap-web-avant-maj /mnt/snapshot\ndiff -r /var/www /mnt/snapshot  # Voir les différences\numount /mnt/snapshot\n\n# Restaurer le snapshot (si la MAJ a échoué)\numount /var/www\nlvconvert --merge /dev/vg-prod/snap-web-avant-maj\nmount /var/www\n\n# Supprimer le snapshot (si MAJ réussie)\nlvremove /dev/vg-prod/snap-web-avant-maj -y' },

          { type: 'h2', content: '2. NFS Server Production' },
          { type: 'code', content: '# ============================================================\n# SERVEUR NFS HAUTE DISPONIBILITÉ\n# ============================================================\n\napt install nfs-kernel-server nfs-common\n\n# Créer les répertoires de partage\nmkdir -p /exports/{commun,home-nfs,web-content,backup-nfs}\nchown -R nobody:nogroup /exports/commun\nchown -R root:root /exports/home-nfs\nchmod 1777 /exports/commun    # Sticky bit\nchmod 755 /exports/web-content\n\n# Configuration /etc/exports\ncat > /etc/exports << EOF\n# Format : chemin  client(options)\n\n# Partage commun (lecture/écriture pour le LAN)\n/exports/commun         192.168.1.0/24(rw,sync,no_subtree_check,all_squash,anonuid=65534,anongid=65534)\n\n# Homes NFS (chaque user ne voit que son dossier)\n/exports/home-nfs       192.168.1.0/24(rw,sync,no_subtree_check,root_squash)\n\n# Contenu web (lecture seule pour les serveurs web)\n/exports/web-content    192.168.1.10(ro,sync,no_subtree_check)\n/exports/web-content    192.168.1.11(ro,sync,no_subtree_check)\n\n# Backup (accès restreint au serveur de backup)\n/exports/backup-nfs     192.168.1.50(rw,sync,no_subtree_check,no_root_squash)\n\n# Pour VMs (no_root_squash indispensable)\n/exports/vm-data        192.168.1.200(rw,sync,no_subtree_check,no_root_squash)\nEOF\n\n# Options NFS importantes :\n# sync          : confirme l\'écriture sur disque avant ACK (safe)\n# async         : plus rapide mais risque perte données si crash\n# root_squash   : root client = nobody serveur (sécurité)\n# no_root_squash: root client = root serveur (VMs containers)\n# all_squash    : tous les users = nobody (partages publics)\n# anonuid=65534 : UID de l\'utilisateur anonyme (nobody)\n# no_subtree_check : désactive la vérification de sous-arbre (stabilité)\n# rw            : lecture/écriture\n# ro            : lecture seule\n\n# Appliquer les exports\nexportfs -ra\nexportfs -v\n# /exports/commun  192.168.1.0/24(rw,wdelay,root_squash,...)\n\nsystemctl enable --now nfs-kernel-server\n\n# Voir les exports actifs\nshowmount -e localhost\n\n# Optimisation NFS — Augmenter les threads\ncat > /etc/default/nfs-kernel-server << EOF\nRPCNFSDCOUNT=16    # 16 threads (défaut : 8)\nEOF\nsystemctl restart nfs-kernel-server\n\n# Pare-feu\nufw allow from 192.168.1.0/24 to any port nfs\nufw allow from 192.168.1.0/24 to any port 111   # rpcbind\nufw allow from 192.168.1.0/24 to any port 20048  # mountd\n\n# ── CLIENT NFS ──\napt install nfs-common\n\n# Voir les exports disponibles\nshowmount -e 192.168.1.10\n\n# Montage manuel\nmount -t nfs -o rw,sync 192.168.1.10:/exports/commun /mnt/commun\n\n# Montage optimisé pour performances\nmount -t nfs4 \\\n  -o rw,hard,intr,rsize=1048576,wsize=1048576,timeo=600,retrans=2 \\\n  192.168.1.10:/exports/web-content /var/www/shared\n\n# Montage permanent /etc/fstab\ncat >> /etc/fstab << EOF\n192.168.1.10:/exports/commun      /mnt/commun   nfs4  rw,hard,intr,_netdev  0  0\n192.168.1.10:/exports/web-content /var/www/html nfs4  ro,hard,intr,_netdev  0  0\nEOF\n# _netdev = attendre que le réseau soit actif' },

          { type: 'h2', content: '3. Samba — Partages Windows/Linux' },
          { type: 'code', content: '# ============================================================\n# SAMBA — SERVEUR DE FICHIERS POUR CLIENTS WINDOWS\n# ============================================================\n\napt install samba samba-common-bin\n\n# Sauvegarde de la config originale\ncp /etc/samba/smb.conf /etc/samba/smb.conf.bak\n\n# Configuration complète production\ncat > /etc/samba/smb.conf << EOF\n[global]\n   workgroup = TSSR\n   server string = Serveur Fichiers TSSR\n   netbios name = SRV-FILES\n   security = user\n   encrypt passwords = yes\n   map to guest = never\n\n   # Jointure AD (pour auth AD)\n   # security = ads\n   # realm = TSSR.LOCAL\n   # kerberos method = secrets and keytab\n\n   # Performance\n   socket options = TCP_NODELAY IPTOS_LOWDELAY\n   read raw = yes\n   write raw = yes\n   use sendfile = yes\n   aio read size = 16384\n   aio write size = 16384\n\n   # Logs\n   log level = 1\n   log file = /var/log/samba/log.%m\n   max log size = 1000\n\n   # Corbeille (versions précédentes de fichiers)\n   vfs objects = shadow_copy2 recycle\n   shadow: snapdir = .snapshots\n   shadow: sort = desc\n   shadow: format = @GMT-%Y.%m.%d-%H.%M.%S\n   recycle:repository = .corbeille\n   recycle:keeptree = yes\n   recycle:versions = yes\n\n[Commun]\n   comment = Partage Commun TSSR\n   path = /srv/partages/commun\n   browseable = yes\n   read only = no\n   valid users = @utilisateurs @admins\n   write list = @admins\n   create mask = 0664\n   directory mask = 0775\n   force group = partage-commun\n\n[Homes]\n   comment = Répertoires Personnels\n   path = /srv/partages/home/%U\n   browseable = no\n   read only = no\n   valid users = %S\n   create mask = 0700\n   directory mask = 0700\n\n[IT]\n   comment = Partage Équipe Informatique\n   path = /srv/partages/it\n   browseable = yes\n   read only = no\n   valid users = @it-admins @it-tech\n   create mask = 0770\n   directory mask = 0770\n   force group = it-admins\n\n[Logiciels]\n   comment = Dépôt Logiciels (lecture seule)\n   path = /srv/partages/logiciels\n   browseable = yes\n   read only = yes\n   valid users = @Domain Users\n   guest ok = no\n\n[Sauvegardes]\n   comment = Sauvegardes (accès admin)\n   path = /srv/partages/backup\n   browseable = yes\n   read only = no\n   valid users = @backup-admins\n   create mask = 0660\nEOF\n\n# Vérifier la configuration\ntestparm\n\n# Créer les répertoires et permissions\nmkdir -p /srv/partages/{commun,it,logiciels,backup}\n\n# Créer les groupes Linux correspondants\ngroupadd utilisateurs\ngroupadd admins\ngroupadd it-admins\ngroupadd it-tech\ngroupadd backup-admins\ngroupadd partage-commun\n\n# Permissions système\nchown root:partage-commun /srv/partages/commun\nchmod 2775 /srv/partages/commun  # SetGID : héritage du groupe\nchown root:it-admins /srv/partages/it\nchmod 2770 /srv/partages/it\nchown root:backup-admins /srv/partages/backup\nchmod 770 /srv/partages/backup\n\n# Créer des utilisateurs Samba\n# L\'utilisateur doit d\'abord exister dans Linux\nuseradd -M -s /usr/sbin/nologin -G utilisateurs jdupont\npasswd jdupont  # Mot de passe Linux\nsmbpasswd -a jdupont  # Mot de passe Samba (peut être différent)\nsmbpasswd -e jdupont  # Activer le compte\n\n# Démarrer Samba\nsystemctl enable --now smbd nmbd\n\n# Pare-feu\nufw allow samba\n\n# Vérification\nsmbclient -L localhost -N\nsmbclient //localhost/Commun -U jdupont\n\n# Voir les connexions actives\nsmbstatus\nsmbstatus --shares\nsmbstatus --locked\n\n# Créer les homes NFS à la volée\nmkdir -p /srv/partages/home/jdupont\nchown jdupont:jdupont /srv/partages/home/jdupont\nchmod 700 /srv/partages/home/jdupont' },
        ],
      },

      {
        id: 'docker-compose-production',
        titre: 'Docker en Production — Compose et Bonnes Pratiques',
        sections: [

          { type: 'h2', content: '1. Docker Compose — Stack complète de production' },
          { type: 'code', content: '# ============================================================\n# STACK WORDPRESS PRODUCTION AVEC DOCKER COMPOSE\n# ============================================================\n\nmkdir -p /opt/stacks/wordpress && cd /opt/stacks/wordpress\n\ncat > docker-compose.yml << EOF\nversion: "3.9"\n\nservices:\n\n  # Reverse proxy Nginx\n  nginx:\n    image: nginx:1.25-alpine\n    container_name: wp-nginx\n    ports:\n      - "80:80"\n      - "443:443"\n    volumes:\n      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro\n      - ./nginx/conf.d:/etc/nginx/conf.d:ro\n      - ./ssl:/etc/nginx/ssl:ro\n      - wp_data:/var/www/html:ro\n      - nginx_logs:/var/log/nginx\n    depends_on:\n      wordpress:\n        condition: service_healthy\n    restart: unless-stopped\n    networks:\n      - frontend\n    healthcheck:\n      test: ["CMD", "nginx", "-t"]\n      interval: 30s\n      timeout: 10s\n      retries: 3\n\n  # WordPress PHP-FPM\n  wordpress:\n    image: wordpress:6.4-php8.2-fpm-alpine\n    container_name: wp-app\n    environment:\n      WORDPRESS_DB_HOST: db\n      WORDPRESS_DB_NAME: wordpress\n      WORDPRESS_DB_USER: wp_user\n      WORDPRESS_DB_PASSWORD_FILE: /run/secrets/db_password\n      WORDPRESS_TABLE_PREFIX: wp_tssr_\n      WORDPRESS_DEBUG: "false"\n    volumes:\n      - wp_data:/var/www/html\n      - ./php/php.ini:/usr/local/etc/php/conf.d/custom.ini:ro\n    depends_on:\n      db:\n        condition: service_healthy\n    secrets:\n      - db_password\n    restart: unless-stopped\n    networks:\n      - frontend\n      - backend\n    healthcheck:\n      test: ["CMD", "php-fpm", "-t"]\n      interval: 30s\n      timeout: 10s\n      retries: 3\n\n  # Base de données MySQL\n  db:\n    image: mysql:8.0\n    container_name: wp-mysql\n    environment:\n      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password\n      MYSQL_DATABASE: wordpress\n      MYSQL_USER: wp_user\n      MYSQL_PASSWORD_FILE: /run/secrets/db_password\n    volumes:\n      - db_data:/var/lib/mysql\n      - ./mysql/my.cnf:/etc/mysql/conf.d/custom.cnf:ro\n      - ./mysql/init:/docker-entrypoint-initdb.d:ro\n    secrets:\n      - db_password\n      - db_root_password\n    restart: unless-stopped\n    networks:\n      - backend\n    healthcheck:\n      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]\n      interval: 10s\n      timeout: 5s\n      retries: 5\n\n  # Redis (cache WordPress)\n  redis:\n    image: redis:7-alpine\n    container_name: wp-redis\n    command: redis-server --requirepass "${REDIS_PASSWORD}" --maxmemory 512mb --maxmemory-policy allkeys-lru\n    volumes:\n      - redis_data:/data\n    restart: unless-stopped\n    networks:\n      - backend\n    healthcheck:\n      test: ["CMD", "redis-cli", "ping"]\n      interval: 10s\n      timeout: 5s\n      retries: 5\n\n  # Backup automatique\n  backup:\n    image: databack/mysql-backup:latest\n    container_name: wp-backup\n    environment:\n      DB_SERVER: db\n      DB_USER: root\n      DB_PASS_FILE: /run/secrets/db_root_password\n      DB_NAMES: wordpress\n      DB_DUMP_TARGET: /backups\n      DB_DUMP_CRON: "0 2 * * *"   # Toutes les nuits à 2h\n      DB_DUMP_KEEPDAYS: 30\n    volumes:\n      - /backup/wordpress:/backups\n    secrets:\n      - db_root_password\n    restart: unless-stopped\n    networks:\n      - backend\n    depends_on:\n      db:\n        condition: service_healthy\n\n# Secrets Docker (plus sécurisé que les variables d\'environnement)\nsecrets:\n  db_password:\n    file: ./secrets/db_password.txt\n  db_root_password:\n    file: ./secrets/db_root_password.txt\n\n# Volumes persistants\nvolumes:\n  wp_data:\n    driver: local\n    driver_opts:\n      type: none\n      o: bind\n      device: /srv/wordpress/html\n  db_data:\n    driver: local\n    driver_opts:\n      type: none\n      o: bind\n      device: /srv/wordpress/mysql\n  redis_data:\n  nginx_logs:\n\n# Réseaux isolés\nnetworks:\n  frontend:  # Nginx ↔ WordPress\n  backend:   # WordPress ↔ MySQL ↔ Redis (pas accessible depuis Internet)\nEOF\n\n# Créer les secrets\nmkdir -p secrets\necho "WpDB_P@ss2024!" > secrets/db_password.txt\necho "Root_P@ss2024!" > secrets/db_root_password.txt\nchmod 600 secrets/*.txt\n\n# Créer les répertoires de données\nmkdir -p /srv/wordpress/{html,mysql}\n\n# Démarrer la stack\ndocker compose up -d\n\n# Vérifier l\'état\ndocker compose ps\ndocker compose logs -f --tail=50\n\n# Mise à jour d\'un service\ndocker compose pull wordpress\ndocker compose up -d --no-deps wordpress  # Redémarrer seulement WordPress\n\n# Backup manuel\ndocker compose exec db mysqldump -u root -p wordpress > /backup/manual-$(date +%Y%m%d).sql' },

          { type: 'h2', content: '2. Supervision des conteneurs' },
          { type: 'code', content: '# ============================================================\n# MONITORING DES CONTENEURS DOCKER\n# ============================================================\n\n# Stats en temps réel\ndocker stats\n# CONTAINER  CPU %  MEM USAGE / LIMIT  MEM %  NET I/O  BLOCK I/O  PIDS\n# wp-nginx   0.01%  8.5MiB / 16GiB    0.05%  2kB/2kB  0B/0B      5\n# wp-app     0.5%   128MiB / 16GiB    0.78%  10kB/5kB 0B/20MB    20\n# wp-mysql   1.2%   512MiB / 16GiB    3.12%  5kB/15kB 50MB/30MB  40\n\n# Format personnalisé\ndocker stats --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}\\t{{.NetIO}}"\n\n# Logs d\'un conteneur\ndocker logs wp-mysql --tail 100\ndocker logs wp-nginx -f --since 1h  # Dernière heure en temps réel\n\n# Inspecter un conteneur\ndocker inspect wp-mysql | python3 -m json.tool | grep -A5 "Health"\n\n# ── PORTAINER — Interface graphique pour Docker ──\n# Interface web complète pour gérer vos conteneurs\n\ndocker volume create portainer_data\ndocker run -d \\\n  -p 8000:8000 \\\n  -p 9443:9443 \\\n  --name portainer \\\n  --restart=always \\\n  -v /var/run/docker.sock:/var/run/docker.sock \\\n  -v portainer_data:/data \\\n  portainer/portainer-ce:latest\n\n# Accès : https://IP-SERVEUR:9443\n\n# ── CTOP — Top pour Docker ──\napt install ctop\nctop\n# Vue en temps réel de tous les conteneurs\n\n# ── CADVISOR — Métriques pour Prometheus/Grafana ──\ndocker run -d \\\n  --name cadvisor \\\n  --restart always \\\n  -p 8080:8080 \\\n  -v /:/rootfs:ro \\\n  -v /var/run:/var/run:ro \\\n  -v /sys:/sys:ro \\\n  -v /var/lib/docker/:/var/lib/docker:ro \\\n  gcr.io/cadvisor/cadvisor:latest\n\n# Métriques disponibles sur http://IP:8080/metrics\n# Intégration Zabbix : zabbix_get -s localhost -k "docker.discovery[name]"' },
        ],
      },

      {
        id: 'ansible-automatisation',
        titre: 'Ansible — Automatisation d\'Infrastructure Linux',
        sections: [

          { type: 'h2', content: '1. Concepts et installation Ansible' },
          { type: 'code', content: '# ============================================================\n# INSTALLATION ANSIBLE\n# ============================================================\n\n# Sur le nœud de contrôle (votre machine admin)\napt install ansible ansible-lint\n# OU pip pour la dernière version\npip install ansible ansible-lint\n\nansible --version\n# ansible [core 2.16.0]\n\n# ============================================================\n# INVENTAIRE\n# ============================================================\n# L\'inventaire liste tous les serveurs à gérer\n\n# Format INI\ncat > /etc/ansible/hosts << EOF\n# Serveurs web\n[webservers]\nweb01 ansible_host=192.168.1.10 ansible_user=admin\nweb02 ansible_host=192.168.1.11 ansible_user=admin\n\n# Serveurs base de données\n[dbservers]\ndb01 ansible_host=192.168.1.20 ansible_user=admin\ndb02 ansible_host=192.168.1.21 ansible_user=admin\n\n# Contrôleurs de domaine\n[domain_controllers]\ndc01 ansible_host=192.168.1.30\ndc02 ansible_host=192.168.1.31\n\n# Variables pour un groupe\n[webservers:vars]\nhttp_port=80\nhttps_port=443\nmax_clients=200\nEOF\n\n# Format YAML (plus flexible et lisible)\ncat > inventory.yml << EOF\nall:\n  vars:\n    ansible_user: admin\n    ansible_ssh_private_key_file: ~/.ssh/id_ed25519\n    ansible_python_interpreter: /usr/bin/python3\n\n  children:\n    webservers:\n      hosts:\n        web01:\n          ansible_host: 192.168.1.10\n          site_name: tssr.local\n        web02:\n          ansible_host: 192.168.1.11\n          site_name: api.tssr.local\n\n    dbservers:\n      hosts:\n        db01:\n          ansible_host: 192.168.1.20\n          mysql_max_connections: 200\n        db02:\n          ansible_host: 192.168.1.21\n          mysql_max_connections: 100\n\n    # Groupe parent contenant tous les serveurs Linux\n    linux:\n      children:\n        webservers:\n        dbservers:\nEOF\n\n# Tester la connectivité\nansible all -i inventory.yml -m ping\n# web01 | SUCCESS => { "ping": "pong" }\n# web02 | SUCCESS => { "ping": "pong" }\n\n# Exécuter une commande ad-hoc\nansible webservers -i inventory.yml -m command -a "uptime"\nansible all -i inventory.yml -m shell -a "df -h | grep /dev/sda"\nansible all -i inventory.yml -m apt -a "update_cache=yes" --become\nansible webservers -i inventory.yml -m service -a "name=apache2 state=restarted" --become' },

          { type: 'h2', content: '2. Playbooks avancés' },
          { type: 'code', content: '# ============================================================\n# PLAYBOOK COMPLET — DÉPLOIEMENT SERVEUR WEB\n# ============================================================\n\ncat > deploy-webserver.yml << EOF\n---\n- name: Déploiement et configuration serveur web TSSR\n  hosts: webservers\n  become: yes\n  gather_facts: yes\n\n  vars:\n    app_name: tssr-web\n    app_user: www-data\n    app_dir: /var/www/{{ app_name }}\n    db_host: "{{ hostvars[groups[\'dbservers\'][0]][\'ansible_host\'] }}"\n    packages:\n      - nginx\n      - php8.2-fpm\n      - php8.2-mysql\n      - php8.2-curl\n      - php8.2-mbstring\n      - python3-pip\n      - certbot\n      - python3-certbot-nginx\n\n  handlers:\n    - name: Restart nginx\n      service:\n        name: nginx\n        state: restarted\n\n    - name: Reload nginx\n      service:\n        name: nginx\n        state: reloaded\n\n    - name: Restart php-fpm\n      service:\n        name: php8.2-fpm\n        state: restarted\n\n  tasks:\n\n    # ── 1. Mise à jour du système ──\n    - name: Mettre à jour les dépôts APT\n      apt:\n        update_cache: yes\n        cache_valid_time: 3600  # Ne pas mettre à jour si < 1h\n\n    - name: Mettre à niveau les paquets de sécurité\n      apt:\n        upgrade: safe\n        only_upgrade: yes\n\n    # ── 2. Installation des paquets ──\n    - name: Installer les paquets nécessaires\n      apt:\n        name: "{{ packages }}"\n        state: present\n\n    # ── 3. Créer l\'utilisateur applicatif ──\n    - name: Créer le groupe applicatif\n      group:\n        name: "{{ app_name }}"\n        state: present\n\n    - name: Créer l\'utilisateur applicatif\n      user:\n        name: "{{ app_name }}"\n        group: "{{ app_name }}"\n        groups: www-data\n        system: yes\n        create_home: no\n        shell: /usr/sbin/nologin\n\n    # ── 4. Créer la structure de l\'application ──\n    - name: Créer les répertoires\n      file:\n        path: "{{ item }}"\n        state: directory\n        owner: "{{ app_name }}"\n        group: www-data\n        mode: "0755"\n      loop:\n        - "{{ app_dir }}"\n        - "{{ app_dir }}/public"\n        - "{{ app_dir }}/logs"\n        - "{{ app_dir }}/cache"\n\n    # ── 5. Déployer la configuration Nginx ──\n    - name: Copier le template Nginx\n      template:\n        src: templates/nginx-vhost.j2\n        dest: /etc/nginx/sites-available/{{ app_name }}.conf\n        owner: root\n        group: root\n        mode: "0644"\n        validate: "nginx -t -c %s"\n      notify: Reload nginx\n\n    - name: Activer le VirtualHost\n      file:\n        src: /etc/nginx/sites-available/{{ app_name }}.conf\n        dest: /etc/nginx/sites-enabled/{{ app_name }}.conf\n        state: link\n      notify: Reload nginx\n\n    - name: Désactiver le site par défaut\n      file:\n        path: /etc/nginx/sites-enabled/default\n        state: absent\n      notify: Reload nginx\n\n    # ── 6. Configuration PHP ──\n    - name: Copier la configuration PHP\n      template:\n        src: templates/php.ini.j2\n        dest: /etc/php/8.2/fpm/conf.d/99-{{ app_name }}.ini\n      notify: Restart php-fpm\n\n    # ── 7. Déployer l\'application ──\n    - name: Synchroniser les fichiers de l\'application\n      synchronize:\n        src: /local/app/\n        dest: "{{ app_dir }}/public/"\n        delete: yes\n        recursive: yes\n        checksum: yes\n      notify: Reload nginx\n\n    - name: Définir les permissions sur les fichiers\n      file:\n        path: "{{ app_dir }}"\n        owner: "{{ app_name }}"\n        group: www-data\n        mode: "u=rwX,g=rX,o="\n        recurse: yes\n\n    # ── 8. Activer et démarrer les services ──\n    - name: Activer et démarrer Nginx\n      service:\n        name: nginx\n        state: started\n        enabled: yes\n\n    - name: Activer et démarrer PHP-FPM\n      service:\n        name: php8.2-fpm\n        state: started\n        enabled: yes\n\n    # ── 9. Vérifications ──\n    - name: Vérifier que Nginx répond\n      uri:\n        url: "http://{{ ansible_host }}/health"\n        status_code: 200\n        timeout: 10\n      register: health_check\n      retries: 3\n      delay: 5\n\n    - name: Afficher le résultat\n      debug:\n        msg: "✓ Serveur web {{ inventory_hostname }} opérationnel (code: {{ health_check.status }})"\n\n    # ── 10. Configurer le pare-feu ──\n    - name: Autoriser HTTP et HTTPS\n      ufw:\n        rule: allow\n        port: "{{ item }}"\n        proto: tcp\n      loop:\n        - "80"\n        - "443"\n\n    - name: Activer UFW\n      ufw:\n        state: enabled\n        policy: deny\nEOF\n\n# Template Nginx (templates/nginx-vhost.j2)\nmkdir -p templates\ncat > templates/nginx-vhost.j2 << EOF\nserver {\n    listen 80;\n    server_name {{ site_name }};\n    return 301 https://$host$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name {{ site_name }};\n    root {{ app_dir }}/public;\n\n    ssl_certificate     /etc/ssl/certs/{{ site_name }}.crt;\n    ssl_certificate_key /etc/ssl/private/{{ site_name }}.key;\n\n    location / {\n        try_files $uri $uri/ /index.php?$query_string;\n    }\n\n    location ~ \\.php$ {\n        fastcgi_pass unix:/run/php/php8.2-fpm.sock;\n        fastcgi_index index.php;\n        include fastcgi_params;\n    }\n}\nEOF\n\n# Vérifier le playbook (syntax check)\nansible-playbook -i inventory.yml deploy-webserver.yml --syntax-check\n\n# Dry run (simuler sans exécuter)\nansible-playbook -i inventory.yml deploy-webserver.yml --check --diff\n\n# Exécuter\nansible-playbook -i inventory.yml deploy-webserver.yml -v\n\n# Limiter à un serveur\nansible-playbook -i inventory.yml deploy-webserver.yml --limit web01\n\n# Exécuter depuis une tâche spécifique\nansible-playbook -i inventory.yml deploy-webserver.yml --start-at-task "Vérifier que Nginx répond"\n\n# Tags — Exécuter seulement certaines tâches\n# (ajouter tags: [nginx] sur les tâches)\nansible-playbook -i inventory.yml deploy-webserver.yml --tags nginx\nansible-playbook -i inventory.yml deploy-webserver.yml --skip-tags debug' },
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
    id: 'ws2025-installation',
    titre: 'Windows Server 2025 — Installation et Configuration Avancée',
    sections: [

      { type: 'h2', content: '1. Nouveautés Windows Server 2025' },
      { type: 'table', headers: ['Nouveauté', 'Description', 'Avantage'], rows: [
        ['Hotpatching', 'Mises à jour sans redémarrage (Azure Edition)', 'Disponibilité maximale'],
        ['SMB over QUIC', 'Partages SMB via protocole QUIC (UDP)', 'Accès fichiers sécurisé sans VPN'],
        ['Credential Guard par défaut', 'Protection des credentials en mémoire', 'Résistance pass-the-hash'],
        ['TLS 1.3 par défaut', 'Protocole TLS moderne activé nativement', 'Sécurité communications'],
        ['Delegated Managed Service Accounts (dMSA)', 'Comptes de service gérés délégués', 'Sécurité services améliorée'],
        ['Storage Replica amélioré', 'Réplication stockage bi-directionnelle', 'DR et HA simplifiés'],
        ['NUMA-aware improvements', 'Meilleure gestion mémoire NUMA', 'Performances HPC'],
        ['AD amélioré', 'Nouveau niveau fonctionnel forêt/domaine', 'Fonctionnalités AD étendues'],
      ]},

      { type: 'h2', content: '2. Éditions et licencing' },
      { type: 'table', headers: ['Édition', 'VMs incluses', 'Cœurs min', 'Usage', 'Prix approx.'], rows: [
        ['Essentials', '0', '—', 'TPE < 25 users 50 appareils', '500€'],
        ['Standard', '2 VMs Windows', '16 cœurs minimum', 'Serveurs standard non-virtualisés', '1200€'],
        ['Datacenter', 'Illimitées', '16 cœurs minimum', 'Datacenters virtualisation intensive', '6000€'],
        ['Azure Edition', 'Illimitées', 'Azure uniquement', 'Hotpatching SMB over QUIC', 'Inclus Azure'],
      ]},
      { type: 'info', content: '<strong>Licencing par cœur :</strong> Le prix est calculé par paire de cœurs physiques. Un serveur avec 2 CPUs × 8 cœurs = 16 cœurs = minimum légal. Un serveur 4 cœurs paie quand même pour 16 cœurs. Les VMs Windows incluses s\'appliquent par licence (Standard = 2 VMs par licence serveur).' },

      { type: 'h2', content: '3. Installation et configuration initiale' },
      { type: 'steps', items: [
        {
          num: '1',
          title: 'Choix de l\'option d\'installation',
          content: '<strong>Server Core</strong> : pas d\'interface graphique, CLI uniquement, surface d\'attaque réduite, 4 Go RAM minimum, recommandé production.<br><strong>Desktop Experience</strong> : interface graphique complète, 8 Go RAM minimum, recommandé pour apprentissage.',
          why: 'Microsoft pousse activement vers Server Core depuis 2016. En production, moins de paquets installés = moins de vulnérabilités = moins de redémarrages pour les mises à jour. Les serveurs Core consomment 30-40% moins de RAM.'
        },
        {
          num: '2',
          title: 'Configuration post-installation PowerShell',
          content: 'Script de configuration initiale complète à exécuter juste après l\'installation.',
          why: 'Automatiser la configuration initiale garantit la cohérence entre tous les serveurs et évite les oublis.'
        },
        {
          num: '3',
          title: 'Rejoindre le domaine',
          content: 'Intégrer le serveur à Active Directory pour la gestion centralisée.',
          why: 'Hors domaine, les GPO ne s\'appliquent pas, pas d\'authentification Kerberos, pas de gestion centralisée.'
        },
        {
          num: '4',
          title: 'Installer les rôles nécessaires',
          content: 'N\'installer que les rôles réellement nécessaires. Chaque rôle installé augmente la surface d\'attaque.',
          why: 'Principe du moindre privilège appliqué aux rôles serveur.'
        },
        {
          num: '5',
          title: 'Configurer les mises à jour',
          content: 'Pointer vers WSUS interne ou configurer Windows Update selon la politique de l\'entreprise.',
          why: 'Les mises à jour de sécurité doivent être appliquées rapidement mais de façon contrôlée en production.'
        },
      ]},
      { type: 'code', content: '# ============================================================\n# SCRIPT DE CONFIGURATION INITIALE WINDOWS SERVER 2025\n# ============================================================\n# Exécuter en PowerShell Administrator\n\n# 1. Renommer le serveur\n$NomServeur = "SRV-WEB-01"\nRename-Computer -NewName $NomServeur -Force\nWrite-Host "✓ Serveur renommé en $NomServeur" -ForegroundColor Green\n\n# 2. Configurer l\'IP fixe\n$Interface = Get-NetAdapter | Where-Object Status -eq "Up" | Select-Object -First 1\n\nNew-NetIPAddress \\\n  -InterfaceAlias $Interface.Name \\\n  -IPAddress "192.168.1.20" \\\n  -PrefixLength 24 \\\n  -DefaultGateway "192.168.1.1"\n\nSet-DnsClientServerAddress \\\n  -InterfaceAlias $Interface.Name \\\n  -ServerAddresses @("192.168.1.10", "192.168.1.11")\n\n# Désactiver IPv6 si non utilisé\nDisable-NetAdapterBinding -Name $Interface.Name -ComponentID ms_tcpip6\n\nWrite-Host "✓ Réseau configuré" -ForegroundColor Green\n\n# 3. Configurer le fuseau horaire et NTP\nSet-TimeZone -Id "Romance Standard Time"  # Europe/Paris\nw32tm /config /manualpeerlist:"192.168.1.10" /syncfromflags:manual /reliable:yes /update\nRestart-Service W32Time\nw32tm /resync /force\n\n# 4. Configurer le pare-feu Windows\nSet-NetFirewallProfile -Profile Domain,Public,Private -Enabled True\n\n# Autoriser la gestion à distance\nEnable-NetFirewallRule -DisplayGroup "Remote Desktop"\nEnable-NetFirewallRule -DisplayGroup "Windows Management Instrumentation (WMI)"\nEnable-NetFirewallRule -DisplayGroup "File and Printer Sharing"\n\n# 5. Activer WinRM (PowerShell distant)\nEnable-PSRemoting -Force\nSet-Service WinRM -StartupType Automatic\n\n# 6. Désactiver les services inutiles\n$ServicesADesactiver = @(\n  "XblGameSave",      # Xbox\n  "XboxGipSvc",       # Xbox\n  "DiagTrack",        # Télémétrie\n  "dmwappushservice", # WAP Push\n  "Fax",              # Télécopie\n  "TabletInputService" # Tablette\n)\nforeach ($svc in $ServicesADesactiver) {\n  if (Get-Service $svc -ErrorAction SilentlyContinue) {\n    Set-Service $svc -StartupType Disabled -ErrorAction SilentlyContinue\n    Stop-Service $svc -Force -ErrorAction SilentlyContinue\n  }\n}\nWrite-Host "✓ Services inutiles désactivés" -ForegroundColor Green\n\n# 7. Configurer les mises à jour automatiques (pointer vers WSUS)\n$wsusKey = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate"\nNew-Item -Path $wsusKey -Force | Out-Null\nNew-Item -Path "$wsusKey\\AU" -Force | Out-Null\nSet-ItemProperty -Path "$wsusKey\\AU" -Name UseWUServer -Value 1\nSet-ItemProperty -Path $wsusKey -Name WUServer -Value "http://srv-wsus.tssr.local:8530"\nSet-ItemProperty -Path $wsusKey -Name WUStatusServer -Value "http://srv-wsus.tssr.local:8530"\n\n# 8. Rejoindre le domaine\n$CredDomaine = Get-Credential "TSSR\\Administrateur"\nAdd-Computer \\\n  -DomainName "tssr.local" \\\n  -Credential $CredDomaine \\\n  -OUPath "OU=Serveurs,DC=tssr,DC=local" \\\n  -Restart\n\n# Le serveur redémarre automatiquement après le join domaine\nWrite-Host "✓ Configuration terminée - Redémarrage en cours..." -ForegroundColor Yellow' },

      { type: 'h2', content: '4. Server Core — Administration sans GUI' },
      { type: 'code', content: '# ============================================================\n# SERVER CORE — ADMINISTRATION CLI UNIQUEMENT\n# ============================================================\n\n# Outil de configuration initiale Server Core\nsconfig\n# Menu interactif pour :\n# 1. Rejoindre domaine\n# 2. Ajouter admin local\n# 3. Configurer réseau\n# 4. Configurer date/heure\n# 5. Activer Windows Update\n\n# Depuis un poste admin : se connecter en PSRemoting\nEnter-PSSession -ComputerName "srv-core-01" -Credential "TSSR\\Administrateur"\n# Le prompt devient : [srv-core-01]: PS C:\\Users\\...>\n\n# OU créer une session réutilisable\n$session = New-PSSession -ComputerName "srv-core-01" -Credential "TSSR\\Administrateur"\nInvoke-Command -Session $session -ScriptBlock { Get-ComputerInfo | Select-Object OsName, OsVersion }\nRemove-PSSession $session\n\n# Installer un rôle sur Server Core\nInstall-WindowsFeature -Name Web-Server -IncludeManagementTools\n\n# Utiliser RSAT depuis un poste admin pour gérer Server Core graphiquement\n# Sur le poste admin (Windows 10/11 Pro) :\nAdd-WindowsCapability -Online -Name Rsat.ServerManager.Tools~~~~0.0.1.0\nAdd-WindowsCapability -Online -Name Rsat.ActiveDirectory.DS-LDS.Tools~~~~0.0.1.0\nAdd-WindowsCapability -Online -Name Rsat.GroupPolicy.Management.Tools~~~~0.0.1.0\n\n# Windows Admin Center (WAC) — Interface web moderne\n# Télécharger sur aka.ms/WindowsAdminCenter\n# Installer sur un serveur ou poste admin\n# Accès : https://nom-serveur\n# Gère Server Core graphiquement via navigateur' },
    ],
  },

  {
    id: 'wsus-gestion-mises-a-jour',
    titre: 'WSUS — Gestion Centralisée des Mises à Jour',
    sections: [

      { type: 'h2', content: '1. Architecture WSUS' },
      { type: 'p', content: 'WSUS (Windows Server Update Services) permet de contrôler et distribuer les mises à jour Microsoft sur tout le parc. Sans WSUS, chaque machine télécharge individuellement depuis Internet — perte de bande passante et perte de contrôle.' },
      { type: 'table', headers: ['Composant', 'Rôle', 'Détail'], rows: [
        ['Serveur WSUS', 'Télécharge et stocke les mises à jour depuis Microsoft', 'Connexion Internet nécessaire'],
        ['Base de données', 'Stocke les métadonnées des mises à jour et l\'inventaire', 'WID (Windows Internal DB) ou SQL Server'],
        ['Console WSUS', 'Interface d\'administration (approuver refuser)', 'Installée sur le serveur ou un poste admin'],
        ['GPO Client', 'Configure les clients pour pointer vers WSUS', 'Déployée via Active Directory'],
        ['Groupes d\'ordinateurs', 'Segmenter le déploiement (Test Prod)', 'Approuver pour Test puis Prod après validation'],
        ['WSUS en cascade', 'Serveur WSUS enfant synchronise depuis un WSUS parent', 'Sites distants sans Internet direct'],
      ]},

      { type: 'h2', content: '2. Installation et configuration WSUS' },
      { type: 'code', content: '# ============================================================\n# INSTALLATION WSUS\n# ============================================================\n\n# Prérequis :\n# - Windows Server 2019/2022\n# - Minimum 10 Go pour le stockage des mises à jour (100+ Go recommandé)\n# - IIS installé automatiquement avec WSUS\n\n# Installation avec stockage local\nInstall-WindowsFeature -Name UpdateServices -IncludeManagementTools\n\n# Configurer WSUS (chemin de stockage des MAJ)\n& "C:\\Program Files\\Update Services\\Tools\\WsusUtil.exe" postinstall CONTENT_DIR=D:\\WSUS_Updates\n\n# OU avec SQL Server externe (grandes infra)\n& "C:\\Program Files\\Update Services\\Tools\\WsusUtil.exe" postinstall SQL_INSTANCE_NAME=SRV-SQL\\WSUS CONTENT_DIR=D:\\WSUS_Updates\n\n# ============================================================\n# CONFIGURATION VIA POWERSHELL\n# ============================================================\n\n$wsus = Get-WsusServer -Name "SRV-WSUS" -PortNumber 8530\n\n# Configurer la source de synchronisation\n$syncConfig = $wsus.GetSubscription()\n$syncConfig.SynchronizeAutomatically = $true\n$syncConfig.SynchronizeAutomaticallyTimeOfDay = (New-TimeSpan -Hours 3) # 3h du matin\n$syncConfig.NumberOfSynchronizationsPerDay = 1\n$syncConfig.Save()\n\n# Configurer les produits à synchroniser\n$wsus.GetUpdateCategories() | Where-Object { $_.Title -in @(\n  "Windows Server 2019",\n  "Windows Server 2022",\n  "Windows 11",\n  "Windows 10",\n  "Microsoft 365 Apps for Enterprise",\n  "Microsoft SQL Server 2019"\n)} | ForEach-Object {\n  $wsus.GetSubscription().GetUpdateCategories() | Out-Null\n}\n\n# En pratique : utiliser l\'interface graphique pour choisir\n# les produits et classifications\n\n# Classifications recommandées :\n# ✓ Critical Updates\n# ✓ Security Updates\n# ✓ Definition Updates (Defender)\n# ✓ Service Packs\n# Optionnel :\n# - Updates (fonctionnelles)\n# - Feature Packs\n# - Drivers (prudence !)\n\n# ============================================================\n# GROUPES D\'ORDINATEURS\n# ============================================================\n\n# Créer des groupes pour le déploiement progressif\n$wsus.CreateComputerTargetGroup("Groupe-Test")      # 5-10 machines\n$wsus.CreateComputerTargetGroup("Groupe-Production") # Toutes les machines\n$wsus.CreateComputerTargetGroup("Serveurs-Critiques") # DCs Exchange\n\n# Stratégie de déploiement recommandée :\n# Semaine 1 : Approuver pour Groupe-Test (Pilote)\n# Semaine 2 : Valider → Approuver pour Groupe-Production\n# Serveurs-Critiques : fenêtre maintenance mensuelle seulement\n\n# ============================================================\n# APPROBATION DES MISES À JOUR\n# ============================================================\n\n# Voir les mises à jour non approuvées\n$wsus.GetUpdates() | Where-Object {\n  $_.IsApproved -eq $false -and\n  $_.IsDeclined -eq $false\n} | Select-Object Title, MsrcSeverity, ArrivalDate | Sort-Object ArrivalDate -Descending\n\n# Approuver toutes les mises à jour critiques/sécurité pour le groupe Test\n$groupeTest = $wsus.GetComputerTargetGroups() | Where-Object Name -eq "Groupe-Test"\n\n$wsus.GetUpdates() | Where-Object {\n  $_.MsrcSeverity -in @("Critical","Important") -and\n  $_.IsApproved -eq $false -and\n  $_.IsDeclined -eq $false\n} | ForEach-Object {\n  $_.Approve("Install", $groupeTest)\n  Write-Host "Approuvée : $($_.Title)"\n}\n\n# Refuser les mises à jour pour architectures non utilisées\n$wsus.GetUpdates() | Where-Object {\n  $_.Title -match "ia64|Itanium"\n} | ForEach-Object { $_.Decline() }\n\n# ============================================================\n# GPO CLIENTS WSUS\n# ============================================================\n# Computer Config → Admin Templates → Windows Components → Windows Update\n\n# Clés de registre correspondantes :\n$wsusKey = "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate"\n$wsusAUKey = "$wsusKey\\AU"\n\nNew-Item -Path $wsusKey -Force | Out-Null\nNew-Item -Path $wsusAUKey -Force | Out-Null\n\n# Pointer vers le serveur WSUS\nSet-ItemProperty -Path $wsusKey -Name WUServer -Value "http://srv-wsus.tssr.local:8530"\nSet-ItemProperty -Path $wsusKey -Name WUStatusServer -Value "http://srv-wsus.tssr.local:8530"\nSet-ItemProperty -Path $wsusAUKey -Name UseWUServer -Value 1\n\n# Options de mise à jour automatique :\n# 2 = Notification seulement\n# 3 = Télécharger automatiquement + notifier installation\n# 4 = Télécharger + installer selon planning (RECOMMANDÉ)\n# 5 = Laisser l\'admin local choisir\nSet-ItemProperty -Path $wsusAUKey -Name AUOptions -Value 4\n\n# Planning d\'installation : tous les mardis à 3h00\nSet-ItemProperty -Path $wsusAUKey -Name ScheduledInstallDay -Value 3   # 0=quotidien 1=dim 2=lun 3=mar...\nSet-ItemProperty -Path $wsusAUKey -Name ScheduledInstallTime -Value 3  # 3h00\n\n# Redémarrage automatique après installation\nSet-ItemProperty -Path $wsusAUKey -Name NoAutoRebootWithLoggedOnUsers -Value 0\n\n# Groupes WSUS côté client (affectation automatique)\nSet-ItemProperty -Path $wsusKey -Name TargetGroupEnabled -Value 1\nSet-ItemProperty -Path $wsusKey -Name TargetGroup -Value "Groupe-Production"\n\n# Forcer la mise à jour côté client\nwuauclt /detectnow\nwuauclt /reportnow\n# OU PowerShell\nInvoke-WUJob -ComputerName "PC-JEAN" -Script {ipmo PSWindowsUpdate; Get-WUInstall -AcceptAll}' },
    ],
  },

  {
    id: 'hyper-v-windows-server',
    titre: 'Hyper-V Server — Virtualisation Windows Avancée',
    sections: [

      { type: 'h2', content: '1. Architecture Hyper-V avancée' },
      { type: 'code', content: '# ============================================================\n# INSTALLATION ET CONFIGURATION HYPER-V\n# ============================================================\n\n# Vérifier les prérequis CPU\n$cpu = Get-WmiObject Win32_Processor\n$cpu.VirtualizationFirmwareEnabled  # True = VT-x/AMD-V activé\n$cpu.SecondLevelAddressTranslationExtensions  # True = SLAT supporté\n\n# Installation Hyper-V\nInstall-WindowsFeature -Name Hyper-V -IncludeManagementTools -Restart\n\n# ============================================================\n# SWITCHES VIRTUELS\n# ============================================================\n\n# 1. Switch EXTERNE (accès réseau physique)\nNew-VMSwitch -Name "vSwitch-LAN" -NetAdapterName "Ethernet" -AllowManagementOS $true\n# AllowManagementOS : l\'hôte peut aussi communiquer via ce switch\n\n# 2. Switch INTERNE (VMs + hôte, pas de réseau externe)\nNew-VMSwitch -Name "vSwitch-Lab-Interne" -SwitchType Internal\n# Configurer IP sur l\'interface vEthernet créée\nNew-NetIPAddress -InterfaceAlias "vEthernet (vSwitch-Lab-Interne)" -IPAddress "10.0.0.1" -PrefixLength 24\n\n# 3. Switch PRIVÉ (VMs uniquement)\nNew-VMSwitch -Name "vSwitch-Isolé" -SwitchType Private\n\n# Switch avec VLAN sur le port de gestion\nSet-VMNetworkAdapterVlan -ManagementOS -VMNetworkAdapterName "vSwitch-LAN" -VlanId 10 -Access\n\n# ============================================================\n# CRÉATION DE VMs\n# ============================================================\n\n# VM Windows Server 2022\nNew-VM \\\n  -Name "VM-DC-02" \\\n  -MemoryStartupBytes 4GB \\\n  -Generation 2 \\\n  -NewVHDPath "D:\\VMs\\VM-DC-02\\VM-DC-02.vhdx" \\\n  -NewVHDSizeBytes 60GB \\\n  -SwitchName "vSwitch-LAN" \\\n  -Path "D:\\VMs"\n\n# Configuration CPU et mémoire\nSet-VM "VM-DC-02" \\\n  -ProcessorCount 4 \\\n  -DynamicMemory \\\n  -MemoryMinimumBytes 1GB \\\n  -MemoryMaximumBytes 8GB \\\n  -MemoryStartupBytes 4GB\n\n# Secure Boot pour Gen2\nSet-VMFirmware "VM-DC-02" -SecureBootTemplate MicrosoftWindows\n# Pour Linux :\n# Set-VMFirmware "VM-Linux" -SecureBootTemplate MicrosoftUEFICertificateAuthority\n\n# Ordre de boot\nSet-VMFirmware "VM-DC-02" -BootOrder @(\n  (Get-VMDvdDrive "VM-DC-02"),\n  (Get-VMHardDiskDrive "VM-DC-02")\n)\n\n# Attacher un ISO\nAdd-VMDvdDrive "VM-DC-02"\nSet-VMDvdDrive "VM-DC-02" -Path "E:\\ISO\\WS2022.iso"\n\n# Démarrer\nStart-VM "VM-DC-02"\nvmconnect localhost "VM-DC-02"  # Console graphique\n\n# ============================================================\n# MÉMOIRE DYNAMIQUE\n# ============================================================\n\n# La mémoire dynamique alloue la RAM selon les besoins réels\n# Idéal pour l\'overcommit (allouer plus de RAM virtuelle que physique)\n\nSet-VM "VM-DC-02" \\\n  -DynamicMemory \\\n  -MemoryMinimumBytes 512MB \\\n  -MemoryStartupBytes 2GB \\\n  -MemoryMaximumBytes 8GB \\\n\n# Buffer mémoire : RAM supplémentaire mise de côté\nSet-VMMemory "VM-DC-02" -Buffer 20  # 20% de tampon\n\n# Priorité mémoire (si l\'hôte est sous pression)\nSet-VMMemory "VM-DC-02" -Priority 80  # 0-100, 80 = haute priorité\n\n# ============================================================\n# DISQUES VIRTUELS AVANCÉS\n# ============================================================\n\n# Types de VHD/VHDX :\n# Dynamique : grandit selon les besoins (stockage économe)\n# Fixe      : taille allouée immédiatement (meilleures performances)\n# Différenciation : basé sur un VHD parent (snapshots linked clones)\n\n# Créer un disque fixe (production)\nNew-VHD -Path "D:\\VMs\\VM-DB-01\\Data.vhdx" -SizeBytes 500GB -Fixed\n\n# Attacher un disque supplémentaire\nAdd-VMHardDiskDrive \\\n  -VMName "VM-DB-01" \\\n  -ControllerType SCSI \\\n  -ControllerNumber 0 \\\n  -ControllerLocation 1 \\\n  -Path "D:\\VMs\\VM-DB-01\\Data.vhdx"\n\n# Compacter un VHD dynamique (récupérer l\'espace)\n# D\'abord : optimiser le disque dans la VM (defrag)\nOptimize-VHD -Path "D:\\VMs\\VM-Web-01\\VM-Web-01.vhdx" -Mode Full\n\n# Étendre un disque\nResize-VHD -Path "D:\\VMs\\VM-Web-01\\VM-Web-01.vhdx" -SizeBytes 80GB\n# Puis dans la VM : étendre la partition Windows ou Linux' },

      { type: 'h2', content: '2. Réplication Hyper-V' },
      { type: 'code', content: '# ============================================================\n# HYPER-V REPLICA — DISASTER RECOVERY\n# ============================================================\n# Réplique les VMs vers un site distant (DR site)\n# RPO : 30 secondes à 15 minutes selon la configuration\n\n# ── Sur le serveur REPLICA (récepteur) ──\n# Activer Hyper-V Replica\nSet-VMReplicationServer \\\n  -ReplicationEnabled $true \\\n  -AllowedAuthenticationType Certificate \\\n  -CertificateThumbprint "THUMBPRINT_CERT" \\\n  -ReplicationAllowedFromAnyServer $false\n\n# Autoriser un serveur spécifique\nNew-VMReplicationAuthorizationEntry \\\n  -AllowedPrimaryServer "hyper-v-prod.tssr.local" \\\n  -ReplicaStorageLocation "E:\\Replicas" \\\n  -TrustGroup "TSSR"\n\n# ── Sur le serveur PRIMARY (source) ──\n# Activer la réplication d\'une VM\nEnable-VMReplication \\\n  -VMName "VM-SQL-01" \\\n  -ReplicaServerName "hyper-v-dr.tssr.local" \\\n  -ReplicaServerPort 443 \\\n  -AuthenticationType Certificate \\\n  -CertificateThumbprint "THUMBPRINT_CERT" \\\n  -CompressionEnabled $true \\\n  -ReplicationFrequencySec 300  # Toutes les 5 minutes\n\n# Démarrer la réplication initiale\nStart-VMInitialReplication \\\n  -VMName "VM-SQL-01" \\\n  -DestinationPath "E:\\Replicas\\VM-SQL-01"\n# La réplication initiale copie TOUT le disque\n# Durée proportionnelle à la taille du disque et de la bande passante\n\n# Surveiller l\'état de réplication\nGet-VMReplication | Select-Object VMName, State, Health, LastReplicationTime, ReplicationFrequency\n\n# États possibles :\n# Enabled         : Configuré mais pas encore démarré\n# Replicating     : En cours de réplication initiale\n# Ready           : Prêt (réplication normale)\n# Error           : Erreur\n# Resynchronizing : Resynchronisation en cours\n\n# ── BASCULEMENT (Failover) en cas de sinistre ──\n\n# Test failover (non-destructif, VM de test créée)\nStart-VMFailover -VMName "VM-SQL-01" -AsTest\n# Sur le serveur replica :\nStart-VM -Name "VM-SQL-01 - Test"\n# Vérifier que la VM fonctionne\nStop-VMFailover -VMName "VM-SQL-01"  # Annuler le test\n\n# Failover PLANIFIÉ (maintenance, migration DR)\n# Sur le serveur primary :\nStart-VMFailover -VMName "VM-SQL-01" -Prepare\n# Arrête la VM proprement et initie le dernier delta\n# Sur le serveur replica :\nStart-VMFailover -VMName "VM-SQL-01"\nStart-VM -Name "VM-SQL-01"\n\n# Failover NON PLANIFIÉ (sinistre - primary inaccessible)\n# Sur le serveur replica directement :\nStart-VMFailover -VMName "VM-SQL-01"\nStart-VM -Name "VM-SQL-01"\n# ATTENTION : Possible perte des dernières modifications (RPO)' },

      { type: 'h2', content: '3. Live Migration et High Availability' },
      { type: 'code', content: '# ============================================================\n# LIVE MIGRATION\n# ============================================================\n# Déplacer une VM d\'un hôte Hyper-V à un autre SANS interruption\n# Prérequis : réseau dédié Live Migration + stockage partagé (SMB ou CSV)\n\n# Configurer Live Migration sur les hôtes\nEnable-VMMigration\nSet-VMMigrationNetwork -IPAddress "192.168.10.200" -Subnet "255.255.255.0"\nSet-VMHost -MaximumVirtualMachineMigrations 2\nSet-VMHost -MaximumStorageMigrations 2\n\n# Activer l\'authentification Kerberos pour Live Migration\n# (ou Credential SSP selon l\'environnement)\nSet-VMHost -VirtualMachineMigrationAuthenticationType Kerberos\n\n# Migrer une VM vers un autre hôte\nMove-VM \\\n  -Name "VM-Web-01" \\\n  -DestinationHost "HV-02.tssr.local" \\\n  -IncludeStorage \\\n  -DestinationStoragePath "D:\\VMs"\n# -IncludeStorage : migre aussi le disque (Storage Live Migration)\n\n# Migrer seulement le stockage (même hôte)\nMove-VMStorage \\\n  -VMName "VM-Web-01" \\\n  -DestinationStoragePath "E:\\VMs"\n\n# ============================================================\n# CLUSTER DE BASCULEMENT (Failover Clustering)\n# ============================================================\n# HA native Windows : si un nœud tombe, les VMs redémarrent sur l\'autre\n# Prérequis : stockage partagé (SAN iSCSI CSV)\n\n# Installer les fonctionnalités\nInstall-WindowsFeature Failover-Clustering, Hyper-V -IncludeManagementTools\n\n# Valider les prérequis cluster\nTest-Cluster -Node "HV-01.tssr.local","HV-02.tssr.local" -Include "Storage","Network"\n\n# Créer le cluster\nNew-Cluster \\\n  -Name "CLUSTER-HV" \\\n  -Node "HV-01.tssr.local","HV-02.tssr.local" \\\n  -StaticAddress "192.168.1.50"\n\n# Ajouter le stockage partagé\nGet-ClusterAvailableDisk | Add-ClusterDisk\n\n# Activer Cluster Shared Volumes (CSV)\nAdd-ClusterSharedVolume -Name "Disk 1"\n# Les CSV sont accessibles de tous les nœuds simultanément\n# Chemin CSV : C:\\ClusterStorage\\Volume1\n\n# Ajouter une VM au cluster (HA)\nAdd-ClusterVirtualMachineRole \\\n  -VMName "VM-SQL-01" \\\n  -VirtualMachineID (Get-VM "VM-SQL-01").VMId\n\n# Configurer les préférences HA\nGet-ClusterGroup "VM-SQL-01" | Set-ClusterGroup \\\n  -AutoFailbackType 1 `  # Retour automatique sur le nœud préféré\n  -FailbackWindowStart 2 `  # Entre 2h et 4h du matin\n  -FailbackWindowEnd 4\n\n# Voir l\'état du cluster\nGet-ClusterNode | Select-Object Name, State\nGet-ClusterGroup | Select-Object Name, OwnerNode, State\nGet-ClusterResource | Where-Object State -ne Online' },
    ],
  },

  {
    id: 'powershell-scripting-avance',
    titre: 'PowerShell Scripting — Administration Windows Avancée',
    sections: [

      { type: 'h2', content: '1. Gestion avancée des utilisateurs et groupes AD' },
      { type: 'code', content: '# ============================================================\n# AUDIT ET MAINTENANCE AD\n# ============================================================\n\n# Trouver les comptes inactifs depuis 90 jours\n$DateRef = (Get-Date).AddDays(-90)\nGet-ADUser -Filter {LastLogonDate -lt $DateRef -and Enabled -eq $true} \\\n  -Properties LastLogonDate, Department, Manager | \\\n  Select-Object Name, SamAccountName, Department, LastLogonDate | \\\n  Sort-Object LastLogonDate | \\\n  Export-Csv "C:\\Audit\\comptes_inactifs.csv" -NoTypeInformation -Encoding UTF8\n\n# Trouver les comptes avec mot de passe n\'expirant jamais\nGet-ADUser -Filter {PasswordNeverExpires -eq $true -and Enabled -eq $true} \\\n  -Properties PasswordNeverExpires, Department | \\\n  Where-Object { $_.DistinguishedName -notlike "*Service Accounts*" } | \\\n  Select-Object Name, SamAccountName, Department\n\n# Trouver les groupes vides\nGet-ADGroup -Filter * | Where-Object {\n  (Get-ADGroupMember $_ -ErrorAction SilentlyContinue).Count -eq 0\n} | Select-Object Name, GroupScope, DistinguishedName\n\n# Comptes verrouillés\nSearch-ADAccount -LockedOut | Select-Object Name, SamAccountName, LastLogonDate\n\n# Déverrouiller tous les comptes verrouillés\nSearch-ADAccount -LockedOut | Unlock-ADAccount\n\n# Rapport des membres des groupes d\'administration\n$groupesAdmin = @("Domain Admins", "Enterprise Admins", "Schema Admins", "Administrators")\nforeach ($groupe in $groupesAdmin) {\n  Write-Host "\\n=== $groupe ==="\n  Get-ADGroupMember $groupe -Recursive | \\\n    Get-ADUser -Properties LastLogonDate | \\\n    Select-Object Name, SamAccountName, LastLogonDate | \\\n    Format-Table -AutoSize\n}\n\n# ============================================================\n# GESTION BULK (MASSE) DES UTILISATEURS\n# ============================================================\n\n# Créer des utilisateurs depuis un CSV\n$Users = Import-Csv "C:\\Scripts\\nouveaux_users.csv" -Encoding UTF8\n# CSV format :\n# Prenom,Nom,Service,Manager,Email\n# Jean,Dupont,Informatique,m.martin,j.dupont@tssr.local\n\nforeach ($u in $Users) {\n  $Login = "$($u.Prenom[0].ToString().ToLower()).$($u.Nom.ToLower())"\n  $UPN = "$Login@tssr.local"\n  $OU = "OU=$($u.Service),OU=Utilisateurs,DC=tssr,DC=local"\n\n  try {\n    New-ADUser \\\n      -Name "$($u.Prenom) $($u.Nom)" \\\n      -GivenName $u.Prenom \\\n      -Surname $u.Nom \\\n      -SamAccountName $Login \\\n      -UserPrincipalName $UPN \\\n      -Path $OU \\\n      -Department $u.Service \\\n      -EmailAddress $u.Email \\\n      -AccountPassword (ConvertTo-SecureString "P@ssInit2024!" -AsPlainText -Force) \\\n      -ChangePasswordAtLogon $true \\\n      -Enabled $true \\\n      -ErrorAction Stop\n\n    # Ajouter au groupe du service\n    Add-ADGroupMember -Identity "GG-$($u.Service)" -Members $Login -ErrorAction SilentlyContinue\n\n    Write-Host "✓ Créé : $($u.Prenom) $($u.Nom) ($Login)" -ForegroundColor Green\n\n  } catch {\n    Write-Warning "✗ Erreur pour $($u.Prenom) $($u.Nom) : $_"\n  }\n}\n\n# Désactiver et déplacer les utilisateurs partants\nfunction Disable-DepartingUser {\n  param ([string]$SamAccountName)\n\n  $user = Get-ADUser $SamAccountName -Properties MemberOf\n\n  # Désactiver le compte\n  Disable-ADAccount -Identity $SamAccountName\n\n  # Retirer de tous les groupes sauf Domain Users\n  $user.MemberOf | ForEach-Object {\n    Remove-ADGroupMember -Identity $_ -Members $SamAccountName -Confirm:$false\n  }\n\n  # Changer le mot de passe aléatoire\n  $NouveauMDP = ConvertTo-SecureString ([System.Web.Security.Membership]::GeneratePassword(20,5)) -AsPlainText -Force\n  Set-ADAccountPassword -Identity $SamAccountName -Reset -NewPassword $NouveauMDP\n\n  # Déplacer dans l\'OU "Désactivés"\n  Move-ADObject \\\n    -Identity (Get-ADUser $SamAccountName).DistinguishedName \\\n    -TargetPath "OU=Desactives,DC=tssr,DC=local"\n\n  # Ajouter une note\n  Set-ADUser $SamAccountName -Description "Désactivé le $(Get-Date -Format \'dd/MM/yyyy\')"\n\n  Write-Host "✓ Utilisateur $SamAccountName désactivé et déplacé"\n}\n\n# Utilisation\nDisable-DepartingUser -SamAccountName "j.dupont"' },

      { type: 'h2', content: '2. Gestion des partages et permissions NTFS' },
      { type: 'code', content: '# ============================================================\n# PARTAGES DE FICHIERS\n# ============================================================\n\n# Créer un partage avec permissions\nNew-SmbShare \\\n  -Name "Commun" \\\n  -Path "D:\\Partages\\Commun" \\\n  -Description "Partage commun entreprise" \\\n  -FullAccess "TSSR\\Domain Admins" \\\n  -ChangeAccess "TSSR\\DL-RW-Commun" \\\n  -ReadAccess "TSSR\\DL-RO-Commun" \\\n  -FolderEnumerationMode AccessBased  # Masquer les dossiers non accessibles\n\n# Lister les partages\nGet-SmbShare | Select-Object Name, Path, Description\n\n# Voir les connexions actives\nGet-SmbSession | Select-Object ClientUserName, ClientComputerName, NumOpens\n\n# Voir les fichiers ouverts\nGet-SmbOpenFile | Select-Object ClientUserName, Path\n\n# ============================================================\n# PERMISSIONS NTFS AVANCÉES\n# ============================================================\n\n# Voir les permissions NTFS d\'un dossier\n$ACL = Get-Acl "D:\\Partages\\Commun"\n$ACL.Access | Select-Object IdentityReference, FileSystemRights, AccessControlType, IsInherited\n\n# Ajouter une permission NTFS\n$ACL = Get-Acl "D:\\Partages\\RH"\n\n$Regle = New-Object System.Security.AccessControl.FileSystemAccessRule(\n  "TSSR\\GG-RH",           # Principal\n  "Modify",                # Droits (Read ReadAndExecute Modify FullControl)\n  "ContainerInherit, ObjectInherit",  # Héritage\n  "None",                 # Propagation\n  "Allow"                 # Type\n)\n\n$ACL.AddAccessRule($Regle)\nSet-Acl "D:\\Partages\\RH" $ACL\n\n# Supprimer une permission NTFS\n$ACL.RemoveAccessRule($Regle)\nSet-Acl "D:\\Partages\\RH" $ACL\n\n# Bloquer l\'héritage\n$ACL.SetAccessRuleProtection($true, $false)  # (bloquer, copier les règles existantes)\nSet-Acl "D:\\Partages\\Confidentiel" $ACL\n\n# ============================================================\n# AUDIT DES PERMISSIONS\n# ============================================================\n\nfunction Get-FolderPermissions {\n  param ([string]$Path, [switch]$Recurse)\n\n  $dossiers = if ($Recurse) {\n    Get-ChildItem $Path -Directory -Recurse\n  } else {\n    Get-Item $Path\n  }\n\n  $resultats = foreach ($dossier in $dossiers) {\n    $acl = Get-Acl $dossier.FullName\n    foreach ($regle in $acl.Access | Where-Object IsInherited -eq $false) {\n      [PSCustomObject]@{\n        Chemin      = $dossier.FullName\n        Principal   = $regle.IdentityReference\n        Droits      = $regle.FileSystemRights\n        Type        = $regle.AccessControlType\n        Héritée     = $regle.IsInherited\n      }\n    }\n  }\n\n  return $resultats\n}\n\n# Auditer les permissions non héritées\nGet-FolderPermissions -Path "D:\\Partages" -Recurse | \\\n  Export-Csv "C:\\Audit\\permissions_ntfs.csv" -NoTypeInformation -Encoding UTF8' },

      { type: 'h2', content: '3. Monitoring et alertes PowerShell' },
      { type: 'code', content: '# ============================================================\n# SCRIPT DE MONITORING COMPLET\n# ============================================================\n\nfunction Send-AlertEmail {\n  param (\n    [string]$Sujet,\n    [string]$Corps,\n    [string[]]$Destinataires = @("admin@tssr.local")\n  )\n  Send-MailMessage \\\n    -From "monitoring@tssr.local" \\\n    -To $Destinataires \\\n    -Subject $Sujet \\\n    -BodyAsHtml $Corps \\\n    -SmtpServer "mail.tssr.local" \\\n    -Port 587 \\\n    -UseSSL\n}\n\nfunction Get-SystemHealth {\n  param ([string[]]$Serveurs)\n\n  $rapport = foreach ($srv in $Serveurs) {\n    $result = [ordered]@{\n      Serveur = $srv\n      Heure   = Get-Date -Format "HH:mm:ss"\n      Alertes = [System.Collections.Generic.List[string]]::new()\n    }\n\n    if (Test-Connection $srv -Count 1 -Quiet -TimeoutSeconds 3) {\n      try {\n        $data = Invoke-Command -ComputerName $srv -ScriptBlock {\n          $cpu = (Get-WmiObject Win32_Processor | Measure-Object LoadPercentage -Average).Average\n          $ram = Get-WmiObject Win32_OperatingSystem\n          $ramPct = [math]::Round(($ram.TotalVisibleMemorySize - $ram.FreePhysicalMemory) / $ram.TotalVisibleMemorySize * 100, 1)\n          $disques = Get-PSDrive -PSProvider FileSystem | Where-Object Used -gt 0 | ForEach-Object {\n            @{Lettre=$_.Name; Pct=[math]::Round($_.Used/($_.Used+$_.Free)*100,1)}\n          }\n          @{CPU=$cpu; RAM=$ramPct; Disques=$disques}\n        } -ErrorAction Stop\n\n        $result.CPU = "$($data.CPU)%"\n        $result.RAM = "$($data.RAM)%"\n        $result.Accessible = $true\n\n        if ($data.CPU -gt 90)  { $result.Alertes.Add("CPU CRITIQUE: $($data.CPU)%") }\n        elseif ($data.CPU -gt 75) { $result.Alertes.Add("CPU WARN: $($data.CPU)%") }\n\n        if ($data.RAM -gt 90) { $result.Alertes.Add("RAM CRITIQUE: $($data.RAM)%") }\n        elseif ($data.RAM -gt 80) { $result.Alertes.Add("RAM WARN: $($data.RAM)%") }\n\n        foreach ($d in $data.Disques) {\n          if ($d.Pct -gt 90) { $result.Alertes.Add("DISQUE $($d.Lettre): $($d.Pct)% CRITIQUE") }\n          elseif ($d.Pct -gt 80) { $result.Alertes.Add("DISQUE $($d.Lettre): $($d.Pct)% WARN") }\n        }\n\n      } catch {\n        $result.Accessible = $false\n        $result.Alertes.Add("WinRM inaccessible")\n      }\n    } else {\n      $result.Accessible = $false\n      $result.CPU = "N/A"\n      $result.RAM = "N/A"\n      $result.Alertes.Add("PING ECHEC")\n    }\n\n    [PSCustomObject]$result\n  }\n\n  return $rapport\n}\n\n# Exécution\n$serveurs = @("srv-ad-01","srv-ad-02","srv-web-01","srv-db-01","srv-mail-01")\n$sante = Get-SystemHealth -Serveurs $serveurs\n\n# Afficher les résultats\n$sante | Format-Table Serveur, CPU, RAM, Accessible, @{N=\'Alertes\';E={$_.Alertes -join "; "}} -AutoSize\n\n# Envoyer les alertes critiques\n$alertesCritiques = $sante | Where-Object { $_.Alertes.Count -gt 0 }\nif ($alertesCritiques) {\n  $corps = "<h2>Alertes Monitoring</h2><table border=1>"\n  $corps += "<tr><th>Serveur</th><th>Alertes</th></tr>"\n  foreach ($a in $alertesCritiques) {\n    $corps += "<tr><td>$($a.Serveur)</td><td style=\'color:red\'>$($a.Alertes -join \'<br>\')</td></tr>"\n  }\n  $corps += "</table>"\n  Send-AlertEmail -Sujet "[ALERTE] $($alertesCritiques.Count) serveur(s) en problème" -Corps $corps\n}\n\n# Planifier avec une tâche planifiée Windows\n$action = New-ScheduledTaskAction \\\n  -Execute "PowerShell.exe" \\\n  -Argument "-NonInteractive -File C:\\Scripts\\monitoring.ps1"\n\n$trigger = New-ScheduledTaskTrigger -RepetitionInterval (New-TimeSpan -Minutes 5) -Once -At (Get-Date)\n\n$settings = New-ScheduledTaskSettingsSet -ExecutionTimeLimit (New-TimeSpan -Minutes 2)\n\nRegister-ScheduledTask \\\n  -TaskName "Monitoring-Serveurs" \\\n  -Action $action \\\n  -Trigger $trigger \\\n  -Settings $settings \\\n  -RunLevel Highest \\\n  -User "SYSTEM"\n\nWrite-Host "✓ Tâche planifiée créée - Monitoring toutes les 5 minutes"' },
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
        id: 'delegation-sites-ad',
        titre: 'Délégation, Sites AD et Réplication',
        sections: [

          { type: 'h2', content: '1. Délégation de contrôle — Administration granulaire' },
          { type: 'p', content: 'La délégation permet d\'accorder des droits précis sur des OUs spécifiques sans donner des droits d\'Administrateur de domaine. C\'est le principe du moindre privilège appliqué à l\'AD.' },
          { type: 'table', headers: ['Tâche déléguée', 'Groupe bénéficiaire', 'OU cible', 'Droits accordés'], rows: [
            ['Réinitialiser les mots de passe', 'GRP-HelpDesk', 'OU=Utilisateurs', 'Reset Password sur User objects'],
            ['Créer/Supprimer des utilisateurs', 'GRP-RH', 'OU=Nouveaux Arrivants', 'Create Delete User objects'],
            ['Modifier les infos utilisateur', 'GRP-RH', 'OU=Utilisateurs', 'Write sur attributs nom dept téléphone'],
            ['Gérer les comptes ordinateurs', 'GRP-Tech-Terrain', 'OU=Ordinateurs', 'Create Delete modify Computer objects'],
            ['Déverrouiller les comptes', 'GRP-HelpDesk', 'OU=Utilisateurs', 'Write lockoutTime'],
            ['Gérer les groupes de distribution', 'GRP-Secretariat', 'OU=Groupes-Distribution', 'Write Members sur Group objects'],
          ]},
          { type: 'code', content: '# ============================================================\n# DÉLÉGATION VIA ASSISTANT GRAPHIQUE\n# ============================================================\n# ADUC → Clic droit sur l\'OU → "Déléguer le contrôle"\n# 1. Ajouter les utilisateurs/groupes bénéficiaires\n# 2. Choisir les tâches à déléguer (liste prédéfinie ou personnalisée)\n# 3. Terminer\n\n# Tâches prédéfinies courantes :\n# - Créer gérer et supprimer des comptes utilisateur\n# - Réinitialiser les mots de passe utilisateur\n# - Lire toutes les informations utilisateur\n# - Créer gérer et supprimer des groupes\n# - Modifier l\'appartenance à un groupe\n\n# ============================================================\n# DÉLÉGATION VIA POWERSHELL\n# ============================================================\n\nImport-Module ActiveDirectory\n\n# Fonction utilitaire pour déléguer\nfunction Set-ADDelegation {\n    param (\n        [string]$OU,\n        [string]$Groupe,\n        [string]$Droit,\n        [string]$TypeObjet,\n        [string]$AttributGUID = "00000000-0000-0000-0000-000000000000"\n    )\n\n    $dn_ou = (Get-ADOrganizationalUnit -Filter "Name -eq \'$OU\'").DistinguishedName\n    $sid = (Get-ADGroup $Groupe).SID\n    $acl = Get-Acl "AD:\\$dn_ou"\n\n    $identite = [System.Security.Principal.IdentityReference]$sid\n    $adDroit   = [System.DirectoryServices.ActiveDirectoryRights]$Droit\n    $type      = [System.Security.AccessControl.AccessControlType]"Allow"\n    $schema    = [System.DirectoryServices.ActiveDirectorySecurityInheritance]"Descendents"\n    $objetGUID = [GUID]$AttributGUID\n\n    $regle = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(\n        $identite, $adDroit, $type, $schema, $objetGUID\n    )\n    $acl.AddAccessRule($regle)\n    Set-Acl "AD:\\$dn_ou" $acl\n    Write-Host "✓ Délégation accordée : $Groupe → $Droit sur $OU"\n}\n\n# ── Déléguer la réinitialisation des mots de passe ──\n$OU = "OU=Utilisateurs,DC=tssr,DC=local"\n$groupe_helpdesk = (Get-ADGroup "GRP-HelpDesk").SID\n\n$acl = Get-Acl "AD:\\$OU"\n\n# GUID de l\'Extended Right "Reset Password"\n$resetPwdGUID = [GUID]"00299570-246d-11d0-a768-00aa006e0529"\n# GUID de la classe User\n$userClassGUID = [GUID]"bf967aba-0de6-11d0-a285-00aa003049e2"\n\n$regle = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(\n    $groupe_helpdesk,\n    "ExtendedRight",\n    "Allow",\n    $resetPwdGUID,\n    "Descendents",\n    $userClassGUID\n)\n$acl.AddAccessRule($regle)\nSet-Acl "AD:\\$OU" $acl\nWrite-Host "✓ HelpDesk peut réinitialiser les mots de passe"\n\n# ── Déléguer le déverrouillage des comptes ──\n# GUID de l\'attribut lockoutTime\n$lockoutTimeGUID = [GUID]"28630ebf-41d5-11d1-a9c1-0000f80367c1"\n\n$regle2 = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(\n    $groupe_helpdesk,\n    "WriteProperty",\n    "Allow",\n    $lockoutTimeGUID,\n    "Descendents",\n    $userClassGUID\n)\n$acl.AddAccessRule($regle2)\nSet-Acl "AD:\\$OU" $acl\nWrite-Host "✓ HelpDesk peut déverrouiller les comptes"\n\n# ── Déléguer la création d\'utilisateurs (groupe RH) ──\n$groupe_rh = (Get-ADGroup "GRP-RH").SID\n$OU_arrivants = "OU=Nouveaux_Arrivants,OU=Utilisateurs,DC=tssr,DC=local"\n$acl_rh = Get-Acl "AD:\\$OU_arrivants"\n\n# Create et Delete sur User objects\n$regle_create = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(\n    $groupe_rh,\n    "CreateChild",\n    "Allow",\n    $userClassGUID,\n    "All"\n)\n$regle_delete = New-Object System.DirectoryServices.ActiveDirectoryAccessRule(\n    $groupe_rh,\n    "DeleteChild",\n    "Allow",\n    $userClassGUID,\n    "All"\n)\n$acl_rh.AddAccessRule($regle_create)\n$acl_rh.AddAccessRule($regle_delete)\nSet-Acl "AD:\\$OU_arrivants" $acl_rh\nWrite-Host "✓ RH peut créer/supprimer des utilisateurs dans $OU_arrivants"\n\n# ── Vérifier les délégations d\'une OU ──\nfunction Get-OUDelegations {\n    param ([string]$OUDistinguishedName)\n\n    $acl = Get-Acl "AD:\\$OUDistinguishedName"\n    $acl.Access | Where-Object {\n        $_.IsInherited -eq $false -and\n        $_.IdentityReference -notmatch "BUILTIN|NT AUTHORITY|Domain Admins|Enterprise Admins"\n    } | Select-Object IdentityReference, ActiveDirectoryRights, AccessControlType, ObjectType\n}\n\nGet-OUDelegations -OUDistinguishedName "OU=Utilisateurs,DC=tssr,DC=local" | Format-Table -AutoSize' },

          { type: 'h2', content: '2. Sites et services AD — Topologie physique' },
          { type: 'p', content: 'Les sites AD représentent la topologie physique du réseau. Ils optimisent la réplication AD (réplication dans le site = fréquente et immédiate ; entre sites = planifiée et compressée) et l\'authentification Kerberos (les clients s\'authentifient auprès du DC le plus proche).' },
          { type: 'code', content: '# ============================================================\n# CRÉER ET CONFIGURER LES SITES AD\n# ============================================================\n\n# Situation : 3 sites géographiques\n# Paris        : 192.168.1.0/24  (siège, 500 users)\n# Lyon         : 192.168.2.0/24  (agence, 100 users)\n# Marseille    : 192.168.3.0/24  (agence, 80 users)\n# Lien Paris-Lyon : 100 Mbps\n# Lien Paris-Marseille : 50 Mbps\n\n# Créer les sites AD\nNew-ADReplicationSite -Name "Site-Paris"     -Description "Siège social Paris"\nNew-ADReplicationSite -Name "Site-Lyon"      -Description "Agence Lyon"\nNew-ADReplicationSite -Name "Site-Marseille" -Description "Agence Marseille"\n\n# Vérifier\nGet-ADReplicationSite -Filter * | Select-Object Name, DistinguishedName\n\n# ── Créer les sous-réseaux et les associer aux sites ──\nNew-ADReplicationSubnet -Name "192.168.1.0/24" -Site "Site-Paris"     -Location "Paris, Bâtiment A"\nNew-ADReplicationSubnet -Name "192.168.2.0/24" -Site "Site-Lyon"      -Location "Lyon, Tour Part-Dieu"\nNew-ADReplicationSubnet -Name "192.168.3.0/24" -Site "Site-Marseille" -Location "Marseille, Vieux-Port"\n\n# Vérifier\nGet-ADReplicationSubnet -Filter * | Select-Object Name, Site, Location\n\n# ── Créer les liens de sites (Site Links) ──\n# Un Site Link définit le coût et la fréquence de réplication entre sites\n\n# Paris ↔ Lyon (100 Mbps = moins cher)\nNew-ADReplicationSiteLink \\\n    -Name "SL-Paris-Lyon" \\\n    -SitesIncluded "Site-Paris","Site-Lyon" \\\n    -Cost 100 \\\n    -ReplicationFrequencyInMinutes 15 \\\n    -InterSiteTransportProtocol IP\n\n# Paris ↔ Marseille (50 Mbps = plus cher)\nNew-ADReplicationSiteLink \\\n    -Name "SL-Paris-Marseille" \\\n    -SitesIncluded "Site-Paris","Site-Marseille" \\\n    -Cost 200 \\\n    -ReplicationFrequencyInMinutes 30 \\\n    -InterSiteTransportProtocol IP\n\n# Note : Le coût détermine le chemin de réplication\n# Si Lyon veut répliquer vers Marseille :\n# Via Paris = 100 + 200 = 300\n# Pas de lien direct = utilise Paris comme pont\n\n# Créer un lien direct Lyon ↔ Marseille si nécessaire\nNew-ADReplicationSiteLink \\\n    -Name "SL-Lyon-Marseille" \\\n    -SitesIncluded "Site-Lyon","Site-Marseille" \\\n    -Cost 250 \\\n    -ReplicationFrequencyInMinutes 60 \\\n    -InterSiteTransportProtocol IP\n\n# ── Déplacer les DCs dans leurs sites ──\n# Un DC dans le mauvais site = réplication incorrecte !\n\n# Voir les DCs et leurs sites actuels\nGet-ADDomainController -Filter * | Select-Object Name, Site, IPv4Address\n\n# Déplacer manuellement un DC vers un site\n# (normalement automatique si les sous-réseaux sont bien configurés)\nMove-ADDirectoryServer -Identity "SRV-DC-LYON" -Site "Site-Lyon"\nMove-ADDirectoryServer -Identity "SRV-DC-MARS" -Site "Site-Marseille"\n\n# ── KCC (Knowledge Consistency Checker) ──\n# Le KCC génère automatiquement la topologie de réplication\n# Il tourne toutes les 15 minutes sur chaque DC\n\n# Forcer le KCC à recalculer immédiatement\nrepadmin /kcc\n\n# Voir la topologie générée\nrepadmin /showconn\n\n# ── Planifier la réplication hors heures ouvrées ──\n# Pour un lien WAN limité, limiter la réplication aux heures creuses\n\n$siteLink = Get-ADReplicationSiteLink -Identity "SL-Paris-Lyon"\n$schedule = New-Object -TypeName System.DirectoryServices.ActiveDirectory.ActiveDirectorySchedule\n# Autoriser seulement : 0h-6h et 20h-24h du lundi au vendredi\n# Plus : samedi et dimanche toute la journée\n$schedule.ResetSchedule()\n$jours = @(1,2,3,4,5)  # Lun-Ven\nforeach ($jour in $jours) {\n    # 0h-6h\n    for ($h = 0; $h -lt 6; $h++) {\n        $schedule.SetSchedule([System.DayOfWeek]$jour, $h, 0, $h, 59)\n    }\n    # 20h-24h\n    for ($h = 20; $h -lt 24; $h++) {\n        $schedule.SetSchedule([System.DayOfWeek]$jour, $h, 0, $h, 59)\n    }\n}\n# Week-end : toujours\n$schedule.SetSchedule([System.DayOfWeek]::Saturday, 0, 0, 23, 59)\n$schedule.SetSchedule([System.DayOfWeek]::Sunday, 0, 0, 23, 59)\n\nSet-ADReplicationSiteLink -Identity "SL-Paris-Lyon" -ReplicationSchedule $schedule\nWrite-Host "✓ Planification WAN configurée"' },

          { type: 'h2', content: '3. Réplication AD — Surveillance et dépannage' },
          { type: 'code', content: '# ============================================================\n# SURVEILLANCE DE LA RÉPLICATION AD\n# ============================================================\n\n# Vue d\'ensemble de la réplication\nrepadmin /replsummary\n# Affiche pour chaque DC :\n# - Nombre de tentatives de réplication\n# - Nombre d\'échecs\n# - Dernier succès\n# Résultat idéal : 0 failing DCs\n\n# Détail de la réplication par DC\nrepadmin /showrepl SRV-DC-01\n# Affiche les partenaires de réplication et le statut\n\n# Voir tous les DCs et leur état\nrepadmin /showrepl * /csv > replication-report.csv\n\n# ── Détecter les erreurs de réplication ──\nrepadmin /showrepl * 2>&1 | Select-String -Pattern "error|fail|FAIL" | Select-Object -Unique\n\n# Erreurs de réplication courantes et leurs causes :\n# Error 1722 (RPC Server unavailable) → Réseau ou pare-feu\n# Error 1908 (Could not find DC) → DNS cassé\n# Error 8606 (Objects in lingering objects) → DC hors ligne trop longtemps\n# Error -2146893022 (Access denied) → Problème de tickets Kerberos\n# Error 8453 (Access is denied) → Droits de réplication insuffisants\n\n# ── Diagnostiquer avec DCDiag ──\ndcdiag /test:replications /v\ndcdiag /test:netlogons\ndcdiag /test:dns\ndcdiag /test:advertising   # Vérifie que le DC s\'annonce correctement\ndcdiag /test:fsmocheck     # Vérifie les rôles FSMO\ndcdiag /v                  # Tous les tests en mode verbose\n\n# ── Forcer la réplication ──\n\n# Réplication immédiate entre deux DCs spécifiques\nrepadmin /replicate SRV-DC-02 SRV-DC-01 DC=tssr,DC=local\n# Syntaxe : /replicate <destinataire> <source> <partition>\n\n# Forcer la réplication de toutes les partitions depuis un DC source\nrepadmin /syncall SRV-DC-02 /AdeP\n# /A = toutes les partitions\n# /d = identifier par DistinguishedName\n# /e = intersite également\n# /P = pousser les changements\n\n# Forcer la réplication sur TOUS les DCs\nrepadmin /syncall /AdeP\n\n# ── Vérifier que les objets sont bien répliqués ──\n# Créer un objet test et vérifier sa réplication\n$TestUser = "Test-Replication-$(Get-Date -Format yyyyMMddHHmm)"\nNew-ADUser -Name $TestUser -Enabled $false\n\nStart-Sleep -Seconds 30  # Attendre la réplication\n\n# Vérifier sur chaque DC\nGet-ADDomainController -Filter * | ForEach-Object {\n    try {\n        $found = Get-ADUser -Identity $TestUser -Server $_.HostName -ErrorAction Stop\n        Write-Host "✓ $($_.Name) : objet trouvé" -ForegroundColor Green\n    } catch {\n        Write-Warning "✗ $($_.Name) : objet NON trouvé - réplication en retard"\n    }\n}\n\n# Nettoyer l\'objet test\nRemove-ADUser -Identity $TestUser -Confirm:$false\n\n# ── Monitoring continu de la réplication ──\nfunction Watch-ADReplication {\n    while ($true) {\n        Clear-Host\n        Write-Host "=== ÉTAT RÉPLICATION AD - $(Get-Date) ===\\n"\n\n        Get-ADDomainController -Filter * | ForEach-Object {\n            $dc = $_.Name\n            $erreurs = repadmin /showrepl $dc 2>&1 | Select-String "error"\n            $lastSuccess = repadmin /showrepl $dc 2>&1 | Select-String "Last attempt.+was successful"\n\n            if ($erreurs) {\n                Write-Host "✗ $dc" -ForegroundColor Red\n                $erreurs | ForEach-Object { Write-Host "  $_ " -ForegroundColor Yellow }\n            } else {\n                Write-Host "✓ $dc - OK" -ForegroundColor Green\n            }\n        }\n\n        Start-Sleep -Seconds 300  # Vérifier toutes les 5 minutes\n    }\n}\n\n# Watch-ADReplication  # Décommenter pour activer' },
        ],
      },

      {
        id: 'approbations-trusts',
        titre: 'Approbations (Trusts) entre Domaines et Forêts',
        sections: [

          { type: 'h2', content: '1. Concepts des approbations AD' },
          { type: 'p', content: 'Une approbation (trust) permet aux utilisateurs d\'un domaine d\'accéder aux ressources d\'un autre domaine. Elle définit la relation de confiance entre domaines ou forêts.' },
          { type: 'table', headers: ['Type', 'Direction', 'Transitivité', 'Description', 'Usage'], rows: [
            ['Automatique (dans forêt)', 'Bidirectionnelle', 'Transitive', 'Créée automatiquement entre domaines d\'une même forêt', 'Communication intra-forêt'],
            ['Externe', 'Uni ou Bidirectionnelle', 'Non-transitive', 'Entre domaines de forêts différentes sans relation forêt', 'Partenariat ciblé'],
            ['Forêt', 'Bidirectionnelle', 'Transitive dans les forêts', 'Entre deux forêts entières', 'Fusion acquisition'],
            ['Raccourci', 'Uni ou Bidirectionnelle', 'Transitive', 'Optimise l\'auth dans une forêt avec plusieurs domaines', 'Performance multi-domaines'],
            ['Realm', 'Uni ou Bidirectionnelle', 'Configurable', 'Vers un domaine Kerberos non-Windows', 'Interopérabilité Linux MIT Kerberos'],
            ['PIV (Privileged Access)', 'Unidirectionnelle', 'Non-transitive', 'Forêt bastion → production (PAM)', 'Tiering model avancé'],
          ]},

          { type: 'h2', content: '2. Créer et gérer les approbations' },
          { type: 'code', content: '# ============================================================\n# CRÉER UNE APPROBATION EXTERNE\n# ============================================================\n# Scénario : TSSR.LOCAL veut accéder aux ressources de PARTENAIRE.FR\n\n# Prérequis :\n# 1. Résolution DNS mutuelle (forwarders conditionnels)\n# 2. Connectivité réseau entre les DCs\n# 3. Ports ouverts : 88 (Kerberos) 135 389 445 636 3268 49152-65535\n\n# Étape 1 : Configurer les forwarders DNS conditionnels\n# Sur tssr.local → envoyer les requêtes partenaire.fr vers leur DC\nAdd-DnsServerConditionalForwarderZone \\\n    -Name "partenaire.fr" \\\n    -MasterServers "10.10.10.10" \\\n    -PassThru\n\n# Sur partenaire.fr → envoyer les requêtes tssr.local vers notre DC\n# (à faire par l\'admin de partenaire.fr)\n\n# Vérifier la résolution DNS cross-domaine\nResolve-DnsName "dc01.partenaire.fr" -Server "192.168.1.10"\nResolve-DnsName "dc01.tssr.local" -Server "10.10.10.10"\n\n# Étape 2 : Créer l\'approbation bidirectionnelle\n# Sur le DC de tssr.local :\n$credPartenaire = Get-Credential "PARTENAIRE\\Administrateur"\n\nNetdom trust tssr.local `\n    /domain:partenaire.fr `\n    /userD:$credPartenaire.UserName `\n    /passwordD:$credPartenaire.GetNetworkCredential().Password `\n    /add `\n    /twoway `\n    /verbose\n\n# Vérifier l\'approbation\nNetdom trust tssr.local /domain:partenaire.fr /verify\nGet-ADTrust -Filter * | Select-Object Name, TrustType, TrustDirection, TrustAttributes\n\n# ── Via PowerShell (méthode moderne) ──\nAdd-ADTrust \\\n    -Source "tssr.local" \\\n    -Target "partenaire.fr" \\\n    -TrustType External \\\n    -TrustDirection Bidirectional\n\n# ============================================================\n# APPROBATION DE FORÊT\n# ============================================================\n# Scénario : Fusion avec filiale.tssr.fr (autre forêt)\n\n# Prérequis supplémentaires :\n# - Niveau fonctionnel forêt Windows Server 2003 minimum\n# - Résolution DNS bidirectionnelle\n\n# Sur tssr.local :\nAdd-ADTrust \\\n    -Source "tssr.local" \\\n    -Target "filiale.tssr.fr" \\\n    -TrustType Forest \\\n    -TrustDirection Bidirectional\n\n# Configurer le filtrage SID (sécurité)\n# Par défaut : SID Filtering activé (recommandé)\n# Désactiver seulement si nécessaire (risque de sécurité)\nNetdom trust tssr.local /domain:filiale.tssr.fr /quarantine:no\n# /quarantine:yes = activer le filtrage (défaut pour trusts externes)\n# /quarantine:no  = désactiver (forest trusts entre domaines de confiance)\n\n# ============================================================\n# ACCÈS AUX RESSOURCES CROSS-DOMAINE\n# ============================================================\n\n# Ajouter des utilisateurs de partenaire.fr à un groupe local tssr.local\nAdd-ADGroupMember \\\n    -Identity "DL-Accès-Extranet" \\\n    -Members "partenaire.fr\\u.externe"\n\n# Vérifier les utilisateurs d\'un domaine approuvé\nGet-ADUser -Filter * -Server "partenaire.fr" |\n    Select-Object Name, UserPrincipalName\n\n# Lister les groupes d\'un domaine approuvé\nGet-ADGroup -Filter * -Server "filiale.tssr.fr" |\n    Select-Object Name, GroupScope\n\n# ============================================================\n# DIAGNOSTIC DES APPROBATIONS\n# ============================================================\n\n# Vérifier l\'état des approbations\nNetdom query trust\n# Ou\nGet-ADTrust -Filter *\n\n# Tester l\'approbation\nNltest /sc_verify:partenaire.fr\n# Vérification du canal sécurisé vers le domaine approuvé\n\n# Réinitialiser le canal sécurisé (si problème d\'auth cross-domaine)\nNetdom resetpwd /server:dc01.tssr.local /userd:TSSR\\Administrateur /passwordd:*\n\n# Tester l\'authentification cross-domaine\nRuAs /user:PARTENAIRE\\u.externe cmd.exe\n\n# Événements à surveiller (ID 6 dans NETLOGON) :\nGet-EventLog -LogName System -Source "NETLOGON" -Newest 50 |\n    Where-Object Message -match "partenaire" |\n    Select-Object TimeGenerated, Message' },
        ],
      },

      {
        id: 'adfs-sso',
        titre: 'ADFS et Single Sign-On (SSO)',
        sections: [

          { type: 'h2', content: '1. Architecture ADFS' },
          { type: 'p', content: 'ADFS (Active Directory Federation Services) étend l\'identité AD vers des applications externes et le cloud via les protocoles de fédération standard (SAML 2.0, OAuth 2.0, OpenID Connect, WS-Federation).' },
          { type: 'table', headers: ['Composant', 'Rôle', 'Détail'], rows: [
            ['ADFS Server', 'Émet les tokens de sécurité (STS - Security Token Service)', 'Installé en interne accès depuis Internet via WAP'],
            ['Web Application Proxy (WAP)', 'Proxy inverse en DMZ pour ADFS', 'Filtre les requêtes avant ADFS'],
            ['Claims', 'Assertions sur l\'utilisateur dans le token', 'email nom groupes département'],
            ['Relying Party Trust', 'Application qui fait confiance aux tokens ADFS', 'Salesforce Office 365 ServiceNow'],
            ['Claims Provider Trust', 'Source d\'identité externe qui fournit des claims à ADFS', 'Azure AD Google un autre AD'],
            ['Device Registration Service', 'Enregistre les appareils pour Workplace Join', 'BYOD accès conditionnel'],
          ]},
          { type: 'code', content: '# ============================================================\n# INSTALLATION ADFS\n# ============================================================\n\n# Prérequis :\n# - Windows Server 2019/2022\n# - Certificat SSL valide pour adfs.tssr.local\n#   (doit être dans le magasin personnel de l\'ordinateur)\n# - Compte de service dédié (MSA recommandé)\n# - Le serveur doit être membre du domaine\n\n# 1. Installer le rôle ADFS\nInstall-WindowsFeature ADFS-Federation -IncludeManagementTools\n\n# 2. Créer un compte de service MSA (Group Managed Service Account)\n# Plus sécurisé qu\'un compte utilisateur classique\n# (mot de passe géré automatiquement par AD)\n\n# D\'abord créer la clé KDS (une seule fois par forêt)\nAdd-KdsRootKey -EffectiveTime (Get-Date).AddHours(-10)\n\n# Créer le gMSA\nNew-ADServiceAccount \\\n    -Name "svc-adfs" \\\n    -DNSHostName "adfs.tssr.local" \\\n    -PrincipalsAllowedToRetrieveManagedPassword "SRV-ADFS$" \\\n    -ServicePrincipalNames @("host/adfs.tssr.local","http/adfs.tssr.local")\n\n# Installer le gMSA sur le serveur ADFS\nInstall-ADServiceAccount -Identity "svc-adfs"\nTest-ADServiceAccount -Identity "svc-adfs"  # Doit retourner True\n\n# 3. Trouver le thumbprint du certificat SSL\n$cert = Get-ChildItem Cert:\\LocalMachine\\My | Where-Object Subject -like "*adfs.tssr.local*"\n$certThumbprint = $cert.Thumbprint\nWrite-Host "Thumbprint : $certThumbprint"\n\n# 4. Configurer la ferme ADFS (premier serveur)\nInstall-AdfsFarm \\\n    -CertificateThumbprint $certThumbprint \\\n    -FederationServiceDisplayName "TSSR Federation Service" \\\n    -FederationServiceName "adfs.tssr.local" \\\n    -GroupServiceAccountIdentifier "TSSR\\svc-adfs$" \\\n    -OverwriteConfiguration\n\n# Vérifier l\'installation\nGet-AdfsSslCertificate\nGet-AdfsProperties | Select-Object HostName, HttpPort, HttpsPort\nGet-AdfsEndpoint | Select-Object AddressPath, Enabled | Sort-Object AddressPath\n\n# URL ADFS importants :\n# https://adfs.tssr.local/adfs/ls/         → WS-Federation Passive\n# https://adfs.tssr.local/adfs/oauth2/     → OAuth 2.0\n# https://adfs.tssr.local/adfs/services/   → WCF endpoints\n# https://adfs.tssr.local/federationmetadata/2007-06/federationmetadata.xml → Metadata' },

          { type: 'h2', content: '2. Configuration des Relying Party Trusts' },
          { type: 'code', content: '# ============================================================\n# RELYING PARTY TRUST — CONNECTER UNE APPLICATION\n# ============================================================\n\n# ── Application SAML 2.0 (ex: Salesforce) ──\n\n# Méthode 1 : Via les métadonnées (automatique)\nAdd-AdfsRelyingPartyTrust \\\n    -Name "Salesforce" \\\n    -MetadataUrl "https://login.salesforce.com/saml/metadata" \\\n    -AutoUpdateEnabled $true \\\n    -Enabled $true\n\n# Méthode 2 : Manuellement\nAdd-AdfsRelyingPartyTrust \\\n    -Name "Application-Interne" \\\n    -Identifier "https://app.tssr.local/saml" \\\n    -SamlEndpoint @(New-AdfsSamlEndpoint -Binding POST -Protocol SAMLAssertionConsumer -Uri "https://app.tssr.local/saml/acs") \\\n    -SignatureAlgorithm http://www.w3.org/2001/04/xmldsig-more#rsa-sha256 \\\n    -Enabled $true\n\n# ── Configurer les Claims Rules (règles de transformation) ──\n# Les claims rules définissent quelles informations utilisateur\n# sont incluses dans le token envoyé à l\'application\n\n# Règle 1 : Envoyer l\'UPN comme NameIdentifier\n$rule1 = \'\n@RuleName = "Send UPN as NameID"\nc:[Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"]\n => issue(Type = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",\n          Value = c.Value,\n          Properties["http://schemas.xmlsoap.org/ws/2005/05/identity/claimproperties/format"] =\n          "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress");\n\'\n\n# Règle 2 : Envoyer les attributs LDAP\n$rule2 = \'\n@RuleName = "Send LDAP Attributes"\nc:[Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/windowsaccountname",\n   Issuer == "AD AUTHORITY"]\n => issue(store = "Active Directory",\n          types = ("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn",\n                   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",\n                   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",\n                   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",\n                   "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups"),\n          query = ";userPrincipalName,mail,givenName,sn,tokenGroups;{0}",\n          param = c.Value);\n\'\n\n# Règle 3 : Autoriser seulement le groupe IT\n$rule3 = \'\n@RuleName = "Permit IT Group Only"\n => permit(Type == "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups",\n           Value == "IT-Access");\n\'\n\n# Appliquer les règles\nSet-AdfsRelyingPartyTrust \\\n    -TargetName "Salesforce" \\\n    -IssuanceTransformRules ($rule1 + $rule2) \\\n    -IssuanceAuthorizationRules $rule3\n\n# ── Claims Provider Trust (fédération avec Azure AD) ──\n# Permettre aux utilisateurs Azure AD de se connecter via ADFS\n\nAdd-AdfsClaimsProviderTrust \\\n    -Name "Azure AD TSSR" \\\n    -MetadataUrl "https://login.microsoftonline.com/TENANT_ID/federationmetadata/2007-06/federationmetadata.xml" \\\n    -AutoUpdateEnabled $true\n\n# ============================================================\n# WEB APPLICATION PROXY (WAP)\n# ============================================================\n# Le WAP est installé dans la DMZ et proxifie ADFS depuis Internet\n\n# Sur le serveur WAP (dans la DMZ)\nInstall-WindowsFeature Web-Application-Proxy -IncludeManagementTools\n\n# Configurer le WAP\n$credentialDomaine = Get-Credential "TSSR\\Administrateur"\nInstall-WebApplicationProxy \\\n    -FederationServiceTrustCredential $credentialDomaine \\\n    -CertificateThumbprint $certThumbprint \\\n    -FederationServiceName "adfs.tssr.local"\n\n# Publier ADFS via WAP\nAdd-WebApplicationProxyApplication \\\n    -BackendServerUrl "https://adfs.tssr.local/" \\\n    -ExternalCertificateThumbprint $certThumbprint \\\n    -ExternalUrl "https://adfs.tssr.local/" \\\n    -Name "ADFS" \\\n    -ExternalPreAuthentication PassThrough\n\n# ============================================================\n# DIAGNOSTIC ADFS\n# ============================================================\n\n# Voir les tokens émis (Event ID 1200 dans Security)\nGet-WinEvent -LogName "AD FS/Admin" -MaxEvents 50 |\n    Where-Object Id -in @(1200, 1201, 1202, 1203, 1204) |\n    Select-Object TimeCreated, Id, Message | Format-List\n\n# Activer les logs de débogage\nSet-AdfsProperties -LogLevel @("FailureAudits","SuccessAudits","Information","Verbose","Warnings","Errors")\n\n# Vérifier la connectivité depuis un client\n# Ouvrir : https://adfs.tssr.local/adfs/ls/idpinitiatedsignon\n# → Doit afficher la page de connexion ADFS\n\n# Test des endpoints\nInvoke-WebRequest -Uri "https://adfs.tssr.local/adfs/ls/" -UseBasicParsing\nInvoke-WebRequest -Uri "https://adfs.tssr.local/federationmetadata/2007-06/federationmetadata.xml" -UseBasicParsing' },
        ],
      },

      {
        id: 'ad-securite-avancee',
        titre: 'Sécurité AD Avancée — Tiering, LAPS et PAM',
        sections: [

          { type: 'h2', content: '1. Modèle de Tiering Active Directory' },
          { type: 'p', content: 'Le modèle de tiering (ou modèle en couches) protège les comptes AD les plus privilegiés en isolant strictement les niveaux d\'administration. Un attaquant qui compromet un compte Tier 2 ne peut pas atteindre les Tier 0.' },
          { type: 'table', headers: ['Tier', 'Ressources gérées', 'Comptes autorisés', 'Exemples de comptes'], rows: [
            ['Tier 0 (Identité)', 'Contrôleurs de domaine ADFS PKI Azure AD Connect', 'Admins Tier 0 uniquement', 'admin-t0-jean admin-t0-marie'],
            ['Tier 1 (Serveurs)', 'Serveurs applicatifs Exchange SQL IIS', 'Admins Tier 1 uniquement', 'admin-t1-jean admin-t1-marie'],
            ['Tier 2 (Postes)', 'Postes de travail smartphones tablettes', 'Admins Tier 2 et helpdesk', 'admin-t2-jean helpdesk-paul'],
            ['(Utilisateurs normaux)', 'Applications métier email', 'Comptes utilisateurs standards', 'jean.dupont marie.martin'],
          ]},
          { type: 'warn', content: '<strong>Règle fondamentale :</strong> Un compte Tier 2 ne doit JAMAIS se connecter sur un Tier 0 ou Tier 1. Si un admin se connecte sur son poste Windows avec son compte Domain Admin pour naviguer sur Internet, un malware peut voler ses credentials et compromettre tout le domaine.' },
          { type: 'code', content: '# ============================================================\n# IMPLÉMENTER LE MODÈLE DE TIERING\n# ============================================================\n\n# 1. Créer la structure OU pour le tiering\nNew-ADOrganizationalUnit -Name "Admin" -Path "DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Tier0" -Path "OU=Admin,DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Tier1" -Path "OU=Admin,DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Tier2" -Path "OU=Admin,DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Comptes-Admin" -Path "OU=Tier0,OU=Admin,DC=tssr,DC=local"\nNew-ADOrganizationalUnit -Name "Workstations-Admin" -Path "OU=Tier0,OU=Admin,DC=tssr,DC=local"\n\n# 2. Créer les comptes d\'administration séparés\n# Jean a 3 comptes : utilisateur normal + admin serveurs + admin DCs\n\n# Compte Tier 0 (DCs uniquement)\nNew-ADUser -Name "admin-t0-jean" `\n    -SamAccountName "admin-t0-jean" `\n    -Path "OU=Comptes-Admin,OU=Tier0,OU=Admin,DC=tssr,DC=local" `\n    -Description "Compte T0 Jean Dupont - DCs uniquement" `\n    -AccountPassword (ConvertTo-SecureString "ComplexeT0!" -AsPlainText -Force) `\n    -Enabled $true\nAdd-ADGroupMember "Domain Admins" "admin-t0-jean"\n\n# Compte Tier 1 (Serveurs)\nNew-ADUser -Name "admin-t1-jean" `\n    -SamAccountName "admin-t1-jean" `\n    -Path "OU=Tier1,OU=Admin,DC=tssr,DC=local" `\n    -Description "Compte T1 Jean Dupont - Serveurs uniquement" `\n    -AccountPassword (ConvertTo-SecureString "ComplexeT1!" -AsPlainText -Force) `\n    -Enabled $true\nAdd-ADGroupMember "GRP-Admins-Serveurs" "admin-t1-jean"\n\n# Compte Tier 2 (Postes)\nNew-ADUser -Name "admin-t2-jean" `\n    -SamAccountName "admin-t2-jean" `\n    -Path "OU=Tier2,OU=Admin,DC=tssr,DC=local" `\n    -Description "Compte T2 Jean Dupont - Postes uniquement" `\n    -AccountPassword (ConvertTo-SecureString "ComplexeT2!" -AsPlainText -Force) `\n    -Enabled $true\nAdd-ADGroupMember "GRP-HelpDesk" "admin-t2-jean"\n\n# 3. GPO pour appliquer le cloisonnement\n# Empêcher les comptes Tier 0 de se connecter ailleurs que sur les DCs\n\n$GPO_T0 = New-GPO -Name "GPO-Tiering-Tier0-Restrictions"\n\n# Politique : "Refuser l\'ouverture de session locale" pour tous les users\n# SAUF les comptes Tier 0 sur les DCs\n# Chemin GPO : Computer Config → Windows Settings → Security Settings\n# → Local Policies → User Rights Assignment\n# → Deny log on locally : ajouter Domain Users, Tier1 admins, Tier2 admins\n\nNew-GPLink -Name "GPO-Tiering-Tier0-Restrictions" \\\n    -Target "OU=Domain Controllers,DC=tssr,DC=local"\n\n# 4. Authentication Policy Silos (Windows Server 2012 R2+)\n# Permet de lier des comptes à des machines spécifiques au niveau Kerberos\n\n# Créer un silo pour les admins Tier 0\nNew-ADAuthenticationPolicySilo \\\n    -Name "Silo-Tier0" \\\n    -Description "Restreint les admins T0 aux DCs" \\\n    -UserAuthenticationPolicy (New-ADAuthenticationPolicy \\\n        -Name "Policy-Tier0-Users" \\\n        -UserAllowedToAuthenticateFrom "O:SYG:SYD:(XA;OICI;CR;;;WD;(@USER.ad://ext/AuthenticationSilo == \'Silo-Tier0\'))"\n    )\n\n# Assigner le silo\nGrant-ADAuthenticationPolicySiloAccess -Identity "Silo-Tier0" -Account "admin-t0-jean"\nSet-ADUser "admin-t0-jean" -AuthenticationPolicySilo "Silo-Tier0"' },

          { type: 'h2', content: '2. LAPS — Gestion des mots de passe administrateurs locaux' },
          { type: 'code', content: '# ============================================================\n# LAPS v2 (Windows LAPS - intégré depuis 2023)\n# ============================================================\n# Windows LAPS est maintenant intégré dans Windows Server 2022\n# et Windows 11 22H2 — pas besoin d\'installer le MSI séparément\n\n# LAPS gère automatiquement le mot de passe Administrator local\n# sur chaque machine — chaque machine a un mot de passe unique\n# Stocké dans AD et accessible seulement aux personnes autorisées\n\n# ── Activer Windows LAPS dans le domaine ──\nUpdate-LapsADSchema\n\n# Configurer les permissions de lecture (qui peut voir les mots de passe)\nSet-LapsADComputerSelfPermission -Identity "OU=Workstations,DC=tssr,DC=local"\nSet-LapsADReadPasswordPermission \\\n    -Identity "OU=Workstations,DC=tssr,DC=local" \\\n    -AllowedPrincipals "GRP-HelpDesk","GRP-Admins-T2"\n\n# Configurer via GPO\n# Computer Config → Admin Templates → System → LAPS\n# - Backup directory : Active Directory\n# - Password Age Days : 30\n# - Administrator Account Name : Administrator (ou custom)\n# - Password Complexity : Large letters + small letters + numbers + special\n# - Password Length : 20\n# - Post-authentication actions : Reset password and logoff\n\n# OU via PowerShell (GPO)\n$gpo = New-GPO -Name "GPO-LAPS-Workstations"\nSet-GPRegistryValue -Name "GPO-LAPS-Workstations" \\\n    -Key "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\LAPS" \\\n    -ValueName "BackupDirectory" -Type DWord -Value 2  # 2 = AD\nSet-GPRegistryValue -Name "GPO-LAPS-Workstations" \\\n    -Key "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\LAPS" \\\n    -ValueName "PasswordAgeDays" -Type DWord -Value 30\nSet-GPRegistryValue -Name "GPO-LAPS-Workstations" \\\n    -Key "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Policies\\LAPS" \\\n    -ValueName "PasswordLength" -Type DWord -Value 20\nNew-GPLink -Name "GPO-LAPS-Workstations" \\\n    -Target "OU=Workstations,DC=tssr,DC=local"\n\n# ── Lire les mots de passe LAPS ──\n\n# Mot de passe d\'un ordinateur spécifique\nGet-LapsADPassword -Identity "PC-JEAN-01" -AsPlainText\n# ComputerName    : PC-JEAN-01\n# DistinguishedName : CN=PC-JEAN-01,OU=Workstations,...\n# Account         : Administrator\n# Password        : K#9mP!2024xZ\n# PasswordUpdateTime : 04/01/2024 10:00:00\n# ExpirationTimestamp : 03/02/2024 10:00:00\n\n# Voir tous les ordinateurs avec leur date d\'expiration\nGet-ADComputer -Filter * -SearchBase "OU=Workstations,DC=tssr,DC=local" `\n    -Properties "ms-Mcs-AdmPwdExpirationTime","ms-Mcs-AdmPwd" |\n    Select-Object Name,\n        @{N="MDP"; E={$_."ms-Mcs-AdmPwd"}},\n        @{N="Expiration"; E={[datetime]::FromFileTime([int64]$_."ms-Mcs-AdmPwdExpirationTime")}}\n\n# Forcer le renouvellement immédiat\nReset-LapsPassword -Identity "PC-JEAN-01"\n\n# ── LAPS Auditing ──\n# Activer l\'audit des lectures de mots de passe\nSet-LapsADAuditing \\\n    -Identity "OU=Workstations,DC=tssr,DC=local" \\\n    -AuditedPrincipals "GRP-HelpDesk"\n\n# Voir les logs d\'audit LAPS (Event ID 4662)\nGet-WinEvent -LogName Security | Where-Object {\n    $_.Id -eq 4662 -and $_.Message -match "ms-Mcs-AdmPwd"\n} | Select-Object TimeCreated, Message | Format-List' },

          { type: 'h2', content: '3. Détection d\'attaques AD' },
          { type: 'code', content: '# ============================================================\n# DÉTECTION DES ATTAQUES ACTIVE DIRECTORY\n# ============================================================\n\n# ── Pass-the-Hash / Pass-the-Ticket ──\n# Détecté par : Event ID 4648 (connexion avec credentials explicites)\n# et Event ID 4624 type 3 (réseau) avec des patterns anormaux\n\n# Script de détection Pass-the-Hash\nfunction Find-SuspiciousLogons {\n    param ([int]$HeuresRetour = 24)\n\n    $debut = (Get-Date).AddHours(-$HeuresRetour)\n\n    Get-WinEvent -LogName Security -FilterHashtable @{\n        Id = 4648  # Explicit credentials\n        StartTime = $debut\n    } | ForEach-Object {\n        $xml = [xml]$_.ToXml()\n        $data = $xml.Event.EventData.Data\n\n        [PSCustomObject]@{\n            Heure       = $_.TimeCreated\n            Utilisateur = ($data | Where-Object Name -eq "SubjectUserName")."#text"\n            Cible       = ($data | Where-Object Name -eq "TargetServerName")."#text"\n            UserCible   = ($data | Where-Object Name -eq "TargetUserName")."#text"\n            Process     = ($data | Where-Object Name -eq "ProcessName")."#text"\n        }\n    } | Where-Object {\n        # Filtrer les faux positifs connus\n        $_.Process -notmatch "lsass|svchost|services" -and\n        $_.UserCible -ne "Anonymous Logon"\n    }\n}\n\n# ── Kerberoasting — Attaque sur les comptes de service ──\n# Les attaquants demandent des tickets Kerberos pour les comptes avec SPN\n# Puis craquent les tickets offline\n# Détecté par Event ID 4769 (Kerberos Service Ticket Request)\n# avec EncryptionType = 0x17 (RC4 - faible)\n\nGet-WinEvent -LogName Security -FilterHashtable @{Id=4769} |\n    Where-Object {\n        $xml = [xml]$_.ToXml()\n        ($xml.Event.EventData.Data | Where-Object Name -eq "TicketEncryptionType")."#text" -eq "0x17"\n    } |\n    Select-Object TimeCreated,\n        @{N="User"; E={([xml]$_.ToXml()).Event.EventData.Data | Where-Object Name -eq "TargetUserName" | Select-Object -Expand "#text"}},\n        @{N="Service"; E={([xml]$_.ToXml()).Event.EventData.Data | Where-Object Name -eq "ServiceName" | Select-Object -Expand "#text"}}\n\n# Protéger contre Kerberoasting :\n# Utiliser des comptes de service gMSA (mot de passe 240 chars aléatoires)\n# Activer AES 256 pour Kerberos sur les comptes de service\nGet-ADUser -Filter {ServicePrincipalName -ne "$null"} |\n    Set-ADUser -KerberosEncryptionType AES128,AES256\n\n# ── DCSync — Exfiltration des hashs AD ──\n# Un attaquant simule un DC et demande les hashs de tous les utilisateurs\n# via la réplication AD (drsuapi)\n# Détecté par Event ID 4662 (opération réplication)\n\nGet-WinEvent -LogName Security |\n    Where-Object Id -eq 4662 |\n    Where-Object {\n        $msg = $_.Message\n        # Chercher les droits de réplication\n        $msg -match "1131f6aa|1131f6ad|89e95b76"  # GUIDs droits réplication\n    } | Select-Object TimeCreated, Message | Format-List\n\n# Protéger contre DCSync :\n# Surveiller qui a le droit "Replicate Directory Changes All"\n$dn = (Get-ADDomain).DistinguishedName\n$acl = Get-Acl "AD:\\$dn"\n$acl.Access | Where-Object {\n    $_.ObjectType -eq [GUID]"1131f6aa-9c07-11d1-f79f-00c04fc2dcd2" -or\n    $_.ObjectType -eq [GUID]"1131f6ad-9c07-11d1-f79f-00c04fc2dcd2"\n} | Where-Object {\n    $_.IdentityReference -notmatch "Domain Controllers|Enterprise Domain Controllers|Administrators|SYSTEM"\n} | Select-Object IdentityReference, ActiveDirectoryRights\n\n# ── Golden Ticket — Ticket Kerberos falsifié avec hash KRBTGT ──\n# Si le hash du compte KRBTGT est compromis, l\'attaquant peut créer\n# des tickets Kerberos pour n\'importe quel utilisateur\n\n# Réinitialiser le compte KRBTGT (à faire DEUX fois car 2 versions du hash)\n# ATTENTION : Tous les tickets Kerberos actifs seront invalidés\n# Planifier une fenêtre de maintenance !\n\n$KRBTGT = Get-ADUser "krbtgt" -Properties "PasswordLastSet"\nWrite-Host "Dernier reset KRBTGT : $($KRBTGT.PasswordLastSet)"\n\n# Reset 1\nSet-ADAccountPassword -Identity "krbtgt" `\n    -Reset `\n    -NewPassword (ConvertTo-SecureString ([System.Web.Security.Membership]::GeneratePassword(32,8)) -AsPlainText -Force)\n\n# Attendre la réplication (minimum 10h dans un grand environnement)\nStart-Sleep -Seconds 10\n\n# Reset 2 (nécessaire car AD garde l\'ancien et le nouveau hash)\nSet-ADAccountPassword -Identity "krbtgt" `\n    -Reset `\n    -NewPassword (ConvertTo-SecureString ([System.Web.Security.Membership]::GeneratePassword(32,8)) -AsPlainText -Force)\n\nWrite-Warning "KRBTGT réinitialisé - Vérifier que tous les services fonctionnent !"' },
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
