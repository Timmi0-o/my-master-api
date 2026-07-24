import type { IImageEntity } from './i-image.entity';

export const IMAGE_SELECT_FIELDS = [
  'id',
  'entityType',
  'entityId',
  'fileId',
  'createdAt',
  'updatedAt',
] as const satisfies readonly (keyof IImageEntity)[];
