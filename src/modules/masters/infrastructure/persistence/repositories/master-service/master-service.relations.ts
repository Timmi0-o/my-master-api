import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const MASTER_SERVICE_RELATIONS: Record<string, RelationConfig> = {
  masterProfile: {
    allowedSelectFields: [
      'id',
      'userId',
      'displayName',
      'description',
      'rating',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
};
