import { MASTER_SERVICE_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service/master-service-select-fields';
import { MASTER_SERVICE_REVIEW_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-service-review/master-service-review-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const MASTER_SERVICE_REVIEW_RELATIONS: Record<string, RelationConfig> = {
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
  clientUser: {
    allowedSelectFields: ['id', 'username', 'name', 'surname', 'patronymic'],
  },
  appointment: {
    allowedSelectFields: [
      'id',
      'masterProfileId',
      'masterServiceId',
      'clientUserId',
      'startsAt',
      'durationMinutes',
      'status',
      'totalPrice',
      'serviceName',
      'cancelledAt',
      'cancelledBy',
      'cancelReason',
      'isEarlyCompletionByMaster',
      'isEarlyCompletionByClient',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
};

export const MASTER_SERVICE_REVIEW_VALIDATION_CONFIG: ReadOptionsValidationConfig =
  {
    allowedSelectFields: MASTER_SERVICE_REVIEW_SELECT_FIELDS,
    maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
    includeGraph: MASTER_SERVICE_REVIEW_RELATIONS,
  };
