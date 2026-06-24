import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from '@shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from '@shared/infrastructure/persistence/repositories/base/config/relation.config';
import { FILE_SELECT_FIELDS } from 'src/modules/files/domain/entities/file/file-select-fields';

export const FILE_RELATIONS: Record<string, RelationConfig> = {};

export const FILE_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: FILE_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: FILE_RELATIONS,
};
