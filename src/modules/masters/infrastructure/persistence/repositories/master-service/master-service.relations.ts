import { MASTER_SERVICE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service/master-service-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
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

export const MASTER_SERVICE_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: MASTER_SERVICE_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: MASTER_SERVICE_RELATIONS,
};
