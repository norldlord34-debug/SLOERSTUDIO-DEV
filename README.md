# SloerStudio — Enterprise Agentic Development Platform

<div align="center">
  <img src="./brand/logos/company-logo.jpg" alt="SloerStudio" width="120" />
  <br /><br />
  <strong>The platform for developers who build at the speed of thought.</strong>
  <br />
  Deploy AI agent swarms · Run persistent terminals · Dictate with your voice
  <br /><br />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" />
  <img src="https://img.shields.io/badge/License-MIT-green" />
  <img src="https://img.shields.io/badge/Built%20with-Tauri%202%20%2B%20Rust-orange" />
  <img src="https://img.shields.io/badge/Monorepo-npm%20workspaces-purple" />
</div>

---

## Products

| Product | Location | Description | Status |
|---------|----------|-------------|--------|
| **SloerSpace Dev** | `apps/desktop` | Agentic IDE — Tauri 2 + Next.js 14 + Rust | ✅ v1.0.0 |
| **SloerStudio Web** | `apps/web` | Web platform — Next.js 16 + Prisma + Auth | ✅ v1.0.0 |
| **SloerVoice** | `apps/voice` | On-device voice dictation — Tauri 2 + Whisper.rs | ✅ v0.1.0 |

## Monorepo Structure

```
SLOERSTUDIO-DEV/
├── apps/
│   ├── desktop/        # SloerSpace Dev — cross-platform agentic IDE
│   ├── web/            # SloerStudio Web — web platform & admin
│   └── voice/          # SloerVoice — on-device Whisper AI dictation
├── packages/
│   ├── ui/             # Shared design system & components
│   ├── config/         # Shared ESLint / TS / Tailwind configs
│   ├── types/          # Shared TypeScript type definitions
│   └── utils/          # Shared utility functions
├── infrastructure/
│   ├── docker/         # Dockerfiles & compose configs
│   └── nginx/          # Reverse proxy configuration
├── docs/
│   ├── architecture/   # ADRs & system diagrams
│   ├── deployment/     # Per-app deployment guides
│   └── api/            # API reference
├── tools/
│   ├── scripts/        # Build, release & maintenance scripts
│   └── generators/     # Code generators
├── brand/
│   ├── logos/          # Official logo assets
│   └── guidelines/     # Brand guidelines
└── .github/
    └── workflows/      # CI/CD pipelines per app
```

## Getting Started

### Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Rust** (stable) — for Tauri apps
- **Tauri CLI** — `cargo install tauri-cli`

### Install All Dependencies

```bash
npm install
```

### Development

```bash
# Web platform
npm run dev:web

# Desktop IDE (SloerSpace Dev)
npm run dev:desktop

# Voice app (SloerVoice)
npm run dev:voice
```

### Building

```bash
# Build web platform
npm run build:web

# Build desktop app (produces .exe, .msi, .dmg, .AppImage)
npm run build:desktop

# Build voice app
npm run build:voice

# Build everything
npm run build:all
```

### Database (Web Platform)

```bash
# Seed first admin user (admin@sloerstudio.com / SloerAdmin2025!)
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Apps

### SloerSpace Dev (`apps/desktop`)
Cross-platform agentic desktop IDE built with Tauri 2 + Next.js 14 + Rust.
- Persistent PTY terminal (portable-pty + xterm.js)
- SloerSwarm multi-agent orchestration (5-step wizard)
- SloerCanvas free-form canvas runtime
- AI Chat Panel (OpenAI, Anthropic, Gemini, Ollama)
- 15 built-in themes

**Run:** `npm run dev:desktop` | **Build:** `npm run build:desktop`

### SloerStudio Web (`apps/web`)
Enterprise web platform — login, dashboard, admin, and billing.
- NextAuth v4 + JWT sessions
- Prisma 5 (SQLite dev / PostgreSQL prod)
- Redis rate limiting (Upstash)
- Super admin at `/admin`

**Run:** `npm run dev:web` | **Build:** `npm run build:web`
**Admin:** `admin@sloerstudio.com` / `SloerAdmin2025!`

### SloerVoice (`apps/voice`)
On-device voice dictation powered by Whisper AI.
- 100% local inference via whisper.rs
- Tauri 2 + Vite + React 19
- Push-to-talk / toggle modes
- Universal text injection

**Run:** `npm run dev:voice` | **Build:** `npm run build:voice`

> ⚠️ SloerVoice requires a Whisper model binary in `apps/voice/src-tauri/`.
> Download from: https://huggingface.co/ggerganov/whisper.cpp

## Environment Setup

See [`apps/web/ENV_SETUP.md`](./apps/web/ENV_SETUP.md) for production environment configuration.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Security

See [SECURITY.md](./SECURITY.md). Report vulnerabilities to security@sloerstudio.com.

## License

MIT © 2025 SloerStudio. See [LICENSE](./LICENSE).
