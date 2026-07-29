-- AlterTable
ALTER TABLE "Appointments" ADD COLUMN "is_early_completion_by_master" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Appointments" ADD COLUMN "is_early_completion_by_client" BOOLEAN NOT NULL DEFAULT false;
