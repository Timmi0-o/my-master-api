import { JSONSchemaType } from 'ajv';
import type { IFavoriteMasterServiceFiltersPreset } from '../types/favorite-master-service-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterUuidArraySchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const favoriteMasterServiceFiltersPresetSchema: JSONSchemaType<IFavoriteMasterServiceFiltersPreset> =
  {
    type: 'object',
    properties: {
      id: { ...filterUuidArraySchema, nullable: true },
      userId: { ...filterUuidArraySchema, nullable: true },
      masterServiceId: { ...filterUuidArraySchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
