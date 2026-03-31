# Changelog — SloerStudio

All notable changes across all products are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Added
- Monorepo restructure: SLOERSTUDIO-DEV (apps/desktop, apps/web, apps/voice)
- Shared packages: @sloerstudio/ui, @sloerstudio/types, @sloerstudio/utils, @sloerstudio/config
- Docker + Nginx infrastructure setup
- CI/CD GitHub Actions workflows for all 3 apps
- Enterprise ADRs and deployment documentation

---

## apps/desktop — SloerSpace Dev

### [1.0.0] — 2025-04-01

#### Added
- Persistent PTY terminal engine (portable-pty + xterm.js)
- Multi-pane layouts: 1×1 to 4×4 grid
- SloerSwarm 5-step agent launch wizard (Roster → Mission → Directory → Context → Launch)
- SloerCanvas — free-form draggable canvas runtime with 1–12 terminal threads
- AI Chat Panel — OpenAI, Anthropic, Google Gemini, Ollama local
- SiulkVoice integration in TitleBar pill widget
- 15 built-in themes with full CSS variable coverage
- Command palette (Ctrl+K) with starred commands, snippets, AI commands
- Kanban board with 5 columns (Todo → Done)
- Tauri desktop notifications on swarm agent completion
- Agent auto-resolution via `get_agent_cli_resolutions` Rust command
- Session timelines and live PTY streaming with ordered sequence delivery
- PTY interactive input (`write_terminal_session_input`)
- 7 CLI agents: Claude, Codex, Gemini, OpenCode, Cursor, Droid, Copilot
- 25 views / navigation entries in the IDE

---

## apps/web — SloerStudio Web Platform

### [1.0.0] — 2025-04-01

#### Added
- 46-route Next.js 16 web platform
- NextAuth v4 credentials + JWT sessions
- Prisma 5 SQLite (dev) / PostgreSQL (prod) schema with 11 models
- RBAC proxy middleware (USER / ADMIN / SUPER_ADMIN roles)
- Upstash Redis rate limiting (auth: 10/15m, api: 100/min)
- Audit log trail for all sensitive actions
- Marketing site: homepage, pricing, roadmap, all product pages
- App dashboard: projects, kanban, agents, prompts, skills, API keys, billing, settings
- Admin panel at /admin: users, analytics (Recharts), subscriptions, settings
- 3-tier pricing: Free / Studio $16/mo / Enterprise $40/mo
- Libraries pages: agents, prompts, skills (gated for Pro)
- Community pages: blog, discord, docs, events, open-source
- Stripe billing UI (Stripe backend integration pending)
- Bug bounty program page
- Brand guidelines and design tokens

---

## apps/voice — SloerVoice

### [1.0.0] — 2025-04-01

#### Added
- Tauri 2 desktop app with Vite + React 19 frontend
- 100% on-device Whisper AI transcription via whisper.rs
- Audio capture via cpal (cross-platform)
- Push-to-talk and toggle recording modes
- Universal text injection via clipboard-manager Tauri plugin
- Model tier selector: Tiny.en (75MB), Base.en (142MB), Large-v3 (2.9GB)
- Global hotkey configuration
- Usage stats and transcription history
- Cross-platform: Windows, macOS, Linux
