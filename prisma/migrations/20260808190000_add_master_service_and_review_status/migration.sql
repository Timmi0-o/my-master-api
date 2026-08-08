-- CreateEnum
CREATE TYPE "MasterServiceStatus" AS ENUM ('ACTIVE', 'PAUSED', 'BLOCKED', 'REVIEWING');

-- CreateEnum
CREATE TYPE "MasterServiceReviewStatus" AS ENUM ('ACTIVE', 'PAUSED', 'BLOCKED', 'REVIEWING');

-- AlterTable
ALTER TABLE "MasterServices" ADD COLUMN "status" "MasterServiceStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "MasterServiceReviews" ADD COLUMN "status" "MasterServiceReviewStatus" NOT NULL DEFAULT 'ACTIVE';

-- DropIndex
DROP INDEX IF EXISTS "MasterServices_deleted_at_category_rating_idx";

-- DropIndex
DROP INDEX IF EXISTS "MasterServices_deleted_at_category_price_idx";

-- CreateIndex
CREATE INDEX "MasterServices_status_idx" ON "MasterServices"("status");

-- CreateIndex
CREATE INDEX "MasterServices_deleted_at_status_category_rating_idx" ON "MasterServices"("deleted_at", "status", "category", "rating");

-- CreateIndex
CREATE INDEX "MasterServices_deleted_at_status_category_price_idx" ON "MasterServices"("deleted_at", "status", "category", "price");

-- CreateIndex
CREATE INDEX "MasterServiceReviews_master_service_id_status_created_at_idx" ON "MasterServiceReviews"("master_service_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "MasterServiceReviews_status_idx" ON "MasterServiceReviews"("status");
