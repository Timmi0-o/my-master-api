import { JSONSchemaType } from 'ajv';
import { FILTER_UUID_ARRAY_MAX_ITEMS } from 'src/constants';
import type { IGetUsersInput } from 'src/modules/users/application/use-cases/user/get-users.input';
import { USER_LIST_ORDER_FIELDS } from 'src/modules/users/application/use-cases/user/get-users.input';

import {
  idSchema,
  limitSchema,
  pageSchema,
  presetSchema,
} from '../common.schemas';
import { userFiltersPresetSchema } from './user-filters-preset.schema';

export type IGetUsersQueryDto = Omit<IGetUsersInput, 'isStaffUser'>;

export const getUsersQuerySchema: JSONSchemaType<IGetUsersQueryDto> = {
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
