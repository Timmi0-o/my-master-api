import { APPOINTMENT_CHAT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat/appointment-chat-select-fields';
import { APPOINTMENT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment/appointment-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

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
