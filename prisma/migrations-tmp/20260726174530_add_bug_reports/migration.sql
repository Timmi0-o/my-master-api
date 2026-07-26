-- CreateEnum
CREATE TYPE "BugReportDeviceType" AS ENUM ('DESKTOP', 'MOBILE');

-- CreateEnum
CREATE TYPE "BugReportStatus" AS ENUM ('NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'WONT_FIX');

-- AlterEnum
ALTER TYPE "FilePurpose" ADD VALUE 'BUG_REPORT_ATTACHMENT';

-- AlterEnum
ALTER TYPE "ImageEntityType" ADD VALUE 'BUG_REPORT';

-- CreateTable
CREATE TABLE "BugReports" (
    "id" TEXT NOT NULL,
    "reporter_user_id" TEXT,
    "reply_email" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "device_type" "BugReportDeviceType" NOT NULL,
    "page_url" TEXT NOT NULL,
    "app_version" TEXT NOT NULL,
    "locale" TEXT,
    "device_info" JSONB NOT NULL,
    "status" "BugReportStatus" NOT NULL DEFAULT 'NEW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BugReports_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BugReports_reporter_user_id_idx" ON "BugReports"("reporter_user_id");

-- CreateIndex
CREATE INDEX "BugReports_status_created_at_idx" ON "BugReports"("status", "created_at");

-- AddForeignKey
ALTER TABLE "BugReports" ADD CONSTRAINT "BugReports_reporter_user_id_fkey" FOREIGN KEY ("reporter_user_id") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "MasterServiceReviewReactions_user_id_master_service_review_id_k" RENAME TO "MasterServiceReviewReactions_user_id_master_service_review__key";
