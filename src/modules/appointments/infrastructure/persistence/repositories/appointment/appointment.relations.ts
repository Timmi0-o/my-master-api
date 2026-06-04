import { APPOINTMENT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment/appointment-select-fields';
import { USER_SELECT_FIELDS } from 'src/modules/users/domain/entities/user/user-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const APPOINTMENT_RELATIONS: Record<string, RelationConfig> = {
  masterProfile: {
    allowedSelectFields: [
      'id',
      'userId',
      'displayName',
      'description',
      'rating',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
  masterService: {
    allowedSelectFields: [
      'id',
      'masterProfileId',
      'name',
      'description',
      'price',
      'durationMinutes',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
  },
  clientUser: {
    allowedSelectFields: [...USER_SELECT_FIELDS],
  },
  chat: {
    allowedSelectFields: ['id', 'appointmentId', 'createdAt', 'updatedAt', 'deletedAt'],
  },
};

export const APPOINTMENT_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: APPOINTMENT_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: APPOINTMENT_RELATIONS,
};
