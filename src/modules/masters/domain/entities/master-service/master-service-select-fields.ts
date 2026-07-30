import type { IMasterServicePublicEntity } from './i-master-service.entity';

export const MASTER_SERVICE_SELECT_FIELDS = [
  'id',
  'masterProfileId',
  'name',
  'description',
  'price',
  'durationMinutes',
  'category',
  'tags',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const satisfies readonly (keyof IMasterServicePublicEntity)[];

export const MASTER_SERVICE_STAFF_ONLY_FIELDS = [
  'deletedAt',
] as const satisfies readonly (keyof IMasterServicePublicEntity)[];
