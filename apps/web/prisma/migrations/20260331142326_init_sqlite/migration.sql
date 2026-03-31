-- DropIndex
DROP INDEX "ApiKey_keyHash_idx";

-- DropIndex
DROP INDEX "ApiKey_userId_idx";

-- DropIndex
DROP INDEX "BlogPost_published_publishedAt_idx";

-- DropIndex
DROP INDEX "BlogPost_slug_idx";

-- DropIndex
DROP INDEX "Event_status_idx";

-- DropIndex
DROP INDEX "Event_date_idx";

-- DropIndex
DROP INDEX "JobPosting_active_idx";

-- DropIndex
DROP INDEX "NewsletterSubscriber_active_idx";

-- DropIndex
DROP INDEX "NewsletterSubscriber_email_idx";

-- DropIndex
DROP INDEX "Project_updatedAt_idx";

-- DropIndex
DROP INDEX "Project_userId_idx";

-- DropIndex
DROP INDEX "Subscription_stripeSubId_idx";

-- DropIndex
DROP INDEX "Subscription_stripeCustomerId_idx";

-- DropIndex
DROP INDEX "Task_status_idx";

-- DropIndex
DROP INDEX "Task_projectId_idx";

-- DropIndex
DROP INDEX "User_createdAt_idx";

-- DropIndex
DROP INDEX "User_plan_idx";

-- DropIndex
DROP INDEX "User_role_idx";

-- DropIndex
DROP INDEX "User_email_idx";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AuditLog" ("action", "createdAt", "entity", "entityId", "id", "ipAddress", "metadata", "userAgent", "userId") SELECT "action", "createdAt", "entity", "entityId", "id", "ipAddress", "metadata", "userAgent", "userId" FROM "AuditLog";
DROP TABLE "AuditLog";
ALTER TABLE "new_AuditLog" RENAME TO "AuditLog";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
