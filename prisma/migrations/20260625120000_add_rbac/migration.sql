-- CreateEnum
CREATE TYPE "RoleIdentifier" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN', 'API_CLIENT');

-- CreateEnum
CREATE TYPE "PermissionCategory" AS ENUM ('USER', 'MASTER', 'APPOINTMENT', 'FILE', 'RBAC');

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
CREATE TABLE "RolePermissions" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RolePermissions_pkey" PRIMARY KEY ("id")
);

-- Seed system roles
INSERT INTO "Roles" ("id", "name", "description", "role_identifier", "is_active", "is_system", "created_at", "updated_at")
VALUES
    ('00000000-0000-4000-8000-000000000001', 'User', 'Default application user', 'USER', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('00000000-0000-4000-8000-000000000002', 'Admin', 'Staff administrator', 'ADMIN', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('00000000-0000-4000-8000-000000000003', 'Super Admin', 'Platform super administrator', 'SUPER_ADMIN', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('00000000-0000-4000-8000-000000000004', 'API Client', 'Machine-to-machine client', 'API_CLIENT', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add role_id column (nullable for backfill)
ALTER TABLE "Users" ADD COLUMN "role_id" TEXT;

-- Backfill from legacy Role enum
UPDATE "Users" SET "role_id" = '00000000-0000-4000-8000-000000000001' WHERE "role" = 'USER';
UPDATE "Users" SET "role_id" = '00000000-0000-4000-8000-000000000002' WHERE "role" = 'ADMIN';
UPDATE "Users" SET "role_id" = '00000000-0000-4000-8000-000000000003' WHERE "role" = 'SUPER_ADMIN';

-- Default any remaining rows to USER role
UPDATE "Users" SET "role_id" = '00000000-0000-4000-8000-000000000001' WHERE "role_id" IS NULL;

-- Make role_id required and drop legacy role column
ALTER TABLE "Users" ALTER COLUMN "role_id" SET NOT NULL;
ALTER TABLE "Users" DROP COLUMN "role";

-- DropEnum
DROP TYPE "Role";

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_identifier_key" ON "Roles"("role_identifier");
CREATE INDEX "Roles_name_idx" ON "Roles"("name");
CREATE UNIQUE INDEX "Permissions_name_key" ON "Permissions"("name");
CREATE INDEX "Permissions_category_idx" ON "Permissions"("category");
CREATE INDEX "RolePermissions_permission_id_idx" ON "RolePermissions"("permission_id");
CREATE UNIQUE INDEX "RolePermissions_role_id_permission_id_key" ON "RolePermissions"("role_id", "permission_id");
CREATE INDEX "Users_role_id_idx" ON "Users"("role_id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RolePermissions" ADD CONSTRAINT "RolePermissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
