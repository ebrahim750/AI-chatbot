$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$vendorDir = Join-Path $root 'vendor'
$fontsDir = Join-Path $root 'fonts'
$fontsFilesDir = Join-Path $fontsDir 'files'

New-Item -ItemType Directory -Force $vendorDir | Out-Null
New-Item -ItemType Directory -Force $fontsDir | Out-Null
New-Item -ItemType Directory -Force $fontsFilesDir | Out-Null

# Showdown
$showdownSrc = Join-Path $root 'node_modules\showdown\dist\showdown.min.js'
$showdownDest = Join-Path $vendorDir 'showdown.min.js'
Copy-Item $showdownSrc $showdownDest -Force

# Inter font (weights used in the UI)
$interSrc = Join-Path $root 'node_modules\@fontsource\inter'
Copy-Item (Join-Path $interSrc 'files\*') $fontsFilesDir -Force

Copy-Item (Join-Path $interSrc '400.css') (Join-Path $fontsDir '400.css') -Force
Copy-Item (Join-Path $interSrc '500.css') (Join-Path $fontsDir '500.css') -Force
Copy-Item (Join-Path $interSrc '600.css') (Join-Path $fontsDir '600.css') -Force
Copy-Item (Join-Path $interSrc '700.css') (Join-Path $fontsDir '700.css') -Force

$interCss = @(
  '@import "./400.css";',
  '@import "./500.css";',
  '@import "./600.css";',
  '@import "./700.css";'
) -join "`r`n"

Set-Content -Path (Join-Path $fontsDir 'inter.css') -Value $interCss -Encoding UTF8
