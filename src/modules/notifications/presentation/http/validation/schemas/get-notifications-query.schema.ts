import { JSONSchemaType } from 'ajv';
import { FILTER_UUID_ARRAY_MAX_ITEMS } from 'src/constants';
import {
  idSchema,
  limitSchema,
  pageSchema,
  presetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';
import type { IGetNotificationsQueryPayload } from './get-notifications-query.types';
import { NOTIFICATION_LIST_ORDER_FIELDS } from './get-notifications-query.types';
import { notificationFiltersPresetSchema } from './notification-filters-preset.schema';

export const getNotificationsQuerySchema: JSONSchemaType<IGetNotificationsQueryPayload> =
  {
    type: 'object',
    properties: {
      preset: { ...presetSchema, nullable: true },
      limit: limitSchema,
      page: pageSchema,
      orderField: {
        type: 'string',
        enum: [...NOTIFICATION_LIST_ORDER_FIELDS],
        nullable: true,
      },
      orderDir: {
        type: 'string',
        enum: ['asc', 'desc'],
        nullable: true,
      },
      filter: { ...notificationFiltersPresetSchema, nullable: true },
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
