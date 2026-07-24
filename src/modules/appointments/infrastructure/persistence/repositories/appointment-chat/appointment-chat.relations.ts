import { APPOINTMENT_CHAT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat/appointment-chat-select-fields';
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
import { USER_PROFILE_SELECT_FIELDS } from 'src/modules/users/domain/entities/user-profile/user-profile--select-fields';

export const APPOINTMENT_CHAT_RELATIONS: Record<string, RelationConfig> = {
  appointment: {
    allowedSelectFields: [...APPOINTMENT_SELECT_FIELDS],
    nested: {
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
      },
      clientUser: {
        allowedSelectFields: [
          'id',
          'email',
          'phone',
          'username',
          'name',
          'surname',
          'patronymic',
          'createdAt',
          'updatedAt',
          'deletedAt',
        ],
        nested: {
          userProfile: {
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
          },
        },
      },
    },
  },
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
};

export const APPOINTMENT_CHAT_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: APPOINTMENT_CHAT_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: APPOINTMENT_CHAT_RELATIONS,
};
