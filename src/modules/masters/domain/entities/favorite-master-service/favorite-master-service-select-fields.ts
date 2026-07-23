import type { IFavoriteMasterServicePublicEntity } from './i-favorite-master-service.entity';

export const FAVORITE_MASTER_SERVICE_SELECT_FIELDS = [
  'id',
  'userId',
  'masterServiceId',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IFavoriteMasterServicePublicEntity)[];
