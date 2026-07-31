-- CreateEnum
CREATE TYPE "AppointmentReminderJobType" AS ENUM ('REMINDER_24H', 'REMINDER_2H');

-- CreateEnum
CREATE TYPE "AppointmentReminderJobStatus" AS ENUM ('PENDING', 'PROCESSING', 'SENT', 'CANCELLED', 'FAILED');

-- CreateTable
CREATE TABLE "AppointmentReminderJobs" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "type" "AppointmentReminderJobType" NOT NULL,
    "run_at" TIMESTAMP(3) NOT NULL,
    "status" "AppointmentReminderJobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppointmentReminderJobs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentReminderJobs_status_run_at_idx" ON "AppointmentReminderJobs"("status", "run_at");

-- CreateIndex
CREATE INDEX "AppointmentReminderJobs_appointment_id_idx" ON "AppointmentReminderJobs"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentReminderJobs_appointment_id_type_key" ON "AppointmentReminderJobs"("appointment_id", "type");

-- AddForeignKey
ALTER TABLE "AppointmentReminderJobs" ADD CONSTRAINT "AppointmentReminderJobs_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
