-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "AppointmentCancelledBy" AS ENUM ('CLIENT', 'MASTER', 'STAFF');

-- CreateEnum
CREATE TYPE "FileAccessTargetType" AS ENUM ('USER', 'ROLE');

-- CreateEnum
CREATE TYPE "FileAccessPermission" AS ENUM ('READ', 'WRITE', 'DELETE', 'DOWNLOAD', 'SHARE');

-- CreateEnum
CREATE TYPE "FileOwnerType" AS ENUM ('SYSTEM', 'USER');

-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('PENDING', 'UPLOADED', 'READY');

-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('DOCUMENT', 'SPREADSHEET', 'PRESENTATION', 'IMAGE', 'VIDEO', 'AUDIO', 'ARCHIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "FileAccessLevel" AS ENUM ('PUBLIC', 'INTERNAL', 'PRIVATE', 'RESTRICTED', 'SHARED');

-- CreateEnum
CREATE TYPE "FilePurpose" AS ENUM ('MASTER_PROFILE_PHOTO', 'MASTER_PORTFOLIO', 'MASTER_SERVICE_IMAGE', 'APPOINTMENT_ATTACHMENT', 'PROFILE_PHOTO', 'OTHER');

-- CreateEnum
CREATE TYPE "FolderSystemType" AS ENUM ('MASTER_DOCUMENTS', 'USER_DOCUMENTS', 'APPOINTMENTS');

-- CreateEnum
CREATE TYPE "MasterBookingStatus" AS ENUM ('ACCEPTING', 'PAUSED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MasterScheduleExceptionKind" AS ENUM ('CLOSED', 'CUSTOM_HOURS');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "PermissionCategory" AS ENUM ('USER', 'MASTER', 'APPOINTMENT', 'FILE', 'RBAC');

-- CreateEnum
CREATE TYPE "RoleIdentifier" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'API_CLIENT');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING', 'BLOCKED');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('RU');

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
CREATE TABLE "MasterProfiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Moscow',
    "booking_status" "MasterBookingStatus" NOT NULL DEFAULT 'ACCEPTING',
    "paused_until" TIMESTAMP(3),
    "min_notice_minutes" INTEGER NOT NULL DEFAULT 60,
    "max_booking_days_ahead" INTEGER NOT NULL DEFAULT 60,
    "slot_step_minutes" INTEGER NOT NULL DEFAULT 30,
    "buffer_between_appointments_minutes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MasterProfiles_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "MasterServiceImages" (
    "id" TEXT NOT NULL,
    "master_service_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterServiceImages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterServices" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 60,
    "master_profile_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MasterServices_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "Permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "PermissionCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshTokens" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissions" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "role_identifier" "RoleIdentifier" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_system" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "UserProfiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "username" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "patronymic" TEXT,
    "language" "Language" NOT NULL DEFAULT 'RU',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AppointmentChatMessages_chat_id_created_at_idx" ON "AppointmentChatMessages"("chat_id", "created_at");

-- CreateIndex
CREATE INDEX "AppointmentChatMessages_sender_user_id_idx" ON "AppointmentChatMessages"("sender_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AppointmentChats_appointment_id_key" ON "AppointmentChats"("appointment_id");

-- CreateIndex
CREATE INDEX "Appointments_master_profile_id_starts_at_idx" ON "Appointments"("master_profile_id", "starts_at");

-- CreateIndex
CREATE INDEX "Appointments_client_user_id_starts_at_idx" ON "Appointments"("client_user_id", "starts_at");

-- CreateIndex
CREATE INDEX "Appointments_master_service_id_idx" ON "Appointments"("master_service_id");

-- CreateIndex
CREATE INDEX "Appointments_status_idx" ON "Appointments"("status");

-- CreateIndex
CREATE INDEX "FileAccesses_file_id_idx" ON "FileAccesses"("file_id");

-- CreateIndex
CREATE INDEX "FileAccesses_target_id_idx" ON "FileAccesses"("target_id");

-- CreateIndex
CREATE INDEX "FileAccesses_expires_at_idx" ON "FileAccesses"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "FileAccesses_file_id_target_type_target_id_key" ON "FileAccesses"("file_id", "target_type", "target_id");

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
CREATE UNIQUE INDEX "Folders_owner_kind_owner_id_path_key" ON "Folders"("owner_kind", "owner_id", "path");

-- CreateIndex
CREATE UNIQUE INDEX "MasterProfiles_user_id_key" ON "MasterProfiles"("user_id");

-- CreateIndex
CREATE INDEX "MasterProfiles_user_id_rating_idx" ON "MasterProfiles"("user_id", "rating");

-- CreateIndex
CREATE INDEX "MasterScheduleExceptions_master_profile_id_starts_at_ends_a_idx" ON "MasterScheduleExceptions"("master_profile_id", "starts_at", "ends_at");

-- CreateIndex
CREATE INDEX "MasterServiceImages_master_service_id_idx" ON "MasterServiceImages"("master_service_id");

-- CreateIndex
CREATE INDEX "MasterServiceImages_file_id_idx" ON "MasterServiceImages"("file_id");

-- CreateIndex
CREATE UNIQUE INDEX "MasterServiceImages_master_service_id_file_id_key" ON "MasterServiceImages"("master_service_id", "file_id");

-- CreateIndex
CREATE INDEX "MasterWeeklySchedules_master_profile_id_day_of_week_idx" ON "MasterWeeklySchedules"("master_profile_id", "day_of_week");

-- CreateIndex
CREATE UNIQUE INDEX "MasterWeeklySchedules_master_profile_id_day_of_week_start_t_key" ON "MasterWeeklySchedules"("master_profile_id", "day_of_week", "start_time");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_name_key" ON "Permissions"("name");

-- CreateIndex
CREATE INDEX "Permissions_category_idx" ON "Permissions"("category");

-- CreateIndex
CREATE INDEX "RefreshTokens_user_id_idx" ON "RefreshTokens"("user_id");

-- CreateIndex
CREATE INDEX "RefreshTokens_expires_at_idx" ON "RefreshTokens"("expires_at");

-- CreateIndex
CREATE INDEX "RolePermissions_permission_id_idx" ON "RolePermissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermissions_role_id_permission_id_key" ON "RolePermissions"("role_id", "permission_id");

-- CreateIndex
CREATE INDEX "Roles_name_idx" ON "Roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_identifier_key" ON "Roles"("role_identifier");

-- CreateIndex
CREATE INDEX "Sessions_user_id_idx" ON "Sessions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfiles_user_id_key" ON "UserProfiles"("user_id");

-- CreateIndex
CREATE INDEX "UserProfiles_user_id_deleted_at_idx" ON "UserProfiles"("user_id", "deleted_at");

-- CreateIndex
CREATE INDEX "Users_email_phone_username_idx" ON "Users"("email", "phone", "username");

-- CreateIndex
CREATE INDEX "Users_role_id_idx" ON "Users"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "AppointmentChatMessages" ADD CONSTRAINT "AppointmentChatMessages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "AppointmentChats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChatMessages" ADD CONSTRAINT "AppointmentChatMessages_sender_user_id_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentChats" ADD CONSTRAINT "AppointmentChats_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "Appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_master_service_id_fkey" FOREIGN KEY ("master_service_id") REFERENCES "MasterServices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointments" ADD CONSTRAINT "Appointments_client_user_id_fkey" FOREIGN KEY ("client_user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileAccesses" ADD CONSTRAINT "FileAccesses_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileShares" ADD CONSTRAINT "FileShares_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Folders" ADD CONSTRAINT "Folders_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "Folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterProfiles" ADD CONSTRAINT "MasterProfiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterScheduleExceptions" ADD CONSTRAINT "MasterScheduleExceptions_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterServiceImages" ADD CONSTRAINT "MasterServiceImages_master_service_id_fkey" FOREIGN KEY ("master_service_id") REFERENCES "MasterServices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterServiceImages" ADD CONSTRAINT "MasterServiceImages_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterServices" ADD CONSTRAINT "MasterServices_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterWeeklySchedules" ADD CONSTRAINT "MasterWeeklySchedules_master_profile_id_fkey" FOREIGN KEY ("master_profile_id") REFERENCES "MasterProfiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfiles" ADD CONSTRAINT "UserProfiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
