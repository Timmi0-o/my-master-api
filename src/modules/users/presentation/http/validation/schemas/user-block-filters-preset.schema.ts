import { JSONSchemaType } from 'ajv';
import type { IUserBlockFiltersPreset } from '../types/user-block-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterUuidArraySchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const userBlockFiltersPresetSchema: JSONSchemaType<IUserBlockFiltersPreset> =
  {
    type: 'object',
    properties: {
      id: { ...filterUuidArraySchema, nullable: true },
      blockerUserId: { ...filterUuidArraySchema, nullable: true },
      blockedUserId: { ...filterUuidArraySchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
