# Graph Report - TSSR  (2026-09-16)

## Corpus Check
- 19 files · ~559,331 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 149 nodes · 371 edges · 13 communities (11 shown, 2 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `da8b9464`
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
- getExamHistory
- data.js
- sw.js

## God Nodes (most connected - your core abstractions)
1. `escHtml()` - 22 edges
2. `renderNav()` - 13 edges
3. `cliExecLinux()` - 13 edges
4. `showScreen()` - 13 edges
5. `renderTabContent()` - 12 edges
6. `cliExecCisco()` - 12 edges
7. `renderHome()` - 11 edges
8. `openModule()` - 11 edges
9. `cliExecWindows()` - 11 edges
10. `cliPrint()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `renderCLI()` --indirect_call--> `cliKeydown()`  [INFERRED]
  app.js → app.js  _Bridges community 0 → community 2_
- `renderHome()` --calls--> `getLB()`  [EXTRACTED]
  app.js → app.js  _Bridges community 3 → community 0_
- `renderQCMResults()` --calls--> `addLB()`  [EXTRACTED]
  app.js → app.js  _Bridges community 3 → community 4_
- `renderLeaderboard()` --calls--> `escHtml()`  [EXTRACTED]
  app.js → app.js  _Bridges community 3 → community 2_
- `openModule()` --calls--> `getModStats()`  [EXTRACTED]
  app.js → app.js  _Bridges community 1 → community 0_

## Import Cycles
- None detected.

## Communities (13 total, 2 thin omitted)

### Community 0 - "renderNav"
Cohesion: 0.14
Nodes (25): closeSidebar(), doGlobalSearch(), getFavorites(), goHome(), highlightMatch(), initSidebarSearch(), openExamenBlanc(), openGlobalSearch() (+17 more)

### Community 1 - "app.js"
Cohesion: 0.10
Nodes (16): CLI_CARDS, getModStats(), GLOSSAIRE, _hash, initFontSize(), KNOWN_MEMBERS, MODULE_GROUPS, _moduleMatch (+8 more)

### Community 2 - "escHtml"
Cohesion: 0.23
Nodes (21): cliClear(), cliExec(), cliExecDiskpart(), cliExecLinux(), _cliExecLinuxCapture(), cliExecWindows(), cliExists(), cliIsDir() (+13 more)

### Community 3 - "renderExamenQuestion"
Cohesion: 0.17
Nodes (16): addLB(), examenNext(), examenSelect(), getLB(), openCustomExam(), openLeaderboard(), renderDashboard(), renderExamenQuestion() (+8 more)

### Community 4 - "renderQCMResults"
Cohesion: 0.18
Nodes (14): fcRate(), flipCard(), getProgress(), getQCMWeak(), qcmNext(), qcmSelect(), qcmSkip(), renderFlashcards() (+6 more)

### Community 5 - "processFiles"
Cohesion: 0.24
Nodes (13): formatFileSize(), generateSummaryFromFile(), getFileIcon(), makeLinksClickable(), openFileFullscreen(), _pdfB64ToUrl(), renderNotes(), makeFileCard() (+5 more)

### Community 6 - "sanitizeText"
Cohesion: 0.24
Nodes (12): openAIExplainer(), openCours(), renderCours(), renderCoursContent(), renderCoursDetail(), renderCoursIndex(), renderSchema(), renderSection() (+4 more)

### Community 7 - "cliExecCisco"
Cohesion: 0.39
Nodes (8): _ciscoNormalizeIf(), _ciscoShow(), _ciscoShowRunningConfig(), _ciscoShowVersion(), cliExecCisco(), _ios(), makeCLIState(), _maskToCidr()

### Community 8 - "extractFileContent"
Cohesion: 0.40
Nodes (5): extractDOCX(), extractFileContent(), extractPDF(), loadScript(), sanitizeHtmlContent()

### Community 9 - "openRevisionDuJour"
Cohesion: 0.40
Nodes (5): flipRevCard(), getDueCards(), openRevisionDuJour(), renderRevisionView(), revRate()

### Community 10 - "getExamHistory"
Cohesion: 0.50
Nodes (4): getExamHistory(), openExamenDetail(), openExamHistory(), saveExamenAttempt()

## Knowledge Gaps
- **14 isolated node(s):** `store`, `SHORTCUTS`, `GLOSSAIRE`, `state`, `MODULE_GROUPS` (+9 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 21 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `escHtml()` connect `escHtml` to `renderNav`, `app.js`, `renderExamenQuestion`, `processFiles`, `sanitizeText`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `renderNotes()` connect `processFiles` to `renderNav`, `app.js`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `setupFileUpload()` connect `processFiles` to `app.js`?**
  _High betweenness centrality (0.004) - this node is a cross-community bridge._
- **What connects `store`, `SHORTCUTS`, `GLOSSAIRE` to the rest of the system?**
  _14 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `renderNav` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._
- **Should `app.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09956709956709957 - nodes in this community are weakly interconnected._