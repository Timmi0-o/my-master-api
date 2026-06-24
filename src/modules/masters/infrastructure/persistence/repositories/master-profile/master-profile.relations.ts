import { MASTER_PROFILE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-profile/master-profile-select-fields';
import { MASTER_SERVICE_IMAGE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service-image/master-service-image-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

const MASTER_SERVICE_IMAGE_FILE_SELECT_FIELDS = [
  'id',
  'fileUrl',
  'originalName',
  'mimeType',
  'fileType',
  'purpose',
  'accessLevel',
  'status',
  'fileSize',
  'createdAt',
  'updatedAt',
] as const;

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
    nested: {
      images: {
        allowedSelectFields: [...MASTER_SERVICE_IMAGE_SELECT_FIELDS],
        nested: {
          file: {
            allowedSelectFields: [...MASTER_SERVICE_IMAGE_FILE_SELECT_FIELDS],
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
