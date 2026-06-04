import { MASTER_SCHEDULE_EXCEPTION_SELECT_FIELDS } from 'src/modules/masters/domain/entities/master-schedule-exception/master-schedule-exception-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const MASTER_SCHEDULE_EXCEPTION_RELATIONS: Record<
  string,
  RelationConfig
> = {
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
};

export const MASTER_SCHEDULE_EXCEPTION_VALIDATION_CONFIG: ReadOptionsValidationConfig =
  {
    allowedSelectFields: MASTER_SCHEDULE_EXCEPTION_SELECT_FIELDS,
    maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
    includeGraph: MASTER_SCHEDULE_EXCEPTION_RELATIONS,
  };
