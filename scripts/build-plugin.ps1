$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$pluginDir = Join-Path $root 'wp-plugin\simplyit-chatbot'
$assetsDir = Join-Path $pluginDir 'assets'
$cssDir = Join-Path $assetsDir 'css'
$jsDir = Join-Path $assetsDir 'js'
$vendorDir = Join-Path $assetsDir 'vendor'
$fontsDir = Join-Path $assetsDir 'fonts'
$fontsFilesDir = Join-Path $fontsDir 'files'
$imgDir = Join-Path $assetsDir 'img'

New-Item -ItemType Directory -Force $cssDir | Out-Null
New-Item -ItemType Directory -Force $jsDir | Out-Null
New-Item -ItemType Directory -Force $vendorDir | Out-Null
New-Item -ItemType Directory -Force $fontsFilesDir | Out-Null
New-Item -ItemType Directory -Force $imgDir | Out-Null

Copy-Item (Join-Path $root 'dist\tailwind.css') (Join-Path $cssDir 'tailwind.css') -Force
Copy-Item (Join-Path $root 'chatbot.css') (Join-Path $cssDir 'chatbot.css') -Force
Copy-Item (Join-Path $root 'main.js') (Join-Path $jsDir 'main.js') -Force
Copy-Item (Join-Path $root 'vendor\showdown.min.js') (Join-Path $vendorDir 'showdown.min.js') -Force

Copy-Item (Join-Path $root 'fonts\inter.css') (Join-Path $fontsDir 'inter.css') -Force
Copy-Item (Join-Path $root 'fonts\400.css') (Join-Path $fontsDir '400.css') -Force
Copy-Item (Join-Path $root 'fonts\500.css') (Join-Path $fontsDir '500.css') -Force
Copy-Item (Join-Path $root 'fonts\600.css') (Join-Path $fontsDir '600.css') -Force
Copy-Item (Join-Path $root 'fonts\700.css') (Join-Path $fontsDir '700.css') -Force
Copy-Item (Join-Path $root 'fonts\files\*') $fontsFilesDir -Force
Copy-Item (Join-Path $root 'img\*') $imgDir -Force
