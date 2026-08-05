-- CreateEnum
CREATE TYPE "AppointmentChatMessageAttachmentKind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'VOICE');

-- CreateTable
CREATE TABLE "AppointmentChatMessageAttachments" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "kind" "AppointmentChatMessageAttachmentKind" NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentChatMessageAttachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentChatMessageAttachments_message_id_idx" ON "AppointmentChatMessageAttachments"("message_id");

-- CreateIndex
CREATE INDEX "AppointmentChatMessageAttachments_file_id_idx" ON "AppointmentChatMessageAttachments"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentChatMessageAttachments_message_id_file_id_key" ON "AppointmentChatMessageAttachments"("message_id", "file_id");

-- AddForeignKey
ALTER TABLE "AppointmentChatMessageAttachments" ADD CONSTRAINT "AppointmentChatMessageAttachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "AppointmentChatMessages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChatMessageAttachments" ADD CONSTRAINT "AppointmentChatMessageAttachments_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
