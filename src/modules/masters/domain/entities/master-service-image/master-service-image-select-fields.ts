import type { IMasterServiceImageEntity } from './i-master-service-image.entity';

export const MASTER_SERVICE_IMAGE_SELECT_FIELDS = [
  'id',
  'masterServiceId',
  'fileId',
  'createdAt',
  'updatedAt',
] as const satisfies readonly (keyof IMasterServiceImageEntity)[];
