<#
.SYNOPSIS
  SloerStudio — Build All Applications
.DESCRIPTION
  Builds all SloerStudio products from the monorepo root.
  Use -App to target a specific app.
.PARAMETER App
  Which app to build: all | web | desktop | voice
.PARAMETER SkipInstall
  Skip npm install step
.EXAMPLE
  .\tools\scripts\build-all.ps1
  .\tools\scripts\build-all.ps1 -App web
  .\tools\scripts\build-all.ps1 -App desktop -SkipInstall
#>

param(
  [ValidateSet("all", "web", "desktop", "voice")]
  [string]$App = "all",
  [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  SloerStudio — Enterprise Build System" -ForegroundColor White
Write-Host "  Target: $App" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

function Step([string]$msg) {
  Write-Host "► $msg" -ForegroundColor Cyan
}

function Success([string]$msg) {
  Write-Host "✓ $msg" -ForegroundColor Green
}

function Fail([string]$msg) {
  Write-Host "✗ $msg" -ForegroundColor Red
  exit 1
}

# Install dependencies
if (-not $SkipInstall) {
  Step "Installing dependencies..."
  Set-Location $Root
  npm install
  if ($LASTEXITCODE -ne 0) { Fail "npm install failed" }
  Success "Dependencies installed"
}

# Build web
function Build-Web {
  Step "Building SloerStudio Web (apps/web)..."
  Set-Location "$Root\apps\web"
  npx prisma generate
  npm run build
  if ($LASTEXITCODE -ne 0) { Fail "Web build failed" }
  Success "SloerStudio Web built successfully"
}

# Build desktop
function Build-Desktop {
  Step "Building SloerSpace Dev (apps/desktop)..."
  Set-Location "$Root\apps\desktop"
  npm run tauri:build
  if ($LASTEXITCODE -ne 0) { Fail "Desktop build failed" }
  Success "SloerSpace Dev built successfully"
  Write-Host "  Artifacts: apps\desktop\src-tauri\target\release\bundle\" -ForegroundColor Gray
}

# Build voice
function Build-Voice {
  Step "Building SloerVoice (apps/voice)..."
  if (-not (Test-Path "$Root\apps\voice\src-tauri\ggml-base.en.bin")) {
    Write-Host "  ⚠ Whisper model not found. Download ggml-base.en.bin to apps/voice/src-tauri/" -ForegroundColor Yellow
  }
  Set-Location "$Root\apps\voice"
  npm run tauri:build
  if ($LASTEXITCODE -ne 0) { Fail "Voice build failed" }
  Success "SloerVoice built successfully"
}

switch ($App) {
  "web"     { Build-Web }
  "desktop" { Build-Desktop }
  "voice"   { Build-Voice }
  "all"     {
    Build-Web
    Build-Desktop
    Build-Voice
  }
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  ✓ Build complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
