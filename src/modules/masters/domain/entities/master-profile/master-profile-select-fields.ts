import type { IMasterProfilePublicEntity } from './i-master-profile-entity';

export const MASTER_PROFILE_SELECT_FIELDS = [
  'id',
  'userId',
  'displayName',
  'description',
  'rating',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IMasterProfilePublicEntity & string)[];
