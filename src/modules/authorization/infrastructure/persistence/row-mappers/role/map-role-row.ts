import type { IRoleEntity } from 'src/modules/authorization/domain/entities/role';
import type { RoleRow } from './role.row.types';

export function mapRoleRow(row: RoleRow): IRoleEntity {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    roleIdentifier: row.roleIdentifier,
    isActive: row.isActive,
    isSystem: row.isSystem,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
