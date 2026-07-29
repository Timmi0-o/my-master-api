/*
  Warnings:

  - You are about to drop the column `appointment_id` on the `AppointmentChats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[master_profile_id,client_user_id]` on the table `AppointmentChats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `client_user_id` to the `AppointmentChats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `master_profile_id` to the `AppointmentChats` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AppointmentChatMessageActor" AS ENUM ('USER', 'SYSTEM', 'SUPPORT');

-- DropForeignKey
ALTER TABLE "AppointmentChatMessages" DROP CONSTRAINT "AppointmentChatMessages_sender_user_id_fkey";

-- DropForeignKey
ALTER TABLE "AppointmentChats" DROP CONSTRAINT "AppointmentChats_appointment_id_fkey";

-- DropIndex
DROP INDEX "AppointmentChats_appointment_id_key";

-- AlterTable
ALTER TABLE "AppointmentChatMessages" ADD COLUMN     "actor" "AppointmentChatMessageActor" NOT NULL DEFAULT 'USER',
ALTER COLUMN "sender_user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "AppointmentChats" DROP COLUMN "appointment_id",
ADD COLUMN     "client_user_id" TEXT NOT NULL,
ADD COLUMN     "master_profile_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Appointments" ADD COLUMN     "chat_id" TEXT;

-- CreateIndex
CREATE INDEX "AppointmentChats_client_user_id_idx" ON "AppointmentChats"("client_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentChats_master_profile_id_client_user_id_key" ON "AppointmentChats"("master_profile_id", "client_user_id");

-- CreateIndex
CREATE INDEX "Appointments_chat_id_idx" ON "Appointments"("chat_id");

-- AddForeignKey
ALTER TABLE "AppointmentChatMessages" ADD CONSTRAINT "AppointmentChatMessages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChats" ADD CONSTRAINT "AppointmentChats_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChats" ADD CONSTRAINT "AppointmentChats_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "AppointmentChats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
