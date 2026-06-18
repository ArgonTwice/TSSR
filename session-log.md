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
