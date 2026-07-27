-- CreateEnum
CREATE TYPE "WebPushDeviceType" AS ENUM ('DESKTOP', 'MOBILE', 'TABLET', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "WebPushSubscriptionStatus" AS ENUM ('ACTIVE', 'DISABLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "WebPushSubscriptions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "auth" TEXT NOT NULL,
    "expiration_time" TIMESTAMP(3),
    "content_encoding" TEXT NOT NULL DEFAULT 'aes128gcm',
    "user_agent" TEXT,
    "device_type" "WebPushDeviceType" NOT NULL DEFAULT 'UNKNOWN',
    "browser" TEXT,
    "platform" TEXT,
    "status" "WebPushSubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_success_at" TIMESTAMP(3),
    "last_failure_at" TIMESTAMP(3),
    "last_failure_code" INTEGER,
    "failure_count" INTEGER NOT NULL DEFAULT 0,
    "subscribed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "WebPushSubscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WebPushSubscriptions_user_id_status_deleted_at_idx" ON "WebPushSubscriptions"("user_id", "status", "deleted_at");

-- CreateIndex
CREATE INDEX "WebPushSubscriptions_status_failure_count_idx" ON "WebPushSubscriptions"("status", "failure_count");

-- CreateIndex
CREATE INDEX "WebPushSubscriptions_deleted_at_idx" ON "WebPushSubscriptions"("deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "WebPushSubscriptions_endpoint_key" ON "WebPushSubscriptions"("endpoint");

-- AddForeignKey
ALTER TABLE "WebPushSubscriptions" ADD CONSTRAINT "WebPushSubscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
