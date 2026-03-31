# Monorepo Architecture — SloerStudio

## Overview

SLOERSTUDIO-DEV is an **npm workspaces monorepo** following Google's internal monorepo principles:
- Single source of truth for all SloerStudio products
- Shared packages with strict version contracts
- Turborepo task orchestration for caching and parallel builds
- Clean boundary enforcement between `apps/` and `packages/`

## Directory Contract

```
SLOERSTUDIO-DEV/
│
├── apps/           # Deployable products — NO shared code here
│   ├── desktop/    # SloerSpace Dev — Tauri + Next.js + Rust
│   ├── web/        # SloerStudio Web — Next.js + Prisma + Auth
│   └── voice/      # SloerVoice — Tauri + Vite + Whisper.rs
│
├── packages/       # Internal shared packages — versioned independently
│   ├── ui/         # @sloerstudio/ui — design tokens & components
│   ├── config/     # @sloerstudio/config — ESLint/TS/Tailwind configs
│   ├── types/      # @sloerstudio/types — shared TypeScript types
│   └── utils/      # @sloerstudio/utils — shared utility functions
│
├── infrastructure/ # Infrastructure as Code
│   ├── docker/     # Dockerfiles + compose
│   └── nginx/      # Reverse proxy config
│
├── docs/           # Architecture Decision Records + guides
├── tools/          # Internal scripts and generators
├── brand/          # Brand assets and guidelines
└── .github/        # CI/CD workflows
```

## Dependency Rules

```
apps/* → can import from packages/*
apps/* → CANNOT import from other apps/*
packages/* → can import from other packages/*
packages/* → CANNOT import from apps/*
```

## Build System

- **Turborepo** (`turbo.json`) — task graph with caching
- **npm workspaces** — dependency hoisting and linking
- Each app/package has its own `package.json` with explicit dependencies

## Technology Matrix

| App | Frontend | Backend | Build |
|-----|----------|---------|-------|
| `apps/desktop` | Next.js 14 + React 18 | Tauri 2 + Rust | Tauri bundler |
| `apps/web` | Next.js 16 + React 19 | Node.js (Next API Routes) | Next.js |
| `apps/voice` | Vite + React 19 | Tauri 2 + Rust + whisper.rs | Tauri bundler |

## CI/CD Strategy

Each app has its own GitHub Actions workflow:
- `ci-web.yml` — lint, typecheck, build, deploy to Vercel/Railway
- `release-desktop.yml` — build for Win/macOS/Linux, attach to GitHub Release
- `release-voice.yml` — build for Win/macOS/Linux, attach to GitHub Release

## Architecture Decision Records

See `docs/architecture/ADR.md` for all major architectural decisions.
