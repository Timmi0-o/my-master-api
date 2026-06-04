import { JSONSchemaType } from 'ajv';
import {
  EAppointmentStatus,
} from 'src/modules/appointments/domain/entities/appointment/appointment.enum';
import type { IAppointmentFiltersPreset } from '../types/appointment-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterEnumArraySchema,
  filterStringArraySchema,
  filterUuidArraySchema,
  textSearchFilterPresetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const appointmentFiltersPresetSchema: JSONSchemaType<IAppointmentFiltersPreset> =
  {
    type: 'object',
    properties: {
      search: { ...textSearchFilterPresetSchema, nullable: true },
      id: { ...filterUuidArraySchema, nullable: true },
      masterProfileId: { ...filterUuidArraySchema, nullable: true },
      masterServiceId: { ...filterUuidArraySchema, nullable: true },
      clientUserId: { ...filterUuidArraySchema, nullable: true },
      status: {
        ...filterEnumArraySchema(Object.values(EAppointmentStatus)),
        nullable: true,
      },
      startsAt: { ...dateRangeArrayFilterSchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
