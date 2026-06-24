import type { PermissionCategory, PrismaClient } from '@prisma/client';
import type { SeedRunner } from './index';
import { SYSTEM_ROLE_IDS } from '../../src/modules/authorization/domain/entities/role/system-role-ids';
import { ERoleIdentifier } from '../../src/modules/authorization/domain/entities/role/role.enum';
import { PERMISSIONS_CATALOG } from '../../src/modules/authorization/domain/permissions/permissions-catalog';
import { Permissions } from '../../src/modules/authorization/domain/permissions/permission-names';

const USER_PERMISSIONS = [
  Permissions.userProfiles.read,
  Permissions.userProfiles.create,
  Permissions.userProfiles.update,
  Permissions.masters.read,
  Permissions.masterProfiles.read,
  Permissions.masterServices.read,
  Permissions.appointments.read,
  Permissions.appointments.create,
  Permissions.appointments.update,
  Permissions.appointmentChats.read,
  Permissions.appointmentChats.create,
  Permissions.appointmentChatMessages.read,
  Permissions.appointmentChatMessages.create,
  Permissions.files.read,
  Permissions.files.create,
  Permissions.folders.read,
];

const ADMIN_PERMISSIONS = [
  ...Object.values(Permissions.users),
  ...Object.values(Permissions.userProfiles),
  ...Object.values(Permissions.masters),
  ...Object.values(Permissions.masterProfiles),
  ...Object.values(Permissions.masterServices),
  ...Object.values(Permissions.masterWeeklySchedules),
  ...Object.values(Permissions.masterScheduleExceptions),
  ...Object.values(Permissions.appointments),
  ...Object.values(Permissions.appointmentChats),
  ...Object.values(Permissions.appointmentChatMessages),
  ...Object.values(Permissions.files),
  ...Object.values(Permissions.folders),
  Permissions.rbac.read,
];

const API_CLIENT_PERMISSIONS = [
  Permissions.files.read,
  Permissions.users.read,
];

async function upsertPermissions(prisma: PrismaClient): Promise<Map<string, string>> {
  const permissionIds = new Map<string, string>();

  for (const item of PERMISSIONS_CATALOG) {
    const permission = await prisma.permission.upsert({
      where: { name: item.name },
      create: {
        name: item.name,
        description: item.description,
        category: item.category as PermissionCategory,
      },
      update: {
        description: item.description,
        category: item.category as PermissionCategory,
      },
    });
    permissionIds.set(item.name, permission.id);
  }

  return permissionIds;
}

async function syncRolePermissions(
  prisma: PrismaClient,
  roleId: string,
  permissionNames: readonly string[],
  permissionIds: Map<string, string>,
): Promise<void> {
  const desiredPermissionIds = permissionNames.map((name) => {
    const permissionId = permissionIds.get(name);
    if (!permissionId) {
      throw new Error(`rbac seed: permission not found: ${name}`);
    }
    return permissionId;
  });

  await prisma.rolePermission.deleteMany({
    where: {
      roleId,
      permissionId: { notIn: desiredPermissionIds },
    },
  });

  for (const permissionId of desiredPermissionIds) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
      create: {
        roleId,
        permissionId,
      },
      update: {},
    });
  }
}

export const rbacSeed: SeedRunner = async (prisma: PrismaClient): Promise<void> => {
  const permissionIds = await upsertPermissions(prisma);
  const allPermissionNames = PERMISSIONS_CATALOG.map((item) => item.name);

  await syncRolePermissions(
    prisma,
    SYSTEM_ROLE_IDS[ERoleIdentifier.USER],
    USER_PERMISSIONS,
    permissionIds,
  );
  await syncRolePermissions(
    prisma,
    SYSTEM_ROLE_IDS[ERoleIdentifier.ADMIN],
    ADMIN_PERMISSIONS,
    permissionIds,
  );
  await syncRolePermissions(
    prisma,
    SYSTEM_ROLE_IDS[ERoleIdentifier.SUPER_ADMIN],
    allPermissionNames,
    permissionIds,
  );
  await syncRolePermissions(
    prisma,
    SYSTEM_ROLE_IDS[ERoleIdentifier.API_CLIENT],
    API_CLIENT_PERMISSIONS,
    permissionIds,
  );
};
