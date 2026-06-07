# recap.ps1 — Injecte un résumé de session dans session-log.md
# Usage :
#   .\recap.ps1                  → ouvre notepad pour coller le recap
#   .\recap.ps1 -Clipboard       → lit directement depuis le presse-papier
#   .\recap.ps1 -File recap.txt  → lit depuis un fichier
#   .\recap.ps1 -Last            → affiche la dernière session
#   .\recap.ps1 -List            → liste toutes les dates

param(
    [string]$File,
    [switch]$Clipboard,
    [switch]$Last,
    [switch]$List
)

$LOG = "session-log.md"
$MARKER_START = "<!-- SESSIONS_START -->"
$DATE = Get-Date -Format "yyyy-MM-dd HH:mm"

if (-not (Test-Path $LOG)) {
    Write-Error "❌ $LOG introuvable — lance depuis la racine du projet"
    exit 1
}

$lines = Get-Content $LOG -Encoding UTF8

# ─── --Last ────────────────────────────────────────────────
if ($Last) {
    $inBlock = $false; $count = 0
    foreach ($line in $lines) {
        if ($line -match [regex]::Escape($MARKER_START)) { $inBlock = $true; continue }
        if ($line -eq "---" -and $count -gt 5) { break }
        if ($inBlock) { Write-Host $line; $count++ }
    }
    exit 0
}

# ─── --List ────────────────────────────────────────────────
if ($List) {
    $i = 1
    $lines | Select-String "📋 Résumé session —" | ForEach-Object {
        $d = $_.Line -replace ".*📋 Résumé session — ", ""
        Write-Host "$i. $d"
        $i++
    }
    exit 0
}

# ─── Lecture du contenu ────────────────────────────────────
if ($Clipboard) {
    $content = Get-Clipboard
    if ([string]::IsNullOrWhiteSpace($content)) {
        Write-Error "❌ Presse-papier vide"
        exit 1
    }
    Write-Host "📋 Contenu lu depuis le presse-papier"
} elseif ($File) {
    if (-not (Test-Path $File)) { Write-Error "❌ $File introuvable"; exit 1 }
    $content = Get-Content $File -Raw -Encoding UTF8
} else {
    $tmp = [System.IO.Path]::GetTempFileName() + ".md"
    @"
# Colle ici le résumé /recap généré par Claude
# Sauvegarde (Ctrl+S) et ferme notepad pour continuer
# Les lignes commençant par # sont ignorées

"@ | Set-Content $tmp -Encoding UTF8
    Start-Process notepad $tmp -Wait
    $content = Get-Content $tmp -Raw -Encoding UTF8
    Remove-Item $tmp -ErrorAction SilentlyContinue
}

$content = ($content -split "`n" | Where-Object { $_ -notmatch "^#" }) -join "`n"
$content = $content.Trim()

if ([string]::IsNullOrWhiteSpace($content)) {
    Write-Error "❌ Contenu vide, rien injecté"
    exit 1
}

# ─── Injection dans le log ─────────────────────────────────
$entry = "`n---`n`n$content`n"
$output = @()
foreach ($line in $lines) {
    $output += $line
    if ($line -match [regex]::Escape($MARKER_START)) {
        $output += $entry
    }
}

$output | Set-Content $LOG -Encoding UTF8
Write-Host "✅ Session injectée dans $LOG ($DATE)"

# ─── Auto-commit ───────────────────────────────────────────
git rev-parse --git-dir 2>$null | Out-Null
if ($LASTEXITCODE -eq 0) {
    git add $LOG
    git commit -m "[LOG] recap $DATE"
    git push origin main
    Write-Host "✅ Pushé sur main"
}
