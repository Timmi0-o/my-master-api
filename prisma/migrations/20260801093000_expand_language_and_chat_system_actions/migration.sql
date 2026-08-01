-- AlterEnum Language
ALTER TYPE "Language" ADD VALUE 'EN';
ALTER TYPE "Language" ADD VALUE 'ES';
ALTER TYPE "Language" ADD VALUE 'ZH';
ALTER TYPE "Language" ADD VALUE 'AR';
ALTER TYPE "Language" ADD VALUE 'FR';
ALTER TYPE "Language" ADD VALUE 'DE';
ALTER TYPE "Language" ADD VALUE 'PT';
ALTER TYPE "Language" ADD VALUE 'JA';
ALTER TYPE "Language" ADD VALUE 'HI';

-- CreateEnum
CREATE TYPE "AppointmentChatSystemAction" AS ENUM (
  'APPOINTMENT_CREATED',
  'APPOINTMENT_CONFIRMED',
  'APPOINTMENT_CANCELLED'
);

-- AlterTable AppointmentChatMessages
ALTER TABLE "AppointmentChatMessages" ALTER COLUMN "body" DROP NOT NULL;
ALTER TABLE "AppointmentChatMessages" ADD COLUMN "system_action" "AppointmentChatSystemAction";
ALTER TABLE "AppointmentChatMessages" ADD COLUMN "payload" JSONB;
