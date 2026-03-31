// @sloerstudio/types — Shared TypeScript types

// ── User & Auth ───────────────────────────────────────────────────────────────

export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";
export type Plan = "FREE" | "STUDIO" | "ENTERPRISE";

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  plan: Plan;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

// ── Projects & Tasks ─────────────────────────────────────────────────────────

export type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETE" | "CANCELLED";

export interface Project {
  id: string;
  name: string;
  description?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { tasks: number };
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// ── API Keys ─────────────────────────────────────────────────────────────────

export type ApiKeyStatus = "LIVE" | "REVOKED";

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  status: ApiKeyStatus;
  scopes: string[];
  userId: string;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

// ── Subscription ─────────────────────────────────────────────────────────────

export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "PAST_DUE" | "TRIALING";
export type BillingPeriod = "MONTHLY" | "ANNUAL";

export interface Subscription {
  id: string;
  userId: string;
  plan: Plan;
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  trialEnd?: string;
}

// ── Desktop / Voice ───────────────────────────────────────────────────────────

export type AgentCli = "claude" | "codex" | "gemini" | "opencode" | "cursor" | "droid" | "copilot";
export type AgentRole = "builder" | "reviewer" | "scout" | "coord" | "custom";
export type WhisperModel = "tiny.en" | "base.en" | "large-v3";

export interface AgentCliResolution {
  cli: AgentCli;
  available: boolean;
  resolvedPath?: string;
  bootstrapCommand?: string;
}

// ── API Responses ─────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
