import { z } from "zod";

const BaseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
});

const ProductionEnvSchema = BaseEnvSchema.extend({
  DATABASE_URL: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(1),
  NEXTAUTH_URL: z.string().url(),
}).superRefine((value, ctx) => {
  const redisConfigured = Boolean(value.UPSTASH_REDIS_REST_URL && value.UPSTASH_REDIS_REST_TOKEN);
  const redisPartial = Boolean(value.UPSTASH_REDIS_REST_URL || value.UPSTASH_REDIS_REST_TOKEN);

  if (redisPartial && !redisConfigured) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["UPSTASH_REDIS_REST_URL"],
      message: "Both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set together.",
    });
  }

  const stripeConfigured = Boolean(
    value.STRIPE_SECRET_KEY && value.STRIPE_WEBHOOK_SECRET && value.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
  const stripePartial = Boolean(
    value.STRIPE_SECRET_KEY || value.STRIPE_WEBHOOK_SECRET || value.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );

  if (stripePartial && !stripeConfigured) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["STRIPE_SECRET_KEY"],
      message: "Stripe requires STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY together.",
    });
  }
});

const baseEnv = BaseEnvSchema.parse(process.env);

if (baseEnv.NODE_ENV === "production") {
  ProductionEnvSchema.parse(process.env);
}

export const env = baseEnv;

export type AppEnv = typeof env;

export const isProduction = env.NODE_ENV === "production";
export const hasDatabaseUrl = Boolean(env.DATABASE_URL);
export const hasDirectUrl = Boolean(env.DIRECT_URL);
export const hasRedisConfig = Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN);
export const hasStripeConfig = Boolean(
  env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET && env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
);

export function requireEnv<K extends keyof AppEnv>(...keys: K[]): Pick<AppEnv, K> {
  const values = {} as Pick<AppEnv, K>;

  for (const key of keys) {
    const value = env[key];

    if (!value) {
      throw new Error(`Missing required environment variable: ${String(key)}`);
    }

    values[key] = value;
  }

  return values;
}
