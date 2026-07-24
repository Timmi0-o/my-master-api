import { APPOINTMENT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment/appointment-select-fields';
import {
  IMAGE_FILE_SELECT_FIELDS,
  IMAGE_SELECT_FIELDS,
} from 'src/modules/masters/domain/entities/image';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';
import { USER_SELECT_FIELDS } from 'src/modules/users/domain/entities/user/user-select-fields';
import { USER_PROFILE_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-profile/user-profile--select-fields';

const MASTER_PROFILE_AVATAR_NESTED: RelationConfig = {
  virtual: true,
  allowedSelectFields: [...IMAGE_SELECT_FIELDS],
  nested: {
    file: {
      allowedSelectFields: [...IMAGE_FILE_SELECT_FIELDS],
    },
  },
};

const CLIENT_USER_PROFILE_NESTED: RelationConfig = {
  allowedSelectFields: [...USER_PROFILE_SELECT_FIELDS],
  nested: {
    avatar: {
      virtual: true,
      allowedSelectFields: [...IMAGE_SELECT_FIELDS],
      nested: {
        file: {
          allowedSelectFields: [...IMAGE_FILE_SELECT_FIELDS],
        },
      },
    },
  },
};

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
    nested: {
      avatar: MASTER_PROFILE_AVATAR_NESTED,
    },
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
    nested: {
      userProfile: CLIENT_USER_PROFILE_NESTED,
    },
  },
  chat: {
    allowedSelectFields: [
      'id',
      'appointmentId',
      'createdAt',
      'updatedAt',
      'deletedAt',
    ],
    nested: {
      messages: {
        allowedSelectFields: [
          'id',
          'chatId',
          'senderUserId',
          'body',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
      },
    },
  },
};

export const APPOINTMENT_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: APPOINTMENT_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: APPOINTMENT_RELATIONS,
};
