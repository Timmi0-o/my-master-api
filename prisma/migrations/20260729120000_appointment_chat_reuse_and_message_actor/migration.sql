-- CreateEnum
CREATE TYPE "AppointmentChatMessageActor" AS ENUM ('USER', 'SYSTEM', 'SUPPORT');

-- AlterTable: messages — actor + nullable sender
ALTER TABLE "AppointmentChatMessages" ADD COLUMN "actor" "AppointmentChatMessageActor" NOT NULL DEFAULT 'USER';

ALTER TABLE "AppointmentChatMessages" ALTER COLUMN "sender_user_id" DROP NOT NULL;

-- AlterTable: appointments — chat_id (N:1)
ALTER TABLE "Appointments" ADD COLUMN "chat_id" TEXT;

-- AlterTable: chats — participants
ALTER TABLE "AppointmentChats" ADD COLUMN "master_profile_id" TEXT;
ALTER TABLE "AppointmentChats" ADD COLUMN "client_user_id" TEXT;

-- Backfill chat participants from linked appointment
UPDATE "AppointmentChats" AS c
SET
  "master_profile_id" = a."master_profile_id",
  "client_user_id" = a."client_user_id"
FROM "Appointments" AS a
WHERE c."appointment_id" = a."id";

-- Backfill appointment.chat_id from 1:1 chat
UPDATE "Appointments" AS a
SET "chat_id" = c."id"
FROM "AppointmentChats" AS c
WHERE c."appointment_id" = a."id";

-- Merge duplicate chats for the same master↔client pair (keep oldest)
CREATE TEMP TABLE "_appointment_chat_dupes" AS
WITH ranked AS (
  SELECT
    "id",
    FIRST_VALUE("id") OVER (
      PARTITION BY "master_profile_id", "client_user_id"
      ORDER BY "created_at" ASC, "id" ASC
    ) AS "keep_id",
    ROW_NUMBER() OVER (
      PARTITION BY "master_profile_id", "client_user_id"
      ORDER BY "created_at" ASC, "id" ASC
    ) AS "rn"
  FROM "AppointmentChats"
  WHERE "master_profile_id" IS NOT NULL
    AND "client_user_id" IS NOT NULL
)
SELECT "id", "keep_id"
FROM ranked
WHERE "rn" > 1;

UPDATE "AppointmentChatMessages" AS m
SET "chat_id" = d."keep_id"
FROM "_appointment_chat_dupes" AS d
WHERE m."chat_id" = d."id";

UPDATE "Appointments" AS a
SET "chat_id" = d."keep_id"
FROM "_appointment_chat_dupes" AS d
WHERE a."chat_id" = d."id";

DELETE FROM "AppointmentChats" AS c
USING "_appointment_chat_dupes" AS d
WHERE c."id" = d."id";

DROP TABLE "_appointment_chat_dupes";

-- Drop old 1:1 appointment link
ALTER TABLE "AppointmentChats" DROP CONSTRAINT "AppointmentChats_appointment_id_fkey";

DROP INDEX "AppointmentChats_appointment_id_key";

ALTER TABLE "AppointmentChats" DROP COLUMN "appointment_id";

-- Enforce NOT NULL on participants (orphans should not exist after backfill)
ALTER TABLE "AppointmentChats" ALTER COLUMN "master_profile_id" SET NOT NULL;
ALTER TABLE "AppointmentChats" ALTER COLUMN "client_user_id" SET NOT NULL;

-- Indexes & FKs
CREATE UNIQUE INDEX "AppointmentChats_master_profile_id_client_user_id_key" ON "AppointmentChats"("master_profile_id", "client_user_id");

CREATE INDEX "AppointmentChats_client_user_id_idx" ON "AppointmentChats"("client_user_id");

CREATE INDEX "Appointments_chat_id_idx" ON "Appointments"("chat_id");

ALTER TABLE "AppointmentChats" ADD CONSTRAINT "AppointmentChats_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "AppointmentChats" ADD CONSTRAINT "AppointmentChats_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "AppointmentChats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
