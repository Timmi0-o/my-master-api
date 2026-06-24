import type { IPermissionEntity } from 'src/modules/authorization/domain/entities/permission';
import type { PermissionRow } from './permission.row.types';

export function mapPermissionRow(row: PermissionRow): IPermissionEntity {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
