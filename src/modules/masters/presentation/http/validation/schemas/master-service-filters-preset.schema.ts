import { JSONSchemaType } from 'ajv';
import type { IMasterServiceFiltersPreset } from '../types/master-service-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterStringArraySchema,
  filterUuidArraySchema,
  numberRangeArrayFilterSchema,
  textSearchFilterPresetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const masterServiceFiltersPresetSchema: JSONSchemaType<IMasterServiceFiltersPreset> =
  {
    type: 'object',
    properties: {
      search: { ...textSearchFilterPresetSchema, nullable: true },
      id: { ...filterUuidArraySchema, nullable: true },
      masterProfileId: { ...filterUuidArraySchema, nullable: true },
      name: { ...filterStringArraySchema, nullable: true },
      price: { ...numberRangeArrayFilterSchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
