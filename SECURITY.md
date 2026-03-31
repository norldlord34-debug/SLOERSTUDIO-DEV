# Security Policy

## Supported Versions

| App | Version | Supported |
|-----|---------|-----------|
| SloerSpace Dev | 1.0.x | ✅ |
| SloerStudio Web | 1.0.x | ✅ |
| SloerVoice | 0.1.x | ✅ |

## Reporting a Vulnerability

**Do NOT report security vulnerabilities via GitHub Issues.**

Email: **security@sloerstudio.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Your suggested fix (optional)

We will respond within **48 hours** and patch within **7 days** for critical issues.

## Security Architecture

### Web Platform (`apps/web`)
- Passwords hashed with **bcrypt** (12 rounds)
- Sessions managed via **NextAuth JWT** (httpOnly cookies)
- RBAC enforced at the proxy middleware layer (`src/proxy.ts`)
- Rate limiting via **Upstash Redis** (Ratelimit sliding window)
- Security headers on all responses (X-Frame-Options, CSP, etc.)
- Audit logs for all sensitive actions

### Desktop Apps (`apps/desktop`, `apps/voice`)
- Tauri 2 **capability system** — explicit permission grants required
- No network calls from Rust without explicit capability
- Whisper AI runs **100% on-device** — no audio data transmitted

### Secrets Management
- Environment variables via `.env` (never committed)
- Production secrets via platform environment (Vercel/Railway)
- Stripe webhook validation enforced server-side

## Bug Bounty

See [company/bug-bounty](https://sloerstudio.com/company/bug-bounty) for reward tiers ($0.50–$5 BTC).
