$ErrorActionPreference = 'Stop'

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$pluginDir = Join-Path $root 'wp-plugin\simplyit-chatbot'
$assetsDir = Join-Path $pluginDir 'assets'
$cssDir = Join-Path $assetsDir 'css'
$jsDir = Join-Path $assetsDir 'js'
$vendorDir = Join-Path $assetsDir 'vendor'
$imgDir = Join-Path $assetsDir 'img'

New-Item -ItemType Directory -Force $cssDir | Out-Null
New-Item -ItemType Directory -Force $jsDir | Out-Null
New-Item -ItemType Directory -Force $vendorDir | Out-Null
New-Item -ItemType Directory -Force $imgDir | Out-Null

$pluginFontsDir = Join-Path $assetsDir 'fonts'
if (Test-Path $pluginFontsDir) {
    Remove-Item $pluginFontsDir -Recurse -Force
}

Copy-Item (Join-Path $root 'dist\tailwind.css') (Join-Path $cssDir 'tailwind.css') -Force
Copy-Item (Join-Path $root 'chatbot.css') (Join-Path $cssDir 'chatbot.css') -Force
Copy-Item (Join-Path $root 'main.js') (Join-Path $jsDir 'main.js') -Force
Copy-Item (Join-Path $root 'vendor\showdown.min.js') (Join-Path $vendorDir 'showdown.min.js') -Force
Copy-Item (Join-Path $root 'img\*') $imgDir -Force
