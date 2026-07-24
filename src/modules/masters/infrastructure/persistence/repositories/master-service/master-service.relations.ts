import {
  IMAGE_FILE_SELECT_FIELDS,
  IMAGE_SELECT_FIELDS,
} from 'src/modules/masters/domain/entities/image';
import { MASTER_SERVICE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service/master-service-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const MASTER_SERVICE_RELATIONS: Record<string, RelationConfig> = {
  masterProfile: {
    allowedSelectFields: [
      'id',
      'userId',
      'displayName',
      'description',
      'rating',
      'timezone',
      'bookingStatus',
      'pausedUntil',
      'minNoticeMinutes',
      'maxBookingDaysAhead',
      'slotStepMinutes',
      'bufferBetweenAppointmentsMinutes',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
  images: {
    virtual: true,
    allowedSelectFields: [...IMAGE_SELECT_FIELDS],
    nested: {
      file: {
        allowedSelectFields: [...IMAGE_FILE_SELECT_FIELDS],
      },
    },
  },
};

export const MASTER_SERVICE_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: MASTER_SERVICE_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: MASTER_SERVICE_RELATIONS,
};
