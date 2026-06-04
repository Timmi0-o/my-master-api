-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AppointmentCancelledBy" AS ENUM ('CLIENT', 'MASTER', 'STAFF');

-- AlterTable
ALTER TABLE "MasterServices" ADD COLUMN "duration_minutes" INTEGER NOT NULL DEFAULT 60;

-- CreateTable
CREATE TABLE "Appointments" (
    "id" TEXT NOT NULL,
    "master_profile_id" TEXT NOT NULL,
    "master_service_id" TEXT NOT NULL,
    "client_user_id" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "total_price" DOUBLE PRECISION NOT NULL,
    "service_name" TEXT NOT NULL,
    "cancelled_at" TIMESTAMP(3),
    "cancelled_by" "AppointmentCancelledBy",
    "cancel_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentChats" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AppointmentChats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentChatMessages" (
    "id" TEXT NOT NULL,
    "chat_id" TEXT NOT NULL,
    "sender_user_id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "AppointmentChatMessages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Appointments_master_profile_id_starts_at_idx" ON "Appointments"("master_profile_id", "starts_at");

-- CreateIndex
CREATE INDEX "Appointments_client_user_id_starts_at_idx" ON "Appointments"("client_user_id", "starts_at");

-- CreateIndex
CREATE INDEX "Appointments_master_service_id_idx" ON "Appointments"("master_service_id");

-- CreateIndex
CREATE INDEX "Appointments_status_idx" ON "Appointments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentChats_appointment_id_key" ON "AppointmentChats"("appointment_id");

-- CreateIndex
CREATE INDEX "AppointmentChatMessages_chat_id_created_at_idx" ON "AppointmentChatMessages"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "AppointmentChatMessages_sender_user_id_idx" ON "AppointmentChatMessages"("sender_user_id");

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_master_service_id_fkey" FOREIGN KEY ("master_service_id") REFERENCES "MasterServices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChats" ADD CONSTRAINT "AppointmentChats_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChatMessages" ADD CONSTRAINT "AppointmentChatMessages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "AppointmentChats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChatMessages" ADD CONSTRAINT "AppointmentChatMessages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
