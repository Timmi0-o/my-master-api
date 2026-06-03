import type { IUserPublicEntity } from './i-user-entity';

export const USER_SELECT_FIELDS = [
  'id',
  'email',
  'phone',
  'username',
  'role',
  'status',
  'language',
  'name',
  'surname',
  'patronymic',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IUserPublicEntity & string)[];
