import { JSONSchemaType } from 'ajv';
import type { IAppointmentChatMessageFiltersPreset } from '../types/appointment-chat-message-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterUuidArraySchema,
  textSearchFilterPresetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const appointmentChatMessageFiltersPresetSchema: JSONSchemaType<IAppointmentChatMessageFiltersPreset> =
  {
    type: 'object',
    properties: {
      search: { ...textSearchFilterPresetSchema, nullable: true },
      id: { ...filterUuidArraySchema, nullable: true },
      chatId: { ...filterUuidArraySchema, nullable: true },
      senderUserId: { ...filterUuidArraySchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
