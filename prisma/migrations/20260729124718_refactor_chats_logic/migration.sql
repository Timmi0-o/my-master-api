-- Idempotent: previous failed attempts may have left partial DDL (e.g. enum).

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "AppointmentChatMessageActor" AS ENUM ('USER', 'SYSTEM', 'SUPPORT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable: messages — actor + nullable sender
ALTER TABLE "AppointmentChatMessages" DROP CONSTRAINT IF EXISTS "AppointmentChatMessages_sender_user_id_fkey";

ALTER TABLE "AppointmentChatMessages" ADD COLUMN IF NOT EXISTS "actor" "AppointmentChatMessageActor" NOT NULL DEFAULT 'USER';

ALTER TABLE "AppointmentChatMessages" ALTER COLUMN "sender_user_id" DROP NOT NULL;

DO $$ BEGIN
  ALTER TABLE "AppointmentChatMessages"
    ADD CONSTRAINT "AppointmentChatMessages_sender_user_id_fkey"
    FOREIGN KEY ("sender_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- AlterTable: appointments — chat_id (N:1)
ALTER TABLE "Appointments" ADD COLUMN IF NOT EXISTS "chat_id" TEXT;

-- AlterTable: chats — participants (nullable first, then backfill)
ALTER TABLE "AppointmentChats" ADD COLUMN IF NOT EXISTS "master_profile_id" TEXT;
ALTER TABLE "AppointmentChats" ADD COLUMN IF NOT EXISTS "client_user_id" TEXT;

-- Backfill chat participants from linked appointment (only while appointment_id still exists)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'AppointmentChats'
      AND column_name = 'appointment_id'
  ) THEN
    UPDATE "AppointmentChats" AS c
    SET
      "master_profile_id" = COALESCE(c."master_profile_id", a."master_profile_id"),
      "client_user_id" = COALESCE(c."client_user_id", a."client_user_id")
    FROM "Appointments" AS a
    WHERE c."appointment_id" = a."id";

    UPDATE "Appointments" AS a
    SET "chat_id" = COALESCE(a."chat_id", c."id")
    FROM "AppointmentChats" AS c
    WHERE c."appointment_id" = a."id";
  END IF;
END $$;

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

-- Drop orphan chats that could not be backfilled
DELETE FROM "AppointmentChatMessages" AS m
USING "AppointmentChats" AS c
WHERE m."chat_id" = c."id"
  AND (c."master_profile_id" IS NULL OR c."client_user_id" IS NULL);

DELETE FROM "AppointmentChats"
WHERE "master_profile_id" IS NULL
   OR "client_user_id" IS NULL;

-- Drop old 1:1 appointment link (if still present)
ALTER TABLE "AppointmentChats" DROP CONSTRAINT IF EXISTS "AppointmentChats_appointment_id_fkey";

DROP INDEX IF EXISTS "AppointmentChats_appointment_id_key";

ALTER TABLE "AppointmentChats" DROP COLUMN IF EXISTS "appointment_id";

-- Enforce NOT NULL on participants
ALTER TABLE "AppointmentChats" ALTER COLUMN "master_profile_id" SET NOT NULL;
ALTER TABLE "AppointmentChats" ALTER COLUMN "client_user_id" SET NOT NULL;

-- Indexes & FKs
CREATE UNIQUE INDEX IF NOT EXISTS "AppointmentChats_master_profile_id_client_user_id_key"
  ON "AppointmentChats"("master_profile_id", "client_user_id");

CREATE INDEX IF NOT EXISTS "AppointmentChats_client_user_id_idx"
  ON "AppointmentChats"("client_user_id");

CREATE INDEX IF NOT EXISTS "Appointments_chat_id_idx"
  ON "Appointments"("chat_id");

DO $$ BEGIN
  ALTER TABLE "AppointmentChats"
    ADD CONSTRAINT "AppointmentChats_master_profile_id_fkey"
    FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "AppointmentChats"
    ADD CONSTRAINT "AppointmentChats_client_user_id_fkey"
    FOREIGN KEY ("client_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "Appointments"
    ADD CONSTRAINT "Appointments_chat_id_fkey"
    FOREIGN KEY ("chat_id") REFERENCES "AppointmentChats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
