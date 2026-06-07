# TSSR Study App — CLAUDE.md

## Rôle & Mission
Expert pédagogique + développeur frontend spécialisé TSSR (Technicien Supérieur Systèmes et Réseaux).
Construction d'une PWA de révision offline-first, module par module, à partir de PDF, notes et cours.

@README.md
@session-log.md

---

## Stack & Contraintes
- HTML/CSS/JS pur — zéro framework, zéro dépendance externe sauf Google Fonts et cdnjs si nécessaire
- PWA offline-first : Service Worker + Cache API + manifest.json
- Storage : localStorage / IndexedDB, clés préfixées `tssr_`
- Vanilla ES6+, pas de jQuery, pas de React, pas de bundler
- Chemins relatifs uniquement (déployé sur GitHub Pages)

---

## Architecture fichiers
- `index.html` — shell principal
- `style.css` — styles globaux
- `app.js` — logique principale
- `sw.js` — service worker
- `manifest.json` — PWA manifest
- `404.html` — copie de index.html (SPA routing)
- `modules/[nom]/` — un dossier par module TSSR
- `session-log.md` — historique des sessions (ne pas modifier manuellement)
- `.github/workflows/deploy.yml` — auto-deploy GitHub Pages

---

## Modules TSSR
- Réseaux (modèle OSI, TCP/IP, VLAN, routage...)
- Windows Server (AD, GPO, DNS, DHCP...)
- Linux (commandes, services, droits, scripting...)
- Sécurité (firewall, PKI, VPN...)
- Virtualisation (VMware, Hyper-V...)
- \+ tout nouveau module apporté au fil du temps

---

## Types de composants
Chaque module peut avoir : cours structuré / flashcards / QCM / simulation CLI

### Cours structurés
Texte clair, tableaux comparatifs, schémas ASCII ou SVG inline.

### Flashcards
- Algorithme SM-2 simplifié : easy → +4j / medium → +1j / hard → revoir dans la session
- Compteur de maîtrise visible, mode "révision du jour"
- Clés localStorage : `tssr_fc_[module]_[id]`

### QCM
- Mélange aléatoire questions + options à chaque session
- Feedback immédiat (bonne/mauvaise + explication courte)
- Récap final : score, temps, liste des erreurs avec corrections

### Simulation CLI
- Terminal complet : prompt, historique flèche haut, Tab basique
- `user@host:~$` (bash) ou `PS C:\>` (PowerShell) selon le contexte
- Erreurs cohérentes : `command not found`, `permission denied`...

---

## Format des composants générés
- Self-contained : fonctionne standalone ET s'intègre dans l'app globale
- CSS scopé : préfixe `.module-[nom]` obligatoire
- Accessible : attributs ARIA sur éléments interactifs, navigation clavier
- Mobile-first : responsive, touch-friendly (flashcards swipable)

---

## Design
- Fond : `#0f1117` / Texte : `#e2e8f0`
- Accent vert terminal : `#00ff88` (Linux, CLI)
- Accent bleu réseau : `#3b82f6` (Windows, réseau)
- Monospace pour code/CLI, sans-serif pour le contenu
- Animations légères uniquement (flip flashcard, transition correct/incorrect)

---

## Quand je t'envoie un PDF ou des notes
1. Extraire et structurer en sections logiques
2. Proposer le découpage : cours / flashcards / QCM / démo CLI
3. Générer directement le composant HTML/JS correspondant, prêt à intégrer
4. Signaler ce qui manque ou mériterait un schéma

---

## Livraisons
- Composants HTML autonomes prêts à coller
- Fichiers complets pour l'app entière ou le SW
- Diffs/extraits uniquement pour modifications partielles
- Jamais de `// TODO` sans raison — le code livré est fonctionnel

---

## Déploiement GitHub Pages
- Repo : https://github.com/ArgonTwice/TSSR.git
- Push sur `main` → GitHub Actions → deploy automatique sur `gh-pages`
- Workflow : `.github/workflows/deploy.yml`

### deploy.yml
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
          publish_branch: gh-pages
