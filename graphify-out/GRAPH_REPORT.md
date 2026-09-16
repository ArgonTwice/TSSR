# Graph Report - TSSR  (2026-09-16)

## Corpus Check
- 19 files · ~549,438 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 161 nodes · 382 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1dff6887`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- renderNav
- app.js
- escHtml
- renderExamenQuestion
- renderQCMResults
- processFiles
- sanitizeText
- cliExecCisco
- extractFileContent
- openRevisionDuJour
- renderHome
- data.js
- sw.js
- 📋 Récap — 2026-07-22 (session 32)
- getLB
- renderQCM

## God Nodes (most connected - your core abstractions)
1. `escHtml()` - 22 edges
2. `renderNav()` - 13 edges
3. `showScreen()` - 13 edges
4. `cliExecLinux()` - 13 edges
5. `renderTabContent()` - 12 edges
6. `cliExecCisco()` - 12 edges
7. `openModule()` - 11 edges
8. `renderHome()` - 11 edges
9. `cliExecWindows()` - 11 edges
10. `cliPrint()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `doGlobalSearch()` --calls--> `escHtml()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 2_
- `openModule()` --calls--> `toggleReadingMode()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 6_
- `renderHome()` --calls--> `openModule()`  [EXTRACTED]
  app.js → app.js  _Bridges community 0 → community 10_
- `renderHome()` --calls--> `getDueCards()`  [EXTRACTED]
  app.js → app.js  _Bridges community 10 → community 9_
- `renderHome()` --calls--> `getLB()`  [EXTRACTED]
  app.js → app.js  _Bridges community 10 → community 14_

## Import Cycles
- None detected.

## Communities (16 total, 2 thin omitted)

### Community 0 - "renderNav"
Cohesion: 0.14
Nodes (22): closeSidebar(), doGlobalSearch(), getModStats(), highlightMatch(), initSidebarSearch(), openExamenBlanc(), openGlobalSearch(), openModule() (+14 more)

### Community 1 - "app.js"
Cohesion: 0.11
Nodes (14): CLI_CARDS, GLOSSAIRE, _hash, initFontSize(), KNOWN_MEMBERS, MODULE_GROUPS, _moduleMatch, PdfStore (+6 more)

### Community 2 - "escHtml"
Cohesion: 0.21
Nodes (23): cliClear(), cliExec(), cliExecDiskpart(), cliExecLinux(), _cliExecLinuxCapture(), cliExecWindows(), cliExists(), cliIsDir() (+15 more)

### Community 3 - "renderExamenQuestion"
Cohesion: 0.27
Nodes (11): examenNext(), examenSelect(), openCustomExam(), renderExamenQuestion(), renderExamenResults(), shuffle(), startCustomExam(), startDailyChallenge() (+3 more)

### Community 4 - "renderQCMResults"
Cohesion: 0.28
Nodes (9): fcRate(), flipCard(), getProgress(), qcmSkip(), renderFlashcards(), renderFlashcardView(), renderQCMResults(), setProgress() (+1 more)

### Community 5 - "processFiles"
Cohesion: 0.24
Nodes (13): formatFileSize(), generateSummaryFromFile(), getFileIcon(), makeLinksClickable(), openFileFullscreen(), _pdfB64ToUrl(), renderNotes(), makeFileCard() (+5 more)

### Community 6 - "sanitizeText"
Cohesion: 0.24
Nodes (12): openAIExplainer(), openCours(), renderCours(), renderCoursContent(), renderCoursDetail(), renderCoursIndex(), renderSchema(), renderSection() (+4 more)

### Community 7 - "cliExecCisco"
Cohesion: 0.48
Nodes (7): _ciscoNormalizeIf(), _ciscoShow(), _ciscoShowRunningConfig(), _ciscoShowVersion(), cliExecCisco(), _ios(), _maskToCidr()

### Community 8 - "extractFileContent"
Cohesion: 0.40
Nodes (5): extractDOCX(), extractFileContent(), extractPDF(), loadScript(), sanitizeHtmlContent()

### Community 9 - "openRevisionDuJour"
Cohesion: 0.40
Nodes (5): flipRevCard(), getDueCards(), openRevisionDuJour(), renderRevisionView(), revRate()

### Community 10 - "renderHome"
Cohesion: 0.29
Nodes (8): getExamHistory(), getFavorites(), goHome(), openExamenDetail(), openExamHistory(), renderHome(), saveExamenAttempt(), toggleFavorite()

### Community 13 - "📋 Récap — 2026-07-22 (session 32)"
Cohesion: 0.17
Nodes (11): Archive, Contexte express :, Contexte express :, Fait :, Fait :, 📋 Récap — 2026-07-22 (session 32), 📋 Récap — 2026-09-16 (session 33), À reprendre : (+3 more)

### Community 14 - "getLB"
Cohesion: 0.40
Nodes (5): addLB(), getLB(), openLeaderboard(), renderDashboard(), renderLeaderboard()

### Community 15 - "renderQCM"
Cohesion: 0.40
Nodes (5): getQCMWeak(), qcmNext(), qcmSelect(), renderQCM(), renderQCMQuestion()

## Knowledge Gaps
- **23 isolated node(s):** `Fait :`, `État :`, `À reprendre :`, `Contexte express :`, `Fait :` (+18 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 30 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `escHtml()` connect `escHtml` to `renderNav`, `app.js`, `processFiles`, `sanitizeText`, `getLB`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **Why does `renderNotes()` connect `processFiles` to `renderNav`, `app.js`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **Why does `setupFileUpload()` connect `processFiles` to `app.js`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `Fait :`, `État :`, `À reprendre :` to the rest of the system?**
  _23 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `renderNav` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._