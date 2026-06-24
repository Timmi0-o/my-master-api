import type { IPermissionPublicEntity } from './i-permission.entity';

export const PERMISSION_SELECT_FIELDS = [
  'id',
  'name',
  'description',
  'category',
  'createdAt',
  'updatedAt',
] as const satisfies readonly (keyof IPermissionPublicEntity)[];
