import { EPermissionCategory } from '../entities/permission';
import { Permissions } from './permission-names';

type TPermissionCatalogItem = {
  name: string;
  description: string;
  category: EPermissionCategory;
};

function catalogForResource(
  resourceLabel: string,
  actions: Record<string, string>,
  category: EPermissionCategory,
): TPermissionCatalogItem[] {
  return Object.entries(actions).map(([action, name]) => ({
    name,
    description: `${action.charAt(0).toUpperCase()}${action.slice(1)} ${resourceLabel}`,
    category,
  }));
}

export const PERMISSIONS_CATALOG: readonly TPermissionCatalogItem[] = [
  ...catalogForResource('users', Permissions.users, EPermissionCategory.USER),
  ...catalogForResource('user profiles', Permissions.userProfiles, EPermissionCategory.USER),
  ...catalogForResource('masters', Permissions.masters, EPermissionCategory.MASTER),
  ...catalogForResource('master profiles', Permissions.masterProfiles, EPermissionCategory.MASTER),
  ...catalogForResource('master services', Permissions.masterServices, EPermissionCategory.MASTER),
  ...catalogForResource(
    'master weekly schedules',
    Permissions.masterWeeklySchedules,
    EPermissionCategory.MASTER,
  ),
  ...catalogForResource(
    'master schedule exceptions',
    Permissions.masterScheduleExceptions,
    EPermissionCategory.MASTER,
  ),
  ...catalogForResource('appointments', Permissions.appointments, EPermissionCategory.APPOINTMENT),
  ...catalogForResource(
    'appointment chats',
    Permissions.appointmentChats,
    EPermissionCategory.APPOINTMENT,
  ),
  ...catalogForResource(
    'appointment chat messages',
    Permissions.appointmentChatMessages,
    EPermissionCategory.APPOINTMENT,
  ),
  ...catalogForResource('files', Permissions.files, EPermissionCategory.FILE),
  ...catalogForResource('folders', Permissions.folders, EPermissionCategory.FILE),
  ...catalogForResource('RBAC', Permissions.rbac, EPermissionCategory.RBAC),
] as const;

export type TPermissionCatalogEntry = (typeof PERMISSIONS_CATALOG)[number];
