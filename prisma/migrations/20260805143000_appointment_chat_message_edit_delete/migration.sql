-- AlterTable
ALTER TABLE "AppointmentChatMessages" ADD COLUMN "edited_at" TIMESTAMP(3),
ADD COLUMN "edited_history" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "deleted_for_user_ids" TEXT[] DEFAULT ARRAY[]::TEXT[];
