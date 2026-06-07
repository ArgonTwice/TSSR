# autopush.ps1 — Surveille les modifications et push automatiquement
# Usage :
#   .\autopush.ps1                    → module auto-détecté depuis le dossier courant
#   .\autopush.ps1 -Module OSI        → module forcé
#   .\autopush.ps1 -Interval 10       → intervalle en secondes (défaut: 5)
#   Ctrl+C pour arrêter

param(
    [string]$Module = "",
    [int]$Interval = 5
)

# Auto-détection du module depuis le nom du dossier courant
if ([string]::IsNullOrWhiteSpace($Module)) {
    $Module = (Split-Path -Leaf (Get-Location)).ToUpper()
    Write-Host "📁 Module auto-détecté : $Module"
}

git rev-parse --git-dir 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Pas dans un repo git"
    exit 1
}

Write-Host "👀 Watching [$Module] — toutes les ${Interval}s — Ctrl+C pour arrêter"
Write-Host ""

while ($true) {
    Start-Sleep -Seconds $Interval

    $status = git status --porcelain 2>$null
    if (-not $status) { continue }

    # Récupère les fichiers modifiés (trackés + nouveaux)
    $tracked = git diff --name-only HEAD 2>$null
    $untracked = git ls-files --others --exclude-standard 2>$null
    $allChanged = @($tracked) + @($untracked) | Where-Object { $_ } | Select-Object -Unique

    $label = ($allChanged | Select-Object -First 4) -join ", "
    if ($allChanged.Count -gt 4) { $label += " +$($allChanged.Count - 4) autres" }

    git add . 2>$null
    git commit -m "[$Module] auto: $label" 2>$null
    git push origin main 2>$null

    $ts = Get-Date -Format "HH:mm:ss"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $ts → $label"
    } else {
        Write-Host "⚠️  $ts → push échoué (réseau ?)"
    }
}
