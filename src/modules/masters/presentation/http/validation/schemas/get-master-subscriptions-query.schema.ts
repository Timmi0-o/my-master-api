import { JSONSchemaType } from 'ajv';
import { FILTER_UUID_ARRAY_MAX_ITEMS } from 'src/constants';
import {
  idSchema,
  limitSchema,
  pageSchema,
  presetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetMasterSubscriptionsQueryPayload } from './get-master-subscriptions-query.types';
import { MASTER_SUBSCRIPTION_LIST_ORDER_FIELDS } from './get-master-subscriptions-query.types';
import { masterSubscriptionFiltersPresetSchema } from './master-subscription-filters-preset.schema';

export const getMasterSubscriptionsQuerySchema: JSONSchemaType<IGetMasterSubscriptionsQueryPayload> =
  {
    type: 'object',
    properties: {
      preset: { ...presetSchema, nullable: true },
      limit: limitSchema,
      page: pageSchema,
      orderField: {
        type: 'string',
        enum: [...MASTER_SUBSCRIPTION_LIST_ORDER_FIELDS],
        nullable: true,
      },
      orderDir: {
        type: 'string',
        enum: ['asc', 'desc'],
        nullable: true,
      },
      filter: { ...masterSubscriptionFiltersPresetSchema, nullable: true },
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
