import { MASTER_SERVICE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service/master-service-select-fields';
import { FAVORITE_MASTER_SERVICE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/favorite-master-service/favorite-master-service-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const FAVORITE_MASTER_SERVICE_RELATIONS: Record<string, RelationConfig> =
  {
    user: {
      allowedSelectFields: ['id', 'username', 'name', 'surname', 'patronymic'],
    },
    masterService: {
      allowedSelectFields: [...MASTER_SERVICE_SELECT_FIELDS],
      nested: {
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
      },
    },
  };

export const FAVORITE_MASTER_SERVICE_VALIDATION_CONFIG: ReadOptionsValidationConfig =
  {
    allowedSelectFields: FAVORITE_MASTER_SERVICE_SELECT_FIELDS,
    maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
    includeGraph: FAVORITE_MASTER_SERVICE_RELATIONS,
  };
