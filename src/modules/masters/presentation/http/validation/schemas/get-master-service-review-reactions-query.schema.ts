import { JSONSchemaType } from 'ajv';
import { FILTER_UUID_ARRAY_MAX_ITEMS } from 'src/constants';
import {
  idSchema,
  limitSchema,
  pageSchema,
  presetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetMasterServiceReviewReactionsQueryPayload } from './get-master-service-review-reactions-query.types';
import { MASTER_SERVICE_REVIEW_REACTION_LIST_ORDER_FIELDS } from './get-master-service-review-reactions-query.types';
import { masterServiceReviewReactionFiltersPresetSchema } from './master-service-review-reaction-filters-preset.schema';

export const getMasterServiceReviewReactionsQuerySchema: JSONSchemaType<IGetMasterServiceReviewReactionsQueryPayload> =
  {
    type: 'object',
    properties: {
      preset: { ...presetSchema, nullable: true },
      limit: limitSchema,
      page: pageSchema,
      orderField: {
        type: 'string',
        enum: [...MASTER_SERVICE_REVIEW_REACTION_LIST_ORDER_FIELDS],
        nullable: true,
      },
      orderDir: {
        type: 'string',
        enum: ['asc', 'desc'],
        nullable: true,
      },
      filter: {
        ...masterServiceReviewReactionFiltersPresetSchema,
        nullable: true,
      },
      requiredIds: {
        type: 'array',
        items: idSchema,
        nullable: true,
        maxItems: FILTER_UUID_ARRAY_MAX_ITEMS,
      },
    },
    required: [],
    additionalProperties: false,
  };
