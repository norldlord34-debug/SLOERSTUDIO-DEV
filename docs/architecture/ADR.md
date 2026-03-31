# Architecture Decision Records — SloerStudio

> ADRs document significant architectural decisions, their context, and rationale.

---

## ADR-001: npm Workspaces over pnpm/yarn

**Status:** Accepted | **Date:** 2025-04-01

**Context:** Need a monorepo tool that works without additional binary installation on any platform.

**Decision:** npm workspaces (built into npm 7+). No extra install required, works everywhere, Node.js first-class support.

**Consequences:** Slightly more verbose commands than pnpm. No strict peer dependency enforcement by default.

---

## ADR-002: Turborepo for Task Orchestration

**Status:** Accepted | **Date:** 2025-04-01

**Context:** Building multiple apps sequentially is slow. Need parallel builds with caching.

**Decision:** Turborepo `turbo.json` pipeline defines task dependencies and output caches. Remote caching optional.

**Consequences:** ~70% faster CI builds via cache hits. Requires `turbo.json` to be updated when adding new tasks.

---

## ADR-003: Tauri 2 over Electron

**Status:** Accepted | **Date:** 2025-01-01

**Context:** Desktop app for SloerSpace Dev and SloerVoice needs to be cross-platform with native system access.

**Decision:** Tauri 2 + Rust. Smaller binary (~5MB vs ~150MB Electron), better security via capability system, native PTY via portable-pty, direct Rust crypto/audio access for SloerVoice.

**Consequences:** Rust learning curve. Platform-specific build toolchains required per OS.

---

## ADR-004: SQLite (dev) → PostgreSQL (prod) via Prisma

**Status:** Accepted | **Date:** 2025-04-01

**Context:** Web platform needs a database. SQLite is convenient for local dev but not suitable for production multi-tenant load.

**Decision:** Prisma ORM with SQLite provider for development (zero-config, no external service). Production uses PostgreSQL (Neon serverless). Schema designed to be PostgreSQL-native — dev SQLite schema is a temporary workaround.

**Consequences:** To migrate to PostgreSQL: change `prisma/schema.prisma` provider, restore enums, add `directUrl` for PgBouncer. See `apps/web/ENV_SETUP.md`.

---

## ADR-005: NextAuth v4 over Auth.js v5

**Status:** Accepted | **Date:** 2025-04-01

**Context:** Authentication for the web platform.

**Decision:** NextAuth v4 (stable). Auth.js v5 is still in beta with breaking API changes. Will migrate when stable.

**Consequences:** Limited to NextAuth v4 session interface. Edge runtime not fully supported.

---

## ADR-006: Upstash Redis for Rate Limiting

**Status:** Accepted | **Date:** 2025-04-01

**Context:** Need rate limiting for auth and API endpoints. Redis is the standard solution.

**Decision:** Upstash Redis (serverless, REST-based). No TCP connection pool needed. Works in Edge runtime and serverless functions. @upstash/ratelimit for sliding window algorithm.

**Consequences:** Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN env vars. Falls back gracefully if unavailable.

---

## ADR-007: On-Device Whisper AI for SloerVoice

**Status:** Accepted | **Date:** 2025-01-01

**Context:** Voice dictation privacy concerns. Cloud AI sends audio to third-party servers.

**Decision:** whisper.rs (Rust bindings for whisper.cpp). Audio captured via cpal, transcribed locally, injected via clipboard. Zero network calls.

**Consequences:** Large binary (ggml model files — excluded from git). Users must download model separately. Performance depends on hardware.

---

## ADR-008: Separate CI/CD per App

**Status:** Accepted | **Date:** 2025-04-01

**Context:** Three apps with very different build processes (web deploy vs native binary bundling).

**Decision:** Separate GitHub Actions workflows per app. `ci-web.yml`, `release-desktop.yml`, `release-voice.yml`. They share no steps.

**Consequences:** More workflow files but cleaner separation. Web deploys don't trigger desktop rebuilds.
