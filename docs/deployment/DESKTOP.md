# SloerSpace Dev — Desktop Deployment Guide

## Build Targets

| Platform | Output | Location |
|----------|--------|----------|
| Windows | `.exe` raw + `.msi` + `.nsis` installer | `apps/desktop/src-tauri/target/release/bundle/` |
| macOS Intel | `.dmg` | `apps/desktop/src-tauri/target/release/bundle/dmg/` |
| macOS ARM | `.dmg` | `apps/desktop/src-tauri/target/release/bundle/dmg/` |
| Linux | `.AppImage` + `.deb` | `apps/desktop/src-tauri/target/release/bundle/` |

## Prerequisites

```bash
# Install Rust stable
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install Tauri CLI
cargo install tauri-cli --version "^2"

# Install Node.js deps
cd apps/desktop && npm install
```

## Development

```bash
npm run dev:desktop
# or from apps/desktop:
npm run tauri:dev
```

## Production Build

```bash
# From repo root:
npm run build:desktop

# or from apps/desktop:
npm run tauri:build
```

## GitHub Release Workflow

Automated via `.github/workflows/release-desktop.yml`:
1. Triggered on tag push `v*.*.*-desktop`
2. Builds on Windows, macOS (Intel + ARM), Linux via matrix
3. Uploads bundles to GitHub Release

## Version Bump

```bash
# Update version in apps/desktop/src-tauri/tauri.conf.json
# and apps/desktop/package.json
# Then tag: git tag v1.1.0-desktop && git push --tags
```
