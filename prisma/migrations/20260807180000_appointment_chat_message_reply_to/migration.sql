-- AlterTable
ALTER TABLE "AppointmentChatMessages" ADD COLUMN "reply_to_message_id" TEXT;

-- CreateIndex
CREATE INDEX "AppointmentChatMessages_reply_to_message_id_idx" ON "AppointmentChatMessages"("reply_to_message_id");

-- AddForeignKey
ALTER TABLE "AppointmentChatMessages" ADD CONSTRAINT "AppointmentChatMessages_reply_to_message_id_fkey" FOREIGN KEY ("reply_to_message_id") REFERENCES "AppointmentChatMessages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
