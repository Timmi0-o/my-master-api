import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const MASTER_PROFILE_RELATIONS: Record<string, RelationConfig> = {
  services: {
    allowedSelectFields: [
      'id',
      'name',
      'description',
      'price',
      'masterProfileId',
      'createdAt',
      'updatedAt',
    ],
  },
};
