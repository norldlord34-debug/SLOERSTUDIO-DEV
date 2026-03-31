# Contributing to SloerStudio

Thank you for your interest in contributing to SloerStudio!

## Monorepo Structure

This is an **npm workspaces monorepo**. Each `apps/*` and `packages/*` directory is a separate workspace.

## Development Setup

```bash
git clone https://github.com/norldlord34-debug/SLOERSTUDIO-DEV
cd SLOERSTUDIO-DEV
npm install
```

## Branch Strategy (Git Flow)

```
main          → production-ready releases
develop       → integration branch
feature/*     → new features (branch from develop)
fix/*         → bug fixes (branch from develop)
hotfix/*      → urgent fixes (branch from main)
release/*     → release preparation
```

## Commit Convention (Conventional Commits)

```
feat(desktop): add swarm dashboard canvas zoom
fix(web): resolve auth session expiry on refresh
docs(voice): update whisper model setup guide
chore(root): update turbo pipeline config
```

**Scopes:** `desktop` | `web` | `voice` | `ui` | `config` | `types` | `utils` | `infra` | `docs` | `root`

## Pull Request Process

1. Branch from `develop`: `git checkout -b feature/your-feature develop`
2. Make your changes with clean, focused commits
3. Ensure all checks pass: `npm run lint:all && npm run typecheck:all`
4. Open a PR targeting `develop`
5. Fill out the PR template
6. Request review from at least one maintainer

## Code Style

- **TypeScript**: strict mode, no `any` unless absolutely necessary
- **Rust**: `cargo fmt` + `cargo clippy` before committing
- **Formatting**: EditorConfig + project-specific ESLint configs
- **CSS**: TailwindCSS utility classes, no inline styles for static values

## Apps — Development Notes

### `apps/desktop` (SloerSpace Dev)
- `npm run dev:desktop` — Tauri hot-reload dev mode
- `cargo check` before any Rust changes
- Always validate: `npm run validate` (typecheck + lint + build)

### `apps/web` (SloerStudio Web)
- `npm run dev:web` — Next.js dev server
- Prisma migrations: `npx prisma migrate dev --name <description>`
- Test auth: `npm run db:seed` then visit `/login`

### `apps/voice` (SloerVoice)
- Requires Whisper model in `src-tauri/` (excluded from git — see README)
- `npm run dev:voice` — Tauri + Vite hot-reload

## Reporting Issues

Use GitHub Issues with the appropriate template:
- **Bug Report** — something is broken
- **Feature Request** — something could be better
- **Security Vulnerability** — see [SECURITY.md](./SECURITY.md)
