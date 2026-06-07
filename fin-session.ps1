# fin-session.ps1 — Fin de session TSSR : push tout + injecte le recap
# Usage :
#   .\fin-session.ps1              → push les modifs en cours + ouvre notepad pour le recap
#   .\fin-session.ps1 -Clipboard   → idem mais lit le recap depuis le presse-papier
#   .\fin-session.ps1 -Module OSI  → force le label du module dans le commit

param(
    [string]$Module = "",
    [switch]$Clipboard
)

$PROJECT_ROOT = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($PROJECT_ROOT)) {
    $PROJECT_ROOT = Get-Location
}

Set-Location $PROJECT_ROOT
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "  FIN DE SESSION TSSR"
Write-Host "  $(Get-Date -Format 'dddd dd MMMM yyyy, HH:mm')"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""

# ─── 1. Auto-détection module ──────────────────────────────
if ([string]::IsNullOrWhiteSpace($Module)) {
    $Module = (Split-Path -Leaf $PROJECT_ROOT).ToUpper()
}

# ─── 2. Push des modifications en cours ───────────────────
git rev-parse --git-dir 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Pas dans un repo git"
    exit 1
}

$status = git status --porcelain 2>$null
if ($status) {
    Write-Host "📦 Modifications détectées, commit en cours..."

    $tracked   = git diff --name-only HEAD 2>$null
    $untracked = git ls-files --others --exclude-standard 2>$null
    $allChanged = @($tracked) + @($untracked) | Where-Object { $_ } | Select-Object -Unique
    $label = ($allChanged | Select-Object -First 4) -join ", "
    if ($allChanged.Count -gt 4) { $label += " +$($allChanged.Count - 4)" }

    git add .
    git commit -m "[$Module] fin de session: $label"
    git push origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Push OK — $label"
    } else {
        Write-Host "⚠️  Push échoué — vérifie ta connexion ou tes credentials"
    }
} else {
    Write-Host "✅ Rien à commiter, repo propre"
}

Write-Host ""

# ─── 3. Recap ──────────────────────────────────────────────
$LOG = Join-Path $PROJECT_ROOT "session-log.md"
if (-not (Test-Path $LOG)) {
    Write-Host "⚠️  session-log.md introuvable, recap ignoré"
    exit 0
}

Write-Host "📋 Récap de session..."
Write-Host ""

if ($Clipboard) {
    $content = Get-Clipboard
    if ([string]::IsNullOrWhiteSpace($content)) {
        Write-Host "⚠️  Presse-papier vide — copie le /recap depuis Claude d'abord"
        Write-Host "   Relance ensuite : .\fin-session.ps1 -Clipboard"
        exit 1
    }
    Write-Host "   Lu depuis le presse-papier ✓"
} else {
    $tmp = [System.IO.Path]::GetTempFileName() + ".md"
    @"
# Colle ici le résumé /recap généré par Claude
# Sauvegarde (Ctrl+S) et ferme notepad pour terminer la session
# Les lignes commençant par # sont ignorées

"@ | Set-Content $tmp -Encoding UTF8
    Write-Host "   Notepad s'ouvre — colle ton /recap, sauvegarde, ferme."
    Start-Process notepad $tmp -Wait
    $content = Get-Content $tmp -Raw -Encoding UTF8
    Remove-Item $tmp -ErrorAction SilentlyContinue
}

$content = ($content -split "`n" | Where-Object { $_ -notmatch "^#" }) -join "`n"
$content = $content.Trim()

if ([string]::IsNullOrWhiteSpace($content)) {
    Write-Host "⚠️  Recap vide, ignoré"
} else {
    $DATE = Get-Date -Format "yyyy-MM-dd HH:mm"
    $MARKER_START = "<!-- SESSIONS_START -->"
    $lines = Get-Content $LOG -Encoding UTF8
    $entry = "`n---`n`n$content`n"
    $output = @()
    foreach ($line in $lines) {
        $output += $line
        if ($line -match [regex]::Escape($MARKER_START)) { $output += $entry }
    }
    $output | Set-Content $LOG -Encoding UTF8
    Write-Host "✅ Recap injecté dans session-log.md"

    git add $LOG
    git commit -m "[LOG] recap $DATE"
    git push origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ session-log.md pushé"
    }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host "  Session terminée. À bientôt !"
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
Write-Host ""
