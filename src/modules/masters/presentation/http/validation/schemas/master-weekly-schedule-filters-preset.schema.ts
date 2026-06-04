import { JSONSchemaType } from 'ajv';
import { EDayOfWeek } from 'src/modules/masters/domain/entities/master-weekly-schedule';
import type { IMasterWeeklyScheduleFiltersPreset } from '../types/master-weekly-schedule-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterEnumArraySchema,
  filterStringArraySchema,
  filterUuidArraySchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const masterWeeklyScheduleFiltersPresetSchema: JSONSchemaType<IMasterWeeklyScheduleFiltersPreset> =
  {
    type: 'object',
    properties: {
      id: { ...filterUuidArraySchema, nullable: true },
      masterProfileId: { ...filterUuidArraySchema, nullable: true },
      dayOfWeek: {
        ...filterEnumArraySchema(Object.values(EDayOfWeek)),
        nullable: true,
      },
      startTime: { ...filterStringArraySchema, nullable: true },
      endTime: { ...filterStringArraySchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
