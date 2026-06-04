import { APPOINTMENT_CHAT_MESSAGE_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat-message/appointment-chat-message-select-fields';
import { APPOINTMENT_CHAT_SELECT_FIELDS } from 'src/modules/appointments/domain/entities/appointment-chat/appointment-chat-select-fields';
import { USER_SELECT_FIELDS } from 'src/modules/users/domain/entities/user/user-select-fields';
import {
  DEFAULT_MAX_INCLUDE_DEPTH,
  type ReadOptionsValidationConfig,
} from 'src/modules/shared/infrastructure/persistence/repositories/base/config/read-validation.config';
import type { RelationConfig } from 'src/modules/shared/infrastructure/persistence/repositories/base/config/relation.config';

export const APPOINTMENT_CHAT_MESSAGE_RELATIONS: Record<string, RelationConfig> = {
  chat: {
    allowedSelectFields: [...APPOINTMENT_CHAT_SELECT_FIELDS],
  },
  sender: {
    allowedSelectFields: [...USER_SELECT_FIELDS],
  },
};

export const APPOINTMENT_CHAT_MESSAGE_VALIDATION_CONFIG: ReadOptionsValidationConfig = {
  allowedSelectFields: APPOINTMENT_CHAT_MESSAGE_SELECT_FIELDS,
  maxIncludeDepth: DEFAULT_MAX_INCLUDE_DEPTH,
  includeGraph: APPOINTMENT_CHAT_MESSAGE_RELATIONS,
};
