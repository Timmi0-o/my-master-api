-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'CHAT_UNREAD_REMINDER';

-- CreateTable
CREATE TABLE "AppointmentChatUnreadReminders" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "recipient_profile_user_id" TEXT NOT NULL,
    "reminders_count" INTEGER NOT NULL DEFAULT 0,
    "last_reminded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentChatUnreadReminders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentChatUnreadReminders_created_at_idx" ON "AppointmentChatUnreadReminders"("created_at");

-- CreateIndex
CREATE INDEX "AppointmentChatUnreadReminders_recipient_profile_user_id_idx" ON "AppointmentChatUnreadReminders"("recipient_profile_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentChatUnreadReminders_chat_id_recipient_profile_user_id_key" ON "AppointmentChatUnreadReminders"("chat_id", "recipient_profile_user_id");

-- AddForeignKey
ALTER TABLE "AppointmentChatUnreadReminders" ADD CONSTRAINT "AppointmentChatUnreadReminders_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "AppointmentChats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChatUnreadReminders" ADD CONSTRAINT "AppointmentChatUnreadReminders_recipient_profile_user_id_fkey" FOREIGN KEY ("recipient_profile_user_id") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
