import type { PermissionRow } from '../permission/permission.row.types';
import type { RoleRow } from '../role/role.row.types';

export type RolePermissionRow = {
  id: string;
  roleId: string;
  permissionId: string;
  createdAt: Date;
  updatedAt: Date;
  permission?: PermissionRow;
  role?: RoleRow;
};
