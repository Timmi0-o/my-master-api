import type { IUserProfilePublicEntity } from './i-user-profile.entity';

export const USER_PROFILE_SELECT_FIELDS = [
  'id',
  'userId',
  'displayName',
  'rating',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IUserProfilePublicEntity)[];
