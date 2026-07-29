import { JSONSchemaType } from 'ajv';
import type { IAppointmentChatFiltersPreset } from '../types/appointment-chat-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterUuidArraySchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const appointmentChatFiltersPresetSchema: JSONSchemaType<IAppointmentChatFiltersPreset> =
  {
    type: 'object',
    properties: {
      id: { ...filterUuidArraySchema, nullable: true },
      masterProfileId: { ...filterUuidArraySchema, nullable: true },
      clientUserId: { ...filterUuidArraySchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
