import { MASTER_PROFILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-profile/master-profile-select-fields';
import {
  IMAGE_FILE_SELECT_FIELDS,
  IMAGE_SELECT_FIELDS,
} from 'src/modules/masters/domain/entities/image';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const MASTER_PROFILE_RELATIONS: Record<string, RelationConfig> = {
  avatar: {
    virtual: true,
    allowedSelectFields: [...IMAGE_SELECT_FIELDS],
    nested: {
      file: {
        allowedSelectFields: [...IMAGE_FILE_SELECT_FIELDS],
      },
    },
  },
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
    nested: {
      images: {
        virtual: true,
        allowedSelectFields: [...IMAGE_SELECT_FIELDS],
        nested: {
          file: {
            allowedSelectFields: [...IMAGE_FILE_SELECT_FIELDS],
          },
        },
      },
    },
  },
};

export const MASTER_PROFILE_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: MASTER_PROFILE_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: MASTER_PROFILE_RELATIONS,
};