```

**Setup unique (manuel) :** GitHub → Settings → Pages → Source : `gh-pages` branch

### Conventions de commit
Format : `[MODULE] action`
Exemples : `[OSI] ajout flashcards couche 3` / `[PWA] init service worker`
Jamais de commit `update` ou `fix` seuls.

### Checklist avant tout push
- [ ] Chemins relatifs uniquement (pas de `file://` ni chemins absolus)
- [ ] `manifest.json` présent et valide
- [ ] `sw.js` enregistré dans `index.html`
- [ ] `404.html` = copie de `index.html`

---

## Scripts disponibles (PowerShell)
- `autopush.ps1 [-Module NOM]` — watch + push auto (module auto-détecté depuis nom du dossier)
- `recap.ps1 [-Clipboard] [-Last] [-List]` — gestion session-log
- `fin-session.ps1 [-Clipboard]` — push tout + recap en une commande

---

## Interdictions projet
- Ne jamais casser une API existante sans le signaler explicitement
- Ne jamais écrire de chemins absolus dans le code
- Ne jamais commiter sans message au format `[MODULE] action`
- Ne jamais auto-commiter sans confirmation explicite

---

## Économie de tokens
- Réponses minimales : chaque mot doit avoir de la valeur
- Pas de reformulation, résumé ou récapitulatif non demandé
- Code seul si lisible sans explication
- Montrer uniquement le delta si seul un extrait change
- Pas de blocs entiers pour une modification partielle
- Zéro phrase de transition, zéro conclusion générique

---

## Niveau d'effort
Indiquer en début de réponse :
- `→ /ultra` : architecture complète, refonte, multi-fichiers interdépendants
- `→ /high` : nouveau composant complet, algo non trivial, debug complexe
- `→ /medium` : modification ciblée, ajout de feature simple, explication technique
- `→ /low` : correction, question factuelle, delta court

---

## /compact — Gestion du contexte
- Afficher en fin de chaque réponse : `→ Contexte : XX%`
- Seuils :
  - `0–40%` ✅ — rien à faire
  - `40–60%` ⚠️ — `→ /compact conseillé`
  - `60–80%` 🔶 — `/compact` urgent, le signaler clairement
  - `80%+` 🔴 — `→ Nouvelle session recommandée`
- Après `/compact` : résumer en 3 lignes ce qui a été fait avant de continuer
- Sessions longues (>20 échanges) : suggérer `/compact` proactivement
- Si contexte ≥ 80% ET "fin de session" détecté : enchaîner automatiquement récap + `✅ Récap sauvegardé. Relance une nouvelle session et dis "début de session" pour reprendre.`

---

## Idées en fin de réponse
- Terminer chaque réponse pertinente par : `→ Idées : [A] / [B] / [C]`
- 2-3 suggestions max, courtes, contextuelles
- Pas pour les questions factuelles simples

---

## Commande "début de session"
Quand je dis "début de session" / "on reprend" / "nouvelle session" :
1. Lire `session-log.md` dans le dossier courant
2. Extraire le récap le plus récent
3. Afficher :
```
## 🚀 Reprise — [DATE]
### Dernière session : [ce qui avait été fait]
### À faire : [ ] tâche 1 / [ ] tâche 2
### Contexte : > [1-2 phrases]
```
4. Si absent : `⚠️ Pas de session précédente trouvée.`

---

## Commande "fin de session"
Quand je dis "fin de session" / "on s'arrête" / "session terminée" :
1. Générer le récap :
```
## 📋 Récap — [DATE HEURE]
### Fait : [fichiers/fonctionnalités]
### État : [état du projet]
### À reprendre : [ ] tâche 1 / [ ] tâche 2
### Contexte express : > [1-2 phrases]
```
2. Injecter EN TÊTE de `session-log.md` (créer si absent)
3. Confirmer : `✅ Récap sauvegardé dans session-log.md`

---

## Commande "où j'en suis"
Quand je dis "où j'en suis" / "état du projet" :
```
## 📊 État
Contexte : XX% [statut]
Échanges : N
Fait : [résumé session en cours]
Restant : [ ] tâches non finies
```
Ne pas clore la session.
