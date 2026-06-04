import { JSONSchemaType } from 'ajv';
import { EMasterScheduleExceptionKind } from 'src/modules/masters/domain/entities/master-schedule-exception';
import type { IMasterScheduleExceptionFiltersPreset } from '../types/master-schedule-exception-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterEnumArraySchema,
  filterUuidArraySchema,
  textSearchFilterPresetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const masterScheduleExceptionFiltersPresetSchema: JSONSchemaType<IMasterScheduleExceptionFiltersPreset> =
  {
    type: 'object',
    properties: {
      search: { ...textSearchFilterPresetSchema, nullable: true },
      id: { ...filterUuidArraySchema, nullable: true },
      masterProfileId: { ...filterUuidArraySchema, nullable: true },
      kind: {
        ...filterEnumArraySchema(Object.values(EMasterScheduleExceptionKind)),
        nullable: true,
      },
      startsAt: { ...dateRangeArrayFilterSchema, nullable: true },
      endsAt: { ...dateRangeArrayFilterSchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
