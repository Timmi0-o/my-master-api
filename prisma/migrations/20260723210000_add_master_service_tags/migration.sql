-- AlterTable
ALTER TABLE "MasterServices"
ADD COLUMN "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
