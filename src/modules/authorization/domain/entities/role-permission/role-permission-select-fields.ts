import type { IPermissionPublicEntity } from '../permission';
import type { IRolePublicEntity } from '../role';
import type { IRolePermissionPublicEntity } from './i-role-permission.entity';

export const ROLE_PERMISSION_SELECT_FIELDS = [
  'id',
  'roleId',
  'permissionId',
  'createdAt',
  'updatedAt',
] as const satisfies readonly (keyof IRolePermissionPublicEntity)[];

export interface IRolePermissionRelations {
  permission?: IPermissionPublicEntity;
  role?: IRolePublicEntity;
}
