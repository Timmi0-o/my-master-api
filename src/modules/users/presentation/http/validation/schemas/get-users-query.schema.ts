import { JSONSchemaType } from 'ajv';
import { FILTER_UUID_ARRAY_MAX_ITEMS } from 'src/constants';
import {
  idSchema,
  limitSchema,
  pageSchema,
  presetSchema,
} from 'src/modules/shared/presentation/http/validation/schemas/common.schemas';

import type { IGetUsersQueryPayload } from './get-users-query.types';
import { USER_LIST_ORDER_FIELDS } from './get-users-query.types';
import { userFiltersPresetSchema } from './user-filters-preset.schema';

export const getUsersQuerySchema: JSONSchemaType<IGetUsersQueryPayload> = {
  type: 'object',
  properties: {
    preset: { ...presetSchema, nullable: true },
    limit: limitSchema,
    page: pageSchema,
    orderField: {
      type: 'string',
      enum: [...USER_LIST_ORDER_FIELDS],
      nullable: true,
    },
    orderDir: {
      type: 'string',
      enum: ['asc', 'desc'],
      nullable: true,
    },
    filter: { ...userFiltersPresetSchema, nullable: true },
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
