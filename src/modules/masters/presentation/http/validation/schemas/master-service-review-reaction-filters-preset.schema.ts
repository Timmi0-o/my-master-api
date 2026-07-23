import { JSONSchemaType } from 'ajv';
import { EMasterServiceReviewReactionType } from 'src/modules/masters/domain/entities/master-service-review-reaction';
import type { IMasterServiceReviewReactionFiltersPreset } from '../types/master-service-review-reaction-filters-preset.types';
import {
  dateRangeArrayFilterSchema,
  filterEnumArraySchema,
  filterUuidArraySchema,
} from 'src/modules/shared/presentation/http/validation/schemas/filter-preset.schemas';

export const masterServiceReviewReactionFiltersPresetSchema: JSONSchemaType<IMasterServiceReviewReactionFiltersPreset> =
  {
    type: 'object',
    properties: {
      id: { ...filterUuidArraySchema, nullable: true },
      userId: { ...filterUuidArraySchema, nullable: true },
      masterServiceReviewId: { ...filterUuidArraySchema, nullable: true },
      type: {
        ...filterEnumArraySchema(
          Object.values(EMasterServiceReviewReactionType),
        ),
        nullable: true,
      },
      createdAt: { ...dateRangeArrayFilterSchema, nullable: true },
      updatedAt: { ...dateRangeArrayFilterSchema, nullable: true },
      deletedAt: { ...dateRangeArrayFilterSchema, nullable: true },
    },
    required: [],
    additionalProperties: false,
  };
