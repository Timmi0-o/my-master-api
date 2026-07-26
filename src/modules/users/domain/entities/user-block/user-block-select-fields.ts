import type { IUserBlockPublicEntity } from './i-user-block.entity';

export const USER_BLOCK_SELECT_FIELDS = [
  'id',
  'blockerUserId',
  'blockedUserId',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IUserBlockPublicEntity)[];
