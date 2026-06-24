import type { IRolePublicEntity } from './i-role.entity';

export const ROLE_SELECT_FIELDS = [
  'id',
  'name',
  'description',
  'roleIdentifier',
  'isActive',
  'isSystem',
  'createdAt',
  'updatedAt',
] as const satisfies readonly (keyof IRolePublicEntity)[];
