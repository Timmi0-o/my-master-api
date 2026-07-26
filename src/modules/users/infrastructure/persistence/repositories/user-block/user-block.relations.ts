import { USER_BLOCK_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-block/user-block-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

const USER_BLOCK_USER_SELECT_FIELDS = [
  'id',
  'username',
  'name',
  'surname',
  'patronymic',
] as const;

export const USER_BLOCK_RELATIONS: Record<string, RelationConfig> = {
  blocker: {
    allowedSelectFields: [...USER_BLOCK_USER_SELECT_FIELDS],
  },
  blocked: {
    allowedSelectFields: [...USER_BLOCK_USER_SELECT_FIELDS],
  },
};

export const USER_BLOCK_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: USER_BLOCK_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: USER_BLOCK_RELATIONS,
};
