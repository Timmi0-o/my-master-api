-- CreateEnum
CREATE TYPE "FileOwnerType" AS ENUM ('SYSTEM', 'USER');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'UPLOADED', 'READY');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('DOCUMENT', 'SPREADSHEET', 'PRESENTATION', 'IMAGE', 'VIDEO', 'AUDIO', 'ARCHIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "FileAccessLevel" AS ENUM ('PUBLIC', 'INTERNAL', 'PRIVATE', 'RESTRICTED', 'SHARED');

-- CreateEnum
CREATE TYPE "FilePurpose" AS ENUM ('MASTER_PROFILE_PHOTO', 'MASTER_PORTFOLIO', 'APPOINTMENT_ATTACHMENT', 'PROFILE_PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "FolderSystemType" AS ENUM ('MASTER_DOCUMENTS', 'USER_DOCUMENTS', 'APPOINTMENTS');

-- CreateEnum
CREATE TYPE "FileAccessTargetType" AS ENUM ('USER', 'ROLE');

-- CreateEnum
CREATE TYPE "FileAccessPermission" AS ENUM ('READ', 'WRITE', 'DELETE', 'DOWNLOAD', 'SHARE');

-- CreateTable
CREATE TABLE "Folders" (
    "id" TEXT NOT NULL,
    "owner_kind" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parent_id" TEXT,
    "path" TEXT NOT NULL,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "system_type" "FolderSystemType",
    "allowed_purposes" "FilePurpose"[] DEFAULT ARRAY[]::"FilePurpose"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Files" (
    "id" TEXT NOT NULL,
    "folder_id" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL DEFAULT '',
    "file_size" BIGINT NOT NULL DEFAULT 0,
    "file_url" TEXT NOT NULL,
    "checksum" TEXT,
    "status" "FileStatus" NOT NULL DEFAULT 'PENDING',
    "file_type" "FileType" NOT NULL,
    "owner_type" "FileOwnerType" NOT NULL,
    "owner_kind" TEXT,
    "owner_id" TEXT,
    "access_level" "FileAccessLevel" NOT NULL,
    "purpose" "FilePurpose" NOT NULL,
    "metadata" JSONB,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileAccesses" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "target_type" "FileAccessTargetType" NOT NULL,
    "target_id" TEXT NOT NULL,
    "granted_by" TEXT NOT NULL,
    "permissions" "FileAccessPermission"[] DEFAULT ARRAY[]::"FileAccessPermission"[],
    "reason" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileAccesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileShares" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "password" TEXT,
    "allowed_ips" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "max_downloads" INTEGER,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "max_views" INTEGER,
    "views" INTEGER NOT NULL DEFAULT 0,
    "allow_download" BOOLEAN NOT NULL DEFAULT true,
    "allow_preview" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3),
    "name" TEXT,
    "description" TEXT,
    "created_by" TEXT NOT NULL,
    "last_access_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FileShares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Folders_owner_kind_owner_id_path_key" ON "Folders"("owner_kind", "owner_id", "path");

-- CreateIndex
CREATE INDEX "Folders_owner_kind_owner_id_idx" ON "Folders"("owner_kind", "owner_id");

-- CreateIndex
CREATE INDEX "Folders_parent_id_idx" ON "Folders"("parent_id");

-- CreateIndex
CREATE INDEX "Folders_system_type_idx" ON "Folders"("system_type");

-- CreateIndex
CREATE INDEX "Folders_deleted_at_idx" ON "Folders"("deleted_at");

-- CreateIndex
CREATE INDEX "Folders_owner_kind_owner_id_system_type_idx" ON "Folders"("owner_kind", "owner_id", "system_type");

-- CreateIndex
CREATE UNIQUE INDEX "Files_file_url_key" ON "Files"("file_url");

-- CreateIndex
CREATE INDEX "Files_folder_id_idx" ON "Files"("folder_id");

-- CreateIndex
CREATE INDEX "Files_uploaded_by_idx" ON "Files"("uploaded_by");

-- CreateIndex
CREATE INDEX "Files_owner_type_idx" ON "Files"("owner_type");

-- CreateIndex
CREATE INDEX "Files_owner_kind_owner_id_idx" ON "Files"("owner_kind", "owner_id");

-- CreateIndex
CREATE INDEX "Files_purpose_idx" ON "Files"("purpose");

-- CreateIndex
CREATE INDEX "Files_checksum_idx" ON "Files"("checksum");

-- CreateIndex
CREATE INDEX "Files_deleted_at_idx" ON "Files"("deleted_at");

-- CreateIndex
CREATE INDEX "Files_owner_kind_owner_id_purpose_idx" ON "Files"("owner_kind", "owner_id", "purpose");

-- CreateIndex
CREATE UNIQUE INDEX "FileAccesses_file_id_target_type_target_id_key" ON "FileAccesses"("file_id", "target_type", "target_id");

-- CreateIndex
CREATE INDEX "FileAccesses_file_id_idx" ON "FileAccesses"("file_id");

-- CreateIndex
CREATE INDEX "FileAccesses_target_id_idx" ON "FileAccesses"("target_id");

-- CreateIndex
CREATE INDEX "FileAccesses_expires_at_idx" ON "FileAccesses"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "FileShares_token_key" ON "FileShares"("token");

-- CreateIndex
CREATE INDEX "FileShares_file_id_idx" ON "FileShares"("file_id");

-- CreateIndex
CREATE INDEX "FileShares_token_idx" ON "FileShares"("token");

-- CreateIndex
CREATE INDEX "FileShares_expires_at_idx" ON "FileShares"("expires_at");

-- CreateIndex
CREATE INDEX "FileShares_created_by_idx" ON "FileShares"("created_by");

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAccesses" ADD CONSTRAINT "FileAccesses_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileShares" ADD CONSTRAINT "FileShares_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
