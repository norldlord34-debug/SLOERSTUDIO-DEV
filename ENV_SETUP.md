# SloerStudio — Enterprise Environment Setup

## Required Environment Variables

Create a `.env` file at the root of the project with the following:

```env
# ─── DATABASE (PostgreSQL via Neon — https://neon.tech) ──────────────────────
# Connection pooling URL (PgBouncer) — use for all Prisma queries
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx.us-east-1.aws.neon.tech/sloerstudio?sslmode=require&pgbouncer=true&connection_limit=10"
# Direct URL (no pooler) — used only for migrations
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxx.us-east-1.aws.neon.tech/sloerstudio?sslmode=require"

# ─── AUTH (NextAuth.js) ────────────────────────────────────────────────────────
NEXTAUTH_SECRET="generate-with: openssl rand -base64 64"
NEXTAUTH_URL="https://sloerstudio.com"  # or http://localhost:3000 for dev

# ─── REDIS (Upstash — https://upstash.com) ────────────────────────────────────
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="AXxx..."

# ─── STRIPE PAYMENTS ──────────────────────────────────────────────────────────
STRIPE_SECRET_KEY="sk_live_..."          # sk_test_... for dev
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# ─── ADMIN ────────────────────────────────────────────────────────────────────
ADMIN_EMAIL="admin@sloerstudio.com"

# ─── EMAIL (Resend — https://resend.com) ──────────────────────────────────────
RESEND_API_KEY="re_..."

# ─── ANALYTICS ────────────────────────────────────────────────────────────────
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="..."   # optional
```

## Infrastructure Setup

### 1. Neon PostgreSQL
1. Create account at https://neon.tech
2. Create project "sloerstudio-prod"
3. Copy the connection strings above
4. Run: `npx prisma migrate deploy`

### 2. Upstash Redis
1. Create account at https://upstash.com
2. Create Redis database "sloerstudio-cache"
3. Copy REST URL and token above

### 3. Run migrations
```bash
npx prisma migrate dev --name init
npx prisma db seed   # optional — seeds admin user
```

### 4. Create first admin user
After running the app, call:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@sloerstudio.com","password":"your-password","plan":"enterprise"}'
```
Then manually set role to SUPER_ADMIN in the DB:
```sql
UPDATE "User" SET role = 'SUPER_ADMIN' WHERE email = 'admin@sloerstudio.com';
```
