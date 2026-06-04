-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "MasterScheduleExceptionKind" AS ENUM ('CLOSED', 'CUSTOM_HOURS');

-- CreateEnum
CREATE TYPE "MasterBookingStatus" AS ENUM ('ACCEPTING', 'PAUSED', 'CLOSED');

-- AlterTable
ALTER TABLE "MasterProfiles" ADD COLUMN "timezone" TEXT NOT NULL DEFAULT 'Europe/Moscow',
ADD COLUMN "booking_status" "MasterBookingStatus" NOT NULL DEFAULT 'ACCEPTING',
ADD COLUMN "paused_until" TIMESTAMP(3),
ADD COLUMN "min_notice_minutes" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN "max_booking_days_ahead" INTEGER NOT NULL DEFAULT 60,
ADD COLUMN "slot_step_minutes" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN "buffer_between_appointments_minutes" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MasterWeeklySchedules" (
    "id" TEXT NOT NULL,
    "master_profile_id" TEXT NOT NULL,
    "day_of_week" "DayOfWeek" NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MasterWeeklySchedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterScheduleExceptions" (
    "id" TEXT NOT NULL,
    "master_profile_id" TEXT NOT NULL,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "kind" "MasterScheduleExceptionKind" NOT NULL,
    "custom_start_time" TEXT,
    "custom_end_time" TEXT,
    "title" TEXT,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MasterScheduleExceptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasterWeeklySchedules_master_profile_id_day_of_week_idx" ON "MasterWeeklySchedules"("master_profile_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "MasterWeeklySchedules_master_profile_id_day_of_week_start_t_key" ON "MasterWeeklySchedules"("master_profile_id", "day_of_week", "start_time");

-- CreateIndex
CREATE INDEX "MasterScheduleExceptions_master_profile_id_starts_at_end_idx" ON "MasterScheduleExceptions"("master_profile_id", "starts_at", "ends_at");

-- AddForeignKey
ALTER TABLE "MasterWeeklySchedules" ADD CONSTRAINT "MasterWeeklySchedules_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterScheduleExceptions" ADD CONSTRAINT "MasterScheduleExceptions_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
