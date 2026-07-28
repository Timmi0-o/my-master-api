-- DropIndex
DROP INDEX "Notifications_user_id_dedupe_key_key";

-- RenameColumn
ALTER TABLE "Notifications" RENAME COLUMN "dedupe_key" TO "idempotency_key";

-- CreateIndex
CREATE UNIQUE INDEX "Notifications_user_id_idempotency_key_key" ON "Notifications"("user_id", "idempotency_key");
