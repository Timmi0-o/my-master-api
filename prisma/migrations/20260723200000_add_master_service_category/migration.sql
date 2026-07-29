-- CreateEnum
CREATE TYPE "MasterServiceCategory" AS ENUM (
  'BEAUTY',
  'REPAIR',
  'AUTO',
  'HOME',
  'PARTS',
  'SERVICES',
  'DIGITAL',
  'PHOTO',
  'SPORT',
  'DESIGN',
  'WELLNESS'
);

-- AlterTable
ALTER TABLE "MasterServices"
ADD COLUMN "category" "MasterServiceCategory" NOT NULL DEFAULT 'SERVICES';

-- CreateIndex
CREATE INDEX "MasterServices_category_idx" ON "MasterServices"("category");
