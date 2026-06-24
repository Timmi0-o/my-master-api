import { ROLE_SELECT_FIELDS } from 'src/modules/authorization/domain/entities/role/role-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from '@shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from '@shared/infrastructure/persistence/repositories/base/config/relation.config';

export const ROLE_RELATIONS: Record<string, RelationConfig> = {};

export const ROLE_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: ROLE_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: ROLE_RELATIONS,
};
