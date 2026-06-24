import type {
  IRolePermissionEntity,
  IRolePermissionRelations,
} from 'src/modules/authorization/domain/entities/role-permission';
import type { ReadResult } from '@shared/domain/query';
import { mapPermissionRow } from '../permission/map-permission-row';
import { mapRoleRow } from '../role/map-role-row';
import type { RolePermissionRow } from './role-permission.row.types';

export function mapRolePermissionRow(
  row: RolePermissionRow,
): ReadResult<IRolePermissionEntity, IRolePermissionRelations> {
  const entity: IRolePermissionEntity & Partial<IRolePermissionRelations> = {
    id: row.id,
    roleId: row.roleId,
    permissionId: row.permissionId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };

  if (row.permission) {
    entity.permission = mapPermissionRow(row.permission);
  }

  if (row.role) {
    entity.role = mapRoleRow(row.role);
  }

  return entity;
}
