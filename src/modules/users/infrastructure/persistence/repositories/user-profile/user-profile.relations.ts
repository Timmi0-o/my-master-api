import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';
import { USER_PROFILE_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-profile/user-profile--select-fields';

export const USER_PROFILE_RELATIONS: Record<string, RelationConfig> = {};

export const USER_PROFILE_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: USER_PROFILE_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: USER_PROFILE_RELATIONS,
};
