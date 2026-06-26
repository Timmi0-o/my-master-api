import { JSONSchemaType } from 'ajv';
import type { IMasterServiceReviewFiltersPreset } from '../types/master-service-review-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterUuidArraySchema,
  numberRangeArrayFilterSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const masterServiceReviewFiltersPresetSchema: JSONSchemaType<IMasterServiceReviewFiltersPreset> =
  {
    type: 'object',
    properties: {
      id: { ...filterUuidArraySchema, nullable: true },
      masterServiceId: { ...filterUuidArraySchema, nullable: true },
      clientUserId: { ...filterUuidArraySchema, nullable: true },
      appointmentId: { ...filterUuidArraySchema, nullable: true },
      rating: { ...numberRangeArrayFilterSchema, nullable: true },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
