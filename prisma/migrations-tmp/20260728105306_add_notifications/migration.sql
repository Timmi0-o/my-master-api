-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('APPOINTMENT', 'CHAT', 'REVIEW', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('APPOINTMENT_CREATED', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_CANCELLED', 'APPOINTMENT_COMPLETED', 'APPOINTMENT_REMINDER', 'APPOINTMENT_NO_SHOW', 'CHAT_MESSAGE', 'REVIEW_CREATED', 'REVIEW_REACTION', 'SYSTEM_ANNOUNCEMENT', 'SYSTEM_SECURITY');

-- CreateEnum
CREATE TYPE "NotificationRelatedEntityType" AS ENUM ('APPOINTMENT', 'APPOINTMENT_CHAT', 'APPOINTMENT_CHAT_MESSAGE', 'MASTER_SERVICE_REVIEW', 'MASTER_PROFILE', 'USER');

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "actor_user_id" TEXT,
    "category" "NotificationCategory" NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "action_url" TEXT,
    "related_entity_type" "NotificationRelatedEntityType",
    "related_entity_id" TEXT,
    "payload" JSONB,
    "dedupe_key" TEXT,
    "read_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notifications_user_id_deleted_at_created_at_idx" ON "Notifications"("user_id", "deleted_at", "created_at");

-- CreateIndex
CREATE INDEX "Notifications_user_id_category_deleted_at_created_at_idx" ON "Notifications"("user_id", "category", "deleted_at", "created_at");

-- CreateIndex
CREATE INDEX "Notifications_user_id_read_at_deleted_at_idx" ON "Notifications"("user_id", "read_at", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_user_id_dedupe_key_key" ON "Notifications"("user_id", "dedupe_key");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
