import { PERMISSION_SELECT_FIELDS } from 'src/modules/authorization/domain/entities/permission/permission-select-fields';
import { ROLE_SELECT_FIELDS } from 'src/modules/authorization/domain/entities/role/role-select-fields';
import { ROLE_PERMISSION_SELECT_FIELDS } from 'src/modules/authorization/domain/entities/role-permission/role-permission-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from '@shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from '@shared/infrastructure/persistence/repositories/base/config/relation.config';

export const ROLE_PERMISSION_RELATIONS: Record<string, RelationConfig> = {
  permission: {
    allowedSelectFields: PERMISSION_SELECT_FIELDS,
  },
  role: {
    allowedSelectFields: ROLE_SELECT_FIELDS,
  },
};

export const ROLE_PERMISSION_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: ROLE_PERMISSION_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: ROLE_PERMISSION_RELATIONS,
};
