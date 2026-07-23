import { JSONSchemaType } from 'ajv';
import type { IMasterSubscriptionFiltersPreset } from '../types/master-subscription-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterUuidArraySchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const masterSubscriptionFiltersPresetSchema: JSONSchemaType<IMasterSubscriptionFiltersPreset> =
  {
    type: 'object',
    properties: {
      id: { ...filterUuidArraySchema, nullable: true },
      userId: { ...filterUuidArraySchema, nullable: true },
      masterProfileId: { ...filterUuidArraySchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
