# inject_cours.ps1
# A placer dans C:\Users\Agnol\Desktop\TSSR

$source  = "C:\Users\Agnol\Desktop\Capture pour TSSR"
$datajs  = "C:\Users\Agnol\Desktop\TSSR\data.js"
$repoDir = "C:\Users\Agnol\Desktop\TSSR"

$files = Get-ChildItem -Path $source -Filter "*.html" | Sort-Object Name

$tousLesBlocs = ""

foreach ($file in $files) {
    $html    = Get-Content $file.FullName -Raw -Encoding UTF8
    $titre   = if ($html -match '<h3>([^<]+)</h3>') { $matches[1].Trim() } else { $file.BaseName }
    $contenu = if ($html -match '<div class="box py-3 contents">([\s\S]+?)</div></div><div class="box py-3 branchbutton') { $matches[1].Trim() } else { "" }

    if (-not $contenu) {
        Write-Host "Contenu non trouvé dans $($file.Name), ignoré."
        continue
    }

    # Échapper pour template literal JS
    $contenu = $contenu -replace '\\', '\\\\'
    $contenu = $contenu -replace '`', '\`'
    $contenu = $contenu -replace '\$\{', '\${'

    $titreEscaped = $titre -replace "'", "\'"

    $bloc = @"
      {
        id: '$($file.BaseName)',
        titre: '$titreEscaped',
        sections: [
          { type: 'html', content: ``$($contenu)`` },
        ],
      },
"@

    $tousLesBlocs += $bloc + "`n"
    Write-Host "Préparé : $titre"
}

if (-not $tousLesBlocs) {
    Write-Host "Aucun fichier traité."
    exit
}

# Injection unique — MatchEvaluator évite les problèmes d'échappement $ dans la chaîne de remplacement
$dataContent = Get-Content $datajs -Raw -Encoding UTF8
$dataContent = [regex]::Replace(
    $dataContent,
    "(id: 'numerisation'[\s\S]+?cours: \[)",
    { param($m) $m.Value + "`n" + $tousLesBlocs }
)
Set-Content $datajs -Value $dataContent -Encoding UTF8

Write-Host "Injection terminée — $($files.Count) fichier(s) traité(s)."

# Git push
Set-Location $repoDir
git add data.js
git commit -m "[Numération] injection cours HTML automatique"
git push origin main

Write-Host "Terminé."
