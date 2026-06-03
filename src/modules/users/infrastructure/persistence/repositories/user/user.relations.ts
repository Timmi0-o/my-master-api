import { USER_SELECT_FIELDS } from 'src/modules/users/domain/entities/user/user-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const USER_RELATIONS: Record<string, RelationConfig> = {};

export const USER_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: USER_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: USER_RELATIONS,
};
