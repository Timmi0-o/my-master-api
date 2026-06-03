import { JSONSchemaType } from 'ajv';
import type { IMasterProfileFiltersPreset } from '../types/master-profile-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterStringArraySchema,
  filterUuidArraySchema,
  numberRangeArrayFilterSchema,
  textSearchFilterPresetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const masterProfileFiltersPresetSchema: JSONSchemaType<IMasterProfileFiltersPreset> =
  {
    type: 'object',
    properties: {
      search: { ...textSearchFilterPresetSchema, nullable: true },
      id: { ...filterUuidArraySchema, nullable: true },
      userId: { ...filterUuidArraySchema, nullable: true },
      displayName: { ...filterStringArraySchema, nullable: true },
      rating: { ...numberRangeArrayFilterSchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
