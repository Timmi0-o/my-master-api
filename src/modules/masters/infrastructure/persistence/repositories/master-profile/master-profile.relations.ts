import { MASTER_PROFILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-profile/master-profile-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
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

export const MASTER_PROFILE_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: MASTER_PROFILE_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: MASTER_PROFILE_RELATIONS,
};
