import type { IUserPublicEntity } from './i-user.entity';

export const USER_SELECT_FIELDS = [
  'id',
  'email',
  'phone',
  'username',
  'roleId',
  'status',
  'language',
  'name',
  'surname',
  'patronymic',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IUserPublicEntity)[];
