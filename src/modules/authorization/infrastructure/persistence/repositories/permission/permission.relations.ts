import { PERMISSION_SELECT_FIELDS } from 'src/modules/authorization/domain/entities/permission/permission-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from '@shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from '@shared/infrastructure/persistence/repositories/base/config/relation.config';

export const PERMISSION_RELATIONS: Record<string, RelationConfig> = {};

export const PERMISSION_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: PERMISSION_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: PERMISSION_RELATIONS,
};
