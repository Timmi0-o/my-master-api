import { JSONSchemaType } from 'ajv';
import { FILTER_UUID_ARRAY_MAX_ITEMS } from 'src/constants';
import {
  idSchema,
  limitSchema,
  pageSchema,
  presetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetAppointmentChatMessagesQueryPayload } from './get-appointment-chat-messages-query.types';
import { APPOINTMENT_CHAT_MESSAGE_LIST_ORDER_FIELDS } from './get-appointment-chat-messages-query.types';
import { appointmentChatMessageFiltersPresetSchema } from './appointment-chat-message-filters-preset.schema';

export const getAppointmentChatMessagesQuerySchema: JSONSchemaType<IGetAppointmentChatMessagesQueryPayload> =
  {
    type: 'object',
    properties: {
      preset: { ...presetSchema, nullable: true },
      limit: limitSchema,
      page: pageSchema,
      orderField: {
        type: 'string',
        enum: [...APPOINTMENT_CHAT_MESSAGE_LIST_ORDER_FIELDS],
        nullable: true,
      },
      orderDir: {
        type: 'string',
        enum: ['asc', 'desc'],
        nullable: true,
      },
      filter: { ...appointmentChatMessageFiltersPresetSchema, nullable: true },
      requiredIds: {
        type: 'array',
        items: idSchema,
        nullable: true,
        maxItems: FILTER_UUID_ARRAY_MAX_ITEMS,
      },
    },
    required: [],
    additionalProperties: false,
  };
