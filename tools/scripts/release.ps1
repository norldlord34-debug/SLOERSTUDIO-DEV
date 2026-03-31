<#
.SYNOPSIS
  SloerStudio — Release Script
.DESCRIPTION
  Tags and triggers a release for a specific app.
.PARAMETER App
  Which app to release: web | desktop | voice
.PARAMETER Version
  Version to release (e.g. 1.1.0)
.EXAMPLE
  .\tools\scripts\release.ps1 -App desktop -Version 1.1.0
#>

param(
  [Parameter(Mandatory=$true)]
  [ValidateSet("web", "desktop", "voice")]
  [string]$App,

  [Parameter(Mandatory=$true)]
  [string]$Version
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "  SloerStudio Release: $App v$Version" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Set-Location $Root

$Tag = "v$Version-$App"

Write-Host "Creating git tag: $Tag" -ForegroundColor Cyan
git tag -a $Tag -m "Release $App v$Version"
if ($LASTEXITCODE -ne 0) { Write-Host "✗ Failed to create tag" -ForegroundColor Red; exit 1 }

Write-Host "Pushing tag..." -ForegroundColor Cyan
git push origin $Tag
if ($LASTEXITCODE -ne 0) { Write-Host "✗ Failed to push tag" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "✓ Release $Tag triggered!" -ForegroundColor Green
Write-Host "  Monitor: https://github.com/norldlord34-debug/SLOERSTUDIO-DEV/actions" -ForegroundColor Gray
