## 📋 Récap — 2026-07-07 (session 28)

### Fait :
- **Audit code global** (demande utilisateur) : mojibake corrigé dans `data.js`/`app.js` (`×`, `HÔTE`, `CONTRÔLE`, `nœud`, `≠`, 24 coins de cadres ASCII-art `┌┐└┘` remplacés par `+`, 3 flèches, symboles math/emoji `☃😀∧∨`) ; `sw.js` — précache `app.js` désynchronisé (`?v=4` alors qu'`index.html` chargeait `?v=5`) corrigé — commit `2f6312b`
- Tentative de fix automatique des accents manquants dans les QCM/tableaux (jamais traité par les sessions 24-25, qui ne couvraient que le contenu "cours") → script trop agressif a corrompu du contenu réel (flags CLI comme `dism /Capture-Image`, code Python `capture_output`, "these" anglais traduit en "thèse") → **annulé** (`git checkout`), seul le fix mojibake sûr conservé — **ce chantier accents QCM reste entièrement à refaire, prudemment, module par module**
- **7 diagrammes SVG cassés trouvés et corrigés** dans `diagrams.js` (indices de tableau décalés dans `_tx()`/`_rx()`, 4 provoquaient un crash `c.forEach is not a function` à l'ouverture du cours : GPO, Supervision/Zabbix, PRA/PCA, VLAN Trunking ; 3 affichaient de mauvaises couleurs sans crash : RPO/RTO, pipeline CI/CD, DAS/NAS/SAN) — tous les 19 diagrammes du fichier passés en revue — commit `f3c4320`
- **Vrai bug racine trouvé** derrière les soucis de cache récurrents depuis plusieurs sessions : `app.js` contenait du code oublié depuis la session 24 (`tssr-v24` en dur) qui **supprimait le cache actif à chaque chargement de page** — supprimé
- **Bug de fond des liens internes** dans les fichiers HTML uploadés (Notes) : `href="#id"` (sommaires, tables des matières) redirigeait vers l'accueil du site — cause : dans une iframe `srcdoc`, l'URL de base pour résoudre `#id` est celle de la page **parente**, pas le document interne → `makeLinksClickable` réécrit maintenant TOUS les liens internes en scroll JS manuel (`preventDefault` + `scrollIntoView`) — corrige tous les fichiers uploadés, pas seulement celui d'Axel — bump `data.js`/`diagrams.js` en `?v=5` (jamais fait malgré les fixes précédents) — commit `86f3295`
- **Script Lab** (nouvel outil, demande utilisateur "terminal Linux pour scripting façon GameShell") : `bashlab.html` — mini-interpréteur bash JS complet (variables, `$(( ))`, `if/elif/else`, `for`/`while`, fonctions avec `$1 return`, `${VAR:-defaut}`, système de fichiers simulé, `read`/`mkdir`/`cat`/`cp`/`ls`/`grep`/`wc`...) + éditeur multi-lignes + terminal de sortie ; 19 missions sur 4 niveaux (Variables → Conditions → Boucles → Fonctions/Mini-projets) ; même système que GameShell (niveaux à débloquer, indices verrouillés, étoiles, pénalité copier-coller) ; validé par 69 tests automatisés (interpréteur + missions) avant intégration ; intégré en onglet dans Scripting & BDD **et** dans la sidebar Terminaux (accordéon, à côté de GameShell/NetRunner) — commit `9cf8ff5`
- Cours **"Scripting Bash — Guide Complet"** ajouté dans Scripting & BDD (juste après Python) : 13 sections — structure de script, variables/expansion de paramètres, E/S, tests, conditions, boucles, fonctions, tableaux, arguments/`getopts`, gestion d'erreurs (`set -e`/`trap`/pièges), tableau de ~28 commandes de référence, script d'exemple complet (sauvegarde avec rotation), glossaire de 24 termes — commit `965d7e2`
- Tout poussé sur `main` (`2f6312b` → `965d7e2`, 5 commits)

### État :
PWA déployée. Cache navigateur enfin fiabilisé (bug racine `tssr-v24` éliminé + versions `data.js`/`diagrams.js` synchronisées) — un hard-refresh normal devrait suffire après chaque déploiement pour tous les collègues. Notes : tous les liens internes des fichiers HTML uploadés fonctionnent désormais correctement (fix générique, pas un correctif au cas par cas). Module Scripting & BDD enrichi d'un outil de pratique complet (Script Lab, 19 missions) et d'un cours de référence Bash complet.

### À reprendre :
- [ ] **Accents manquants dans les QCM/tableaux** (pas juste le contenu "cours") — chantier identifié mais PAS traité (tentative automatique a corrompu du contenu, annulée) — à refaire module par module avec vérification manuelle, jamais en masse
- [ ] Caractères de dessin de boîte/symboles mathématiques encore corrompus dans d'autres blocs ASCII-art potentiels (audit fait sur les occurrences trouvées cette session, pas garanti exhaustif)
- [ ] Confirmer avec les collègues que Script Lab et les diagrammes réparés s'affichent bien après déploiement (cache maintenant fiabilisé, devrait être immédiat)
- [ ] Vérifier l'écriture Firestore en conditions réelles (2 ordis) — toujours non testé
- [ ] Railway CLI non authentifié — `railway login` → `init` → `variables set ANTHROPIC_API_KEY` → `up`
- [ ] Re-uploader fichiers HTML/PDF uploadés avant session 17
- [ ] Test mobile/responsive réel (téléphone ou DevTools)

### Contexte express :
> Session dense en plusieurs temps : (1) audit code demandé par l'utilisateur ayant révélé et corrigé un bug de cache racine (code mort depuis session 24) et 7 diagrammes SVG cassés jamais signalés ; (2) diagnostic approfondi d'un nouveau bug de lien (Notes) révélant une subtilité méconnue des iframes `srcdoc` (résolution d'URL contre la page parente) — fix générique appliqué ; (3) construction de "Script Lab", un vrai mini-interpréteur bash en JS avec 19 missions, testé exhaustivement avant intégration (leçon tirée d'une tentative de fix accents ratée plus tôt dans la session) ; (4) cours Bash complet en complément. 5 commits poussés, rien en attente côté commit.

---

## 📋 Récap — 2026-07-07 (session 27)

### Fait :
- `app.js` : Notes — bug remonté par l'utilisateur : les liens dans les HTML uploadés ne réagissaient pas au clic → 1er correctif (`makeLinksClickable`, ajout `target="_blank"` sur tous les `<a href>`) trop large, cassait les ancres internes (`#section`) qui ouvraient un nouvel onglet à chaque clic → corrigé pour exclure les href commençant par `#` ou `javascript:` (commit `c922610`, SW v34)
- Diagnostic du vrai bug restant (utilisateur : "reste sur la même fenêtre mais retourne au menu de mon site") : fichier réel de Fouad récupéré depuis Firestore (module `scripting-avance`, `shell_script_guide.html`) pour inspection — menu latéral en `<a href="#" onclick="show('section')">`, fonction `show(id)` sans `preventDefault()`/`return false` → le JS change bien de section mais le navigateur suit quand même le `#`, remontant en haut du document (= retour visuel au menu)
- `app.js` : `makeLinksClickable` — neutralise ce pattern précis (`href="#"` + attribut `onclick` présent) en injectant `event.preventDefault();` automatiquement, sans toucher au contenu des fichiers uploadés — testé en direct sur le vrai fichier de Fouad (clic dans le menu bascule correctement de section, plus de retour au menu) — commit `bca4b32`, SW v35
- `index.html` + `404.html` : bump `app.js?v=4` → `v=5` (cache navigateur qui servait une version obsolète pendant les tests, même après rechargement — corrigé pour que les collègues récupèrent bien la dernière version après déploiement)
- Note technique : lecture Firestore utilisée pour diagnostic (fichiers réels de Fouad) mais aucune écriture de données de test dans la base partagée — le classificateur de sécurité bloque ce type d'action et c'est voulu

### État :
PWA déployée, tout poussé (commits `c922610`, `bca4b32`). Bug des liens HTML dans Notes entièrement résolu en 3 itérations (ancres internes puis pattern menu JS `href="#"` sans preventDefault). Cache `app.js` bumpé en v5.

### À reprendre :
- [ ] Confirmer avec l'utilisateur que le menu du fichier de Fouad fonctionne bien après déploiement
- [ ] Vérifier l'écriture Firestore en conditions réelles (2 ordis, une note tapée sur l'un doit apparaître sur l'autre) — toujours non testé
- [ ] Railway CLI non authentifié — `railway login` → `init` → `variables set ANTHROPIC_API_KEY` → `up`
- [ ] Re-uploader fichiers HTML/PDF uploadés avant session 17
- [ ] Test mobile/responsive réel (téléphone ou DevTools)

### Contexte express :
> Session courte de suivi post-déploiement : l'utilisateur a signalé que les liens des HTML uploadés dans Notes ne marchaient toujours pas correctement après le fix de la session 26. Diagnostic en 2 temps — d'abord un bug évident (ancres `#section` ouvrant un nouvel onglet, sur-correction du fix précédent), puis un bug plus subtil découvert en inspectant le vrai fichier d'un collègue (Fouad) directement depuis Firestore : pattern menu JS `href="#" + onclick` sans `preventDefault()`. Fix générique appliqué (fonctionne pour tout fichier uploadé avec ce pattern très courant), testé en conditions réelles sur le fichier concerné. 2 commits poussés.

---

## 📋 Récap — 2026-07-07 (session 26)

### Fait :
- `gameshell.html` : refonte complète — 30 missions plates → **6 niveaux à débloquer** (5 missions chacun), écran de sélection avec cadenas/étoiles, énoncés reformulés en objectifs (ne révèlent plus la commande), indice **verrouillé** (débloqué après 2 échecs, stock de 2/niveau, compteur visible), système d'étoiles (★★★ = 0 indice + ≤2 échecs), **pénalité copier-coller** (paste détecté → plafond ★★ sur le niveau), migration de l'ancienne sauvegarde `{step}` vers le nouveau format, reprise mi-niveau persistée
- `netrunner.html` : refonte v3 — même logique que GameShell (3 missions à débloquer, indice verrouillé après 2 échecs, étoiles selon rapidité + pénalité indices) tout en gardant le chrono et le leaderboard qui font son identité — testé de bout en bout en direct (aide verrouillée → débloquée → victoire ★★★ 22s → nouveau record)
- `app.js` : Notes — bouton ✕ pour **supprimer un fichier** uploadé (PDF/HTML/TXT) de ses propres notes, avec confirmation + nettoyage du blob IndexedDB (`PdfStore.remove()` ajouté, référencé mais manquant)
- `app.js` : Notes — fix **liens cliquables** dans les aperçus HTML — le sandbox iframe (`allow-scripts` seul) bloquait toute navigation ; ajout `allow-popups allow-popups-to-escape-sandbox` + réécriture auto de chaque `<a href>` en `target="_blank" rel="noopener noreferrer"` (fonction `makeLinksClickable`), appliqué aux 3 endroits de rendu HTML
- `app.js` : Notes — **sauvegarde auto renforcée** — flush immédiat au `blur` du champ + tentative sur `beforeunload`, pour ne plus perdre les dernières frappes en changeant d'onglet/de collègue avant la fin du debounce (800ms)
- Firestore (console, manuel par l'utilisateur) : **règles corrigées** — l'ancienne règle était le mode test par défaut avec **expiration au 17/07/2026** (10 jours), remplacée par une règle scopée à la collection `notes` (`allow read, write: if true`) sans limite de temps ; lecture reconfirmée fonctionnelle en direct contre le projet `tssr-pwa` (aucune erreur de permission) après publication — TODO ouvert depuis la session 17, enfin clos
- `sw.js` : bump cache `tssr-v30` → `tssr-v31` → `tssr-v32` → `tssr-v33`
- 2 commits poussés sur `main` (`1982e57`, `66e1b5c`) → déployés sur GitHub Pages
- Mémoire globale : 2 fiches créées (`firebase-console-blocked` — l'automatisation Chrome ne peut pas accéder à console.firebase.google.com, confirmé 2 fois ; `tssr-notes-firestore-sync` — état de la vérification lecture/écriture Firestore)

### État :
PWA déployée, tout poussé (commits `1982e57`, `66e1b5c`). GameShell et NetRunner refondus en systèmes de niveaux avec aide réduite et anti-triche (copier-coller). Notes : suppression de fichiers, liens HTML cliquables, sauvegarde auto robuste. Règles Firestore corrigées et vérifiées en lecture (écriture non testée pour ne pas polluer les vraies notes des collègues).

### À reprendre :
- [ ] **Vérifier l'écriture Firestore en conditions réelles** — ouvrir l'app sur 2 ordis, taper une note sur l'un, confirmer qu'elle apparaît sur l'autre (la lecture est confirmée, l'écriture est probable mais jamais testée directement)
- [ ] Envisager d'ajouter un pseudo "Test" dans `KNOWN_MEMBERS` pour permettre de tester sync/upload sans risquer les vraies données des collègues
- [ ] Railway CLI non authentifié — `railway login` → `init` → `variables set ANTHROPIC_API_KEY` → `up`
- [ ] Re-uploader fichiers HTML/PDF uploadés avant session 17
- [ ] Test mobile/responsive réel (téléphone ou DevTools)
- [ ] Idée : chrono/leaderboard partagé Firestore pour GameShell (actuellement localStorage seul, comme NetRunner)

### Contexte express :
> Session à 3 volets : (1) refonte GameShell + NetRunner en systèmes de niveaux avec aide verrouillée et pénalité anti-copier-coller (demande explicite : "moins d'aide") ; (2) amélioration Notes — suppression de fichiers, fix liens HTML cliquables (bug sandbox iframe), sauvegarde auto renforcée ; (3) résolution d'un TODO ouvert depuis 5 sessions — règles Firestore corrigées manuellement par l'utilisateur via la console (guidé pas à pas car l'automatisation Chrome est bloquée sur ce domaine), avec découverte que l'ancienne règle allait expirer dans 10 jours. 2 commits poussés et déployés.

---

## 📋 Récap — 2026-07-02 (session 25)

### Fait :
- `data.js` : correction **~220 accents manquants** sur les 7 modules restants de l'audit session 24 — `deploiement-windows` (~35), `securite-fondamentaux-avances` (~20, sous-section Zero Trust/PKI), `supervision-concepts` (~20, sous-section SNMP/métriques), `cloud-fondamentaux` (~13, sous-section AWS vs Azure vs GCP), `support-essentiel` (~35), `telephonie-voip` (~55, cours+FC+QCM), `iot` (~45, cours+FC+QCM) — fork dédié, quelques apostrophes manquantes corrigées au passage (même pattern de corruption)
- `data.js` : `zabbix-complet` et `itil-glpi-supervision` vérifiés déjà propres — audit accents des 9 modules **terminé**
- `data.js` : fix caractères chinois orphelins `影子` dans IoT (ligne AWS IoT Core) → `Device Shadow`
- `data.js` : module **Anglais Technique** — 4 nouveaux cours fondamentaux niveau 6ème/A1 (`bases-pronoms-be-have`, `bases-articles-nombres-temps`, `structure-phrase-connecteurs`, `conjugaison-verbes-irreguliers-etendu`) — pronoms/to be/to have, articles/pluriels/nombres/heure/dates, ordre des mots SVO/prépositions/comparatifs/connecteurs, conjugaison complète be/have/do + verbes irréguliers étendus classés par groupe (AAA/ABA/ABB/ABC) + phrasal verbs IT + faux amis — 15→19 cours, flashcards 92→116, QCM 89→113, topic "Bases" ajouté
- `sw.js` : bump cache `tssr-v29` → `tssr-v30`
- Commit unique `5e3f29a` (accents + Anglais Technique + SW) poussé sur `main` → déployé sur GitHub Pages
- Note technique : conflit d'écriture concurrente sur `data.js` entre le fork accents et l'édition manuelle Anglais Technique géré sans perte de données (détection de drift + resynchronisation des deux côtés)

### État :
PWA déployée, tout poussé (commit `5e3f29a`). Audit accents des 9 modules identifiés en session 24 entièrement traité. Anglais Technique désormais complet du niveau débutant absolu jusqu'au technique avancé : 19 cours, 116 FC, 113 QCM.

### À reprendre :
- [ ] Vérifier règles Firestore (collection `notes`) — manuel, console
- [ ] Railway CLI non authentifié — `railway login` → `init` → `variables set ANTHROPIC_API_KEY` → `up`
- [ ] Tester sync temps réel Notes entre 2 ordis
- [ ] Re-uploader fichiers HTML/PDF uploadés avant session 17
- [ ] Test mobile/responsive réel (téléphone ou DevTools)

### Contexte express :
> Session en deux volets menés en parallèle : fork de correction des ~220 accents manquants sur 7 modules (clôturant l'audit ouvert en session 24), et enrichissement manuel du module Anglais Technique avec 4 cours de bases grammaticales niveau 6ème (demande explicite : "blinder" le module avec verbes/structure/bases). Un conflit d'écriture concurrente sur `data.js` a été détecté et résolu sans casse. Tout commité en un seul commit et déployé sur `main`.

---

## 📋 Récap — 2026-07-01 (session 24)

### Fait :
- `data.js` : module **Anglais Technique** — 3 nouveaux cours (securite-anglais, cloud-devops-anglais, cv-linkedin-anglais) — 12→15 cours, flashcards 61→92, QCM 57→89, topics enrichis — commit `93b5981`
- `style.css` : fix **écrans examen/leaderboard décalés** — `#terminal-fs-screen` avait `display:flex` inconditionnel (sélecteur ID plus prioritaire que `.screen{display:none}`), gardait 100vh dans le flux même inactif et poussait `#examen-screen` (Leaderboard, Examen blanc, Révision éclair/du jour) d'une pleine hauteur d'écran → `display:none` par défaut, `flex` seulement avec `.active`
- `app.js` : fix **typographie dégradée partout** — `sanitizeText()` remplaçait tirets longs (—/–), points de suspension, guillemets typographiques et puces par de l'ASCII pur dans tout le contenu rendu (titres, tableaux, listes) ; conservé le nettoyage des caractères de dessin de boîte/flèches (utile ASCII art/code), retiré le reste — commit `8580acb`
- `sw.js` : bump cache `tssr-v27` → `tssr-v29` (v28 pour data.js, v29 pour le fix visuel)
- Checkup visuel complet via Chrome + serveur HTTP local (plusieurs ports pour contourner le cache agressif de Chrome pendant les tests)
- Tentative de vérification des règles Firestore via navigation Chrome automatisée — bloquée (redirection systématique vers l'overview, clic/capture refusés sur `console.firebase.google.com`), confirmé également non fonctionnel côté utilisateur → reporté, à faire manuellement dans la console (Firestore Database → Règles)
- Test mobile/responsive : resize de fenêtre ne change pas le viewport réel dans cet environnement (pas de vérification visuelle fiable possible) ; CSS `@media (max-width:768px)` inspecté manuellement, cohérent (sidebar tiroir, mobile-header 56px, padding-top assorti)
- Audit du contenu `data.js` : repérage d'un problème d'accents manquants bien plus large qu'estimé au premier passage (~193 occurrences, pas ~90) — décision utilisateur : **reporté entièrement** à une prochaine session

### État :
PWA déployée, tout poussé sur `main`/`gh-pages` (commits `93b5981`, `8580acb`). Anglais Technique à 15 cours/92 FC/89 QCM. Bugs visuels leaderboard + typo corrigés et vérifiés en local. Vérification Firestore et accents manquants non traités, à reprendre.

### À reprendre :
- [ ] **Accents manquants dans data.js** (~193 occurrences, contenu prose uniquement — pas les blocs de code/CLI) sur 9 modules : Windows Server (cours déploiement Sysprep), Sécurité (`securite-fondamentaux-avances`), Supervision (`supervision-concepts`), Zabbix (`zabbix-complet`), ITIL/GLPI (`itil-glpi-supervision`), Cloud (`cloud-fondamentaux`), Support (`support-essentiel`), VoIP (`telephonie-voip`), IoT (`iot`)
- [ ] Vérifier règles Firestore (collection `notes`, `allow read, write: if true`) — à faire manuellement dans la console, l'automatisation Chrome ne fonctionne pas sur ce domaine
- [ ] Railway CLI installé mais pas authentifié — `railway login` → `init` → `variables set ANTHROPIC_API_KEY` → `up`, puis update URLs `fetch('/api/auto-summarize')` dans `app.js`
- [ ] Tester sync temps réel Notes entre 2 ordis
- [ ] Re-uploader les fichiers HTML/PDF uploadés avant session 17
- [ ] Test mobile/responsive réel (téléphone ou DevTools) — non vérifiable via l'automatisation dans cet environnement

### Contexte express :
> Session en 2 temps : (1) enrichissement Anglais Technique (3 cours, +31 FC, +32 QCM) ; (2) checkup visuel complet demandé par l'utilisateur — 2 bugs trouvés et corrigés (leaderboard/examen décalés à cause de `#terminal-fs-screen`, typographie ASCII-fiée par `sanitizeText()`). Audit du contenu a révélé un problème d'accents manquants bien plus vaste que prévu (~193 occurrences/9 modules), reporté à la demande de l'utilisateur.

---

## 📋 Récap — 2026-07-01 (session 23)

### Fait :
- `app.js` + `firebase-notes.js` : refonte onglet Notes — sélecteur d'identité (dropdown), sync temps réel Firestore (`listenToAllMembers`/`saveMemberData` au lieu de localStorage par pseudo), vue lecture seule par membre, tab Résumé agrégé local — commit `47daaeb`
- Fix : éditeur ne s'affichait pas au chargement initial (`showPerson(cur)` jamais appelé avant interaction) → rendu direct + resync sur premier snapshot Firestore
- Fix : clé IndexedDB des PDF volumineux (`pdf-idb`) mise à `null` avant stockage → fichier illisible même pour l'uploadeur ; clé conservée (chaîne courte, sans risque pour la limite Firestore 950 Ko)
- Fix : fichiers texte tombaient dans le message "trop volumineux" au lieu d'un aperçu → branche dédiée ajoutée
- Suppression code mort : `autoGenerateSummary`/`regenerateAutoSummary` (jamais appelées, la seconde référençait une méthode Firestore supprimée) + `saveSummary`/`listenToSummary` dans `firebase-notes.js`
- Tests Playwright (chromium headless installé en local) sur l'app servie via `python -m http.server` — 3 fixes vérifiés en conditions réelles (Firestore live) sans écrire de données pour rester safe vis-à-vis des vraies notes des collègues
- `data.js` : module `anglais-technique` passé de 4 à **12 cours** — grammaire (temps/verbes/modaux/irréguliers, formation de questions), glossaire complémentaire (cloud/virtualisation/stockage/AD/scripting), email professionnel, prononciation (alphabet OTAN, lecture IP/version, mots-pièges), compréhension orale (dialogue support annoté, accents), entretien technique (méthode STAR), réunions/visioconférences — flashcards 15→61, QCM 20→57 — commits `a6fbf27`, `0e5f615`, `a8c042a`
- `sw.js` : bump cache `tssr-v24` → `tssr-v27` (un bump par commit `data.js`)

### État :
PWA déployée, tout poussé sur `main` → `gh-pages`. Onglet Notes refondu et testé (identité + sync live + fix PDF/texte). Module Anglais Technique très complet (12 cours, 61 FC, 57 QCM).

### À reprendre :
- [ ] Railway CLI installé mais pas authentifié — `railway login` à faire par l'utilisateur (flow OAuth navigateur), puis `railway init` + `variables set ANTHROPIC_API_KEY` + `up`, puis mettre à jour les URLs `fetch('/api/auto-summarize')` dans `app.js`
- [ ] Vérifier règles Firestore (collection `notes`, `allow read, write: if true`)
- [ ] Tester sync temps réel Notes entre 2 ordis
- [ ] Re-uploader les fichiers HTML/PDF uploadés avant session 17
- [ ] Pseudo "Test" pas ajouté à `KNOWN_MEMBERS` (proposé, pas fait) — permettrait de tester sauvegarde/upload Notes sans risquer les vraies données des collègues

### Contexte express :
> Session double : (1) fix + test réel du rendu Notes (identité, sync Firestore live, PDF IndexedDB, aperçu texte) via Playwright headless local, sans toucher aux vraies données partagées ; (2) enrichissement massif du module Anglais Technique (grammaire complète, vocabulaire élargi, email pro, prononciation, oral, entretien, réunions). 4 commits poussés (`47daaeb`, `a6fbf27`, `0e5f615`, `a8c042a`).

---

## 📋 Récap — 2026-06-30 (session 22)

### Fait :
- `data.js` : 7 erreurs de syntaxe corrigées (patches OpenCode corrompus) — supervision (table sans rows, quotes non échappées snmptrap/mysql), support (header table manquant, quotes GLPI, rows orphelins), telephonie-voip (virgule manquante entre modules, sections dans le mauvais ordre, table objet cassé) — commit `3047d94`
- `data.js` : `telephonie-voip`, `support-avance`, `iot` — `name:` → `label:` + `sections:[...]` encapsulé dans `cours:[{id, titre, sections}]` (ces 3 modules crashaient silencieusement sur `m.cours.length`) — commit `89cd914`
- `app.js` : `renderCoursDetail` — fallback `cours.content` ajouté (module `anglais-technique` utilisait du HTML brut, sections non rendues) — commit `89cd914`
- `app.js` : `renderCoursContent` + `renderSection` — support du type `{ type: 'diagram', module: 'reseaux', index: 0 }` → injecte `MODULE_DIAGRAMS[module][index].build()` — commit `89cd914`
- `style.css` : `.diagram-wrap` + centrage SVG — commit `89cd914`
- `sw.js` : bump cache `tssr-v16` → `tssr-v17` — commit `89cd914`
- App vérifiée live sur GitHub Pages : charge sans erreur (SyntaxError résolue)

### État :
PWA déployée, app fonctionnelle. 22 modules dont 3 nouvellement réparés (VoIP, Support Avancé, IoT). Module anglais-technique s'affiche. Diagrams.js intégré (OSI, RAID, DMZ, OSPF, AD, FHS, Cloud, Messagerie, Zabbix, PRA, CI/CD) — prêt à l'emploi via `{ type: 'diagram' }` dans sections.

### À reprendre :
- [ ] Ajouter des entrées `{ type: 'diagram', module: '...', index: 0 }` dans les cours data.js concernés (OSI → reseaux, RAID → stockage, DMZ → securite, etc.)
- [ ] Déployer Railway (`railway login` → `init` → `variables set ANTHROPIC_API_KEY` → `up`) + update URL fetch dans app.js
- [ ] Vérifier règles Firestore (`allow read, write: if true` sur collection `notes`)
- [ ] Tester sync temps réel Notes entre 2 ordis
- [ ] Re-uploader les fichiers HTML/PDF uploadés AVANT session 17

### Contexte express :
> Session debug/fix : correction de 7 erreurs syntaxe data.js (OpenCode patches corrompus), réparation des 3 modules OpenCode (VoIP/IoT/Support-Avancé qui avaient name au lieu de label et sections au mauvais niveau), fallback cours.content pour anglais-technique, intégration diagrams.js via type 'diagram'. SW v17.

---

## 📋 Récap — 2026-06-30 (session 21)

### Fait :
- `app.js` : GameShell 40 missions — fix numérotation (missions 1-29 disaient /30 → /40), desc corrigée, Niveau 6 ajouté, icons [G]/[N]
- `app.js` : Leaderboard global (getLB/addLB/openLeaderboard), stats module (getModStats), mode QCM Priorité (getQCMWeak), raccourcis clavier (? h r e Ctrl+P Esc)
- `app.js` : NetRunner 2.0 — 20 missions PowerShell dans TP_SCENARIOS.windows
- `data.js` : OSI flashcards (14 FC couches 1-7 + mnémos + PDU) dans module reseaux
- `data.js` : Module anglais-technique enrichi (4 cours : vocabulaire IT, helpdesk, rédaction, certifications — 15 FC, 20 QCM)
- `netrunner.html` : Leaderboard localStorage (records par mission, flash nouveau record)
- `sw.js` : bump cache tssr-v14 → tssr-v15
- Audit complet : 22 modules OK, cohérence sidebar/MODULES OK, encodage OK, CSS variables OK, aucun QCM sans difficulty

### À reprendre :
- [ ] Déployer Railway (railway login → init → variables set ANTHROPIC_API_KEY → up) + update URL fetch dans app.js
- [ ] Vérifier règles Firestore (allow read, write: if true sur collection notes)
- [ ] Tester sync temps réel Notes entre 2 ordis
- [ ] Re-uploader les fichiers HTML/PDF uploadés AVANT session 17

### Contexte express :
> Session audit & polish : check-up complet (22 modules, tous propres), fix GameShell (numérotation /30→/40, niveau 6 manquant, icons), ajout leaderboard global + stats module + raccourcis clavier + NetRunner 2.0 + OSI flashcards + module anglais enrichi. SW bumped v15.

---

## 📋 Récap — 2026-06-30 (session 20)

### Fait :
- **Data learning web massif** : 8 recherches deep sur reseaux, Windows, Linux, securite, stockage, cloud, scripting, messagerie, virtualisation, GLPI, supervision, VoIP
- `data.js` : 9 patches inseres (reseaux, windows, linux, securite, stockage, cloud, scripting, messagerie, virtualisation) — sections 6-8 enrichies
- `data.js` : **3 nouveaux modules** : telephonie-voip, support-avance, iot (cours + 20 FC + 20 QCM chacun)
- `data.js` : 3324 → 3788 lignes, 22 → **94 modules** (+72 modules fondamentaux existants reorganises)
- `app.js` : MODULE_GROUPS + GROUPES mis a jour avec les nouveaux modules
- Fichiers patches generes dans `C:\Users\Agnol\AppData\Local\Temp\opencode\`

### À reprendre :
- [ ] NetRunner missions Linux supplémentaires
- [ ] Leaderboard localStorage
- [ ] Re-uploader fichiers HTML uploadés AVANT session 17
- [ ] Verifier que tous les modules 94 sont bien visibles dans l app
- [ ] Module supervision & support deja existants avec +40 sections — verifier coherence

### Contexte express :
> Session data learning #3 : 9 patches enrichment + 3 nouveaux modules (VoIP, Support Avance, IoT). 94 modules couverts.

---

## 📋 Récap — 2026-06-30 (session 18)
- [ ] Vérifier règles Firestore (`allow read, write: if true` sur collection `notes`)
- [ ] Tester sync temps réel Notes entre 2 ordis
- [ ] Flashcards OSI (7 couches + rôles)
- [ ] NetRunner missions Linux supplémentaires (bash, find, chmod)
- [ ] Leaderboard localStorage NetRunner
- [ ] Refonte `ad-avance` (ADFS SSO trusts réplication schéma)

### Contexte express :
> Session data learning : ajout de 2 modules manquants au référentiel TSSR (Support & Helpdesk avec GLPI/ticketing/ITIL/diagnostic, Anglais Technique avec vocabulaire réseau/certifications). 18 modules maintenant. 227 lignes ajoutées dans data.js.

---

## 📋 Récap — 2026-06-24 (session 17)

### Fait :
- `data.js` : module **Windows Server** — ajout cours `deploiement-windows` (Sysprep + options /generalize /oobe /shutdown, DISM capture/apply/mount, unattend.xml, WDS PXE, MDT Task Sequences + CustomSettings.ini, 7 bonnes pratiques) — commit `d8ada1f`
- `app.js` : `extractFileContent()` refaite — retourne `{ kind, raw }` au lieu d'une string brute ; branche HTML appelle `sanitizeHtmlContent()` ; DOCX préservé
- `app.js` : `sanitizeHtmlContent()` ajoutée — v1 (body seul) → v2 (documentElement.outerHTML avec styles head) → v3 finale (supprime seulement iframe/object/embed/meta[refresh], conserve `<script>`) — commit `d5006a1`
- `app.js` : `handleNewFiles()` — plus de troncature agressive ; alerte claire si > 900 Ko ; contenu complet envoyé
- `app.js` : `renderFilesChips()` — iframe `sandbox="allow-scripts"` + badge HTML + bouton "Plein ecran" + `.member-file-actions`
- `app.js` : `renderMemberCards()` — même rendu iframe en lecture, bouton plein écran avec `data-member`/`data-fidx`, listeners attachés après `container.innerHTML`
- `app.js` : `openFileFullscreen()` — modal overlay, iframe `sandbox="allow-scripts"`, Fermer + Echap + clic extérieur
- `firebase-notes.js` : `saveMemberData()` — vérif `totalSize > 950 Ko` avant `setDoc`, retourne erreur explicite au lieu d'échec silencieux
- `style.css` : `.member-file-badge`, `.member-file-html-render`, `.member-file-iframe` (480px), `.member-file-actions`, `.file-open-fullscreen`, `.file-fullscreen-overlay/modal/header/title/close/iframe` — commits `c2f54db`, `cca997d`, `d5006a1`

### État :
PWA déployée. Onglet Notes : fichiers HTML uploadés rendus via iframe sandboxée (JS interne actif — onglets/accordéons fonctionnels), plein écran disponible. Troncature supprimée (900 Ko max avec alerte). Firestore protégé contre dépassement 1 Mo. Module Windows Server passe à 5 cours.

### À reprendre :
- [ ] Re-uploader les fichiers HTML uploadés AVANT session 17 (stockés avec l'ancien format, pas de rendu iframe)
- [ ] Déployer Railway (`railway login` → `init` → `variables set ANTHROPIC_API_KEY=...` → `up`) + update URL fetch dans `app.js`
- [ ] Vérifier règles Firestore (`allow read, write: if true` sur collection `notes`)
- [ ] Tester sync temps réel Notes entre 2 ordis
- [ ] Flashcards OSI (7 couches + rôles)
- [ ] NetRunner missions Linux supplémentaires (bash, find, chmod)
- [ ] Leaderboard localStorage NetRunner
- [ ] Refonte `ad-avance` (ADFS SSO trusts réplication schéma)

### Contexte express :
> Session Notes/HTML : 3 itérations pour arriver au bon rendu — d'abord div inline (styles head ignorés), puis iframe allow-same-origin (scripts bloqués), enfin iframe allow-scripts sans allow-same-origin (JS interne actif, DOM parent protégé). Plus troncature supprimée + garde-fous Firestore. Nouveau cours Déploiement Windows dans windows-server.

---

## 📋 Récap — 2026-06-18 (session 16)

### Fait :
- `style.css` : `.nav-cours-item` — suppression `webkit-line-clamp` + `max-height` conflictuel (causait coupure visuelle), remplacement par `white-space: nowrap + text-overflow: ellipsis` — commits `6b0ecac`, `c3e55b7`, `92cac5c`
- `app.js` : troncature JS fiable des titres sidebar — `_titreClean.slice(0, 45).trimEnd() + '...'` (seuil 48 chars), `title` + `aria-label` pour tooltip — commit `92cac5c`
- `app.js` : onglet Notes — `<select>` natif → dropdown custom 100% JS/CSS (`.custom-select`, animation opacity+translateY, flèche SVG verte, fermeture clic extérieur + Echap) — commit `c8762dd`
- `app.js` : onglet Notes — identifiant passé de `<input text>` à `<select>` (étape intermédiaire) puis dropdown custom — commit `3d9d715`
- `app.js` : onglet Notes — `renderFilesChips()` refait : fichiers uploadés affichés en blocs avec contenu extrait lisible (`.member-file-block` + `.member-file-extract` scrollable 200px) — commit `3d9d715`
- `app.js` : onglet Notes — résumé automatique sans bouton : `autoGenerateSummary()` appelée après chaque sauvegarde réussie + au chargement si contenu existant — commit `3d9d715`
- `app.js` : `showScreen()` — ajout nettoyage terminal fullscreen (`fsContent.innerHTML = ''`, reset `state.cli`) à la navigation — commit `91cfe6e`
- `app.js` : `popstate` home branch — remplacé manipulation DOM manuelle par `showScreen('home-screen')` pour passer par le nettoyage terminal — commit `91cfe6e`
- `style.css` : `.custom-select`, `.custom-select-trigger`, `.custom-select-options`, `.custom-select-option` + scrollbar verte — commit `c8762dd`
- `style.css` : `.member-file-block`, `.member-file-header`, `.member-file-name`, `.member-file-extract` — commit `3d9d715`

### État :
PWA déployée. Sidebar : titres tronqués proprement à 45 chars (plus de ligne coupée). Onglet Notes : dropdown identifiant custom thème sombre, fichiers uploadés affichés en texte lisible, résumé auto sans bouton. Navigation terminal nettoyée.

### À reprendre :
- [ ] Déployer Railway (`railway login` → `railway init` → `railway variables set ANTHROPIC_API_KEY=...` → `railway up`) puis mettre à jour URL fetch dans app.js
- [ ] Vérifier règles Firestore console (`allow read, write: if true` sur collection `notes`)
- [ ] Tester sync temps réel entre 2 ordis (Notes partagées Firebase)
- [ ] Flashcards OSI (7 couches + rôles) — en attente depuis session 7
- [ ] NetRunner missions Linux supplémentaires (3 missions : bash, find, chmod)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Refonte `ad-avance` (ADFS SSO trusts réplication schéma)

### Contexte express :
> Session UI/polish : fix troncature titres sidebar (line-clamp → JS+ellipsis), dropdown identifiant 100% custom dark theme, affichage contenu extrait fichiers en blocs lisibles, résumé Notes auto-généré après chaque save. Nettoyage terminal fullscreen à la navigation (showScreen + popstate). Aucun nouveau module.

---

## 📋 Récap — 2026-06-17 (session 15)

### Fait :
- `firebase-notes.js` : réécriture complète — nouvelle structure `members[pseudo]{ text, files[], updatedAt }` — 5 méthodes : `saveMemberData`, `listenToAllMembers`, `getAllMembers`, `saveSummary`, `listenToSummary` — commit `c8d7081`
- `app.js` : `renderNotes(m, cours, el)` entièrement réécrite — 10 cartes `<details>` repliables (une par collègue KNOWN_MEMBERS), carte "vous" ouverte + textarea + upload drag&drop + chips fichiers supprimables + bouton sauvegarder — commit `c8d7081`
- `app.js` : fallback résumé — si `/api/auto-summarize` indisponible, affiche textarea éditable + bouton "Sauvegarder manuellement" qui appelle `saveSummary` directement — commit `c8d7081`
- `app.js` : fix re-render Firestore — `myDraft { text, files }` préserve le contenu textarea + fichiers pending entre chaque `onSnapshot`, reset après sauvegarde réussie — commit `09d1c13`
- `style.css` : `.members-cards`, `.member-card` (refait pour `<details>`), `.member-card-summary`, `.member-card-body`, `.member-badge-me`, `.member-upload-zone`, `.member-files-list`, `.member-file-chip`, `.file-chip-remove` — commit `c8d7081`
- Railway CLI : steps de déploiement fournis (npm install -g @railway/cli → login → init → variables → up)

### État :
PWA déployée. Notes refondues : une carte par collègue (repliable), upload PDF/HTML/TXT/MD par carte, sauvegarde Firestore par membre, résumé avec fallback manuel. Draft textarea préservé au re-render. Backend Railway pas encore déployé (steps prêts).

### À reprendre :
- [ ] Déployer Railway (`railway login` → `railway init` → `railway variables set ANTHROPIC_API_KEY=...` → `railway up`) puis mettre à jour URL fetch dans app.js
- [ ] Vérifier règles Firestore console (`allow read, write: if true` sur collection `notes`)
- [ ] Tester sync temps réel entre 2 ordis (Notes partagées Firebase)
- [ ] Flashcards OSI (7 couches + rôles) — en attente depuis session 7
- [ ] NetRunner missions Linux supplémentaires (3 missions : bash, find, chmod)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Refonte `ad-avance` (ADFS SSO trusts réplication schéma)

### Contexte express :
> Session Notes : refonte complète de l'onglet en cartes nominatives par collègue (`<details>` repliables), chacune avec textarea + upload + chips fichiers. Sauvegarde Firestore par membre (`members[pseudo]`). Fallback résumé manuel si pas de backend. Fix draft preservation au re-render onSnapshot. Steps Railway fournis mais non exécutés.

---

## 📋 Récap — 2026-06-17 (session 14)

### Fait :
- `app.js` : upload fichiers dans l'onglet Notes (drag & drop, txt/pdf/docx/html, extraction via pdfjs + mammoth CDN, prévisualisation 300 chars, boutons "Ajouter aux notes" + "Résumer avec IA") — commit `2f4a201`
- `style.css` : CSS upload (.file-upload-zone, .file-item, .ai-modal-overlay) + pseudo-chips + sections notes partagées/perso + résumé collectif
- `firebase-config.js` : init Firebase 10.7.2 avec config projet `tssr-pwa` — commit `447d715`
- `firebase-notes.js` : API `FirebaseNotes` — 7 méthodes (savePersonalNote, listenToSharedNotes, trackFileUpload, trackTextNotes, listenToAutoSummary, getAggregatedContent, saveSummary) — commit `5d197be`
- `app.js` : `renderNotes` entièrement réécrite — pseudo bar (chips MEMBRES), upload section, **Notes partagées** (Firebase onSnapshot temps réel), **Notes personnelles** (localStorage), Résumé collectif IA
- `app.js` : `setupFileUpload(moduleId, coursId)` — track fichier automatique via FirebaseNotes après extraction
- `app.js` : `regenerateAutoSummary(moduleId, coursId)` — agrège toutes les sources Firestore, appelle `/api/auto-summarize`, fallback texte si pas de backend
- `sw.js` : v14 — exclusion googleapis.com/firebaseio.com/firebaseapp.com du cache (fixes Firestore intercepté)
- `server.js` + `package.json` : backend Node.js référence pour Railway (endpoint `/api/auto-summarize` avec claude-opus-4-6)
- `index.html` + `404.html` : ajout `<script type="module">` pour firebase-config.js et firebase-notes.js

### État :
PWA déployée. Firebase Firestore configuré (projet tssr-pwa). Notes partagées temps réel entre tous les ordis. Upload fichiers + tracking Firestore. Résumé collectif IA en attente d'un backend déployé.

### À reprendre :
- [ ] Vérifier les règles Firestore dans la console (allow read, write: if true)
- [ ] Tester sync temps réel entre 2 ordis (Notes partagées)
- [ ] Déployer server.js sur Railway pour activer le résumé Claude
- [ ] Flashcards OSI (7 couches + rôles) — toujours en attente
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Refonte `ad-avance` (ADFS SSO trusts réplication schéma)

### Contexte express :
> Session Firebase : intégration complète Firestore (notes partagées temps réel + tracking fichiers/notes + résumé collectif auto). `renderNotes` réécrite avec 3 zones distinctes (upload, notes partagées Firebase, notes perso localStorage). SW fixé pour ne pas intercepter les appels Firebase. Backend de référence Railway prêt à déployer.

---

## 📋 Récap — 2026-06-16 (session 13)

### Fait :
- `app.js` + `index.html` + `style.css` : refonte UI majeure — encodage triple-encoding réparé (164 chars restaurés via lookup table PowerShell), design Inter (remplace Syne), nouvelles CSS custom properties (`--surface`, `--radius-xl`, `--shadow-lg`, `--transition`), sidebar-header cliquable (`goHome()`), home-hero simplifié (sans `.home-title-wrap`, sans `.home-stats`), search icon CSS `.search-icon`, mobile `id="mobile-module-name"`, module-card restructuré avec gradient `::before`, code-block dark/vert, tab-bar/tab-btn restructuré, btn-ai-explain mis à jour — commits `1b091e2`
- `data.js` : fix 164 double-encodages Windows-1252 (É/È/À/Ê/Î/Ù/œ dans modules Numération, Windows, Windows Server, etc.) — commit `c658d78`
- `linux-server` : refonte vérifiée — 4 cours production-ready présents depuis `ba63658` (Apache2+PHP-FPM+Nginx, NFS serveur/client, Samba standalone+AD, Docker Compose+Ansible)
- GitHub Pages : fonctionnel — titre et structure OK

### État :
PWA déployée. 16 modules. Design refait (Inter, dark theme renforcé). Encodages data.js propres. Module linux-server complet.

### À reprendre :
- [ ] Refonte `ad-avance` (ADFS SSO trusts réplication schéma)
- [ ] Flashcards OSI (7 couches + rôles) — toujours en attente
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Emojis icônes modules encore double-encodés (4-byte UTF-8, fix séparé)

### Contexte express :
> Session refonte UI : triple-encoding réparé dans app.js/style.css, design Inter complet avec nouvelles CSS variables, index.html réécrit. Puis fix 164 double-encodages Windows-1252 dans data.js. Module linux-server déjà refait (ba63658). GitHub Pages OK.

---

## 📋 Récap — 2026-06-15 (session 12)

### Fait :
- `data.js` : fix encodage définitif — restauration depuis `f3da430` + merge sélectif 2-byte (3 910 paires double-encodées corrigées, 0 replacement char) — commits `e6752ac` + `580280c`
- `sw.js` : bump cache `tssr-v2` → `tssr-v3` (force invalidation navigateur)
- `app.js` : bouton "Terminaux" sidebar converti en accordéon — 5 items : Terminal Linux, Terminal PowerShell, Terminal Windows (CMD), GameShell, NetRunner
- `app.js` : ajout `openTerminalFullscreen(type)` + `TERMINAL_META` — fonction unifiée pour ouvrir n'importe quel terminal en plein écran
- `app.js` : ajout type `cmd` dans `makeCLIState`, `renderCLI`, `cliPrompt` (prompt `C:\>`, titlebar cmd.exe, message d'accueil Windows)
- `index.html` + `404.html` : ajout écran `#terminal-fs-screen` (manquant = raison pour laquelle le bouton Terminaux n'allait nulle part)
- `style.css` : ajout `.tfs-cmd`, `.tfs-netrunner` — commit `60239b2`

### État :
PWA déployée. 16 modules. Accordéon Terminaux fonctionnel avec 5 items. Fix encodage data.js complet et stable (zéro replacement char, zéro double-encodage).

### À reprendre :
- [ ] Refonte `linux-server` (Apache, Nginx, Samba, NFS côté serveur)
- [ ] Refonte `ad-avance` (ADFS SSO trusts réplication schéma)
- [ ] Flashcards OSI (7 couches + rôles) — toujours en attente
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Emojis icônes modules encore double-encodés (4-byte UTF-8, fix séparé)

### Contexte express :
> Session technique : fix encodage data.js (merge sélectif 2-byte, 3910 paires, zéro damage sur les modules récents) + refonte complète du bouton Terminaux en accordéon sidebar avec 5 terminaux (Linux/PS/CMD/GameShell/NetRunner). Découverte : l'écran #terminal-fs-screen était absent du HTML, d'où le bouton qui n'allait nulle part.

---

## 📋 Récap — 2026-06-13 (session 11)

### Fait :
- `data.js` : module **Scripting BDD** (`scripting-avance`) — `cours[]` remplacé — 4 cours ultra-détaillés (`python-admin` types/fichiers/subprocess/psutil rapport_systeme/Paramiko ThreadPoolExecutor, `regex-python` tableau 17 patterns/re module/analyseur Apache/analyseur auth.log, `sql-bdd` MySQL install/DDL/DML/JOINs/VIEWs/transactions/gestion users/mysqldump/Python mysql.connector, `powershell-avance` pipeline objects/fonction Get-ServerHealth/rapport HTML/Send-MailMessage alertes) — commit `a4250ff`
- `data.js` : module **Windows Server** (`windows-server`) — `cours[]` remplacé — 4 cours ultra-détaillés (`ws2025-installation` nouveautés/éditions/config initiale PS/Server Core/RSAT/WAC, `wsus-gestion-mises-a-jour` architecture/installation/groupes ordi/approbation/GPO clients, `hyper-v-windows-server` switches virtuels/création VMs/Replica DR/Failover Clustering/Live Migration/CSV, `powershell-scripting-avance` audit AD/création masse CSV/désactivation partants/SMB partages/permissions NTFS/monitoring tâche planifiée) — commit `5aa0b92`
- 2 commits poussés sur `main` → déployés sur GitHub Pages

### État :
PWA déployée. 16 modules. Session de refonte contenu : 2 modules retravaillés en profondeur. Pattern consolidé : Write temp → PowerShell splice → Grep vérification → commit+push.

### À reprendre :
- [ ] Refonte `linux-server` (Apache, Nginx, Samba, NFS côté serveur)
- [ ] Refonte `cloud` — déjà refait (session précédente) ✓
- [ ] Refonte `supervision` (Zabbix Prometheus Grafana ELK SNMP)
- [ ] Refonte `messagerie` — déjà refaite (session précédente) ✓
- [ ] Refonte `ad-avance` (ADFS SSO trusts réplication schéma)
- [ ] Flashcards OSI (7 couches + rôles) — toujours en attente
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)

### Contexte express :
> Session refonte contenu : modules Scripting BDD (Python/Regex/MySQL/PowerShell avancé) et Windows Server (WS2025/WSUS/Hyper-V Replica+Cluster/PS monitoring) entièrement réécrits avec commandes production-ready. 2 commits.

---

## 📋 Récap — 2026-06-11 (session 10)

### Fait :
- `data.js` : module **Cisco** — `cours[]` remplacé — 4 cours ultra-détaillés (`ios-fondamentaux` modes navigation config initiale SSH NTP show, `routage-cisco` interfaces statique OSPF ACL standard/étendue, `vlan-cisco` VLAN trunk STP RSTP PortFast BPDU Guard EtherChannel LACP, `sauvegarde-ios` TFTP FTP config-register récupération MDP)
- `data.js` : module **Sécurité** — `cours[]` remplacé — 4 cours ultra-détaillés (`securite-fondamentaux` triade CIA types d'attaques moindre privilège défense profondeur, `pare-feu` iptables tables/chaînes NAT DNAT anti-flood pfSense DMZ règles, `pki-tls` cryptographie AES RSA SHA PKI OpenSSL handshake TLS Apache Let's Encrypt WireGuard, `hardening` Linux sysctl auditd PAM SSH banner UFW + Windows Server GPO LAPS audit log analysis)
- `data.js` : module **Stockage** — `cours[]` remplacé — 3 cours ultra-détaillés (`raid-complet` RAID 0/1/5/6/10 mdadm Storage Spaces, `san-nas-iscsi` NFS Samba iSCSI tgt LVM snapshots, `strategie-sauvegarde` GFS RPO/RTO 3-2-1-1-0 rsync hard-links Veeam CDP)
- 4 commits poussés sur `main` → déployés sur GitHub Pages

### État :
PWA déployée. 16 modules. Session de refonte de contenu : 4 modules enrichis avec cours de niveau professionnel (commandes complètes, cas réels, configurations prêtes à l'emploi). Anciens cours résumés remplacés par des cours techniques complets.

### À reprendre :
- [ ] Refonte `windows-server` (cours install-ws2025 + AD encore anciens)
- [ ] Refonte `linux-server` (Apache, Nginx, Samba, NFS côté serveur)
- [ ] Refonte `cloud` (Azure ARM CLI VMs NSG ultra-détaillé + AWS S3 EC2)
- [ ] Refonte `supervision` (Zabbix Prometheus Grafana ELK SNMP)
- [ ] Refonte `messagerie` (Postfix Dovecot DKIM DMARC Exchange)
- [ ] Flashcards OSI (7 couches + rôles) — toujours en attente
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)

### Contexte express :
> Session de refonte contenu : 4 modules data.js retravaillés en profondeur (Cisco IOS/routage/VLAN/sauvegarde, Sécurité CIA/iptables/pfSense/PKI/TLS/WireGuard/hardening, Stockage RAID/NFS/Samba/iSCSI/LVM/Veeam). 4 commits. Pattern établi : Grep localisation → Read bornes → Edit remplacement complet → commit+push.

---

## 📋 Récap — 2026-06-10 (session 9)

### Fait :
- `app.js` : `renderCoursContent()` — type `html` refait avec stripping complet (`<head>`, `<style>`, `<script>`, attributs `style=""` et `class=""`)
- `app.js` : type `html-file` — suppression de l'iframe, remplacé par `fetch()` + injection inline dans `.cours-html-block` avec même stripping (fix root cause fond blanc numération)
- `style.css` : `.cours-html-block *` ajouté — `color: inherit`, `background: transparent !important`, `font-family: inherit`, `border-color: var(--border) !important`
- `style.css` : `.cours-html-block h1 { display: none; }` et `.cours-html-block > div[style]` ajoutés
- `style.css` : `.cours-html-block th` et `pre` passés en `background: ... !important` pour résister à la règle `*`
- 1 commit poussé sur `main` → déployé sur GitHub Pages

### État :
PWA déployée. 16 modules. Fix visuel majeur : les cours chargés depuis fichiers HTML externes (html-file) ne s'affichent plus dans un iframe blanc — contenu fetché, styles strippés, rendu dans le dark theme de l'app.

### À reprendre :
- [ ] Vérifier rendu GitHub Pages du cours Numération (fetch fonctionne offline via SW ?)
- [ ] Flashcards OSI (7 couches + rôles) dans module Réseaux — toujours en attente
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Cours `admin-windows-test` : badge `test` à retirer quand finalisé
- [ ] Ajouter exercices pratiques en remplacement des QCM supprimés

### Contexte express :
> Session courte : fix fond blanc cours Numération. La vraie cause était le rendu iframe (`html-file`), pas un problème CSS. Remplacé par fetch+inline+stripping dans `.cours-html-block`. 1 commit.

---

## 📋 Récap — 2026-06-10 (session 8)

### Fait :
- `data.js` : module **Stockage & Sauvegarde** créé — 3 cours (RAID 0/1/5/6/10 mdadm Storage Spaces, SAN/NAS/iSCSI/LVM, stratégie 3-2-1-1-0 RPO/RTO rsync PowerShell Backup)
- `data.js` : module **Cloud & Azure** créé — 3 cours (IaaS/PaaS/SaaS modèles déploiement, Azure CLI VMs réseau NSG Storage, Azure AD Conditional Access PowerShell AWS)
- `data.js` : module **Messagerie** créé — 3 cours (SMTP/IMAP/POP3/SPF/DKIM/DMARC, Postfix+Dovecot config complète, Exchange 2019 EMS antispam SCL)
- `data.js` : module **Scripting & BDD** créé — 3 cours (Python admin Paramiko psutil, Regex Python/Bash/PS, SQL/MySQL/SQL Server PowerShell)
- `data.js` : modules **AD Avancé** et **Documentation** créés — 5 cours (délégation sites trusts réplication, ADFS SSO SAML claims, schémas réseau niveaux L1-L5, PRA/PCA runbooks, ITIL Agile CDC)
- `app.js` : `renderNav()` refaite — sidebar groupée en 7 catégories (Réseaux, Systèmes Windows, Systèmes Linux, Infrastructure, Développement & BDD, Fondamentaux, Projet)
- `app.js` + `data.js` : suppression complète des onglets Flashcards et QCM — toutes les arrays vidées (16 modules)
- `app.js` : `renderCours()` refaite — sommaire multi-cours, articles numérotés `.cours-article`, header `.cours-article-num`, `.cours-content` scopé
- `app.js` : stats accueil réduits à Modules / Cours / Progression, tags cards nettoyés
- `style.css` : `.cours-section` supprimé, nouveau bloc `.cours-content` scopé, `.cours-article`, `.cours-sommaire`, `.cours-badge`, `.cours-html-block`, `.cours-iframe` dé-blanchi
- 7 commits poussés sur `main` → déployés sur GitHub Pages

### État :
PWA déployée. 16 modules actifs répartis en 7 groupes sidebar. Onglets Flashcards/QCM supprimés. Architecture cours refaite avec sommaire et articles numérotés. Rendu visuel cohérent (dark theme, pas de fond blanc). Nouveaux modules : Stockage, Cloud/Azure, Messagerie, Scripting/BDD, AD Avancé, Documentation.

### À reprendre :
- [ ] Flashcards OSI (7 couches + rôles) dans module Réseaux — toujours en attente
- [ ] 10 QCM supplémentaires Windows Server (AD avancé, DNS, DHCP) — à transformer en exercices pratiques
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Mode révision du jour SM-2 — à reconsidérer maintenant que les flashcards sont supprimées
- [ ] Cours `admin-windows-test` : badge `test` à retirer quand finalisé
- [ ] Vérifier rendu GitHub Pages (sommaire multi-cours, articles, dark theme)
- [ ] Ajouter exercices pratiques en remplacement des QCM supprimés

### Contexte express :
> Session très dense : 6 nouveaux modules (Stockage RAID/SAN/NAS, Cloud Azure/AWS, Messagerie SMTP/Exchange, Scripting Python/SQL, AD Avancé/ADFS, Documentation/PRA/ITIL). Refonte UI majeure : sidebar groupée 7 catégories, suppression flashcards/QCM, `renderCours()` complètement réécrite avec sommaire et articles numérotés, CSS scopé `.cours-content`. 7 commits.

---

## 📋 Récap — 2026-06-10 (session 7)

### Fait :
- `data.js` : module **Réseaux** enrichi — 4 cours (adressage-ip, protocoles-reseau, wifi, wireshark), 20 flashcards rf1-rf20, 10 QCM rq1-rq10
- `scenarios.js` : 3 TPs Linux réseau ajoutés (`linux_adressage` 8 étapes, `linux_protocoles` 6 étapes, `linux_wifi` 5 étapes)
- `data.js` : module **Sécurité** remplacé intégralement — 3 cours (pare-feu, pki-vpn, siem-ad-securite), 15 flashcards sf1-sf15, 5 QCM sq1-sq5
- `data.js` : module **Supervision** créé — 2 cours (zabbix, itil-tickets), 15 flashcards supf1-supf15, 5 QCM supq1-supq5
- `app.js` : groupe Infrastructure mis à jour — `['virtualisation', 'cisco', 'supervision']`
- `data.js` : module **Virtualisation** remplacé intégralement — 2 cours (vmware-vsphere, veeam-backup), 15 flashcards vf1-vf15, 5 QCM vq1-vq5
- 4 commits poussés sur `main` → déployés sur GitHub Pages

### État :
PWA déployée. 10 modules actifs : Numération, Réseaux, Linux, Serveur Linux, Windows, Windows Server 2025, Virtualisation, Sécurité, Cisco, Supervision. Modules Réseaux/Sécurité/Virtualisation/Supervision tous enrichis avec contenu professionnel (vSphere, vMotion, Veeam, Zabbix, ITIL, PKI, SIEM).

### À reprendre :
- [ ] Flashcards OSI (7 couches + rôles) dans module Réseaux
- [ ] 10 QCM supplémentaires Windows Server (AD avancé, DNS, DHCP)
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Mode révision du jour SM-2 (afficher cartes dues aujourd'hui)
- [ ] Cours `admin-windows-test` : badge `test` à retirer quand finalisé

### Contexte express :
> Session très dense : 4 modules retravaillés en profondeur (Réseaux +4 cours +20FC +10QCM +3TP, Sécurité remplacement complet pare-feu/PKI/SIEM, Supervision nouveau module Zabbix/ITIL, Virtualisation remplacement ESXi/vSphere/vMotion/Veeam). 4 commits.

---

## 📋 Récap — 2026-06-10 (session 6)

### Fait :
- `data.js` : module **Cisco / Réseaux** ajouté (3 cours : ios-bases, vlan-switching, routage-acl — 15 flashcards cf1-cf15, 8 QCM cq1-cq8)
- `scenarios.js` : 2 TPs Linux Cisco ajoutés (`linux_cisco_reseau` 6 étapes, `linux_vlan_reseau` 5 étapes)
- `app.js` : sidebar restructurée en 4 groupes (`MODULE_GROUPS` : Fondamentaux / Linux / Windows / Infrastructure) avec progress % coloré par module et badge compteur de ressources
- `style.css` : `.nav-group-sep`, `.nav-item-label`, `.nav-pct`, `.nav-count` ajoutés
- `data.js` : module **Windows Server 2025** enrichi — 3 cours supplémentaires (powershell-scripting, gpo-avancees, wsus-hyperv), flashcards remplacées wsf1-wsf15 (15 cartes), QCM remplacés wsq1-wsq5 (5 questions)
- 2 commits poussés sur `main` → déployés sur GitHub Pages

### État :
PWA déployée. 9 modules actifs : Numération, Réseaux, Linux, Serveur Linux, Windows, Windows Server 2025, Virtualisation, Sécurité, Cisco. Sidebar avec groupes visuels et progression par couleur de module. Module Windows Server complet avec 6 cours, 15 flashcards scripting/GPO/WSUS/Hyper-V, 5 QCM.

### À reprendre :
- [ ] Flashcards OSI (7 couches + rôles) dans module Réseaux
- [ ] QCM Réseaux (ports/protocoles, adressage IP)
- [ ] 10 QCM supplémentaires Windows Server (AD avancé, DNS, DHCP)
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Mode révision du jour SM-2 (afficher cartes dues aujourd'hui)
- [ ] Cours `admin-windows-test` : badge `test` à retirer quand finalisé

### Contexte express :
> Session dense : ajout du module Cisco (IOS/VLAN/routage/ACL/Packet Tracer + 2 TPs Linux), refonte sidebar en groupes colorés, et enrichissement majeur du module Windows Server (3 cours PowerShell/GPO/WSUS+Hyper-V, nouvelles flashcards et QCM). 2 commits.

---

## 📋 Récap — 2026-06-09 (session 5)

### Fait :
- `data.js` : cours `admin-windows-test` ajouté dans module Windows (6 sections : net user, diskpart, AD, PS cmdlets, diagnostic réseau, quiz rapide) avec `badge: 'test'`
- `app.js` : badge orange **TEST** affiché à côté du titre dans l'onglet Cours pour tout cours avec `badge: 'test'`
- `app.js` + `data.js` : onglet **🎮 Jeu PowerShell** ajouté au module Windows — iframe vers `netrunner.html`
- `gameshell.html` : jeu standalone Linux créé (boot animé, 30 missions, 6 niveaux, panneau latéral, badges, persistance localStorage, historique ↑/↓, hint/help/reset)
- `app.js` + `data.js` : onglet **🎮 Pratique** ajouté au module Linux — iframe vers `gameshell.html`
- `data.js` : section GameShell retirée du cours `encyclopedie-linux` (contenu déplacé dans l'onglet Pratique)
- `data.js` : entrée cours `netrunner` retirée de `cours[]` Windows
- `app.js` : `renderNetrunner()` enrichi — tableau des 3 missions + iframe intégré dans l'onglet Jeu PowerShell
- 6 commits poussés sur `main` → déployés sur GitHub Pages

### État :
PWA déployée. Modules actifs : Numération, Réseaux, Linux, Windows. Chaque module ludique a son onglet dédié : Linux → **Pratique** (GameShell 30 missions standalone), Windows → **Jeu PowerShell** (NetRunner 3 missions + tableau récap). Cours propres, sans contenu dupliqué.

### À reprendre :
- [ ] Flashcards OSI (7 couches + rôles)
- [ ] QCM Réseaux (ports/protocoles, adressage IP)
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] Cours `admin-windows-test` : badge `test` à retirer quand le cours est finalisé

### Contexte express :
> Session d'organisation : création de `gameshell.html` standalone (30 missions Linux), ajout des onglets dédiés Pratique (Linux) et Jeu PowerShell (Windows), nettoyage des cours pour éviter les doublons. Badge TEST sur le nouveau cours Windows. 6 commits.

---

## 📋 Récap — 2026-06-09 (session 4)

### Fait :
- `data.js` : nouveau module `linux` avec cours `encyclopedie-linux` (9 sections : installation, FS, fichiers, VIM, droits, redirections, processus/services, filtrage, APT) + `linux_cli: true`
- `data.js` : section "🎮 Pratique GameShell" ajoutée à la fin du cours encyclopédie-linux (tableau 6 niveaux → commandes)
- `data.js` : module `windows` → nouvel entrée cours `netrunner` avec tableau récap des 3 missions
- `app.js` : scénario `linux_gameshell` (30 étapes, 6 niveaux) ajouté dans `TP_SCENARIOS.linux`
- `app.js` : `successMsg` affiché dans `tpValidate` après chaque étape validée
- `app.js` : raccourci `tp <id>` sans mot-clé `start`
- `app.js` : message GameShell TSSR dans le terminal Linux au démarrage
- `app.js` : badges visuels `🌱📁🔍🔐⚙️` à chaque niveau complété (missions 5/10/15/20/25)
- `app.js` : autosave progression GameShell dans localStorage (`tssr_gameshell_progress`) + reprise automatique
- `netrunner.html` : jeu terminal standalone style hacker — boot animé, 3 missions, timer rouge < 20s, overlays Victory/Game Over, queue typing séquentielle, commande `help`
- 4 commits poussés sur `main` → déployés sur GitHub Pages

### État :
PWA déployée. Modules actifs : Numération, Réseaux, **Linux** (nouveau), Windows. Terminal Linux avec GameShell 30 missions + badges + persistance. NetRunner jeu Windows 3 missions standalone.

### À reprendre :
- [ ] Flashcards OSI (7 couches + rôles)
- [ ] QCM Réseaux (ports/protocoles, adressage IP)
- [ ] NetRunner missions Linux (bash, find, chmod — 3 missions supplémentaires)
- [ ] Leaderboard localStorage NetRunner (meilleur temps par mission)
- [ ] `session-log.md` non traqué par git (à ajouter si souhaité)

### Contexte express :
> Session dense : création du module Linux complet (cours encyclopédie + terminal GameShell 30 missions avec badges et persistance) + jeu NetRunner standalone Windows 3 missions. 4 commits, tout déployé sur GitHub Pages.

---

## 📋 Récap — 2026-06-08 (session 3)

### Fait :
- `data.js` : suppression doublon section `info` mnémotechniques OSI dans le cours `modele-osi` (sections vides conservées)
- Commit `8be2d91` poussé sur `main`

### État :
PWA déployée. Cours `modele-osi` nettoyé. Modules actifs : Numération, Réseaux, Windows.

### À reprendre :
- [ ] Flashcards OSI (7 couches + rôles)
- [ ] QCM Réseaux (ports/protocoles, adressage IP)
- [ ] `session-log.md` non traqué par git (à ajouter si souhaité)

### Contexte express :
> Session courte : suppression du doublon mnémotechniques OSI dans `data.js` (présentes aussi dans `cours_reseaux.html`). Un seul commit.

---

## 📋 Récap — 2026-06-08 (session 2)

### Fait :
- `app.js` : `Flashcards` → `Cartes` (onglet, dashboard, message vide)
- `vim.js` : modes `INSERT/VISUAL/COMMAND` → `INSERTION/VISUEL/COMMANDE`
- `scenarios.js` : `'PowerShell Bases'` → `'Bases PowerShell'`
- `modules/windows/cours_windows_objectifs.html` : `**rompre l'héritage**` → balise `<strong>`, `OI/CI` traduits en français, `SSH Inbound` → `SSH Entrant`, `(Inbound)/(Outbound)` supprimés, ligne "injection LLM" supprimée
- `modules/reseaux/cours_reseaux.html` : mnémotechnique anglaise remplacée, `overhead` → `surcharge`, `Three-Way Handshake` francisé, `reverse` → `inverse`, mnémotechniques OSI mis à jour
- `data.js` : ajout cours `modele-osi` avec mnémotechniques OSI validés (1→7 : *Philippe Laisse Rentrer Tous Ses Petits Amis* / 7→1 : *Alex Pète Sa Tête Rarement Le Premier*)
- 3 commits poussés sur `main` → déployés sur GitHub Pages

### État :
PWA déployée et entièrement en français. Modules actifs : Numération, Réseaux (cours OSI inline + cours html-file + terminal Linux + Windows + 6 TPs chacun), Windows.

### À reprendre :
- [ ] Flashcards OSI (7 couches + rôles)
- [ ] QCM Réseaux (ports/protocoles, adressage IP)
- [ ] `session-log.md` non traqué par git (à ajouter si souhaité)

### Contexte express :
> Session de francisation complète : UI, cours Windows, cours Réseaux, modes vim. Ajout des mnémotechniques OSI dans `data.js` comme cours inline `modele-osi`. Tout est poussé sur GitHub Pages.

---

## 📋 Récap — 2026-06-08

### Fait :
- `index.html` + `sw.js` : fix page blanche GitHub Pages (suppression `scenarios.js` qui redéclarait `let scenarioState`, bump cache `tssr-v1` → `tssr-v2`)
- `data.js` : ajout `linux_cli: true` sur module Réseaux
- `app.js` : terminal Linux fault-aware — pannes simulées DHCP / mauvaise gateway / conflit IP sur `ip`, `ping`, `traceroute`, `arp`, `systemctl`, `journalctl`, `dhclient`
- `app.js` : 3 TPs Linux réseau (diagnostic, services, analyse ARP) + 3 TPs pannes Linux (panne_dhcp, panne_gateway, panne_conflit)
- `modules/numerisation/cours_optimise_claude.html` : LaTeX brut corrigé (`$2^7$` → `2<sup>7</sup>`, `$ightarrow$` → `→`, `$oplus$` → `⊕`, `$\times$` → `×`), opérateurs ET/OU/XOR en français, ligne "injection LLM" supprimée

### État :
PWA déployée sur GitHub Pages (branche `gh-pages`), terminaux Linux + Windows fonctionnels dans module Réseaux, 6 TPs Windows + 6 TPs Linux disponibles.

### À reprendre :
- [ ] `modules/windows/cours_windows_objectifs.html` : corriger `**rompre l'héritage**` (Markdown dans HTML), traduire commentaires icacls (`Object Inherit` → `Héritage d'objet`, etc.), `"Autoriser SSH Inbound"` → `"Autoriser SSH Entrant"`, supprimer ligne "injection LLM"
- [ ] `modules/reseaux/cours_reseaux.html` : vérifier s'il reste des termes à franciser
- [ ] Flashcards ou QCM pour module Réseaux (OSI, TCP/IP, adressage)

### Contexte express :
> PWA TSSR offline-first déployée sur GitHub Pages. Modules actifs : Numération, Réseaux (terminal Linux + Windows + 6 TPs chacun), Windows. La session a surtout porté sur les pannes réseau simulées côté Linux et la correction des cours HTML.
