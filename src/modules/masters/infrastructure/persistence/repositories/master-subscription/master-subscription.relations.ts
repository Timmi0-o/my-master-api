import { MASTER_PROFILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-profile/master-profile-select-fields';
import { MASTER_SUBSCRIPTION_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-subscription/master-subscription-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const MASTER_SUBSCRIPTION_RELATIONS: Record<string, RelationConfig> = {
  user: {
    allowedSelectFields: ['id', 'username', 'name', 'surname', 'patronymic'],
  },
  masterProfile: {
    allowedSelectFields: [...MASTER_PROFILE_SELECT_FIELDS],
  },
};

export const MASTER_SUBSCRIPTION_VALIDATION_CONFIG: ReadOptionsValidationConfig =
  {
    allowedSelectFields: MASTER_SUBSCRIPTION_SELECT_FIELDS,
    maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
    includeGraph: MASTER_SUBSCRIPTION_RELATIONS,
  };
