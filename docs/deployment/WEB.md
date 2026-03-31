# SloerStudio Web — Deployment Guide

## Production Stack

| Component | Service | Notes |
|-----------|---------|-------|
| Hosting | Vercel / Railway | Auto-deploy from `main` branch |
| Database | Neon (PostgreSQL) | Serverless, connection pooling via PgBouncer |
| Cache / Rate Limit | Upstash Redis | REST API, serverless-compatible |
| Payments | Stripe | Webhook endpoint required |
| Email | Resend | Transactional email |
| CDN | Vercel Edge Network | Automatic |

## Environment Variables

Copy from `apps/web/ENV_SETUP.md`. Required vars:

```env
DATABASE_URL=postgresql://...?pgbouncer=true&connection_limit=10
DIRECT_URL=postgresql://...
NEXTAUTH_SECRET=<openssl rand -base64 64>
NEXTAUTH_URL=https://sloerstudio.com
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
ADMIN_EMAIL=admin@sloerstudio.com
```

## Deploy to Vercel

```bash
cd apps/web
npx vercel --prod
```

Or connect GitHub repo to Vercel dashboard:
1. Import `SLOERSTUDIO-DEV` repo
2. Set **Root Directory** to `apps/web`
3. Add all env vars
4. Deploy

## Deploy with Docker

```bash
# From repo root
docker-compose -f infrastructure/docker/docker-compose.yml up -d
```

## Database Migration (Zero-Downtime)

```bash
# Run migrations against production DB
cd apps/web
DATABASE_URL="<prod-url>" npx prisma migrate deploy

# Seed admin user (first deploy only)
DATABASE_URL="<prod-url>" npm run db:seed
```

## Switching to PostgreSQL (Production Schema)

1. Update `apps/web/prisma/schema.prisma`:
   - Change `provider = "sqlite"` → `provider = "postgresql"`
   - Restore enum types (UserRole, Plan, TaskStatus, etc.)
   - Restore `directUrl = env("DIRECT_URL")`
   - Change `String[]` back to `String[]` (native arrays)
   - Change `metadata String?` back to `metadata Json?`

2. Run: `npx prisma migrate deploy`

## Health Checks

- `GET /api/auth/session` — auth system
- `GET /` — homepage (static)
- `GET /app/dashboard` — should redirect to `/login` if not authed

## Admin Access

URL: `https://sloerstudio.com/admin`
Requires `role = ADMIN | SUPER_ADMIN` in database.
